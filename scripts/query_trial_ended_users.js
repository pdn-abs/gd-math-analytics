// Free-trial ended users — BigQuery query
//
// Identifies users whose 30-minute free trial ended (hit the paywall) and
// optionally shows whether they converted to a paid subscription.
//
// Logic:
//   - SubscriptionOpened fires when the subscription screen is shown.
//     The dominant trigger is ScreenManager redirecting when
//     Subscription.getSubscription().status != "available", which happens
//     once playedTime > freeTrialMinutes (30 min). This is the proxy for
//     "trial ended".
//   - GameSubscription { type: "Created" } fires on purchase.
//
// Caveats:
//   - SubscriptionOpened also fires if a user manually opens the screen
//     during the trial — slight over-count.
//   - Users with an expired paid subscription also hit this path (rare).
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

const START_DATE = '20260125';
const END_DATE   = '20260325';

const client = new BigQuery({ projectId: PROJECT_ID, keyFilename: KEY_FILE });

function pct (num, den) {
	if (!den || den === 0) return '0.00%';
	return (100 * num / den).toFixed(2) + '%';
}

// ─── 1. All trial-ended users with conversion status ─────────────────────────

async function fetchTrialEndedUsers () {
	console.log('\n[1/3] Fetching trial-ended users with conversion status...');

	const query = `
		WITH converters AS (
			SELECT DISTINCT user_pseudo_id
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name = 'GameSubscription'
			  AND (
			    SELECT value.string_value
			    FROM UNNEST(event_params)
			    WHERE key = 'type'
			  ) = 'Created'
		),
		trial_ended AS (
			SELECT
				user_pseudo_id,
				MIN(event_date) AS trial_ended_date,
				COUNT(*) AS paywall_hits
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name = 'SubscriptionOpened'
			GROUP BY user_pseudo_id
		)
		SELECT
			t.user_pseudo_id,
			t.trial_ended_date,
			t.paywall_hits,
			IF(c.user_pseudo_id IS NOT NULL, 'converted', 'churned') AS status
		FROM trial_ended t
		LEFT JOIN converters c USING (user_pseudo_id)
		ORDER BY t.trial_ended_date, t.user_pseudo_id
	`;

	const [rows] = await client.query({ query, location: LOCATION });
	return rows;
}

// ─── 2. Daily trial-ended count + conversion rate ────────────────────────────

async function fetchDailySummary () {
	console.log('[2/3] Fetching daily trial-ended counts and conversion rates...');

	const query = `
		WITH converters AS (
			SELECT DISTINCT user_pseudo_id
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name = 'GameSubscription'
			  AND (
			    SELECT value.string_value
			    FROM UNNEST(event_params)
			    WHERE key = 'type'
			  ) = 'Created'
		),
		trial_ended AS (
			SELECT
				user_pseudo_id,
				MIN(event_date) AS trial_ended_date
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name = 'SubscriptionOpened'
			GROUP BY user_pseudo_id
		)
		SELECT
			t.trial_ended_date,
			COUNT(*) AS trial_ended,
			COUNTIF(c.user_pseudo_id IS NOT NULL) AS converted,
			COUNTIF(c.user_pseudo_id IS NULL) AS churned
		FROM trial_ended t
		LEFT JOIN converters c USING (user_pseudo_id)
		GROUP BY t.trial_ended_date
		ORDER BY t.trial_ended_date
	`;

	const [rows] = await client.query({ query, location: LOCATION });
	return rows;
}

// ─── 3. Totals ────────────────────────────────────────────────────────────────

async function fetchTotals () {
	console.log('[3/3] Fetching overall totals...');

	const query = `
		WITH converters AS (
			SELECT DISTINCT user_pseudo_id
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name = 'GameSubscription'
			  AND (
			    SELECT value.string_value
			    FROM UNNEST(event_params)
			    WHERE key = 'type'
			  ) = 'Created'
		),
		trial_ended AS (
			SELECT
				user_pseudo_id,
				MIN(event_date) AS trial_ended_date
			FROM \`${PROJECT_ID}.${DATASET}.events_*\`
			WHERE _TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}'
			  AND event_name = 'SubscriptionOpened'
			GROUP BY user_pseudo_id
		)
		SELECT
			COUNT(*) AS total_trial_ended,
			COUNTIF(c.user_pseudo_id IS NOT NULL) AS total_converted,
			COUNTIF(c.user_pseudo_id IS NULL) AS total_churned
		FROM trial_ended t
		LEFT JOIN converters c USING (user_pseudo_id)
	`;

	const [rows] = await client.query({ query, location: LOCATION });
	return rows[0];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
	console.log('=== Free Trial Ended Users ===');
	console.log(`Period: ${START_DATE} → ${END_DATE}`);

	const [users, daily, totals] = await Promise.all([
		fetchTrialEndedUsers(),
		fetchDailySummary(),
		fetchTotals(),
	]);

	// ── Daily breakdown ──
	console.log('\n── Daily Trial Endings ──────────────────────────────');
	console.log('Date         Trial Ended  Converted  Churned  Conv Rate');
	console.log('─────────────────────────────────────────────────────');
	for (const row of daily) {
		const convRate = pct(Number(row.converted), Number(row.trial_ended));
		console.log(
			`${row.trial_ended_date}   ${String(row.trial_ended).padStart(11)}  ${String(row.converted).padStart(9)}  ${String(row.churned).padStart(7)}  ${convRate.padStart(9)}`
		);
	}

	// ── Totals ──
	console.log('\n── Totals ───────────────────────────────────────────');
	console.log(`  Trial ended : ${totals.total_trial_ended}`);
	console.log(`  Converted   : ${totals.total_converted} (${pct(Number(totals.total_converted), Number(totals.total_trial_ended))})`);
	console.log(`  Churned     : ${totals.total_churned} (${pct(Number(totals.total_churned), Number(totals.total_trial_ended))})`);

	// ── Per-user list (churned only) ──
	const churned = users.filter(u => u.status === 'churned');
	console.log(`\n── Churned Users (${churned.length}) ─────────────────────────`);
	if (churned.length === 0) {
		console.log('  (none)');
	} else {
		console.log('user_pseudo_id                       trial_ended_date  paywall_hits');
		console.log('─────────────────────────────────────────────────────────────────');
		for (const u of churned) {
			console.log(`${u.user_pseudo_id.padEnd(36)} ${u.trial_ended_date}  ${u.paywall_hits}`);
		}
	}
}

main().catch(err => {
	console.error('\n✗ Query failed:', err.message);
	process.exit(1);
});
