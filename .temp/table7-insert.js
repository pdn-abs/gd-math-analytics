'use strict';
const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname, '..');
const CSV_PATH = path.join(BASE, 'CSV', 'assessment_wrongMoves_successRate.csv');
const CFG_PATH = path.resolve(__dirname, '../../..', 'assets', 'config.json');
const REPORT_PATH = path.join(BASE, 'reports', 'assessment-wrong-moves-success-rate.md');

// --- Parse CSV (multi-header format: skip comment + 3 header rows, data from row 4) ---
// Columns: [0]=levelID, [1]=started, [5]=completed, [9]=dropped, [15]=overall successRate, [16]=totalWrongMoves
const csvLines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n');
const dataRows = csvLines.slice(1).map(l => l.split(','));

const al5 = dataRows
  .filter(r => r[0] && r[0].trim().endsWith('AL'))
  .map(r => {
    const id = r[0].trim();
    const started = parseInt(r[1]) || 0;
    const completed = parseInt(r[5]) || 0;
    const dropped = parseInt(r[9]) || 0;
    const totalWM = parseFloat(r[16]) || 0;
    const wpu = started > 0 ? totalWM / started : 0;
    const dropRate = started > 0 ? dropped / started : 0;
    const successPctRaw = (r[15] === '' || r[15] == null) ? null : parseFloat(r[15]);
    return { id, started, completed, dropped, totalWM, wpu, dropRate, successPctRaw };
  })
  .filter(r => r.started >= 5)
  // Exclude write/tracing levels — success rate and wrong moves are not tracked for them
  .filter(r => !r.id.toLowerCase().startsWith('write'));

// Load config for skillAge, branch, title
const cfg = JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
const levels = cfg.levels || {};

al5.forEach(r => {
  const lvl = levels[r.id] || {};
  r.skillAge = lvl.skillAge || lvl.skill_age || null;
  r.branch = lvl.branch || null;
  r.title = lvl.title || r.id;
});

// Drop rows without skillAge
const withSA = al5.filter(r => r.skillAge !== null);

// Compute maxWPU
const maxWPU = Math.max(...withSA.map(r => r.wpu));

// Compute difficulty score
withSA.forEach(r => {
  const sr = r.successPctRaw !== null ? r.successPctRaw : 0.5;
  r.diffScore = (r.wpu / maxWPU) * 0.4 + (1 - sr) * 0.4 + r.dropRate * 0.2;
});

// Group by skillAge
const byAge = {};
withSA.forEach(r => {
  if (!byAge[r.skillAge]) byAge[r.skillAge] = [];
  byAge[r.skillAge].push(r);
});

// Sort each group desc by diffScore, take top 2
const table7Rows = [];
Object.keys(byAge).sort((a, b) => a - b).forEach(sa => {
  const sorted = byAge[sa].sort((a, b) => b.diffScore - a.diffScore);
  sorted.slice(0, 2).forEach(r => table7Rows.push(r));
});

// Format helpers
function fmt(v, digits = 0) {
  if (v === null || v === undefined) return '—';
  return digits === 0 ? Math.round(v).toString() : v.toFixed(digits);
}
function pct(v) {
  if (v === null || v === undefined) return '—';
  return (v * 100).toFixed(0) + '%';
}

// Build markdown table
const tableLines = [
  '### 7. Hardest Levels by SkillAge',
  '',
  '> **Method:** Within each SkillAge group, levels are ranked by a combined difficulty score: 40% wrong moves per user (normalized), 40% low success rate, 20% drop rate. The top 2 hardest levels are shown per SkillAge (all qualifying levels with ≥5 starters are shown where fewer than 2 exist). Write/tracing levels are excluded — their success rate and wrong-moves metrics are not tracked.',
  '',
  '| SkillAge | Level | Branch | Started | WM/User | Drop% | Success% | Diff Score |',
  '| -------: | ----- | ------ | ------: | ------: | ----: | -------: | ---------: |',
];

table7Rows.forEach(r => {
  const sa = r.skillAge;
  const id = r.id;
  const branch = r.branch || '—';
  const started = fmt(r.started);
  const wpu = r.wpu.toFixed(1);
  const drop = pct(r.dropRate);
  const succ = r.successPctRaw !== null ? pct(r.successPctRaw) : '—';
  const diff = r.diffScore.toFixed(2);
  tableLines.push(`| ${sa} | \`${id}\` | ${branch} | ${started} | ${wpu} | ${drop} | ${succ} | **${diff}** |`);
});

tableLines.push('');

const tableBlock = tableLines.join('\n');

// Replace the empty Table 7 shell already in the report with the correct content
let report = fs.readFileSync(REPORT_PATH, 'utf8');

const T7_START = '### 7. Hardest Levels by SkillAge';
const T7_END = '\n---\n\n## Overall Findings & Drop Reasons';
const startIdx = report.indexOf(T7_START);
const endIdx = report.indexOf(T7_END);

if (startIdx !== -1 && endIdx !== -1) {
  // Replace existing (possibly empty) Table 7 block
  report = report.slice(0, startIdx) + tableBlock + report.slice(endIdx);
} else if (endIdx !== -1) {
  // Table 7 not yet present — insert before the separator
  report = report.slice(0, endIdx) + '\n\n' + tableBlock + report.slice(endIdx);
} else {
  console.error('ERROR: Could not find insertion point in report');
  process.exit(1);
}

fs.writeFileSync(REPORT_PATH, report, 'utf8');
console.log('Table 7 inserted successfully.');
console.log(`Report now has ${report.split('\n').length} lines.`);

// Print preview
console.log('\n--- Table 7 Preview ---');
console.log(tableBlock);
