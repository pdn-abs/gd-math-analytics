// Free-trial funnel by app version — GA4 Reporting API
//
// Answers two questions per version (Jan 25 – Mar 25, 2026):
//   Q1. How many users started at least one level?
//       → unique activeUsers who viewed the "Level" screen at least once
//
//   Q2. How many users exhausted the 30-min free trial?
//       → unique activeUsers who fired SubscriptionOpened
//       → ScreenManager fires this event when playedTime > freeTrialMinutes (30 min)
//         before landing on the Subscription screen — this is the authoritative proxy.
//       → Slight over-count caveat: also fires if a user manually opens the screen
//         during the trial, but that path is rare.
//
// GA4 API limitation note:
//   runReport cannot compute user-level intersections (e.g., users where their
//   individual Level screen time ≥ 29 min). Per-user duration filters require BigQuery.
//   The SubscriptionOpened event already encodes the "29+ min" condition because
//   the app only fires it after the timer expires, making it more reliable than
//   a GA4-side duration threshold.
//
// Prerequisites:
//   Run: source setup_credentials.sh
//
// Property: 441470574 (GD Math)

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');
const path = require('path');

const PROPERTY   = 'properties/441470574';
const START_DATE = '2026-01-25';
const END_DATE   = '2026-03-25';

const TARGET_VERSIONS = [
    'v4.3.21',
    'v4.3.19',
    'v4.3.15',
    'v4.3.12',
    'v4.3.7',
    'v4.3.5',
    'v4.3.2',
    'v4.3.0',
];

const client = new BetaAnalyticsDataClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct (num, den) {
    if (!den || den === 0) return '—';
    return (100 * num / den).toFixed(1) + '%';
}

function bar (value, max, width = 20) {
    if (!max || max === 0) return '░'.repeat(width);
    const filled = Math.min(Math.round((value / max) * width), width);
    return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function pad (str, len) {
    return String(str).padEnd(len).slice(0, len);
}

// ─── 1. Total users per version (denominator) ─────────────────────────────────

async function fetchTotalUsersByVersion () {
    console.log('\n[1/3] Fetching total active users per version...');

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensions: [{ name: 'appVersion' }],
        metrics: [
            { name: 'activeUsers' }, // 0
            { name: 'sessions' },    // 1
        ],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            fieldName: 'streamName',
                            stringFilter: { value: 'GD MATH', matchType: 'EXACT' },
                        },
                    },
                    {
                        filter: {
                            fieldName: 'appVersion',
                            inListFilter: { values: TARGET_VERSIONS },
                        },
                    },
                ],
            },
        },
    });

    const result = {};
    (response.rows || []).forEach(r => {
        result[r.dimensionValues[0].value] = {
            totalUsers: parseInt(r.metricValues[0].value),
            sessions: parseInt(r.metricValues[1].value),
        };
    });
    return result;
}

// ─── 2. Users who viewed the Level screen (started at least one level) ─────────

async function fetchLevelScreenUsers () {
    console.log('\n[2/3] Fetching users who viewed the Level screen (started ≥1 level)...');

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensions: [{ name: 'appVersion' }],
        metrics: [
            { name: 'activeUsers' },     // 0
            { name: 'screenPageViews' }, // 1
        ],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            fieldName: 'streamName',
                            stringFilter: { value: 'GD MATH', matchType: 'EXACT' },
                        },
                    },
                    {
                        filter: {
                            fieldName: 'appVersion',
                            inListFilter: { values: TARGET_VERSIONS },
                        },
                    },
                    {
                        filter: {
                            fieldName: 'unifiedScreenName',
                            stringFilter: { value: 'Level', matchType: 'EXACT' },
                        },
                    },
                ],
            },
        },
    });

    const result = {};
    (response.rows || []).forEach(r => {
        result[r.dimensionValues[0].value] = {
            users: parseInt(r.metricValues[0].value),
            levelViews: parseInt(r.metricValues[1].value),
        };
    });
    return result;
}

// ─── 3. Users who fired SubscriptionOpened (trial exhausted) ──────────────────
// SubscriptionOpened fires in ScreenManager when playedTime > freeTrialMinutes (30 min)
// before redirecting to the Subscription screen. This is the authoritative trial-expired proxy.

