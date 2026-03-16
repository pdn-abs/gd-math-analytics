const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');

// Test version metrics fetch
async function testVersionMetrics () {
    console.log('Testing version metrics fetch...');
    const client = new BetaAnalyticsDataClient();

    const request = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-07-01', endDate: '2026-02-28' }],
        dimensions: [{ name: 'appVersion' }],
        metrics: [
            { name: 'activeUsers' },
            { name: 'averageSessionDuration' },
        ],
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

        console.log('Available app versions:', response.rows.map((row) => row.dimensionValues[0].value));
        console.log('Total rows:', response.rows.length);
    }
    catch (error) {
        console.error('Error:', error.message);
    }
}

testVersionMetrics();
