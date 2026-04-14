// Conversion funnel — GA4 Data API version
//
// Full user journey from first open through subscription:
//   Step 1 — First Open           (first_open)
//   Step 2 — Onboarded            (GameFirstStart — fires once on first launch)
//   Step 3 — Profile Saved        (PlayerCreate)
//   Step 4 — Landed on Home       (screen_view unifiedScreenName=Home)
//   Step 5 — Assessment Started   (segmentStarted + customEvent:type=assessment)
//   Step 6 — Assessment Completed (assessmentCompleted)
//   Step 7 — PlayerReport Viewed  (screen_view unifiedScreenName=PlayerReport)
//   Step 8 — Subscription Opened  (SubscriptionOpened)
//   Step 9 — Plan Selected        (NOT INSTRUMENTED — BuyButtonTapped missing)
//
// Advantages over BigQuery:
//   - Has first_open, GameFirstStart, PlayerCreate, screen_view, SubscriptionOpened
//   - Authoritative user counts (not limited to BQ-exported events)
// Limitations vs BigQuery:
//   - customEvent:type dimension allows filtering segmentStarted by type=assessment
//   - Aggregated data, not row-level — no per-user sequences
//   - Data may be sampled for large properties
//
// Prerequisites:
//   source setup_credentials.sh
//
// Property: 441470574 (GD Math)

const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const PROPERTY   = 'properties/441470574';
const START_DATE = '2026-01-25';
const END_DATE   = '2026-03-25';

const client = new BetaAnalyticsDataClient();

// Version filter: all v4.3.x production versions
const VERSION_FILTER = {
	filter: {
		fieldName: 'appVersion',
		stringFilter: { value: 'v4.3.', matchType: 'BEGINS_WITH' },
	},
};

const STREAM_FILTER = {
	filter: {
		fieldName: 'streamName',
		stringFilter: { value: 'GD Math', matchType: 'EXACT' },
	},
};

const COMBINED_FILTER = {
	andGroup: {
		expressions: [STREAM_FILTER, VERSION_FILTER],
	},
};

function fmt(n) { return n.toLocaleString(); }
function pct(num, den) {
	if (!den) return '  —  ';
	return (100 * num / den).toFixed(1) + '%';
}

// Query unique users who triggered a specific event name
async function usersForEvent(eventName) {
	const [resp] = await client.runReport({
		property: PROPERTY,
		dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
		dimensionFilter: {
			andGroup: {
				expressions: [
					STREAM_FILTER,
					VERSION_FILTER,
					{
						filter: {
							fieldName: 'eventName',
							stringFilter: { value: eventName, matchType: 'EXACT' },
						},
					},
				],
			},
		},
		metrics: [{ name: 'totalUsers' }],
	});
	return parseInt(resp.rows?.[0]?.metricValues?.[0]?.value ?? '0');
}

// Query unique users who triggered segmentStarted with a specific type param
async function usersForSegmentType(type) {
	const [resp] = await client.runReport({
		property: PROPERTY,
		dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
		dimensionFilter: {
			andGroup: {
				expressions: [
					STREAM_FILTER,
					VERSION_FILTER,
					{
						filter: {
							fieldName: 'eventName',
							stringFilter: { value: 'segmentStarted', matchType: 'EXACT' },
						},
					},
					{
						filter: {
							fieldName: 'customEvent:type',
							stringFilter: { value: type, matchType: 'EXACT' },
						},
					},
				],
			},
		},
		metrics: [{ name: 'totalUsers' }],
	});
	return parseInt(resp.rows?.[0]?.metricValues?.[0]?.value ?? '0');
}

// Query unique users who visited a specific screen (via screen_view)
async function usersForScreen(screenName) {
	const [resp] = await client.runReport({
		property: PROPERTY,
		dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
		dimensionFilter: {
			andGroup: {
				expressions: [
					STREAM_FILTER,
					VERSION_FILTER,
					{
						filter: {
							fieldName: 'eventName',
							stringFilter: { value: 'screen_view', matchType: 'EXACT' },
						},
					},
					{
						filter: {
							fieldName: 'unifiedScreenName',
							stringFilter: { value: screenName, matchType: 'EXACT' },
						},
					},
				],
			},
		},
		metrics: [{ name: 'totalUsers' }],
	});
	return parseInt(resp.rows?.[0]?.metricValues?.[0]?.value ?? '0');
}

