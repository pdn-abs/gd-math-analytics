// Fetch monthly version metrics for more accurate session-level analysis
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');

async function fetchMonthlyVersionMetrics () {
    console.log('Fetching monthly version metrics for accurate session analysis...');
    const client = new BetaAnalyticsDataClient();

    // Define the months to analyze (July 2025 - February 2026)
    const months = [
        { name: 'July 2025', start: '2025-07-01', end: '2025-07-31' },
        { name: 'August 2025', start: '2025-08-01', end: '2025-08-31' },
        { name: 'September 2025', start: '2025-09-01', end: '2025-09-30' },
        { name: 'October 2025', start: '2025-10-01', end: '2025-10-31' },
        { name: 'November 2025', start: '2025-11-01', end: '2025-11-30' },
        { name: 'December 2025', start: '2025-12-01', end: '2025-12-31' },
        { name: 'January 2026', start: '2026-01-01', end: '2026-01-31' },
        { name: 'February 2026', start: '2026-02-01', end: '2026-02-28' },
    ];

    const results = {};

    for(const month of months) {
        console.log(`Fetching data for ${ month.name }...`);
        results[month.name] = {};

        // First get available versions for this month
        const versionsRequest = {
            property: 'properties/441470574',
            dateRanges: [{ startDate: month.start, endDate: month.end }],
            dimensions: [{ name: 'appVersion' }],
            metrics: [{ name: 'activeUsers' }],
            dimensionFilter: {
                filter: {
                    fieldName: 'streamName',
                    stringFilter: {
                        value: 'GD MATH',
                        matchType: 'EXACT',
                    },
                },
            },
            orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
            limit: 50,
        };

        try {
            const [versionsResponse] = await client.runReport(versionsRequest);
            const availableVersions = versionsResponse.rows
                .map((row) => row.dimensionValues[0].value)
                .filter((version) => version.startsWith('v4.3.'));

            // Fetch detailed metrics for each v4.3.x version available this month
            for(const version of availableVersions) {
                console.log(`  Fetching ${ version } for ${ month.name }...`);

                const request = {
                    property: 'properties/441470574',
                    dateRanges: [{ startDate: month.start, endDate: month.end }],
                    dimensions: [{ name: 'appVersion' }],
                    metrics: [
                        { name: 'activeUsers' },
                        { name: 'active1DayUsers' },
                        { name: 'active7DayUsers' },
                        { name: 'active28DayUsers' },
                        { name: 'averageSessionDuration' },
                        { name: 'userEngagementDuration' },
                        { name: 'returningUsers' },
                        { name: 'engagedSessions' },
                        { name: 'engagementRate' },
                        { name: 'sessions' },
                    ],
                    dimensionFilter: {
                        andGroup: {
                            expressions: [
                                {
                                    filter: {
                                        fieldName: 'appVersion',
                                        stringFilter: {
                                            value: version,
                                            matchType: 'EXACT',
                                        },
                                    },
                                },
                                {
                                    filter: {
                                        fieldName: 'streamName',
                                        stringFilter: {
                                            value: 'GD MATH',
                                            matchType: 'EXACT',
                                        },
                                    },
                                },
                            ],
                        },
                    },
                };

                try {
                    const [response] = await client.runReport(request);

                    if(response.rows && response.rows.length > 0) {
                        const row = response.rows[0];
                        const metrics = row.metricValues;

                        // Calculate ratios
                        const activeUsers = parseInt(metrics[0].value);
                        const dau = parseInt(metrics[1].value);
                        const wau = parseInt(metrics[2].value);
                        const mau = parseInt(metrics[3].value);

                        const dauWauRatio = wau > 0 ? (dau / wau).toFixed(3) : '0.000';
                        const wauMauRatio = mau > 0 ? (wau / mau).toFixed(3) : '0.000';

                        results[month.name][version] = {
                            'Active Users': activeUsers,
                            'DAU/WAU': dauWauRatio,
                            'WAU/MAU': wauMauRatio,
                            'Sessions': parseInt(metrics[9].value),
                            'Avg Session Duration': `${ parseFloat(metrics[4].value).toFixed(2) }s`,
                            'User Engagement Duration': `${ parseFloat(metrics[5].value).toFixed(2) }s`,
                            'Returning Users': parseInt(metrics[6].value),
                            'Engaged Sessions': parseInt(metrics[7].value),
                            'Engagement Rate': `${ (parseFloat(metrics[8].value) * 100).toFixed(2) }%`,
                        };
                    }
                }
                catch (error) {
                    console.error(`Error fetching ${ version } for ${ month.name }:`, error.message);
                }

                // Rate limiting
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
        }
        catch (error) {
            console.error(`Error fetching versions for ${ month.name }:`, error.message);
        }

        // Rate limiting between months
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    fs.writeFileSync('../data/monthly_version_metrics.json', JSON.stringify(
        results, null, 2
    ));
    console.log('Monthly version metrics data fetched successfully.');
}

// Run the fetch
fetchMonthlyVersionMetrics();
