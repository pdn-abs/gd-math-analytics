const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('./assets/config.json', 'utf8'));
const levels = cfg.levels || {};

// Group assessment levels by skillAge
const byAge = {};
Object.entries(levels)
  .filter(([id, lvl]) => Array.isArray(lvl.tags) && lvl.tags.includes('assessment'))
  .forEach(([id, lvl]) => {
    const sa = lvl.skillAge;
    if (sa !== undefined && sa !== null) {
      if (!byAge[sa]) byAge[sa] = [];
      byAge[sa].push({ id, sequence: lvl.sequence });
    }
  });

// Find first level for each SkillAge
console.log('=== FIRST ASSESSMENT LEVELS BY SKILL AGE ===\n');
Object.keys(byAge).sort((a,b) => a-b).forEach(sa => {
  byAge[sa].sort((a,b) => a.sequence - b.sequence);
  console.log('SkillAge ' + sa + ' FIRST: ' + byAge[sa][0].id + ' (seq ' + byAge[sa][0].sequence + ')');
});

console.log('\n=== ALL LEVELS BY SKILL AGE ===\n');
Object.keys(byAge).sort((a,b) => a-b).forEach(sa => {
  console.log('SkillAge ' + sa + ' levels: ' + byAge[sa].map(l => l.id + '(' + l.sequence + ')').join(', '));
});

// Export for next analysis
module.exports = { byAge };
