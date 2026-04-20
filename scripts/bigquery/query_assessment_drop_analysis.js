// Assessment Drop Analysis — BigQuery
// Why and where users drop during assessment segments
// Window: 2026-01-25 → 2026-03-25
// Versions: all (unfiltered — match GA4 UI scope)

const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
const fs = require('fs');

const KEY_FILE   = path.resolve(__dirname, '../../keys/gd-math-71c48-7553a3a1322b.json');
const PROJECT_ID = 'gd-math-71c48';
const DATASET    = 'analytics_441470574';
const LOCATION   = 'asia-south1';
const START_DATE = '20260125';
const END_DATE   = '20260325';

const client = new BigQuery({ projectId: PROJECT_ID, keyFilename: KEY_FILE, location: LOCATION });

function pct(num, den) {
    if (!den || den === 0) return '—';
    return (100 * num / den).toFixed(1) + '%';
}
function pad(str, len) { return String(str).padStart(len).slice(-len); }
function padL(str, len) { return String(str).padEnd(len).slice(0, len); }
function fmtSec(s) {
    if (s == null) return '—';
    const m = Math.floor(s / 60), sec = Math.round(s % 60);
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

async function runQuery(label, sql) {
    const [rows] = await client.query({ query: sql, location: LOCATION });
    return rows;
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════════════════╗');
    console.log('║   GD-Math — Assessment Drop Analysis (BigQuery)                     ║');
    console.log('╚══════════════════════════════════════════════════════════════════════╝');
    console.log(`Window : ${START_DATE} → ${END_DATE}  (all versions)\n`);

    // ── Helper to extract a named param value (int or float) ─────────────────
    const paramExtract = (name) => `(
        SELECT COALESCE(
            SAFE_CAST((SELECT ep.value.int_value   FROM UNNEST(event_params) ep WHERE ep.key = '${name}') AS FLOAT64),
            SAFE_CAST((SELECT ep.value.float_value FROM UNNEST(event_params) ep WHERE ep.key = '${name}') AS FLOAT64)
        )
    )`;
    const strParam = (name) => `(
        SELECT ep.value.string_value FROM UNNEST(event_params) ep WHERE ep.key = '${name}'
    )`;

    // ══════════════════════════════════════════════════════════════════════════
    // Q1: Progress within level when dropped
    //     boardIndex / boardCount → 0.0 = quit on board 1, 1.0 = quit on last board
    // ══════════════════════════════════════════════════════════════════════════
    const q1 = `
        WITH drops AS (
            SELECT
                ${paramExtract('boardIndex')}   AS board_index,
                ${paramExtract('boardCount')}   AS board_count,
                ${paramExtract('wrongMoves')}   AS wrong_moves,
                ${paramExtract('rightMoves')}   AS right_moves,
                ${paramExtract('duration')}     AS duration_sec,
                ${strParam('segment')}          AS segment_type,
                ${strParam('type')}             AS level_type
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'segmentDropped'
              AND ${strParam('type')} = 'assessment'
        ),
        with_progress AS (
            SELECT *,
                SAFE_DIVIDE(board_index - 1, board_count) AS progress_ratio
            FROM drops
            WHERE board_count > 0
        )
        SELECT
            COUNT(*)                                                        AS total_drops,
            ROUND(AVG(progress_ratio) * 100, 1)                            AS avg_progress_pct,
            ROUND(APPROX_QUANTILES(progress_ratio, 100)[OFFSET(50)] * 100, 1) AS median_progress_pct,
            COUNTIF(progress_ratio < 0.25)                                 AS quit_in_first_quarter,
            COUNTIF(progress_ratio >= 0.25 AND progress_ratio < 0.75)     AS quit_in_middle,
            COUNTIF(progress_ratio >= 0.75)                                AS quit_in_last_quarter,
            ROUND(AVG(duration_sec))                                       AS avg_duration_sec,
            ROUND(APPROX_QUANTILES(duration_sec, 100)[OFFSET(50)])         AS median_duration_sec,
            COUNTIF(duration_sec < 10)                                     AS immediate_quit_under10s,
            COUNTIF(duration_sec < 30)                                     AS quick_quit_under30s,
            ROUND(AVG(wrong_moves))                                        AS avg_wrong_moves,
            ROUND(AVG(right_moves))                                        AS avg_right_moves,
            ROUND(AVG(SAFE_DIVIDE(wrong_moves, right_moves + wrong_moves)) * 100, 1) AS avg_wrong_pct
        FROM with_progress
    `;

    // ══════════════════════════════════════════════════════════════════════════
    // Q2: Training vs Speedrun drops
    // ══════════════════════════════════════════════════════════════════════════
    const q2 = `
        WITH drops AS (
            SELECT
                ${paramExtract('boardIndex')}   AS board_index,
                ${paramExtract('boardCount')}   AS board_count,
                ${paramExtract('wrongMoves')}   AS wrong_moves,
                ${paramExtract('rightMoves')}   AS right_moves,
                ${paramExtract('duration')}     AS duration_sec,
                ${strParam('segment')}          AS segment_type,
                ${strParam('type')}             AS level_type
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'segmentDropped'
              AND ${strParam('type')} = 'assessment'
        )
        SELECT
            segment_type,
            COUNT(*)                                                AS drops,
            ROUND(AVG(duration_sec))                               AS avg_duration_sec,
            ROUND(APPROX_QUANTILES(duration_sec, 100)[OFFSET(50)]) AS median_duration_sec,
            ROUND(AVG(SAFE_DIVIDE(wrong_moves, right_moves + wrong_moves)) * 100, 1) AS avg_wrong_pct,
            COUNTIF(duration_sec < 30)                             AS quick_quit_under30s
        FROM drops
        WHERE board_count > 0
        GROUP BY segment_type
        ORDER BY drops DESC
    `;

    // ══════════════════════════════════════════════════════════════════════════
    // Q3: Top levels by drop count (assessment only)
    // ══════════════════════════════════════════════════════════════════════════
    const q3 = `
        WITH drops AS (
            SELECT
                ${strParam('level')}            AS level_id,
                ${paramExtract('boardIndex')}   AS board_index,
                ${paramExtract('boardCount')}   AS board_count,
                ${paramExtract('wrongMoves')}   AS wrong_moves,
                ${paramExtract('rightMoves')}   AS right_moves,
                ${paramExtract('duration')}     AS duration_sec,
                ${strParam('type')}             AS level_type
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'segmentDropped'
              AND ${strParam('type')} = 'assessment'
        ),
        started AS (
            SELECT
                ${strParam('level')} AS level_id,
                COUNT(*) AS started_count
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'segmentStarted'
              AND ${strParam('type')} = 'assessment'
            GROUP BY level_id
        ),
        drop_stats AS (
            SELECT
                level_id,
                COUNT(*) AS drop_count,
                ROUND(AVG(duration_sec)) AS avg_duration_sec,
                ROUND(AVG(SAFE_DIVIDE(wrong_moves, right_moves + wrong_moves)) * 100, 1) AS avg_wrong_pct,
                COUNTIF(duration_sec < 30) AS quick_quits
            FROM drops
            WHERE level_id IS NOT NULL AND board_count > 0
            GROUP BY level_id
        )
        SELECT
            d.level_id,
            d.drop_count,
            s.started_count,
            ROUND(100.0 * d.drop_count / s.started_count, 1) AS drop_rate_pct,
            d.avg_duration_sec,
            d.avg_wrong_pct,
            d.quick_quits
        FROM drop_stats d
        LEFT JOIN started s USING (level_id)
        WHERE s.started_count >= 5
        ORDER BY d.drop_count DESC
        LIMIT 20
    `;

    // ══════════════════════════════════════════════════════════════════════════
    // Q4: Drop distribution by boardIndex bucket (where in the level)
    // ══════════════════════════════════════════════════════════════════════════
    const q4 = `
        WITH drops AS (
            SELECT
                ${paramExtract('boardIndex')} AS board_index,
                ${paramExtract('boardCount')} AS board_count
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'segmentDropped'
              AND ${strParam('type')} = 'assessment'
        )
        SELECT
            board_index,
            COUNT(*) AS drops
        FROM drops
        WHERE board_count > 0 AND board_index IS NOT NULL
        GROUP BY board_index
        ORDER BY board_index
    `;

    console.log('Running 4 queries in parallel...\n');
    const [r1, r2, r3, r4] = await Promise.all([
        runQuery('Q1 progress', q1),
        runQuery('Q2 segment type', q2),
        runQuery('Q3 top levels', q3),
        runQuery('Q4 board index', q4),
    ]);

    // ── Q1: Overall drop signal ───────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  1. HOW FAR did users get before dropping?');
    console.log('═══════════════════════════════════════════════════════════');
    if (r1.length) {
        const r = r1[0];
        const total = Number(r.total_drops);
        const q1n = Number(r.quit_in_first_quarter);
        const qm  = Number(r.quit_in_middle);
        const ql  = Number(r.quit_in_last_quarter);
        console.log(`  Total assessment drops      : ${total}`);
        console.log(`  Avg progress when dropped   : ${r.avg_progress_pct}%  (median ${r.median_progress_pct}%)`);
        console.log(`  Quit in first 25% of level  : ${q1n}  (${pct(q1n, total)})`);
        console.log(`  Quit in middle 25-75%       : ${qm}   (${pct(qm, total)})`);
        console.log(`  Quit in last 25%            : ${ql}   (${pct(ql, total)})`);
        console.log(`  Avg duration before drop    : ${fmtSec(r.avg_duration_sec)}  (median ${fmtSec(r.median_duration_sec)})`);
        console.log(`  Quit under 10s (immediate)  : ${r.immediate_quit_under10s}  (${pct(Number(r.immediate_quit_under10s), total)})`);
        console.log(`  Quit under 30s (quick)      : ${r.quick_quit_under30s}  (${pct(Number(r.quick_quit_under30s), total)})`);
        console.log(`  Avg wrong moves             : ${r.avg_wrong_moves}`);
        console.log(`  Avg right moves             : ${r.avg_right_moves}`);
        console.log(`  Avg error rate              : ${r.avg_wrong_pct}%  of all moves were wrong`);
    }

    // ── Q2: Training vs Speedrun ─────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  2. TRAINING vs SPEEDRUN drops');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ${'Segment'.padEnd(12)}  ${'Drops'.padStart(6)}  ${'Avg dur'.padStart(8)}  ${'Median'.padStart(8)}  ${'Error%'.padStart(7)}  ${'<30s'.padStart(5)}`);
    console.log('  ' + '─'.repeat(60));
    for (const r of r2) {
        const seg = String(r.segment_type || 'unknown').padEnd(12);
        const dr  = pad(r.drops, 6);
        const ad  = pad(fmtSec(r.avg_duration_sec), 8);
        const md  = pad(fmtSec(r.median_duration_sec), 8);
        const ep  = pad(r.avg_wrong_pct + '%', 7);
        const qq  = pad(r.quick_quit_under30s, 5);
        console.log(`  ${seg}  ${dr}  ${ad}  ${md}  ${ep}  ${qq}`);
    }

    // ── Q3: Top levels ────────────────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  3. TOP LEVELS BY DROP COUNT (assessment, ≥5 starts)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ${'Level'.padEnd(44)}  ${'Drops'.padStart(5)}  ${'Rate'.padStart(6)}  ${'AvgDur'.padStart(7)}  ${'Err%'.padStart(5)}  ${'<30s'.padStart(4)}`);
    console.log('  ' + '─'.repeat(80));
    for (const r of r3) {
        const lv  = padL(r.level_id || 'unknown', 44);
        const dr  = pad(r.drop_count, 5);
        const rt  = pad(r.drop_rate_pct + '%', 6);
        const ad  = pad(fmtSec(r.avg_duration_sec), 7);
        const ep  = pad(r.avg_wrong_pct + '%', 5);
        const qq  = pad(r.quick_quits, 4);
        console.log(`  ${lv}  ${dr}  ${rt}  ${ad}  ${ep}  ${qq}`);
    }

    // ── Q4: Board index heatmap ───────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  4. WHICH BOARD INDEX causes most drops?');
    console.log('═══════════════════════════════════════════════════════════');
    const maxDrops = Math.max(...r4.map(r => Number(r.drops)));
    for (const r of r4) {
        const idx  = pad(r.board_index, 3);
        const cnt  = pad(r.drops, 4);
        const w    = Math.round((Number(r.drops) / maxDrops) * 30);
        const bar  = '█'.repeat(w) + '░'.repeat(30 - w);
        console.log(`  Board ${idx}: ${bar} ${cnt}`);
    }

    // ── Save results ──────────────────────────────────────────────────────────
    const output = {
        generatedAt: new Date().toISOString(),
        window: { start: START_DATE, end: END_DATE },
        overallDropSignal: r1[0] || null,
        segmentTypeBreakdown: r2,
        topDropLevels: r3,
        dropsByBoardIndex: r4,
    };
    const outPath = path.resolve(__dirname, '../../data/assessment_drop_analysis.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log(`\n✓ Saved → data/assessment_drop_analysis.json`);
}

main().catch(err => { console.error(err); process.exit(1); });
