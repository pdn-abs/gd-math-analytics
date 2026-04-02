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
        const outputPath = `${__dirname}/../../data/drops_impact_metrics.json`;
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

        const dimensionFilter = {
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
        };

        const dateRanges = [{ startDate: analysisWindow.start, endDate: analysisWindow.end }];
        const property = 'properties/441470574';

        // Request 1: core engagement metrics (max 10)
        const [response] = await client.runReport({
            property,
            dateRanges,
            dimensionFilter,
            metrics: [
                { name: 'totalUsers' },               // index 0 - all unique users
                { name: 'activeUsers' },              // index 1 - users with engaged sessions
                { name: 'sessions' },                 // index 2
                { name: 'engagedSessions' },          // index 3
                { name: 'engagementRate' },           // index 4 - engagedSessions / totalSessions
                { name: 'averageSessionDuration' },   // index 5 (in seconds)
                { name: 'userEngagementDuration' },   // index 6 (total, in seconds)
                { name: 'newUsers' },                 // index 7
            ]
        });

        // Request 2: stickiness metrics per day — adds 'date' dimension to get one row per day,
        // then we average the daily ratios to match the UI's time-averaged computation method.
        const [stickinessResponse] = await client.runReport({
            property,
            dateRanges,
            dimensionFilter,
            dimensions: [{ name: 'date' }],
            metrics: [
                { name: 'active1DayUsers' },
                { name: 'active7DayUsers' },
                { name: 'active28DayUsers' },
            ],
            orderBys: [{ dimension: { dimensionName: 'date' } }]
        });

        if (!response.rows || response.rows.length === 0) {
            console.log(`  No data returned for ${periodName}.`);
            return null;
        }

        const m = response.rows[0].metricValues;

        const totalUsers = parseInt(m[0].value);            // All unique users (any session)
        const activeUsers = parseInt(m[1].value);           // Users with engaged sessions
        const sessions = parseInt(m[2].value);
        const engagedSessions = parseInt(m[3].value);
        const engagementRate = parseFloat(m[4].value) * 100; // engagedSessions / totalSessions (%)
        const avgSessionDurationSec = parseFloat(m[5].value);
        const totalEngagementSec = parseFloat(m[6].value);
        const newUsers = parseInt(m[7].value);

        // Compute time-averaged DAU/WAU and WAU/MAU — matches UI exploration method.
        // For each day: compute ratio, then average across all days with non-zero denominators.
        let dauWauSum = 0, dauWauCount = 0;
        let wauMauSum = 0, wauMauCount = 0;
        for (const row of (stickinessResponse.rows ?? [])) {
            const s = row.metricValues;
            const d1 = parseInt(s[0].value);
            const d7 = parseInt(s[1].value);
            const d28 = parseInt(s[2].value);
            if (d7 > 0) { dauWauSum += d1 / d7; dauWauCount++; }
            if (d28 > 0) { wauMauSum += d7 / d28; wauMauCount++; }
        }
        const dauWau = dauWauCount > 0 ? dauWauSum / dauWauCount : 0;
        const wauMau = wauMauCount > 0 ? wauMauSum / wauMauCount : 0;

        // Convert session duration from seconds to minutes
        const avgSessionDurationMin = avgSessionDurationSec / 60;

        // Calculate derived metrics
        // DAU/WAU and WAU/MAU are now time-averaged daily ratios (matches UI exploration method)
        const sessionsPerActiveUser = sessions / activeUsers;
        const sessionsPerTotalUser = sessions / totalUsers;
        const avgEngagementPerActiveUser = totalEngagementSec / activeUsers;

        const metrics = {
            totalUsers,                               // All unique users (any session)
            activeUsers,                              // Users with engaged sessions (matches UI)
            sessions,
            engagedSessions,
            engagementRate,                           // engagedSessions / totalSessions (API definition)
            engagementRateByUser: engagedSessions / sessions * 100, // same; for reference
            avgSessionDurationSec,
            avgSessionDurationMin,
            totalEngagementSec,
            newUsers,
            returningUsers: totalUsers - newUsers,    // approximation (see csv-discrepancy-report.md)
            dauWau,
            wauMau,
            sessionsPerActiveUser,
            sessionsPerTotalUser,
            avgEngagementPerActiveUser,
        };

        console.log(`  ✓ ${periodName} metrics fetched`);
        console.log(`    - Total Users:        ${totalUsers}`);
        console.log(`    - Active Users:       ${activeUsers}`);
        console.log(`    - Sessions:           ${sessions}`);
        console.log(`    - Engaged Sessions:   ${engagedSessions}`);
        console.log(`    - Avg Session Duration: ${avgSessionDurationMin.toFixed(2)} min`);
        console.log(`    - DAU/WAU:            ${dauWau.toFixed(4)} (time-averaged)`);
        console.log(`    - WAU/MAU:            ${wauMau.toFixed(4)} (time-averaged)`);

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
        totalUsers: {
            preDrops: preDrops.totalUsers,
            postDrops: postDrops.totalUsers,
            change: postDrops.totalUsers - preDrops.totalUsers,
            percentChange: ((postDrops.totalUsers - preDrops.totalUsers) / preDrops.totalUsers * 100).toFixed(1)
        },
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
        },
        dauWau: {
            preDrops: preDrops.dauWau.toFixed(4),
            postDrops: postDrops.dauWau.toFixed(4),
            change: (postDrops.dauWau - preDrops.dauWau).toFixed(4),
            percentChange: ((postDrops.dauWau - preDrops.dauWau) / preDrops.dauWau * 100).toFixed(1)
        },
        wauMau: {
            preDrops: preDrops.wauMau.toFixed(4),
            postDrops: postDrops.wauMau.toFixed(4),
            change: (postDrops.wauMau - preDrops.wauMau).toFixed(4),
            percentChange: ((postDrops.wauMau - preDrops.wauMau) / preDrops.wauMau * 100).toFixed(1)
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

    formatMetric('Total Users (all sessions)', summary.totalUsers);
    formatMetric('Active Users (engaged sessions)', summary.activeUsers);
    formatMetric('Sessions', summary.sessions);
    formatMetric('Engaged Sessions', summary.engagedSessions);
    formatMetric('Engagement Rate', summary.engagementRate);
    formatMetric('Avg Session Duration', summary.avgSessionDurationMin);
    formatMetric('Sessions Per Active User', summary.sessionsPerActiveUser);
    formatMetric('DAU/WAU (time-averaged)', summary.dauWau);
    formatMetric('WAU/MAU (time-averaged)', summary.wauMau);

    console.log('\n' + '='.repeat(80));
}

if (require.main === module) {
    fetchDropsImpactMetrics();
}

module.exports = fetchDropsImpactMetrics;
