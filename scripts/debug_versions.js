const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Test simpler version metrics query
async function testSimpleVersionQuery () {
    console.log('Testing simple version query...');
    const client = new BetaAnalyticsDataClient();

    // First, let's get all app versions without filtering
    const request1 = {
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
        limit: 20,
    };

    try {
        const [response] = await client.runReport(request1);

        console.log('Available versions with data:');
        response.rows.forEach((row) => {
            console.log(`${ row.dimensionValues[0].value }: ${ row.metricValues[0].value } users`);
        });

        // Now test a specific version that we know exists
        const testVersion = response.rows[0]?.dimensionValues[0].value;

        if(testVersion) {
            console.log(`\nTesting specific query for ${ testVersion }...`);

            const request2 = {
                property: 'properties/441470574',
                dateRanges: [{ startDate: '2025-07-01', endDate: '2026-02-28' }],
                dimensions: [{ name: 'appVersion' }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'averageSessionDuration' },
                    { name: 'engagedSessions' },
                ],
                dimensionFilter: {
                    andGroup: {
                        expressions: [
                            {
                                filter: {
                                    fieldName: 'appVersion',
                                    stringFilter: {
                                        value: testVersion,
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

            const [response2] = await client.runReport(request2);

            if(response2.rows && response2.rows.length > 0) {
                const metrics = response2.rows[0].metricValues;

                console.log(`Success! ${ testVersion } - Users: ${ metrics[0].value }, Avg Session: ${ metrics[1].value }s, Engaged Sessions: ${ metrics[2].value }`);
            }
        }
    }
    catch (error) {
        console.error('Error:', error.message);
    }
}

testSimpleVersionQuery();
