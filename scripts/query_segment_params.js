const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
  projectId: 'gd-math-71c48',
  keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
  location: 'asia-south1'
});

// Discover all param keys + sample values for segmentCompleted and segmentDropped
const q = `
SELECT
  event_name,
  p.key,
  COUNT(*) AS cnt,
  ARRAY_AGG(DISTINCT COALESCE(p.value.string_value, CAST(p.value.int_value AS STRING), CAST(p.value.float_value AS STRING)) IGNORE NULLS LIMIT 5) AS sample_values
FROM \`gd-math-71c48.analytics_441470574.events_*\`,
     UNNEST(event_params) AS p
WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
  AND event_name IN ('segmentCompleted', 'segmentDropped', 'segmentStarted')
GROUP BY event_name, p.key
ORDER BY event_name, cnt DESC
`;

bq.query(q).then(([rows]) => {
  let curEvent = '';
  for (const r of rows) {
    if (r.event_name !== curEvent) {
      curEvent = r.event_name;
      console.log(`\n=== ${curEvent} ===`);
    }
    console.log(`  ${r.key.padEnd(24)} (${r.cnt})  →  ${r.sample_values.join(', ')}`);
  }
}).catch(e => console.error(e.message));
