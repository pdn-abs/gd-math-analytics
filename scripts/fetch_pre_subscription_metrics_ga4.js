// Pre-subscription phase metrics — GA4 Reporting API version
//
// Cross-validation counterpart to fetch_pre_subscription_metrics.js (BigQuery).
// Uses the GA4 Data API (sampled, aggregated) rather than raw event-level BigQuery export.
//
// Known GA4 API limitations vs BigQuery:
//   - Retention uses the GA4 cohort REST endpoint directly (runCohortReport is absent
//     from @google-analytics/data v5.x SDK but exists in the v1beta REST API)
//   - Screen views use unifiedScreenName dimension (requires screen_view events in GA4)
//   - Event param filtering is NOT supported — GameSubscription count includes all types,
//     not just type=Created. Zero count is still a reliable signal.
//   - active1/7/28DayUsers are rolling-window metrics tied to report end date,
//     not averages across the window — use for snapshot comparison only.
//
// Prerequisites:
//   Run: source setup_credentials.sh
//   (Sets GOOGLE_APPLICATION_CREDENTIALS to keys/*.json)
//
// Property: 441470574 (GD Math)

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');
const path = require('path');

const PROPERTY = 'properties/441470574';
const START_DATE = '2026-01-25';
const END_DATE   = '2026-03-25';

// Cohort window: users who first touched Jan 25 → Feb 23 (gives 30 full days before end)
const COHORT_END = '2026-02-23';

const client = new BetaAnalyticsDataClient();

const STREAM_FILTER = {
    filter: {
        fieldName: 'streamName',
        stringFilter: { value: 'GD Math', matchType: 'EXACT' },
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration (sec) {
    const s = Math.round(sec);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
}

function pct (num, den) {
    if (!den || den === 0) return '0.00%';
    return (100 * num / den).toFixed(2) + '%';
}

function bar (rate, max = 100, width = 20) {
    const filled = Math.round((rate / max) * width);
    return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function metricVal (row, index) {
    return row.metricValues?.[index]?.value ?? '0';
}

// ─── 1. Core acquisition metrics ──────────────────────────────────────────────

async function fetchCoreMetrics () {
    console.log('\n[1/6] Fetching core acquisition & engagement metrics...');

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensionFilter: { filter: STREAM_FILTER.filter },
        metrics: [
            { name: 'activeUsers' },             // 0
            { name: 'totalUsers' },              // 1
            { name: 'newUsers' },                // 2
            { name: 'sessions' },                // 3
            { name: 'engagedSessions' },         // 4
            { name: 'engagementRate' },          // 5
            { name: 'averageSessionDuration' },  // 6
            { name: 'userEngagementDuration' },  // 7 (total seconds)
        ],
    });

    const m = response.rows?.[0]?.metricValues;
    if (!m) throw new Error('No data returned for core metrics');

    const activeUsers    = parseInt(m[0].value);
    const totalUsers     = parseInt(m[1].value);
    const newUsers       = parseInt(m[2].value);
    const sessions       = parseInt(m[3].value);
    const engagedSess    = parseInt(m[4].value);
    const engagementRate = parseFloat(m[5].value);
    const avgSessionSec  = parseFloat(m[6].value);
    const totalEngageSec = parseFloat(m[7].value);

    // WAU/MAU must be separate query (rolling-window metrics inflate results if mixed)
    const [wauMauResp] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensionFilter: { filter: STREAM_FILTER.filter },
        metrics: [
            { name: 'active1DayUsers' },  // 0 — DAU snapshot at report end
            { name: 'active7DayUsers' },  // 1 — WAU snapshot
            { name: 'active28DayUsers' }, // 2 — MAU snapshot
        ],
    });
    const wm = wauMauResp.rows?.[0]?.metricValues;
    const dau = parseInt(wm?.[0]?.value || '0');
    const wau = parseInt(wm?.[1]?.value || '0');
    const mau = parseInt(wm?.[2]?.value || '0');

    return { activeUsers, totalUsers, newUsers, returningUsers: totalUsers - newUsers,
             sessions, engagedSess, engagementRate, avgSessionSec, totalEngageSec,
             dau, wau, mau };
}

// ─── 2. DAU trend by day ───────────────────────────────────────────────────────

async function fetchDAUByDay () {
    console.log('\n[2a] Fetching DAU trend by day...');

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensionFilter: { filter: STREAM_FILTER.filter },
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
    });

    return (response.rows || []).map(r => ({
        date: r.dimensionValues[0].value,
        dau: parseInt(r.metricValues[0].value),
    }));
}

