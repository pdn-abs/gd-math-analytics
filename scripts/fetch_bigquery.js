// Fetch GA4 session metrics directly from BigQuery export
// GA4 exports raw event-level data to BigQuery, enabling more granular queries
// than the GA4 Reporting API (e.g. exact session counts, per-user breakdowns)
//
// Prerequisites:
//   1. GA4 → BigQuery linking must be enabled in GA4 Admin
//   2. Service account must have roles/bigquery.dataViewer + roles/bigquery.jobUser
//
// Dataset: analytics_441470574  (GA4 property ID: 441470574)
// Tables:  events_YYYYMMDD      (one table per day, or events_* wildcard)

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const KEY_FILE = path.resolve(__dirname, '../keys/gd-math-71c48-7553a3a1322b.json');
const PROJECT_ID = 'gd-math-71c48';
const DATASET = 'analytics_441470574';
const LOCATION = 'asia-south1';

// Available BigQuery tables: events_20260125 → events_20260325
// (GA4 BigQuery export only retains ~60 days of daily tables by default)
const START_DATE = '20260125'; // YYYYMMDD format for BigQuery table suffix
const END_DATE = '20260325';

const client = new BigQuery({
    projectId: PROJECT_ID,
    keyFilename: KEY_FILE,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration (seconds) {
    const s = Math.round(seconds);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
}

// ─── Step 1: Verify dataset and list available date range ────────────────────

async function checkDatasetAccess () {
    console.log('\n[1/4] Checking BigQuery dataset access...');
    try {
        const [tables] = await client.dataset(DATASET).getTables();
        const eventTables = tables
            .map(t => t.id)
            .filter(id => id.startsWith('events_') && !id.includes('intraday'))
            .sort();

        if (eventTables.length === 0) {
            console.error('  ✗ No events_YYYYMMDD tables found in dataset:', DATASET);
            console.error('    → Ensure GA4 → BigQuery linking is enabled in GA4 Admin.');
            return false;
        }

        console.log(`  ✓ Found ${eventTables.length} daily event tables`);
        console.log(`    Earliest: ${eventTables[0]}`);
        console.log(`    Latest:   ${eventTables[eventTables.length - 1]}`);
        return true;
    } catch (err) {
        if (err.code === 404) {
            console.error(`  ✗ Dataset "${DATASET}" not found in project "${PROJECT_ID}".`);
            console.error('    → Verify GA4 BigQuery export is enabled and the dataset exists.');
        } else if (err.code === 403) {
            console.error('  ✗ Permission denied.');
            console.error(`    → Grant the service account (${KEY_FILE}) the following roles:`);
            console.error('      - roles/bigquery.dataViewer');
            console.error('      - roles/bigquery.jobUser');
        } else {
            console.error('  ✗ Unexpected error:', err.message);
        }
        return false;
    }
}

// ─── Step 2: Sessions per user ───────────────────────────────────────────────

async function fetchSessionsPerUser () {
    console.log('\n[2/4] Fetching sessions per user...');

    // Sessions are identified by (user_pseudo_id, ga_session_id) across all events.
    // No session_start event exists — ga_session_id is embedded in every event's params.
    const query = `
        WITH session_events AS (
            SELECT
                user_pseudo_id,
                app_info.version AS app_version,
                (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id
            FROM
                \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE
                _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
                AND STARTS_WITH(app_info.version, 'v4.3.')
        ),
        user_sessions AS (
            SELECT
                user_pseudo_id,
                app_version,
                COUNT(DISTINCT session_id) AS session_count
            FROM session_events
            WHERE session_id IS NOT NULL
            GROUP BY user_pseudo_id, app_version
        )
        SELECT
            app_version,
            COUNT(DISTINCT user_pseudo_id)                                   AS active_users,
            SUM(session_count)                                               AS total_sessions,
            ROUND(AVG(session_count), 2)                                     AS avg_sessions_per_active_user,
            ROUND(SUM(session_count) / COUNT(DISTINCT user_pseudo_id), 2)    AS sessions_per_user
        FROM user_sessions
        GROUP BY app_version
        ORDER BY app_version
    `;

    const [rows] = await client.query({ query, location: LOCATION });
    return rows;
}

// ─── Step 3: Session duration per user ──────────────────────────────────────

async function fetchSessionDurationPerUser () {
    console.log('\n[3/4] Fetching session duration per user...');

    // Duration per session = MAX(event_timestamp) - MIN(event_timestamp) in microseconds.
    // engagement_time_msec is not available in this dataset.
    // all_users includes every user in the period (for the "per total user" denominator).
    const query = `
        WITH session_events AS (
            SELECT
                user_pseudo_id,
                app_info.version AS app_version,
                (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
                event_timestamp
            FROM
                \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE
                _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
                AND STARTS_WITH(app_info.version, 'v4.3.')
        ),
        session_durations AS (
            SELECT
                user_pseudo_id,
                app_version,
                session_id,
                (MAX(event_timestamp) - MIN(event_timestamp)) / 1e6 AS session_duration_sec
            FROM session_events
            WHERE session_id IS NOT NULL
            GROUP BY user_pseudo_id, app_version, session_id
        ),
        user_totals AS (
            SELECT
                user_pseudo_id,
                app_version,
                COUNT(DISTINCT session_id)    AS session_count,
                SUM(session_duration_sec)     AS total_engagement_sec,
                AVG(session_duration_sec)     AS avg_session_duration_sec
            FROM session_durations
            GROUP BY user_pseudo_id, app_version
        ),
        all_users AS (
            SELECT DISTINCT user_pseudo_id, app_info.version AS app_version
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE
                _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
                AND STARTS_WITH(app_info.version, 'v4.3.')
        )
        SELECT
            u.app_version,
            COUNT(DISTINCT u.user_pseudo_id)                                                    AS total_users,
            COUNT(DISTINCT t.user_pseudo_id)                                                    AS active_users,
            ROUND(AVG(t.avg_session_duration_sec), 2)                                           AS avg_session_duration_sec,
            ROUND(SUM(t.total_engagement_sec) / NULLIF(COUNT(DISTINCT t.user_pseudo_id), 0), 2) AS avg_total_duration_per_active_user_sec,
            ROUND(SUM(t.total_engagement_sec) / NULLIF(COUNT(DISTINCT u.user_pseudo_id), 0), 2) AS avg_total_duration_per_user_sec
        FROM all_users u
        LEFT JOIN user_totals t
            ON u.user_pseudo_id = t.user_pseudo_id AND u.app_version = t.app_version
        GROUP BY u.app_version
        ORDER BY u.app_version
    `;

    const [rows] = await client.query({ query, location: LOCATION });
    return rows;
}

// ─── Step 4: Combined summary ────────────────────────────────────────────────

async function buildSummary (sessionRows, durationRows) {
    console.log('\n[4/4] Building summary...');

    const durationMap = {};
    durationRows.forEach(r => { durationMap[r.app_version] = r; });

    const summary = {};
    sessionRows.forEach(s => {
        const d = durationMap[s.app_version] || {};
        const avgDurSec = parseFloat(d.avg_session_duration_sec) || 0;
        const durPerActive = parseFloat(d.avg_total_duration_per_active_user_sec) || 0;
        const durPerUser = parseFloat(d.avg_total_duration_per_user_sec) || 0;

        summary[s.app_version] = {
            'Active Users': parseInt(s.active_users),
            'Total Users': parseInt(d.total_users) || parseInt(s.active_users),
            'Total Sessions': parseInt(s.total_sessions),
            'Sessions per Active User': parseFloat(s.avg_sessions_per_active_user),
            'Sessions per User': parseFloat(s.sessions_per_user),
            'Avg Session Duration': formatDuration(avgDurSec),
            'Avg Session Duration per Active User': formatDuration(durPerActive),
            'Avg Session Duration per User': formatDuration(durPerUser),
            // Raw seconds for programmatic use
            'Avg Session Duration (s)': avgDurSec.toFixed(2),
            'Avg Session Duration per Active User (s)': durPerActive.toFixed(2),
            'Avg Session Duration per User (s)': durPerUser.toFixed(2),
        };
    });

    return summary;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
    console.log('=== BigQuery GA4 Session Metrics ===');
    console.log(`Project : ${PROJECT_ID}`);
    console.log(`Dataset : ${DATASET}`);
    console.log(`Window  : ${START_DATE} → ${END_DATE}`);

    const accessible = await checkDatasetAccess();
    if (!accessible) {
        console.log('\n⚠  Cannot proceed. Fix access issues above and re-run.');
        process.exit(1);
    }

    const [sessionRows, durationRows] = await Promise.all([
        fetchSessionsPerUser(),
        fetchSessionDurationPerUser(),
    ]);

    const summary = await buildSummary(sessionRows, durationRows);

    // ── Print table ──────────────────────────────────────────────────────────
    console.log('\n─────────────────────────────────────────────────────────────────────');
    console.log('Version          | Active | Total | Sess/Active | Sess/User | Avg Dur | Dur/Active | Dur/User');
    console.log('─────────────────────────────────────────────────────────────────────');
    Object.entries(summary).forEach(([version, m]) => {
        console.log(
            `${version.padEnd(16)} | ${String(m['Active Users']).padStart(6)} | ${String(m['Total Users']).padStart(5)} | ${String(m['Sessions per Active User']).padStart(11)} | ${String(m['Sessions per User']).padStart(9)} | ${m['Avg Session Duration'].padStart(7)} | ${m['Avg Session Duration per Active User'].padStart(10)} | ${m['Avg Session Duration per User']}`
        );
    });
    console.log('─────────────────────────────────────────────────────────────────────');

    // ── Save output ──────────────────────────────────────────────────────────
    const outPath = path.resolve(__dirname, '../data/bigquery_session_metrics.json');
    fs.writeFileSync(outPath, JSON.stringify({ analysisWindow: summary }, null, 2));
    console.log(`\n✓ Saved to data/bigquery_session_metrics.json`);
}

main().catch(err => {
    console.error('\nFatal error:', err.message);
    process.exit(1);
});
