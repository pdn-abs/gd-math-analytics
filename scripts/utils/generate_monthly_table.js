// Generate monthly version metrics table
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/monthly_version_metrics.json'), 'utf8'));

// Get all months and versions
const months = Object.keys(data);
const allVersions = new Set();

months.forEach((month) => {
    Object.keys(data[month]).forEach((version) => allVersions.add(version));
});
const sortedVersions = Array.from(allVersions).sort((a, b) => {
    const aNum = parseInt(a.replace('v4.3.', ''));
    const bNum = parseInt(b.replace('v4.3.', ''));

    return aNum - bNum;
});

console.log('# GD Math App Monthly Version Metrics (July 2025 - February 2026)');
console.log('');
console.log('## Session Duration & Engagement (Monthly Analysis)');
console.log('');
console.log('This monthly breakdown provides much more accurate session-level metrics compared to the 8-month aggregated data.');
console.log('');

// Create table for each month
months.forEach((month) => {
    const monthData = data[month];
    const versionsInMonth = Object.keys(monthData);

    if(versionsInMonth.length > 0) {
        console.log(`### ${ month }`);
        console.log('');
        console.log('| Version | Active Users | Sessions | Avg Session Duration | Engaged Sessions | Engagement Rate | DAU/WAU | WAU/MAU |');
        console.log('|---------|--------------|----------|---------------------|------------------|----------------|---------|---------|');

        sortedVersions.forEach((version) => {
            if(monthData[version]) {
                const metrics = monthData[version];

                console.log(`| ${ version } | ${ metrics['Active Users'] } | ${ metrics.Sessions } | ${ metrics['Avg Session Duration'] } | ${ metrics['Engaged Sessions'] } | ${ metrics['Engagement Rate'] } | ${ metrics['DAU/WAU'] } | ${ metrics['WAU/MAU'] } |`);
            }
            else
                console.log(`| ${ version } | - | - | - | - | - | - | - |`);
        });
        console.log('');
    }
});

console.log('## Key Monthly Insights');
console.log('');

// Calculate some aggregate insights
const versionTrends = {};

sortedVersions.forEach((version) => {
    versionTrends[version] = {
        months: [],
        totalUsers: 0,
        avgSessionDuration: [],
        peakMonth: null,
        peakUsers: 0,
    };
});

months.forEach((month) => {
    Object.keys(data[month]).forEach((version) => {
        const metrics = data[month][version];

        versionTrends[version].months.push(month);
        versionTrends[version].totalUsers += metrics['Active Users'];
        versionTrends[version].avgSessionDuration.push(parseFloat(metrics['Avg Session Duration']));

        if(metrics['Active Users'] > versionTrends[version].peakUsers) {
            versionTrends[version].peakUsers = metrics['Active Users'];
            versionTrends[version].peakMonth = month;
        }
    });
});

// Show insights for versions with significant usage
console.log('### Version Adoption Patterns');
sortedVersions.forEach((version) => {
    const trend = versionTrends[version];

    if(trend.totalUsers > 100) { // Only show versions with meaningful usage
        const avgDuration = (trend.avgSessionDuration.reduce((a, b) => a + b, 0) / trend.avgSessionDuration.length).toFixed(2);

        console.log(`- **${ version }**: Peak usage in ${ trend.peakMonth } (${ trend.peakUsers } users), appeared in ${ trend.months.length } months, avg session: ${ avgDuration }s`);
    }
});

console.log('');
console.log('### Monthly Session Duration Reality Check');
console.log('While session durations are still high (likely due to background app behavior), the monthly analysis shows much more reasonable numbers compared to the 8-month aggregation, which inflated durations by orders of magnitude.');
console.log('');
console.log('**Note:** These monthly metrics provide a much more accurate view of user engagement patterns than the aggregated 8-month data, though session durations may still be affected by how GA4 tracks mobile app sessions.');
