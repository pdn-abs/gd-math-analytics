const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration paths
const configPath = '/home/pdn/dev/abs/gd-math-godot/assets/config.json';
const csvPath = '/home/pdn/dev/abs/gd-math-godot/.analytics/gd-math-analytics/data/csv/assessment_segment_level.csv';

async function parseCSV(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const rows = [];
  let lineNum = 0;

  for await (const line of rl) {
    lineNum++;
    // Skip header and metadata rows
    if (lineNum <= 4) continue;
    if (line.trim() === '') continue;
    if (line.startsWith('#')) continue;

    const parts = line.split(',');
    if (parts.length >= 4 && parts[0].trim() && parts[0].trim() !== 'Segment') {
      rows.push({
        levelID: parts[0].trim(),
        segmentStarted: parseInt(parts[1].trim()) || 0,
        segmentCompleted: parseInt(parts[2].trim()) || 0,
        segmentDropped: parseInt(parts[3].trim()) || 0
      });
    }
  }

  return rows;
}

async function main() {
  try {
    // Load config.json
    console.log('Loading config.json...');
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);

    // Create levelID -> level mapping with skillAge and sequence
    const levelMap = {};
    Object.entries(config.levels).forEach(([key, level]) => {
      if (level.id) {
        levelMap[level.id] = {
          id: level.id,
          skillAge: level.skillAge || 0,
          sequence: level.sequence || 0,
          title: level.title || ''
        };
      }
    });

    console.log(`Loaded ${Object.keys(levelMap).length} levels from config.json`);

    // Load CSV
    console.log('Loading CSV...');
    const csvData = await parseCSV(csvPath);
    console.log(`Loaded ${csvData.length} rows from CSV`);

    // Merge config and CSV data
    const levelStats = [];
    csvData.forEach(row => {
      const levelInfo = levelMap[row.levelID];
      if (levelInfo) {
        const dropRate = row.segmentStarted > 0 ? (row.segmentDropped / row.segmentStarted) * 100 : 0;
        levelStats.push({
          levelID: row.levelID,
          skillAge: levelInfo.skillAge,
          sequence: levelInfo.sequence,
          title: levelInfo.title,
          started: row.segmentStarted,
          dropped: row.segmentDropped,
          dropRate: dropRate
        });
      }
    });

    console.log(`Matched ${levelStats.length} levels with stats`);

    // Identify first levels per skillAge
    const firstLevelsBySkillAge = {};
    const nonFirstLevelsBySkillAge = {};

    skillAgeSet = new Set(levelStats.map(l => l.skillAge));
    skillAgeSet.forEach(sa => {
      firstLevelsBySkillAge[sa] = null;
      nonFirstLevelsBySkillAge[sa] = [];
    });

    levelStats.forEach(level => {
      const sa = level.skillAge;
      if (!firstLevelsBySkillAge[sa] || level.sequence < firstLevelsBySkillAge[sa].sequence) {
        if (firstLevelsBySkillAge[sa]) {
          nonFirstLevelsBySkillAge[sa].push(firstLevelsBySkillAge[sa]);
        }
        firstLevelsBySkillAge[sa] = level;
      } else {
        nonFirstLevelsBySkillAge[sa].push(level);
      }
    });

    // Generate comparison table
    console.log('\n\n# Assessment Drop Rate Analysis: First Levels vs Non-First Levels\n');
    console.log('| SkillAge | First Level | Drop% | Started | Avg Non-First Drop% | Non-First Count | Difference |');
    console.log('|----------|-------------|-------|---------|---------------------|-----------------|------------|');

    const results = [];
    Array.from(skillAgeSet).sort((a, b) => a - b).forEach(sa => {
      const firstLevel = firstLevelsBySkillAge[sa];
      const nonFirstLevels = nonFirstLevelsBySkillAge[sa];

      if (firstLevel && nonFirstLevels.length > 0) {
        const avgNonFirstDrop = nonFirstLevels.reduce((sum, l) => sum + l.dropRate, 0) / nonFirstLevels.length;
        const difference = firstLevel.dropRate - avgNonFirstDrop;

        let indicator = difference > 10 ? ' ⚠️' : '';

        console.log(`| ${sa} | ${firstLevel.title || firstLevel.levelID} | ${firstLevel.dropRate.toFixed(1)}% | ${firstLevel.started} | ${avgNonFirstDrop.toFixed(1)}% | ${nonFirstLevels.length} | ${difference > 0 ? '+' : ''}${difference.toFixed(1)}%${indicator} |`);

        results.push({
          skillAge: sa,
          firstLevelTitle: firstLevel.title || firstLevel.levelID,
          firstLevelDropRate: firstLevel.dropRate,
          firstLevelStarted: firstLevel.started,
          avgNonFirstDropRate: avgNonFirstDrop,
          nonFirstCount: nonFirstLevels.length,
          difference: difference
        });
      }
    });

    // Summary analysis
    console.log('\n## Analysis Summary\n');
    const highDifferenceCount = results.filter(r => r.difference > 10).length;
    const avgAllDifferences = results.reduce((sum, r) => sum + r.difference, 0) / results.length;

    console.log(`- Total SkillAges analyzed: ${results.length}`);
    console.log(`- First levels with >10% higher drop rates than non-first: ${highDifferenceCount}`);
    console.log(`- Average difference across all SkillAges: ${avgAllDifferences.toFixed(1)}%`);

    if (highDifferenceCount > 0) {
      console.log(`\n⚠️ **Finding**: First assessment levels tend to have HIGHER drop rates than subsequent levels in ${highDifferenceCount}/${results.length} SkillAges.`);
    }

    const negativeCount = results.filter(r => r.difference < -10).length;
    if (negativeCount > 0) {
      console.log(`\n✓ **Finding**: In ${negativeCount} SkillAges, first levels have LOWER drop rates than subsequent levels.`);
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
