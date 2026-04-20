const fs = require('fs');
const path = require('path');

const base = '/home/pdn/dev/abs/gd-math-godot/.analytics/gd-math-analytics';
const repoBase = '/home/pdn/dev/abs/gd-math-godot';
const mdPath = path.join(base, 'reports/assessment-wrong-moves-success-rate.md');

let md = fs.readFileSync(mdPath, 'utf8');
const config = require(path.join(repoBase, 'assets/config.json'));
const configLevels = config.levels;

const csvLines = fs.readFileSync(path.join(base, 'CSV/assessment_wrongMoves_successRate.csv'), 'utf8').trim().split('\n');
const rows = csvLines.slice(1).map(l => l.split(','));

const pct = (num, den) => den === 0 ? '-' : Math.round(num / den * 100) + '%';
const spct = (v, count) => (count === 0 || v === '' || v == null) ? '-' : Math.round(parseFloat(v) * 100) + '%';
const dur = (v, count) => (count === 0 || v === '' || v == null) ? '-' : Math.round(parseFloat(v)) + 's';

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
    const cfg = configLevels[r[0].trim()] || {};
    return {
      level: r[0].trim(),
      skillAge: cfg.skillAge !== undefined ? cfg.skillAge : '-',
      branch: cfg.branch || '-',
      started, completed, dropped,
      dropRate, dropPct: pct(dropped, started), completePct: pct(completed, started),
      successDone: spct(r[7], completed),
      successDrop: spct(r[11], dropped),
      timeDone: dur(r[6], completed),
      timeDrop: dur(r[10], dropped),
      totalWM, wpu,
      successPctRaw,
      successPctStr: successPctRaw === null ? '-' : Math.round(successPctRaw * 100) + '%',
    };
  })
  .sort((a, b) => b.started - a.started);

const al5 = al.filter(r => r.started >= 5);
const maxWPU = Math.max(...al5.map(r => r.wpu));

// ── FULL TABLE ──────────────────────────────────────────────────────────────
const tot = al.reduce((a, r) => ({
  started: a.started + r.started,
  completed: a.completed + r.completed,
  dropped: a.dropped + r.dropped
}), { started: 0, completed: 0, dropped: 0 });

let fullTable = '## Full Table \u2014 Assessment Levels Only (sorted by users started)\n\n';
fullTable += '| # | Level | SkillAge | Branch | Started | Completed | Dropped | Drop% | Complete% | Success% (done) | Success% (drop) | Avg Time (done) | Avg Time (drop) | Wrong Moves |\n';
fullTable += '|:--|:---|:--|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|\n';
fullTable += '| | **(Total)** | | | **' + tot.started + '** | **' + tot.completed + '** | **' + tot.dropped + '** | **' + pct(tot.dropped, tot.started) + '** | **' + pct(tot.completed, tot.started) + '** | | | | | |\n';
al.forEach((r, i) => {
  fullTable += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.skillAge + ' | ' + r.branch + ' | ' + r.started + ' | ' + r.completed + ' | ' + r.dropped + ' | ' + r.dropPct + ' | ' + r.completePct + ' | ' + r.successDone + ' | ' + r.successDrop + ' | ' + r.timeDone + ' | ' + r.timeDrop + ' | ' + r.totalWM + ' |\n';
});

// Replace Full Table section
const ftStart = md.indexOf('\n## Full Table');
const ftEnd = md.indexOf('\n## Key Signals');
if (ftStart === -1 || ftEnd === -1) { console.error('Full Table markers not found'); process.exit(1); }
md = md.slice(0, ftStart + 1) + fullTable + md.slice(ftEnd);

// ── SUMMARY TABLES ──────────────────────────────────────────────────────────

// Table 1
const t1 = [...al5].sort((a, b) => b.dropRate - a.dropRate).slice(0, 10);
let s1 = '### 1. Highest Drop Rate\n\n';
s1 += '| # | Level | SkillAge | Started | Dropped | Drop% | Complete% |\n';
s1 += '|---|-------|:--------:|---------|---------|-------|----------|\n';
t1.forEach((r, i) => s1 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.skillAge + ' | ' + r.started + ' | ' + r.dropped + ' | ' + r.dropPct + ' | ' + r.completePct + ' |\n');
s1 += '\n';
s1 += '- `greaterSmallerUpTo999OperatorsAL` \u2014 60% drop with only 5 starters; 0.8 wrong moves/user means users quit almost immediately, not because the content is hard.\n';
s1 += '- `stackVegetablesAndFruitsOverall2AL` \u2014 largest absolute dropout: 90 of 170 starters dropped (53%); 9.8 wrong/user confirms genuine difficulty.\n';
s1 += '- `numbersFrom500To999AL` \u2014 only 17% completion; combines high drop with low success rate \u2014 a priority candidate for content review.\n';
s1 += '- `mergeNumberUpTo9WithBAsTwoAL` \u2014 51% drop with 10.0 wrong/user; users persist through difficulty before abandoning.\n';

