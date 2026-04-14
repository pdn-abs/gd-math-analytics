// Time spent on Level screen per app version — GA4 Reporting API
//
// Fetches userEngagementDuration and screenPageViews broken down by
// appVersion × unifiedScreenName for the specified versions and date window.
//
// GA4 does not expose a direct "time on screen" metric.
// userEngagementDuration per (appVersion, screen) is the best available proxy —
// it measures foreground engagement time while that screen dimension was active.
//
// Prerequisites:
//   Run: source setup_credentials.sh
//   (Sets GOOGLE_APPLICATION_CREDENTIALS to keys/*.json)
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

function formatDuration (sec) {
    const s = Math.round(sec);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
}

function bar (value, max, width = 20) {
    if (!max || max === 0) return '░'.repeat(width);
    const filled = Math.round((value / max) * width);
    return '█'.repeat(Math.min(filled, width)) + '░'.repeat(Math.max(width - filled, 0));
}

function pad (str, len) {
    return String(str).padEnd(len).slice(0, len);
}

// ─── Fetch all screens for the target versions ────────────────────────────────

async function fetchScreenTimeByVersion () {
    console.log('\n[1/2] Querying screen engagement time by version × screen...');

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensions: [
            { name: 'appVersion' },
            { name: 'unifiedScreenName' },
        ],
        metrics: [
            { name: 'userEngagementDuration' }, // 0 — total seconds (foreground)
            { name: 'screenPageViews' },         // 1 — total screen view events
            { name: 'activeUsers' },             // 2 — unique users who saw this screen
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
        orderBys: [
            { dimension: { dimensionName: 'appVersion' }, desc: false },
            { metric: { metricName: 'userEngagementDuration' }, desc: true },
        ],
        limit: 10000,
    });

    return response.rows || [];
}

// ─── Fetch version totals (for % of total time on screen) ─────────────────────

