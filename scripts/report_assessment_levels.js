// Assessment Levels Report — from GA4 CSV export
// Two tables: (1) High drop rate  (2) High completion rate
// Source: CSV/assessment_level_boardCount_doardIndex_duration.csv

const fs   = require('fs');
const path = require('path');

const CSV_FILE = path.resolve(__dirname, '../CSV/assessment_level_boardCount_doardIndex_duration.csv');

// Intro/warmup levels — exclude from report (no real skill content)
const INTRO_LEVELS = new Set([
    'mergeExample', 'introLevelStack', 'introPatternExample',
    'matchIntroOne', 'introducingStackingInSlot', 'introducingZero',
]);

function fmtSec(s) {
    if (s == null || isNaN(s) || s === 0) return '—';
    const m = Math.floor(s / 60), sec = Math.round(s % 60);
    return m > 0 ? `${m}m ${sec < 10 ? '0' : ''}${sec}s` : `${sec}s`;
}
function fmtMin(totalSec) {
    if (!totalSec) return '—';
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = Math.round(totalSec % 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
}
function pct(n, d) { return d ? (100 * n / d).toFixed(1) + '%' : '—'; }
function pad(s, n, right = false) {
    const str = String(s ?? '—');
    return right ? str.padEnd(n).slice(0, n) : str.padStart(n).slice(-n);
}

// ── Parse CSV ─────────────────────────────────────────────────────────────────
const lines = fs.readFileSync(CSV_FILE, 'utf8').split('\n');
const levels = [];

for (const line of lines) {
    const cols = line.split(',');
    if (cols.length < 20) continue;               // skip header/comment rows
    const id = cols[0].trim();
    if (!id || id.startsWith('#') || id === '' || id === 'levelID') continue;
    if (id.startsWith('simpleIdenti') && cols[1].trim() === 'Total users') continue; // header row
    if (INTRO_LEVELS.has(id)) continue;

    const startedUsers    = parseInt(cols[1])  || 0;
    const completedUsers  = parseInt(cols[6])  || 0;
    const droppedUsers    = parseInt(cols[11]) || 0;
    const completedAvgDur = parseFloat(cols[8])  || 0; // avg seconds per completed segment
    const droppedAvgDur   = parseFloat(cols[13]) || 0; // avg seconds per dropped segment
    const totalDuration   = parseFloat(cols[17]) || 0; // total seconds spent (all users)
    const avgBoardAtDrop  = droppedUsers > 0
        ? parseFloat(cols[15]) / droppedUsers   // boardIndex sum / dropped users
        : null;
    const boardCount = startedUsers > 0
        ? Math.round(parseFloat(cols[4]) / startedUsers) // boardCount sum / started users
        : null;

    if (startedUsers < 5) continue; // skip noise

    const dropRate        = startedUsers ? droppedUsers / startedUsers : 0;
    const completionRate  = startedUsers ? completedUsers / startedUsers : 0;

    levels.push({
        id, startedUsers, completedUsers, droppedUsers,
        dropRate, completionRate,
        completedAvgDur, droppedAvgDur,
        totalDuration, avgBoardAtDrop, boardCount,
    });
}

// ── Table helpers ─────────────────────────────────────────────────────────────
function printHeader(cols) {
    const header = cols.map(c => pad(c.label, c.w, c.left)).join('  ');
    const divider = cols.map(c => '─'.repeat(c.w)).join('  ');
    console.log('  ' + header);
    console.log('  ' + divider);
}
function printRow(cols, row) {
    console.log('  ' + cols.map(c => pad(c.val(row), c.w, c.left)).join('  '));
}

// ═════════════════════════════════════════════════════════════════════════════
// TABLE 1 — High drop rate (sorted descending)
// ═════════════════════════════════════════════════════════════════════════════
const highDrop = [...levels]
    .filter(l => l.droppedUsers > 0)
    .sort((a, b) => b.dropRate - a.dropRate);

const cols1 = [
    { label: 'Level',                w: 44, left: true,  val: r => r.id },
    { label: 'Started',              w: 7,  left: false, val: r => r.startedUsers },
    { label: 'Dropped',              w: 7,  left: false, val: r => r.droppedUsers },
    { label: 'Drop%',                w: 6,  left: false, val: r => pct(r.droppedUsers, r.startedUsers) },
    { label: 'Completion%',          w: 11, left: false, val: r => pct(r.completedUsers, r.startedUsers) },
    { label: 'Avg time (drop)',      w: 14, left: false, val: r => fmtSec(r.droppedAvgDur) },
    { label: 'Avg time (done)',      w: 14, left: false, val: r => fmtSec(r.completedAvgDur) },
    { label: 'Total time (all)',     w: 14, left: false, val: r => fmtMin(r.totalDuration) },
    { label: 'Avg board at drop',    w: 16, left: false, val: r => r.avgBoardAtDrop != null ? r.avgBoardAtDrop.toFixed(1) + ` / ${r.boardCount}` : '—' },
];

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗');
console.log('║  TABLE 1 — Assessment Levels by DROP RATE (descending)                                                         ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝');
printHeader(cols1);
for (const r of highDrop) printRow(cols1, r);

// ═════════════════════════════════════════════════════════════════════════════
// TABLE 2 — High completion rate (sorted descending)
// ═════════════════════════════════════════════════════════════════════════════
const highComplete = [...levels]
    .sort((a, b) => b.completionRate - a.completionRate);

const cols2 = [
    { label: 'Level',                w: 44, left: true,  val: r => r.id },
    { label: 'Started',              w: 7,  left: false, val: r => r.startedUsers },
    { label: 'Completed',            w: 9,  left: false, val: r => r.completedUsers },
    { label: 'Completion%',          w: 11, left: false, val: r => pct(r.completedUsers, r.startedUsers) },
    { label: 'Drop%',                w: 6,  left: false, val: r => pct(r.droppedUsers, r.startedUsers) },
    { label: 'Avg time (done)',      w: 14, left: false, val: r => fmtSec(r.completedAvgDur) },
    { label: 'Avg time (drop)',      w: 14, left: false, val: r => fmtSec(r.droppedAvgDur) },
    { label: 'Total time (all)',     w: 14, left: false, val: r => fmtMin(r.totalDuration) },
];

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗');
console.log('║  TABLE 2 — Assessment Levels by COMPLETION RATE (descending)                                                   ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝');
printHeader(cols2);
for (const r of highComplete) printRow(cols2, r);

// ── Summary stats ──────────────────────────────────────────────────────────
const totalLevels     = levels.length;
const totalDropHigh   = levels.filter(l => l.dropRate >= 0.40).length;
const totalCompHigh   = levels.filter(l => l.completionRate >= 0.80).length;
const totalTimeSec    = levels.reduce((s, l) => s + l.totalDuration, 0);
console.log('\n');
console.log(`  Total assessment levels analysed : ${totalLevels}`);
console.log(`  Levels with drop rate ≥ 40%      : ${totalDropHigh}`);
console.log(`  Levels with completion rate ≥ 80%: ${totalCompHigh}`);
console.log(`  Total time spent across all levels: ${fmtMin(totalTimeSec)}`);
