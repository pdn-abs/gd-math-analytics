const fetch = require('./fetch');
const analyzeData = require('./analyze');
const visualizeData = require('./visualize');

async function runAnalysis () {
	console.log('Running one-off GA analysis...');

	await fetch.fetchGAData();
	analyzeData();
	visualizeData();

	console.log('One-off analysis complete.');
}

runAnalysis().catch((error) => {
	console.error('One-off analysis failed:', error);
	process.exitCode = 1;
});
