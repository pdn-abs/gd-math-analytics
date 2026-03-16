const fs = require('fs');

function analyzeData () {
    try {
        const data = JSON.parse(fs.readFileSync('./analytics/data/ga_data.json'));

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
        fs.writeFileSync('./analytics/data/level_summary.json', JSON.stringify(
            dailySummary, null, 2
        ));
        console.log('Data analyzed successfully.');
    }
    catch (error) {
        console.error('Error analyzing data:', error);
    }
}

module.exports = analyzeData;

// Run the function
analyzeData();
