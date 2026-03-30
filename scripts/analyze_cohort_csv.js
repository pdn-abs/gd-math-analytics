// Cohort retention analysis from level_played_users_retention_cohort.csv
// Format: daily cohorts (YYYYMMDD), day-level offsets (D0–D119)
// Pre-drops boundary: cohort date <= 2025-11-19
// Post-drops boundary: cohort date >= 2025-11-20 (through 2026-03-10)
const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'CSV', 'level_played_users_retention_cohort.csv');
const PRE_DROPS_END = '20251119'; // inclusive last day of pre-drops

// ── Parse CSV ────────────────────────────────────────────────────────────────
// Columns: Daily cohort offset, Cohort (YYYYMMDD), RESERVED_TOTAL|date_range_0, total, active, rate
const lines = fs.readFileSync(CSV_PATH, 'utf8')
	.split('\n')
	.filter(l => l.trim() && !l.startsWith('#'));

// cohorts[YYYYMMDD] = { total, days: { 0: activeUsers, 1: ..., ... } }
const cohorts = {};

for (const line of lines) {
	const parts = line.trim().split(',');
	if (parts.length < 5) continue;
	const [dayOffsetStr, cohortDate, cohortType, cohortTotal, activeUsers] = parts;
	if (cohortType !== 'RESERVED_TOTAL') continue;   // skip date_range_0 duplicate rows
	if (cohortDate === 'RESERVED_TOTAL') continue;   // skip grand-total row
	if (!/^\d{8}$/.test(cohortDate)) continue;       // skip header/non-date rows

	const day = parseInt(dayOffsetStr, 10);
	const total = parseInt(cohortTotal, 10);
	const active = parseInt(activeUsers, 10);

	if (!cohorts[cohortDate]) cohorts[cohortDate] = {total: 0, days: {}};
	if (day === 0) cohorts[cohortDate].total = total;
	cohorts[cohortDate].days[day] = active;
}

// ── Classify cohorts ─────────────────────────────────────────────────────────
const PRE = [], POST = [], ALL = [];
for (const [date, data] of Object.entries(cohorts)) {
	const entry = {date, ...data};
	ALL.push(entry);
	if (date <= PRE_DROPS_END) PRE.push(entry);
	else POST.push(entry);
}
ALL.sort((a, b) => a.date.localeCompare(b.date));
PRE.sort((a, b) => a.date.localeCompare(b.date));
POST.sort((a, b) => a.date.localeCompare(b.date));

// ── Weighted-average retention at a given day offset ─────────────────────────
function weightedRetention(cohortList, dayOffset) {
	let totalUsers = 0, totalActive = 0;
	for (const c of cohortList) {
		if (c.days[dayOffset] !== undefined && c.total > 0) {
			totalUsers += c.total;
			totalActive += c.days[dayOffset];
		}
	}
	if (!totalUsers) return {pct: null, base: 0, returned: 0};
	return {pct: totalActive / totalUsers * 100, base: totalUsers, returned: totalActive};
}

const pct  = (v) => v === null ? '—' : v.toFixed(1) + '%';
const pad  = (s, n) => String(s).padStart(n);
const padL = (s, n) => String(s).padEnd(n);

