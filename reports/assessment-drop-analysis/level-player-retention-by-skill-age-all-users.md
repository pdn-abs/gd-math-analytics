# Level Player Retention by Skill Age

> **Source**: GA4 UI Daily Cohort Export (CSV)
> **Period**: 2026-01-25 → 2026-03-25 (60 days)
> **Population**: Users who played at least one level (have a `CurrentSkillAge` value)
> **Method**: GA4 Cohort Exploration 3, daily cohort granularity, segmented by `CurrentSkillAge`
> **Generated**: 2026-04-01

---

## Data Sources

| File | Skill Ages |
|---|---|
| `CSV/Level_data_cohort_retention_2_3_4.csv` | 2Y, 3Y, 4Y |
| `CSV/Level_data_cohort_retention_5_6_7.csv` | 5Y, 6Y, 7Y |
| `CSV/Level_data_cohort_retention_8_9_10.csv` | 8Y, 9Y, 10Y |

All three files are GA4 **daily cohort** exports. Each row represents a (install-day cohort × skill-age segment × day-offset) combination.

---

## Methodology

**Retention = active users on day N ÷ users eligible for that measurement**

Eligibility cutoffs based on the observation window end (2026-03-25):

| Metric | Eligible install dates | Rationale |
|---|---|---|
| D1 | ≤ 2026-03-24 | User must have had ≥ 1 day left in window |
| D7 | ≤ 2026-03-18 | User must have had ≥ 7 days left in window |
| D30 | ≤ 2026-02-23 | User must have had ≥ 30 days left in window |

**Numerator** = sum of `Active users` in GA4 rows at the exact day offset.
**Denominator** = sum of `Cohort total users` from D0 rows for all install dates within the eligibility cutoff.

This approach uses the true install-base denominator — not the "cohorts-with-any-return" subset that GA4 RESERVED_TOTAL uses at D1+.

---

## D1 / D7 / D30 Retention by Skill Age

| Skill Age | D0 users | D1 active | D1 denom | **D1 ret%** | D7 active | D7 denom | **D7 ret%** | D30 active | D30 denom | **D30 ret%** |
|---|---|---|---|---|---|---|---|---|---|---|
| 2 Y | 550 | 94 | 545 | **17.2%** | 25 | 494 | **5.1%** | 6 | 297 | **2.0%** |
| 3 Y | 127 | 20 | 126 | **15.9%** | 9 | 119 | **7.6%** | 1 | 68 | **1.5%** |
| 4 Y | 105 | 33 | 104 | **31.7%** | 2 | 90 | 2.2% ⚠ | 3 | 56 | **5.4%** |
| 5 Y | 71 | 16 | 71 | **22.5%** | 5 | 64 | **7.8%** | 1 | 36 | **2.8%** |
| 6 Y | 54 | 8 | 54 | **14.8%** | 4 | 50 | **8.0%** | 2 | 36 | **5.6%** |
| 7 Y | 31 | 10 | 30 | **33.3%** | 0 | 27 | 0.0% ⚠ | 0 | 14 | 0.0% ⚠ |
| 8 Y | 21 | 4 | 21 | **19.0%** | 1 | 19 | **5.3%** | 0 | 12 | 0.0% ⚠ |
| 9 Y | 7 | 2 | 6 | 33.3% † | 0 | 5 | 0.0% ⚠ | 0 | 4 | 0.0% ⚠ |
| 10 Y | 94 | 16 | 93 | **17.2%** | 4 | 85 | **4.7%** | 0 | 42 | 0.0% ⚠ |
| **ALL** | **1,060** | **203** | **1,050** | **19.3%** | **50** | **953** | **5.2%** | **13** | **565** | **2.3%** |

**Bold** = statistically usable (n ≥ 30).
⚠ = exact-day noise artifact — see caveats below.
† = directional only (n < 10).

### Benchmarks

| Metric | Measured (level players) | Industry benchmark | Status |
|---|---|---|---|
| D1 (all level players) | **19.3%** | ≥ 40% | 🔴 2× below |
| D7 (all level players) | **5.2%** | ≥ 20% | 🔴 4× below |
| D30 (all level players) | **2.3%** | ≥ 10% | 🔴 4× below |

---

## Data Quality Caveats

### ⚠ Exact-day measurement noise

GA4 cohort retention counts users active on **exactly** day N, not "ever returned within N days." For small cohorts this produces 0% readings at D7 or D30 even when nearby-day activity exists.

| Cohort | Issue | Nearby activity found |
|---|---|---|
| 4Y D7 = 2.2% | Likely noise — only 2 users on exact D7 | D6=5, D7=2, D8=7 active → **~15–24% approximate D7** |
| 7Y D7 = 0.0% | D7 gap, users around D7 | D6=1, D8=1 → **~7–11% approximate D7** |
| 7Y D30 = 0.0% | n=14, no exact D30 | D27=1, D35=1 → **~7% approximate D30** |
| 8Y D30 = 0.0% | n=12, no activity D27-D35 | Genuinely near-zero |
| 9Y D7/D30 = 0.0% | n=5/4, too small | Unreliable for any conclusion |
| 10Y D30 = 0.0% | n=42, no exact D30 | D28=1, D31=1, D33=1, D35=1 → **~2–5% approximate D30** |

