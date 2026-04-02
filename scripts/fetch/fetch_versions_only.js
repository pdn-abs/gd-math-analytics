const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');
const path = require('path');

// Fetch version-specific metrics for app versions that have data
async function fetchVersionMetrics () {
    console.log('Fetching version-specific metrics...');
    const client = new BetaAnalyticsDataClient();

    // First, get all available versions with data
    const versionsRequest = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-07-01', endDate: '2026-02-28' }],
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

    const results = {};

    try {
        const [versionsResponse] = await client.runReport(versionsRequest);
        const availableVersions = versionsResponse.rows.map((row) => row.dimensionValues[0].value);

        console.log(`Found ${ availableVersions.length } versions with data:`, availableVersions);

        // Now fetch detailed metrics for each available version
        for(const version of availableVersions) {
            console.log(`Fetching detailed metrics for version ${ version }...`);

            const request = {
                property: 'properties/441470574',
                dateRanges: [{ startDate: '2025-07-01', endDate: '2026-02-28' }],
                dimensions: [{ name: 'appVersion' }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'active1DayUsers' },
                    { name: 'active7DayUsers' },
                    { name: 'active28DayUsers' },
                    { name: 'averageSessionDuration' },
                    { name: 'engagedSessions' },
                    { name: 'engagementRate' },
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

                    results[version] = {
                        'WAU/MAU': wauMauRatio,
                        'DAU/WAU': dauWauRatio,
                        'Average Session Duration': `${ parseFloat(metrics[4].value).toFixed(2) }s`,
                        'User Engagement': 'N/A', // Removed from query
                        'Returning Users': 'N/A', // Removed from query
                        'Engaged Sessions': parseInt(metrics[5].value),
                        'Engagement Rate': `${ (parseFloat(metrics[6].value) * 100).toFixed(2) }%`,
                        'Active Users': activeUsers,
                    };
                }
                else {
                    results[version] = {
                        'WAU/MAU': 'N/A',
                        'DAU/WAU': 'N/A',
                        'Average Session Duration': 'N/A',
                        'User Engagement': 'N/A',
                        'Returning Users': 'N/A',
                        'Engaged Sessions': 'N/A',
                        'Engagement Rate': 'N/A',
                        'Active Users': 'N/A',
                    };
                }

                // Add delay to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            catch (error) {
                console.error(`Error fetching data for version ${ version }:`, error.message);
                results[version] = {
                    'WAU/MAU': 'Error',
                    'DAU/WAU': 'Error',
                    'Average Session Duration': 'Error',
                    'User Engagement': 'Error',
                    'Returning Users': 'Error',
                    'Engaged Sessions': 'Error',
                    'Engagement Rate': 'Error',
                    'Active Users': 'Error',
                };
            }
        }

        // Add N/A entries for versions that don't have data (v4.3.0 to v4.3.22)
        const allVersions = [];

        for(let i = 0; i <= 22; i++)
            allVersions.push(`v4.3.${ i }`);

        allVersions.forEach((version) => {
            if(!results[version]) {
                results[version] = {
                    'WAU/MAU': 'N/A',
                    'DAU/WAU': 'N/A',
                    'Average Session Duration': 'N/A',
                    'User Engagement': 'N/A',
                    'Returning Users': 'N/A',
                    'Engaged Sessions': 'N/A',
                    'Engagement Rate': 'N/A',
                    'Active Users': 'N/A',
                };
            }
        });

        fs.writeFileSync(path.resolve(__dirname, '../../data/version_metrics.json'), JSON.stringify(
            results, null, 2
        ));
        console.log('Version metrics data fetched successfully.');
    }
    catch (error) {
        console.error('Error fetching versions list:', error.message);
    }
}

// Run only the version metrics function
fetchVersionMetrics();
