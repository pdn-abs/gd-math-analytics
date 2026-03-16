const cron = require('node-cron');
const fetch = require('./fetch');
const analyzeData = require('./analyze');
const visualizeData = require('./visualize');

async function runAnalysis () {
    console.log('Starting automated GA analysis...');
    await fetch.fetchGAData();
    await fetch.fetchLevelEngagement();
    await fetch.fetchRetention();
    await fetch.fetchPreDropsLevelEngagement();
    await fetch.fetchFullLevelEngagement();
    // Optionally run monthly retention and version metrics less frequently
    analyzeData();
    visualizeData();
    console.log('Analysis complete.');
}

// Schedule: Run daily at 9 AM
cron.schedule('0 9 * * *', runAnalysis);

console.log('Automation scheduled. Running in background...');
