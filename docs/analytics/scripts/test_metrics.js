// Test adding metrics one by one
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function testMetricsStepByStep () {
    console.log('Testing metrics step by step...');
    const client = new BetaAnalyticsDataClient();

    // Test 1: Just activeUsers (this worked)
    const request1 = {
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
        limit: 5,
    };

    try {
        console.log('Test 1: activeUsers only...');
        const [response1] = await client.runReport(request1);

        console.log('✓ activeUsers works');
    }
    catch (error) {
        console.log('✗ activeUsers failed:', error.message);
    }

    // Test 2: Add averageSessionDuration
    const request2 = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-07-01', endDate: '2025-07-31' }],
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
        limit: 5,
    };

    try {
        console.log('Test 2: + averageSessionDuration...');
        const [response2] = await client.runReport(request2);

        console.log('✓ averageSessionDuration works');
    }
    catch (error) {
        console.log('✗ averageSessionDuration failed:', error.message);
    }

    // Test 4: Add active user metrics
    const request4 = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-07-01', endDate: '2025-07-31' }],
        dimensions: [{ name: 'appVersion' }],
        metrics: [
            { name: 'activeUsers' },
            { name: 'averageSessionDuration' },
            { name: 'engagementRate' },
            { name: 'active1DayUsers' },
            { name: 'active7DayUsers' },
            { name: 'active28DayUsers' },
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
        limit: 5,
    };

    try {
        console.log('Test 4: + active user metrics...');
        const [response4] = await client.runReport(request4);

        console.log('✓ active user metrics work');
    }
    catch (error) {
        console.log('✗ active user metrics failed:', error.message);
    }

    // Test 5: Add session metrics
    const request5 = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-07-01', endDate: '2025-07-31' }],
        dimensions: [{ name: 'appVersion' }],
        metrics: [
            { name: 'activeUsers' },
            { name: 'averageSessionDuration' },
            { name: 'engagementRate' },
            { name: 'active1DayUsers' },
            { name: 'active7DayUsers' },
            { name: 'active28DayUsers' },
            { name: 'engagedSessions' },
            { name: 'sessions' },
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
        limit: 5,
    };

    try {
        console.log('Test 5: + session metrics...');
        const [response5] = await client.runReport(request5);

        console.log('✓ session metrics work');
    }
    catch (error) {
        console.log('✗ session metrics failed:', error.message);
    }
}

testMetricsStepByStep();
