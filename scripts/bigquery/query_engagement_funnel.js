// Engagement funnel — BigQuery
// Users who completed segments, dropped segments, and completed assessment
// Window: 2026-01-25 → 2026-03-25
// Versions: v4.3.21 | v4.3.19 | v4.3.15 | v4.3.12 | v4.3.7 | v4.3.5 | v4.3.2 | v4.3.0

const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
const fs = require('fs');

const KEY_FILE   = path.resolve(__dirname, '../../keys/gd-math-71c48-7553a3a1322b.json');
const PROJECT_ID = 'gd-math-71c48';
const DATASET    = 'analytics_441470574';
const LOCATION   = 'asia-south1';
const START_DATE = '20260125';
const END_DATE   = '20260325';

const TARGET_VERSIONS = [
    'v4.3.21', 'v4.3.19', 'v4.3.15', 'v4.3.12',
    'v4.3.7',  'v4.3.5',  'v4.3.2',  'v4.3.0',
];

const client = new BigQuery({ projectId: PROJECT_ID, keyFilename: KEY_FILE, location: LOCATION });

function pct(num, den) {
    if (!den || den === 0) return '—';
    return (100 * num / den).toFixed(1) + '%';
}
function pad(str, len) { return String(str).padEnd(len).slice(0, len); }
function bar(value, max, width = 18) {
    if (!max) return '░'.repeat(width);
    const f = Math.min(Math.round((value / max) * width), width);
    return '█'.repeat(f) + '░'.repeat(width - f);
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║   GD-Math — Engagement Funnel by Version (BigQuery)             ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`Window   : ${START_DATE} → ${END_DATE}`);
    console.log(`Versions : ${TARGET_VERSIONS.join('  ')}`);

    const versionList = TARGET_VERSIONS.map(v => `'${v}'`).join(', ');

    // ── Single query — per-version, per-event unique users + event counts ──────
    console.log('\nQuerying BigQuery...');
    const query = `
        WITH base AS (
            SELECT
                user_pseudo_id,
                app_info.version                        AS app_version,
                event_name,
                COUNT(*)                                AS event_count
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name IN ('segmentStarted', 'segmentCompleted', 'segmentDropped', 'assessmentCompleted', 'LevelLoaded')
              AND app_info.version IN (${versionList})
            GROUP BY user_pseudo_id, app_version, event_name
        )
        SELECT
            app_version,
            event_name,
            COUNT(DISTINCT user_pseudo_id) AS unique_users,
            SUM(event_count)               AS total_events,
            AVG(event_count)               AS avg_events_per_user
        FROM base
        GROUP BY app_version, event_name
        ORDER BY app_version, event_name
    `;

    // Also get total users per version (any event)
    const queryTotals = `
        SELECT
            app_info.version       AS app_version,
            COUNT(DISTINCT user_pseudo_id) AS total_users
        FROM \`${PROJECT_ID}.${DATASET}.events_*\`
        WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
          AND app_info.version IN (${versionList})
        GROUP BY app_version
    `;

    const [[rows], [totalRows]] = await Promise.all([
        client.query({ query, location: LOCATION }),
        client.query({ query: queryTotals, location: LOCATION }),
    ]);

    // Index totals
    const totals = {};
    totalRows.forEach(r => { totals[r.app_version] = Number(r.total_users); });

    // Index event data: version → eventName → {unique_users, total_events, avg}
    const data = {};
    rows.forEach(r => {
        if (!data[r.app_version]) data[r.app_version] = {};
        data[r.app_version][r.event_name] = {
            users:  Number(r.unique_users),
            events: Number(r.total_events),
            avg:    parseFloat(Number(r.avg_events_per_user).toFixed(1)),
        };
    });

    const EVENTS = [
        { key: 'LevelLoaded',         label: 'Level Loaded'      },
        { key: 'segmentStarted',      label: 'Seg Started'       },
        { key: 'segmentCompleted',    label: 'Seg Completed'      },
        { key: 'segmentDropped',      label: 'Seg Dropped'        },
        { key: 'assessmentCompleted', label: 'Assessment Done'    },
    ];

    // ══ Per-version tables ═══════════════════════════════════════════════════
    for (const version of TARGET_VERSIONS) {
        const vData  = data[version] || {};
        const vTotal = totals[version] || 0;

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`  ${version}   (${vTotal.toLocaleString()} total users in BQ)`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`  ${'Event'.padEnd(18)} ${'Users'.padEnd(8)} ${'% Users'.padEnd(10)} ${'Events'.padEnd(9)} ${'Avg/User'.padEnd(10)} Bar`);
        console.log(`  ${'─'.repeat(18)} ${'─'.repeat(8)} ${'─'.repeat(10)} ${'─'.repeat(9)} ${'─'.repeat(10)} ${'─'.repeat(18)}`);

        const maxUsers = Math.max(...EVENTS.map(e => vData[e.key]?.users || 0), 1);
        EVENTS.forEach(e => {
            const d = vData[e.key] || { users: 0, events: 0, avg: 0 };
            console.log(
                `  ${pad(e.label, 18)} ${pad(d.users.toLocaleString(), 8)} ${pad(pct(d.users, vTotal), 10)} ${pad(d.events.toLocaleString(), 9)} ${pad(d.avg, 10)} ${bar(d.users, maxUsers)}`
            );
        });

        // Completion / drop ratios within version
        const started   = vData['segmentStarted']?.users    || 0;
        const completed = vData['segmentCompleted']?.users  || 0;
        const dropped   = vData['segmentDropped']?.users    || 0;
        const assessed  = vData['assessmentCompleted']?.users || 0;
        if (started > 0) {
            console.log('');
            console.log(`  Seg completion rate (users)  : ${pct(completed, started)}  (${completed}/${started})`);
            console.log(`  Seg drop rate      (users)   : ${pct(dropped, started)}  (${dropped}/${started})`);
        }
        if (vTotal > 0 && assessed > 0) {
            console.log(`  Assessment completion rate   : ${pct(assessed, vTotal)}  (${assessed}/${vTotal} total BQ users)`);
        }
    }

    // ══ Grand totals across all versions (deduplicated) ═════════════════════
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  CROSS-VERSION TOTALS  (users deduplicated across versions)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const dedupeQuery = `
        SELECT
            event_name,
            COUNT(DISTINCT user_pseudo_id) AS unique_users,
            SUM(cnt)                       AS total_events
        FROM (
            SELECT
                user_pseudo_id,
                event_name,
                COUNT(*) AS cnt
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name IN ('segmentStarted', 'segmentCompleted', 'segmentDropped', 'assessmentCompleted', 'LevelLoaded')
              AND app_info.version IN (${versionList})
            GROUP BY user_pseudo_id, event_name
        )
        GROUP BY event_name
        ORDER BY event_name
    `;
    const dedupeTotalsQuery = `
        SELECT COUNT(DISTINCT user_pseudo_id) AS total_users
        FROM \`${PROJECT_ID}.${DATASET}.events_*\`
        WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
          AND app_info.version IN (${versionList})
    `;

    const [[dedupeRows], [dedupeTotalsRows]] = await Promise.all([
        client.query({ query: dedupeQuery, location: LOCATION }),
        client.query({ query: dedupeTotalsQuery, location: LOCATION }),
    ]);

    const grandTotal = Number(dedupeTotalsRows[0].total_users);
    const gData = {};
    dedupeRows.forEach(r => {
        gData[r.event_name] = { users: Number(r.unique_users), events: Number(r.total_events) };
    });

    console.log(`  Total unique users (across target versions) : ${grandTotal.toLocaleString()}`);
    console.log('');
    console.log(`  ${'Event'.padEnd(22)} ${'Users'.padEnd(10)} ${'% of Total'.padEnd(13)} ${'Total Events'}`);
    console.log(`  ${'─'.repeat(22)} ${'─'.repeat(10)} ${'─'.repeat(13)} ${'─'.repeat(14)}`);

    EVENTS.forEach(e => {
        const d = gData[e.key] || { users: 0, events: 0 };
        console.log(
            `  ${pad(e.label, 22)} ${pad(d.users.toLocaleString(), 10)} ${pad(pct(d.users, grandTotal), 13)} ${d.events.toLocaleString()}`
        );
    });

    const gStarted   = gData['segmentStarted']?.users    || 0;
    const gCompleted = gData['segmentCompleted']?.users  || 0;
    const gDropped   = gData['segmentDropped']?.users    || 0;
    const gAssessed  = gData['assessmentCompleted']?.users || 0;

    console.log('');
    console.log(`  Funnel:`);
    console.log(`  Total users ──(${pct(gData['LevelLoaded']?.users || 0, grandTotal)})──► Loaded Level`);
    console.log(`              ──(${pct(gStarted, grandTotal)})──► Started Segment`);
    console.log(`              ──(${pct(gCompleted, grandTotal)})──► Completed ≥1 Segment  [${pct(gCompleted, gStarted)} of starters]`);
    console.log(`              ──(${pct(gDropped, grandTotal)})──► Dropped ≥1 Segment     [${pct(gDropped, gStarted)} of starters]`);
    console.log(`              ──(${pct(gAssessed, grandTotal)})──► Completed Assessment`);

    // ── Save JSON ─────────────────────────────────────────────────────────────
    const output = {
        source: 'BigQuery (GA4 raw events)',
        generatedAt: new Date().toISOString(),
        window: { start: START_DATE, end: END_DATE },
        targetVersions: TARGET_VERSIONS,
        grandTotal,
        summary: Object.fromEntries(
            EVENTS.map(e => [e.key, {
                uniqueUsers: gData[e.key]?.users || 0,
                totalEvents: gData[e.key]?.events || 0,
                pctOfTotalUsers: pct(gData[e.key]?.users || 0, grandTotal),
            }])
        ),
        byVersion: TARGET_VERSIONS.reduce((acc, version) => {
            const vData  = data[version] || {};
            const vTotal = totals[version] || 0;
            acc[version] = {
                totalUsers: vTotal,
                events: Object.fromEntries(
                    EVENTS.map(e => [e.key, {
                        uniqueUsers: vData[e.key]?.users || 0,
                        totalEvents: vData[e.key]?.events || 0,
                        avgPerUser:  vData[e.key]?.avg || 0,
                        pctOfTotalUsers: pct(vData[e.key]?.users || 0, vTotal),
                    }])
                ),
            };
            return acc;
        }, {}),
    };

    const outPath = path.resolve(__dirname, '../../data/engagement_funnel_by_version.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ Saved → data/engagement_funnel_by_version.json');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(e => { console.error('\nFatal error:', e.message); process.exit(1); });
