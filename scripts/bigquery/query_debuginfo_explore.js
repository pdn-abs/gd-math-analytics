const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
  projectId: 'gd-math-71c48',
  keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
  location: 'asia-south1'
});

// Check if DebugInfo exists and show sample params
const q = `
SELECT
  event_name,
  COUNT(DISTINCT user_pseudo_id) AS users,
  COUNT(*) AS total_events
FROM \`gd-math-71c48.analytics_441470574.events_*\`
WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
  AND LOWER(event_name) LIKE '%debug%'
GROUP BY event_name
`;

// Also get all unique param keys across DebugInfo events
const q2 = `
SELECT p.key, COUNT(*) AS cnt
FROM \`gd-math-71c48.analytics_441470574.events_*\`,
     UNNEST(event_params) AS p
WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
  AND LOWER(event_name) LIKE '%debug%'
GROUP BY p.key ORDER BY cnt DESC
`;

async function run() {
  const [rows] = await bq.query(q);
  console.log('=== Debug-like events ===');
  if (!rows.length) console.log('  NONE found');
  rows.forEach(r => console.log(`  ${r.event_name}: ${r.users} users, ${r.total_events} events`));

  if (rows.length) {
    const [rows2] = await bq.query(q2);
    console.log('\n=== Param keys in debug events ===');
    rows2.forEach(r => console.log(`  ${r.key}: ${r.cnt}`));
  }
}

run().catch(e => console.error(e.message));
