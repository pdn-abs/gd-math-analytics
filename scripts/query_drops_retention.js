const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
	projectId: 'gd-math-71c48',
	keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
	location: 'asia-south1'
});

// D1 / D7 / D30 retention split by pre-drops vs post-drops app versions.
// Pre-drops:  v4.3.0, v4.3.2, v4.3.7
// Post-drops: v4.3.12, v4.3.15, v4.3.19
//
// Cohort anchor = first day the user appears in the BQ export on that version.
// A user is counted in whichever group corresponds to their FIRST seen version.
// The full export window (20260125–20260325) is used for follow-up day lookups.

const q = `
WITH version_group AS (
  -- assign each user to a group based on their first-seen version
  SELECT
    user_pseudo_id,
    CASE
      WHEN app_info.version IN ('v4.3.0', 'v4.3.2', 'v4.3.7')
        THEN 'pre_drops'
      WHEN app_info.version IN ('v4.3.12', 'v4.3.15', 'v4.3.19')
        THEN 'post_drops'
    END AS grp
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND app_info.version IN (
      'v4.3.0','v4.3.2','v4.3.7',
      'v4.3.12','v4.3.15','v4.3.19'
    )
  QUALIFY ROW_NUMBER() OVER (
    PARTITION BY user_pseudo_id
    ORDER BY event_timestamp ASC
  ) = 1
),
-- first day per user (within the export window)
first_day AS (
  SELECT
    user_pseudo_id,
    MIN(PARSE_DATE('%Y%m%d', _TABLE_SUFFIX)) AS cohort_date
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
  GROUP BY user_pseudo_id
),
-- days each user was active
active_days AS (
  SELECT DISTINCT
    user_pseudo_id,
    PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) AS active_date
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
),
cohort AS (
  SELECT
    vg.user_pseudo_id,
    vg.grp,
    fd.cohort_date,
    -- only include users whose cohort_date leaves room for follow-up window
    DATE_ADD(fd.cohort_date, INTERVAL 1  DAY) AS d1_date,
    DATE_ADD(fd.cohort_date, INTERVAL 7  DAY) AS d7_date,
    DATE_ADD(fd.cohort_date, INTERVAL 30 DAY) AS d30_date
  FROM version_group vg
  JOIN first_day fd USING (user_pseudo_id)
  WHERE vg.grp IS NOT NULL
),
retention AS (
  SELECT
    c.grp,
    COUNT(DISTINCT c.user_pseudo_id) AS total_users,
    -- D1 cohort: only users whose cohort_date <= max_date - 1
    COUNT(DISTINCT CASE
      WHEN c.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 1 DAY)
        AND a1.user_pseudo_id IS NOT NULL
      THEN c.user_pseudo_id END) AS d1_returned,
    COUNT(DISTINCT CASE
      WHEN c.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 1 DAY)
      THEN c.user_pseudo_id END) AS d1_eligible,
    -- D7
    COUNT(DISTINCT CASE
      WHEN c.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 7 DAY)
        AND a7.user_pseudo_id IS NOT NULL
      THEN c.user_pseudo_id END) AS d7_returned,
    COUNT(DISTINCT CASE
      WHEN c.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 7 DAY)
      THEN c.user_pseudo_id END) AS d7_eligible,
    -- D30
    COUNT(DISTINCT CASE
      WHEN c.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 30 DAY)
        AND a30.user_pseudo_id IS NOT NULL
      THEN c.user_pseudo_id END) AS d30_returned,
    COUNT(DISTINCT CASE
      WHEN c.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 30 DAY)
      THEN c.user_pseudo_id END) AS d30_eligible
  FROM cohort c
  LEFT JOIN active_days a1
    ON c.user_pseudo_id = a1.user_pseudo_id AND a1.active_date = c.d1_date
  LEFT JOIN active_days a7
    ON c.user_pseudo_id = a7.user_pseudo_id AND a7.active_date = c.d7_date
  LEFT JOIN active_days a30
    ON c.user_pseudo_id = a30.user_pseudo_id AND a30.active_date = c.d30_date
  GROUP BY c.grp
)
SELECT
  grp,
  total_users,
  d1_eligible,
  d1_returned,
  ROUND(100.0 * d1_returned / NULLIF(d1_eligible, 0), 1) AS d1_pct,
  d7_eligible,
  d7_returned,
  ROUND(100.0 * d7_returned / NULLIF(d7_eligible, 0), 1) AS d7_pct,
  d30_eligible,
  d30_returned,
  ROUND(100.0 * d30_returned / NULLIF(d30_eligible, 0), 1) AS d30_pct
FROM retention
ORDER BY grp
`;

(async () => {
	const [rows] = await bq.query({query: q, location: 'asia-south1'});
	console.log('\n━━━ Retention by Drops Phase ━━━\n');
	console.log(
		'Group'.padEnd(14),
		'Users'.padStart(7),
		'D1-elig'.padStart(9),
		'D1-ret'.padStart(8),
		'D1%'.padStart(7),
		'D7-elig'.padStart(9),
		'D7-ret'.padStart(8),
		'D7%'.padStart(7),
		'D30-elig'.padStart(10),
		'D30-ret'.padStart(9),
		'D30%'.padStart(7)
	);
	console.log('─'.repeat(105));
	for (const r of rows) {
		console.log(
			r.grp.padEnd(14),
			String(r.total_users).padStart(7),
			String(r.d1_eligible).padStart(9),
			String(r.d1_returned).padStart(8),
			(r.d1_pct + '%').padStart(7),
			String(r.d7_eligible).padStart(9),
			String(r.d7_returned).padStart(8),
			(r.d7_pct + '%').padStart(7),
			String(r.d30_eligible).padStart(10),
			String(r.d30_returned).padStart(9),
			(r.d30_pct + '%').padStart(7)
		);
	}
})();
