// Probe: find what custom dimensions are registered for this GA4 property
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const PROPERTY = 'properties/441470574';
const START_DATE = '2026-01-25';
const END_DATE   = '2026-03-25';
const client = new BetaAnalyticsDataClient();

async function main() {
  // First: what dimensions work with screen_view at all?
  const safeDims = [
    'appVersion',
    'operatingSystem',
    'country',
    'date',
    'platform',
  ];

  console.log('Testing safe dims with screen_view + firebase_screen filter...');
  for (const dim of safeDims) {
    try {
      const [r] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensions: [{ name: dim }],
        metrics:    [{ name: 'eventCount' }],
        dimensionFilter: {
          andGroup: { expressions: [
            { filter: { fieldName: 'eventName',
                stringFilter: { value: 'screen_view', matchType: 'EXACT' } } },
            { filter: { fieldName: 'customEvent:firebase_screen',
                stringFilter: { value: 'Subscription', matchType: 'EXACT' } } },
          ]}
        },
        limit: 3,
      });
      const vals = (r.rows || []).map(row => row.dimensionValues[0].value + ':' + row.metricValues[0].value).join(', ');
      console.log('  OK  [' + dim + '] — ' + vals);
    } catch(e) {
      console.log('  ERR [' + dim + '] — ' + e.message.split('\n')[0].slice(0, 80));
    }
  }

  // Then test the filter itself: does firebase_screen work as a filter?
  console.log('\nTesting filter dimension candidates for firebase_screen...');
  const filterDims = [
    'customEvent:firebase_screen',
    'unifiedScreenName',
    'screenName',
    'appScreen',
  ];
  for (const fd of filterDims) {
    try {
      const [r] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensions: [{ name: fd }],
        metrics:    [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: { fieldName: 'eventName',
            stringFilter: { value: 'screen_view', matchType: 'EXACT' } }
        },
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 5,
      });
      const vals = (r.rows || []).map(row => row.dimensionValues[0].value + ':' + row.metricValues[0].value).join(' | ');
      console.log('  OK  [' + fd + '] — ' + vals);
    } catch(e) {
      console.log('  ERR [' + fd + '] — ' + e.message.split('\n')[0].slice(0, 80));
    }
  }
}

main().catch(e => console.error('Fatal:', e.message));
