# Retention by Skill Age — Production Cohorts
**Period**: Jan 25 – Mar 25, 2026
**Source**: GA4 cohort export (Production track only — builds 65, 68, 72; skill ages 2–10)
**Updated**: Apr 6, 2026 — corrected CSVs

---

## D0 / D1 / D7 / D30 Retention — Production vs All Users

> **P** = Production only (builds 65, 68, 72) · **A** = All users (includes internal testing builds 71/73)
> ⚠ n < 10 — rate unreliable · — cohort too small or window too short

### Cohort Sizes — Returners / D0 (normalised)

> Each cell = **active returners on day N / D0 install base** for that track · ⚠ D0 < 10 · — window too short
> Both P and A use D0 as denominator — directly comparable across tracks.

| SA  | P D0 | A D0 | P D1 | A D1 | P D7 | A D7 | P D30 | A D30 |
|:---:|-----:|-----:|-----:|-----:|-----:|-----:|------:|------:|
| 2Y  | 336  | 550  | 51   | 94   | 8    | 25   | 5     | 6     |
| 3Y  | 81   | 127  | 14   | 20   | 5    | 9    | 1     | 1     |
| 4Y  | 66   | 105  | 14   | 33   | 1    | 2    | 2     | 3     |
| 5Y  | 41   | 71   | 6    | 16   | 2    | 5    | —     | 1     |
| 6Y  | 27   | 54   | 5    | 8    | 4    | 4    | —     | 2     |
| 7Y  | 18   | 31   | 2    | 10   | —    | 0    | —     | 0     |
| 8Y  | 12   | 21   | 2    | 4    | 1    | 1    | —     | 0     |
| 9Y  | 4 ⚠  | 7    | 2 ⚠  | 2    | —    | 0    | —     | 0     |
| 10Y | 90   | 94   | 7    | 16   | 1    | 4    | —     | 0     |

### Retention Rates (%) — Normalised to D0

