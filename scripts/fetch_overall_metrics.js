// Fetch overall app metrics without appVersion dimension
// Gives true user counts without double-counting users across versions
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');

async function fetchOverallMetrics () {
    console.log('Fetching overall app metrics (no version split)...');
    const client = new BetaAnalyticsDataClient();

    const analysisWindow = {
        start: '2025-10-20',
        end: '2026-03-11'
    };

    try {
        const [response] = await client.runReport({
            property: 'properties/441470574',
            dateRanges: [{ startDate: analysisWindow.start, endDate: analysisWindow.end }],
            dimensionFilter: {
                filter: {
                    fieldName: 'streamName',
                    stringFilter: { value: 'GD Math', matchType: 'EXACT' }
                }
            },
            metrics: [
                { name: 'activeUsers' },              // index 0
                { name: 'totalUsers' },               // index 1
                { name: 'sessions' },                 // index 2
                { name: 'averageSessionDuration' },   // index 3
                { name: 'userEngagementDuration' },   // index 4 (total, in seconds)
                { name: 'engagedSessions' },          // index 5
                { name: 'engagementRate' },           // index 6
                { name: 'newUsers' },                 // index 7
            ],
        });

        if (!response.rows || response.rows.length === 0) {
            console.log('No data returned.');
            return;
        }

        const m = response.rows[0].metricValues;

        const activeUsers             = parseInt(m[0].value);
        const totalUsers              = parseInt(m[1].value);
        const sessions                = parseInt(m[2].value);
        const avgSessionDurationSec   = parseFloat(m[3].value);
        const totalEngagementSec      = parseFloat(m[4].value);
        const engagedSessions         = parseInt(m[5].value);
        const engagementRate          = parseFloat(m[6].value);
        const newUsers                = parseInt(m[7].value);
        const returningUsers          = totalUsers - newUsers;

        // Fetch WAU/MAU in a separate query to avoid inflating user counts
        // (mixing active7DayUsers/active28DayUsers with totalUsers in the same query
        // causes GA4 to apply rolling window aggregation to all metrics, inflating counts)
        const [wauMauResponse] = await client.runReport({
            property: 'properties/441470574',
            dateRanges: [{ startDate: analysisWindow.start, endDate: analysisWindow.end }],
            dimensionFilter: { filter: { fieldName: 'streamName', stringFilter: { value: 'GD Math', matchType: 'EXACT' } } },
            metrics: [{ name: 'active7DayUsers' }, { name: 'active28DayUsers' }],
        });
        const wauRaw = wauMauResponse.rows?.[0]?.metricValues?.[0]?.value;
        const mauRaw = wauMauResponse.rows?.[0]?.metricValues?.[1]?.value;
        const wau = parseInt(wauRaw || '0');
        const mau = parseInt(mauRaw || '0');
        const wauMau = mau > 0 ? (wau / mau).toFixed(3) : '0.000';

        const sessionsPerActiveUser   = activeUsers > 0 ? (sessions / activeUsers).toFixed(2) : '0.00';
        const sessionsPerUser         = totalUsers  > 0 ? (sessions / totalUsers).toFixed(2)  : '0.00';

        const avgDurationPerActiveUser = activeUsers > 0 ? (totalEngagementSec / activeUsers).toFixed(2) : '0.00';
        const avgDurationPerUser       = totalUsers  > 0 ? (totalEngagementSec / totalUsers).toFixed(2)  : '0.00';

        const result = {
            'Period': `${analysisWindow.start} to ${analysisWindow.end}`,
            'Active Users': activeUsers,
            'Total Users': totalUsers,
            'New Users': newUsers,
            'Returning Users': returningUsers,
            'WAU': wau,
            'MAU': mau,
            'WAU/MAU': wauMau,
            'Sessions': sessions,
            'Engaged Sessions': engagedSessions,
            'Engagement Rate': `${engagementRate.toFixed(2)}%`,
            'Sessions per Active User': sessionsPerActiveUser,
            'Sessions per User': sessionsPerUser,
            'Avg Session Duration (s)': avgSessionDurationSec.toFixed(2),
            'Avg Session Duration per Active User (s)': avgDurationPerActiveUser,
            'Avg Session Duration per User (s)': avgDurationPerUser,
        };

        console.log('\n=== Overall App Metrics ===');
        Object.entries(result).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

        fs.writeFileSync('../data/overall_metrics.json', JSON.stringify(result, null, 2));
        console.log('\nSaved to data/overall_metrics.json');

    } catch (error) {
        console.error('Error fetching overall metrics:', error.message);
    }
}

fetchOverallMetrics();
