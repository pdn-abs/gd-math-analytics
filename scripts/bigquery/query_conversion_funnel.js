// Conversion funnel — BigQuery query
//
// Full user journey from first open through subscription:
//   Step 1 — First Open         (first_open — Firebase auto event)
//   Step 2 — Onboarded          (GameFirstStart — custom, fires once)
//   Step 3 — Profile Saved      (PlayerCreate)
//   Step 4 — Landed on Home     (screen_view firebase_screen=Home)
//   Step 5 — Assessment Started (LevelData type=levelStarted list=assessment)
//   Step 6 — Assessment Completed (assessmentCompleted)
//   Step 7 — PlayerReport Viewed (screen_view firebase_screen=PlayerReport)
//   Step 8 — Subscription Opened (SubscriptionOpened)
//   Step 9 — Plan Selected      (NOT INSTRUMENTED — BuyButtonTapped missing)
//   Free trial exhausted        (TimeTaken type=screen screen=Level, sum >= 1800s)
//
// Dataset: analytics_441470574  (GA4 property: 441470574)
// Period:  20260125 → 20260325

const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const KEY_FILE   = path.resolve(__dirname, '../../keys/gd-math-71c48-7553a3a1322b.json');
const PROJECT_ID = 'gd-math-71c48';
const DATASET    = 'analytics_441470574';
const LOCATION   = 'asia-south1';
const START_DATE = '20260125';
const END_DATE   = '20260325';
const VERSIONS   = "'v4.3.0','v4.3.2','v4.3.5','v4.3.7','v4.3.12','v4.3.15','v4.3.19','v4.3.21'";

const client = new BigQuery({ projectId: PROJECT_ID, keyFilename: KEY_FILE });

function pct (num, den) {
	if (!den || den === 0) return '—';
	return (100 * num / den).toFixed(1) + '%';
}

function drop (prev, curr) {
	if (prev == null) return '—';
	return (prev - curr).toLocaleString();
}

// ─── 1. Funnel ───────────────────────────────────────────────────────────────

async function fetchFunnel () {
	console.log('\n[1/2] Running conversion funnel query...');

	const tbl = `\`${PROJECT_ID}.${DATASET}.events_*\``;
		const range = `_TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}' AND app_info.version IN (${VERSIONS})`;
	const param = (key, type = 'string_value') =>
		`(SELECT value.${type} FROM UNNEST(event_params) WHERE key = '${key}')`;

	const query = `
		WITH
		s1 AS (
			-- first_open not in BQ export; use user_first_touch_timestamp instead
			-- this field is set once per user on install and never changes
			-- filtered to production versions only
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl}
			WHERE ${range}
			  AND app_info.version IN (${VERSIONS})
			  AND DATE(TIMESTAMP_MICROS(user_first_touch_timestamp))
			      BETWEEN DATE('2026-01-25') AND DATE('2026-03-25')
		),
		s2 AS (
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl}
			WHERE ${range} AND event_name = 'GameFirstStart'
		),
		s3 AS (
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl}
			WHERE ${range} AND event_name = 'PlayerCreate'
		),
		s4 AS (
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl}
			WHERE ${range}
			  AND event_name = 'screen_view'
			  AND ${param('firebase_screen')} = 'Home'
		),
		s5 AS (
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl}
			WHERE ${range}
			  AND event_name = 'LevelData'
			  AND ${param('type')} = 'levelStarted'
			  AND ${param('list')} = 'assessment'
		),
		s6a AS (
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl}
			WHERE ${range} AND event_name = 'assessmentCompleted'
		),
		s6b AS (
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl}
			WHERE ${range}
			  AND event_name = 'screen_view'
			  AND ${param('firebase_screen')} = 'PlayerReport'
		),
		s7 AS (
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl}
			WHERE ${range} AND event_name = 'SubscriptionOpened'
		),
		funnel AS (
			SELECT 1 AS n, 'First Open'               AS step, users FROM s1
			UNION ALL SELECT 2, 'Onboarded',           users FROM s2
			UNION ALL SELECT 3, 'Profile Saved',       users FROM s3
			UNION ALL SELECT 4, 'Landed on Home',      users FROM s4
			UNION ALL SELECT 5, 'Assessment Started',  users FROM s5
			UNION ALL SELECT 6, 'Assessment Completed',users FROM s6a
			UNION ALL SELECT 7, 'PlayerReport Viewed', users FROM s6b
			UNION ALL SELECT 8, 'Subscription Opened', users FROM s7
			UNION ALL SELECT 9, 'Plan Selected',       0     AS users
		)
		SELECT n, step, users,
			LAG(users) OVER (ORDER BY n) - users          AS dropped,
			ROUND(
				SAFE_DIVIDE(LAG(users) OVER (ORDER BY n) - users,
							LAG(users) OVER (ORDER BY n)) * 100, 1
			) AS drop_pct
		FROM funnel
		ORDER BY n
	`;

	const [rows] = await client.query({ query, location: LOCATION });
	return rows;
}

