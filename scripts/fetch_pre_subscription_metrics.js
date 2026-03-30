// Pre-subscription phase metrics for GD-Math
// Covers: DAU/MAU, D1/D7/D30 retention, paywall funnel,
//         top screens, assessment completion, crash rate
//
// Prerequisites:
//   - GA4 → BigQuery linking enabled
//   - Service account: roles/bigquery.dataViewer + roles/bigquery.jobUser
//
// Dataset: analytics_441470574  (GA4 property: 441470574)
// Key custom events:
//   SubscriptionOpened       → user reached paywall screen
//   GameSubscription         → type = "Created" means purchase completed
//   first_open               → Firebase standard: first install/open
//   screen_view              → firebase_screen param = screen name
//   assessmentCompleted      → user finished onboarding assessment
//   app_exception            → Firebase standard: crash/error

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const KEY_FILE = path.resolve(__dirname, '../keys/gd-math-71c48-7553a3a1322b.json');
const PROJECT_ID = 'gd-math-71c48';
const DATASET = 'analytics_441470574';
const LOCATION = 'asia-south1';

// Available BigQuery tables: events_20260125 → events_20260325
const START_DATE = '20260125';
const END_DATE   = '20260325';

const client = new BigQuery({ projectId: PROJECT_ID, keyFilename: KEY_FILE });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct (num, den) {
    if (!den || den === 0) return '0.00%';
    return (100 * num / den).toFixed(2) + '%';
}