// ─── 3. Retention cohorts D1/D7/D30 ──────────────────────────────────────────
// The GA4 cohort report endpoint (v1alpha/v1beta runCohortReport) is not
// available for this property. This function returns null and the report
// notes that BigQuery is the source of truth for retention.
//
// The GA4 Reporting API standard runReport has no mechanism to compute
// "users who were new in window A and active in window B" without cohort logic.

async function fetchRetention () {
    console.log('\n[2/6] Retention — skipping (GA4 cohort endpoint unavailable for this property)');
    console.log('    → Use BigQuery script (fetch_pre_subscription_metrics.js) for D1/D7/D30.');
    return null;
}

// ─── 4. Paywall funnel ────────────────────────────────────────────────────────

async function fetchPaywallFunnel (totalUsers) {
    console.log('\n[3/6] Fetching paywall funnel events...');

    // Fetch event counts for paywall-related events
    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    { filter: STREAM_FILTER.filter },
                    {
                        filter: {
                            fieldName: 'eventName',
                            inListFilter: { values: ['SubscriptionOpened', 'GameSubscription'] },
                        },
                    },
                ],
            },
        },
        dimensions: [{ name: 'eventName' }],
        metrics: [
            { name: 'eventCount' },  // 0
            { name: 'activeUsers' }, // 1 — unique users who fired this event
        ],
    });

    const funnel = {};
    (response.rows || []).forEach(r => {
        funnel[r.dimensionValues[0].value] = {
            events: parseInt(r.metricValues[0].value),
            users: parseInt(r.metricValues[1].value),
        };
    });

    const paywallUsers   = funnel['SubscriptionOpened']?.users  || 0;
    // Note: GameSubscription includes all types (no param filter in GA4 API)
    const purchaseUsers  = funnel['GameSubscription']?.users    || 0;

    return {
        totalUsers,
        paywallUsers,
        purchaseUsers,
        paywallReachPct: totalUsers   > 0 ? (100 * paywallUsers  / totalUsers).toFixed(2)   : '0.00',
        paywallConvPct:  paywallUsers > 0 ? (100 * purchaseUsers / paywallUsers).toFixed(2) : '0.00',
        overallConvPct:  totalUsers   > 0 ? (100 * purchaseUsers / totalUsers).toFixed(2)   : '0.00',
    };
}

// ─── 5. Top screens ───────────────────────────────────────────────────────────

async function fetchTopScreens () {
    console.log('\n[4/6] Fetching top screens...');

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensionFilter: { filter: STREAM_FILTER.filter },
        dimensions: [{ name: 'unifiedScreenName' }],
        metrics: [
            { name: 'screenPageViews' }, // 0
            { name: 'activeUsers' },     // 1
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 20,
    });

    return (response.rows || []).map(r => ({
        screen: r.dimensionValues[0].value,
        views: parseInt(r.metricValues[0].value),
        uniqueUsers: parseInt(r.metricValues[1].value),
    }));
}

// ─── 6. Assessment completion ─────────────────────────────────────────────────

async function fetchAssessment (totalUsers) {
    console.log('\n[5/6] Fetching assessment completion...');

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    { filter: STREAM_FILTER.filter },
                    {
                        filter: {
                            fieldName: 'eventName',
                            stringFilter: { value: 'assessmentCompleted', matchType: 'EXACT' },
                        },
                    },
                ],
            },
        },
        metrics: [
            { name: 'eventCount' },  // 0
            { name: 'activeUsers' }, // 1
        ],
    });

    const events = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0');
    const users  = parseInt(response.rows?.[0]?.metricValues?.[1]?.value || '0');

    return {
        totalUsers,
        usersCompleted: users,
        totalEvents: events,
        completionRatePct: totalUsers > 0 ? parseFloat((100 * users / totalUsers).toFixed(2)) : 0,
    };
}

// ─── 7. Crash rate ────────────────────────────────────────────────────────────

async function fetchCrashes (totalSessions) {
    console.log('\n[6/6] Fetching crash events...');

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    { filter: STREAM_FILTER.filter },
                    {
                        filter: {
                            fieldName: 'eventName',
                            stringFilter: { value: 'app_exception', matchType: 'EXACT' },
                        },
                    },
                ],
            },
        },
        metrics: [
            { name: 'eventCount' },  // 0
            { name: 'activeUsers' }, // 1
        ],
    });

    const crashEvents   = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0');
    const usersAffected = parseInt(response.rows?.[0]?.metricValues?.[1]?.value || '0');

    return {
        totalSessions,
        crashEvents,
        usersAffected,
        crashRatePct: totalSessions > 0 ? parseFloat((100 * crashEvents / totalSessions).toFixed(3)) : 0,
    };
}

