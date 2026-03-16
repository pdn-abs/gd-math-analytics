const fs = require('fs');
const path = require('path');

function analyzeData () {
	const inputPath = path.join(__dirname, '..', 'data', 'ga_data.json');
	const outputPath = path.join(__dirname, '..', 'data', 'level_summary.json');

    try {
        const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

        console.log('Total data rows:', data.length);
        const levelData = data.filter((row) => row.eventName === 'LevelData');

        console.log('LevelData rows:', levelData.length);
        const dailySummary = levelData.reduce((acc, row) => {
            if(!acc[row.date])
                acc[row.date] = 0;
            acc[row.date] += row.eventCount;
            return acc;
        }, {});

        console.log('Daily summary:', dailySummary);
        fs.writeFileSync(outputPath, JSON.stringify(
            dailySummary, null, 2
        ));
        console.log('Data analyzed successfully.');
    }
    catch (error) {
        console.error('Error analyzing data:', error);
    }
}

module.exports = analyzeData;

if (require.main === module)
    analyzeData();
