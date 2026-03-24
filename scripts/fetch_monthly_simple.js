// Fetch analysis window version metrics using a simpler approach
// MODIFIED: Added user segment to match UI definition of Active Users (users with engaged sessions)
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');

async function fetchAnalysisWindowVersionMetricsSimple () {
    console.log('Fetching analysis window version metrics using simplified approach...');
    const client = new BetaAnalyticsDataClient();

    // Define the analysis window (Oct 20, 2025 – Mar 11, 2026)
    const analysisWindow = {
        start: '2025-10-20',
        end: '2026-03-11'
    };

    const results = {};

    // Fetch data for the analysis window
    console.log(`Fetching data for Analysis Window: ${analysisWindow.start} to ${analysisWindow.end}...`);
    results['Analysis Window'] = {};

    try {
        // Get all data for the analysis window
        const request = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: analysisWindow.start, endDate: analysisWindow.end }],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            fieldName: 'streamName',
                            stringFilter: {
                                value: 'GD Math',
                                matchType: 'EXACT'
                            }
                        }
                    },
                    {
                        filter: {
                            fieldName: 'appVersion',
                            stringFilter: {
                                value: 'v4.3.',
                                matchType: 'BEGINS_WITH'
                            }
                        }
                    }
                ]
            }
        },
            dimensions: [
                { name: 'appVersion' },
                { name: 'streamName' },
            ],
            metrics: [
                { name: 'activeUsers' },
                { name: 'active1DayUsers' },
                { name: 'active7DayUsers' },
                { name: 'active28DayUsers' },
                { name: 'averageSessionDuration' },
                { name: 'engagedSessions' },
                { name: 'engagementRate' },
                { name: 'sessions' },
            ],
            userSegment: {
                name: 'Engaged Users',
                sessionSegment: {
                    segmentFilter: {
                        filter: {
                            fieldName: 'sessionDuration',
                            numericFilter: {
                                operation: 'GREATER_THAN',
                                value: {
                                    int64Value: '10'
                                }
                            },
                        },
                    },
                },
            },
            orderBys: [
                { dimension: { dimensionName: 'appVersion' }},
                { metric: { metricName: 'activeUsers' }, desc: true },
            ],
            limit: 100,
        };

        const [response] = await client.runReport(request);

        if(response.rows) {
            response.rows.forEach((row) => {
                const version = row.dimensionValues[0].value;
                const stream = row.dimensionValues[1].value;

                // All data already filtered at API level for v4.3.x versions and GD Math stream
                const metrics = row.metricValues;

                        // Calculate ratios
                        const activeUsers = parseInt(metrics[0].value);
                        const dau = parseInt(metrics[1].value);
                        const wau = parseInt(metrics[2].value);
                        const mau = parseInt(metrics[3].value);

                        const dauWauRatio = wau > 0 ? (dau / wau).toFixed(3) : '0.000';
                        const wauMauRatio = mau > 0 ? (wau / mau).toFixed(3) : '0.000';

                        results['Analysis Window'][version] = {
                            'Active Users': activeUsers,
                            'DAU/WAU': dauWauRatio,
                            'WAU/MAU': wauMauRatio,
                            'Sessions': parseInt(metrics[7].value),
                            'Avg Session Duration': `${ parseFloat(metrics[4].value).toFixed(2) }s`,
                            'User Engagement Duration': 'N/A', // Removed from query
                            'Returning Users': 'N/A', // Removed from query
                            'Engaged Sessions': parseInt(metrics[5].value),
                            'Engagement Rate': `${ parseFloat(metrics[6].value).toFixed(2) }%`,
                        };
                });

                console.log(`Processed ${ Object.keys(results['Analysis Window']).length } v4.3.x versions for Analysis Window`);
            }
        }
    catch (error) {
        console.error(`Error fetching data for Analysis Window:`, error.message);
    }

    fs.writeFileSync('../data/monthly_version_metrics.json', JSON.stringify(
        results, null, 2
    ));
    console.log('Analysis window version metrics data fetched successfully.');
}

// Run the fetch
fetchAnalysisWindowVersionMetricsSimple();