async function fetchVersionTotals () {
    console.log('\n[2/2] Querying total engagement duration per version...');

    const [response] = await client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
        dimensions: [{ name: 'appVersion' }],
        metrics: [
            { name: 'userEngagementDuration' }, // 0
            { name: 'activeUsers' },            // 1
            { name: 'sessions' },               // 2
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

    const totals = {};
    (response.rows || []).forEach(r => {
        totals[r.dimensionValues[0].value] = {
            totalEngageSec: parseFloat(r.metricValues[0].value),
            activeUsers: parseInt(r.metricValues[1].value),
            sessions: parseInt(r.metricValues[2].value),
        };
    });
    return totals;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║       GD-Math — Level Screen Time by App Version (GA4 API)      ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`Property : ${PROPERTY}`);
    console.log(`Window   : ${START_DATE} → ${END_DATE}`);
    console.log(`Versions : ${TARGET_VERSIONS.join('  ')}`);

    const [rows, versionTotals] = await Promise.all([
        fetchScreenTimeByVersion(),
        fetchVersionTotals(),
    ]);

    if (rows.length === 0) {
        console.log('\n⚠  No data returned. Possible causes:');
        console.log('   1. Version strings differ in GA4 (run debug_versions.js to check exact values).');
        console.log('   2. Stream name mismatch — try "GD Math" instead of "GD MATH".');
        console.log('   3. screen_view events not tracked in Firebase Analytics.');
        process.exit(0);
    }

    // ── Group rows by version ──────────────────────────────────────────────────
    const byVersion = {};
    rows.forEach(r => {
        const version = r.dimensionValues[0].value;
        const screen  = r.dimensionValues[1].value || '(unknown)';
        const engageSec   = parseFloat(r.metricValues[0].value);
        const pageViews   = parseInt(r.metricValues[1].value);
        const uniqueUsers = parseInt(r.metricValues[2].value);

        if (!byVersion[version]) byVersion[version] = [];
        byVersion[version].push({ screen, engageSec, pageViews, uniqueUsers });
    });

    // Identify level-related screen names across all versions
    const allScreenNames = new Set(rows.map(r => r.dimensionValues[1].value || ''));
    const levelScreens   = [...allScreenNames].filter(s => /level/i.test(s));

    // ══ Print report ════════════════════════════════════════════════════════════

    if (levelScreens.length > 0) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('DETECTED LEVEL-RELATED SCREEN NAMES');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        levelScreens.forEach(s => console.log(`  • ${s}`));
    }

    const outputByVersion = {};

    for (const version of TARGET_VERSIONS) {
        const screens = byVersion[version];
        const vTotals = versionTotals[version];

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`  ${version}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (!screens || screens.length === 0) {
            console.log('   ⚠  No screen data for this version in the given window.');
            outputByVersion[version] = { versionTotal: vTotals || null, screens: [] };
            continue;
        }

        if (vTotals) {
            const avgEngagePerUser = vTotals.activeUsers > 0
                ? vTotals.totalEngageSec / vTotals.activeUsers
                : 0;
            console.log(`   Active Users      : ${vTotals.activeUsers.toLocaleString()}`);
            console.log(`   Sessions          : ${vTotals.sessions.toLocaleString()}`);
            console.log(`   Total Engagement  : ${formatDuration(vTotals.totalEngageSec)}`);
            console.log(`   Avg / User        : ${formatDuration(avgEngagePerUser)}`);
        }

        const maxEngage = screens[0]?.engageSec || 1;

        // Highlight level screens
        const levelSet = new Set(levelScreens);

        console.log('');
        console.log(`   ${'Screen'.padEnd(26)} ${'Engage Time'.padEnd(14)} ${'Views'.padEnd(8)} ${'Users'.padEnd(8)} ${'% of Total'.padEnd(10)} Bar`);
        console.log(`   ${'─'.repeat(26)} ${'─'.repeat(14)} ${'─'.repeat(8)} ${'─'.repeat(8)} ${'─'.repeat(10)} ${'─'.repeat(20)}`);

        const screenRows = screens.map(s => {
            const pctOfTotal = vTotals && vTotals.totalEngageSec > 0
                ? (100 * s.engageSec / vTotals.totalEngageSec).toFixed(1)
                : '—';
            const marker = levelSet.has(s.screen) ? ' ◄' : '';
            return { ...s, pctOfTotal, marker };
        });

        screenRows.forEach(s => {
            const name = pad(s.screen + s.marker, 26);
            const dur  = pad(formatDuration(s.engageSec), 14);
            const pv   = pad(s.pageViews.toLocaleString(), 8);
            const uu   = pad(s.uniqueUsers.toLocaleString(), 8);
            const pct  = pad(`${s.pctOfTotal}%`, 10);
            const b    = bar(s.engageSec, maxEngage);
            console.log(`   ${name} ${dur} ${pv} ${uu} ${pct} ${b}`);
        });

        // Level screen summary
        const levelEntries = screenRows.filter(s => levelSet.has(s.screen));
        if (levelEntries.length > 0) {
            const totalLevelSec   = levelEntries.reduce((a, s) => a + s.engageSec, 0);
            const totalLevelViews = levelEntries.reduce((a, s) => a + s.pageViews, 0);
            const pctOfTotal      = vTotals && vTotals.totalEngageSec > 0
                ? (100 * totalLevelSec / vTotals.totalEngageSec).toFixed(1) : '—';
            const avgPerView      = totalLevelViews > 0
                ? totalLevelSec / totalLevelViews : 0;

            console.log('');
            console.log('   ── Level screen(s) summary ──');
            console.log(`   Total engagement   : ${formatDuration(totalLevelSec)}  (${pctOfTotal}% of version total)`);
            console.log(`   Total screen views : ${totalLevelViews.toLocaleString()}`);
            console.log(`   Avg time / view    : ${formatDuration(avgPerView)}`);
        }

        outputByVersion[version] = {
            versionTotal: vTotals || null,
            screens: screenRows.map(({ marker, ...rest }) => rest),
            levelScreensSummary: levelEntries.length > 0 ? {
                totalEngageSec: levelEntries.reduce((a, s) => a + s.engageSec, 0),
                totalPageViews: levelEntries.reduce((a, s) => a + s.pageViews, 0),
                screens: levelEntries.map(({ marker, ...rest }) => rest),
            } : null,
        };
    }

    // ── Cross-version level screen comparison ──────────────────────────────────
    if (levelScreens.length > 0) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('LEVEL SCREEN — CROSS-VERSION COMPARISON');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   ${'Version'.padEnd(12)} ${'Engage Time'.padEnd(14)} ${'% Total'.padEnd(10)} ${'Views'.padEnd(8)} ${'Avg/View'.padEnd(12)} Bar`);
        console.log(`   ${'─'.repeat(12)} ${'─'.repeat(14)} ${'─'.repeat(10)} ${'─'.repeat(8)} ${'─'.repeat(12)} ${'─'.repeat(20)}`);

        const crossVersionData = TARGET_VERSIONS.map(version => {
            const screens = byVersion[version] || [];
            const levelEntries = screens.filter(s => /level/i.test(s.screen));
            const totalLevelSec   = levelEntries.reduce((a, s) => a + s.engageSec, 0);
            const totalLevelViews = levelEntries.reduce((a, s) => a + s.pageViews, 0);
            const vTotals = versionTotals[version];
            const pctOfTotal = vTotals && vTotals.totalEngageSec > 0
                ? (100 * totalLevelSec / vTotals.totalEngageSec).toFixed(1) : '—';
            const avgPerView = totalLevelViews > 0 ? totalLevelSec / totalLevelViews : 0;
            return { version, totalLevelSec, totalLevelViews, pctOfTotal, avgPerView };
        });

        const maxLevelSec = Math.max(...crossVersionData.map(d => d.totalLevelSec), 1);

        crossVersionData.forEach(d => {
            const v   = pad(d.version, 12);
            const dur = pad(formatDuration(d.totalLevelSec), 14);
            const pct = pad(`${d.pctOfTotal}%`, 10);
            const pv  = pad(d.totalLevelViews.toLocaleString(), 8);
            const apv = pad(formatDuration(d.avgPerView), 12);
            const b   = bar(d.totalLevelSec, maxLevelSec);
            console.log(`   ${v} ${dur} ${pct} ${pv} ${apv} ${b}`);
        });
    }

    // ── Save JSON ──────────────────────────────────────────────────────────────
    const output = {
        source: 'GA4 Reporting API',
        generatedAt: new Date().toISOString(),
        window: { start: START_DATE, end: END_DATE },
        targetVersions: TARGET_VERSIONS,
        detectedLevelScreenNames: levelScreens,
        byVersion: outputByVersion,
        note: [
            'userEngagementDuration = total foreground engagement seconds attributed to a screen by GA4.',
            'GA4 does not expose native "time on screen". This metric is the best available proxy.',
            'screenPageViews = number of screen_view events for that screen.',
            'Avg time/view = userEngagementDuration / screenPageViews (approximation).',
        ],
    };

    const outPath = path.resolve(__dirname, '../data/level_screen_time_by_version.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✓ Saved → data/level_screen_time_by_version.json`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
    console.error('\nFatal error:', err.message);
    if (err.message.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
        console.error('→ Run: source setup_credentials.sh');
    }
    process.exit(1);
});
