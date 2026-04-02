const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
  projectId: 'gd-math-71c48',
  keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
  location: 'asia-south1'
});

const q = `
WITH first_day AS (
  -- GA4 anchor: first_open fires on true install day; excludes pre-window installs
  SELECT user_pseudo_id,
    MIN(PARSE_DATE('%Y%m%d', _TABLE_SUFFIX)) AS first_date
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name = 'first_open'
  GROUP BY user_pseudo_id
),
-- pivot params per event occurrence
pivoted AS (
  SELECT
    user_pseudo_id,
    event_name,
    event_timestamp,
    MAX(IF(p.key='status', p.value.string_value, NULL)) AS status
  FROM \`gd-math-71c48.analytics_441470574.events_*\`,
       UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name IN ('segmentStarted','segmentCompleted','segmentDropped')
  GROUP BY user_pseudo_id, event_name, event_timestamp
),
user_totals AS (
  SELECT
    user_pseudo_id,
    COUNT(CASE WHEN event_name='segmentStarted' THEN 1 END) AS starts,
    COUNT(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN 1 END) AS fails,
    COUNT(CASE WHEN event_name='segmentDropped' THEN 1 END) AS drops
  FROM pivoted
  GROUP BY user_pseudo_id
),
user_buckets AS (
  SELECT
    u.user_pseudo_id,
    CASE
      WHEN (u.fails + u.drops) / NULLIF(u.starts, 0) >= 0.8 THEN '4 High failure (>=80%)'
      WHEN (u.fails + u.drops) / NULLIF(u.starts, 0) >= 0.5 THEN '3 Mid failure (50-79%)'
      WHEN (u.fails + u.drops) / NULLIF(u.starts, 0) >= 0.2 THEN '2 Low failure (20-49%)'
      ELSE                                                        '1 Very low (<20%)'
    END AS bucket
  FROM user_totals u
  WHERE u.starts >= 5
),
returned_d1 AS (
  SELECT DISTINCT e.user_pseudo_id
  FROM \`gd-math-71c48.analytics_441470574.events_*\` e
  JOIN first_day f USING (user_pseudo_id)
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) = DATE_ADD(f.first_date, INTERVAL 1 DAY)
)
SELECT
  bucket,
  COUNT(DISTINCT b.user_pseudo_id) AS users,
  COUNT(DISTINCT r.user_pseudo_id) AS returned_d1,
  ROUND(COUNT(DISTINCT r.user_pseudo_id) / COUNT(DISTINCT b.user_pseudo_id) * 100, 1) AS d1_retention_pct
FROM user_buckets b
LEFT JOIN returned_d1 r USING (user_pseudo_id)
GROUP BY bucket
ORDER BY bucket
`;

bq.query(q).then(([rows]) => {
  const padL = (s, n) => String(s).padEnd(n);
  const pad  = (s, n) => String(s).padStart(n);
  console.log('\n━━━ D1 Retention by Failure Experience ━━━\n');
  console.log(padL('Bucket', 28), pad('Users',7), pad('Returned D1',12), pad('D1 Ret%',8));
  console.log('─'.repeat(57));
  for (const r of rows) {
    const label = r.bucket.replace(/^\d /, '');
    console.log(padL(label, 28), pad(r.users,7), pad(r.returned_d1,12), pad(r.d1_retention_pct+'%',8));
  }
}).catch(e => console.error(e.message));