async function fetchTrialExhaustedUsers () {
    console.log('\n[3/3] Fetching users who fired SubscriptionOpened (trial exhausted)...');

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensions: [{ name: 'appVersion' }],
        metrics: [
            { name: 'activeUsers' },  // 0
            { name: 'eventCount' },   // 1
        ],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            fieldName: 'streamName',
                            stringFilter: { value: 'GD MATH', matchType: 'EXACT' },
                        },
                    },
                    {
                        filter: {
                            fieldName: 'appVersion',
                            inListFilter: { values: TARGET_VERSIONS },
                        },
                    },
                    {
                        filter: {
                            fieldName: 'eventName',
                            stringFilter: { value: 'SubscriptionOpened', matchType: 'EXACT' },
                        },
                    },
                ],
            },
        },
    });

    const result = {};
    (response.rows || []).forEach(r => {
        result[r.dimensionValues[0].value] = {
            users: parseInt(r.metricValues[0].value),
            events: parseInt(r.metricValues[1].value),
        };
    });
    return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║    GD-Math — Level & Trial Funnel by Version (GA4 API)          ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`Property : ${PROPERTY}`);
    console.log(`Window   : ${START_DATE} → ${END_DATE}`);
    console.log(`Versions : ${TARGET_VERSIONS.join('  ')}`);

    const [totals, levelUsers, trialUsers] = await Promise.all([
        fetchTotalUsersByVersion(),
        fetchLevelScreenUsers(),
        fetchTrialExhaustedUsers(),
    ]);

    // ── Grand totals across all versions ──────────────────────────────────────
    let grandTotal = 0, grandLevel = 0, grandTrial = 0;
    TARGET_VERSIONS.forEach(v => {
        grandTotal += totals[v]?.totalUsers || 0;
        grandLevel += levelUsers[v]?.users  || 0;
        grandTrial += trialUsers[v]?.users  || 0;
    });

    // ── Per-version table ──────────────────────────────────────────────────────
    const maxLevel = Math.max(...TARGET_VERSIONS.map(v => levelUsers[v]?.users || 0), 1);
    const maxTrial = Math.max(...TARGET_VERSIONS.map(v => trialUsers[v]?.users || 0), 1);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Q1. USERS WHO STARTED AT LEAST ONE LEVEL  (visited "Level" screen)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ${'Version'.padEnd(12)} ${'Total Users'.padEnd(13)} ${'Level Users'.padEnd(13)} ${'% of Total'.padEnd(12)} ${'Level Views'.padEnd(12)} Bar`);
    console.log(`   ${'─'.repeat(12)} ${'─'.repeat(13)} ${'─'.repeat(13)} ${'─'.repeat(12)} ${'─'.repeat(12)} ${'─'.repeat(20)}`);

    const rows = TARGET_VERSIONS.map(version => {
        const tot   = totals[version]?.totalUsers || 0;
        const lev   = levelUsers[version]?.users  || 0;
        const views = levelUsers[version]?.levelViews || 0;
        return { version, tot, lev, views };
    });

    rows.forEach(r => {
        console.log(
            `   ${pad(r.version, 12)} ${pad(r.tot.toLocaleString(), 13)} ${pad(r.lev.toLocaleString(), 13)} ${pad(pct(r.lev, r.tot), 12)} ${pad(r.views.toLocaleString(), 12)} ${bar(r.lev, maxLevel)}`
        );
    });

    console.log(`   ${'─'.repeat(12)} ${'─'.repeat(13)} ${'─'.repeat(13)} ${'─'.repeat(12)} ${'─'.repeat(12)} ${'─'.repeat(20)}`);
    console.log(
        `   ${'TOTAL (all)'.padEnd(12)} ${pad(grandTotal.toLocaleString(), 13)} ${pad(grandLevel.toLocaleString(), 13)} ${pad(pct(grandLevel, grandTotal), 12)}`
    );

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Q2. USERS WHO EXHAUSTED THE FREE TRIAL  (SubscriptionOpened event)');
    console.log('    → fired by ScreenManager when playedTime > 30 min (freeTrialMinutes)');
    console.log('    → implies user was directed to the Subscription screen automatically');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ${'Version'.padEnd(12)} ${'Total Users'.padEnd(13)} ${'Trial Users'.padEnd(13)} ${'% of Total'.padEnd(12)} ${'% of LevelU'.padEnd(13)} ${'Events'.padEnd(8)} Bar`);
    console.log(`   ${'─'.repeat(12)} ${'─'.repeat(13)} ${'─'.repeat(13)} ${'─'.repeat(12)} ${'─'.repeat(13)} ${'─'.repeat(8)} ${'─'.repeat(20)}`);

    rows.forEach(r => {
        const tri = trialUsers[r.version]?.users  || 0;
        const ev  = trialUsers[r.version]?.events || 0;
        console.log(
            `   ${pad(r.version, 12)} ${pad(r.tot.toLocaleString(), 13)} ${pad(tri.toLocaleString(), 13)} ${pad(pct(tri, r.tot), 12)} ${pad(pct(tri, r.lev), 13)} ${pad(ev.toLocaleString(), 8)} ${bar(tri, maxTrial)}`
        );
    });

    console.log(`   ${'─'.repeat(12)} ${'─'.repeat(13)} ${'─'.repeat(13)} ${'─'.repeat(12)} ${'─'.repeat(13)} ${'─'.repeat(8)} ${'─'.repeat(20)}`);
    console.log(
        `   ${'TOTAL (all)'.padEnd(12)} ${pad(grandTotal.toLocaleString(), 13)} ${pad(grandTrial.toLocaleString(), 13)} ${pad(pct(grandTrial, grandTotal), 12)} ${pad(pct(grandTrial, grandLevel), 13)}`
    );

    // ── Combined funnel summary ────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('FUNNEL SUMMARY (all versions combined)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   All users              : ${grandTotal.toLocaleString()}`);
    console.log(`   Started ≥1 level       : ${grandLevel.toLocaleString()}  (${pct(grandLevel, grandTotal)} of all users)`);
    console.log(`   Trial exhausted (30m+) : ${grandTrial.toLocaleString()}  (${pct(grandTrial, grandTotal)} of all users  |  ${pct(grandTrial, grandLevel)} of level players)`);
    console.log('');
    console.log(`   All users ──(${pct(grandLevel, grandTotal)})──► Started Level ──(${pct(grandTrial, grandLevel)})──► Trial Exhausted`);
    console.log('');
    console.log('   ⓘ  Note: user counts are not deduplicated across versions.');
    console.log('      A user who updated from v4.3.15 → v4.3.19 appears in both rows.');
    console.log('      Use BigQuery for exact unique cross-version user counts.');

    // ── Save JSON ──────────────────────────────────────────────────────────────
    const output = {
        source: 'GA4 Reporting API',
        generatedAt: new Date().toISOString(),
        window: { start: START_DATE, end: END_DATE },
        methodology: {
            startedLevel: 'activeUsers who viewed unifiedScreenName="Level" at least once',
            trialExhausted: 'activeUsers who fired SubscriptionOpened event; fired by ScreenManager when playedTime > freeTrialMinutes (30 min)',
            caveat: 'User counts are not deduplicated across app versions. Per-user duration thresholds (≥29 min) require BigQuery.',
        },
        summary: {
            grandTotal,
            startedLevel: grandLevel,
            trialExhausted: grandTrial,
            startedLevelPct: parseFloat(pct(grandLevel, grandTotal)),
            trialExhaustedPctOfTotal: parseFloat(pct(grandTrial, grandTotal)),
            trialExhaustedPctOfLevelPlayers: parseFloat(pct(grandTrial, grandLevel)),
        },
        byVersion: TARGET_VERSIONS.reduce((acc, version) => {
            const tot   = totals[version]?.totalUsers || 0;
            const lev   = levelUsers[version]?.users  || 0;
            const lviews = levelUsers[version]?.levelViews || 0;
            const tri   = trialUsers[version]?.users  || 0;
            const tev   = trialUsers[version]?.events || 0;
            acc[version] = {
                totalUsers: tot,
                sessions: totals[version]?.sessions || 0,
                startedLevel: {
                    users: lev,
                    levelScreenViews: lviews,
                    pctOfTotalUsers: pct(lev, tot),
                },
                trialExhausted: {
                    users: tri,
                    subscriptionOpenedEvents: tev,
                    pctOfTotalUsers: pct(tri, tot),
                    pctOfLevelPlayers: pct(tri, lev),
                    avgTriggersPerUser: tri > 0 ? parseFloat((tev / tri).toFixed(2)) : 0,
                },
            };
            return acc;
        }, {}),
    };

    const outPath = path.resolve(__dirname, '../data/trial_funnel_by_version.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ Saved → data/trial_funnel_by_version.json');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
    console.error('\nFatal error:', err.message);
    if (err.message.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
        console.error('→ Run: source setup_credentials.sh');
    }
    process.exit(1);
});
