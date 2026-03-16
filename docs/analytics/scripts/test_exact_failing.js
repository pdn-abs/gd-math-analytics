// Test the exact failing combination
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function testExactFailingQuery () {
    console.log('Testing exact failing query...');
    const client = new BetaAnalyticsDataClient();

    // This is the exact query that was failing
    const request = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-07-01', endDate: '2025-07-31' }],
        dimensions: [{ name: 'appVersion' }],
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
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            fieldName: 'appVersion',
                            stringFilter: {
                                value: 'v4.3.0',
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
        console.log('Testing exact failing combination...');
        const [response] = await client.runReport(request);

        console.log('✓ Exact query works!');
        if(response.rows && response.rows.length > 0) {
            const metrics = response.rows[0].metricValues;

            console.log(`Results: activeUsers=${ metrics[0].value }, avgSession=${ metrics[4].value }s, engagementRate=${ metrics[6].value }`);
        }
        else
            console.log('No data returned for this version/month combination');
    }
    catch (error) {
        console.log('✗ Exact query failed:', error.message);
    }
}

testExactFailingQuery();
