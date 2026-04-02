const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
  projectId: 'gd-math-71c48',
  keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
  location: 'asia-south1'
});

const query = `
WITH home_users AS (
  SELECT DISTINCT user_pseudo_id
  FROM \`gd-math-71c48.analytics_441470574.events_*\`,
       UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND p.key = 'firebase_screen'
    AND p.value.string_value = 'Home'
),
level_users AS (
  SELECT DISTINCT user_pseudo_id
  FROM \`gd-math-71c48.analytics_441470574.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name = 'LevelLoaded'
)
SELECT
  (SELECT COUNT(*) FROM home_users) AS home_visitors,
  (SELECT COUNT(*) FROM level_users) AS level_starters,
  (SELECT COUNT(*) FROM home_users WHERE user_pseudo_id NOT IN (SELECT user_pseudo_id FROM level_users)) AS home_but_no_level
`;

bq.query(query).then(([rows]) => {
  const r = rows[0];
  console.log('Home screen visitors:   ', r.home_visitors);
  console.log('Level starters:         ', r.level_starters);
  console.log('Home but NO level:      ', r.home_but_no_level);
  const pct = (r.home_but_no_level / r.home_visitors * 100).toFixed(1);
  console.log(`% of home visitors who never started: ${pct}%`);
}).catch(e => console.error(e.message));