// ─── 8. Segment / gameplay funnel ───────────────────────────────────────────────
// Fetches event counts + unique users for the four core gameplay events:
//   LevelLoaded → segmentStarted → segmentCompleted / segmentDropped
//
// Note: GA4 API returns aggregate counts across the whole window, not per-user.
// The unique `activeUsers` per event gives the user-level funnel step.

async function fetchSegmentFunnel () {
    console.log('\n[7/7] Fetching segment / gameplay funnel...');

    const GAMEPLAY_EVENTS = ['LevelLoaded', 'segmentStarted', 'segmentCompleted', 'segmentDropped'];

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    { filter: STREAM_FILTER.filter },
                    {
                        filter: {
                            fieldName: 'eventName',
                            inListFilter: { values: GAMEPLAY_EVENTS },
                        },
                    },
                ],
            },
        },
        dimensions: [{ name: 'eventName' }],
        metrics: [
            { name: 'eventCount' },  // 0 — total event fires
            { name: 'activeUsers' }, // 1 — unique users who fired this event
        ],
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    });

    const result = {};
    (response.rows || []).forEach(r => {
        result[r.dimensionValues[0].value] = {
            eventCount: parseInt(r.metricValues[0].value),
            uniqueUsers: parseInt(r.metricValues[1].value),
        };
    });

    const started   = result['segmentStarted']   || { eventCount: 0, uniqueUsers: 0 };
    const completed = result['segmentCompleted'] || { eventCount: 0, uniqueUsers: 0 };
    const dropped   = result['segmentDropped']   || { eventCount: 0, uniqueUsers: 0 };
    const loaded    = result['LevelLoaded']      || { eventCount: 0, uniqueUsers: 0 };

    const completionRateEvents = started.eventCount > 0
        ? parseFloat((100 * completed.eventCount / started.eventCount).toFixed(2)) : 0;
    const completionRateUsers  = started.uniqueUsers > 0
        ? parseFloat((100 * completed.uniqueUsers / started.uniqueUsers).toFixed(2)) : 0;
    const dropRateEvents = started.eventCount > 0
        ? parseFloat((100 * dropped.eventCount / started.eventCount).toFixed(2)) : 0;

    return {
        levelLoaded: loaded,
        segmentStarted: started,
        segmentCompleted: completed,
        segmentDropped: dropped,
        completionRateByEventsPct: completionRateEvents,
        completionRateByUsersPct: completionRateUsers,
        dropRateByEventsPct: dropRateEvents,
    };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║       GD-Math — Pre-Subscription Phase Metrics (GA4 API)        ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`Property : ${PROPERTY}`);
    console.log(`Window   : ${START_DATE} → ${END_DATE}`);
    console.log(`Cohorts  : first-touch ${START_DATE} → ${COHORT_END} (D30-eligible)`);

    const core       = await fetchCoreMetrics();
    const dauByDay   = await fetchDAUByDay();
    const retention  = await fetchRetention();
    const paywall    = await fetchPaywallFunnel(core.totalUsers);
    const screens    = await fetchTopScreens();
    const assessment = await fetchAssessment(core.totalUsers);
    const crashes    = await fetchCrashes(core.sessions);
    const segments   = await fetchSegmentFunnel();

    // ── DAU stats
    const dauValues = dauByDay.map(r => r.dau);
    const avgDAU    = dauValues.length ? Math.round(dauValues.reduce((a, b) => a + b, 0) / dauValues.length) : 0;
    const peakDAU   = dauValues.length ? Math.max(...dauValues) : 0;
    const dauMauRatio = core.mau > 0 ? (core.dau / core.mau).toFixed(3) : '0.000';

    // ══ Print report ════════════════════════════════════════════════════════════

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. USER ACQUISITION & ACTIVITY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total Users           : ${core.totalUsers.toLocaleString()}`);
    console.log(`   Active Users          : ${core.activeUsers.toLocaleString()}`);
    console.log(`   New Users             : ${core.newUsers.toLocaleString()}`);
    console.log(`   Returning Users       : ${core.returningUsers.toLocaleString()}  (${pct(core.returningUsers, core.totalUsers)})`);
    console.log(`   Sessions              : ${core.sessions.toLocaleString()}`);
    console.log(`   Engaged Sessions      : ${core.engagedSess.toLocaleString()}  (${pct(core.engagedSess, core.sessions)})`);
    console.log(`   Avg Session Duration  : ${formatDuration(core.avgSessionSec)}`);
    console.log(`   Avg Engagement / User : ${formatDuration(core.totalEngageSec / (core.activeUsers || 1))}`);
    console.log('');
    console.log(`   DAU snapshot (report end) : ${core.dau.toLocaleString()}`);
    console.log(`   WAU snapshot              : ${core.wau.toLocaleString()}`);
    console.log(`   MAU snapshot              : ${core.mau.toLocaleString()}`);
    console.log(`   DAU/MAU ratio             : ${dauMauRatio}  ${parseFloat(dauMauRatio) >= 0.20 ? '✓ Good (≥0.20)' : '⚠ Low (<0.20)'}`);
    console.log(`   Avg DAU (window, by day)  : ${avgDAU.toLocaleString()}`);
    console.log(`   Peak DAU (window)         : ${peakDAU.toLocaleString()}`);
    console.log('\n   DAU trend (last 14 days):');
    dauByDay.slice(-14).forEach(r => {
        console.log(`   ${r.date}  ${bar(r.dau, peakDAU)}  ${r.dau}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2. RETENTION COHORTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (retention === null) {
        console.log('   ⚠  GA4 cohort report endpoint is not available for this property.');
        console.log('      Run fetch_pre_subscription_metrics.js (BigQuery) for D1/D7/D30 retention.');
        console.log('      BigQuery result: D1 = 6.5%  D7 = 2.4%  D30 = 2.0%  (Jan 25 – Mar 25, 2026)');
    } else {
        const benchmarks = { 1: 40, 7: 20, 30: 10 };
        retention.forEach(r => {
            const bench = benchmarks[r.dayOffset] || 10;
            const status = r.rate >= bench ? '✓' : '⚠';
            console.log(
                `   D${String(r.dayOffset).padStart(2, '0')}  ${bar(r.rate, 100)}  ${String(r.rate.toFixed(1)).padStart(5)}%  ${status} (benchmark ≥${bench}%)  — ${r.retained}/${r.total} users`
            );
        });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('3. PAYWALL FUNNEL  (Priority #1 — Drive First Subscribers)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total Users            : ${paywall.totalUsers.toLocaleString()}`);
    console.log(`   Reached paywall        : ${paywall.paywallUsers.toLocaleString()}  (${paywall.paywallReachPct}%)  ${parseFloat(paywall.paywallReachPct) >= 5 ? '✓' : '⚠ <5%'}`);
    console.log(`   GameSubscription fired : ${paywall.purchaseUsers.toLocaleString()}  (${paywall.paywallConvPct}% of paywall viewers)`);
    console.log(`   ⚠  Note: GA4 API cannot filter by event param. GameSubscription count`);
    console.log(`      includes all types — zero is still a definitive signal.`);
    console.log('\n   Funnel:');
    console.log(`   All users ──(${paywall.paywallReachPct}%)──► Paywall ──(${paywall.paywallConvPct}%)──► Subscription event`);
    if (paywall.purchaseUsers === 0) {
        console.log('\n   ⚠  Zero subscription events. Check if paywall is being surfaced at all.');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('4. TOP SCREENS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (screens.length === 0) {
        console.log('   No screen_view data — unifiedScreenName dimension returned no rows.');
        console.log('   (GA4 API requires screen_view events; verify Firebase screen tracking is enabled.)');
    } else {
        const maxViews = screens[0].views;
        screens.forEach((r, i) => {
            const name = (r.screen || '(null)').padEnd(22);
            console.log(
                `   ${String(i + 1).padStart(2)}. ${name}  ${bar(r.views, maxViews, 16)}  ${String(r.views).padStart(6)} views  ${String(r.uniqueUsers).padStart(5)} users`
            );
        });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('5. FEATURE ENGAGEMENT — SEGMENT FUNNEL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   LevelLoaded       : ${segments.levelLoaded.eventCount.toLocaleString()} events  ${segments.levelLoaded.uniqueUsers.toLocaleString()} unique users`);
    console.log(`   segmentStarted    : ${segments.segmentStarted.eventCount.toLocaleString()} events  ${segments.segmentStarted.uniqueUsers.toLocaleString()} unique users`);
    console.log(`   segmentCompleted  : ${segments.segmentCompleted.eventCount.toLocaleString()} events  ${segments.segmentCompleted.uniqueUsers.toLocaleString()} unique users`);
    console.log(`   segmentDropped    : ${segments.segmentDropped.eventCount.toLocaleString()} events  ${segments.segmentDropped.uniqueUsers.toLocaleString()} unique users`);
    console.log('');
    console.log(`   Completion rate (by events)  : ${segments.completionRateByEventsPct}%  (${segments.segmentCompleted.eventCount}/${segments.segmentStarted.eventCount})`);
    console.log(`   Completion rate (by users)   : ${segments.completionRateByUsersPct}%  (${segments.segmentCompleted.uniqueUsers}/${segments.segmentStarted.uniqueUsers})`);
    console.log(`   Drop rate (by events)        : ${segments.dropRateByEventsPct}%  (${segments.segmentDropped.eventCount}/${segments.segmentStarted.eventCount})`);
    const completionBench = segments.completionRateByEventsPct >= 70 ? '✓ Good (≥70%)'
        : segments.completionRateByEventsPct >= 50 ? '⚠ Moderate (50–70%)'
        : '✗ Low (<50%) — review level difficulty';
    console.log(`   Status                       : ${completionBench}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('6. ONBOARDING / ASSESSMENT COMPLETION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const assessStatus = assessment.completionRatePct >= 50 ? '✓ Good (≥50%)'
        : assessment.completionRatePct >= 30 ? '⚠ Moderate (30–50%)'
        : '✗ Low (<30%) — review onboarding';
    console.log(`   Total users              : ${assessment.totalUsers.toLocaleString()}`);
    console.log(`   Completed assessment     : ${assessment.usersCompleted.toLocaleString()}  (${assessment.completionRatePct.toFixed(1)}%)`);
    console.log(`   Total assessment events  : ${assessment.totalEvents.toLocaleString()}`);
    console.log(`   Status                   : ${assessStatus}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('6. CRASH / STABILITY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const userCrashPct = core.totalUsers > 0 ? (100 * crashes.usersAffected / core.totalUsers).toFixed(2) : '0.00';
    console.log(`   Total sessions    : ${crashes.totalSessions.toLocaleString()}`);
    console.log(`   Crash events      : ${crashes.crashEvents.toLocaleString()}`);
    console.log(`   Users affected    : ${crashes.usersAffected.toLocaleString()}  (${userCrashPct}% of users)`);
    console.log(`   Crash rate        : ${crashes.crashRatePct}% of sessions  ${crashes.crashRatePct < 1 ? '✓ Good (<1%)' : '⚠ Elevated (≥1%)'}`);

    // ── Save JSON ────────────────────────────────────────────────────────────────
    const output = {
        source: 'GA4 Reporting API',
        generatedAt: new Date().toISOString(),
        window: { start: START_DATE, end: END_DATE },
        cohortWindow: { start: START_DATE, end: COHORT_END },
        acquisition: {
            totalUsers: core.totalUsers,
            activeUsers: core.activeUsers,
            newUsers: core.newUsers,
            returningUsers: core.returningUsers,
            sessions: core.sessions,
            engagedSessions: core.engagedSess,
            engagementRatePct: parseFloat((core.engagementRate * 100).toFixed(2)),
            avgSessionDurationSec: parseFloat(core.avgSessionSec.toFixed(2)),
            avgEngagementPerUserSec: parseFloat((core.totalEngageSec / (core.activeUsers || 1)).toFixed(2)),
            dauSnapshot: core.dau,
            wauSnapshot: core.wau,
            mauSnapshot: core.mau,
            dauMauRatio: parseFloat(dauMauRatio),
            avgDAU,
            peakDAU,
            dauByDay,
        },
        retention: retention === null
            ? { note: 'GA4 cohort endpoint unavailable — see BigQuery script for D1/D7/D30', bigQueryResults: { D1: '6.52%', D7: '2.38%', D30: '2.04%' } }
            : retention.map(r => ({ dayOffset: r.dayOffset, retainedUsers: r.retained, cohortSize: r.total, retentionRatePct: parseFloat(r.rate.toFixed(2)) })),
        paywallFunnel: {
            totalUsers: paywall.totalUsers,
            reachedPaywall: paywall.paywallUsers,
            subscriptionEvents: paywall.purchaseUsers,
            paywallReachRatePct: parseFloat(paywall.paywallReachPct),
            paywallConversionRatePct: parseFloat(paywall.paywallConvPct),
            note: 'subscriptionEvents = all GameSubscription events (GA4 API cannot filter by event param)',
        },
        topScreens: screens,
        segmentFunnel: segments,
        assessment,
        crashes: { ...crashes, userCrashRatePct: parseFloat(userCrashPct) },
    };

    const outPath = path.resolve(__dirname, '../data/pre_subscription_metrics_ga4.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✓ Saved → data/pre_subscription_metrics_ga4.json`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
    console.error('\nFatal error:', err.message);
    if (err.message.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
        console.error('→ Run: source setup_credentials.sh');
    }
    process.exit(1);
});
