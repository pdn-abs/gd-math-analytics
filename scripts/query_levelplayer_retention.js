const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
	projectId: 'gd-math-71c48',
	keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
	location: 'asia-south1'
});

// D1 / D7 / D30 retention for users who played at least one level,
// split by: all level players, post-drops, pre-drops (small sample caveat).
// "Played a level" = fired at least one segmentStarted event in the window.
const q = `
WITH version_grp AS (
  SELECT DISTINCT
    user_pseudo_id,
    CASE
      WHEN app_info.version IN ('v4.3.0','v4.3.2','v4.3.7')   THEN 'pre_drops'
      WHEN app_info.version IN ('v4.3.12','v4.3.15','v4.3.19') THEN 'post_drops'
      ELSE 'other'
    END AS grp
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
  QUALIFY ROW_NUMBER() OVER (
    PARTITION BY user_pseudo_id ORDER BY event_timestamp ASC
  ) = 1
),
level_players AS (
  SELECT DISTINCT user_pseudo_id
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name = 'segmentStarted'
),
first_day AS (
  SELECT user_pseudo_id, MIN(PARSE_DATE('%Y%m%d', _TABLE_SUFFIX)) AS cohort_date
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
  GROUP BY user_pseudo_id
),
active_days AS (
  SELECT DISTINCT
    user_pseudo_id,
    PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) AS active_date
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
),
cohort AS (
  SELECT
    lp.user_pseudo_id,
    COALESCE(vg.grp, 'other') AS grp,
    fd.cohort_date
  FROM level_players lp
  JOIN first_day   fd USING (user_pseudo_id)
  LEFT JOIN version_grp vg USING (user_pseudo_id)
),
retention AS (
  SELECT
    grp,
    COUNT(DISTINCT user_pseudo_id)                                           AS total,
    -- D1
    COUNT(DISTINCT CASE
      WHEN cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 1 DAY)
      THEN user_pseudo_id END)                                               AS d1_eligible,
    COUNT(DISTINCT CASE
      WHEN EXISTS (
        SELECT 1 FROM active_days a
        WHERE a.user_pseudo_id = cohort.user_pseudo_id
          AND a.active_date = DATE_ADD(cohort.cohort_date, INTERVAL 1 DAY)
      ) AND cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 1 DAY)
      THEN user_pseudo_id END)                                               AS d1_ret,
    -- D7
    COUNT(DISTINCT CASE
      WHEN cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 7 DAY)
      THEN user_pseudo_id END)                                               AS d7_eligible,
    COUNT(DISTINCT CASE
      WHEN EXISTS (
        SELECT 1 FROM active_days a
        WHERE a.user_pseudo_id = cohort.user_pseudo_id
          AND a.active_date = DATE_ADD(cohort.cohort_date, INTERVAL 7 DAY)
      ) AND cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 7 DAY)
      THEN user_pseudo_id END)                                               AS d7_ret,
    -- D30
    COUNT(DISTINCT CASE
      WHEN cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 30 DAY)
      THEN user_pseudo_id END)                                               AS d30_eligible,
    COUNT(DISTINCT CASE
      WHEN EXISTS (
        SELECT 1 FROM active_days a
        WHERE a.user_pseudo_id = cohort.user_pseudo_id
          AND a.active_date = DATE_ADD(cohort.cohort_date, INTERVAL 30 DAY)
      ) AND cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 30 DAY)
      THEN user_pseudo_id END)                                               AS d30_ret
  FROM cohort
  GROUP BY grp
),
-- add an "all level players" aggregate row
merged AS (
  SELECT grp, total, d1_eligible, d1_ret, d7_eligible, d7_ret, d30_eligible, d30_ret
  FROM retention
  UNION ALL
  SELECT 'all_level_players', SUM(total),
    SUM(d1_eligible), SUM(d1_ret),
    SUM(d7_eligible), SUM(d7_ret),
    SUM(d30_eligible), SUM(d30_ret)
  FROM retention
)
SELECT
  grp,
  total,
  d1_eligible, d1_ret,
  ROUND(100.0 * d1_ret  / NULLIF(d1_eligible,  0), 1) AS d1_pct,
  d7_eligible, d7_ret,
  ROUND(100.0 * d7_ret  / NULLIF(d7_eligible,  0), 1) AS d7_pct,
  d30_eligible, d30_ret,
  ROUND(100.0 * d30_ret / NULLIF(d30_eligible, 0), 1) AS d30_pct
FROM merged
ORDER BY CASE grp
  WHEN 'all_level_players' THEN 0
  WHEN 'post_drops'        THEN 1
  WHEN 'pre_drops'         THEN 2
  ELSE 3
END
`;

(async () => {
	const [rows] = await bq.query({query: q, location: 'asia-south1'});
	const pad  = (s, n) => String(s).padStart(n);
	const padL = (s, n) => String(s).padEnd(n);
	console.log('\n━━━ Retention — Users Who Played ≥1 Level ━━━\n');
	console.log(
		padL('Group', 20),
		pad('Total', 7),
		pad('D1-el', 7), pad('D1-ret', 8), pad('D1%', 7),
		pad('D7-el', 7), pad('D7-ret', 8), pad('D7%', 7),
		pad('D30-el', 8), pad('D30-ret', 9), pad('D30%', 7),
	);
	console.log('─'.repeat(105));
	for (const r of rows) {
		console.log(
			padL(r.grp, 20),
			pad(r.total,       7),
			pad(r.d1_eligible, 7),  pad(r.d1_ret,  8), pad(r.d1_pct  + '%', 7),
			pad(r.d7_eligible, 7),  pad(r.d7_ret,  8), pad(r.d7_pct  + '%', 7),
			pad(r.d30_eligible, 8), pad(r.d30_ret, 9), pad(r.d30_pct + '%', 7),
		);
	}
	console.log('\nNote: pre_drops only has 12 users in the Jan 25–Mar 25 BQ window.');
	console.log('      The Oct–Dec 2025 pre-drops cohort is outside the BQ export range.');
})();