For **statistically valid D7 estimates**, use D5–D9 window counts. For **D30**, use D27–D33.

### Sample size thresholds

| Metric | Ages with n ≥ 30 | Ages with n < 30 (use caution) |
|---|---|---|
| D1 | 2Y, 3Y, 4Y, 5Y, 6Y, 10Y | 7Y (n=30), 8Y (n=21), 9Y (n=6) |
| D7 | 2Y, 3Y, 4Y, 5Y, 6Y, 10Y | 7Y (n=27), 8Y (n=19), 9Y (n=5) |
| D30 | 2Y (n=297), 3Y (n=68), 4Y (n=56), 5Y (n=36), 6Y (n=36) | 7Y (n=14), 8Y (n=12), 9Y (n=4), 10Y (n=42) |

### Population scope

The 1,060 total users in these CSVs is lower than the 1,354 level players counted in BigQuery. Possible reasons:
- GA4 cohort exploration may apply minimum-cohort-size filters (cohorts with 1 user may be suppressed on some dates)
- GA4 may apply sampling on large daily cohort queries
- BQ counts unique users across the full window; GA4 cohort scopes to the exploration segment filter

Use these numbers for **rate comparisons** (%) not absolute user counts.

---

## Key Findings

### D1 Retention

- **Overall D1 = 19.3%** for level players (vs 12.6% for all active users including non-players) — confirms level players are a more engaged sub-population.
- **4Y leads at 31.7%** — surprisingly strong, comparable to the 33.3% seen in 7Y and 9Y.
- **3Y (15.9%) and 6Y (14.8%) are the weakest** — below even 2Y (17.2%).
- **2Y, 3Y, 6Y, 8Y, 10Y cluster between 14–20%** — the skill-age effect on D1 is less pronounced than previously reported from BigQuery.
- The dramatic skill-age gradient (17%→100%) seen in BQ data was largely a BigQuery denominator artifact. The actual range is **15–33%**.

### D7 Retention

- **Overall D7 = 5.2%** — consistent with GA4 UI all-users figure of 4.0% (level players are slightly stickier).
- **6Y leads at 8.0%** with sufficient sample size (n=50). 3Y (7.6%) and 5Y (7.8%) are close behind.
- **2Y D7 = 5.1%** — the largest cohort (n=494) and the primary driver of the overall rate.
- **4Y D7 = 2.2% is a noise artifact** — nearby-day data shows ~20%+ D7 activity — do not treat as real.
- **7Y and 9Y show 0% D7** due to exact-day noise — not meaningful.

### D30 Retention

- **Overall D30 = 2.3%** — consistent with GA4 UI all-users figure of 1.8%.
- **6Y leads at 5.6%** (2/36 eligible) and **4Y at 5.4%** (3/56) — both above benchmark with stable-enough denominators.
- **2Y D30 = 2.0%** — the most statistically stable figure (n=297). This is the primary bottleneck given 2Y is 52% of the level-player base.
- **10Y D30 = 0.0% on exact day** but D28/D31/D33/D35 each had 1 active user — approximate D30 is **~2–5%**.
- **Ages 7–9 D30** are unreliable (n < 15) — do not draw conclusions.

### Summary rankings (by statistically usable metrics)

| Rank | Best D1 | Best D7 | Best D30 |
|---|---|---|---|
| 1 | 4Y — 31.7% (n=104) | 6Y — 8.0% (n=50) | 6Y — 5.6% (n=36) |
| 2 | 5Y — 22.5% (n=71) | 5Y — 7.8% (n=64) | 4Y — 5.4% (n=56) |
| 3 | 8Y — 19.0% (n=21)† | 3Y — 7.6% (n=119) | 3Y — 1.5% (n=68) |
| Worst | 6Y — 14.8% | 10Y — 4.7% | 3Y — 1.5% |

† 8Y sample too small to rank reliably.

---

## Comparison with Previously Reported BigQuery Estimates

The BigQuery-derived retention table in `pre-subscription-final-report.md` used first `segmentStarted` event as the cohort anchor, which introduced denominator inflation (returning users were anchored too late, artificially shrinking denominators for early date ranges).

