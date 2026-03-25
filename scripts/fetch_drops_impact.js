// Fetch drops impact analysis metrics without double-counting users
// Pre-drops: v4.3.0, v4.3.2, v4.3.7 (aggregated, no per-version split)
// Post-drops: v4.3.12, v4.3.15, v4.3.19 (aggregated, no per-version split)
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');

async function fetchDropsImpactMetrics () {
    console.log('Fetching drops impact metrics without double-counting...\n');
    const client = new BetaAnalyticsDataClient();

    const analysisWindow = {
        start: '2025-10-20',
        end: '2026-03-11'
    };

    const preDropsVersions = ['v4.3.0', 'v4.3.2', 'v4.3.7'];
    const postDropsVersions = ['v4.3.12', 'v4.3.15', 'v4.3.19'];

    const results = {
        analysisWindow,
        preDrops: null,
        postDrops: null,
        summary: {}
    };

    try {
        // Fetch pre-drops metrics (aggregated)
        console.log('Fetching pre-drops metrics (v4.3.0, v4.3.2, v4.3.7)...');
        results.preDrops = await fetchPeriodMetrics(client, analysisWindow, preDropsVersions, 'Pre-Drops');

        // Fetch post-drops metrics (aggregated)
        console.log('\nFetching post-drops metrics (v4.3.12, v4.3.15, v4.3.19)...');
        results.postDrops = await fetchPeriodMetrics(client, analysisWindow, postDropsVersions, 'Post-Drops');

        // Calculate summary metrics
        results.summary = calculateSummary(results.preDrops, results.postDrops);

        // Save to file
        const outputPath = `${__dirname}/../data/drops_impact_metrics.json`;
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
        console.log(`\n✓ Drops impact metrics saved to ${outputPath}`);

        // Display summary
        displaySummary(results.summary);

    } catch (error) {
        console.error('Error fetching drops impact metrics:', error);
        process.exitCode = 1;
    }
}

async function fetchPeriodMetrics (client, analysisWindow, versions, periodName) {
    try {
        // Build OR filter for versions
        const versionFilters = versions.map(v => ({
            filter: {
                fieldName: 'appVersion',
                stringFilter: { value: v, matchType: 'EXACT' }
            }
        }));

        const request = {
            property: 'properties/441470574',
            dateRanges: [{
                startDate: analysisWindow.start,
                endDate: analysisWindow.end
            }],
            dimensionFilter: {
                andGroup: {
                    expressions: [
                        {
                            filter: {
                                fieldName: 'streamName',
                                stringFilter: { value: 'GD Math', matchType: 'EXACT' }
                            }
                        },
                        {
                            orGroup: {
                                expressions: versionFilters
                            }
                        }
                    ]
                }
            },
            metrics: [
                { name: 'totalUsers' },               // index 0 - all users (unfiltered)
                { name: 'activeUsers' },              // index 1 - active users
                { name: 'sessions' },                 // index 2
                { name: 'engagedSessions' },          // index 3
                { name: 'engagementRate' },           // index 4
                { name: 'averageSessionDuration' },   // index 5 (in seconds)
                { name: 'userEngagementDuration' },   // index 6 (total, in seconds)
                { name: 'newUsers' },                 // index 7
            ]
        };

        const [response] = await client.runReport(request);

        if (!response.rows || response.rows.length === 0) {
            console.log(`  No data returned for ${periodName}.`);
            return null;
        }

        const m = response.rows[0].metricValues;

        const totalUsersUnfiltered = parseInt(m[0].value);  // All unique users
        const activeUsers = parseInt(m[1].value);           // Engaged users
        const sessions = parseInt(m[2].value);
        const engagedSessions = parseInt(m[3].value);
        const engagementRate = parseFloat(m[4].value) * 100; // Convert to percentage (0.76 -> 76.0)
        const avgSessionDurationSec = parseFloat(m[5].value);
        const totalEngagementSec = parseFloat(m[6].value);
        const newUsers = parseInt(m[7].value);

        // Convert session duration from seconds to minutes
        const avgSessionDurationMin = avgSessionDurationSec / 60;

        // Calculate derived metrics
        const sessionsPerActiveUser = sessions / totalUsersUnfiltered;
        const sessionsPerUser = sessions / activeUsers;
        const avgEngagementPerActiveUser = totalEngagementSec / totalUsersUnfiltered;

        const metrics = {
            activeUsers: totalUsersUnfiltered,        // Report unfiltered user count
            engagedUsers: activeUsers,                // Also store engaged count for reference
            totalUsers: totalUsersUnfiltered,
            sessions,
            engagedSessions,
            engagementRate,
            avgSessionDurationSec,
            avgSessionDurationMin,
            totalEngagementSec,
            newUsers,
            sessionsPerActiveUser,
            sessionsPerUser,
            avgEngagementPerActiveUser,
        };

        console.log(`  ✓ ${periodName} metrics fetched`);
        console.log(`    - Active Users: ${activeUsers}`);
        console.log(`    - Sessions: ${sessions}`);
        console.log(`    - Engaged Sessions: ${engagedSessions}`);
        console.log(`    - Avg Session Duration: ${avgSessionDurationMin.toFixed(2)} min`);

        return metrics;

    } catch (error) {
        console.error(`Error fetching ${periodName} metrics:`, error);
        throw error;
    }
}

