// Quick test of the sessionEngaged filter
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function testEngagedFilter() {
    console.log('Testing sessionEngaged filter...');
    const client = new BetaAnalyticsDataClient();

    const request = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-11-01', endDate: '2025-11-07' }], // Just one week
        dimensions: [{ name: 'appVersion' }],
        metrics: [{ name: 'activeUsers' }],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            fieldName: 'streamName',
                            stringFilter: {
                                value: 'GD Math',
                                matchType: 'EXACT',
                            },
                        },
                    },
                    {
                        filter: {
                            fieldName: 'sessionEngaged',
                            stringFilter: {
                                value: '1',
                                matchType: 'EXACT',
                            },
                        },
                    },
                ],
            },
        },
        limit: 5,
    };

    try {
        const [response] = await client.runReport(request);
        console.log('✅ Filter works! Found', response.rows?.length || 0, 'rows');
        if (response.rows && response.rows.length > 0) {
            console.log('Sample result:', response.rows[0].dimensionValues[0].value, '=', response.rows[0].metricValues[0].value, 'active users');
        }
    } catch (error) {
        console.error('❌ Filter failed:', error.message);
    }
}

testEngagedFilter();