> **Formula**: active returners on day N ÷ D0 install base · same denominator for both P and A.
>
> **Bold** (e.g. **17.1%**) — D0 ≥ 30 for that track. With at least 30 installs, a rate of ~15% means ≥4–5 returners, which is enough to distinguish a real signal from random day-to-day noise. Figures can be used for directional decisions and cross-skill-age comparisons.
>
> **⚠** (e.g. `50.0% ⚠`) — D0 < 10 for that track. The entire cohort is fewer than 10 people. A single person returning or not shifts the rate by 10–25 percentage points. These figures must be discarded for any analytical purpose.
>
> **†** (e.g. `28.6% †`) — D0 is between 10 and 29. Larger than ⚠ but still too small to be reliable. One or two returners more or fewer changes the rate by 3–10pp. Treat as a directional hint only — do not compare across skill ages or build product decisions on it.
>
> **—** — No data. Either the cohort was acquired too recently to have a full D7 or D30 follow-up window (users installed after 2026-03-18 can't have a D7 reading), or the Production track had zero users for that skill age × day combination.

| SA | P D1% | A D1% | P D7% | A D7% | P D30% | A D30% |
|:--:|------:|------:|------:|------:|-------:|-------:|
| 2Y | 15.2% | **17.1%** | 2.4%      | **4.5%**  | 1.5%       | **1.1%**   |
| 3Y | **17.3%** | **15.7%** | **6.2%**  | **7.1%**  | 1.2%       | 0.8%       |
| 4Y | **21.2%** | **31.4%** | 1.5%      | 1.9%      | 3.0%       | 2.9%       |
| 5Y | 14.6% | **22.5%** | 4.9%      | **7.0%**  | —          | 1.4%       |
| 6Y | 18.5% | 14.8% | 14.8%     | 7.4%      | —          | 3.7%       |
| 7Y | 11.1% | 32.3% | —         | 0.0%      | —          | 0.0%       |
| 8Y | 16.7% | 19.0% | 8.3%      | 4.8%      | —          | 0.0%       |
| 9Y | 50.0% ⚠ | 28.6% † | —      | 0.0%      | —          | 0.0%       |
| 10Y| **7.8%** | **17.0%** | 1.1%  | **4.3%**  | —          | 0.0%       |

---

## Notes

- **All rates use D0 as denominator** — returners on day N ÷ total D0 installs for that track. Production and AllUsers figures are directly comparable.
- **D0 install intent is strong** — nearly all users who install open the app on day zero (96–100% across skill ages).
- **SA2 is the volume anchor** — 336 production installs, the only skill age with statistically solid D7 (2.4%, 8 returners) and D30 (1.5%, 5 returners) data.
- **D30 reliable data (P)**: SA2 (1.5%), SA3 (1.2%), SA4 (3.0%) — all others too few installs or window too short.
- **D7 reliable data (P)**: SA2 (2.4%), SA3 (6.2%), SA6 (14.8% — small D0 but striking vs AllUsers 7.4%). All others < 30 D0.
- **SA3–10 D1 rates are directional only for Production** — D0 < 100 for all of them; SA9 D0 = 4 (discard).
- **Internal testing users excluded** — builds 71 (v4.3.18) and 73 (v4.3.20) are filtered out.

---

## Comparative Study: Production-Only vs All Users (GA4 CSV)

> **Comparison source**: `reports/level-player-retention-by-skill-age-allUsers.md` (all builds including internal testing builds 71/73)
> **Purpose**: Quantify how much internal tester contamination distorts each skill-age retention figure

---

### What the normalised comparison reveals

Both tracks now use D0 as the denominator, so P% and A% are directly comparable. The gap between them reflects two effects:

1. **Tester contamination** — AllUsers includes internal testing builds 71/73. Where testers return more than real users (SA4, SA5, SA10), A% is inflated. Where testers are mostly passive (SA3, SA6), A% is dragged *below* P%.
2. **Cohort size effects** — For skill ages with D0 < 30 in Production (SA5–SA9), P% are directional only. AllUsers denominators are larger and more stable for those ages.

For the two skill ages with large, clean Production cohorts — **SA2 (336)** and **SA10 (90)** — the P% vs A% gap directly measures tester contamination with minimal noise.

---

### Normalised D1 Comparison

| Skill Age | A D1% | P D1% | Delta (A−P) | Insight |
|---|---|---|---|---|
| 2Y | 17.1% | 15.2% | +1.9pp | Baseline; testers add marginal noise |
| 3Y | 15.7% | 17.3% | −1.6pp | Testers drag SA3 *down* — real users stickier |
| 4Y | 31.4% | 21.2% | **+10.2pp** | 🔴 Testers inflate SA4 by ~50% relative |
| 5Y | 22.5% | 14.6% | +7.9pp | 🟠 Significant tester inflation |
| 6Y | 14.8% | 18.5% | −3.7pp | Testers drag SA6 down — real users stickier |
| 7Y ⚠ | 32.3% | 11.1% | +21.2pp | Directional only (P D0=18, A D0=31) |
| 8Y ⚠ | 19.0% | 16.7% | +2.3pp | Marginal; both cohorts small |
| 10Y | 17.0% | 7.8% | **+9.2pp** | 🔴 SA10 real-user D1 is less than half the AllUsers figure |

---

### D0 User Pool — Internal Tester Headcount

| Skill Age | AllUsers D0 | Production D0 | Internal Users | Internal % |
|---|---|---|---|---|
| 2Y | 550 | 336 | 214 | **38.9%** |
| 3Y | 127 | 81 | 46 | 36.2% |
| 4Y | 105 | 66 | 39 | 37.1% |
| 5Y | 71 | 41 | 30 | 42.3% |
| 6Y | 54 | 27 | 27 | **50.0%** |
| 7Y | 31 | 18 | 13 | 41.9% |
| 8Y | 21 | 12 | 9 | 42.9% |
| 9Y | 7 | 4 | 3 | 42.9% |
| 10Y | 94 | 90 | 4 | **4.3%** |
| **ALL** | **1,060** | **675** | **385** | **36.3%** |

36% of every level player in allUsers reports is an internal tester. SA6 is exactly half. SA10 is uniquely clean (4.3%).

---

### SA4 / SA6 / SA10 Tester Behaviour Stories

**SA4**: 37% of SA4 users are internal testers but they return on D1 at an estimated ~49% rate (QA-testing SA4 content). AllUsers A D1 = 31.4% is inflated fiction; true Production D1 = 21.2%. Tester contamination overstates SA4 D1 by +10.2pp.

**SA10**: Only 4% internal testers by headcount, yet A D1 = 17.0% vs P D1 = 7.8% (+9.2pp gap). The handful of SA10 testers generate outsized D1 activity relative to their share. SA10 real-user D1 is barely 8% — the weakest of all skill ages with a reliable Production sample.

**SA6 reversal**: SA6 is 50% internal testers, yet Production users return *more* at D1 (18.5%) than the mixed AllUsers rate (14.8%). Internal testers in SA6 have low D1 (~11%) — they test features but do not use the app daily. Removing them surfaces a stronger real-user cohort. The same reversal appears at D7: P D7 = 14.8% vs A D7 = 7.4%.

---

### True Production D1 Rankings

| Rank | Skill Age | True D1% | Sample |
|---|---|---|---|
| 1 | SA4 | 21.2% | n=66 |
| 2 | SA6 | 18.5% | n=27 ⚠ |
| 3 | SA3 | 17.3% | n=81 |
| 4 | SA8 | 16.7% | n=12 ⚠ |
| 5 | SA2 | 15.2% | n=336 ✓ |
| 6 | SA5 | 14.6% | n=41 ⚠ |
| 7 | SA7 | 11.1% | n=18 ⚠ |
| 8 | SA10 | 7.8% | n=90 ✓ |

**Real spread: 7.8% → 21.2% (2.7×).** The BQ-derived 6× skill-age gradient collapses when contamination is removed.

---

### D7 / D30 Normalised Comparison

With both tracks on the same D0 denominator, D7 and D30 are now directly comparable:

| Skill Age | P D7% | A D7% | Delta | P D30% | A D30% | Delta |
|---|---|---|---|---|---|---|
| 2Y | 2.4% | **4.5%** | +2.1pp A | 1.5% | **1.1%** | −0.4pp P |
| 3Y | **6.2%** | **7.1%** | +0.9pp A | 1.2% | 0.8% | −0.4pp P |
| 4Y | 1.5% | 1.9% | +0.4pp A | 3.0% | 2.9% | −0.1pp P |
| 5Y | 4.9% | **7.0%** | +2.1pp A | — | 1.4% | — |
| 6Y | 14.8% | 7.4% | **−7.4pp P** | — | 3.7% | — |
| 10Y | 1.1% | **4.3%** | +3.2pp A | — | 0.0% ⚠ | — |

**Bold** = D0 ≥ 30 for that track. P D0 < 30 for SA5/SA6 so P D7% figures are directional.

Key reads:
- **SA2 D7**: AllUsers (4.5%) is higher than Production (2.4%) by +2.1pp — testers who stay past D1 inflate the AllUsers D7 rate.
- **SA3 D7**: Both tracks agree closely (6.2% vs 7.1%) — the most stable cross-track D7 comparison.
- **SA6 D7**: Production (14.8%) is double AllUsers (7.4%) — SA6 testers are passive at D7, so removing them more than doubles the visible rate. Real SA6 users who return on D1 are also notably sticky.
- **SA10 D7**: Production (1.1%) is far below AllUsers (4.3%) — same story as D1: testers drive SA10's apparent engagement. Real-user D7 for SA10 is near zero.

---

### 5 Key Takeaways

1. **36% of level players in AllUsers are internal testers** — SA6 is 50%, SA10 is uniquely clean at 4%. This contaminates every AllUsers retention figure to a different degree per skill age.
2. **SA4 AllUsers D1 (31.4%) is tester-driven fiction** — Production D1 is 21.2%. Testers inflate SA4 by +10.2pp. Do not use AllUsers figures for SA4 without correction.
3. **SA10 real-user D1 (7.8%) and D7 (1.1%) are the weakest of any reliable cohort** — despite having the cleanest tester separation. Users routed to SA10 content simply do not return.
4. **SA2 is the volume anchor and ground truth** — 336 production installs, D1=15.2%, D7=2.4%, D30=1.5%. These are the app's true retention baselines. All other skill ages have D0 < 100 in production.
5. **Skill-age routing does not rescue retention** — the real D1 spread across skill ages (normalised to D0) is 7.8%→21.2% (2.7×), not the 6× BQ gradient. The retention problem is cross-cutting. SA6 is the one positive outlier at D7 (14.8% production D7) but its D0 is only 27.
