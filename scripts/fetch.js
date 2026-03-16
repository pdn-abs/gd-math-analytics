const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');
const path = require('path');

// Note: Make sure to run the credentials setup before running this script:
// source ../setup_credentials.sh

async function fetchGAData() {
    console.log('Starting GA data fetch...');
    const client = new BetaAnalyticsDataClient();
    const request = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-11-01', endDate: 'yesterday' }],
        dimensions: [
            { name: 'date' },
            { name: 'eventName' }
        ],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
            filter: {
                fieldName: 'streamName',
                stringFilter: {
                    value: 'GD MATH',
                    matchType: 'EXACT'
                }
            }
        }
    };
    try {
        const [response] = await client.runReport(request);
        const data = response.rows.map(row => ({
            date: row.dimensionValues[0].value,
            eventName: row.dimensionValues[1].value,
            eventCount: parseInt(row.metricValues[0].value),
        }));
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'ga_data.json'), JSON.stringify(data, null, 2));
        console.log('GA data fetched successfully.');
    } catch (error) {
        console.error('Error fetching GA data:', error);
    }
}

async function fetchLevelEngagement() {
    console.log('Fetching level engagement data...');
    const client = new BetaAnalyticsDataClient();
    const request = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-11-01', endDate: 'yesterday' }],
        dimensions: [
            { name: 'date' },
            { name: 'customEvent:type' }
        ],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            fieldName: 'eventName',
                            stringFilter: {
                                value: 'LevelData',
                                matchType: 'EXACT'
                            }
                        }
                    },
                    {
                        filter: {
                            fieldName: 'streamName',
                            stringFilter: {
                                value: 'GD MATH',
                                matchType: 'EXACT'
                            }
                        }
                    }
                ]
            }
        }
    };
    try {
        const [response] = await client.runReport(request);
        const data = response.rows.map(row => ({
            date: row.dimensionValues[0].value,
            levelType: row.dimensionValues[1].value,
            eventCount: parseInt(row.metricValues[0].value),
        }));
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'level_engagement.json'), JSON.stringify(data, null, 2));
        console.log('Level engagement data fetched successfully.');
    } catch (error) {
        console.error('Error fetching level engagement data:', error);
    }
}

async function fetchRetention() {
    console.log('Fetching retention data...');
    const client = new BetaAnalyticsDataClient();
    const request = {
        property: 'properties/441470574',
        cohortSpec: {
            cohorts: [{
                name: 'Post-Drops Users',
                dimension: 'firstSessionDate',
                dateRange: { startDate: '2025-11-01', endDate: '2026-03-08' }
            }],
            cohortsRange: {
                granularity: 'DAILY',
                startOffset: 0,
                endOffset: 30
            }
        },
        dimensions: [
            { name: 'cohort' },
            { name: 'cohortNthDay' }
        ],
        metrics: [
            { name: 'cohortActiveUsers' },
            { name: 'cohortTotalUsers' }
        ],
        dimensionFilter: {
            filter: {
                fieldName: 'streamName',
                stringFilter: {
                    value: 'GD MATH',
                    matchType: 'EXACT'
                }
            }
        }
    };
    try {
        const [response] = await client.runReport(request);
        const data = response.rows.map(row => ({
            cohort: row.dimensionValues[0].value,
            day: parseInt(row.dimensionValues[1].value),
            activeUsers: parseInt(row.metricValues[0].value),
            totalUsers: parseInt(row.metricValues[1].value),
            retentionRate: row.metricValues[1].value > 0 ? (row.metricValues[0].value / row.metricValues[1].value * 100).toFixed(2) : 0
        }));
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'retention.json'), JSON.stringify(data, null, 2));
        console.log('Retention data fetched successfully.');
    } catch (error) {
        console.error('Error fetching retention data:', error);
    }
}

