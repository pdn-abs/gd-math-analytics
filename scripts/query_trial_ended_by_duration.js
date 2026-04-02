// Free-trial ended users — session duration approach
//
// Since SubscriptionOpened is not present in the current BQ export, this script
// uses cumulative segment play time as a proxy for the in-game playedTime counter.
//
// How it works:
//   - Game.setPlayedTime() increments every minute while the level screen is
//     active. Free trial ends at freeTrialMinutes = 30 (config.json).
//   - segmentCompleted.duration and segmentDropped.duration (both in seconds)
//     are the closest available measure of active play time in BQ.
//   - Users whose SUM(segment durations) >= 1800 seconds (30 min) have
//     definitively crossed the trial wall.
//
// ⚠ This is a conservative lower-bound: the game's playedTime also counts idle
//   time between segments (animations, transitions), so some users will have
//   hit the wall with less cumulative segment time. True trial-ended count is
//   likely higher than reported here.
//
// Prerequisites:
//   - GA4 → BigQuery linking enabled
//   - Service account: roles/bigquery.dataViewer + roles/bigquery.jobUser
//
// Dataset: analytics_441470574  (GA4 property: 441470574)

const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const KEY_FILE = path.resolve(__dirname, '../keys/gd-math-71c48-7553a3a1322b.json');
const PROJECT_ID = 'gd-math-71c48';
const DATASET = 'analytics_441470574';
const LOCATION = 'asia-south1';

const START_DATE = '20260131';
const END_DATE = '20260331';

// Free trial threshold in seconds (must match config.json freeTrialMinutes)
const FREE_TRIAL_SECONDS = 30 * 60;

const client = new BigQuery({ projectId: PROJECT_ID, keyFilename: KEY_FILE });

function pct (num, den) {
	if (!den || den === 0) return '0.00%';
	return (100 * num / den).toFixed(2) + '%';
}

function fmtDuration (seconds) {
	const s = Math.round(seconds);
	const m = Math.floor(s / 60);
	const h = Math.floor(m / 60);
	if (h > 0) return `${h}h ${m % 60}m`;
	return `${m}m ${s % 60}s`;
}

// ─── 1. Per-user segment play time + conversion status ────────────────────────

async function fetchUsersWithPlayTime () {
	console.log('\n[1/3] Fetching per-user segment play time and conversion status...');

	const query = `
		WITH segment_times AS (
			SELECT
				user_pseudo_id,
				SUM(
					CAST((SELECT ep.value.int_value FROM UNNEST(event_params) ep WHERE ep.key = 'duration') AS INT64)
				) AS total_segment_seconds,
				COUNT(*) AS segment_events,
				MIN(event_date) AS first_seen,
				MAX(event_date) AS last_seen
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name IN ('segmentCompleted', 'segmentDropped')
			GROUP BY user_pseudo_id
		),
		converters AS (
			SELECT DISTINCT user_pseudo_id
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name = 'GameSubscription'
			  AND (
			    SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'type'
			  ) = 'Created'
		)
		SELECT
			t.user_pseudo_id,
			t.total_segment_seconds,
			t.segment_events,
			t.first_seen,
			t.last_seen,
			IF(c.user_pseudo_id IS NOT NULL, 'converted', 'churned') AS status
		FROM segment_times t
		LEFT JOIN converters c USING (user_pseudo_id)
		WHERE t.total_segment_seconds >= ${FREE_TRIAL_SECONDS}
		ORDER BY t.total_segment_seconds DESC
	`;

	const [rows] = await client.query({ query, location: LOCATION });
	return rows;
}

// ─── 2. Daily breakdown of trial endings ─────────────────────────────────────

async function fetchDailyBreakdown () {
	console.log('[2/3] Fetching daily breakdown...');

	// "trial ended date" = last day a segment event was seen before crossing threshold
	const query = `
		WITH user_cumulative AS (
			SELECT
				user_pseudo_id,
				event_date,
				SUM(
					CAST((SELECT ep.value.int_value FROM UNNEST(event_params) ep WHERE ep.key = 'duration') AS INT64)
				) OVER (PARTITION BY user_pseudo_id ORDER BY event_date) AS cumulative_seconds
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name IN ('segmentCompleted', 'segmentDropped')
		),
		trial_end_dates AS (
			SELECT
				user_pseudo_id,
				MIN(event_date) AS trial_ended_date
			FROM user_cumulative
			WHERE cumulative_seconds >= ${FREE_TRIAL_SECONDS}
			GROUP BY user_pseudo_id
		),
		converters AS (
			SELECT DISTINCT user_pseudo_id
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name = 'GameSubscription'
			  AND (
			    SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'type'
			  ) = 'Created'
		)
		SELECT
			t.trial_ended_date,
			COUNT(*) AS trial_ended,
			COUNTIF(c.user_pseudo_id IS NOT NULL) AS converted,
			COUNTIF(c.user_pseudo_id IS NULL) AS churned
		FROM trial_end_dates t
		LEFT JOIN converters c USING (user_pseudo_id)
		GROUP BY t.trial_ended_date
		ORDER BY t.trial_ended_date
	`;

	const [rows] = await client.query({ query, location: LOCATION });
	return rows;
}

