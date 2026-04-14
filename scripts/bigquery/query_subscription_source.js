// SubscriptionOpened source analysis — BigQuery
//
// Separates "trial expired" from "manual tap" SubscriptionOpened events
// by inspecting firebase_previous_screen on the screen_view{firebase_screen="Subscription"}
// event that co-fires with each navigation to the Subscription screen.
//
// GA4 / Firebase automatically records firebase_previous_screen on every
// screen_view event, giving us the preceding screen without any guesswork.
//
// Source classification:
//   • Level    → trial_expired  (ScreenManager redirected after playedTime > 30 min)
//   • Home     → manual_tap     (user pressed the Subscription button on the Home screen)
//   • Other    → other          (e.g. Settings, About — edge cases)
//
// Versions: v4.3.21 | v4.3.19 | v4.3.15 | v4.3.12 | v4.3.7 | v4.3.5 | v4.3.2 | v4.3.0
// Window  : 2026-01-25 → 2026-03-25
//
// Prerequisites:
//   - GA4 → BigQuery linking enabled
//   - Service account: roles/bigquery.dataViewer + roles/bigquery.jobUser
//   - Dataset: analytics_441470574  (GA4 property: 441470574)

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const KEY_FILE    = path.resolve(__dirname, '../../keys/gd-math-71c48-7553a3a1322b.json');
const PROJECT_ID  = 'gd-math-71c48';
const DATASET     = 'analytics_441470574';
const LOCATION    = 'asia-south1';
const START_DATE  = '20260125';
const END_DATE    = '20260325';

const TARGET_VERSIONS = [
    'v4.3.21', 'v4.3.19', 'v4.3.15', 'v4.3.12',
    'v4.3.7',  'v4.3.5',  'v4.3.2',  'v4.3.0',
];

const client = new BigQuery({ projectId: PROJECT_ID, keyFilename: KEY_FILE, location: LOCATION });

function pct (num, den) {
    if (!den || den === 0) return '—';
    return (100 * num / den).toFixed(1) + '%';
}

function pad (str, len) {
    return String(str).padEnd(len).slice(0, len);
}

