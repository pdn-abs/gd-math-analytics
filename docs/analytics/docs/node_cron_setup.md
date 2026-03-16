# Complete Setup for Google Analytics Automation Using node-cron

This setup automates GA data fetching, processing, visualization, and reporting using Node.js and node-cron for scheduling. It's simpler than Agenda.js, with no database needed. Follow the steps below to implement in your GD Math project.

## 1. Prerequisites
- **GA4 Property**: Set up with custom events (e.g., `level_completed` with `level_id`).
- **API Access**: Enable Google Analytics Data API, create a service account, download JSON key, and set `GOOGLE_APPLICATION_CREDENTIALS` environment variable.
- **Node.js Environment**: Version 14+. Install packages: `npm install @google-analytics/data csv-parser d3 node-cron fs`.
- **Project Folder**: Create a `analytics/` subfolder in your project root for scripts.

## 2. Scripts
Create these files in `analytics/`. Replace `YOUR_PROPERTY_ID` with your actual GA property ID.

**analytics/fetch.js** (Fetches GA data):
```javascript
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');

async function fetchGAData() {
    const client = new BetaAnalyticsDataClient();
    const request = {
        property: 'properties/YOUR_PROPERTY_ID',
        dateRanges: [{ startDate: '2023-01-01', endDate: '2023-12-31' }],
        dimensions: [{ name: 'eventName' }, { name: 'customEvent:level_id' }],
        metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
    };
    try {
        const [response] = await client.runReport(request);
        const data = response.rows.map(row => ({
            eventName: row.dimensionValues[0].value,
            levelId: row.dimensionValues[1].value,
            eventCount: parseInt(row.metricValues[0].value),
            totalUsers: parseInt(row.metricValues[1].value),
        }));
        fs.writeFileSync('./analytics/ga_data.json', JSON.stringify(data, null, 2));
        console.log('GA data fetched successfully.');
    } catch (error) {
        console.error('Error fetching GA data:', error);
    }
}

module.exports = fetchGAData;
```

**analytics/analyze.js** (Processes data):
```javascript
const fs = require('fs');

function analyzeData() {
    try {
        const data = JSON.parse(fs.readFileSync('./analytics/ga_data.json'));
        const levelData = data.filter(row => row.eventName === 'level_completed');
        const summary = levelData.reduce((acc, row) => {
            if (!acc[row.levelId]) acc[row.levelId] = { eventCount: 0, totalUsers: 0 };
            acc[row.levelId].eventCount += row.eventCount;
            acc[row.levelId].totalUsers += row.totalUsers;
            return acc;
        }, {});
        Object.keys(summary).forEach(id => {
            summary[id].completion_rate = summary[id].eventCount / summary[id].totalUsers;
        });
        fs.writeFileSync('./analytics/level_summary.json', JSON.stringify(summary, null, 2));
        console.log('Data analyzed successfully.');
    } catch (error) {
        console.error('Error analyzing data:', error);
    }
}

module.exports = analyzeData;
```

**analytics/visualize.js** (Generates chart):
```javascript
const d3 = require('d3-node')();
const fs = require('fs');

function visualizeData() {
    try {
        const summary = JSON.parse(fs.readFileSync('./analytics/level_summary.json'));
        const svg = d3.select(d3.create('svg')).attr('width', 400).attr('height', 200);
        svg.selectAll('rect')
            .data(Object.entries(summary))
            .enter().append('rect')
            .attr('x', (d, i) => i * 40)
            .attr('y', d => 200 - d[1].eventCount * 2)  // Scale for visibility
            .attr('width', 30)
            .attr('height', d => d[1].eventCount * 2)
            .attr('fill', 'blue');
        fs.writeFileSync('./analytics/level_completions.svg', d3.svgString());
        console.log('Visualization generated.');
    } catch (error) {
        console.error('Error visualizing data:', error);
    }
}

module.exports = visualizeData;
```

**analytics/automate.js** (Schedules tasks):
```javascript
const cron = require('node-cron');
const fetchGAData = require('./fetch');
const analyzeData = require('./analyze');
const visualizeData = require('./visualize');

async function runAnalysis() {
    console.log('Starting automated GA analysis...');
    await fetchGAData();
    analyzeData();
    visualizeData();
    console.log('Analysis complete.');
}

// Schedule: Run daily at 9 AM
cron.schedule('0 9 * * *', runAnalysis);

console.log('Automation scheduled. Running in background...');
```

## 3. Running the Setup
- **Manual Test**: Run scripts individually: `node analytics/fetch.js`, then `node analytics/analyze.js`, etc.
- **Start Automation**: Run `node analytics/automate.js` (keeps running; use PM2 or similar for production).
- **Stop**: Ctrl+C to stop the process.
- **Output Files**: Check `analytics/ga_data.json`, `level_summary.json`, and `level_completions.svg`.

## 4. Integration with GD Math Project
- **Analytics.gd**: Ensure events send `level_id` to GA.
- **Build Scripts**: Add `node analytics/automate.js &` to `build.sh` for background runs.
- **Notifications**: Extend with `nodemailer` for email alerts on completion.
- **Version Control**: Add `analytics/` to Git; ignore credentials in `.gitignore`.

## 5. Testing and Maintenance
- Use GA demo property for testing.
- Monitor console for errors; handle API quotas.
- Adjust dates/metrics as needed.
- For weekly runs, change cron to `'0 9 * * 1'` (Mondays).

This provides a complete, automated workflow. If errors occur, check credentials and GA setup. For Python alternatives or refinements, let me know.