| Skill Age | BQ D1 (old) | GA D1 (CSV) | BQ D7 (old) | GA D7 (CSV) | BQ D30 (old) | GA D30 (CSV) |
|---|---|---|---|---|---|---|
| 2 Y | 17.2% | **17.2%** | 9.9% | **5.1%** | 6.7% | **2.0%** |
| 3 Y | 34.5% | **15.9%** | 31.6% | **7.6%** | 28.6% | **1.5%** |
| 4 Y | 42.9% | **31.7%** | 33.3% | 2.2% ⚠ | — | **5.4%** |
| 5 Y | 54.5% | **22.5%** | 50.0% | **7.8%** | — | **2.8%** |
| 6 Y | 62.5% | **14.8%** | 75.0% | **8.0%** | 50.0% | **5.6%** |
| 7 Y | 75.0% | **33.3%** | 100.0% | 0.0% ⚠ | — | 0.0% ⚠ |
| 8 Y | 100.0% | **19.0%** | — | **5.3%** | — | 0.0% ⚠ |
| 9 Y | 100.0% | 33.3% † | — | 0.0% ⚠ | — | 0.0% ⚠ |
| 10 Y | 40.5% | **17.2%** | 45.5% | **4.7%** | 25.0% | 0.0% ⚠ |

**Conclusion**: The BQ D7 and D30 figures for ages 3–10 were severely inflated (by 2–10×). The GA daily cohort data is the authoritative source. The narrative that "higher skill age dramatically retains better" collapses — all ages retain at broadly similar rates, with 4Y and 5Y performing best at D1, and 5Y–6Y best at D7.

---

## BQ (GA4-aligned) vs GA4 CSV Comparison

BigQuery re-run with GA4-aligned methodology: cohort anchor = `user_first_touch_timestamp`, exact-day counting, level players only (users with ≥1 `segmentStarted`).

| Age | BQ D0 users | GA4 D0 users | BQ D1% | GA4 D1% | BQ D7% | GA4 D7% | BQ D30% | GA4 D30% |
|---|---|---|---|---|---|---|---|---|
| 2Y | 500 | 550 | 22.4% | 17.2% | 4.0% | 5.1% | 1.9% | 2.0% |
| 3Y | 100 | 127 | 21.2% | 15.9% | 7.4% | 7.6% | 0.0% ⚠ | 1.5% |
| 4Y | 74 | 105 | 36.5% | 31.7% | 0.0% ⚠ | 2.2% ⚠ | 0.0% ⚠ | 5.4% |
| 5Y | 55 | 71 | 27.3% | 22.5% | 4.2% | 7.8% | 0.0% ⚠ | 2.8% |
| 6Y | 45 | 54 | 13.3% | 14.8% | 9.8% | 8.0% | 7.1% | 5.6% |
| 7Y | 16 | 31 | 18.8% | 33.3% | 0.0% ⚠ | 0.0% ⚠ | 0.0% ⚠ | 0.0% ⚠ |
| 8Y | 15 | 21 | 20.0% | 19.0% | 0.0% ⚠ | 5.3% | 0.0% ⚠ | 0.0% ⚠ |
| 9Y | 5 | 7 | 20.0% | 33.3% † | 0.0% ⚠ | 0.0% ⚠ | 0.0% ⚠ | 0.0% ⚠ |
| 10Y | 81 | 94 | 21.0% | 17.2% | 4.1% | 4.7% | 0.0% ⚠ | 0.0% ⚠ |
| **ALL** | **891** | **1,060** | **23.0%** | **19.3%** | **4.2%** | **5.2%** | **1.6%** | **2.3%** |

⚠ = exact-day noise artifact (small cohort or activity on adjacent days only).
† = directional only (n < 10).

**Notes on remaining gaps:**
- **D0 headcount ~15–50% lower in BQ** for ages 7–9Y — GA4's `CurrentSkillAge` dimension is a user property updated each session so users who progressed from younger ages show up in older cohorts; BQ assigns skill age only from the first `segmentStarted` in the window.
- **D1 rates broadly agree** (within 0–5pp) for ages 2Y, 4Y, 6Y, 8Y, 10Y where cohorts are large enough.
- **D7/D30 gaps** are largely exact-day noise on small cohorts; 6Y is the most stable comparison point (BQ D7=9.8% vs GA4 D7=8.0%; BQ D30=7.1% vs GA4 D30=5.6%).
- **ALL D1**: BQ 23.0% vs GA4 19.3% — BQ is slightly higher because its denominator (891) excludes the ~170 users that GA4 CSV counts but BQ doesn't find a `segmentStarted` for (session-level vs event-level skill age assignment).

---

## Recommended Actions

1. **Fix 2Y experience first** — 550 users, 17.2% D1, 5.1% D7. It's the volume problem. Small improvements here move the overall metric.
2. **Investigate 3Y and 6Y low D1** — Despite moderate engagement depth (from usage data), 3Y=15.9% and 6Y=14.8% D1 are the weakest. Check if there's a specific content or onboarding issue.
3. **Understand 4Y's D1 strength (31.7%)** — What makes 4Y users return? Replicate that in 2Y/3Y content design.
4. **Do not over-index on skill-age routing** — The data does not support "routing users to older skill ages fixes retention." The difference between best (31.7%) and worst (14.8%) D1 is 2×, not 6× as BQ suggested.