// Table 2
const t2 = [...al5].filter(r => r.successPctRaw !== null && r.successPctRaw > 0).sort((a, b) => a.successPctRaw - b.successPctRaw).slice(0, 10);
let s2 = '### 2. Lowest Overall Success Rate\n\n';
s2 += '> **Note:** Write levels (`writeLevelSimpleLine2AL`, `writeLevel1To52AL`) are excluded \u2014 their 0% reflects missing tracking, not actual performance.\n\n';
s2 += '| # | Level | SkillAge | Started | Success% | Drop% | Wrong Moves |\n';
s2 += '|---|-------|:--------:|---------|----------|-------|-------------|\n';
t2.forEach((r, i) => s2 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.skillAge + ' | ' + r.started + ' | ' + r.successPctStr + ' | ' + r.dropPct + ' | ' + Math.round(r.totalWM) + ' |\n');
s2 += '\n';
s2 += '- `matrixMultiplicationRandomNumbers3AL` \u2014 53% success with 25.5 wrong/user; the hardest level in the AL assessment pool.\n';
s2 += '- `numbersFrom500To999AL` \u2014 56% success with 47% drop; users both struggle and quit \u2014 a double-failure signal.\n';
s2 += '- `matchEdgesCorners22AL` \u2014 65% success despite 100% completion (all who start, finish); completers still average 10.9 wrong moves.\n';
s2 += '- `fractionMultiplication6AL` \u2014 71% success with 424 total wrong moves across 49 starters; third-largest wrong-move volume in the pool.\n';

// Table 3
const t3 = [...al5].sort((a, b) => (a.completed / a.started) - (b.completed / b.started)).slice(0, 10);
let s3 = '### 3. Lowest Completion Rate\n\n';
s3 += '| # | Level | SkillAge | Started | Completed | Complete% | Drop% | Success% |\n';
s3 += '|---|-------|:--------:|---------|-----------|-----------|-------|----------|\n';
t3.forEach((r, i) => s3 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.skillAge + ' | ' + r.started + ' | ' + r.completed + ' | ' + r.completePct + ' | ' + r.dropPct + ' | ' + r.successPctStr + ' |\n');
s3 += '\n';
s3 += '- `numbersFrom500To999AL` \u2014 only 5 of 30 starters completed (17%); also lowest success \u2014 the weakest level in the AL pool on multiple axes.\n';
s3 += '- `greaterSmallerUpTo999OperatorsAL` \u2014 2 of 5 completed (40%); too small a sample but consistent with its early-quit pattern.\n';
s3 += '- `matchActivitiesWithObject2AL` \u2014 44% drop with only 41% completion; notable given its volume (61 starters).\n';
s3 += '- `matrixMultiplicationRandomNumbers3AL` \u2014 46% completion with 25.5 wrong/user; the completers persist through repeated failure.\n';

// Table 4
const t4 = [...al5].sort((a, b) => b.wpu - a.wpu).slice(0, 10);
let s4 = '### 4. Most Wrong Moves per User\n\n';
s4 += '| # | Level | SkillAge | Started | Total Wrong Moves | Wrong Moves / User | Drop% | Success% |\n';
s4 += '|---|-------|:--------:|---------|-------------------|--------------------|-------|----------|\n';
t4.forEach((r, i) => s4 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.skillAge + ' | ' + r.started + ' | ' + Math.round(r.totalWM) + ' | ' + r.wpu.toFixed(1) + ' | ' + r.dropPct + ' | ' + r.successPctStr + ' |\n');
s4 += '\n';
s4 += '- `matrixMultiplicationRandomNumbers3AL` \u2014 25.5 wrong/user, more than double the #2 level; a clear difficulty outlier.\n';
s4 += '- `stackTensAndOnes20UpTo502AL` \u2014 12.0 wrong/user with 0% drop rate; users persist through all boards despite struggle \u2014 scaffolding may help.\n';
s4 += '- `matchEdgesCorners22AL` \u2014 10.9 wrong/user with 100% completion; users finish but the wrong-move volume is high throughout.\n';
s4 += '- `mergeNumberUpTo9WithBAsTwoAL` \u2014 10.0 wrong/user combined with 51% drop; difficulty is driving both frustration and abandonment.\n';

