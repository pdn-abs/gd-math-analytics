const fs = require('fs');
const config = require('/home/pdn/dev/abs/gd-math-godot/assets/config.json');
const configLevels = config.levels;
const csvLines = fs.readFileSync('/home/pdn/dev/abs/gd-math-godot/.analytics/gd-math-analytics/CSV/assessment_wrongMoves_successRate.csv', 'utf8').trim().split('\n');
const rows = csvLines.slice(1).map(l => l.split(','));

const al5 = rows
  .filter(r => r[0].trim().endsWith('AL'))
  .map(r => {
    const started = parseInt(r[1]) || 0;
    const completed = parseInt(r[5]) || 0;
    const dropped = parseInt(r[9]) || 0;
    const totalWM = parseFloat(r[16]) || 0;
    const wpu = started > 0 ? totalWM / started : 0;
    const dropRate = started > 0 ? dropped / started : 0;
    const successPctRaw = (r[15] === '' || r[15] == null) ? null : parseFloat(r[15]);
    const cfg = configLevels[r[0].trim()] || {};
    return {
      level: r[0].trim(),
      skillAge: cfg.skillAge !== undefined ? cfg.skillAge : null,
      branch: cfg.branch || '-',
      title: (cfg.title || '').trim(),
      started, completed, dropped, wpu, dropRate, successPctRaw,
      successPctStr: successPctRaw === null ? '-' : Math.round(successPctRaw * 100) + '%',
      dropPct: Math.round(dropRate * 100) + '%',
    };
  })
  .filter(r => r.started >= 5 && r.skillAge !== null);

const maxWPU = Math.max(...al5.map(r => r.wpu));

// Difficulty score: weighted combination of normalized wrong moves/user and low success rate and drop rate
// score = (wpu/maxWPU)*0.4 + (1 - (successPctRaw ?? 0.5))*0.4 + dropRate*0.2
al5.forEach(r => {
  const sr = r.successPctRaw !== null ? r.successPctRaw : 0.5;
  r.diffScore = (r.wpu / maxWPU) * 0.4 + (1 - sr) * 0.4 + r.dropRate * 0.2;
});

// Group by skillAge
const groups = {};
al5.forEach(r => {
  if (!groups[r.skillAge]) groups[r.skillAge] = [];
  groups[r.skillAge].push(r);
});

// Sort each group by difficulty score desc, pick top 2
console.log('\nGrouping preview:');
Object.keys(groups).sort((a, b) => a - b).forEach(sa => {
  const sorted = groups[sa].sort((a, b) => b.diffScore - a.diffScore);
  console.log('SA ' + sa + ' (' + sorted.length + '): ' + sorted.map(r => r.level + '(' + r.diffScore.toFixed(2) + ')').join(', '));
});
