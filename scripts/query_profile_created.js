const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
  projectId: 'gd-math-71c48',
  keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
  location: 'asia-south1'
});

// Step 1: discover distinct screen/source/event combos in DebugInfo
const discoverQuery = `
SELECT
  MAX(IF(p.key='screen', p.value.string_value, NULL)) AS screen,
  MAX(IF(p.key='source', p.value.string_value, NULL)) AS source,
  MAX(IF(p.key='event',  p.value.string_value, NULL)) AS debug_event,
  COUNT(DISTINCT user_pseudo_id) AS users
FROM \`gd-math-71c48.analytics_441470574.events_*\`,
     UNNEST(event_params) AS p
WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
  AND event_name = 'DebugInfo'
GROUP BY user_pseudo_id, event_timestamp
`;

// Step 2: count users who hit Profile > Save > Click
const countQuery = `
WITH debug_pivot AS (
  SELECT
    user_pseudo_id,
    MAX(IF(p.key='screen', p.value.string_value, NULL)) AS screen,
    MAX(IF(p.key='source', p.value.string_value, NULL)) AS source,
    MAX(IF(p.key='event',  p.value.string_value, NULL)) AS debug_event
  FROM \`gd-math-71c48.analytics_441470574.events_*\`,
       UNNEST(event_params) AS p
  WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
    AND event_name = 'DebugInfo'
  GROUP BY user_pseudo_id, event_timestamp
)
SELECT COUNT(DISTINCT user_pseudo_id) AS profile_created_users
FROM debug_pivot
WHERE LOWER(screen) = 'profile'
  AND LOWER(source) = 'save'
  AND LOWER(debug_event) = 'click'
`;

async function run() {
  // Discover
  const [rows] = await bq.query(discoverQuery);
  // Group by screen/source/event and sum users
  const combos = {};
  for (const r of rows) {
    const key = `${r.screen}|${r.source}|${r.debug_event}`;
    combos[key] = (combos[key] || 0) + Number(r.users);
  }
  // Show top combos containing 'profile' or 'save' (case-insensitive)
  console.log('=== DebugInfo combos (screen|source|event) with "profile" or "save" ===');
  Object.entries(combos)
    .filter(([k]) => /profile|save/i.test(k))
    .sort((a,b) => b[1]-a[1])
    .forEach(([k,v]) => console.log(`  ${k}  →  ${v} users`));

  // Count
  const [countRows] = await bq.query(countQuery);
  console.log('\n=== Profile created (screen=Profile, source=Save, event=Click) ===');
  console.log('Users:', countRows[0].profile_created_users);
  const pct = (Number(countRows[0].profile_created_users) / 3262 * 100).toFixed(1);
  console.log(`% of 3,262 installs: ${pct}%`);
}

run().catch(e => console.error(e.message));
