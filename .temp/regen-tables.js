const fs = require('fs');
const path = require('path');

const base = path.resolve(__dirname, '..');
const mdPath = path.join(base, 'reports/assessment-wrong-moves-success-rate.md');
let md = fs.readFileSync(mdPath, 'utf8');

const csvLines = fs.readFileSync(path.join(base, 'CSV/assessment_wrongMoves_successRate.csv'), 'utf8').trim().split('\n');
const rows = csvLines.slice(1).map(l => l.split(','));

const pct = (num, den) => den === 0 ? '-' : Math.round(num / den * 100) + '%';
const spct = (v, count) => (count === 0 || v === '' || v == null) ? '-' : Math.round(parseFloat(v) * 100) + '%';

const al = rows
  .filter(r => r[0].trim().endsWith('AL'))
  .map(r => {
    const started = parseInt(r[1]) || 0;
    const completed = parseInt(r[5]) || 0;
    const dropped = parseInt(r[9]) || 0;
    const totalWM = parseFloat(r[16]) || 0;
    const wpu = started > 0 ? totalWM / started : 0;
    const dropRate = started > 0 ? dropped / started : 0;
    const successPctRaw = (r[15] === '' || r[15] == null) ? null : parseFloat(r[15]);
    return {
      level: r[0].trim(), started, completed, dropped,
      dropRate, dropPct: pct(dropped, started), completePct: pct(completed, started),
      totalWM, wpu,
      successPctRaw,
      successPctStr: successPctRaw === null ? '-' : Math.round(successPctRaw * 100) + '%',
    };
  });

const al5 = al.filter(r => r.started >= 5);
const maxWPU = Math.max(...al5.map(r => r.wpu));

// Table 1: Highest Drop Rate
const t1 = [...al5].sort((a, b) => b.dropRate - a.dropRate).slice(0, 10);
let s1 = '### 1. Highest Drop Rate\n\n';
s1 += '| # | Level | Started | Dropped | Drop% | Complete% |\n';
s1 += '|---|-------|---------|---------|-------|----------|\n';
t1.forEach((r, i) => s1 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.started + ' | ' + r.dropped + ' | ' + r.dropPct + ' | ' + r.completePct + ' |\n');
s1 += '\n';
s1 += '- `greaterSmallerUpTo999OperatorsAL` \u2014 60% drop with only 5 starters; 0.8 wrong moves/user means users quit almost immediately, not because the content is hard.\n';
s1 += '- `stackVegetablesAndFruitsOverall2AL` \u2014 largest absolute dropout: 90 of 170 starters dropped (53%); 9.8 wrong/user confirms genuine difficulty.\n';
s1 += '- `numbersFrom500To999AL` \u2014 only 17% completion; combines high drop with low success rate \u2014 a priority candidate for content review.\n';
s1 += '- `mergeNumberUpTo9WithBAsTwoAL` \u2014 51% drop with 10.0 wrong/user; users persist through difficulty before abandoning.\n';

// Table 2: Lowest Overall Success Rate (exclude write levels with 0% tracking gap)
const t2 = [...al5]
  .filter(r => r.successPctRaw !== null && r.successPctRaw > 0)
  .sort((a, b) => a.successPctRaw - b.successPctRaw)
  .slice(0, 10);
let s2 = '### 2. Lowest Overall Success Rate\n\n';
s2 += '> **Note:** Write levels (`writeLevelSimpleLine2AL`, `writeLevel1To52AL`) are excluded \u2014 their 0% reflects missing tracking, not actual performance.\n\n';
s2 += '| # | Level | Started | Success% | Drop% | Wrong Moves |\n';
s2 += '|---|-------|---------|----------|-------|-------------|\n';
t2.forEach((r, i) => s2 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.started + ' | ' + r.successPctStr + ' | ' + r.dropPct + ' | ' + Math.round(r.totalWM) + ' |\n');
s2 += '\n';
s2 += '- `matrixMultiplicationRandomNumbers3AL` \u2014 53% success with 25.5 wrong/user; the hardest level in the AL assessment pool.\n';
s2 += '- `numbersFrom500To999AL` \u2014 56% success with 47% drop; users both struggle and quit \u2014 a double-failure signal.\n';
s2 += '- `matchEdgesCorners22AL` \u2014 65% success despite 100% completion (all who start, finish); completers still average 10.9 wrong moves.\n';
s2 += '- `fractionMultiplication6AL` \u2014 71% success with 424 total wrong moves across 49 starters; third-largest wrong-move volume in the pool.\n';

// Table 3: Lowest Completion Rate
const t3 = [...al5].sort((a, b) => (a.completed / a.started) - (b.completed / b.started)).slice(0, 10);
let s3 = '### 3. Lowest Completion Rate\n\n';
s3 += '| # | Level | Started | Completed | Complete% | Drop% | Success% |\n';
s3 += '|---|-------|---------|-----------|-----------|-------|----------|\n';
t3.forEach((r, i) => s3 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.started + ' | ' + r.completed + ' | ' + r.completePct + ' | ' + r.dropPct + ' | ' + r.successPctStr + ' |\n');
s3 += '\n';
s3 += '- `numbersFrom500To999AL` \u2014 only 5 of 30 starters completed (17%); also lowest success \u2014 the weakest level in the AL pool on multiple axes.\n';
s3 += '- `greaterSmallerUpTo999OperatorsAL` \u2014 2 of 5 completed (40%); too small a sample but consistent with its early-quit pattern.\n';
s3 += '- `matchActivitiesWithObject2AL` \u2014 44% drop with only 41% completion; notable given its volume (61 starters).\n';
s3 += '- `matrixMultiplicationRandomNumbers3AL` \u2014 46% completion with 25.5 wrong/user; the completers persist through repeated failure.\n';