async function fetchRetention() {
    console.log('Fetching retention data...');
    const client = new BetaAnalyticsDataClient();
    const request = {
        property: 'properties/441470574',
        cohortSpec: {
            cohorts: [{
                name: 'Post-Drops Users',
                dimension: 'firstSessionDate',
                dateRange: { startDate: '2025-11-01', endDate: '2026-03-08' }
            }],
            cohortsRange: {
                granularity: 'DAILY',
                startOffset: 0,
                endOffset: 30
            }
        },
        dimensions: [
            { name: 'cohort' },
            { name: 'cohortNthDay' }
        ],
        metrics: [
            { name: 'cohortActiveUsers' },
            { name: 'cohortTotalUsers' }
        ]
    };
    try {
        const [response] = await client.runReport(request);
        const data = response.rows.map(row => ({
            cohort: row.dimensionValues[0].value,
            day: parseInt(row.dimensionValues[1].value),
            activeUsers: parseInt(row.metricValues[0].value),
            totalUsers: parseInt(row.metricValues[1].value),
            retentionRate: row.metricValues[1].value > 0 ? (row.metricValues[0].value / row.metricValues[1].value * 100).toFixed(2) : 0
        }));
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'retention.json'), JSON.stringify(data, null, 2));
        console.log('Retention data fetched successfully.');
    } catch (error) {
        console.error('Error fetching retention data:', error);
    }
}

async function fetchPreDropsLevelEngagement() {
    console.log('Fetching pre-Drops level engagement data...');
    const client = new BetaAnalyticsDataClient();
    const request = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-06-01', endDate: '2025-10-31' }],
        dimensions: [
            { name: 'date' },
            { name: 'customEvent:type' }
        ],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            fieldName: 'eventName',
                            stringFilter: {
                                value: 'LevelData',
                                matchType: 'EXACT'
                            }
                        }
                    },
                    {
                        filter: {
                            fieldName: 'streamName',
                            stringFilter: {
                                value: 'GD MATH',
                                matchType: 'EXACT'
                            }
                        }
                    }
                ]
            }
        }
    };
    try {
        const [response] = await client.runReport(request);
        const data = response.rows.map(row => ({
            date: row.dimensionValues[0].value,
            levelType: row.dimensionValues[1].value,
            eventCount: parseInt(row.metricValues[0].value),
        }));
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'pre_drops_level_engagement.json'), JSON.stringify(data, null, 2));
        console.log('Pre-Drops level engagement data fetched successfully.');
    } catch (error) {
        console.error('Error fetching pre-Drops level engagement data:', error);
    }
}

async function fetchFullLevelEngagement() {
    console.log('Fetching full level engagement data (June 2025 - March 2026)...');
    const client = new BetaAnalyticsDataClient();
    const request = {
        property: 'properties/441470574',
        dateRanges: [{ startDate: '2025-06-01', endDate: '2026-03-09' }],
        dimensions: [
            { name: 'date' },
            { name: 'customEvent:type' }
        ],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            fieldName: 'eventName',
                            stringFilter: {
                                value: 'LevelData',
                                matchType: 'EXACT'
                            }
                        }
                    },
                    {
                        filter: {
                            fieldName: 'streamName',
                            stringFilter: {
                                value: 'GD MATH',
                                matchType: 'EXACT'
                            }
                        }
                    }
                ]
            }
        }
    };
    try {
        const [response] = await client.runReport(request);
        const data = response.rows.map(row => ({
            date: row.dimensionValues[0].value,
            levelType: row.dimensionValues[1].value,
            eventCount: parseInt(row.metricValues[0].value),
        }));
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'full_level_engagement_june_march.json'), JSON.stringify(data, null, 2));
        console.log('Full level engagement data (June 2025 - March 2026) fetched successfully.');
    } catch (error) {
        console.error('Error fetching full level engagement data:', error);
    }
}

async function fetchMonthlyRetention(startDate, endDate, name) {
    console.log(`Fetching monthly retention data for ${name}...`);
    const client = new BetaAnalyticsDataClient();
    const request = {
        property: 'properties/441470574',
        cohortSpec: {
            cohorts: [{
                name: name,
                dimension: 'firstSessionDate',
                dateRange: { startDate, endDate }
            }],
            cohortsRange: {
                granularity: 'DAILY',
                startOffset: 0,
                endOffset: 30
            }
        },
        dimensions: [
            { name: 'cohort' },
            { name: 'cohortNthDay' }
        ],
        metrics: [
            { name: 'cohortActiveUsers' },
            { name: 'cohortTotalUsers' }
        ],
        dimensionFilter: {
            filter: {
                fieldName: 'streamName',
                stringFilter: {
                    value: 'GD MATH',
                    matchType: 'EXACT'
                }
            }
        }
    };
    try {
        const [response] = await client.runReport(request);
        const data = response.rows.map(row => ({
            cohort: row.dimensionValues[0].value,
            day: parseInt(row.dimensionValues[1].value),
            activeUsers: parseInt(row.metricValues[0].value),
            totalUsers: parseInt(row.metricValues[1].value),
            retentionRate: row.metricValues[1].value > 0 ? (row.metricValues[0].value / row.metricValues[1].value * 100).toFixed(2) : 0
        }));
        // Append to ../data/monthly_daily_retention.json
        const monthlyPath = path.join(__dirname, '..', 'data', 'monthly_daily_retention.json');
        let existing = [];
        if (fs.existsSync(monthlyPath)) {
            existing = JSON.parse(fs.readFileSync(monthlyPath, 'utf8'));
        }
        existing.push({ name, data });
        fs.writeFileSync(monthlyPath, JSON.stringify(existing, null, 2));
        console.log(`Monthly retention data for ${name} fetched successfully.`);
    } catch (error) {
        console.error(`Error fetching monthly retention data for ${name}:`, error);
    }
}

