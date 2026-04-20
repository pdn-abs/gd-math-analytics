'use strict';
const fs   = require('fs');
const path = require('path');

const BASE      = path.resolve(__dirname, '..');
const CSV_PATH  = path.join(BASE, 'CSV', 'assessment_wrongMoves_successRate.csv');
const CFG_PATH  = path.resolve(__dirname, '../../..', 'assets', 'config.json');
const REPORT    = path.join(BASE, 'reports', 'assessment-wrong-moves-success-rate.md');

// CSV columns: [0]=levelID, [1]=started, [5]=completed, [9]=dropped,
//              [15]=overall successRate (fraction), [16]=total wrongMoves
const dataRows = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n')
  .slice(1).map(l => l.split(','));

const cfg    = JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
const levels = cfg.levels || {};

const al5 = dataRows
  .filter(r => r[0] && r[0].trim().endsWith('AL'))
  .map(r => {
    const id          = r[0].trim();
    const started     = parseInt(r[1])    || 0;
    const completed   = parseInt(r[5])    || 0;
    const dropped     = parseInt(r[9])    || 0;
    const totalWM     = parseFloat(r[16]) || 0;
    const wpu         = started > 0 ? totalWM / started : 0;
    const dropRate    = started > 0 ? dropped / started : 0;
    const compRate    = started > 0 ? completed / started : 0;
    const successRaw  = (r[15] === '' || r[15] == null) ? null : parseFloat(r[15]);
    const lvl         = levels[id] || {};
    return { id, started, completed, dropped, wpu, dropRate, compRate, successRaw,
             skillAge: lvl.skillAge || null, branch: lvl.branch || '—' };
  })
  .filter(r => r.started >= 5 && r.skillAge !== null)
  // Exclude write/tracing levels — success and WM not tracked
  .filter(r => !r.id.toLowerCase().startsWith('write'));

const maxWPU = Math.max(...al5.map(r => r.wpu));

// Score: equal 25% weight on each dimension
// Higher = better performing level
al5.forEach(r => {
  const sr = r.successRaw !== null ? r.successRaw : 0;
  r.score  = (1 - r.wpu / maxWPU) * 0.25
           + sr                    * 0.25
           + (1 - r.dropRate)      * 0.25
           + r.compRate            * 0.25;
});

const top10 = [...al5].sort((a, b) => b.score - a.score).slice(0, 10);

function pct(v) { return v === null ? '—' : (v * 100).toFixed(0) + '%'; }

const tableLines = [
  '### 8. Best Performing Levels (Low Drop, High Success, Low Wrong Moves)',
  '',
  '> **Method:** Combined score (equal 25% weight each): low wrong moves/user (normalised), high success rate, low drop rate, high completion rate. Excludes write/tracing levels.',
  '',
  '| # | Level | SkillAge | Branch | Started | WM/User | Drop% | Complete% | Success% | Score |',
  '|---|-------|:--------:|--------|--------:|--------:|------:|----------:|---------:|------:|',
];

top10.forEach((r, i) => {
  const sr = r.successRaw !== null ? pct(r.successRaw) : '—';
  tableLines.push(
    `| ${i + 1} | ${r.id} | ${r.skillAge} | ${r.branch} | ${r.started} | ${r.wpu.toFixed(1)} | ${pct(r.dropRate)} | ${pct(r.compRate)} | ${sr} | ${r.score.toFixed(2)} |`
  );
});

tableLines.push('');
const tableBlock = tableLines.join('\n');

// Insert after Table 7, before the '---\n\n## Overall Findings' separator
let report = fs.readFileSync(REPORT, 'utf8');

const MARKER = '\n---\n\n## Overall Findings & Drop Reasons';
const idx    = report.indexOf(MARKER);
if (idx === -1) { console.error('ERROR: marker not found'); process.exit(1); }

report = report.slice(0, idx) + '\n\n' + tableBlock + report.slice(idx);

// Update TOC
const TOC_OLD = '   - [Hardest Levels by SkillAge](#7-hardest-levels-by-skillage)';
const TOC_NEW = TOC_OLD + '\n   - [Best Performing Levels](#8-best-performing-levels-low-drop-high-success-low-wrong-moves)';
report = report.replace(TOC_OLD, TOC_NEW);

fs.writeFileSync(REPORT, report, 'utf8');
console.log('Table 8 inserted.');
console.log('Report lines:', report.split('\n').length);
console.log('\n--- Preview ---');
console.log(tableBlock);
