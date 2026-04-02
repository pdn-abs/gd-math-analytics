const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
	projectId: 'gd-math-71c48',
	keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
	location: 'asia-south1'
});

// D1 / D7 / D30 retention split by skill age (currentSkillAge) — GA4 methodology.
//
// GA4 methodology:
//   Cohort anchor = user_first_touch_timestamp (true install date, always present
//     on every event row — unlike first_open which only appears once and may be
//     outside the export window for pre-window installs).
//   Only users who installed within the BQ export window are included.
//   Skill age = currentSkillAge param from the user's FIRST segmentStarted event
//     (matches GA4's CurrentSkillAge dimension at cohort entry).
//   Denominator = D0-eligible users for each window (cohort_date ≤ window_end - N).
//   Retention = user active on exactly day N (exact-day, matching GA4 UI).

const q = `
WITH cohort AS (
  -- GA4 anchor: user_first_touch_timestamp is the true install timestamp,
  -- present on every event row regardless of when the event was exported.
  -- Filter to only users who installed within the observation window.
  SELECT
    user_pseudo_id,
    DATE(TIMESTAMP_MICROS(MIN(user_first_touch_timestamp))) AS cohort_date
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
  GROUP BY user_pseudo_id
  HAVING cohort_date BETWEEN '2026-01-25' AND '2026-03-25'
),
skill_age_per_user AS (
  -- currentSkillAge from the first segmentStarted event each user ever fired
  SELECT user_pseudo_id, skill_age
  FROM (
    SELECT
      user_pseudo_id,
      event_timestamp,
      MAX(IF(p.key = 'currentSkillAge', p.value.string_value, NULL)) AS skill_age
    FROM \`gd-math-71c48.analytics_441470574.events_*\`,
         UNNEST(event_params) AS p
    WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
      AND event_name = 'segmentStarted'
    GROUP BY user_pseudo_id, event_timestamp
    QUALIFY ROW_NUMBER() OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp ASC) = 1
  )
),
active_days AS (
  SELECT DISTINCT
    user_pseudo_id,
    PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) AS active_date
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
),
joined AS (
  SELECT
    c.user_pseudo_id,
    s.skill_age,
    c.cohort_date,
    DATE_ADD(c.cohort_date, INTERVAL  1 DAY) AS d1_date,
    DATE_ADD(c.cohort_date, INTERVAL  7 DAY) AS d7_date,
    DATE_ADD(c.cohort_date, INTERVAL 30 DAY) AS d30_date
  FROM cohort c
  -- INNER JOIN: excludes users who never started a level
  JOIN skill_age_per_user s USING (user_pseudo_id)
),
retention AS (
  SELECT
    j.skill_age,
    COUNT(DISTINCT j.user_pseudo_id)                                     AS total_users,
    -- D1
    COUNT(DISTINCT CASE
      WHEN j.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL  1 DAY)
      THEN j.user_pseudo_id END)                                         AS d1_eligible,
    COUNT(DISTINCT CASE
      WHEN j.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL  1 DAY)
        AND a1.user_pseudo_id IS NOT NULL
      THEN j.user_pseudo_id END)                                         AS d1_returned,
    -- D7
    COUNT(DISTINCT CASE
      WHEN j.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL  7 DAY)
      THEN j.user_pseudo_id END)                                         AS d7_eligible,
    COUNT(DISTINCT CASE
      WHEN j.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL  7 DAY)
        AND a7.user_pseudo_id IS NOT NULL
      THEN j.user_pseudo_id END)                                         AS d7_returned,
    -- D30
    COUNT(DISTINCT CASE
      WHEN j.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 30 DAY)
      THEN j.user_pseudo_id END)                                         AS d30_eligible,
    COUNT(DISTINCT CASE
      WHEN j.cohort_date <= DATE_SUB(DATE '2026-03-25', INTERVAL 30 DAY)
        AND a30.user_pseudo_id IS NOT NULL
      THEN j.user_pseudo_id END)                                         AS d30_returned
  FROM joined j
  LEFT JOIN active_days a1
    ON j.user_pseudo_id = a1.user_pseudo_id AND a1.active_date = j.d1_date
  LEFT JOIN active_days a7
    ON j.user_pseudo_id = a7.user_pseudo_id AND a7.active_date = j.d7_date
  LEFT JOIN active_days a30
    ON j.user_pseudo_id = a30.user_pseudo_id AND a30.active_date = j.d30_date
  GROUP BY j.skill_age
),
total_row AS (
  SELECT
    'ALL' AS skill_age,
    SUM(total_users)  AS total_users,
    SUM(d1_eligible)  AS d1_eligible,  SUM(d1_returned)  AS d1_returned,
    SUM(d7_eligible)  AS d7_eligible,  SUM(d7_returned)  AS d7_returned,
    SUM(d30_eligible) AS d30_eligible, SUM(d30_returned) AS d30_returned
  FROM retention
)
SELECT
  skill_age,
  total_users,
  d1_eligible,  d1_returned,
  ROUND(100.0 * d1_returned  / NULLIF(d1_eligible,  0), 1) AS d1_pct,
  d7_eligible,  d7_returned,
  ROUND(100.0 * d7_returned  / NULLIF(d7_eligible,  0), 1) AS d7_pct,
  d30_eligible, d30_returned,
  ROUND(100.0 * d30_returned / NULLIF(d30_eligible, 0), 1) AS d30_pct
FROM (
  SELECT * FROM retention
  UNION ALL
  SELECT * FROM total_row
)
ORDER BY
  CASE skill_age WHEN 'ALL' THEN 0 WHEN 'unknown' THEN 99 ELSE CAST(SPLIT(skill_age, ' ')[OFFSET(0)] AS INT64) END
`;

(async () => {
	const [rows] = await bq.query({query: q, location: 'asia-south1'});
	const pad  = (s, n) => String(s).padStart(n);
	const padL = (s, n) => String(s).padEnd(n);
	const pct  = (v) => v === null ? '—' : v + '%';
	console.log('\n━━━ D1 / D7 / D30 Retention by Skill Age ━━━\n');
	console.log(
		padL('Skill Age', 10),
		pad('D0 users', 10),
		pad('D1 active', 10), pad('D1 denom', 10), pad('D1 ret%', 9),
		pad('D7 active', 10), pad('D7 denom', 10), pad('D7 ret%', 9),
		pad('D30 active', 11), pad('D30 denom', 10), pad('D30 ret%', 9),
	);
	console.log('─'.repeat(120));
	for (const r of rows) {
		const label = r.skill_age === 'ALL' ? 'ALL'
			: r.skill_age === 'unknown' ? 'unknown'
			: r.skill_age.replace(' Y', 'Y');
		console.log(
			padL(label,           10),
			pad(r.total_users,    10),
			pad(r.d1_returned,    10), pad(r.d1_eligible,  10), pad(pct(r.d1_pct),  9),
			pad(r.d7_returned,    10), pad(r.d7_eligible,  10), pad(pct(r.d7_pct),  9),
			pad(r.d30_returned,   11), pad(r.d30_eligible, 10), pad(pct(r.d30_pct), 9),
		);
	}
	console.log('\nNote: Only users who started ≥1 level are included (skill age known).');
	console.log('      Denominator is D0-eligible installs (user_first_touch_timestamp anchor).');
	console.log('      Small cohorts (7Y, 8Y, 9Y) may show 0% at D7/D30 due to exact-day counting.');
})();