// Aggregate cohorts into weekly buckets for reporting
// (group daily cohorts by acquisition week, sum totals + active per day offset)
function aggregateByWeek(cohortList) {
	const weekBuckets = {}; // 'YYYY-WNN' → { weekStart, total, days:{} }
	for (const c of cohortList) {
		// ISO week: derive week start (Monday)
		const d = new Date(
			parseInt(c.date.slice(0, 4)),
			parseInt(c.date.slice(4, 6)) - 1,
			parseInt(c.date.slice(6, 8)),
		);
		const dow = (d.getDay() + 6) % 7; // Mon=0
		const mon = new Date(d); mon.setDate(d.getDate() - dow);
		const key = mon.toISOString().slice(0, 10);
		if (!weekBuckets[key]) weekBuckets[key] = {weekStart: key, total: 0, days: {}};
		const bkt = weekBuckets[key];
		bkt.total += c.total;
		for (const [dayStr, active] of Object.entries(c.days)) {
			const d2 = parseInt(dayStr);
			bkt.days[d2] = (bkt.days[d2] || 0) + active;
		}
	}
	return Object.values(weekBuckets).sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

// ── TABLE 1 — Weekly buckets with D7/D14/D28/D56 retention ──────────────────
// Report on weekly aggregates using day offsets D7, D14, D28, D56
const D_CHECKPOINTS = [7, 14, 28, 56];

function weeklyRetentionTable(label, cohortList) {
	const weeks = aggregateByWeek(cohortList);
	console.log('\n' + '━'.repeat(72));
	console.log('  ' + label);
	console.log('━'.repeat(72) + '\n');
	console.log(
		padL('Week of', 14),
		pad('D0 Users', 10),
		pad('D7%', 8),
		pad('D14%', 8),
		pad('D28%', 8),
		pad('D56%', 8),
	);
	console.log('─'.repeat(60));
	for (const w of weeks) {
		const r = (d) => w.days[d] !== undefined ? (w.days[d] / w.total * 100).toFixed(1) + '%' : '—';
		console.log(
			padL(w.weekStart, 14),
			pad(w.total, 10),
			pad(r(7), 8),
			pad(r(14), 8),
			pad(r(28), 8),
			pad(r(56), 8),
		);
	}
	const totUsers = weeks.reduce((s, w) => s + w.total, 0);
	console.log('─'.repeat(60));
	const avg = (d) => {
		let tu = 0, ta = 0;
		for (const w of weeks) {
			if (w.days[d] !== undefined) { tu += w.total; ta += w.days[d]; }
		}
		return tu ? (ta / tu * 100).toFixed(1) + '%' : '—';
	};
	console.log(
		padL('WEIGHTED AVG', 14),
		pad(totUsers, 10),
		pad(avg(7), 8),
		pad(avg(14), 8),
		pad(avg(28), 8),
		pad(avg(56), 8),
	);
}

weeklyRetentionTable('TABLE 1 — Pre-Drops Weekly Cohorts (Jul 20 – Nov 19, 2025)', PRE);
weeklyRetentionTable('TABLE 2 — Post-Drops Weekly Cohorts (Nov 20, 2025 – Mar 10, 2026)', POST);

// ── TABLE 3 — Pre vs Post comparison at key day offsets ──────────────────────
console.log('\n' + '━'.repeat(72));
console.log('  TABLE 3 — Weighted Average Retention: Pre vs Post Drops');
console.log('━'.repeat(72) + '\n');
console.log(padL('Day', 8), padL('All Users', 20), padL('Pre-Drops', 18), padL('Post-Drops', 18), 'Δ (post−pre)');
console.log('─'.repeat(72));
for (const d of [1, 3, 7, 14, 21, 28, 56, 84]) {
	const all  = weightedRetention(ALL,  d);
	const pre  = weightedRetention(PRE,  d);
	const post = weightedRetention(POST, d);
	const delta = (pre.pct !== null && post.pct !== null)
		? ((post.pct - pre.pct) >= 0 ? '+' : '') + (post.pct - pre.pct).toFixed(1) + 'pp'
		: '—';
	console.log(
		padL('D' + d, 8),
		padL(pct(all.pct) + ` (n=${all.base})`, 20),
		padL(pct(pre.pct), 18),
		padL(pct(post.pct), 18),
		delta,
	);
}

// Totals
const preTotal  = PRE.reduce((s, c) => s + c.total, 0);
const postTotal = POST.reduce((s, c) => s + c.total, 0);
const allTotal  = ALL.reduce((s, c) => s + c.total, 0);
console.log('\n  Pre-drops:  ' + PRE.length + ' daily cohorts, ' + preTotal.toLocaleString() + ' users');
console.log('  Post-drops: ' + POST.length + ' daily cohorts, ' + postTotal.toLocaleString() + ' users');
console.log('  Total:      ' + ALL.length + ' daily cohorts, ' + allTotal.toLocaleString() + ' users');

// ── TABLE 4 — Full daily retention curve D0–D119 (weighted avg, ALL) ─────────
console.log('\n' + '━'.repeat(72));
console.log('  TABLE 4 — Full Retention Curve D0–D119 (weighted avg, ALL cohorts)');
console.log('━'.repeat(72) + '\n');
console.log(padL('Day', 6), pad('All', 10), pad('Pre', 10), pad('Post', 10));
console.log('─'.repeat(40));
for (const d of [0,1,2,3,4,5,6,7,10,14,21,28,35,42,49,56,63,70,77,84,91,98,105,112,119]) {
	const all  = weightedRetention(ALL,  d);
	const pre  = weightedRetention(PRE,  d);
	const post = weightedRetention(POST, d);
	console.log(
		padL('D' + d, 6),
		pad(pct(all.pct),  10),
		pad(pct(pre.pct),  10),
		pad(pct(post.pct), 10),
	);
}
