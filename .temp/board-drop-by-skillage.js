'use strict';
const fs = require('fs');
const path = require('path');

const BASE      = path.resolve(__dirname, '..');
const BOARD_CSV = path.join(BASE, 'CSV', 'assessment_level_boardCount_doardIndex_duration.csv');
const CFG_PATH  = path.resolve(__dirname, '../../..', 'assets', 'config.json');
const REPORT    = path.join(BASE, 'reports', 'assessment-wrong-moves-success-rate.md');

// Columns: [0]=levelID, [1]=start_users, [6]=comp_users, [10]=comp_boardIndex(sum),
//          [11]=drop_users, [15]=drop_boardIndex(sum)
// Config boardCount = training boards; total boards = boardCount * 2
const rows = fs.readFileSync(BOARD_CSV, 'utf8').trim().split('\n')
  .slice(1)
  .map(l => l.split(','));

const cfg    = JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
const levels = cfg.levels || {};

const al5 = rows
  .filter(r => r[0] && r[0].trim().endsWith('AL'))
  .map(r => {
    const id           = r[0].trim();
    const startedUsers = parseInt(r[1])    || 0;
    const compUsers    = parseInt(r[6])    || 0;
    const compBoardIdx = parseFloat(r[10]) || 0;
    const dropUsers    = parseInt(r[11])   || 0;
    const dropBoardIdx = parseFloat(r[15]) || 0;
    const lvl          = levels[id] || {};
    const trainBoards  = lvl.boardCount   || null;
    const totalBoards  = trainBoards !== null ? trainBoards * 2 : null;
    return { id, startedUsers, compUsers, compBoardIdx, dropUsers, dropBoardIdx,
             trainBoards, totalBoards, skillAge: lvl.skillAge || null };
  })
  .filter(r => r.startedUsers >= 5 && r.skillAge !== null && r.trainBoards !== null);

// Training = boards 1–5, Speedrun = boards 6–10 (normalised; actual config boardCount ignored for phase)
const TRAIN_THRESHOLD = 5;

al5.forEach(r => {
  r.avgDropBoard = r.dropUsers > 0 ? r.dropBoardIdx / r.dropUsers : null;
  r.inTraining   = r.avgDropBoard !== null && r.avgDropBoard <= TRAIN_THRESHOLD;
});

// Group by skillAge
const byAge = {};
al5.forEach(r => {
  if (!byAge[r.skillAge]) byAge[r.skillAge] = [];
  byAge[r.skillAge].push(r);
});

const tableRows = Object.keys(byAge).sort((a, b) => a - b).map(sa => {
  const group = byAge[sa];

  const withDroppers  = group.filter(r => r.dropUsers > 0 && r.avgDropBoard !== null);
  const totalDroppers = withDroppers.reduce((s, r) => s + r.dropUsers, 0);
  const wAvgDropBoard = totalDroppers > 0
    ? withDroppers.reduce((s, r) => s + r.avgDropBoard * r.dropUsers, 0) / totalDroppers
    : null;

  const phase        = wAvgDropBoard !== null
    ? (wAvgDropBoard <= TRAIN_THRESHOLD ? 'Training' : 'Speedrun') : '—';
  const inTrainCount = withDroppers.reduce((s, r) => s + (r.inTraining ? r.dropUsers : 0), 0);
  const trainPct     = totalDroppers > 0 ? inTrainCount / totalDroppers : null;

  return { sa: parseInt(sa), levels: group.length, totalDroppers, wAvgDropBoard, phase, trainPct };
});

function f1(v) { return v === null ? '—' : v.toFixed(1); }
function pct(v) { return v === null ? '—' : (v * 100).toFixed(0) + '%'; }

const newTable = [
  '**Board progress at drop — by SkillAge:**',
  '',
  '> Training = boards 1–5, Speedrun = boards 6–10 (normalised). `Avg drop board` = weighted average board index at drop across all droppers in the group. `% in Training` = share of droppers who quit before board 6.',
  '',
  '| SkillAge | Levels | Droppers | Avg Drop Board | Phase | % in Training |',
  '| -------: | -----: | -------: | -------------: | :---: | ------------: |',
].concat(tableRows.map(r =>
  `| ${r.sa} | ${r.levels} | ${r.totalDroppers} | ${f1(r.wAvgDropBoard)} | ${r.phase} | ${pct(r.trainPct)} |`
)).concat(['']);

const newBlock = newTable.join('\n');

// Replace existing board-drop table in the report
let report = fs.readFileSync(REPORT, 'utf8');

const OLD_START = '**Board progress at drop — by SkillAge:**';
const OLD_END   = '\n\n---\n\n## Summary: Top 10 Lists';

const startIdx = report.indexOf(OLD_START);
const endIdx   = report.indexOf(OLD_END);

if (startIdx === -1 || endIdx === -1) {
  console.error('ERROR: Could not find boundaries. startIdx:', startIdx, 'endIdx:', endIdx);
  process.exit(1);
}

report = report.slice(0, startIdx) + newBlock + report.slice(endIdx);
fs.writeFileSync(REPORT, report, 'utf8');

console.log('Board drop table updated.');
console.log('Report lines:', report.split('\n').length);
console.log('\n--- Preview ---');
console.log(newBlock);

// STOP - remove old dead code below this line

