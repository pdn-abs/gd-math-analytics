// Test basic monthly query
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function testBasicMonthlyQuery () {
    console.log('Testing basic monthly query...');
    const client = new BetaAnalyticsDataClient();

    const request = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-07-01', endDate: '2025-07-31' }],
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
        limit: 10,
    };

    try {
        const [response] = await client.runReport(request);

        console.log('Success! Found versions:');
        response.rows.forEach((row) => {
            console.log(`${ row.dimensionValues[0].value }: ${ row.metricValues[0].value } users`);
        });
    }
    catch (error) {
        console.error('Error:', error.message);
    }
}

testBasicMonthlyQuery();
