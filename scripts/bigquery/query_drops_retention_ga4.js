// D1 / D7 / D30 retention split by pre-drops vs post-drops app versions.
// Pre-drops:  v4.3.0, v4.3.2, v4.3.7
// Post-drops: v4.3.12, v4.3.15, v4.3.19
//
// Uses GA4 API runReport (BQ export only starts Jan 25 2026;
// pre-drops users were acquired Oct–Dec 2025 — BQ can't reach them).
//
// Method: query (firstSessionDate × date) × activeUsers for each version group.
// Then for each cohort day, compute daysOffset = date - firstSessionDate and
// bucket into D1 / D7 / D30. Only users whose firstSessionDate is at least X
// days before the data end (Mar 11, 2026) are counted in the DX denominator.
const {BetaAnalyticsDataClient} = require('@google-analytics/data');

const PROPERTY = 'properties/441470574';
const WINDOW = {startDate: '2025-10-20', endDate: '2026-03-11'};
const DATA_END = new Date('2026-03-11');

const PRE_DROPS  = ['v4.3.0', 'v4.3.2', 'v4.3.7'];
const POST_DROPS = ['v4.3.12', 'v4.3.15', 'v4.3.19'];

function versionFilter(versions) {
	return {
		orGroup: {
			expressions: versions.map(v => ({
				filter: {
					fieldName: 'appVersion',
					stringFilter: {value: v, matchType: 'EXACT'},
				},
			})),
		},
	};
}

function parseDate(yyyymmdd) {
	const s = String(yyyymmdd);
	return new Date(s.slice(0, 4), s.slice(4, 6) - 1, s.slice(6, 8));
}

function daysBetween(a, b) {
	return Math.round((b - a) / 86400000);
}

async function getRetention(client, versions) {
	const [resp] = await client.runReport({
		property: PROPERTY,
		dateRanges: [WINDOW],
		dimensions: [
			{name: 'firstSessionDate'},
			{name: 'date'},
		],
		metrics: [{name: 'activeUsers'}],
		dimensionFilter: versionFilter(versions),
		limit: 50000,
	});

	// cohortMap[firstSessionDate] = { d0, d1, d7, d30 } user counts
	const cm = {};
	for (const row of (resp.rows || [])) {
		const firstStr = row.dimensionValues[0].value; // YYYYMMDD
		const actStr   = row.dimensionValues[1].value; // YYYYMMDD
		const users    = parseInt(row.metricValues[0].value, 10);

		const first = parseDate(firstStr);
		const act   = parseDate(actStr);
		const offset = daysBetween(first, act);

		if (!cm[firstStr]) cm[firstStr] = {d0: 0, d1: 0, d7: 0, d30: 0, firstDate: first};
		if (offset === 0)  cm[firstStr].d0  += users;
		if (offset === 1)  cm[firstStr].d1  += users;
		if (offset === 7)  cm[firstStr].d7  += users;
		if (offset === 30) cm[firstStr].d30 += users;
	}

	// Aggregate with eligibility gates
	let d0 = 0, d1E = 0, d1R = 0, d7E = 0, d7R = 0, d30E = 0, d30R = 0;
	for (const c of Object.values(cm)) {
		const gap = daysBetween(c.firstDate, DATA_END);
		d0 += c.d0;
		if (gap >= 1)  { d1E  += c.d0; d1R  += c.d1;  }
		if (gap >= 7)  { d7E  += c.d0; d7R  += c.d7;  }
		if (gap >= 30) { d30E += c.d0; d30R += c.d30; }
	}
	return {d0, d1E, d1R, d7E, d7R, d30E, d30R};
}

function pct(a, b) {
	if (!b) return '—';
	return (a / b * 100).toFixed(1) + '%';
}

function delta(pre, post) {
	if (pre === '—' || post === '—') return '—';
	const d = parseFloat(post) - parseFloat(pre);
	return (d >= 0 ? '+' : '') + d.toFixed(1) + 'pp';
}

(async () => {
	const client = new BetaAnalyticsDataClient();
	console.log('Querying GA4 retention for pre-drops and post-drops…\n');

	const [pre, post] = await Promise.all([
		getRetention(client, PRE_DROPS),
		getRetention(client, POST_DROPS),
	]);

	const pad  = (s, n) => String(s).padStart(n);
	const padL = (s, n) => String(s).padEnd(n);

	const preD1  = pct(pre.d1R,  pre.d1E);
	const postD1 = pct(post.d1R, post.d1E);
	const preD7  = pct(pre.d7R,  pre.d7E);
	const postD7 = pct(post.d7R, post.d7E);
	const preD30 = pct(pre.d30R, pre.d30E);
	const postD30 = pct(post.d30R, post.d30E);

	console.log('━━━ D1 / D7 / D30 Retention: Pre-Drops vs Post-Drops ━━━\n');
	console.log(
		padL('Group', 14),
		pad('Total', 7),
		pad('D1-base', 9), pad('D1-ret', 8), pad('D1%', 7),
		pad('D7-base', 9), pad('D7-ret', 8), pad('D7%', 7),
		pad('D30-base', 10), pad('D30-ret', 9), pad('D30%', 7),
	);
	console.log('─'.repeat(105));

	for (const [label, g, d1, d7, d30] of [
		['pre_drops',  pre,  preD1,  preD7,  preD30],
		['post_drops', post, postD1, postD7, postD30],
	]) {
		console.log(
			padL(label, 14),
			pad(g.d0,   7),
			pad(g.d1E,  9), pad(g.d1R,  8), pad(d1,  7),
			pad(g.d7E,  9), pad(g.d7R,  8), pad(d7,  7),
			pad(g.d30E, 10), pad(g.d30R, 9), pad(d30, 7),
		);
	}

	console.log('─'.repeat(105));
	console.log(
		padL('Δ (post−pre)', 14),
		pad('', 7),
		pad('', 9), pad('', 8), pad(delta(preD1,  postD1),  7),
		pad('', 9), pad('', 8), pad(delta(preD7,  postD7),  7),
		pad('', 10), pad('', 9), pad(delta(preD30, postD30), 7),
	);

	console.log('\nNote: base = users whose first session was ≥X days before data end (Mar 11 2026).');
})();