async function main() {
	console.log('GA4 Conversion Funnel');
	console.log(`Period: ${START_DATE} → ${END_DATE}  |  Versions: v4.3.x (production)`);
	console.log('─'.repeat(65));

	// Fetch all steps in parallel
	const [
		firstOpen,
		onboarded,
		profileSaved,
		homeScreen,
		segmentStarted,
		segmentStartedMain,
		assessmentCompleted,
		playerReportScreen,
		subscriptionOpened,
	] = await Promise.all([
		usersForEvent('first_open'),
		usersForEvent('GameFirstStart'),
		usersForEvent('PlayerCreate'),
		usersForScreen('Home'),
		usersForSegmentType('assessment'),
		usersForSegmentType('main'),
		usersForEvent('assessmentCompleted'),
		usersForScreen('PlayerReport'),
		usersForEvent('SubscriptionOpened'),
	]);

	const steps = [
		{ step: 1, label: 'First Open',           users: firstOpen,          note: '' },
		{ step: 2, label: 'Onboarded',            users: onboarded,          note: '' },
		{ step: 3, label: 'Profile Saved',         users: profileSaved,       note: '' },
		{ step: 4, label: 'Landed on Home',        users: homeScreen,         note: '(screen_view)' },
		{ step: 5,    label: 'Assessment Started',  users: segmentStarted,     note: '(segmentStarted type=assessment)' },
		{ step: '5b', label: 'Main Game Started',   users: segmentStartedMain, note: '(segmentStarted type=main)' },
		{ step: 6, label: 'Assessment Completed',  users: assessmentCompleted, note: '' },
		{ step: 7, label: 'PlayerReport Viewed',   users: playerReportScreen, note: '(screen_view)' },
		{ step: 8, label: 'Subscription Opened',   users: subscriptionOpened, note: '' },
		{ step: 9, label: 'Plan Selected',         users: null,               note: '(not instrumented)' },
	];

	console.log(
		'Step'.padEnd(5) +
		'Stage'.padEnd(28) +
		'Users'.padStart(7) +
		'  vs S1'.padStart(9) +
		'  vs Prev'.padStart(10) +
		'  Note'
	);
	console.log('─'.repeat(75));

	let prev = null;
	for (const s of steps) {
		const u = s.users;
		const vsFirst = u != null ? pct(u, firstOpen) : '  —  ';
		const vsPrev  = (u != null && prev != null) ? pct(u, prev) : '  —  ';
		console.log(
			`S${s.step}  `.padEnd(5) +
			s.label.padEnd(28) +
			(u != null ? fmt(u).padStart(7) : '    —  ') +
			vsFirst.padStart(9) +
			vsPrev.padStart(10) +
			(s.note ? '  ' + s.note : '')
		);
		if (u != null) prev = u;
	}

	console.log('─'.repeat(75));
	console.log('\nKey drop-offs:');
	if (firstOpen && onboarded)
		console.log(`  Install → Onboard:    ${fmt(firstOpen - onboarded)} users dropped (${pct(firstOpen - onboarded, firstOpen)} of installs)`);
	if (onboarded && profileSaved)
		console.log(`  Onboard → Profile:    ${fmt(onboarded - profileSaved)} users dropped (${pct(onboarded - profileSaved, onboarded)} of onboarded)`);
	if (profileSaved && homeScreen)
		console.log(`  Profile → Home:       ${fmt(profileSaved - homeScreen)} users dropped (${pct(profileSaved - homeScreen, profileSaved)} of profile-saved)`);
	if (homeScreen && segmentStarted)
		console.log(`  Home → Level:         ${fmt(homeScreen - segmentStarted)} users dropped (${pct(homeScreen - segmentStarted, homeScreen)} of home-reachers)`);
	if (segmentStarted && assessmentCompleted)
		console.log(`  Assessment Started → Completed: ${fmt(segmentStarted - assessmentCompleted)} dropped (${pct(segmentStarted - assessmentCompleted, segmentStarted)} of starters)`);
	console.log(`  Main Game Started (parallel path): ${fmt(segmentStartedMain)} users`);
	if (assessmentCompleted && subscriptionOpened)
		console.log(`  Assessment → Subscription: ${fmt(assessmentCompleted - subscriptionOpened)} dropped (${pct(assessmentCompleted - subscriptionOpened, assessmentCompleted)} of completers)`);
}

main().catch(console.error);