// ─── 2. Available events: assessment funnel + segment engagement ──────────────

async function fetchAvailableData () {
	console.log('[2/2] Fetching available BigQuery event data...');

	const tbl = `\`${PROJECT_ID}.${DATASET}.events_*\``;
	const range = `_TABLE_SUFFIX BETWEEN '${START_DATE}' AND '${END_DATE}' AND app_info.version IN (${VERSIONS})`;
	const param = (k, t = 'string_value') =>
		`(SELECT value.${t} FROM UNNEST(event_params) WHERE key = '${k}')`;

	const [assessmentStarted, assessmentCompleted, mainGameStarted,
		segCompleted, segDropped, bySkillAge] = await Promise.all([

		client.query({ location: LOCATION, query: `
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl} WHERE ${range}
			  AND event_name = 'segmentStarted'
			  AND ${param('type')} = 'assessment'
		` }),

		client.query({ location: LOCATION, query: `
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl} WHERE ${range}
			  AND event_name = 'assessmentCompleted'
		` }),

		client.query({ location: LOCATION, query: `
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl} WHERE ${range}
			  AND event_name = 'segmentStarted'
			  AND ${param('type')} = 'main'
		` }),

		client.query({ location: LOCATION, query: `
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl} WHERE ${range} AND event_name = 'segmentCompleted'
		` }),

		client.query({ location: LOCATION, query: `
			SELECT COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl} WHERE ${range} AND event_name = 'segmentDropped'
		` }),

		client.query({ location: LOCATION, query: `
			SELECT ${param('currentSkillAge')} AS skill_age,
			  COUNT(DISTINCT user_pseudo_id) AS users
			FROM ${tbl} WHERE ${range}
			  AND event_name = 'segmentStarted'
			  AND ${param('type')} = 'assessment'
			GROUP BY 1 ORDER BY 2 DESC
		` }),
	]);

	return {
		assessmentStarted: Number(assessmentStarted[0][0].users),
		assessmentCompleted: Number(assessmentCompleted[0][0].users),
		mainGameStarted: Number(mainGameStarted[0][0].users),
		segCompleted: Number(segCompleted[0][0].users),
		segDropped: Number(segDropped[0][0].users),
		bySkillAge: bySkillAge[0],
	};
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
	console.log('=== GD Math — Conversion Funnel (BigQuery) ===');
	console.log(`Period: ${START_DATE} → ${END_DATE}\n`);

	const [funnelRows, available] = await Promise.all([
		fetchFunnel(),
		fetchAvailableData(),
	]);

	// ── Part 1: Requested funnel (what events are / aren't in BQ) ────────────
	console.log('PART 1 — Requested 9-Step Funnel');
	console.log('Note: Most events not exported to BigQuery — see status column.\n');

	const NOT_IN_BQ = '✗ not in BQ export';
	const NOT_INSTRUMENTED = '✗ not instrumented in code';
	const bqStatus = [
		'✓ user_first_touch_timestamp (proxy)',  // 1 first_open
		NOT_IN_BQ,          // 2 GameFirstStart
		NOT_IN_BQ,          // 3 PlayerCreate
		NOT_IN_BQ,          // 4 screen_view Home
		NOT_IN_BQ,          // 5 LevelData assessment
		'✓ assessmentCompleted',
		NOT_IN_BQ,          // 7 screen_view PlayerReport
		NOT_IN_BQ,          // 8 SubscriptionOpened
		NOT_INSTRUMENTED,   // 9 BuyButtonTapped
	];

	console.log('┌──────┬────────────────────────────┬────────────┬──────────────┬──────────┐');
	console.log('│ Step │ Name                       │     Users  │ Dropped      │ Drop %   │');
	console.log('├──────┼────────────────────────────┼────────────┼──────────────┼──────────┤');

	let prev = null;
	for (const row of funnelRows) {
		const users      = Number(row.users);
		const dropped    = prev != null ? prev - users : null;
		const dropPct    = prev != null && prev > 0
			? ((prev - users) / prev * 100).toFixed(1) + '%' : '—';
		const droppedStr = dropped != null ? dropped.toLocaleString() : '—';
		const status     = bqStatus[row.n - 1] || '';
		const label      = users === 0 && status.startsWith('✗')
			? `${row.step} [${status}]` : row.step;

		console.log(
			`│  ${String(row.n).padEnd(3)} │ ${label.padEnd(26)} │ ${String(users.toLocaleString()).padStart(10)} │ ${droppedStr.padStart(12)} │ ${dropPct.padStart(8)} │`
		);
		if (users > 0) prev = users;
	}
	console.log('└──────┴────────────────────────────┴────────────┴──────────────┴──────────┘');

	// ── Part 2: What IS measurable from BigQuery ─────────────────────────────
	const { assessmentStarted, assessmentCompleted, mainGameStarted,
		segCompleted, segDropped, bySkillAge } = available;

	const completionRate = assessmentStarted > 0
		? (assessmentCompleted / assessmentStarted * 100).toFixed(1) + '%' : '—';
	const mainGameRate = assessmentCompleted > 0
		? (mainGameStarted / assessmentCompleted * 100).toFixed(1) + '%' : '—';

	console.log('\nPART 2 — Available BigQuery Data (Jan 25 – Mar 25, 2026)\n');

	console.log('Assessment Funnel (measurable from BigQuery):');
	console.log('┌──────────────────────────────────────────┬────────┬─────────────────────────────────────┐');
	console.log('│ Metric                                   │  Users │ Notes                               │');
	console.log('├──────────────────────────────────────────┼────────┼─────────────────────────────────────┤');
	const rows2 = [
		['Assessment Started (proxy)',    assessmentStarted,  'segmentStarted type=assessment'],
		['Assessment Completed',          assessmentCompleted,'assessmentCompleted'],
		['  └─ Completion rate',          completionRate,     'of Assessment Started'],
		['Main Game Started (post-assess)',mainGameStarted,   'segmentStarted type=main'],
		['  └─ of Assessment Completers', mainGameRate,       'post-assessment main game access'],
		['Users with Segment Completed',  segCompleted,       'segmentCompleted (assessment + main)'],
		['Users with Segment Dropped',    segDropped,         'segmentDropped (assessment + main)'],
	];
	for (const [label, val, note] of rows2) {
		const valStr = typeof val === 'number' ? val.toLocaleString() : val;
		console.log(`│ ${label.padEnd(40)} │ ${String(valStr).padStart(6)} │ ${note.padEnd(35)} │`);
	}
	console.log('└──────────────────────────────────────────┴────────┴─────────────────────────────────────┘');

	console.log('\nAssessment Started by Skill Age:');
	console.log('┌────────────┬────────┬─────────────────────────┐');
	console.log('│ Skill Age  │  Users │ % of Assessment Starters│');
	console.log('├────────────┼────────┼─────────────────────────┤');
	for (const r of bySkillAge) {
		const p = (Number(r.users) / assessmentStarted * 100).toFixed(1) + '%';
		console.log(`│ ${String(r.skill_age || '—').padEnd(10)} │ ${String(Number(r.users)).padStart(6)} │ ${p.padStart(25)} │`);
	}
	console.log('└────────────┴────────┴─────────────────────────┘');

	console.log('\n⚠  Free trial exhausted: cannot calculate — TimeTaken event not in BigQuery export.');
	console.log('   Best proxy from GA4 exploration: SubscriptionOpened ≈ 88 users (Jan 9 – Apr 8 window).');
	console.log('   Add FreeTrialExpired event to Game.gd for exact count going forward.\n');
}

main().catch(err => {
	console.error('\nFatal error:', err.message);
	process.exit(1);
});
