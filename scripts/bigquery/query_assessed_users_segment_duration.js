// Segment duration for the 87 users who completed assessment — BigQuery
//
// For each user who fired assessmentCompleted in the target window+versions,
// fetch all their segmentCompleted and segmentDropped events and extract the
// duration param (int_value, seconds).
//
// Outputs:
//   - Per-user summary: total play time, segments completed/dropped, avg duration
//   - Aggregate stats: p25/median/p75/p95, mean across all events
//
// Window  : 2026-01-25 → 2026-03-25
// Versions: v4.3.21 | v4.3.19 | v4.3.15 | v4.3.12 | v4.3.7 | v4.3.5 | v4.3.2 | v4.3.0

const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
const fs   = require('fs');

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

function fmt(sec) {
    const s = Math.round(sec);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
}
function pad(str, len) { return String(str).padEnd(len).slice(0, len); }
function pct(num, den) {
    if (!den) return '—';
    return (100 * num / den).toFixed(1) + '%';
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║  GD-Math — Segment Duration for Assessment Completers (BQ)      ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`Window   : ${START_DATE} → ${END_DATE}`);

    const versionList = TARGET_VERSIONS.map(v => `'${v}'`).join(', ');

    // ── Per-user summary ──────────────────────────────────────────────────────
    // CTE: assessment completers → join their segment events → extract duration
    console.log('\n[1/2] Querying per-user segment durations...');
    const perUserQuery = `
        WITH assessed_users AS (
            SELECT DISTINCT user_pseudo_id
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'assessmentCompleted'
              AND app_info.version IN (${versionList})
        ),
        segment_events AS (
            SELECT
                e.user_pseudo_id,
                e.app_info.version                                                          AS app_version,
                e.event_name,
                e.event_timestamp,
                COALESCE(
                    (SELECT ep.value.int_value   FROM UNNEST(e.event_params) ep WHERE ep.key = 'duration'),
                    (SELECT ep.value.float_value FROM UNNEST(e.event_params) ep WHERE ep.key = 'duration')
                )                                                                           AS duration_sec
            FROM \`${PROJECT_ID}.${DATASET}.events_*\` e
            INNER JOIN assessed_users a USING (user_pseudo_id)
            WHERE e._TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND e.event_name IN ('segmentCompleted', 'segmentDropped')
              AND e.app_info.version IN (${versionList})
        )
        SELECT
            user_pseudo_id,
            app_version,
            COUNTIF(event_name = 'segmentCompleted')            AS segs_completed,
            COUNTIF(event_name = 'segmentDropped')              AS segs_dropped,
            SUM(CASE WHEN event_name = 'segmentCompleted' THEN duration_sec ELSE 0 END)
                                                                AS total_completed_sec,
            SUM(CASE WHEN event_name = 'segmentDropped'  THEN duration_sec ELSE 0 END)
                                                                AS total_dropped_sec,
            SUM(duration_sec)                                   AS total_seg_sec,
            AVG(CASE WHEN event_name = 'segmentCompleted' THEN duration_sec END)
                                                                AS avg_completed_sec,
            AVG(CASE WHEN event_name = 'segmentDropped'  THEN duration_sec END)
                                                                AS avg_dropped_sec,
            MIN(duration_sec)                                   AS min_seg_sec,
            MAX(duration_sec)                                   AS max_seg_sec
        FROM segment_events
        GROUP BY user_pseudo_id, app_version
        ORDER BY total_seg_sec DESC
    `;

    // ── Aggregate distribution ─────────────────────────────────────────────────
    console.log('[2/2] Querying aggregate distribution stats...');
    const aggQuery = `
        WITH assessed_users AS (
            SELECT DISTINCT user_pseudo_id
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'assessmentCompleted'
              AND app_info.version IN (${versionList})
        ),
        segment_events AS (
            SELECT
                e.event_name,
                COALESCE(
                    (SELECT ep.value.int_value   FROM UNNEST(e.event_params) ep WHERE ep.key = 'duration'),
                    (SELECT ep.value.float_value FROM UNNEST(e.event_params) ep WHERE ep.key = 'duration')
                ) AS duration_sec
            FROM \`${PROJECT_ID}.${DATASET}.events_*\` e
            INNER JOIN assessed_users a USING (user_pseudo_id)
            WHERE e._TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND e.event_name IN ('segmentCompleted', 'segmentDropped')
              AND e.app_info.version IN (${versionList})
        )
        SELECT
            event_name,
            COUNT(*)                                            AS event_count,
            ROUND(AVG(duration_sec), 1)                        AS mean_sec,
            ROUND(MIN(duration_sec), 1)                        AS min_sec,
            ROUND(APPROX_QUANTILES(duration_sec, 100)[OFFSET(25)], 1) AS p25_sec,
            ROUND(APPROX_QUANTILES(duration_sec, 100)[OFFSET(50)], 1) AS median_sec,
            ROUND(APPROX_QUANTILES(duration_sec, 100)[OFFSET(75)], 1) AS p75_sec,
            ROUND(APPROX_QUANTILES(duration_sec, 100)[OFFSET(95)], 1) AS p95_sec,
            ROUND(MAX(duration_sec), 1)                        AS max_sec,
            ROUND(SUM(duration_sec), 0)                        AS total_sec
        FROM segment_events
        WHERE duration_sec IS NOT NULL
        GROUP BY event_name
        ORDER BY event_name
    `;

    const [[perUserRows], [aggRows]] = await Promise.all([
        client.query({ query: perUserQuery, location: LOCATION }),
        client.query({ query: aggQuery, location: LOCATION }),
    ]);

    // ══ Aggregate stats ════════════════════════════════════════════════════════
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. AGGREGATE DURATION STATS  (across all 87 assessment completers)');
    console.log('   duration = time spent on a single segment (seconds, from event param)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const aggByEvent = {};
    aggRows.forEach(r => { aggByEvent[r.event_name] = r; });

    for (const eventName of ['segmentCompleted', 'segmentDropped']) {
        const r = aggByEvent[eventName];
        if (!r) { console.log(`\n  ${eventName}: no data`); continue; }
        const count  = Number(r.event_count);
        const total  = Number(r.total_sec);
        console.log(`\n  ${eventName}  (${count.toLocaleString()} events)`);
        console.log(`  ${'Stat'.padEnd(12)} Value`);
        console.log(`  ${'─'.repeat(12)} ${'─'.repeat(12)}`);
        console.log(`  ${'Mean'.padEnd(12)} ${fmt(Number(r.mean_sec))}`);
        console.log(`  ${'Min'.padEnd(12)} ${fmt(Number(r.min_sec))}`);
        console.log(`  ${'P25'.padEnd(12)} ${fmt(Number(r.p25_sec))}`);
        console.log(`  ${'Median'.padEnd(12)} ${fmt(Number(r.median_sec))}`);
        console.log(`  ${'P75'.padEnd(12)} ${fmt(Number(r.p75_sec))}`);
        console.log(`  ${'P95'.padEnd(12)} ${fmt(Number(r.p95_sec))}`);
        console.log(`  ${'Max'.padEnd(12)} ${fmt(Number(r.max_sec))}`);
        console.log(`  ${'Total'.padEnd(12)} ${fmt(total)}  (all events summed)`);
    }

    // ══ Per-user table ═════════════════════════════════════════════════════════
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2. PER-USER BREAKDOWN  (one row per user, sorted by total segment time)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  ${'#'.padEnd(4)} ${'Version'.padEnd(10)} ${'Completed'.padEnd(11)} ${'Dropped'.padEnd(9)} ${'Total Seg Time'.padEnd(17)} ${'Avg Compl'.padEnd(12)} ${'Avg Drop'.padEnd(11)} ${'Min'.padEnd(8)} ${'Max'}`);
    console.log(`  ${'─'.repeat(4)} ${'─'.repeat(10)} ${'─'.repeat(11)} ${'─'.repeat(9)} ${'─'.repeat(17)} ${'─'.repeat(12)} ${'─'.repeat(11)} ${'─'.repeat(8)} ${'─'.repeat(8)}`);

    perUserRows.forEach((r, i) => {
        const segsC    = Number(r.segs_completed);
        const segsD    = Number(r.segs_dropped);
        const totalSec = Number(r.total_seg_sec);
        const avgC     = r.avg_completed_sec != null ? Number(r.avg_completed_sec) : null;
        const avgD     = r.avg_dropped_sec   != null ? Number(r.avg_dropped_sec)   : null;
        const minSec   = Number(r.min_seg_sec);
        const maxSec   = Number(r.max_seg_sec);

        console.log(
            `  ${pad(i + 1, 4)} ${pad(r.app_version, 10)} ${pad(segsC + ' segs', 11)} ${pad(segsD + ' segs', 9)} ${pad(fmt(totalSec), 17)} ${pad(avgC !== null ? fmt(avgC) : '—', 12)} ${pad(avgD !== null ? fmt(avgD) : '—', 11)} ${pad(fmt(minSec), 8)} ${fmt(maxSec)}`
        );
    });

    // Users with no segment events (assessed but never played a segment)
    const usersWithSegments = new Set(perUserRows.map(r => r.user_pseudo_id));
    const totalAssessed = 87;
    const noSegCount = totalAssessed - usersWithSegments.size;
    if (noSegCount > 0) {
        console.log(`\n  ⚠  ${noSegCount} assessment completer(s) had no segment events in the target versions/window.`);
    }

    // ══ Summary totals ═════════════════════════════════════════════════════════
    const totalCompleted  = perUserRows.reduce((s, r) => s + Number(r.segs_completed), 0);
    const totalDropped    = perUserRows.reduce((s, r) => s + Number(r.segs_dropped), 0);
    const totalPlaySec    = perUserRows.reduce((s, r) => s + Number(r.total_seg_sec), 0);
    const totalComplSec   = perUserRows.reduce((s, r) => s + Number(r.total_completed_sec), 0);
    const totalDropSec    = perUserRows.reduce((s, r) => s + Number(r.total_dropped_sec), 0);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('3. SUMMARY TOTALS  (assessment completers with segment data)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Users with segment data      : ${usersWithSegments.size} of ${totalAssessed} assessors`);
    console.log(`   Total segments completed     : ${totalCompleted.toLocaleString()}  (${fmt(totalComplSec)} total time)`);
    console.log(`   Total segments dropped       : ${totalDropped.toLocaleString()}  (${fmt(totalDropSec)} total time)`);
    console.log(`   Total segment play time      : ${fmt(totalPlaySec)}`);
    console.log(`   Avg total time per user      : ${fmt(totalPlaySec / (usersWithSegments.size || 1))}`);
    console.log(`   Avg completed segments/user  : ${(totalCompleted / (usersWithSegments.size || 1)).toFixed(1)}`);
    console.log(`   Avg dropped segments/user    : ${(totalDropped / (usersWithSegments.size || 1)).toFixed(1)}`);
    console.log(`   Completion ratio (events)    : ${pct(totalCompleted, totalCompleted + totalDropped)}`);

    // ── Save JSON ─────────────────────────────────────────────────────────────
    const output = {
        source: 'BigQuery (GA4 raw events)',
        generatedAt: new Date().toISOString(),
        window: { start: START_DATE, end: END_DATE },
        targetVersions: TARGET_VERSIONS,
        methodology: 'Segment events (segmentCompleted, segmentDropped) filtered to users who fired assessmentCompleted. Duration = int event param in seconds.',
        aggregateStats: Object.fromEntries(
            aggRows.map(r => [r.event_name, {
                eventCount: Number(r.event_count),
                mean_sec:   Number(r.mean_sec),
                min_sec:    Number(r.min_sec),
                p25_sec:    Number(r.p25_sec),
                median_sec: Number(r.median_sec),
                p75_sec:    Number(r.p75_sec),
                p95_sec:    Number(r.p95_sec),
                max_sec:    Number(r.max_sec),
                total_sec:  Number(r.total_sec),
            }])
        ),
        summary: {
            assessmentCompleters: totalAssessed,
            usersWithSegmentData: usersWithSegments.size,
            totalSegmentsCompleted: totalCompleted,
            totalSegmentsDropped: totalDropped,
            totalPlayTimeSec: totalPlaySec,
            avgPlayTimePerUserSec: parseFloat((totalPlaySec / (usersWithSegments.size || 1)).toFixed(1)),
        },
        perUser: perUserRows.map(r => ({
            user_pseudo_id:     r.user_pseudo_id,
            app_version:        r.app_version,
            segs_completed:     Number(r.segs_completed),
            segs_dropped:       Number(r.segs_dropped),
            total_seg_sec:      Number(r.total_seg_sec),
            total_completed_sec: Number(r.total_completed_sec),
            total_dropped_sec:  Number(r.total_dropped_sec),
            avg_completed_sec:  r.avg_completed_sec != null ? parseFloat(Number(r.avg_completed_sec).toFixed(1)) : null,
            avg_dropped_sec:    r.avg_dropped_sec   != null ? parseFloat(Number(r.avg_dropped_sec).toFixed(1))   : null,
            min_seg_sec:        Number(r.min_seg_sec),
            max_seg_sec:        Number(r.max_seg_sec),
        })),
    };

    const outPath = path.resolve(__dirname, '../../data/assessed_users_segment_duration.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ Saved → data/assessed_users_segment_duration.json');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(e => { console.error('\nFatal error:', e.message); process.exit(1); });
