const {BigQuery} = require('@google-cloud/bigquery');
const path = require('path');
const bq = new BigQuery({
	projectId: 'gd-math-71c48',
	keyFilename: path.join(__dirname, '..', 'keys', 'gd-math-71c48-7553a3a1322b.json'),
	location: 'asia-south1'
});

// Top levels by formal Fail% only (min 10 starts), broken by skill age
const q = `
WITH base AS (
	SELECT
		user_pseudo_id,
		event_name,
		event_timestamp,
		MAX(IF(p.key='currentSkillAge', p.value.string_value, NULL)) AS skill_age,
		MAX(IF(p.key='level',           p.value.string_value, NULL)) AS level,
		MAX(IF(p.key='branch',          p.value.string_value, NULL)) AS branch,
		MAX(IF(p.key='status',          p.value.string_value, NULL)) AS status,
		MAX(IF(p.key='wrongMoves',      p.value.int_value,    NULL)) AS wrong_moves,
		MAX(IF(p.key='attempt',         p.value.int_value,    NULL)) AS attempt
	FROM \`gd-math-71c48.analytics_441470574.events_*\`,
	     UNNEST(event_params) AS p
	WHERE _TABLE_SUFFIX BETWEEN '20260125' AND '20260325'
	  AND event_name IN ('segmentStarted','segmentCompleted')
	GROUP BY user_pseudo_id, event_name, event_timestamp
),
agg AS (
	SELECT
		skill_age,
		level,
		branch,
		COUNT(CASE WHEN event_name='segmentStarted'                     THEN 1 END) AS started,
		COUNT(CASE WHEN event_name='segmentCompleted' AND status='pass' THEN 1 END) AS passed,
		COUNT(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN 1 END) AS failed,
		COUNT(DISTINCT CASE WHEN event_name='segmentCompleted' AND status='fail' THEN user_pseudo_id END) AS users_with_fail,
		ROUND(AVG(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN wrong_moves END), 1) AS avg_wrong_on_fail,
		ROUND(AVG(CASE WHEN event_name='segmentCompleted' AND status='fail' THEN attempt    END), 1) AS avg_attempt_on_fail,
		ROUND(AVG(CASE WHEN event_name='segmentCompleted' AND status='pass' THEN wrong_moves END), 1) AS avg_wrong_on_pass
	FROM base
	WHERE skill_age IS NOT NULL AND level IS NOT NULL
	GROUP BY skill_age, level, branch
),
ranked AS (
	SELECT *,
		ROUND(100.0 * failed / NULLIF(started, 0), 1) AS fail_pct,
		ROW_NUMBER() OVER (
			PARTITION BY skill_age
			ORDER BY (100.0 * failed / NULLIF(started, 0)) DESC, started DESC
		) AS rn
	FROM agg
	WHERE started >= 10 AND failed > 0
)
SELECT
	skill_age, level, branch, started, passed, failed, users_with_fail,
	fail_pct, avg_wrong_on_fail, avg_attempt_on_fail, avg_wrong_on_pass
FROM ranked
WHERE rn <= 10
ORDER BY
	CAST(REGEXP_EXTRACT(skill_age, r'^([0-9]+)') AS INT64),
	fail_pct DESC
`;

(async () => {
	const [rows] = await bq.query({query: q, location: 'asia-south1'});
	let curAge = null;
	for (const r of rows) {
		if (r.skill_age !== curAge) {
			curAge = r.skill_age;
			console.log(`\n── ${curAge} ──`);
			console.log('Level | Branch | Started | Pass | Fail | Users | Fail% | AvgWrong(F) | AvgAttempt(F) | AvgWrong(P)');
		}
		console.log(
			`${r.level} | ${r.branch} | ${r.started} | ${r.passed} | ${r.failed} | ` +
			`${r.users_with_fail} | ${r.fail_pct}% | ${r.avg_wrong_on_fail ?? '-'} | ` +
			`${r.avg_attempt_on_fail ?? '-'} | ${r.avg_wrong_on_pass ?? '-'}`
		);
	}
})();
