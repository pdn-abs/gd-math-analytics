const cron = require('node-cron');
const fetch = require('./fetch');
const analyzeData = require('./analyze');
const visualizeData = require('./visualize');

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 9 * * *';
const RUN_ON_START = process.env.RUN_ON_START === 'true';
const ENABLE_FULL_FETCH = process.env.ENABLE_FULL_FETCH === 'true';

async function runAnalysis () {
    console.log('Starting automated GA analysis...');

    await fetch.fetchGAData();

    if (ENABLE_FULL_FETCH) {
        await fetch.fetchLevelEngagement();
        await fetch.fetchRetention();
        await fetch.fetchPreDropsLevelEngagement();
        await fetch.fetchFullLevelEngagement();
    }

    analyzeData();
    visualizeData();
    console.log('Analysis complete.');
}

cron.schedule(CRON_SCHEDULE, async () => {
	try {
		await runAnalysis();
	}
	catch (error) {
		console.error('Scheduled analysis failed:', error);
	}
});

if (RUN_ON_START) {
	runAnalysis().catch((error) => {
		console.error('Startup analysis failed:', error);
	});
}

console.log(`Automation scheduled (${CRON_SCHEDULE}). Running in background...`);