// ─── 3. Overall totals + play time distribution ───────────────────────────────

async function fetchTotals () {
	console.log('[3/3] Fetching overall totals and distribution...');

	const query = `
		WITH segment_times AS (
			SELECT
				user_pseudo_id,
				SUM(
					CAST((SELECT ep.value.int_value FROM UNNEST(event_params) ep WHERE ep.key = 'duration') AS INT64)
				) AS total_segment_seconds
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name IN ('segmentCompleted', 'segmentDropped')
			GROUP BY user_pseudo_id
		),
		converters AS (
			SELECT DISTINCT user_pseudo_id
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name = 'GameSubscription'
			  AND (
			    SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'type'
			  ) = 'Created'
		)
		SELECT
			COUNT(*) AS total_active_users,
			COUNTIF(t.total_segment_seconds >= ${FREE_TRIAL_SECONDS}) AS trial_ended,
			COUNTIF(t.total_segment_seconds >= ${FREE_TRIAL_SECONDS} AND c.user_pseudo_id IS NOT NULL) AS converted,
			COUNTIF(t.total_segment_seconds >= ${FREE_TRIAL_SECONDS} AND c.user_pseudo_id IS NULL) AS churned,
			ROUND(AVG(t.total_segment_seconds) / 60, 1) AS avg_play_minutes,
			ROUND(MAX(t.total_segment_seconds) / 60, 1) AS max_play_minutes,
			ROUND(APPROX_QUANTILES(t.total_segment_seconds, 100)[OFFSET(50)] / 60, 1) AS median_play_minutes
		FROM segment_times t
		LEFT JOIN converters c USING (user_pseudo_id)
	`;

	const [rows] = await client.query({ query, location: LOCATION });
	return rows[0];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
	console.log('=== Free Trial Ended Users (Session Duration) ===');
	console.log(`Period  : ${START_DATE} → ${END_DATE}`);
	console.log(`Threshold: ${FREE_TRIAL_SECONDS / 60} minutes of segment play time`);
	console.log('Note    : Lower-bound estimate — actual trial-ended count may be higher');

	const [users, daily, totals] = await Promise.all([
		fetchUsersWithPlayTime(),
		fetchDailyBreakdown(),
		fetchTotals(),
	]);

	// ── Totals ──
	console.log('\n── Overall ──────────────────────────────────────────');
	console.log(`  Active users (any segments)  : ${totals.total_active_users}`);
	console.log(`  Trial ended (>= 30 min)      : ${totals.trial_ended}`);
	console.log(`  Converted to paid            : ${totals.converted} (${pct(Number(totals.converted), Number(totals.trial_ended))})`);
	console.log(`  Churned (no subscription)    : ${totals.churned} (${pct(Number(totals.churned), Number(totals.trial_ended))})`);
	console.log(`  Avg play time (all users)    : ${totals.avg_play_minutes} min`);
	console.log(`  Median play time             : ${totals.median_play_minutes} min`);
	console.log(`  Max play time                : ${totals.max_play_minutes} min`);

	// ── Daily breakdown ──
	console.log('\n── Daily Trial Endings ──────────────────────────────');
	console.log('Date         Trial Ended  Converted  Churned  Conv%');
	console.log('─────────────────────────────────────────────────────');
	for (const row of daily) {
		const convRate = pct(Number(row.converted), Number(row.trial_ended));
		console.log(
			`${row.trial_ended_date}   ${String(row.trial_ended).padStart(11)}  ${String(row.converted).padStart(9)}  ${String(row.churned).padStart(7)}  ${convRate.padStart(6)}`
		);
	}

	// ── Churned user list ──
	const churned = users.filter(u => u.status === 'churned');
	const converted = users.filter(u => u.status === 'converted');

	if (converted.length > 0) {
		console.log(`\n── Converted Users (${converted.length}) ─────────────────────────`);
		console.log('user_pseudo_id                       play_time   first_seen   last_seen');
		console.log('───────────────────────────────────────────────────────────────────────');
		for (const u of converted) {
			console.log(
				`${u.user_pseudo_id.padEnd(36)} ${fmtDuration(u.total_segment_seconds).padEnd(10)}  ${u.first_seen}  ${u.last_seen}`
			);
		}
	}

	console.log(`\n── Churned Users (${churned.length}) ─────────────────────────`);
	if (churned.length === 0) {
		console.log('  (none)');
	} else {
		console.log('user_pseudo_id                       play_time   first_seen   last_seen');
		console.log('───────────────────────────────────────────────────────────────────────');
		for (const u of churned) {
			console.log(
				`${u.user_pseudo_id.padEnd(36)} ${fmtDuration(u.total_segment_seconds).padEnd(10)}  ${u.first_seen}  ${u.last_seen}`
			);
		}
	}
}

main().catch(err => {
	console.error('\n✗ Query failed:', err.message);
	process.exit(1);
});
