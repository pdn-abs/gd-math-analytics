const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
  projectId: 'gd-math-71c48',
  keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
  location: 'asia-south1'
});

const query = `
WITH skill_age_param AS (
  -- get currentSkillAge from segmentStarted events
  SELECT
    user_pseudo_id,
    MAX(IF(p.key = 'currentSkillAge', p.value.string_value, NULL)) AS skill_age
  FROM \`gd-math-71c48.analytics_441470574.events_*\`,
       UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name = 'segmentStarted'
  GROUP BY user_pseudo_id
),
user_skill_age AS (
  SELECT user_pseudo_id, skill_age
  FROM skill_age_param
  WHERE skill_age IS NOT NULL
),
segments AS (
  SELECT
    s.user_pseudo_id,
    u.skill_age,
    COUNT(*) AS segments_started
  FROM \`gd-math-71c48.analytics_441470574.events_*\` s
  JOIN user_skill_age u USING (user_pseudo_id),
       UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name = 'segmentStarted'
  GROUP BY s.user_pseudo_id, u.skill_age
),
completed AS (
  SELECT
    s.user_pseudo_id,
    u.skill_age,
    COUNT(*) AS segments_completed
  FROM \`gd-math-71c48.analytics_441470574.events_*\` s
  JOIN user_skill_age u USING (user_pseudo_id)
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name = 'segmentCompleted'
  GROUP BY s.user_pseudo_id, u.skill_age
),
levels AS (
  SELECT
    s.user_pseudo_id,
    u.skill_age,
    COUNT(*) AS levels_loaded
  FROM \`gd-math-71c48.analytics_441470574.events_*\` s
  JOIN user_skill_age u USING (user_pseudo_id)
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name = 'LevelLoaded'
  GROUP BY s.user_pseudo_id, u.skill_age
),
dropped AS (
  SELECT
    s.user_pseudo_id,
    u.skill_age,
    COUNT(*) AS segments_dropped
  FROM \`gd-math-71c48.analytics_441470574.events_*\` s
  JOIN user_skill_age u USING (user_pseudo_id)
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name = 'segmentDropped'
  GROUP BY s.user_pseudo_id, u.skill_age
)
SELECT
  u.skill_age,
  COUNT(DISTINCT u.user_pseudo_id) AS users,
  SUM(COALESCE(l.levels_loaded, 0)) AS total_levels,
  ROUND(AVG(COALESCE(l.levels_loaded, 0)), 1) AS avg_levels_per_user,
  SUM(COALESCE(sg.segments_started, 0)) AS total_seg_started,
  SUM(COALESCE(c.segments_completed, 0)) AS total_seg_completed,
  SUM(COALESCE(d.segments_dropped, 0)) AS total_seg_dropped,
  ROUND(SUM(COALESCE(c.segments_completed, 0)) / NULLIF(SUM(COALESCE(sg.segments_started, 0)), 0) * 100, 1) AS seg_completion_pct,
  ROUND(AVG(COALESCE(sg.segments_started, 0)), 1) AS avg_seg_per_user
FROM user_skill_age u
LEFT JOIN segments sg USING (user_pseudo_id, skill_age)
LEFT JOIN completed c USING (user_pseudo_id, skill_age)
LEFT JOIN dropped d USING (user_pseudo_id, skill_age)
LEFT JOIN levels l USING (user_pseudo_id, skill_age)
GROUP BY u.skill_age
ORDER BY
  CASE WHEN REGEXP_CONTAINS(u.skill_age, r'^[0-9]') THEN CAST(REGEXP_EXTRACT(u.skill_age, r'^([0-9]+)') AS INT64) ELSE 99 END
`;

bq.query(query).then(([rows]) => {
  const pad = (s, n) => String(s).padStart(n);
  const padL = (s, n) => String(s).padEnd(n);

  console.log('\nApp Usage Stats by Skill Age (Jan 25 – Mar 25, 2026)\n');
  console.log(
    padL('Skill Age', 10),
    pad('Users', 7),
    pad('Levels', 8),
    pad('Avg Lvl', 8),
    pad('Seg Start', 10),
    pad('Seg Done', 9),
    pad('Seg Drop', 9),
    pad('Done%', 6),
    pad('Avg Seg', 8)
  );
  console.log('-'.repeat(77));

  let totUsers = 0, totLevels = 0, totStart = 0, totDone = 0, totDrop = 0;
  for (const r of rows) {
    totUsers += Number(r.users);
    totLevels += Number(r.total_levels);
    totStart += Number(r.total_seg_started);
    totDone += Number(r.total_seg_completed);
    totDrop += Number(r.total_seg_dropped);
    console.log(
      padL(r.skill_age, 10),
      pad(r.users, 7),
      pad(r.total_levels, 8),
      pad(r.avg_levels_per_user, 8),
      pad(r.total_seg_started, 10),
      pad(r.total_seg_completed, 9),
      pad(r.total_seg_dropped, 9),
      pad(r.seg_completion_pct + '%', 6),
      pad(r.avg_seg_per_user, 8)
    );
  }
  console.log('-'.repeat(77));
  const totalDonePct = (totDone / totStart * 100).toFixed(1);
  console.log(
    padL('TOTAL', 10),
    pad(totUsers, 7),
    pad(totLevels, 8),
    pad((totLevels/totUsers).toFixed(1), 8),
    pad(totStart, 10),
    pad(totDone, 9),
    pad(totDrop, 9),
    pad(totalDonePct + '%', 6),
    pad((totStart/totUsers).toFixed(1), 8)
  );
}).catch(e => console.error(e.message));