// Table 5
const t5 = [...al5].map(r => ({ ...r, score: (r.wpu / maxWPU + r.dropRate) / 2 })).sort((a, b) => b.score - a.score).slice(0, 10);
let s5 = '### 5. High Wrong Moves + High Drop Rate (Combined)\n\n';
s5 += '> **Method:** Combined score = average of (wrong moves per user normalized 0\u20131) and drop rate. Surfaces levels that are both difficult *and* causing users to quit.\n\n';
s5 += '| # | Level | SkillAge | Started | Wrong Moves/User | Drop% | Success% | Score |\n';
s5 += '|---|-------|:--------:|---------|-----------------|-------|----------|-------|\n';
t5.forEach((r, i) => s5 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.skillAge + ' | ' + r.started + ' | ' + r.wpu.toFixed(1) + ' | ' + r.dropPct + ' | ' + r.successPctStr + ' | ' + r.score.toFixed(2) + ' |\n');
s5 += '\n';
s5 += '- `matrixMultiplicationRandomNumbers3AL` \u2014 leads on difficulty (25.5 wrong/user) with 38% drop; clear priority for content intervention.\n';
s5 += '- `stackVegetablesAndFruitsOverall2AL` \u2014 largest absolute user volume (170); high on both axes with 9.8 wrong/user and 53% drop.\n';
s5 += '- `numbersFrom500To999AL` \u2014 third-highest combined score; pairs high wrong-move density with near-50% drop and only 56% success.\n';
s5 += '- `mergeNumberUpTo9WithBAsTwoAL` \u2014 51% drop plus 10.0 wrong/user \u2014 users fail repeatedly before giving up.\n';

// Table 6
const t6 = [...al5].filter(r => r.dropped >= 3 && r.wpu > 0).map(r => ({ ...r, score: (r.dropRate + (1 - r.wpu / maxWPU)) / 2 })).sort((a, b) => b.score - a.score).slice(0, 10);
let s6 = '### 6. Low Wrong Moves but High Drop Rate (Early Quit)\n\n';
s6 += '> **Method:** Combined score = average of drop rate and (1 \u2212 normalized wrong-moves/user). Surfaces levels where users quit despite barely engaging \u2014 suggesting confusion, unclear instructions, or broken UX rather than difficulty. Min 3 droppers; write levels excluded.\n\n';
s6 += '| # | Level | SkillAge | Started | Dropped | Drop% | Wrong Moves/User | Success% |\n';
s6 += '|---|-------|:--------:|---------|---------|-------|-----------------|----------|\n';
t6.forEach((r, i) => s6 += '| ' + (i + 1) + ' | ' + r.level + ' | ' + r.skillAge + ' | ' + r.started + ' | ' + r.dropped + ' | ' + r.dropPct + ' | ' + r.wpu.toFixed(1) + ' | ' + r.successPctStr + ' |\n');
s6 += '\n';
s6 += '- `greaterSmallerUpTo999OperatorsAL` \u2014 0.8 wrong/user with 60% drop; users barely engage before quitting, pointing to immediate comprehension failure.\n';
s6 += '- `smallBigFrom1To99NumbersAL` \u2014 3.8 wrong/user but 52% drop; 78% success among completers confirms the content is learnable \u2014 the barrier is elsewhere.\n';
s6 += '- `simpleIdentificationVegetablesSet2AL` \u2014 highest-volume level in the pool (448 starters) with 43% drop at only 3.5 wrong/user; a UX/presentation issue at scale.\n';
s6 += '- **Tight cluster at rows 4\u201310** \u2014 six levels share nearly identical profiles: 40\u201346% drop, 5.4\u20136.3 wrong/user, 81\u201388% success. The consistency across unrelated content types (fractions, matching, stacking, summarizing) points to a **shared structural cause** \u2014 likely the level intro/instruction screen or first-board UX \u2014 rather than six separate content problems.\n';
s6 += '- `matchActivitiesWithObject2AL` (row 7) \u2014 at 6.3 wrong/user it is the highest in this table and also appears in Table 5 (combined score 0.34). It sits on the boundary between early-quit and genuine difficulty; it warrants both a UX review and a difficulty pass.\n';
s6 += '- `summarizeTheSentences1AL` (row 9) \u2014 lowest success% in Table 6 at 73%, noticeably below the 78\u201391% range of the other entries. Some content difficulty is likely compounding the engagement issue.\n';
s6 += '- **Absolute impact priority** \u2014 `simpleIdentificationVegetablesSet2AL` (448 starters) and `matchNumberCount1to72AL` (134 starters) together account for **253 dropped users**. Fixing the early-quit cause on these two levels alone would have the largest absolute recovery in the AL pool.';

// Build new summary section (preserve everything from "## Summary" through the end of table 6, then keep Overall Findings)
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
  s6,
].join('\n');

// Find the boundary: summary start → start of Overall Findings (keep that intact)
const summaryStart = md.indexOf('\n## Summary: Top 10 Lists');
const overallStart = md.indexOf('\n---\n\n## Overall Findings');
if (summaryStart === -1 || overallStart === -1) { console.error('Section markers not found'); process.exit(1); }
md = md.slice(0, summaryStart + 1) + newSummary + '\n' + md.slice(overallStart + 1);

fs.writeFileSync(mdPath, md);
console.log('Done. Lines:', md.split('\n').length);