// Table 4: Most Wrong Moves per User
const t4 = [...al5].sort((a, b) => b.wpu - a.wpu).slice(0, 10);
let s4 = '### 4. Most Wrong Moves per User\n\n';
s4 += '| # | Level | Started | Total Wrong Moves | Wrong Moves / User | Drop% | Success% |\n';
s4 += '|---|-------|---------|-------------------|--------------------|-------|----------|\n';
t4.forEach((r, i) => s4 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.started + ' | ' + Math.round(r.totalWM) + ' | ' + r.wpu.toFixed(1) + ' | ' + r.dropPct + ' | ' + r.successPctStr + ' |\n');
s4 += '\n';
s4 += '- `matrixMultiplicationRandomNumbers3AL` \u2014 25.5 wrong/user, more than double the #2 level; a clear difficulty outlier.\n';
s4 += '- `stackTensAndOnes20UpTo502AL` \u2014 12.0 wrong/user with 0% drop rate; users persist through all boards despite struggle \u2014 scaffolding may help.\n';
s4 += '- `matchEdgesCorners22AL` \u2014 10.9 wrong/user with 100% completion; users finish but the wrong-move volume is high throughout.\n';
s4 += '- `mergeNumberUpTo9WithBAsTwoAL` \u2014 10.0 wrong/user combined with 51% drop; difficulty is driving both frustration and abandonment.\n';

// Table 5: High Wrong Moves + High Drop (Combined)
const t5 = [...al5]
  .map(r => ({ ...r, score: (r.wpu / maxWPU + r.dropRate) / 2 }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);
let s5 = '### 5. High Wrong Moves + High Drop Rate (Combined)\n\n';
s5 += '> **Method:** Combined score = average of (wrong moves per user normalized 0\u20131) and drop rate. Surfaces levels that are both difficult *and* causing users to quit.\n\n';
s5 += '| # | Level | Started | Wrong Moves/User | Drop% | Success% | Score |\n';
s5 += '|---|-------|---------|-----------------|-------|----------|-------|\n';
t5.forEach((r, i) => s5 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.started + ' | ' + r.wpu.toFixed(1) + ' | ' + r.dropPct + ' | ' + r.successPctStr + ' | ' + r.score.toFixed(2) + ' |\n');
s5 += '\n';
s5 += '- `matrixMultiplicationRandomNumbers3AL` \u2014 leads on difficulty (25.5 wrong/user) with 38% drop; clear priority for content intervention.\n';
s5 += '- `stackVegetablesAndFruitsOverall2AL` \u2014 largest absolute user volume (170); high on both axes with 9.8 wrong/user and 53% drop.\n';
s5 += '- `numbersFrom500To999AL` \u2014 third-highest combined score; pairs high wrong-move density with near-50% drop and only 56% success.\n';
s5 += '- `mergeNumberUpTo9WithBAsTwoAL` \u2014 51% drop plus 10.0 wrong/user \u2014 users fail repeatedly before giving up.\n';

// Table 6: Low Wrong Moves + High Drop (exclude write levels with 0 wpu by tracking gap)
const t6 = [...al5]
  .filter(r => r.dropped >= 3 && r.wpu > 0)
  .map(r => ({ ...r, score: (r.dropRate + (1 - r.wpu / maxWPU)) / 2 }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);
let s6 = '### 6. Low Wrong Moves but High Drop Rate (Early Quit)\n\n';
s6 += '> **Method:** Combined score = average of drop rate and (1 \u2212 normalized wrong-moves/user). Surfaces levels where users quit despite barely engaging \u2014 suggesting confusion, unclear instructions, or broken UX rather than difficulty. Min 3 droppers; write levels excluded.\n\n';
s6 += '| # | Level | Started | Dropped | Drop% | Wrong Moves/User | Success% |\n';
s6 += '|---|-------|---------|---------|-------|-----------------|----------|\n';
t6.forEach((r, i) => s6 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.started + ' | ' + r.dropped + ' | ' + r.dropPct + ' | ' + r.wpu.toFixed(1) + ' | ' + r.successPctStr + ' |\n');
s6 += '\n';
s6 += '- `greaterSmallerUpTo999OperatorsAL` \u2014 0.8 wrong/user with 60% drop; users barely engage before quitting, pointing to immediate comprehension failure.\n';
s6 += '- `smallBigFrom1To99NumbersAL` \u2014 3.8 wrong/user but 52% drop; 78% success among completers confirms the content is learnable \u2014 the barrier is elsewhere.\n';
s6 += '- `simpleIdentificationVegetablesSet2AL` \u2014 highest-volume level in the pool (448 starters) with 43% drop at only 3.5 wrong/user; a UX/presentation issue at scale.\n';
s6 += '- `numbersFrom500To999AL` (appears in both tables 5 and 6) \u2014 relatively low wrong moves/user for its drop rate given completers succeed; difficulty clustering may be in a specific board.\n';

const newSummary = [
  '## Summary: Top 10 Lists',
  '',
  '> **Threshold:** Minimum 5 users started. All lists are **Assessment levels only** (level IDs ending in AL).',
  '',
  s1,
  s2,
  s3,
  s4,
  s5,
  s6.trimEnd(),
].join('\n');

const summaryStart = md.indexOf('\n## Summary: Top 10 Lists');
if (summaryStart === -1) { console.error('Marker not found'); process.exit(1); }
md = md.slice(0, summaryStart + 1) + newSummary + '\n';
fs.writeFileSync(mdPath, md);
console.log('Done. Lines:', md.split('\n').length, '| maxWPU:', maxWPU.toFixed(2));
