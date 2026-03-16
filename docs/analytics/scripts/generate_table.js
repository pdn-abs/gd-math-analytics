// Generate version metrics table with highlighted min/max values
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('../data/version_metrics.json', 'utf8'));

// Filter for v4.3.x versions only
const v43Versions = Object.keys(data)
    .filter((key) => key.startsWith('v4.3.'))
    .sort((a, b) => {
        const aNum = parseInt(a.replace('v4.3.', ''));
        const bNum = parseInt(b.replace('v4.3.', ''));

        return aNum - bNum;
    });

// Calculate min/max for each numeric column
const columns = ['WAU/MAU', 'DAU/WAU', 'Average Session Duration', 'Engaged Sessions', 'Engagement Rate', 'Active Users'];

const stats = {};

columns.forEach((col) => {
    const values = v43Versions.map((version) => {
        const val = data[version][col];

        if(col === 'Average Session Duration')
            return parseFloat(val.replace('s', ''));
        else if(col === 'Engagement Rate')
            return parseFloat(val.replace('%', ''));
        else if(col === 'Engaged Sessions' || col === 'Active Users')
            return parseInt(val);
        else
            return parseFloat(val);
    });

    stats[col] = {
        min: Math.min(...values),
        max: Math.max(...values),
    };
});

// Function to format value with highlighting
function formatValue (
    value, column, stats
) {
    let numericValue;

    if(column === 'Average Session Duration')
        numericValue = parseFloat(value.replace('s', ''));
    else if(column === 'Engagement Rate')
        numericValue = parseFloat(value.replace('%', ''));
    else if(column === 'Engaged Sessions' || column === 'Active Users')
        numericValue = parseInt(value);
    else
        numericValue = parseFloat(value);

    if(numericValue === stats[column].max)
        return `**${ value }**`;
    else if(numericValue === stats[column].min)
        return `*${ value }*`;

    return value;
}

console.log('# GD Math App Version Metrics (July 2025 - February 2026)');
console.log('');
console.log('| Version | WAU/MAU | DAU/WAU | Avg Session Duration | Engaged Sessions | Engagement Rate | Active Users |');
console.log('|---------|---------|---------|---------------------|------------------|----------------|--------------|');

v43Versions.forEach((version) => {
    const metrics = data[version];
    const wauMau = formatValue(
        metrics['WAU/MAU'], 'WAU/MAU', stats
    );
    const dauWau = formatValue(
        metrics['DAU/WAU'], 'DAU/WAU', stats
    );
    const avgDuration = formatValue(
        metrics['Average Session Duration'], 'Average Session Duration', stats
    );
    const engagedSessions = formatValue(
        metrics['Engaged Sessions'], 'Engaged Sessions', stats
    );
    const engagementRate = formatValue(
        metrics['Engagement Rate'], 'Engagement Rate', stats
    );
    const activeUsers = formatValue(
        metrics['Active Users'], 'Active Users', stats
    );

    console.log(`| ${ version } | ${ wauMau } | ${ dauWau } | ${ avgDuration } | ${ engagedSessions } | ${ engagementRate } | ${ activeUsers } |`);
});

console.log('');
console.log('**Legend:** **Highest values** are in *bold*, *lowest values* are in *italics*.');
console.log('');
console.log('**Note:** Session duration and engagement rate metrics may be inflated due to the 8-month aggregation period. These metrics are more reliable when analyzed over shorter time periods.');