function calculateSummary (preDrops, postDrops) {
    if (!preDrops || !postDrops) {
        return null;
    }

    const summary = {
        activeUsers: {
            preDrops: preDrops.activeUsers,
            postDrops: postDrops.activeUsers,
            change: postDrops.activeUsers - preDrops.activeUsers,
            percentChange: ((postDrops.activeUsers - preDrops.activeUsers) / preDrops.activeUsers * 100).toFixed(1)
        },
        sessions: {
            preDrops: preDrops.sessions,
            postDrops: postDrops.sessions,
            change: postDrops.sessions - preDrops.sessions,
            percentChange: ((postDrops.sessions - preDrops.sessions) / preDrops.sessions * 100).toFixed(1)
        },
        engagedSessions: {
            preDrops: preDrops.engagedSessions,
            postDrops: postDrops.engagedSessions,
            change: postDrops.engagedSessions - preDrops.engagedSessions,
            percentChange: ((postDrops.engagedSessions - preDrops.engagedSessions) / preDrops.engagedSessions * 100).toFixed(1)
        },
        engagementRate: {
            preDrops: preDrops.engagementRate.toFixed(2),
            postDrops: postDrops.engagementRate.toFixed(2),
            change: (postDrops.engagementRate - preDrops.engagementRate).toFixed(2),
            percentChange: ((postDrops.engagementRate - preDrops.engagementRate) / preDrops.engagementRate * 100).toFixed(1)
        },
        avgSessionDurationMin: {
            preDrops: preDrops.avgSessionDurationMin.toFixed(2),
            postDrops: postDrops.avgSessionDurationMin.toFixed(2),
            change: (postDrops.avgSessionDurationMin - preDrops.avgSessionDurationMin).toFixed(2),
            percentChange: ((postDrops.avgSessionDurationMin - preDrops.avgSessionDurationMin) / preDrops.avgSessionDurationMin * 100).toFixed(1)
        },
        sessionsPerActiveUser: {
            preDrops: preDrops.sessionsPerActiveUser.toFixed(2),
            postDrops: postDrops.sessionsPerActiveUser.toFixed(2),
            change: (postDrops.sessionsPerActiveUser - preDrops.sessionsPerActiveUser).toFixed(2),
            percentChange: ((postDrops.sessionsPerActiveUser - preDrops.sessionsPerActiveUser) / preDrops.sessionsPerActiveUser * 100).toFixed(1)
        }
    };

    return summary;
}

function displaySummary (summary) {
    console.log('\n' + '='.repeat(80));
    console.log('DROPS IMPACT SUMMARY');
    console.log('='.repeat(80));

    const formatMetric = (title, data) => {
        console.log(`\n${title}:`);
        console.log(`  Pre-Drops:   ${data.preDrops} ${title.includes('Rate') ? '%' : title.includes('Duration') ? 'min' : ''}`);
        console.log(`  Post-Drops:  ${data.postDrops} ${title.includes('Rate') ? '%' : title.includes('Duration') ? 'min' : ''}`);
        console.log(`  Change:      ${data.change} (${data.percentChange}%)`);
    };

    formatMetric('Active Users', summary.activeUsers);
    formatMetric('Sessions', summary.sessions);
    formatMetric('Engaged Sessions', summary.engagedSessions);
    formatMetric('Engagement Rate', summary.engagementRate);
    formatMetric('Avg Session Duration', summary.avgSessionDurationMin);
    formatMetric('Sessions Per Active User', summary.sessionsPerActiveUser);

    console.log('\n' + '='.repeat(80));
}

if (require.main === module) {
    fetchDropsImpactMetrics();
}

module.exports = fetchDropsImpactMetrics;
