# Pre-Subscription Phase — Final Report

> **Period**: Jan 25 → Mar 25, 2026 (60 days)
> **Status**: Subscriptions live — zero conversions. Priority is driving the first subscriber.
> **Sources**: BigQuery export · GA4 Reporting API · GA4 UI manual exports
> **Last updated**: 2026-03-30

---

## Table of Contents

- [Part 1 — Three-Method Comparison](#part-1--three-method-comparison)
  - [Full Metrics Comparison](#full-metrics-comparison)
- [Part 2 — Recommended Method Per Metric Category](#part-2--recommended-method-per-metric-category)
- [Part 3 — Actual State of Pre-Subscription Metrics](#part-3--actual-state-of-pre-subscription-metrics)
  - [Headline numbers](#headline-numbers-jan-25--mar-25-2026)
  - [Funnel shape](#funnel-shape)
  - [Retention deep-dive](#retention-deep-dive)
  - [App usage by skill age](#app-usage-by-skill-age)
  - [Level failure analysis](#level-failure-analysis)
- [Part 4 — Actions to Drive First Subscribers](#part-4--actions-to-drive-first-subscribers)
  - [Priority 1 — Fix the billing flow](#-priority-1--fix-the-billing-flow-blocker)
  - [Priority 2 — Fix D1 retention](#-priority-2--fix-d1-retention-126---40)
  - [Priority 3 — Increase paywall reach](#-priority-3--increase-paywall-reach-5--15)
  - [Priority 4 — Fix onboarding drop-off](#-priority-4--fix-onboarding-drop-off)
  - [Priority 5 — Improve subscription screen UX](#-priority-5--improve-subscription-screen-ux)
  - [Priority 6 — Grow the engaged core](#-priority-6--grow-the-engaged-core)
- [Appendix — Source Document Links](#appendix--source-document-links)

---

## Part 1 — Three-Method Comparison

### How to read this table

- ✅ **Use** = authoritative for this metric; use in future analysis
- ⚠ **Unreliable** = present but known to diverge from ground truth
- ⛔ **Unavailable** = data gap or API error
- **Bold** values = the number to act on

---

### Full Metrics Comparison

| Metric | BigQuery | GA4 API | GA4 UI Export | ✅ Use | Why |
|---|---|---|---|---|---|
| **— USER ACQUISITION —** | | | | | |
| Total users | 3,510 | 4,288 | **4,289** | GA4 UI | BQ undercounts (only users with custom events) |
| Active users | — | 3,841 | **3,842** | GA4 UI | BQ only counts users who fired a custom event; UI counts all engaged sessions |
| New users | — | 3,139 | **3,140** | GA4 UI | BQ misses installs where no custom event fired on first session |
| Returning users | — | 1,149 ⚠ | **2,056 (47.9%)** | GA4 UI | API uses stricter attribution window |
| Sessions | 5,376 | 9,683 | **9,698** | GA4 UI | BQ misses sessions with no custom events |
| Engaged sessions | — | 7,179 | **7,187 (74.1%)** | GA4 UI | BQ misses sessions with no custom events; UI captures all engaged sessions regardless |
| Avg engagement / user | — | **5m 11s** | — | GA4 API | Only metric exclusive to API |
| Avg DAU (60d window) | 80 | 116 | — | Either | Both are window averages; BQ slightly lower |
| Peak DAU | 104 | 156 | — | — | Directional only |
| DAU/MAU ratio | 0.023 | 0.056 ⚠ | **0.021** | GA4 UI | API uses rolling unbounded window; UI scopes to period |
| DAU/WAU ratio | — | — | **0.080** | GA4 UI | Only available in GA4 UI scoped to the report window; API WAU is a rolling unbounded counter |
| **— RETENTION —** | | | | | |
| D1 retention | 6.5% ⚠ | ⛔ 404 | **12.6%** (404/3,205) | GA4 UI | BQ anchor = first event in export (returning users inflate denominator) |
| D7 retention | 2.4% ⚠ | ⛔ 404 | **4.0%** (84/2,118) | GA4 UI | Same BQ proxy issue |
| D30 retention | 2.0% ⚠ | ⛔ 404 | **1.8%** (12/673) | GA4 UI | BQ and UI converge at D30 — both show ~2% |
| **— PAYWALL FUNNEL —** | | | | | |
| Funnel base | 3,510 total | 4,288 total | **3,843 active** | GA4 UI | Active-user denominator is more meaningful |
| Reached paywall | 0 ⚠ data gap | 194 (4.5%) | **194 (5.05% of active)** | GA4 UI | `SubscriptionOpened` absent from BQ export |
| SubscriptionOpened events | 0 ⚠ | — | **471** (avg 2.4×/user) | GA4 UI | Users re-open paywall — intent is there |
| Completed purchase | 0 | 0 | **0** | All agree | No conversion in 60 days |
| **— SCREEN DISTRIBUTION —** | | | | | |
| Profile screen | 173 events / 75 users | 4,320 views / 2,494 users | **37,709 events** | GA4 UI | BQ derives from event param (unreliable); API misses non-screen_view events |
| Home screen | 7,144 events / 1,197 users | 9,888 views / 1,340 users | **24,581 events** | GA4 UI | Same as Profile — BQ derives from event param (unreliable); API undercounts non-screen_view interactions |
| ProfileWizard | ⛔ invisible | ⛔ no screen_view | **15,007 events** | GA4 UI only | Fires custom events but no screen_view — only visible in UI |
| Level screen | 28,161 events / 1,159 users | 7,885 views / 1,194 users | 6,244 events | BigQuery (user count) | BQ has richest level-event data |
| Subscription (paywall) | 0 ⚠ | 447 views / 194 users | **776 events** | GA4 API / UI | BQ has data gap (`SubscriptionOpened` absent); API gives unique user reach; UI gives total interaction count — both needed |
| Complete (post-level) | 8,432 events / 696 users | 4,020 views / 659 users | 3,985 events | BigQuery (user count) | BQ provides exact unique user counts per event; API and UI event totals are consistent but lack per-user breakdown |
| **— FEATURE ENGAGEMENT —** | | | | | |
| Users who played a level | **1,354** | 1,190 ⚠ | — | BigQuery | API under-samples high-volume custom events |
| LevelLoaded events | **18,775** | 12,369 ⚠ | 18,790 | BigQuery / UI | API ~34% lower — sampled |
| segmentStarted | **18,682** (1,336 users) | 12,283 ⚠ | 18,697 | BigQuery | API significantly undersampled |
| segmentCompleted | **10,556** (890 users) | 8,449 ⚠ | 10,566 | BigQuery | API undersampled |
| Segment completion rate | **56.5%** | 68.8% ⚠ | **56.5%** ✅ | BigQuery / UI | API inflated due to undercounting drops; BQ + UI agree |
| segmentDropped | **6,325** (827 users) | 2,206 ⚠ | 6,329 | BigQuery | API severely undersampled for drops |
| **— ASSESSMENT —** | | | | | |
| Users who completed | 152 (4.3%) | **149 (3.5%)** | 155 events | Any | All three consistent — use any |
| **— CRASH / STABILITY —** | | | | | |
| app_exception events | 2 | 2 | **2** | Any | All three agree |
| Users affected | 2 (0.06%) | 2 (0.05%) | — | Any | All three sources agree on crash count; minor % difference is denominator (total vs active users) |

---

## Part 2 — Recommended Method Per Metric Category

| Metric category | Primary method | Reason |
|---|---|---|
| User counts, sessions, DAU/MAU | **GA4 UI export** | Correctly scoped to window; no rolling-window inflation |
| Retention (D1/D7/D30) | **GA4 UI export** | Only method with true `first_open` cohort anchor; API 404 |
| Paywall funnel, paywall reach | **GA4 UI export** | Active-user denominator; `SubscriptionOpened` visible |
| Screen navigation (unique users per screen) | **GA4 API** | `screen_view` + `unifiedScreenName` dimension; includes all navigation |
| Screen event density (total interactions) | **GA4 UI export** | All events per screen including ProfileWizard |
| Gameplay metrics (level loads, segment funnel) | **BigQuery** | Exact event + user counts; no sampling; richest param data |
| Assessment completion, crash rate | **Any** (all agree) | Consistent across all three |
| Avg engagement time per user | **GA4 API only** | `userEngagementDuration / activeUsers` — not available elsewhere |

**Optimized pipeline going forward:**

```
BigQuery           →  Gameplay depth (segment funnel, level retry analysis, user-level)
GA4 UI exports     →  User/retention/paywall dashboard (weekly manual export)
GA4 API script     →  Avg engagement time, screen navigation reach (automated)
```

---

## Part 3 — Actual State of Pre-Subscription Metrics

### Headline numbers (Jan 25 → Mar 25, 2026)

| Metric | Value | Benchmark | Status |
|---|---|---|---|
| Total users (60d) | 4,289 | — | — |
| Active users | 3,842 | — | — |
| DAU/MAU ratio | **0.021** | ≥ 0.20 | 🔴 Critical (10× below target) |
| D1 retention | **12.6%** | ≥ 40% | 🔴 Critical (3× below target) |
| D7 retention | **4.0%** | ≥ 20% | 🔴 Critical (5× below target) |
| D30 retention | **1.8%** | ≥ 10% | 🔴 Critical (functionally zero) |
| Paywall reach | **5.05%** of active | ≥ 15% | 🟡 Low (3× below target) |
| Paywall conversion | **0%** | ≥ 2% | 🔴 Zero — no revenue |
| Users who played a level | **1,354 (38.6%)** | — | 🟡 Engagement gap |
| Segment completion rate | **56.5%** | ≥ 70% | 🟡 Moderate |
| Assessment completion | **4.3%** | ≥ 30% | 🔴 Critical |
| Avg engagement / user | **5m 11s** | ≥ 10m | 🟡 Low |
| Crash rate | **0.04%** | < 1% | ✅ Good |

### Funnel shape

```
4,289 users installed
  └── 3,842 (89.6%)  at least one engaged session
      └── 1,354 (35.2%)  played at least one level
          └──   890 (65.7%)  completed a segment
      └──   149  (3.9%)   completed assessment
      └──   194  (5.1%)   reached the paywall
          └──     0  (0%)     subscribed
```

The funnel has **two collapse points**:
1. **D1 retention** — 87% of users don't return the day after install. They never reach the paywall at all.
2. **Paywall conversion** — of the 194 who do reach the paywall, zero converted in 60 days.

---

### Retention deep-dive

#### Install cohort composition

Of the 3,262 BQ users in the window:

| Cohort | Users | % |
|---|---|---|
| Played at least one level (have skillage) | 1,258 | 38% |
| Loaded a level but never started a segment | 15 | 0.5% |
| Only `firebase_campaign` event — never played | **1,988** | **61%** |
| **Total** | **3,262** | |

**61% of installs never reached gameplay.** These users were acquired via campaign, registered as installs, and immediately churned — before the D1 retention window even started. They inflate all retention denominators without contributing any retention signal.

#### Retention: all installs vs. level players only

Excluding the 1,988 campaign-bounce users and scoping to the 1,273 users who loaded at least one level reveals substantially better underlying retention:

| | All installs (n=3,262) | Level players only (n=1,273) | Benchmark |
|---|---|---|---|
| D1 | 6.5% | **24.0%** | ≥ 40% |
| D7 | 2.6% | **15.1%** | ≥ 20% |
| D30 | 2.3% | **11.7% ✓** | ≥ 10% |

Scoping to actual players **3–4× improves all rates** and pushes D30 above the 10% benchmark. The headline D1 = 6.5% is almost entirely a denominator problem, not a product problem.

#### D1/D7/D30 retention by skill age (level players)

Skill age = `currentSkillAge` on a user's first `segmentStarted` event.

| Skill age | D1 | D7 | D30 |
|---|---|---|---|
| 2 Y | 17.2% (n=628) | 9.9% (n=211) | 6.7% (n=60) |
| 3 Y | 34.5% (n=55) | 31.6% (n=19) | 28.6% (n=7) |
| 4 Y | 42.9% (n=63) | 33.3% (n=3) | — |
| 5 Y | 54.5% (n=33) | 50.0% (n=2) | — |
| 6 Y | 62.5% (n=8) | 75.0% (n=4) | 50.0% (n=2) |
| 7 Y | 75.0% (n=4) | 100.0% (n=1) | — |
| 8 Y | 100.0% (n=2) | — | — |
| 9 Y | 100.0% (n=2) | — | — |
| 10 Y | 40.5% (n=42) | 45.5% (n=11) | 25.0% (n=8) |

**Key findings:**
- **Retention climbs sharply with skill age.** Users at 5–9 Y have 2–4× better D1 retention than 2 Y users.
- **2 Y is the problem cohort.** At 628 users it is by far the largest group (50% of level players) yet has the worst retention (17% D1, 10% D7). This alone drags the overall level-player D1 from ~35% down to 24%.
- **3–10 Y users retain well.** D1 retention of 34–100% across all other skill ages meets or approaches the 40% benchmark.
- **Implication**: the app works well for older-skill-age users. The issue is with the youngest/beginner cohort — likely content difficulty mismatch or missing beginner onboarding.
- **D7/D30 cohorts are too small** (n ≤ 19 for most skill ages above 2 Y) for statistical confidence — treat those numbers as directional only.

---

### App usage by skill age

Engagement depth per skill-age cohort, measured across all users who played at least one level (1,258 total).

| Skill Age | Users | Levels | Avg Lvl/User | Seg Started | Seg Completed | Seg Dropped | Done% | Avg Seg/User |
|---|---|---|---|---|---|---|---|---|
| 2 Y | 685 | 8,948 | 13.1 | 151,800 | 4,022 | 4,188 | 2.6% | 221.6 |
| 3 Y | 143 | 1,182 | 8.3 | 20,087 | 742 | 212 | 3.7% | 140.5 |
| 4 Y | 120 | 1,220 | 10.2 | 20,750 | 765 | 273 | 3.7% | 172.9 |
| 5 Y | 82 | 627 | 7.6 | 10,668 | 383 | 128 | 3.6% | 130.1 |
| 6 Y | 57 | 714 | 12.5 | 12,095 | 377 | 260 | 3.1% | 212.2 |
| 7 Y | 35 | 281 | 8.0 | 4,791 | 181 | 62 | 3.8% | 136.9 |
| **8 Y** | **23** | **2,442** | **106.2** | **41,520** | **2,220** | 133 | **5.3%** | **1,805.2** |
| 9 Y | 9 | 71 | 7.9 | 1,207 | 47 | 12 | 3.9% | 134.1 |
| 10 Y | 104 | 1,765 | 17.0 | 29,980 | 847 | 756 | 2.8% | 288.3 |
| **TOTAL** | **1,258** | **17,250** | **13.7** | **292,898** | **9,584** | **6,024** | **3.3%** | **232.8** |

**Key findings:**
- **2 Y dominates in users (685, 54%)** but has the lowest segment completion rate (2.6%) and the highest absolute drop count (4,188) — consistent with the worst retention profile.
- **8 Y is a power-user outlier** — only 23 users but they average 106 levels and 1,805 segments each, with the best completion rate (5.3%). Total volume from 23 users rivals entire other cohorts.
- **Segment completion is universally low (2.6–5.3%)** across all ages — expected, as `segmentCompleted` counts only board-level completions while most activity is exploratory browsing.
- **3 Y–7 Y** are broadly consistent: 8–12 levels and 130–220 segments per user with ~3.5–3.8% completion.
- **10 Y** (104 users) shows above-average depth at 17 levels and 288 segments per user — this cohort punches above its size.

---

### Level failure analysis

#### Failure & drop rates by skill age

`segmentCompleted` with `status=fail` = formal failure (scored, wrong). `segmentDropped` = silent abandonment (user left without completing).

| Age | Started | Pass | Fail | Drop | Fail% | Drop% | F+D% | Users w/Fail | Avg Wrong on Fail |
|---|---|---|---|---|---|---|---|---|---|
| 2 Y | 9,563 | 4,265 | 302 | 4,248 | 3.2% | **44.4%** | **47.6%** | 155 | 2.3 |
| 3 Y | 1,081 | 574 | 69 | 205 | 6.4% | 19.0% | 25.3% | 41 | 4.7 |
| 4 Y | 878 | 459 | 23 | 229 | 2.6% | 26.1% | 28.7% | 16 | 5.0 |
| 5 Y | 693 | 398 | 44 | 127 | 6.3% | 18.3% | 24.7% | 18 | 3.6 |
| 6 Y | 587 | 259 | 7 | 254 | 1.2% | **43.3%** | **44.5%** | 7 | 1.9 |
| 7 Y | 181 | 83 | 8 | 53 | 4.4% | 29.3% | 33.7% | 4 | 3.8 |
| **8 Y** | 2,364 | 2,139 | 16 | 124 | 0.7% | **5.2%** | **5.9%** | 3 | 8.8 |
| 9 Y | 44 | 26 | 0 | 8 | 0.0% | 18.2% | 18.2% | 0 | — |
| 10 Y | 1,851 | 886 | 18 | 773 | 1.0% | 41.8% | **42.7%** | 13 | 6.8 |

#### Top 25 levels by failure+drop rate (min 20 starts)

All 25 worst levels belong to the **2 Y skill age** cohort, concentrated in **Measurements**, **Time**, and **Money** branches. The predominant signal is drops (silent abandonment), not formal failures — users leave without being scored.

| Level | Branch | F+D% | Started | Pass | Fail | Drop |
|---|---|---|---|---|---|---|
| findDifferenceOfHeight1 | Measurements | 85.7% | 21 | 3 | 1 | 17 |
| matchMonthNumberWithName3 | Time | 79.2% | 24 | 5 | 0 | 19 |
| matchObjectsWithKgs1 | Measurements | 77.3% | 22 | 4 | 0 | 17 |
| findDifferenceOfHeight2 | Measurements | 76.2% | 21 | 3 | 0 | 16 |
| addCapacity4 | Measurements | 75.0% | 20 | 4 | 1 | 14 |
| matchHeavyLightObjects1 | Measurements | 75.0% | 20 | 5 | 0 | 15 |
| formGivenWeight4 | Measurements | 75.0% | 20 | 5 | 1 | 14 |
| matchHeavyLightObjects2 | Measurements | 71.4% | 21 | 5 | 1 | 14 |
| findWeight1 | Measurements | 70.4% | 27 | 8 | 0 | 19 |
| matchToyWithMoney1 | Money | 69.6% | 23 | 6 | 0 | 16 |
| findTheTotalAmountPaid1 | Money | 68.2% | 22 | 6 | 0 | 15 |
| convertLengthAndDistanceUnits | Measurements | 68.0% | 25 | 8 | 0 | 17 |
| matchDifferentMinuteWithTimeLabel | Time | 66.7% | 21 | 6 | 0 | 14 |
| differenceInWeight4 | Measurements | 63.8% | 47 | 15 | 0 | 30 |
| findDiffInCapacity3 | Measurements | 62.5% | 24 | 9 | 0 | 15 |
| differenceInWeight3 | Measurements | 62.5% | 32 | 11 | 0 | 20 |
| orderHrsAndMinutesDifferentHr | Time | 61.9% | 21 | 7 | 0 | 13 |
| addCapacity2 | Measurements | 61.9% | 21 | 8 | 0 | 13 |
| differenceInWeight2 | Measurements | 61.9% | 21 | 8 | 1 | 12 |
| matchAnimalWaterInTakeInL | Measurements | 60.9% | 23 | 8 | 0 | 14 |
| findDiffInCapacity1 | Measurements | 60.9% | 23 | 8 | 0 | 14 |
| matchPersonWithGlasses | Measurements | 60.7% | 28 | 11 | 0 | 17 |
| matchBalloonWithMoney6 | Money | 58.3% | 24 | 9 | 0 | 14 |
| formGivenWeight2 | Measurements | 57.1% | 21 | 9 | 0 | 12 |
| simpleIdentificationAnimalsSet4 | Objects | 56.5% | 23 | 3 | 0 | 13 |

#### D1 retention by failure experience

Users bucketed by their personal fail+drop rate (minimum 5 segments started).

| Failure Bucket | Users | Returned D1 | D1 Ret% |
|---|---|---|---|
| Very low (<20%) | 244 | 57 | 23.4% |
| Low failure (20–49%) | 230 | 63 | **27.4%** |
| Mid failure (50–79%) | 85 | 25 | **29.4%** |
| High failure (≥80%) | 64 | 12 | 18.8% |

**Key findings:**
- **Failure is almost entirely a 2 Y / Measurements + Time + Money problem** — 44% of 2Y segments are silently dropped, vs 5–18% for all other ages. The Measurements branch accounts for 17 of the top 25 worst levels.
- **Drops, not formal failures, are the churn signal.** Formal fail% is low (0.7–6.4%) across all ages. The real problem is users abandoning without being scored — indicating content confusion or difficulty mismatch, not just hard problems.
- **Low avg-wrong-on-fail for 2Y (2.3)** confirms users are giving up almost immediately on failure, not persisting.
- **8 Y has the healthiest profile** — 5.9% combined fail+drop, highest pass rate (90%), and the best engagement depth from the usage stats section.
- **Moderate failure improves retention:** users with 50–79% fail+drop rate retain at 29.4% D1 vs 23.4% for very-low-failure users — a healthy challenge keeps users coming back. Only at ≥80% (overwhelmed) does retention collapse to 18.8%.
- **Implication**: the 2Y Measurements cluster is the single highest-impact fix — these levels are driving the majority of silent churn in the largest cohort.

---

## Part 4 — Actions to Drive First Subscribers

### 🔴 Priority 1 — Fix the billing flow (blocker)

**Problem**: 194 users reached the paywall. Users averaged 2.4 visits to the paywall each (471 `SubscriptionOpened` events ÷ 194 users). Zero conversions in 60 days is not a UX or pricing problem alone — it points to a **broken billing integration**.

| Action | Detail |
|---|---|
| Test billing end-to-end on a real device | Open the subscription screen → tap a plan → complete checkout. Does `GameSubscription` fire? |
| Test in Google Play sandbox | Use a test account to verify the purchase flow completes without errors |
| Verify `GameSubscription` event wiring | Check it fires on `BillingClient.BILLING_RESPONSE_RESULT_OK`, not on tap |
| Check plan availability by region | Verify the subscription products are published and available in Play Console for target regions |

### 🔴 Priority 2 — Fix D1 retention for the 2 Y cohort (12.6% → ≥ 40%)

**Problem**: The headline D1 = 6.5% (all installs) inflates the severity — level players retain at 24% D1 overall. However, the **2 Y skill-age cohort** (628 users, 50% of level players) retains at only 17% D1 and 10% D7, while every other skill-age group retains at 35–100%. The content or onboarding experience at the youngest/beginner level is failing to bring users back.

| Action | Detail |
|---|---|
| Day-1 push notification | Send at 24h after install: "Your child's learning path is waiting" — requires notification permission prompt at onboarding |
| Visible progress on return | Show a streak counter, badge, or "continue where you left off" card prominently on Home screen|
| Investigate high-D1 cohorts | Feb 26 (23.2%), Mar 1 (24.4%), Mar 2 (20.4%), Mar 19 (21.4%) — check acquisition source and app version for those dates |
| Reduce onboarding friction | Only 4.3% complete the assessment. ProfileWizard has 15,007 events — users are stuck or lost in the setup flow |

### 🔴 Priority 3 — Increase paywall reach (5% → 15%+)

**Problem**: Only 194 of 3,842 active users ever see the subscription screen. The paywall is not being surfaced at the right moments.

| Action | Detail | Evidence |
|---|---|---|
| Add paywall trigger on `Complete` screen | Post-level completion — highest intent moment | 3,985 events, 659 users on Complete screen |
| Add paywall trigger on `Profile` screen | Highest engagement screen in the app | 37,709 events — users spend 37% of all interaction time here |
| Add paywall trigger after assessment | If user completes assessment, they are invested — offer unlock | 149 completers, only 4.3% conversion to paywall currently |
| Paywall after N free levels | Prompt after 3–5 level completions | 890 users completed at least 1 segment |

### 🟡 Priority 4 — Fix onboarding drop-off

**Problem**: 3,748 users visited the `Onboard` screen but only 149 completed the assessment (4.0% of Onboard visitors). ProfileWizard has 15,007 events on a screen invisible to screen_view tracking — users are interacting heavily but not completing.

| Action | Detail |
|---|---|
| Instrument ProfileWizard with `screen_view` | Add explicit screen tracking so it appears in GA4 navigation reports |
| Map the ProfileWizard drop-off | Add checkpoint events to identify exactly where users abandon the wizard |
| Simplify or shorten assessment | If it's > 5 steps, reduce to 3 required + optional extended |
| Make assessment completion rewarding | Show a "Profile complete!" moment with a visual reward before entering the app |

### 🟡 Priority 5 — Improve subscription screen UX

**Problem**: 194 users reached the paywall and viewed it an average of 2.4 times — they're curious but not converting. Assuming billing works, the screen itself needs work.

| Action | Detail |
|---|---|
| Clarify the value proposition | Lead with child outcome ("Unlock all math levels for your child") not product features |
| Add trust signals | App store rating, number of children using the app, example skill improvements |
| Show a free-trial offer | A 7-day free trial dramatically increases conversion for children's apps |
| Simplify plan choice | If showing multiple plans, put the recommended one first with a visual highlight |
| Add a "maybe later" flow | Users who dismiss should see a soft reminder after 2 more level completions |

### 🟢 Priority 6 — Grow the engaged core

**Problem**: Only 38.6% of users ever play a level. The segment completion rate (56.5%) and the level retry patterns suggest content quality is reasonable, but discovery is failing.

| Action | Detail |
|---|---|
| Surface levels earlier in onboarding | Do not require full profile/assessment before first level |
| Add level recommendation on Home | "Recommended for your child" card visible without scrolling |
| Investigate high-retry levels | `orderBasedOnWeightSameObject` (676 loads, 12 users) and `maskPattern` (353 loads, 13 users) — likely difficulty spikes causing frustration |

---

## Appendix — Source Document Links

| Document | Contents |
|---|---|
| [pre-subscription-phase-metrics.md](./pre-subscription-phase-metrics.md) | BigQuery raw event data, gameplay funnel, screen distribution from event params |
| [pre-subscription-phase-metrics-ga4.md](./pre-subscription-phase-metrics-ga4.md) | GA4 API data, screen navigation, paywall funnel, UI navigation guide |
| [pre-subscription-phase-metrics-ga4-ui.md](./pre-subscription-phase-metrics-ga4-ui.md) | GA4 UI manual exports — authoritative for user counts, retention, paywall, screen events |
