const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
  projectId: 'gd-math-71c48',
  keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
  location: 'asia-south1'
});

// ── 1. Failure rates by skill age ──────────────────────────────────────────
const q1 = `
WITH base AS (
  SELECT
    user_pseudo_id,
    event_name,
    MAX(IF(p.key='currentSkillAge', p.value.string_value, NULL)) AS skill_age,
    MAX(IF(p.key='status',          p.value.string_value, NULL)) AS status,
    MAX(IF(p.key='wrongMoves',      p.value.int_value,    NULL)) AS wrong_moves
  FROM \`gd-math-71c48.analytics_441470574.events_*\`,
       UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name IN ('segmentStarted','segmentCompleted','segmentDropped')
  GROUP BY user_pseudo_id, event_name, event_timestamp
)
SELECT
  skill_age,
  COUNT(CASE WHEN event_name='segmentStarted'                    THEN 1 END) AS started,
  COUNT(CASE WHEN event_name='segmentCompleted' AND status='pass' THEN 1 END) AS passed,
  COUNT(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN 1 END) AS failed,
  COUNT(CASE WHEN event_name='segmentDropped'                    THEN 1 END) AS dropped,
  COUNT(DISTINCT CASE WHEN event_name='segmentCompleted' AND status='fail' THEN user_pseudo_id END) AS users_with_fail,
  COUNT(DISTINCT CASE WHEN event_name='segmentDropped'           THEN user_pseudo_id END) AS users_who_dropped,
  ROUND(AVG(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN wrong_moves END), 1) AS avg_wrong_on_fail,
  ROUND(AVG(CASE WHEN event_name='segmentCompleted' AND status='pass' THEN wrong_moves END), 1) AS avg_wrong_on_pass
FROM base
WHERE skill_age IS NOT NULL
GROUP BY skill_age
ORDER BY CAST(REGEXP_EXTRACT(skill_age, r'^([0-9]+)') AS INT64)
`;

// ── 2. Top levels by failure+drop rate (min 20 starts) ────────────────────
const q2 = `
WITH base AS (
  SELECT
    user_pseudo_id,
    event_name,
    MAX(IF(p.key='level',           p.value.string_value, NULL)) AS level,
    MAX(IF(p.key='branch',          p.value.string_value, NULL)) AS branch,
    MAX(IF(p.key='currentSkillAge', p.value.string_value, NULL)) AS skill_age,
    MAX(IF(p.key='status',          p.value.string_value, NULL)) AS status,
    MAX(IF(p.key='wrongMoves',      p.value.int_value,    NULL)) AS wrong_moves
  FROM \`gd-math-71c48.analytics_441470574.events_*\`,
       UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name IN ('segmentStarted','segmentCompleted','segmentDropped')
  GROUP BY user_pseudo_id, event_name, event_timestamp
),
agg AS (
  SELECT
    level, branch, skill_age,
    COUNT(DISTINCT user_pseudo_id) AS users,
    COUNT(CASE WHEN event_name='segmentStarted'                     THEN 1 END) AS started,
    COUNT(CASE WHEN event_name='segmentCompleted' AND status='pass'  THEN 1 END) AS passed,
    COUNT(CASE WHEN event_name='segmentCompleted' AND status='fail'  THEN 1 END) AS failed,
    COUNT(CASE WHEN event_name='segmentDropped'                      THEN 1 END) AS dropped,
    ROUND(AVG(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN wrong_moves END), 1) AS avg_wrong_on_fail
  FROM base
  WHERE level IS NOT NULL AND skill_age IS NOT NULL
  GROUP BY level, branch, skill_age
)
SELECT *,
  ROUND((failed + dropped) / NULLIF(started, 0) * 100, 1) AS fail_drop_pct
FROM agg
WHERE started >= 20
ORDER BY fail_drop_pct DESC
LIMIT 25
`;