function bar (rate, max = 100, width = 20) {
    const filled = Math.round((rate / max) * width);
    return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// ─── 1. DAU by day + MAU for the window ───────────────────────────────────────

async function fetchDAU () {
    console.log('\n[1/6] Fetching DAU by day...');
    const query = `
        SELECT
            event_date,
            COUNT(DISTINCT user_pseudo_id) AS dau
        FROM \`${PROJECT_ID}.${DATASET}.events_*\`
        WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
        GROUP BY event_date
        ORDER BY event_date
    `;
    const [rows] = await client.query({ query, location: LOCATION });
    return rows;
}

async function fetchMAU () {
    console.log('    Fetching MAU (distinct users in full window)...');
    const query = `
        SELECT COUNT(DISTINCT user_pseudo_id) AS mau
        FROM \`${PROJECT_ID}.${DATASET}.events_*\`
        WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
    `;
    const [rows] = await client.query({ query, location: LOCATION });
    return rows[0].mau;
}

// ─── 1b. Extended user activity: new users, active users, avg engagement, engaged sessions ───────

async function fetchUserActivityExtended () {
    console.log('\n[1b/6] Fetching extended user activity (new users, avg engagement, engaged sessions)...');

    const [newUsersRows] = await client.query({
        query: `
            SELECT COUNT(DISTINCT user_pseudo_id) AS new_users
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'first_open'
        `,
        location: LOCATION,
    });

    const [activeUsersRows] = await client.query({
        query: `
            SELECT COUNT(DISTINCT user_pseudo_id) AS active_users
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'session_start'
        `,
        location: LOCATION,
    });

    const [engagementRows] = await client.query({
        query: `
            SELECT
                SUM((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'engagement_time_msec')) AS total_engagement_ms,
                COUNT(DISTINCT user_pseudo_id) AS engaged_users
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'user_engagement'
        `,
        location: LOCATION,
    });

    const [engagedSessionsRows] = await client.query({
        query: `
            WITH session_engagement AS (
                SELECT
                    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
                    SUM((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'engagement_time_msec')) AS session_engagement_ms
                FROM \`${PROJECT_ID}.${DATASET}.events_*\`
                WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
                  AND event_name = 'user_engagement'
                GROUP BY session_id
            )
            SELECT COUNT(*) AS engaged_sessions
            FROM session_engagement
            WHERE session_engagement_ms > 10000
        `,
        location: LOCATION,
    });

    return {
        newUsers: parseInt(newUsersRows[0].new_users),
        activeUsers: parseInt(activeUsersRows[0].active_users),
        totalEngagementMs: parseInt(engagementRows[0].total_engagement_ms || 0),
        engagedUsers: parseInt(engagementRows[0].engaged_users || 0),
        engagedSessions: parseInt(engagedSessionsRows[0].engaged_sessions),
    };
}

// ─── 2. Retention cohorts: D1, D7, D30 ───────────────────────────────────────
// Cohort = first day a user was seen (proxy for first_open, since Firebase's
// first_open event may not appear in BigQuery if the export started after install).

async function fetchRetention () {
    console.log('\n[2/6] Fetching D1/D7/D30 retention cohorts (using earliest event as first-seen proxy)...');
    const query = `
        WITH first_opens AS (
            -- One row per user: earliest event date seen (proxy for first_open)
            SELECT
                user_pseudo_id,
                MIN(event_date) AS cohort_date
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
            GROUP BY user_pseudo_id
        ),
        user_days AS (
            -- All distinct (user, date) activity pairs
            SELECT DISTINCT user_pseudo_id, event_date AS activity_date
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
        ),
        cohort_sizes AS (
            SELECT cohort_date, COUNT(DISTINCT user_pseudo_id) AS cohort_size
            FROM first_opens
            GROUP BY cohort_date
        ),
        day_offsets AS (
            -- For each user × activity day, compute how many days since first_open
            SELECT
                fo.cohort_date,
                fo.user_pseudo_id,
                DATE_DIFF(
                    PARSE_DATE('%Y%m%d', ud.activity_date),
                    PARSE_DATE('%Y%m%d', fo.cohort_date),
                    DAY
                ) AS day_offset
            FROM first_opens fo
            JOIN user_days ud USING (user_pseudo_id)
        ),
        filtered AS (
            SELECT cohort_date, user_pseudo_id, day_offset
            FROM day_offsets
            WHERE day_offset IN (1, 7, 30)
        ),
        retained AS (
            SELECT cohort_date, day_offset, COUNT(DISTINCT user_pseudo_id) AS retained_users
            FROM filtered
            GROUP BY cohort_date, day_offset
        )
        SELECT
            r.day_offset,
            SUM(r.retained_users)                                               AS retained_users,
            SUM(cs.cohort_size)                                                 AS eligible_cohort_size,
            ROUND(100.0 * SUM(r.retained_users) / NULLIF(SUM(cs.cohort_size), 0), 2) AS retention_rate_pct
        FROM retained r
        JOIN cohort_sizes cs ON r.cohort_date = cs.cohort_date
        -- Only include cohorts old enough to have reached day_offset
        WHERE DATE_ADD(PARSE_DATE('%Y%m%d', r.cohort_date), INTERVAL r.day_offset DAY)
                <= PARSE_DATE('%Y%m%d', '${END_DATE}')
        GROUP BY r.day_offset
        ORDER BY r.day_offset
    `;
    const [rows] = await client.query({ query, location: LOCATION });
    return rows;
}

// ─── 2b. Retention by skill age ───────────────────────────────────────────────
// Skill age = currentSkillAge from a user's first segmentStarted event.
// Users who never fired segmentStarted are grouped as "(no skillage)".

async function fetchRetentionBySkillAge () {
    console.log('\n[2b/6] Fetching D1/D7/D30 retention by skill age...');
    const query = `
        WITH user_skillage AS (
            -- Each user's skill age = currentSkillAge on their earliest segmentStarted
            SELECT
                user_pseudo_id,
                ARRAY_AGG(
                    (SELECT ep.value.string_value FROM UNNEST(event_params) ep WHERE ep.key = 'currentSkillAge')
                    ORDER BY event_timestamp LIMIT 1
                )[OFFSET(0)] AS skill_age
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'segmentStarted'
            GROUP BY user_pseudo_id
        ),
        first_opens AS (
            SELECT user_pseudo_id, MIN(event_date) AS cohort_date
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
            GROUP BY user_pseudo_id
        ),
        user_days AS (
            SELECT DISTINCT user_pseudo_id, event_date AS activity_date
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
        ),
        cohort_sizes AS (
            SELECT
                fo.cohort_date,
                COALESCE(us.skill_age, '(no skillage)') AS skill_age,
                COUNT(DISTINCT fo.user_pseudo_id) AS cohort_size
            FROM first_opens fo
            LEFT JOIN user_skillage us USING (user_pseudo_id)
            GROUP BY fo.cohort_date, skill_age
        ),
        day_offsets AS (
            SELECT
                fo.cohort_date,
                fo.user_pseudo_id,
                COALESCE(us.skill_age, '(no skillage)') AS skill_age,
                DATE_DIFF(
                    PARSE_DATE('%Y%m%d', ud.activity_date),
                    PARSE_DATE('%Y%m%d', fo.cohort_date),
                    DAY
                ) AS day_offset
            FROM first_opens fo
            JOIN user_days ud USING (user_pseudo_id)
            LEFT JOIN user_skillage us USING (user_pseudo_id)
        ),
        filtered AS (
            SELECT cohort_date, user_pseudo_id, skill_age, day_offset
            FROM day_offsets
            WHERE day_offset IN (1, 7, 30)
        ),
        retained AS (
            SELECT cohort_date, skill_age, day_offset, COUNT(DISTINCT user_pseudo_id) AS retained_users
            FROM filtered
            GROUP BY cohort_date, skill_age, day_offset
        )
        SELECT
            r.skill_age,
            r.day_offset,
            SUM(r.retained_users)                                                       AS retained_users,
            SUM(cs.cohort_size)                                                         AS eligible_cohort_size,
            ROUND(100.0 * SUM(r.retained_users) / NULLIF(SUM(cs.cohort_size), 0), 2)   AS retention_rate_pct
        FROM retained r
        JOIN cohort_sizes cs
          ON r.cohort_date = cs.cohort_date AND r.skill_age = cs.skill_age
        WHERE
            (r.day_offset = 1  AND PARSE_DATE('%Y%m%d', r.cohort_date) <= DATE_SUB(PARSE_DATE('%Y%m%d', '${END_DATE}'), INTERVAL 1  DAY))
            OR (r.day_offset = 7  AND PARSE_DATE('%Y%m%d', r.cohort_date) <= DATE_SUB(PARSE_DATE('%Y%m%d', '${END_DATE}'), INTERVAL 7  DAY))
            OR (r.day_offset = 30 AND PARSE_DATE('%Y%m%d', r.cohort_date) <= DATE_SUB(PARSE_DATE('%Y%m%d', '${END_DATE}'), INTERVAL 30 DAY))
        GROUP BY r.skill_age, r.day_offset
        ORDER BY r.skill_age, r.day_offset
    `;
    const [rows] = await client.query({ query, location: LOCATION });
    return rows;
}

// ─── 2c. Retention — level players only (LevelLoaded cohort) ─────────────────
// Restricts cohort to the 1,273 users who fired at least one LevelLoaded event.
// Also breaks down by skill age. Excludes the ~1,988 campaign-bounce users who
// never reached gameplay, giving a cleaner picture of actual player retention.

async function fetchRetentionLevelPlayers () {
    console.log('\n[2c/6] Fetching D1/D7/D30 retention for level-players (LevelLoaded cohort)...');
    const query = `
        WITH level_players AS (
            -- Only users who loaded at least one level
            SELECT DISTINCT user_pseudo_id
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'LevelLoaded'
        ),
        user_skillage AS (
            SELECT
                user_pseudo_id,
                ARRAY_AGG(
                    (SELECT ep.value.string_value FROM UNNEST(event_params) ep WHERE ep.key = 'currentSkillAge')
                    ORDER BY event_timestamp LIMIT 1
                )[OFFSET(0)] AS skill_age
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND event_name = 'segmentStarted'
            GROUP BY user_pseudo_id
        ),
        first_opens AS (
            SELECT user_pseudo_id, MIN(event_date) AS cohort_date
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND user_pseudo_id IN (SELECT user_pseudo_id FROM level_players)
            GROUP BY user_pseudo_id
        ),
        user_days AS (
            SELECT DISTINCT user_pseudo_id, event_date AS activity_date
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
              AND user_pseudo_id IN (SELECT user_pseudo_id FROM level_players)
        ),
        cohort_sizes AS (
            SELECT
                fo.cohort_date,
                COALESCE(us.skill_age, '(no skillage)') AS skill_age,
                COUNT(DISTINCT fo.user_pseudo_id) AS cohort_size
            FROM first_opens fo
            LEFT JOIN user_skillage us USING (user_pseudo_id)
            GROUP BY fo.cohort_date, skill_age
        ),
        day_offsets AS (
            SELECT
                fo.cohort_date,
                fo.user_pseudo_id,
                COALESCE(us.skill_age, '(no skillage)') AS skill_age,
                DATE_DIFF(
                    PARSE_DATE('%Y%m%d', ud.activity_date),
                    PARSE_DATE('%Y%m%d', fo.cohort_date),
                    DAY
                ) AS day_offset
            FROM first_opens fo
            JOIN user_days ud USING (user_pseudo_id)
            LEFT JOIN user_skillage us USING (user_pseudo_id)
        ),
        filtered AS (
            SELECT cohort_date, user_pseudo_id, skill_age, day_offset
            FROM day_offsets
            WHERE day_offset IN (1, 7, 30)
        ),
        retained AS (
            SELECT cohort_date, skill_age, day_offset, COUNT(DISTINCT user_pseudo_id) AS retained_users
            FROM filtered
            GROUP BY cohort_date, skill_age, day_offset
        )
        SELECT
            r.skill_age,
            r.day_offset,
            SUM(r.retained_users)                                                       AS retained_users,
            SUM(cs.cohort_size)                                                         AS eligible_cohort_size,
            ROUND(100.0 * SUM(r.retained_users) / NULLIF(SUM(cs.cohort_size), 0), 2)   AS retention_rate_pct
        FROM retained r
        JOIN cohort_sizes cs
          ON r.cohort_date = cs.cohort_date AND r.skill_age = cs.skill_age
        WHERE
            (r.day_offset = 1  AND PARSE_DATE('%Y%m%d', r.cohort_date) <= DATE_SUB(PARSE_DATE('%Y%m%d', '${END_DATE}'), INTERVAL 1  DAY))
            OR (r.day_offset = 7  AND PARSE_DATE('%Y%m%d', r.cohort_date) <= DATE_SUB(PARSE_DATE('%Y%m%d', '${END_DATE}'), INTERVAL 7  DAY))
            OR (r.day_offset = 30 AND PARSE_DATE('%Y%m%d', r.cohort_date) <= DATE_SUB(PARSE_DATE('%Y%m%d', '${END_DATE}'), INTERVAL 30 DAY))
        GROUP BY r.skill_age, r.day_offset
        ORDER BY r.skill_age, r.day_offset
    `;
    const [rows] = await client.query({ query, location: LOCATION });
    return rows;
}

// ─── 3. Paywall funnel ────────────────────────────────────────────────────────
// Step 1: app_open (all users)
// Step 2: SubscriptionOpened (reached paywall)
// Step 3: GameSubscription where type = "Created" (purchased)

async function fetchPaywallFunnel () {
    console.log('\n[3/6] Fetching paywall funnel...');
    const query = `
        WITH all_users AS (
            SELECT COUNT(DISTINCT user_pseudo_id) AS total
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
        ),
        paywall_users AS (
            SELECT COUNT(DISTINCT user_pseudo_id) AS reached_paywall
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE
                _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
                AND event_name = 'SubscriptionOpened'
        ),
        purchase_users AS (
            SELECT COUNT(DISTINCT user_pseudo_id) AS purchased
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE
                _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
                AND event_name = 'GameSubscription'
                AND EXISTS (
                    SELECT 1 FROM UNNEST(event_params)
                    WHERE key = 'type' AND value.string_value = 'Created'
                )
        ),
        plans AS (
            -- Breakdown by plan type
            SELECT
                (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'plan') AS plan,
                COUNT(DISTINCT user_pseudo_id) AS subscribers
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE
                _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
                AND event_name = 'GameSubscription'
                AND EXISTS (
                    SELECT 1 FROM UNNEST(event_params)
                    WHERE key = 'type' AND value.string_value = 'Created'
                )
            GROUP BY plan
        )
        SELECT
            au.total              AS total_users,
            pu.reached_paywall    AS reached_paywall,
            pr.purchased          AS purchased,
            (SELECT STRING_AGG(CONCAT(plan, ':', CAST(subscribers AS STRING)), ', ') FROM plans) AS plan_breakdown
        FROM all_users au, paywall_users pu, purchase_users pr
    `;
    const [rows] = await client.query({ query, location: LOCATION });
    return rows[0];
}

// ─── 4. Top screens + feature engagement ─────────────────────────────────────
// screen_view is absent from this dataset; use firebase_screen param on LevelLoaded
// and segment events — every event carries the screen the user was on when it fired.

async function fetchTopScreens () {
    console.log('\n[4/6] Fetching top screens (via firebase_screen param on all events)...');
    const query = `
        SELECT
            (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'firebase_screen') AS screen_name,
            COUNT(*)                         AS event_count,
            COUNT(DISTINCT user_pseudo_id)   AS unique_users
        FROM \`${PROJECT_ID}.${DATASET}.events_*\`
        WHERE
            _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
            AND event_name IN ('LevelLoaded', 'segmentStarted', 'segmentCompleted',
                               'segmentDropped', 'assessmentCompleted')
        GROUP BY screen_name
        HAVING screen_name IS NOT NULL
        ORDER BY event_count DESC
        LIMIT 20
    `;
    const [rows] = await client.query({ query, location: LOCATION });
    return rows;
}

async function fetchFeatureEngagement () {
    console.log('    Fetching feature engagement (segment funnel + top levels)...');
    // Segment funnel: started → completed/dropped
    const funnelQuery = `
        SELECT
            event_name,
            COUNT(*)                        AS events,
            COUNT(DISTINCT user_pseudo_id)  AS unique_users
        FROM \`${PROJECT_ID}.${DATASET}.events_*\`
        WHERE
            _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
            AND event_name IN ('segmentStarted', 'segmentCompleted', 'segmentDropped', 'LevelLoaded')
        GROUP BY event_name
        ORDER BY events DESC
    `;
    // Top 10 levels loaded
    const levelsQuery = `
        SELECT
            (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'level') AS level,
            COUNT(*)                        AS loads,
            COUNT(DISTINCT user_pseudo_id)  AS unique_users
        FROM \`${PROJECT_ID}.${DATASET}.events_*\`
        WHERE
            _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
            AND event_name = 'LevelLoaded'
        GROUP BY level
        HAVING level IS NOT NULL
        ORDER BY loads DESC
        LIMIT 10
    `;
    const [[funnelRows], [levelRows]] = await Promise.all([
        client.query({ query: funnelQuery, location: LOCATION }),
        client.query({ query: levelsQuery, location: LOCATION }),
    ]);
    return { funnelRows, levelRows };
}

// ─── 5. Assessment (onboarding) completion ────────────────────────────────────

async function fetchAssessmentCompletion () {
    console.log('\n[5/6] Fetching assessment completion...');
    const query = `
        WITH total_users AS (
            SELECT COUNT(DISTINCT user_pseudo_id) AS total
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
        ),
        assessed AS (
            SELECT
                COUNT(DISTINCT user_pseudo_id) AS users_completed,
                COUNT(*)                        AS total_completions
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE
                _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
                AND event_name = 'assessmentCompleted'
        )
        SELECT
            t.total               AS total_users,
            a.users_completed     AS users_completed_assessment,
            a.total_completions   AS total_assessment_events,
            ROUND(100.0 * a.users_completed / NULLIF(t.total, 0), 2) AS completion_rate_pct
        FROM total_users t, assessed a
    `;
    const [rows] = await client.query({ query, location: LOCATION });
    return rows[0];
}

// ─── 6. Crash / exception rate ────────────────────────────────────────────────

async function fetchCrashRate () {
    console.log('\n[6/6] Fetching crash/exception rate...');
    const query = `
        WITH total_sessions AS (
            SELECT COUNT(DISTINCT
                CONCAT(user_pseudo_id, '_',
                    CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING))
            ) AS total
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
        ),
        crashes AS (
            SELECT
                COUNT(*)                        AS crash_events,
                COUNT(DISTINCT user_pseudo_id)  AS users_affected
            FROM \`${PROJECT_ID}.${DATASET}.events_*\`
            WHERE
                _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
                AND event_name = 'app_exception'
        )
        SELECT
            ts.total    AS total_sessions,
            c.crash_events,
            c.users_affected
        FROM total_sessions ts, crashes c
    `;
    const [rows] = await client.query({ query, location: LOCATION });
    return rows[0];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║       GD-Math — Pre-Subscription Phase Metrics                  ║');
    console.log('║       BigQuery / GA4 Export                                     ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`Project : ${PROJECT_ID}`);
    console.log(`Dataset : ${DATASET}`);
    console.log(`Window  : ${START_DATE} → ${END_DATE}`);

    // Verify dataset access first
    try {
        const [tables] = await client.dataset(DATASET).getTables();
        const eventTables = tables.map(t => t.id).filter(id => /^events_\d{8}$/.test(id));
        if (eventTables.length === 0) {
            console.error('✗ No events_YYYYMMDD tables found. Check GA4 BigQuery export.');
            process.exit(1);
        }
        console.log(`\n✓ Dataset accessible — ${eventTables.length} daily tables found`);
    } catch (err) {
        console.error(`✗ Dataset access failed: ${err.message}`);
        process.exit(1);
    }

    // Run all queries in parallel where possible
    const [
        dauRows,
        mau,
        activity,
        retentionRows,
        retentionBySkillAge,
        retentionLevelPlayers,
        paywallFunnel,
        topScreens,
        featureEngagement,
        assessment,
        crashes,
    ] = await Promise.all([
        fetchDAU(),
        fetchMAU(),
        fetchUserActivityExtended(),
        fetchRetention(),
        fetchRetentionBySkillAge(),
        fetchRetentionLevelPlayers(),
        fetchPaywallFunnel(),
        fetchTopScreens(),
        fetchFeatureEngagement(),
        fetchAssessmentCompletion(),
        fetchCrashRate(),
    ]);

    // ── Compute DAU stats ──────────────────────────────────────────────────────
    const dauValues = dauRows.map(r => parseInt(r.dau));
    const avgDAU    = dauValues.length ? Math.round(dauValues.reduce((a, b) => a + b, 0) / dauValues.length) : 0;
    const peakDAU   = dauValues.length ? Math.max(...dauValues) : 0;
    const dauMau    = mau > 0 ? (avgDAU / mau).toFixed(3) : '0.000';

    // ── Compute extended activity stats ───────────────────────────────────────
    // Check whether Firebase auto-collected events are in the BQ export
    const autoEventsAvailable = activity.newUsers > 0 || activity.activeUsers > 0;
    const returningUsers     = autoEventsAvailable ? mau - activity.newUsers : null;
    const avgEngagementMs    = activity.engagedUsers > 0 ? Math.round(activity.totalEngagementMs / activity.engagedUsers) : 0;
    const avgEngagementMin   = Math.floor(avgEngagementMs / 60000);
    const avgEngagementSec   = Math.round((avgEngagementMs % 60000) / 1000);

    // ── Print report ───────────────────────────────────────────────────────────

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. USER ACQUISITION & ACTIVITY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   MAU (window)    : ${mau.toLocaleString()}`);
    if (!autoEventsAvailable) {
        console.log('   New users       : N/A  ⚠ first_open not in BQ export (auto-events disabled)');
        console.log('   Returning users : N/A');
        console.log('   Active users    : N/A  ⚠ session_start not in BQ export');
        console.log('   Engaged sessions: N/A  ⚠ user_engagement not in BQ export');
        console.log('   Avg engagement  : N/A');
        console.log('   ℹ  To enable: Firebase Console → Project Settings → Integrations → BigQuery');
        console.log('      → Streaming → include automatically collected events');
    } else {
        console.log(`   New users       : ${activity.newUsers.toLocaleString()}  (first_open events)`);
        console.log(`   Returning users : ${returningUsers.toLocaleString()}  (MAU − new users)`);
        console.log(`   Active users    : ${activity.activeUsers.toLocaleString()}  (≥1 session, approx)`);
        console.log(`   Engaged sessions: ${activity.engagedSessions.toLocaleString()}  (>10s engagement, approx)`);
        console.log(`   Avg engagement  : ${avgEngagementMin}m ${avgEngagementSec}s per user`);
    }
    console.log(`   Avg DAU         : ${avgDAU.toLocaleString()}`);
    console.log(`   Peak DAU        : ${peakDAU.toLocaleString()}`);
    console.log(`   DAU/MAU ratio   : ${dauMau}  ${parseFloat(dauMau) >= 0.2 ? '✓ Good (≥0.20)' : '⚠ Low (<0.20)'}`);
    console.log('\n   DAU trend (last 14 days):');
    dauRows.slice(-14).forEach(r => {
        const d = parseInt(r.dau);
        const b = bar(d, peakDAU);
        console.log(`   ${r.event_date}  ${b}  ${d}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2. RETENTION COHORTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (retentionRows.length === 0) {
        console.log('   No retention data — first_open events may be missing in this window.');
    } else {
        const benchmarks = { 1: 40, 7: 20, 30: 10 };
        retentionRows.forEach(r => {
            const rate  = parseFloat(r.retention_rate_pct);
            const bench = benchmarks[r.day_offset] || 10;
            const status = rate >= bench ? '✓' : '⚠';
            const eligible = parseInt(r.eligible_cohort_size);
            console.log(
                `   D${String(r.day_offset).padStart(2, '0')}  ${bar(rate, 100)}  ${String(rate.toFixed(1)).padStart(5)}%  ${status} (benchmark ≥${bench}%)  — ${r.retained_users}/${eligible} users`
            );
        });
        console.log('\n   Note: Low D1 may indicate onboarding friction.');
        console.log('         Low D7 suggests weak engagement loop.');
        console.log('         Low D30 = churn risk before paywall.');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2b. RETENTION BY SKILL AGE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Skill age = currentSkillAge on user\'s first segmentStarted event.');
    if (retentionBySkillAge.length === 0) {
        console.log('   No data — no segmentStarted events in this window.');
    } else {
        // Group rows by skill_age
        const bySkillAge = {};
        retentionBySkillAge.forEach(r => {
            const sa = r.skill_age || '(no skillage)';
            if (!bySkillAge[sa]) bySkillAge[sa] = {};
            bySkillAge[sa][r.day_offset] = r;
        });
        const colW = 12;
        const header = '   Skill age   '.padEnd(14) + ' D01'.padStart(colW) + ' D07'.padStart(colW) + ' D30'.padStart(colW);
        console.log('\n' + header);
        console.log('   ' + '─'.repeat(header.length - 3));
        Object.keys(bySkillAge).sort().forEach(sa => {
            const d = bySkillAge[sa];
            const fmt = (offset) => {
                if (!d[offset]) return '   —'.padStart(colW);
                const rate = parseFloat(d[offset].retention_rate_pct);
                const eligible = parseInt(d[offset].eligible_cohort_size);
                return `${rate.toFixed(1)}% (n=${eligible})`.padStart(colW);
            };
            console.log(`   ${sa.padEnd(11)} ${fmt(1)}${fmt(7)}${fmt(30)}`);
        });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2c. RETENTION — LEVEL PLAYERS ONLY  (LevelLoaded cohort, n=1,273)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Excludes ~1,988 campaign-bounce users who never loaded a level.');
    if (retentionLevelPlayers.length === 0) {
        console.log('   No data.');
    } else {
        // Overall totals across all skill ages
        const overallByOffset = {};
        retentionLevelPlayers.forEach(r => {
            const o = r.day_offset;
            if (!overallByOffset[o]) overallByOffset[o] = { retained: 0, cohort: 0 };
            overallByOffset[o].retained += parseInt(r.retained_users);
            overallByOffset[o].cohort   += parseInt(r.eligible_cohort_size);
        });
        [1, 7, 30].forEach(o => {
            const data = overallByOffset[o];
            if (!data) return;
            const rate = (100 * data.retained / data.cohort).toFixed(1);
            const bench = o === 1 ? 40 : o === 7 ? 20 : 10;
            const status = parseFloat(rate) >= bench ? '✓' : '⚠';
            console.log(`   D${String(o).padStart(2,'0')}  ${bar(parseFloat(rate), 100)}  ${String(rate).padStart(5)}%  ${status} (benchmark ≥${bench}%)  — ${data.retained}/${data.cohort} users`);
        });

        // By skill age
        const bySkillAge2 = {};
        retentionLevelPlayers.forEach(r => {
            const sa = r.skill_age || '(no skillage)';
            if (!bySkillAge2[sa]) bySkillAge2[sa] = {};
            bySkillAge2[sa][r.day_offset] = r;
        });
        const colW = 12;
        const header2 = '\n   Skill age   '.padEnd(15) + ' D01'.padStart(colW) + ' D07'.padStart(colW) + ' D30'.padStart(colW);
        console.log(header2);
        console.log('   ' + '─'.repeat(header2.trim().length));
        Object.keys(bySkillAge2).sort().forEach(sa => {
            const d = bySkillAge2[sa];
            const fmt = (offset) => {
                if (!d[offset]) return '   —'.padStart(colW);
                const rate = parseFloat(d[offset].retention_rate_pct);
                const eligible = parseInt(d[offset].eligible_cohort_size);
                return `${rate.toFixed(1)}% (n=${eligible})`.padStart(colW);
            };
            console.log(`   ${sa.padEnd(11)} ${fmt(1)}${fmt(7)}${fmt(30)}`);
        });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('3. PAYWALL FUNNEL  (Priority #1 — Drive First Subscribers)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const totalUsers     = parseInt(paywallFunnel.total_users);
    const reachedPaywall = parseInt(paywallFunnel.reached_paywall);
    const purchased      = parseInt(paywallFunnel.purchased);
    const paywallReach   = totalUsers     > 0 ? (100 * reachedPaywall / totalUsers).toFixed(2)     : '0.00';
    const paywallConvert = reachedPaywall > 0 ? (100 * purchased      / reachedPaywall).toFixed(2) : '0.00';
    const overallConvert = totalUsers     > 0 ? (100 * purchased      / totalUsers).toFixed(2)     : '0.00';

    console.log(`   Total active users     : ${totalUsers.toLocaleString()}`);
    console.log(`   Reached paywall        : ${reachedPaywall.toLocaleString()}  (${paywallReach}% of users)  ${parseFloat(paywallReach) >= 5 ? '✓' : '⚠ <5% — paywall may be hard to find'}`);
    console.log(`   Completed purchase     : ${purchased.toLocaleString()}  (${paywallConvert}% of paywall viewers)`);
    console.log(`   Overall conversion     : ${overallConvert}% of all users`);
    if (paywallFunnel.plan_breakdown) {
        console.log(`   Plans breakdown        : ${paywallFunnel.plan_breakdown}`);
    }
    console.log('\n   Funnel:');
    console.log(`   All users ──(${paywallReach}%)──► Paywall ──(${paywallConvert}%)──► Purchase`);
    if (purchased === 0) {
        console.log('\n   ⚠  Zero purchases recorded. Actions:');
        console.log('      1. Verify GameSubscription event fires on successful purchase');
        console.log('      2. Check paywall reach rate — if <5%, increase paywall visibility');
        console.log('      3. Review pricing clarity and trust signals on paywall screen');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('4. FEATURE ENGAGEMENT & SCREEN DISTRIBUTION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Segment funnel (LevelLoaded → started → completed/dropped):');
    const funnelMap = {};
    featureEngagement.funnelRows.forEach(r => { funnelMap[r.event_name] = r; });
    const loaded    = parseInt(funnelMap['LevelLoaded']?.events    || 0);
    const started   = parseInt(funnelMap['segmentStarted']?.events  || 0);
    const completed = parseInt(funnelMap['segmentCompleted']?.events || 0);
    const dropped   = parseInt(funnelMap['segmentDropped']?.events  || 0);
    console.log(`   LevelLoaded      : ${loaded.toLocaleString().padStart(7)} events  ${funnelMap['LevelLoaded']?.unique_users || 0} users`);
    console.log(`   segmentStarted   : ${started.toLocaleString().padStart(7)} events  ${funnelMap['segmentStarted']?.unique_users || 0} users`);
    console.log(`   segmentCompleted : ${completed.toLocaleString().padStart(7)} events  ${funnelMap['segmentCompleted']?.unique_users || 0} users  (${pct(completed, started)} completion rate)`);
    console.log(`   segmentDropped   : ${dropped.toLocaleString().padStart(7)} events  ${funnelMap['segmentDropped']?.unique_users || 0} users  (${pct(dropped, started)} drop rate)`);

    console.log('\n   Top 10 levels loaded:');
    const maxLoads = parseInt(featureEngagement.levelRows[0]?.loads || 1);
    featureEngagement.levelRows.forEach((r, i) => {
        const loads = parseInt(r.loads);
        const name  = (r.level || '(null)').padEnd(32);
        console.log(`   ${String(i + 1).padStart(2)}. ${name}  ${bar(loads, maxLoads, 12)}  ${String(loads).padStart(4)} loads  ${r.unique_users} users`);
    });

    console.log('\n   Screen distribution (from firebase_screen param):');
    if (topScreens.length === 0) {
        console.log('   No screen data found.');
    } else {
        const maxEvents = parseInt(topScreens[0].event_count);
        topScreens.forEach((r, i) => {
            const cnt   = parseInt(r.event_count);
            const users = parseInt(r.unique_users);
            const name  = (r.screen_name || '(null)').padEnd(22);
            console.log(
                `   ${String(i + 1).padStart(2)}. ${name}  ${bar(cnt, maxEvents, 14)}  ${String(cnt).padStart(6)} events  ${String(users).padStart(5)} users`
            );
        });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('5. ONBOARDING / ASSESSMENT COMPLETION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const assessTotal = parseInt(assessment.total_users);
    const assessUsers = parseInt(assessment.users_completed_assessment);
    const assessRate  = parseFloat(assessment.completion_rate_pct);
    console.log(`   Total users              : ${assessTotal.toLocaleString()}`);
    console.log(`   Completed assessment     : ${assessUsers.toLocaleString()}  (${assessRate.toFixed(1)}%)`);
    console.log(`   Total assessment events  : ${parseInt(assessment.total_assessment_events).toLocaleString()}`);
    console.log(`   Avg completions/user     : ${assessUsers > 0 ? (parseInt(assessment.total_assessment_events) / assessUsers).toFixed(1) : 'N/A'}`);
    const assessStatus = assessRate >= 50 ? '✓ Good (≥50%)' : assessRate >= 30 ? '⚠ Moderate (30–50%)' : '✗ Low (<30%) — review onboarding';
    console.log(`   Status                   : ${assessStatus}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('6. CRASH / STABILITY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const totalSessions  = parseInt(crashes.total_sessions);
    const crashEvents    = parseInt(crashes.crash_events);
    const usersAffected  = parseInt(crashes.users_affected);
    const crashRate      = totalSessions > 0 ? (100 * crashEvents / totalSessions).toFixed(3) : '0.000';
    const userCrashRate  = totalUsers    > 0 ? (100 * usersAffected / totalUsers).toFixed(2)  : '0.00';
    console.log(`   Total sessions    : ${totalSessions.toLocaleString()}`);
    console.log(`   Crash events      : ${crashEvents.toLocaleString()}`);
    console.log(`   Users affected    : ${usersAffected.toLocaleString()}  (${userCrashRate}% of users)`);
    console.log(`   Crash rate        : ${crashRate}% of sessions  ${parseFloat(crashRate) < 1 ? '✓ Good (<1%)' : '⚠ Elevated (≥1%)'}`);

    // ── Save JSON output ───────────────────────────────────────────────────────
    const output = {
        generatedAt: new Date().toISOString(),
        window: { start: START_DATE, end: END_DATE },
        acquisition: {
            mau,
            ...(autoEventsAvailable ? {
                newUsers: activity.newUsers,
                returningUsers,
                activeUsers: activity.activeUsers,
                engagedSessions: activity.engagedSessions,
                avgEngagementMsPerUser: avgEngagementMs,
            } : {
                autoEventsNote: 'first_open/session_start/user_engagement not in BQ export',
            }),
            avgDAU,
            peakDAU,
            dauMauRatio: parseFloat(dauMau),
            dauByDay: dauRows.map(r => ({ date: r.event_date, dau: parseInt(r.dau) })),
        },
        retention: retentionRows.map(r => ({
            dayOffset: r.day_offset,
            retainedUsers: parseInt(r.retained_users),
            eligibleCohortSize: parseInt(r.eligible_cohort_size),
            retentionRatePct: parseFloat(r.retention_rate_pct),
        })),
        retentionBySkillAge: retentionBySkillAge.map(r => ({
            skillAge: r.skill_age,
            dayOffset: r.day_offset,
            retainedUsers: parseInt(r.retained_users),
            eligibleCohortSize: parseInt(r.eligible_cohort_size),
            retentionRatePct: parseFloat(r.retention_rate_pct),
        })),
        retentionLevelPlayers: retentionLevelPlayers.map(r => ({
            skillAge: r.skill_age,
            dayOffset: r.day_offset,
            retainedUsers: parseInt(r.retained_users),
            eligibleCohortSize: parseInt(r.eligible_cohort_size),
            retentionRatePct: parseFloat(r.retention_rate_pct),
        })),
        paywallFunnel: {
            totalUsers,
            reachedPaywall,
            purchased,
            paywallReachRatePct: parseFloat(paywallReach),
            paywallConversionRatePct: parseFloat(paywallConvert),
            overallConversionRatePct: parseFloat(overallConvert),
            planBreakdown: paywallFunnel.plan_breakdown || null,
        },
        topScreens: topScreens.map(r => ({
            screen: r.screen_name,
            events: parseInt(r.event_count),
            uniqueUsers: parseInt(r.unique_users),
        })),
        featureEngagement: {
            segmentFunnel: featureEngagement.funnelRows.map(r => ({
                event: r.event_name,
                events: parseInt(r.events),
                uniqueUsers: parseInt(r.unique_users),
            })),
            topLevels: featureEngagement.levelRows.map(r => ({
                level: r.level,
                loads: parseInt(r.loads),
                uniqueUsers: parseInt(r.unique_users),
            })),
        },
        assessment: {
            totalUsers: assessTotal,
            usersCompletedAssessment: assessUsers,
            totalAssessmentEvents: parseInt(assessment.total_assessment_events),
            completionRatePct: assessRate,
        },
        crashes: {
            totalSessions,
            crashEvents,
            usersAffected,
            crashRatePct: parseFloat(crashRate),
            userCrashRatePct: parseFloat(userCrashRate),
        },
    };

    const outPath = path.resolve(__dirname, '../data/pre_subscription_metrics.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✓ Saved → data/pre_subscription_metrics.json`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
    console.error('\nFatal error:', err.message);
    process.exit(1);
});