function bar (value, max, width = 18) {
    if (!max || max === 0) return '░'.repeat(width);
    const filled = Math.min(Math.round((value / max) * width), width);
    return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// ─── 1. Per-event breakdown: source screen → version ──────────────────────────
//
// For each screen_view where firebase_screen = "Subscription", extract:
//   - app version
//   - firebase_previous_screen (the screen user came from)
//
// This gives 1 row per navigation to the Subscription screen.
// We count distinct users (not events) to match Q2 from the GA4 script.

async function fetchSubscriptionSourceByVersion () {
    console.log('\n[1/2] Fetching Subscription screen navigations by source and version...');

    const versionList = TARGET_VERSIONS.map(v => `'${v}'`).join(', ');

    const query = `
        WITH sub_screen_views AS (
            SELECT
                user_pseudo_id,
                event_timestamp,
                app_info.version                                                              AS app_version,
                (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'firebase_previous_screen')
                                                                                              AS prev_screen,
                (SELECT value.int_value    FROM UNNEST(event_params) WHERE key = 'ga_session_id')
                                                                                              AS session_id
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'screen_view'
              AND (
                  SELECT value.string_value
                  FROM UNNEST(event_params)
                  WHERE key = 'firebase_screen'
              ) = 'Subscription'
              AND app_info.version IN (${versionList})
        ),
        classified AS (
            SELECT
                user_pseudo_id,
                app_version,
                session_id,
                event_timestamp,
                prev_screen,
                CASE
                    WHEN prev_screen = 'Level' THEN 'trial_expired'
                    WHEN prev_screen = 'Home'  THEN 'manual_tap'
                    ELSE                            'other'
                END AS source
            FROM sub_screen_views
        )
        SELECT
            app_version,
            source,
            prev_screen,
            COUNT(*)                        AS total_events,
            COUNT(DISTINCT user_pseudo_id)  AS unique_users,
            COUNT(DISTINCT CONCAT(user_pseudo_id, CAST(session_id AS STRING)))
                                            AS unique_sessions
        FROM classified
        GROUP BY app_version, source, prev_screen
        ORDER BY app_version, source, total_events DESC
    `;

    const [rows] = await client.query({ query, location: LOCATION });
    return rows;
}

// ─── 2. Per-user summary: was their first SubscriptionOpened trial or manual? ──
//
// For users who hit the subscription screen multiple times, classify each user
// by whether they EVER had a trial_expired navigation (the more meaningful signal).

async function fetchPerUserClassification () {
    console.log('\n[2/2] Fetching per-user classification (trial vs manual)...');

    const versionList = TARGET_VERSIONS.map(v => `'${v}'`).join(', ');

    const query = `
        WITH sub_screen_views AS (
            SELECT
                user_pseudo_id,
                app_info.version AS app_version,
                (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'firebase_previous_screen')
                                 AS prev_screen,
                event_timestamp
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'screen_view'
              AND (
                  SELECT value.string_value
                  FROM UNNEST(event_params)
                  WHERE key = 'firebase_screen'
              ) = 'Subscription'
              AND app_info.version IN (${versionList})
        ),
        per_user AS (
            SELECT
                user_pseudo_id,
                app_version,
                COUNT(*)                                              AS total_sub_views,
                COUNTIF(prev_screen = 'Level')                        AS trial_expired_hits,
                COUNTIF(prev_screen = 'Home')                         AS manual_tap_hits,
                COUNTIF(prev_screen NOT IN ('Level', 'Home'))         AS other_hits,
                MIN(event_timestamp)                                  AS first_sub_ts
            FROM sub_screen_views
            GROUP BY user_pseudo_id, app_version
        )
        SELECT
            app_version,
            -- User classification: trial_expired takes precedence if it ever happened
            CASE
                WHEN trial_expired_hits > 0  THEN 'trial_expired'
                WHEN manual_tap_hits    > 0  THEN 'manual_tap'
                ELSE                              'other'
            END                               AS user_source,
            COUNT(*)                          AS users,
            SUM(total_sub_views)              AS total_sub_views,
            SUM(trial_expired_hits)           AS trial_expired_events,
            SUM(manual_tap_hits)              AS manual_tap_events
        FROM per_user
        GROUP BY app_version, user_source
        ORDER BY app_version, users DESC
    `;

    const [rows] = await client.query({ query, location: LOCATION });
    return rows;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║   GD-Math — SubscriptionOpened Source Analysis (BigQuery)       ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`Dataset  : ${PROJECT_ID}.${DATASET}`);
    console.log(`Window   : ${START_DATE} → ${END_DATE}`);
    console.log(`Versions : ${TARGET_VERSIONS.join('  ')}`);

    const [eventRows, userRows] = await Promise.all([
        fetchSubscriptionSourceByVersion(),
        fetchPerUserClassification(),
    ]);

    // ── Organise event rows by version ────────────────────────────────────────
    const eventsByVersion = {};
    eventRows.forEach(r => {
        if (!eventsByVersion[r.app_version]) eventsByVersion[r.app_version] = [];
        eventsByVersion[r.app_version].push(r);
    });

    // ── Organise user rows by version ─────────────────────────────────────────
    const usersByVersion = {};
    userRows.forEach(r => {
        if (!usersByVersion[r.app_version]) usersByVersion[r.app_version] = {};
        usersByVersion[r.app_version][r.user_source] = r;
    });

    // ══ SECTION 1 — What screens do users navigate FROM to reach Subscription? ══
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. NAVIGATION SOURCE → SUBSCRIPTION SCREEN  (events breakdown)');
    console.log('   Source screen is firebase_previous_screen on the screen_view event.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    for (const version of TARGET_VERSIONS) {
        const rows = eventsByVersion[version];
        if (!rows || rows.length === 0) {
            console.log(`\n  ${version}  — no data`);
            continue;
        }

        const totalEvents = rows.reduce((s, r) => s + Number(r.total_events), 0);
        const totalUsers  = rows.reduce((s, r) => s + Number(r.unique_users), 0);
        const maxEvents   = Math.max(...rows.map(r => Number(r.total_events)), 1);

        console.log(`\n  ${version}  (${totalEvents} navigations, ${totalUsers} unique users)`);
        console.log(`  ${'Prev Screen'.padEnd(20)} ${'Source'.padEnd(16)} ${'Events'.padEnd(8)} ${'Users'.padEnd(8)} ${'%'.padEnd(8)} Bar`);
        console.log(`  ${'─'.repeat(20)} ${'─'.repeat(16)} ${'─'.repeat(8)} ${'─'.repeat(8)} ${'─'.repeat(8)} ${'─'.repeat(18)}`);

        rows.forEach(r => {
            const ev = Number(r.total_events);
            const uu = Number(r.unique_users);
            const label = r.source === 'trial_expired' ? 'trial_expired ◄' : r.source;
            console.log(
                `  ${pad(r.prev_screen || '(null)', 20)} ${pad(label, 16)} ${pad(ev, 8)} ${pad(uu, 8)} ${pad(pct(ev, totalEvents), 8)} ${bar(ev, maxEvents)}`
            );
        });
    }

    // ══ SECTION 2 — Per-user classification ═══════════════════════════════════
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2. PER-USER CLASSIFICATION BY VERSION');
    console.log('   Users are classified by whether they EVER hit a trial_expired path.');
    console.log('   (trial_expired takes precedence over manual_tap for the same user.)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  ${'Version'.padEnd(12)} ${'Trial Expired'.padEnd(16)} ${'Manual Tap'.padEnd(14)} ${'Other'.padEnd(8)} ${'Total'.padEnd(8)} ${'Trial%'.padEnd(9)} ${'Manual%'}`);
    console.log(`  ${'─'.repeat(12)} ${'─'.repeat(16)} ${'─'.repeat(14)} ${'─'.repeat(8)} ${'─'.repeat(8)} ${'─'.repeat(9)} ${'─'.repeat(9)}`);

    let gTrialTotal = 0, gManualTotal = 0, gOtherTotal = 0;

    for (const version of TARGET_VERSIONS) {
        const vData = usersByVersion[version] || {};
        const trial  = Number(vData['trial_expired']?.users  || 0);
        const manual = Number(vData['manual_tap']?.users     || 0);
        const other  = Number(vData['other']?.users          || 0);
        const total  = trial + manual + other;
        gTrialTotal  += trial;
        gManualTotal += manual;
        gOtherTotal  += other;
        console.log(
            `  ${pad(version, 12)} ${pad(trial, 16)} ${pad(manual, 14)} ${pad(other, 8)} ${pad(total, 8)} ${pad(pct(trial, total), 9)} ${pct(manual, total)}`
        );
    }

    const gTotal = gTrialTotal + gManualTotal + gOtherTotal;
    console.log(`  ${'─'.repeat(12)} ${'─'.repeat(16)} ${'─'.repeat(14)} ${'─'.repeat(8)} ${'─'.repeat(8)} ${'─'.repeat(9)} ${'─'.repeat(9)}`);
    console.log(
        `  ${'TOTAL'.padEnd(12)} ${pad(gTrialTotal, 16)} ${pad(gManualTotal, 14)} ${pad(gOtherTotal, 8)} ${pad(gTotal, 8)} ${pad(pct(gTrialTotal, gTotal), 9)} ${pct(gManualTotal, gTotal)}`
    );

    // ══ SECTION 3 — Plain-language summary ════════════════════════════════════
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('3. SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total unique users who reached Subscription screen : ${gTotal}`);
    console.log(`   — Trial expired (came from Level screen)           : ${gTrialTotal}  (${pct(gTrialTotal, gTotal)} of subscription viewers)`);
    console.log(`   — Manual tap   (came from Home screen)             : ${gManualTotal}  (${pct(gManualTotal, gTotal)} of subscription viewers)`);
    console.log(`   — Other source                                     : ${gOtherTotal}  (${pct(gOtherTotal, gTotal)} of subscription viewers)`);
    console.log('');
    console.log('   ⓘ  Q2 from fetch_trial_funnel_by_version.js counted ALL SubscriptionOpened');
    console.log(`      users (${gTotal} total). This query shows ${gTrialTotal} of those were genuinely`);
    console.log(`      trial-expired, and ${gManualTotal} opened it manually from the Home screen.`);
    console.log('');
    console.log('   ⓘ  Note: user counts are per-version (not deduplicated across versions).');

    // ── Save JSON ──────────────────────────────────────────────────────────────
    const output = {
        source: 'BigQuery (GA4 raw events)',
        generatedAt: new Date().toISOString(),
        window: { start: START_DATE, end: END_DATE },
        targetVersions: TARGET_VERSIONS,
        methodology: {
            screen: 'Subscription screen_view events (event_name = "screen_view", firebase_screen = "Subscription")',
            sourceField: 'firebase_previous_screen param on each screen_view event',
            classification: {
                trial_expired: 'prev screen = "Level" — ScreenManager redirected after trial timer expired',
                manual_tap: 'prev screen = "Home" — user tapped Subscription button on Home screen',
                other: 'any other preceding screen',
            },
            userClassification: 'User classified as trial_expired if ANY of their subscription navigations came from Level; otherwise manual_tap',
        },
        summary: {
            totalUsers: gTotal,
            trialExpired: { users: gTrialTotal, pct: pct(gTrialTotal, gTotal) },
            manualTap:    { users: gManualTotal, pct: pct(gManualTotal, gTotal) },
            other:        { users: gOtherTotal,  pct: pct(gOtherTotal, gTotal) },
        },
        byVersion: TARGET_VERSIONS.reduce((acc, version) => {
            const vData  = usersByVersion[version] || {};
            const eData  = eventsByVersion[version] || [];
            const trial  = Number(vData['trial_expired']?.users || 0);
            const manual = Number(vData['manual_tap']?.users    || 0);
            const other  = Number(vData['other']?.users         || 0);
            acc[version] = {
                totalUsers: trial + manual + other,
                trialExpired: { users: trial,  pct: pct(trial,  trial + manual + other) },
                manualTap:    { users: manual, pct: pct(manual, trial + manual + other) },
                other:        { users: other,  pct: pct(other,  trial + manual + other) },
                eventBreakdownByPrevScreen: eData.map(r => ({
                    prevScreen: r.prev_screen,
                    source:     r.source,
                    events:     Number(r.total_events),
                    users:      Number(r.unique_users),
                    sessions:   Number(r.unique_sessions),
                })),
            };
            return acc;
        }, {}),
    };

    const outPath = path.resolve(__dirname, '../data/subscription_source_by_version.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ Saved → data/subscription_source_by_version.json');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
    console.error('\nFatal error:', err.message);
    process.exit(1);
});
