const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
  projectId: 'gd-math-71c48',
  keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
  location: 'asia-south1'
});

// Top levels by fail+drop rate, per skill age, min 10 starts
const q = `
WITH base AS (
  SELECT
    user_pseudo_id,
    event_name,
    event_timestamp,
    MAX(IF(p.key='level',           p.value.string_value, NULL)) AS level,
    MAX(IF(p.key='branch',          p.value.string_value, NULL)) AS branch,
    MAX(IF(p.key='currentSkillAge', p.value.string_value, NULL)) AS skill_age,
    MAX(IF(p.key='status',          p.value.string_value, NULL)) AS status
  FROM \`gd-math-71c48.analytics_441470574.events_*\`,
       UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name IN ('segmentStarted','segmentCompleted','segmentDropped')
  GROUP BY user_pseudo_id, event_name, event_timestamp
),
agg AS (
  SELECT
    skill_age,
    level,
    branch,
    COUNT(DISTINCT user_pseudo_id) AS users,
    COUNT(CASE WHEN event_name='segmentStarted'                    THEN 1 END) AS started,
    COUNT(CASE WHEN event_name='segmentCompleted' AND status='pass' THEN 1 END) AS passed,
    COUNT(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN 1 END) AS failed,
    COUNT(CASE WHEN event_name='segmentDropped'                     THEN 1 END) AS dropped
  FROM base
  WHERE skill_age IS NOT NULL AND level IS NOT NULL
  GROUP BY skill_age, level, branch
),
ranked AS (
  SELECT *,
    ROUND((failed + dropped) / NULLIF(started, 0) * 100, 1) AS fd_pct,
    ROUND(failed / NULLIF(started, 0) * 100, 1) AS fail_pct,
    ROUND(dropped / NULLIF(started, 0) * 100, 1) AS drop_pct,
    ROW_NUMBER() OVER (
      PARTITION BY skill_age
      ORDER BY (failed + dropped) / NULLIF(started, 0) DESC
    ) AS rn
  FROM agg
  WHERE started >= 10
)
SELECT skill_age, level, branch, users, started, passed, failed, dropped, fail_pct, drop_pct, fd_pct
FROM ranked
WHERE rn <= 10
ORDER BY
  CAST(REGEXP_EXTRACT(skill_age, r'^([0-9]+)') AS INT64),
  fd_pct DESC
`;

bq.query(q).then(([rows]) => {
  let curAge = '';
  const padL = (s, n) => String(s).slice(0,n).padEnd(n);
  const pad  = (s, n) => String(s).padStart(n);

  for (const r of rows) {
    if (r.skill_age !== curAge) {
      curAge = r.skill_age;
      console.log(`\n━━━ ${curAge} ━━━`);
      console.log(padL('Level', 46), padL('Branch', 18), pad('Users',6), pad('Start',6),
        pad('Pass',5), pad('Fail',5), pad('Drop',5), pad('Fail%',6), pad('Drop%',6), pad('F+D%',6));
      console.log('─'.repeat(109));
    }
    console.log(
      padL(r.level, 46), padL(r.branch, 18),
      pad(r.users,6), pad(r.started,6),
      pad(r.passed,5), pad(r.failed,5), pad(r.dropped,5),
      pad(r.fail_pct+'%',6), pad(r.drop_pct+'%',6), pad(r.fd_pct+'%',6)
    );
  }
}).catch(e => console.error(e.message));
