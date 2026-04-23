const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const PROPERTY   = 'properties/441470574';
const START_DATE = '2026-01-25';
const END_DATE   = '2026-03-25';
const client     = new BetaAnalyticsDataClient();

function pct(n, d) { return d ? (100 * n / d).toFixed(1) + '%' : '--'; }

async function main() {
  // 1. Total SubscriptionOpened
  const [total] = await client.runReport({
    property: PROPERTY,
    dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
    metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
    dimensionFilter: {
      filter: { fieldName: 'eventName',
        stringFilter: { value: 'SubscriptionOpened', matchType: 'EXACT' } }
    },
  });

  // 2. By app version
  const [byVersion] = await client.runReport({
    property: PROPERTY,
    dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
    dimensions: [{ name: 'appVersion' }],
    metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
    dimensionFilter: {
      filter: { fieldName: 'eventName',
        stringFilter: { value: 'SubscriptionOpened', matchType: 'EXACT' } }
    },
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
  });

  // 3. Daily
  const [daily] = await client.runReport({
    property: PROPERTY,
    dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
    dimensionFilter: {
      filter: { fieldName: 'eventName',
        stringFilter: { value: 'SubscriptionOpened', matchType: 'EXACT' } }
    },
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  // 4. Total level players (to compute paywall reach rate)
  const [levelPlayers] = await client.runReport({
    property: PROPERTY,
    dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
    metrics: [{ name: 'activeUsers' }],
    dimensionFilter: {
      filter: { fieldName: 'eventName',
        stringFilter: { value: 'LevelLoaded', matchType: 'EXACT' } }
    },
  });

  const tRow  = total.rows[0];
  const totalUsers  = Number(tRow.metricValues[0].value);
  const totalEvents = Number(tRow.metricValues[1].value);
  const levelUsers  = Number(levelPlayers.rows[0].metricValues[0].value);

  console.log('=== SubscriptionOpened \u2014 Jan 25 to Mar 25, 2026 ===');
  console.log('Source: GA4 Reporting API\n');

  console.log('OVERALL');
  console.log('  Unique users who hit the subscription screen : ' + totalUsers);
  console.log('  Total SubscriptionOpened events              : ' + totalEvents);
  console.log('  Avg hits per user                            : ' + (totalEvents / totalUsers).toFixed(1));
  console.log('  Users who played >= 1 level (LevelLoaded)    : ' + levelUsers);
  console.log('  Paywall reach rate (sub / level players)     : ' + pct(totalUsers, levelUsers));

  console.log('\nBy App Version');
  console.log('\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');
  console.log('Version        Users   Events   Avg hits/user');
  console.log('\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');
  for (const row of (byVersion.rows || [])) {
    const ver = row.dimensionValues[0].value;
    const u   = Number(row.metricValues[0].value);
    const e   = Number(row.metricValues[1].value);
    console.log(
      ver.padEnd(14) +
      String(u).padStart(5) + '   ' +
      String(e).padStart(6) + '   ' +
      (e / u).toFixed(1).padStart(12)
    );
  }

  console.log('\nDaily');
  console.log('\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');
  console.log('Date         Users   Events');
  console.log('\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500');
  for (const row of (daily.rows || [])) {
    const d    = row.dimensionValues[0].value;
    const date = d.slice(0,4) + '-' + d.slice(4,6) + '-' + d.slice(6,8);
    const u    = Number(row.metricValues[0].value);
    const e    = Number(row.metricValues[1].value);
    console.log(date + '   ' + String(u).padStart(5) + '   ' + String(e).padStart(6));
  }
}

main().catch(e => {
  console.error('ERR:', e.message);
  process.exit(1);
});


async function main() {
  // screen_view { firebase_screen = "Subscription" } — one fires every time the
  // Subscription screen opens, co-fires with SubscriptionOpened.
  // firebase_previous_screen tells us where the user came from:
  //   "Level" → auto-redirect after trial expired
  //   "Home"  → manual tap of the subscription button

  // 1. By previous screen (all-time split)
  const [bySource] = await client.runReport({
    property: PROPERTY,
    dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
    dimensions: [{ name: 'customEvent:firebase_previous_screen' }],
    metrics:    [{ name: 'activeUsers' }, { name: 'eventCount' }],
    dimensionFilter: {
      andGroup: { expressions: [
        { filter: { fieldName: 'eventName',
            stringFilter: { value: 'screen_view', matchType: 'EXACT' } } },
        { filter: { fieldName: 'customEvent:firebase_screen',
            stringFilter: { value: 'Subscription', matchType: 'EXACT' } } },
      ]}
    },
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
  });

  // 2. Daily — trial expired only (previous screen = Level)
  const [daily] = await client.runReport({
    property: PROPERTY,
    dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
    dimensions: [{ name: 'date' }],
    metrics:    [{ name: 'activeUsers' }, { name: 'eventCount' }],
    dimensionFilter: {
      andGroup: { expressions: [
        { filter: { fieldName: 'eventName',
            stringFilter: { value: 'screen_view', matchType: 'EXACT' } } },
        { filter: { fieldName: 'customEvent:firebase_screen',
            stringFilter: { value: 'Subscription', matchType: 'EXACT' } } },
        { filter: { fieldName: 'customEvent:firebase_previous_screen',
            stringFilter: { value: 'Level', matchType: 'EXACT' } } },
      ]}
    },
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  // ── Source split ──────────────────────────────────────────────────────────
  const rows = bySource.rows || [];
  let totalUsers = 0;
  rows.forEach(r => { totalUsers += Number(r.metricValues[0].value); });

  console.log('=== SubscriptionOpened Source Split — Jan 25 to Mar 25, 2026 ===');
  console.log('Method : screen_view { firebase_screen=Subscription } via GA4 API');
  console.log('Split  : firebase_previous_screen param\n');

  console.log('Previous Screen          Users   Events   % of Total  Source');
  console.log('─────────────────────────────────────────────────────────────────');

  let trialUsers = 0, manualUsers = 0, trialEvents = 0;
  for (const row of rows) {
    const prev  = row.dimensionValues[0].value || '(not set)';
    const u     = Number(row.metricValues[0].value);
    const e     = Number(row.metricValues[1].value);
    let label = '';
    if (prev === 'Level') { label = '← trial expired'; trialUsers = u; trialEvents = e; }
    if (prev === 'Home')  { label = '← manual tap';    manualUsers = u; }
    console.log(
      prev.padEnd(24) +
      String(u).padStart(5) + '   ' +
      String(e).padStart(6) + '   ' +
      pct(u, totalUsers).padStart(10) + '  ' +
      label
    );
  }

  console.log('─────────────────────────────────────────────────────────────────');
  console.log('TOTAL                  ' + String(totalUsers).padStart(5) + '\n');
  console.log('Trial expired (Level→Subscription) : ' + trialUsers  + ' unique users  (' + pct(trialUsers,  totalUsers) + ')  — ' + trialEvents + ' total hits');
  console.log('Manual tap    (Home→Subscription)  : ' + manualUsers + ' unique users  (' + pct(manualUsers, totalUsers) + ')');

  // ── Daily trial-expired ───────────────────────────────────────────────────
  console.log('\nDaily — Trial Expired (Level → Subscription)');
  console.log('─────────────────────────────────────────────────────');
  console.log('Date         Users   Events');
  console.log('─────────────────────────────────────────────────────');
  let grandU = 0, grandE = 0;
  for (const row of (daily.rows || [])) {
    const d    = row.dimensionValues[0].value;
    const date = d.slice(0,4) + '-' + d.slice(4,6) + '-' + d.slice(6,8);
    const u    = Number(row.metricValues[0].value);
    const e    = Number(row.metricValues[1].value);
    grandU += u; grandE += e;
    console.log(date + '   ' + String(u).padStart(5) + '   ' + String(e).padStart(6));
  }
  console.log('─────────────────────────────────────────────────────');
  console.log('TOTAL        ' + String(grandU).padStart(5) + '   ' + String(grandE).padStart(6));
  console.log('\nNote: daily Users is per-date activeUsers — a user active on 3 days');
  console.log('      counts 3×. The unique user count is in the source split above.');
}

main().catch(e => {
  console.error('ERR:', e.message);
  process.exit(1);
});