// Fetch version-specific metrics for app versions V4.3.0 to V4.3.22
async function fetchVersionMetrics() {
    console.log('Fetching version-specific metrics...');
    const client = new BetaAnalyticsDataClient();

    // Attempt to retrieve metadata for available metrics to avoid INVALID_ARGUMENT
    let availableMetricNames = null;
    let availableDimensionNames = null;
    try {
        const [metadataResp] = await client.getMetadata({ name: 'properties/441470574/metadata' });
        const metricEntries = metadataResp.metrics || metadataResp.metricMetadata || metadataResp.metricsMetadata || metadataResp.metric || [];
        availableMetricNames = metricEntries.map(m => m.apiName || m.name || m.nameString || m.fieldName).filter(Boolean);

        // Also capture available dimensions
        const dimensionEntries = metadataResp.dimensions || metadataResp.dimensionMetadata || metadataResp.dimensionsMetadata || metadataResp.dimension || [];
        availableDimensionNames = dimensionEntries.map(d => d.apiName || d.name || d.nameString || d.fieldName).filter(Boolean);

        console.log(`Found ${availableMetricNames.length} available metrics and ${availableDimensionNames.length} available dimensions from property metadata.`);
        // attach to resp for use below
        metadataResp._availableMetricNames = availableMetricNames;
        metadataResp._availableDimensionNames = availableDimensionNames;
    } catch (metaErr) {
        console.warn('Could not fetch property metadata, proceeding without pre-filtering metrics:', metaErr.message || metaErr);
        availableMetricNames = null;
    }

    // App versions to analyze (based on available data, with 'v' prefix)
    const versions = [
        'v4.3.0', 'v4.3.1', 'v4.3.2', 'v4.3.3', 'v4.3.4', 'v4.3.5',
        'v4.3.6', 'v4.3.7', 'v4.3.8', 'v4.3.9', 'v4.3.10', 'v4.3.11',
        'v4.3.12', 'v4.3.13', 'v4.3.14', 'v4.3.15', 'v4.3.16', 'v4.3.17',
        'v4.3.18', 'v4.3.19', 'v4.3.20', 'v4.3.21', 'v4.3.22'
    ];

    const results = {};

    for (const version of versions) {
        console.log(`Fetching data for version ${version}...`);

        // ensure we use a valid dimension name for app version
        let appVersionDimension = 'appVersion';
        if (availableDimensionNames && availableDimensionNames.length > 0) {
            if (availableDimensionNames.includes('appVersion')) {
                appVersionDimension = 'appVersion';
            } else {
                // try to find a reasonable candidate containing 'version' or 'app'
                const candidate = availableDimensionNames.find(n => /version/i.test(n) || /app.*version/i.test(n) || /appVersion/i.test(n));
                if (candidate) {
                    appVersionDimension = candidate;
                    console.log(`Using dimension '${appVersionDimension}' for app version filtering.`);
                } else {
                    console.warn('No obvious app-version dimension found in metadata; using default "appVersion" which may cause INVALID_ARGUMENT.');
                }
            }
        }

        const request = {
            property: 'properties/441470574',
            dateRanges: [{ startDate: '2025-07-01', endDate: '2026-02-28' }],
            dimensions: [
                { name: appVersionDimension }
            ],
            metrics: [
                { name: 'activeUsers' },
                { name: 'active1DayUsers' },
                { name: 'active7DayUsers' },
                { name: 'active28DayUsers' },
                { name: 'averageSessionDuration' },
                { name: 'userEngagementDuration' },
                { name: 'returningUsers' },
                { name: 'engagedSessions' },
                { name: 'engagementRate' }
            ],
            dimensionFilter: {
                andGroup: {
                    expressions: [
                        {
                            filter: {
                                fieldName: appVersionDimension,
                                stringFilter: {
                                    value: version,
                                    matchType: 'EXACT'
                                }
                            }
                        },
                        {
                            filter: {
                                fieldName: 'streamName',
                                stringFilter: {
                                    value: 'GD MATH',
                                    matchType: 'EXACT'
                                }
                            }
                        }
                    ]
                }
            }
        };

        // Instead of attempting a combined multi-metric request (which can trigger INVALID_ARGUMENT
        // due to unsupported metric/dimension combinations), request each metric individually and compose results.
        const metricNames = [
            'activeUsers', 'active1DayUsers', 'active7DayUsers', 'active28DayUsers',
            'averageSessionDuration', 'userEngagementDuration', 'returningUsers', 'engagedSessions', 'engagementRate'
        ];

        const metricsToTry = availableMetricNames ? metricNames.filter(m => availableMetricNames.includes(m)) : metricNames;
        if (availableMetricNames) {
            const missing = metricNames.filter(m => !metricsToTry.includes(m));
            if (missing.length > 0) console.log(`Skipping unsupported metrics for ${version}: ${missing.join(', ')}`);
        }

        const singleMetricValues = {};
        for (const m of metricsToTry) {
            const singleRequest = Object.assign({}, request, { metrics: [{ name: m }] });
            try {
                const [singleResp] = await client.runReport(singleRequest);
                if (singleResp.rows && singleResp.rows.length > 0 && singleResp.rows[0].metricValues && singleResp.rows[0].metricValues[0]) {
                    singleMetricValues[m] = singleResp.rows[0].metricValues[0].value;
                } else {
                    singleMetricValues[m] = null;
                }
            } catch (e2) {
                singleMetricValues[m] = null;
            }

            // small delay
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Compose results using available single-metric values
        const parsed = name => {
            const v = singleMetricValues[name];
            return (v === null || v === undefined) ? 'N/A' : isNaN(Number(v)) ? v : Number(v);
        };

        const activeUsers = parsed('activeUsers');
        const dau = parsed('active1DayUsers');
        const wau = parsed('active7DayUsers');
        const mau = parsed('active28DayUsers');

        const wauMauRatio = (wau !== 'N/A' && mau !== 'N/A' && mau > 0) ? (wau / mau).toFixed(3) : 'N/A';
        const dauWauRatio = (dau !== 'N/A' && wau !== 'N/A' && wau > 0) ? (dau / wau).toFixed(3) : 'N/A';

        results[version] = {
            'WAU/MAU': wauMauRatio,
            'DAU/WAU': dauWauRatio,
            'Average Session Duration': parsed('averageSessionDuration') === 'N/A' ? 'N/A' : parsed('averageSessionDuration') + 's',
            'User Engagement': parsed('userEngagementDuration') === 'N/A' ? 'N/A' : parsed('userEngagementDuration') + 's',
            'Returning Users': parsed('returningUsers'),
            'Engaged Sessions': parsed('engagedSessions'),
            'Engagement Rate': parsed('engagementRate') === 'N/A' ? 'N/A' : (parseFloat(parsed('engagementRate')) * 100).toFixed(2) + '%',
            'Active Users': activeUsers
        };
    }

    fs.writeFileSync(path.join(__dirname, '..', 'data', 'version_metrics.json'), JSON.stringify(results, null, 2));
    console.log('Version metrics data fetched successfully.');
}

module.exports = {
    fetchGAData,
    fetchLevelEngagement,
    fetchRetention,
    fetchPreDropsLevelEngagement,
    fetchFullLevelEngagement,
    fetchMonthlyRetention,
    fetchVersionMetrics
};

// If run directly, execute the full fetch sequence
if (require.main === module) {
    (async () => {
        await fetchGAData();
        await fetchLevelEngagement();
        await fetchRetention();
        await fetchPreDropsLevelEngagement();
        await fetchFullLevelEngagement();
        await fetchMonthlyRetention('2025-06-01', '2025-06-30', 'June 2025');
        await fetchMonthlyRetention('2025-07-01', '2025-07-31', 'July 2025');
        await fetchMonthlyRetention('2025-08-01', '2025-08-31', 'August 2025');
        await fetchMonthlyRetention('2025-09-01', '2025-09-30', 'September 2025');
        await fetchMonthlyRetention('2025-10-01', '2025-10-31', 'October 2025');
        await fetchVersionMetrics();
    })();
}
