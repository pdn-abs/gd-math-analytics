'use strict';
const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname, '..');
const CSV_PATH = path.join(BASE, 'CSV', 'assessment_wrongMoves_successRate.csv');
const CFG_PATH = path.resolve(__dirname, '../../..', 'assets', 'config.json');
const REPORT_PATH = path.join(BASE, 'reports', 'assessment-wrong-moves-success-rate.md');

// CSV columns: [0]=levelID, [1]=started, [5]=completed, [9]=dropped,
//              [15]=overall successRate (fraction), [16]=total wrongMoves
const csvLines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n');
const dataRows = csvLines.slice(1).map(l => l.split(','));

const cfg = JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
const levels = cfg.levels || {};

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
    const successRaw = (r[15] === '' || r[15] == null) ? null : parseFloat(r[15]);
    const lvl = levels[id] || {};
    return { id, started, completed, dropped, totalWM, wpu, dropRate, successRaw, skillAge: lvl.skillAge || null };
  })
  .filter(r => r.started >= 5 && r.skillAge !== null);

// Group by skillAge
const byAge = {};
al5.forEach(r => {
  if (!byAge[r.skillAge]) byAge[r.skillAge] = [];
  byAge[r.skillAge].push(r);
});

// Aggregate per skillAge: weighted averages by starters
const rows = Object.keys(byAge).sort((a, b) => a - b).map(sa => {
  const group = byAge[sa];
  const totalStarted = group.reduce((s, r) => s + r.started, 0);
  const totalDropped = group.reduce((s, r) => s + r.dropped, 0);
  const totalCompleted = group.reduce((s, r) => s + r.completed, 0);
  const totalWM = group.reduce((s, r) => s + r.totalWM, 0);
  // Weighted avg success (exclude nulls from weight)
  const withSuccess = group.filter(r => r.successRaw !== null);
  const weightedSuccess = withSuccess.length > 0
    ? withSuccess.reduce((s, r) => s + r.successRaw * r.started, 0) / withSuccess.reduce((s, r) => s + r.started, 0)
    : null;

  const dropPct = totalStarted > 0 ? totalDropped / totalStarted : 0;
  const wpu = totalStarted > 0 ? totalWM / totalStarted : 0;
  const levels = group.length;
  return { sa: parseInt(sa), levels, totalStarted, totalDropped, totalCompleted, dropPct, wpu, weightedSuccess };
});

function pct(v) { return v === null ? '—' : (v * 100).toFixed(0) + '%'; }

const tableLines = [
  '## SkillAge Overview',
  '',
  '> Aggregated metrics across all AL levels within each SkillAge (≥5 starters, weighted by users started).',
  '',
  '| SkillAge | Levels | Total Started | Total Dropped | Drop% | WM / User | Success% |',
  '| -------: | -----: | ------------: | ------------: | ----: | --------: | -------: |',
];

rows.forEach(r => {
  tableLines.push(
    `| ${r.sa} | ${r.levels} | ${r.totalStarted} | ${r.totalDropped} | ${pct(r.dropPct)} | ${r.wpu.toFixed(1)} | ${pct(r.weightedSuccess)} |`
  );
});

tableLines.push('');
const tableBlock = tableLines.join('\n');

// Insert: between Full Table section and Key Signals
let report = fs.readFileSync(REPORT_PATH, 'utf8');

const BEFORE = '\n## Key Signals';
const insertIdx = report.indexOf(BEFORE);
if (insertIdx === -1) { console.error('ERROR: Marker not found'); process.exit(1); }

report = report.slice(0, insertIdx) + '\n\n' + tableBlock + report.slice(insertIdx);

// Update TOC: add entry after Full Table entry
const TOC_FT = '4. [Full Table — Assessment Levels Only](#full-table--assessment-levels-only-sorted-by-users-started)';
const TOC_NEW = TOC_FT + '\n5. [SkillAge Overview](#skillage-overview)';
report = report.replace(TOC_FT, TOC_NEW);

// Renumber "5. [Overall Findings" → "6."
report = report.replace(
  '5. [Overall Findings & Drop Reasons](#overall-findings--drop-reasons)',
  '6. [Overall Findings & Drop Reasons](#overall-findings--drop-reasons)'
);

fs.writeFileSync(REPORT_PATH, report, 'utf8');
console.log('SkillAge Overview inserted.');
console.log(`Report now has ${report.split('\n').length} lines.`);
console.log('\n--- Preview ---');
console.log(tableBlock);
