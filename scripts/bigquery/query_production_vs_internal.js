// Production vs Internal Testing — All Key Metrics
//
// Runs 10 metric queries for the Jan 25 – Mar 25 2026 window,
// each segmented by app track:
//   production → v4.3.12, v4.3.15, v4.3.19  (builds 65, 68, 72)
//   internal   → v4.3.18, v4.3.20            (builds 71, 73)
//
// Run: node scripts/bigquery/query_production_vs_internal.js

const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const bq = new BigQuery({
  projectId: 'gd-math-71c48',
  keyFilename: path.join(__dirname, '..', '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
  location: 'asia-south1',
});

const RANGE = { start: '20260125', end: '20260325', endDate: '2026-03-25' };
const TABLE = '`gd-math-71c48.analytics_441470574.events_*`';

const TRACK_CTE = `
user_track AS (
  SELECT
    user_pseudo_id,
    CASE
      WHEN app_info.version IN ('v4.3.12','v4.3.15','v4.3.19') THEN 'production'
      WHEN app_info.version IN ('v4.3.18','v4.3.20')           THEN 'internal'
      ELSE 'other'
    END AS track
  FROM ${TABLE}
  WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
  QUALIFY ROW_NUMBER() OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp ASC) = 1
)`;

const pad  = (s, n) => String(s ?? '—').padStart(n);
const padL = (s, n) => String(s ?? '—').padEnd(n);
const pct  = (num, den) => den ? (100 * num / den).toFixed(1) + '%' : '—';

async function run(label, query) {
  process.stdout.write(`\nRunning: ${label} ... `);
  const [rows] = await bq.query({ query, location: 'asia-south1' });
  console.log('done');
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// Q1  User Acquisition & Activity
// ─────────────────────────────────────────────────────────────────────────────
const q1 = `
WITH ${TRACK_CTE}
SELECT
  t.track,
  COUNT(DISTINCT e.user_pseudo_id)                                                AS mau,
  COUNT(DISTINCT CASE WHEN e.event_name='first_open'   THEN e.user_pseudo_id END) AS new_users,
  COUNT(DISTINCT CASE WHEN e.event_name='session_start' THEN e.user_pseudo_id END) AS active_users,
  COUNT(DISTINCT CASE WHEN e.event_name='session_start'
    THEN CONCAT(e.user_pseudo_id,'_',
      (SELECT value.int_value FROM UNNEST(e.event_params) WHERE key='ga_session_id'))
    END)                                                                           AS total_sessions,
  ROUND(COUNT(DISTINCT CASE WHEN e.event_name='session_start'
    THEN CONCAT(e.user_pseudo_id, e.event_date) END) / 60.0, 1)                   AS avg_dau
FROM ${TABLE} e
JOIN user_track t USING (user_pseudo_id)
WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
  AND t.track IN ('production','internal')
GROUP BY t.track
ORDER BY t.track`;

// ─────────────────────────────────────────────────────────────────────────────
// Q2  D1 / D7 / D30 Retention
// ─────────────────────────────────────────────────────────────────────────────
const q2 = `
WITH ${TRACK_CTE},
first_open AS (
  SELECT user_pseudo_id, MIN(PARSE_DATE('%Y%m%d', _TABLE_SUFFIX)) AS cohort_date
  FROM ${TABLE}
  WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
    AND event_name = 'first_open'
  GROUP BY user_pseudo_id
),
active_days AS (
  SELECT DISTINCT user_pseudo_id, PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) AS active_date
  FROM ${TABLE}
  WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
),
cohort AS (
  SELECT f.user_pseudo_id, t.track, f.cohort_date
  FROM first_open f
  JOIN user_track t USING (user_pseudo_id)
  WHERE t.track IN ('production','internal')
)
SELECT
  track,
  COUNT(DISTINCT user_pseudo_id) AS cohort_size,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 1 DAY)
    THEN user_pseudo_id END) AS d1_eligible,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 1 DAY)
    AND EXISTS (SELECT 1 FROM active_days a
      WHERE a.user_pseudo_id=cohort.user_pseudo_id
        AND a.active_date=DATE_ADD(cohort.cohort_date, INTERVAL 1 DAY))
    THEN user_pseudo_id END) AS d1_retained,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 7 DAY)
    THEN user_pseudo_id END) AS d7_eligible,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 7 DAY)
    AND EXISTS (SELECT 1 FROM active_days a
      WHERE a.user_pseudo_id=cohort.user_pseudo_id
        AND a.active_date=DATE_ADD(cohort.cohort_date, INTERVAL 7 DAY))
    THEN user_pseudo_id END) AS d7_retained,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 30 DAY)
    THEN user_pseudo_id END) AS d30_eligible,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 30 DAY)
    AND EXISTS (SELECT 1 FROM active_days a
      WHERE a.user_pseudo_id=cohort.user_pseudo_id
        AND a.active_date=DATE_ADD(cohort.cohort_date, INTERVAL 30 DAY))
    THEN user_pseudo_id END) AS d30_retained
FROM cohort
GROUP BY track
ORDER BY track`;

// ─────────────────────────────────────────────────────────────────────────────
// Q3  Paywall Funnel
// ─────────────────────────────────────────────────────────────────────────────
const q3 = `
WITH ${TRACK_CTE}
SELECT
  t.track,
  COUNT(DISTINCT e.user_pseudo_id)                                                       AS total_users,
  COUNT(DISTINCT CASE WHEN e.event_name='SubscriptionOpened' THEN e.user_pseudo_id END)  AS reached_paywall,
  COUNT(CASE WHEN e.event_name='SubscriptionOpened' THEN 1 END)                          AS paywall_open_events,
  COUNT(DISTINCT CASE WHEN e.event_name='GameSubscription'
    AND (SELECT value.string_value FROM UNNEST(e.event_params) WHERE key='type')='Created'
    THEN e.user_pseudo_id END)                                                           AS completed_purchase
FROM ${TABLE} e
JOIN user_track t USING (user_pseudo_id)
WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
  AND t.track IN ('production','internal')
GROUP BY t.track
ORDER BY t.track`;

// ─────────────────────────────────────────────────────────────────────────────
// Q4  Gameplay / Segment Funnel
// ─────────────────────────────────────────────────────────────────────────────
const q4 = `
WITH ${TRACK_CTE}
SELECT
  t.track,
  COUNT(DISTINCT CASE WHEN e.event_name='LevelLoaded'      THEN e.user_pseudo_id END) AS users_loaded_level,
  COUNT(CASE WHEN e.event_name='LevelLoaded'      THEN 1 END)                         AS level_load_events,
  COUNT(DISTINCT CASE WHEN e.event_name='segmentStarted'   THEN e.user_pseudo_id END) AS users_started_seg,
  COUNT(CASE WHEN e.event_name='segmentStarted'   THEN 1 END)                         AS seg_started,
  COUNT(CASE WHEN e.event_name='segmentCompleted' THEN 1 END)                         AS seg_completed,
  COUNT(CASE WHEN e.event_name='segmentDropped'   THEN 1 END)                         AS seg_dropped,
  COUNT(DISTINCT CASE WHEN e.event_name='segmentCompleted' THEN e.user_pseudo_id END) AS users_completed_seg,
  COUNT(DISTINCT CASE WHEN e.event_name='segmentDropped'   THEN e.user_pseudo_id END) AS users_dropped_seg,
  ROUND(COUNT(CASE WHEN e.event_name='segmentCompleted' THEN 1 END)
    / NULLIF(COUNT(CASE WHEN e.event_name='segmentStarted' THEN 1 END), 0) * 100, 1)  AS seg_completion_pct
FROM ${TABLE} e
JOIN user_track t USING (user_pseudo_id)
WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
  AND t.track IN ('production','internal')
GROUP BY t.track
ORDER BY t.track`;

// ─────────────────────────────────────────────────────────────────────────────
// Q5  App Usage by Skill Age
// ─────────────────────────────────────────────────────────────────────────────
const q5 = `
WITH ${TRACK_CTE},
skill_age_map AS (
  SELECT user_pseudo_id,
    MAX(IF(p.key='currentSkillAge', p.value.string_value, NULL)) AS skill_age
  FROM ${TABLE}, UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
    AND event_name = 'segmentStarted'
  GROUP BY user_pseudo_id
)
SELECT
  t.track,
  sa.skill_age,
  COUNT(DISTINCT e.user_pseudo_id)                                                     AS users,
  COUNT(CASE WHEN e.event_name='LevelLoaded'      THEN 1 END)                          AS total_levels,
  ROUND(COUNT(CASE WHEN e.event_name='LevelLoaded' THEN 1 END)
    / NULLIF(COUNT(DISTINCT e.user_pseudo_id), 0), 1)                                  AS avg_levels_per_user,
  COUNT(CASE WHEN e.event_name='segmentStarted'   THEN 1 END)                          AS seg_started,
  COUNT(CASE WHEN e.event_name='segmentCompleted' THEN 1 END)                          AS seg_completed,
  COUNT(CASE WHEN e.event_name='segmentDropped'   THEN 1 END)                          AS seg_dropped,
  ROUND(COUNT(CASE WHEN e.event_name='segmentCompleted' THEN 1 END)
    / NULLIF(COUNT(CASE WHEN e.event_name='segmentStarted' THEN 1 END), 0) * 100, 1)   AS completion_pct,
  ROUND(COUNT(CASE WHEN e.event_name='segmentStarted' THEN 1 END)
    / NULLIF(COUNT(DISTINCT e.user_pseudo_id), 0), 1)                                  AS avg_seg_per_user
FROM ${TABLE} e
JOIN user_track    t  USING (user_pseudo_id)
JOIN skill_age_map sa USING (user_pseudo_id)
WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
  AND t.track IN ('production','internal')
  AND sa.skill_age IS NOT NULL
GROUP BY t.track, sa.skill_age
ORDER BY t.track,
  CASE WHEN REGEXP_CONTAINS(sa.skill_age, r'^[0-9]')
       THEN CAST(REGEXP_EXTRACT(sa.skill_age, r'^([0-9]+)') AS INT64)
       ELSE 99 END`;

// ─────────────────────────────────────────────────────────────────────────────
// Q6  Retention by Skill Age (level players only)
// ─────────────────────────────────────────────────────────────────────────────
const q6 = `
WITH ${TRACK_CTE},
skill_age_map AS (
  SELECT user_pseudo_id,
    MAX(IF(p.key='currentSkillAge', p.value.string_value, NULL)) AS skill_age
  FROM ${TABLE}, UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
    AND event_name = 'segmentStarted'
  GROUP BY user_pseudo_id
),
first_open AS (
  SELECT user_pseudo_id, MIN(PARSE_DATE('%Y%m%d', _TABLE_SUFFIX)) AS cohort_date
  FROM ${TABLE}
  WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
    AND event_name = 'first_open'
  GROUP BY user_pseudo_id
),
active_days AS (
  SELECT DISTINCT user_pseudo_id, PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) AS active_date
  FROM ${TABLE}
  WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
),
cohort AS (
  SELECT sa.user_pseudo_id, t.track, sa.skill_age, fo.cohort_date
  FROM skill_age_map sa
  JOIN first_open fo USING (user_pseudo_id)
  JOIN user_track  t  USING (user_pseudo_id)
  WHERE t.track IN ('production','internal') AND sa.skill_age IS NOT NULL
)
SELECT
  track, skill_age,
  COUNT(DISTINCT user_pseudo_id) AS users,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 1 DAY)
    THEN user_pseudo_id END) AS d1_eligible,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 1 DAY)
    AND EXISTS (SELECT 1 FROM active_days a
      WHERE a.user_pseudo_id=cohort.user_pseudo_id
        AND a.active_date=DATE_ADD(cohort.cohort_date, INTERVAL 1 DAY))
    THEN user_pseudo_id END) AS d1_retained,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 7 DAY)
    THEN user_pseudo_id END) AS d7_eligible,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 7 DAY)
    AND EXISTS (SELECT 1 FROM active_days a
      WHERE a.user_pseudo_id=cohort.user_pseudo_id
        AND a.active_date=DATE_ADD(cohort.cohort_date, INTERVAL 7 DAY))
    THEN user_pseudo_id END) AS d7_retained,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 30 DAY)
    THEN user_pseudo_id END) AS d30_eligible,
  COUNT(DISTINCT CASE WHEN cohort_date <= DATE_SUB(DATE '${RANGE.endDate}', INTERVAL 30 DAY)
    AND EXISTS (SELECT 1 FROM active_days a
      WHERE a.user_pseudo_id=cohort.user_pseudo_id
        AND a.active_date=DATE_ADD(cohort.cohort_date, INTERVAL 30 DAY))
    THEN user_pseudo_id END) AS d30_retained
FROM cohort
GROUP BY track, skill_age
ORDER BY track,
  CASE WHEN REGEXP_CONTAINS(skill_age, r'^[0-9]')
       THEN CAST(REGEXP_EXTRACT(skill_age, r'^([0-9]+)') AS INT64)
       ELSE 99 END`;

// ─────────────────────────────────────────────────────────────────────────────
// Q7  Failure & Drop by Skill Age
// ─────────────────────────────────────────────────────────────────────────────
const q7 = `
WITH ${TRACK_CTE},
base AS (
  SELECT
    e.user_pseudo_id, t.track, e.event_name,
    MAX(IF(p.key='currentSkillAge', p.value.string_value, NULL)) AS skill_age,
    MAX(IF(p.key='status',          p.value.string_value, NULL)) AS status,
    MAX(IF(p.key='wrongMoves',      p.value.int_value,    NULL)) AS wrong_moves
  FROM ${TABLE} e
  JOIN user_track t USING (user_pseudo_id), UNNEST(e.event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
    AND e.event_name IN ('segmentStarted','segmentCompleted','segmentDropped')
    AND t.track IN ('production','internal')
  GROUP BY e.user_pseudo_id, t.track, e.event_name, e.event_timestamp
)
SELECT
  track, skill_age,
  COUNT(DISTINCT user_pseudo_id)                                                     AS users,
  COUNT(CASE WHEN event_name='segmentStarted'                   THEN 1 END)          AS started,
  COUNT(CASE WHEN event_name='segmentCompleted' AND status='pass' THEN 1 END)        AS passed,
  COUNT(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN 1 END)        AS failed,
  COUNT(CASE WHEN event_name='segmentDropped'                   THEN 1 END)          AS dropped,
  ROUND(COUNT(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN 1 END)
    / NULLIF(COUNT(CASE WHEN event_name='segmentStarted' THEN 1 END), 0)*100, 1)     AS fail_pct,
  ROUND(COUNT(CASE WHEN event_name='segmentDropped' THEN 1 END)
    / NULLIF(COUNT(CASE WHEN event_name='segmentStarted' THEN 1 END), 0)*100, 1)     AS drop_pct,
  ROUND(AVG(CASE WHEN event_name='segmentCompleted' AND status='fail'
    THEN wrong_moves END), 1)                                                        AS avg_wrong_on_fail
FROM base
WHERE skill_age IS NOT NULL
GROUP BY track, skill_age
ORDER BY track,
  CASE WHEN REGEXP_CONTAINS(skill_age, r'^[0-9]')
       THEN CAST(REGEXP_EXTRACT(skill_age, r'^([0-9]+)') AS INT64)
       ELSE 99 END`;

// ─────────────────────────────────────────────────────────────────────────────
// Q8  Top 25 High F+D Levels — Production
// ─────────────────────────────────────────────────────────────────────────────
const q8 = `
WITH ${TRACK_CTE},
base AS (
  SELECT
    e.user_pseudo_id, e.event_name,
    MAX(IF(p.key='level',           p.value.string_value, NULL)) AS level,
    MAX(IF(p.key='branch',          p.value.string_value, NULL)) AS branch,
    MAX(IF(p.key='currentSkillAge', p.value.string_value, NULL)) AS skill_age,
    MAX(IF(p.key='status',          p.value.string_value, NULL)) AS status,
    MAX(IF(p.key='wrongMoves',      p.value.int_value,    NULL)) AS wrong_moves
  FROM ${TABLE} e
  JOIN user_track t USING (user_pseudo_id), UNNEST(e.event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
    AND e.event_name IN ('segmentStarted','segmentCompleted','segmentDropped')
    AND t.track = 'production'
  GROUP BY e.user_pseudo_id, e.event_name, e.event_timestamp
),
agg AS (
  SELECT level, branch, skill_age,
    COUNT(DISTINCT user_pseudo_id)                                                   AS users,
    COUNT(CASE WHEN event_name='segmentStarted'                   THEN 1 END)        AS started,
    COUNT(CASE WHEN event_name='segmentCompleted' AND status='pass' THEN 1 END)      AS passed,
    COUNT(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN 1 END)      AS failed,
    COUNT(CASE WHEN event_name='segmentDropped'                   THEN 1 END)        AS dropped,
    ROUND(AVG(CASE WHEN event_name='segmentCompleted' AND status='fail'
      THEN wrong_moves END), 1)                                                      AS avg_wrong_on_fail
  FROM base
  WHERE level IS NOT NULL AND skill_age IS NOT NULL
  GROUP BY level, branch, skill_age
)
SELECT *, ROUND((failed+dropped)/NULLIF(started,0)*100,1) AS fail_drop_pct
FROM agg WHERE started >= 20
ORDER BY fail_drop_pct DESC LIMIT 25`;

// ─────────────────────────────────────────────────────────────────────────────
// Q9  Onboarding / Assessment Completion
// ─────────────────────────────────────────────────────────────────────────────
const q9 = `
WITH ${TRACK_CTE}
SELECT
  t.track,
  COUNT(DISTINCT e.user_pseudo_id)                                                          AS total_users,
  COUNT(DISTINCT CASE WHEN e.event_name='assessmentCompleted' THEN e.user_pseudo_id END)    AS completed_assessment,
  COUNT(CASE WHEN e.event_name='assessmentCompleted' THEN 1 END)                            AS assessment_events,
  ROUND(COUNT(DISTINCT CASE WHEN e.event_name='assessmentCompleted' THEN e.user_pseudo_id END)
    / NULLIF(COUNT(DISTINCT e.user_pseudo_id), 0)*100, 1)                                   AS assessment_completion_pct
FROM ${TABLE} e
JOIN user_track t USING (user_pseudo_id)
WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
  AND t.track IN ('production','internal')
GROUP BY t.track
ORDER BY t.track`;

// ─────────────────────────────────────────────────────────────────────────────
// Q10  Crash / Stability
// ─────────────────────────────────────────────────────────────────────────────
const q10 = `
WITH ${TRACK_CTE}
SELECT
  t.track,
  COUNT(DISTINCT e.user_pseudo_id)                                                      AS total_users,
  COUNT(CASE WHEN e.event_name='app_exception' THEN 1 END)                              AS crash_events,
  COUNT(DISTINCT CASE WHEN e.event_name='app_exception' THEN e.user_pseudo_id END)      AS users_with_crash,
  ROUND(COUNT(DISTINCT CASE WHEN e.event_name='app_exception' THEN e.user_pseudo_id END)
    / NULLIF(COUNT(DISTINCT e.user_pseudo_id), 0)*100, 2)                               AS crash_rate_pct
FROM ${TABLE} e
JOIN user_track t USING (user_pseudo_id)
WHERE _TABLE_SUFFIX BETWEEN '${RANGE.start}' AND '${RANGE.end}'
  AND t.track IN ('production','internal')
GROUP BY t.track
ORDER BY t.track`;

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n══════════════════════════════════════════════════════════');
  console.log('  Production vs Internal Testing — Jan 25 → Mar 25, 2026');
  console.log('══════════════════════════════════════════════════════════');

  // ── 1. User Acquisition ──────────────────────────────────────────────────
  const r1 = await run('Q1  User Acquisition & Activity', q1);
  console.log('\n━━━ 1. User Acquisition & Activity ━━━\n');
  console.log(padL('Track',12), pad('MAU',6), pad('NewUsers',10), pad('ActiveUsers',13), pad('Sessions',10), pad('AvgDAU',8));
  console.log('─'.repeat(62));
  for (const r of r1) {
    console.log(padL(r.track,12), pad(r.mau,6), pad(r.new_users,10), pad(r.active_users,13), pad(r.total_sessions,10), pad(r.avg_dau,8));
  }

  // ── 2. Retention ─────────────────────────────────────────────────────────
  const r2 = await run('Q2  D1/D7/D30 Retention', q2);
  console.log('\n━━━ 2. D1 / D7 / D30 Retention ━━━\n');
  console.log(padL('Track',12), pad('Cohort',8), pad('D1-el',7), pad('D1-ret',8), pad('D1%',7), pad('D7-el',7), pad('D7-ret',8), pad('D7%',7), pad('D30-el',8), pad('D30-ret',9), pad('D30%',7));
  console.log('─'.repeat(100));
  for (const r of r2) {
    console.log(
      padL(r.track,12),
      pad(r.cohort_size,8),
      pad(r.d1_eligible,7), pad(r.d1_retained,8), pad(pct(r.d1_retained, r.d1_eligible),7),
      pad(r.d7_eligible,7), pad(r.d7_retained,8), pad(pct(r.d7_retained, r.d7_eligible),7),
      pad(r.d30_eligible,8), pad(r.d30_retained,9), pad(pct(r.d30_retained, r.d30_eligible),7),
    );
  }

  // ── 3. Paywall Funnel ─────────────────────────────────────────────────────
  const r3 = await run('Q3  Paywall Funnel', q3);
  console.log('\n━━━ 3. Paywall Funnel ━━━\n');
  console.log(padL('Track',12), pad('TotalUsers',12), pad('ReachedPaywall',16), pad('PaywallEvents',15), pad('Purchases',11));
  console.log('─'.repeat(68));
  for (const r of r3) {
    const reachPct = pct(r.reached_paywall, r.total_users);
    console.log(padL(r.track,12), pad(r.total_users,12), pad(`${r.reached_paywall} (${reachPct})`,16), pad(r.paywall_open_events,15), pad(r.completed_purchase,11));
  }

  // ── 4. Gameplay Funnel ────────────────────────────────────────────────────
  const r4 = await run('Q4  Gameplay Funnel', q4);
  console.log('\n━━━ 4. Gameplay / Segment Funnel ━━━\n');
  console.log(padL('Track',12), pad('LevelUsers',12), pad('LevelLoads',12), pad('SegStarted',12), pad('SegCompleted',14), pad('SegDropped',12), pad('Compl%',8));
  console.log('─'.repeat(86));
  for (const r of r4) {
    console.log(padL(r.track,12), pad(r.users_loaded_level,12), pad(r.level_load_events,12), pad(r.seg_started,12), pad(r.seg_completed,14), pad(r.seg_dropped,12), pad(r.seg_completion_pct+'%',8));
  }

  // ── 5. Usage by Skill Age ─────────────────────────────────────────────────
  const r5 = await run('Q5  App Usage by Skill Age', q5);
  console.log('\n━━━ 5. App Usage by Skill Age ━━━\n');
  for (const track of ['production','internal']) {
    const rows = r5.filter(r => r.track === track);
    if (!rows.length) continue;
    console.log(`  ▸ ${track.toUpperCase()}`);
    console.log('  ' + padL('Age',8) + pad('Users',7) + pad('Levels',8) + pad('Avg Lvl',9) + pad('SegStr',8) + pad('SegCmp',8) + pad('SegDrp',8) + pad('Cmp%',7) + pad('AvgSeg',8));
    console.log('  ' + '─'.repeat(75));
    for (const r of rows) {
      console.log('  ' + padL(r.skill_age,8) + pad(r.users,7) + pad(r.total_levels,8) + pad(r.avg_levels_per_user,9) + pad(r.seg_started,8) + pad(r.seg_completed,8) + pad(r.seg_dropped,8) + pad(r.completion_pct+'%',7) + pad(r.avg_seg_per_user,8));
    }
    console.log();
  }

  // ── 6. Retention by Skill Age ─────────────────────────────────────────────
  const r6 = await run('Q6  Retention by Skill Age (level players)', q6);
  console.log('\n━━━ 6. Retention by Skill Age (Level Players Only) ━━━\n');
  for (const track of ['production','internal']) {
    const rows = r6.filter(r => r.track === track);
    if (!rows.length) continue;
    console.log(`  ▸ ${track.toUpperCase()}`);
    console.log('  ' + padL('Age',8) + pad('Users',7) + pad('D1-el',7) + pad('D1-ret',8) + pad('D1%',7) + pad('D7-el',7) + pad('D7-ret',8) + pad('D7%',7) + pad('D30-el',8) + pad('D30-ret',9) + pad('D30%',7));
    console.log('  ' + '─'.repeat(90));
    for (const r of rows) {
      console.log('  ' +
        padL(r.skill_age,8) + pad(r.users,7) +
        pad(r.d1_eligible,7) + pad(r.d1_retained,8) + pad(pct(r.d1_retained, r.d1_eligible),7) +
        pad(r.d7_eligible,7) + pad(r.d7_retained,8) + pad(pct(r.d7_retained, r.d7_eligible),7) +
        pad(r.d30_eligible,8) + pad(r.d30_retained,9) + pad(pct(r.d30_retained, r.d30_eligible),7)
      );
    }
    console.log();
  }

  // ── 7. Failure & Drop by Skill Age ───────────────────────────────────────
  const r7 = await run('Q7  Failure & Drop by Skill Age', q7);
  console.log('\n━━━ 7. Failure & Drop Analysis by Skill Age ━━━\n');
  for (const track of ['production','internal']) {
    const rows = r7.filter(r => r.track === track);
    if (!rows.length) continue;
    console.log(`  ▸ ${track.toUpperCase()}`);
    console.log('  ' + padL('Age',8) + pad('Users',7) + pad('Started',9) + pad('Passed',8) + pad('Failed',8) + pad('Dropped',9) + pad('Fail%',7) + pad('Drop%',7) + pad('AvgWrong',10));
    console.log('  ' + '─'.repeat(80));
    for (const r of rows) {
      console.log('  ' + padL(r.skill_age,8) + pad(r.users,7) + pad(r.started,9) + pad(r.passed,8) + pad(r.failed,8) + pad(r.dropped,9) + pad(r.fail_pct+'%',7) + pad(r.drop_pct+'%',7) + pad(r.avg_wrong_on_fail,10));
    }
    console.log();
  }

  // ── 8. Top 25 F+D Levels (Production) ────────────────────────────────────
  const r8 = await run('Q8  Top 25 High F+D Levels (production)', q8);
  console.log('\n━━━ 8. Top 25 Levels by Fail+Drop Rate — PRODUCTION only ━━━\n');
  console.log(padL('Level',46) + padL('Branch',18) + pad('Age',5) + pad('Users',6) + pad('Start',7) + pad('Pass',6) + pad('Fail',6) + pad('Drop',6) + pad('F+D%',7) + pad('AvgWrong',10));
  console.log('─'.repeat(118));
  for (const r of r8) {
    console.log(
      padL(String(r.level).slice(0,45),46) + padL(String(r.branch||'').slice(0,17),18) +
      pad(r.skill_age,5) + pad(r.users,6) + pad(r.started,7) + pad(r.passed,6) + pad(r.failed,6) + pad(r.dropped,6) +
      pad(r.fail_drop_pct+'%',7) + pad(r.avg_wrong_on_fail,10)
    );
  }

  // ── 9. Assessment / Onboarding ───────────────────────────────────────────
  const r9 = await run('Q9  Assessment Completion', q9);
  console.log('\n━━━ 9. Onboarding / Assessment Completion ━━━\n');
  console.log(padL('Track',12), pad('TotalUsers',12), pad('Completed',11), pad('AssessEvents',14), pad('Completion%',13));
  console.log('─'.repeat(64));
  for (const r of r9) {
    console.log(padL(r.track,12), pad(r.total_users,12), pad(r.completed_assessment,11), pad(r.assessment_events,14), pad(r.assessment_completion_pct+'%',13));
  }

  // ── 10. Crash / Stability ─────────────────────────────────────────────────
  const r10 = await run('Q10 Crash / Stability', q10);
  console.log('\n━━━ 10. Crash / Stability ━━━\n');
  console.log(padL('Track',12), pad('TotalUsers',12), pad('CrashEvents',13), pad('UsersAffected',15), pad('CrashRate%',12));
  console.log('─'.repeat(66));
  for (const r of r10) {
    console.log(padL(r.track,12), pad(r.total_users,12), pad(r.crash_events,13), pad(r.users_with_crash,15), pad(r.crash_rate_pct+'%',12));
  }

  console.log('\n══════════════════════════════════════════════════════════');
  console.log('  Done. All 10 queries completed.');
  console.log('══════════════════════════════════════════════════════════\n');

})().catch(err => {
  console.error('\n[ERROR]', err.message);
  process.exit(1);
});