// ── 3. Retention by failure experience ────────────────────────────────────
const q3 = `
WITH first_day AS (
  SELECT user_pseudo_id,
    MIN(PARSE_DATE('%Y%m%d', _TABLE_SUFFIX)) AS first_date
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
  GROUP BY user_pseudo_id
),
user_fail_rate AS (
  SELECT
    e.user_pseudo_id,
    COUNT(CASE WHEN e.event_name='segmentCompleted'
               AND MAX(IF(p.key='status', p.value.string_value, NULL)) = 'fail' THEN 1 END) AS fails,
    COUNT(CASE WHEN e.event_name='segmentDropped' THEN 1 END) AS drops,
    COUNT(CASE WHEN e.event_name='segmentStarted' THEN 1 END) AS starts
  FROM \`gd-math-71c48.analytics_441470574.events_*\` e,
       UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND e.event_name IN ('segmentStarted','segmentCompleted','segmentDropped')
  GROUP BY e.user_pseudo_id, e.event_timestamp
),
user_totals AS (
  SELECT user_pseudo_id,
    SUM(fails) AS total_fails,
    SUM(drops) AS total_drops,
    SUM(starts) AS total_starts
  FROM user_fail_rate
  GROUP BY user_pseudo_id
),
user_buckets AS (
  SELECT
    u.user_pseudo_id,
    u.total_starts,
    ROUND((u.total_fails + u.total_drops) / NULLIF(u.total_starts, 0) * 100, 0) AS fail_pct,
    CASE
      WHEN (u.total_fails + u.total_drops) / NULLIF(u.total_starts, 0) >= 0.8 THEN 'High failure (≥80%)'
      WHEN (u.total_fails + u.total_drops) / NULLIF(u.total_starts, 0) >= 0.5 THEN 'Mid failure (50–79%)'
      WHEN (u.total_fails + u.total_drops) / NULLIF(u.total_starts, 0) >= 0.2 THEN 'Low failure (20–49%)'
      ELSE 'Very low failure (<20%)'
    END AS bucket
  FROM user_totals u
  WHERE u.total_starts >= 5
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
ORDER BY
  CASE bucket
    WHEN 'Very low failure (<20%)' THEN 1
    WHEN 'Low failure (20–49%)' THEN 2
    WHEN 'Mid failure (50–79%)' THEN 3
    WHEN 'High failure (≥80%)' THEN 4
  END
`;

async function run() {
  const pad  = (s, n) => String(s).padStart(n);
  const padL = (s, n) => String(s).padEnd(n);

  // ── 1. By skill age ──────────────────────────────────────────────────────
  console.log('\n━━━ 1. Failure & Drop Rates by Skill Age ━━━\n');
  console.log(padL('Age',5), pad('Started',8), pad('Pass',6), pad('Fail',6), pad('Drop',6),
    pad('Fail%',6), pad('Drop%',6), pad('F+D%',6), pad('FailUsers',10), pad('AvgWrongFail',13));
  console.log('─'.repeat(80));

  const [r1] = await bq.query(q1);
  for (const r of r1) {
    const failPct = (r.failed / r.started * 100).toFixed(1);
    const dropPct = (r.dropped / r.started * 100).toFixed(1);
    const fdPct   = ((r.failed + r.dropped) / r.started * 100).toFixed(1);
    console.log(
      padL(r.skill_age, 5), pad(r.started,8), pad(r.passed,6), pad(r.failed,6), pad(r.dropped,6),
      pad(failPct+'%',6), pad(dropPct+'%',6), pad(fdPct+'%',6),
      pad(r.users_with_fail,10), pad(r.avg_wrong_on_fail,13)
    );
  }

  // ── 2. Top levels ────────────────────────────────────────────────────────
  console.log('\n━━━ 2. Top 25 Levels by Failure+Drop Rate (min 20 starts) ━━━\n');
  console.log(padL('Level', 45), padL('Branch',18), pad('Age',5),
    pad('Users',6), pad('Start',6), pad('Pass',5), pad('Fail',5), pad('Drop',5), pad('F+D%',6), pad('AvgWrong',9));
  console.log('─'.repeat(115));

  const [r2] = await bq.query(q2);
  for (const r of r2) {
    console.log(
      padL(String(r.level).slice(0,44), 45),
      padL(String(r.branch).slice(0,17), 18),
      pad(r.skill_age, 5),
      pad(r.users,6), pad(r.started,6), pad(r.passed,5), pad(r.failed,5), pad(r.dropped,5),
      pad(r.fail_drop_pct+'%',6), pad(r.avg_wrong_on_fail,9)
    );
  }

  // ── 3. D1 retention by failure bucket ───────────────────────────────────
  console.log('\n━━━ 3. D1 Retention by Failure Experience ━━━\n');
  console.log(padL('Bucket', 26), pad('Users',7), pad('Returned D1',12), pad('D1 Ret%',8));
  console.log('─'.repeat(55));

  const [r3] = await bq.query(q3);
  for (const r of r3) {
    console.log(padL(r.bucket, 26), pad(r.users,7), pad(r.returned_d1,12), pad(r.d1_retention_pct+'%',8));
  }
}

run().catch(e => console.error(e.message));
