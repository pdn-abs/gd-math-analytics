const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
  projectId: 'gd-math-71c48',
  keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
  location: 'asia-south1'
});
const query = `
SELECT event_name, COUNT(DISTINCT user_pseudo_id) AS users, COUNT(*) AS events
FROM \`gd-math-71c48.analytics_441470574.events_*\`
WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
  AND event_name IN ('PlayerCreate','PlayerDelete','PlayerUpdate','GameFirstStart','PlayerSessionStart','LevelData')
GROUP BY event_name ORDER BY users DESC
`;
bq.query(query).then(([rows]) => {
  if (!rows.length) { console.log('No rows — none of these events exist in BQ export'); return; }
  rows.forEach(r => console.log(r.event_name, '| users:', r.users, '| events:', r.events));
}).catch(e => console.error(e.message));
