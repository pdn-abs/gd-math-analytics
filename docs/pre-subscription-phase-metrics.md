# Early Acquisition Phase Metrics for GD-Math

> **Status (March 2026)**: Subscriptions are live but no subscribers acquired yet. The priority has shifted from "preparing for subscriptions" to **driving the first conversions**. Engagement and acquisition metrics remain critical as leading indicators, but paywall funnel tracking is now the top focus.

---

## Measurement Run — Jan 25 → Mar 25, 2026

> **Data source**: GA4 BigQuery export (`analytics_441470574`, 60 daily tables)
> **Script**: `scripts/fetch_pre_subscription_metrics.js` · **Output**: `data/pre_subscription_metrics.json`
> **Generated**: 2026-03-26
>
> GA4 Reporting API run (screen data, paywall funnel): [pre-subscription-phase-metrics-ga4.md](./pre-subscription-phase-metrics-ga4.md)

### 1. User Acquisition & Activity

| Metric | Value | Benchmark | Status |
|---|---|---|---|
| MAU (window) | 3,510 | — | — |
| Avg DAU | 80 | — | — |
| Peak DAU | 104 (Feb 1) | — | — |
| DAU/MAU ratio | 0.023 | ≥ 0.20 | ⚠ Low |

DAU was stable in the 60–104 range throughout the window with no clear growth trend, indicating the user base is not expanding.

### 2. Retention Cohorts

> Cohort = first day a user was seen in the dataset (proxy for install, as `first_open` events precede the BigQuery export window).

| Day | Retained | Eligible cohort | Rate | Benchmark | Status |
|---|---|---|---|---|---|
| D1 | 218 | 3,344 | **6.5%** | ≥ 40% | ⚠ Critical |
| D7 | 41 | 1,726 | **2.4%** | ≥ 20% | ⚠ Critical |
| D30 | 13 | 636 | **2.0%** | ≥ 10% | ⚠ Critical |

**Interpretation**: 93.5% of users never return the day after first use. This is the single biggest risk to ever reaching a conversion — users leave before they see the paywall.

### 3. Paywall Funnel

> ⚠ `SubscriptionOpened` has **0 events** in BigQuery — this is a data gap, not reality. The event fires via GA4's internal screen handler which does not write to the BigQuery export stream.
> See the [GA4 API report](./pre-subscription-phase-metrics-ga4.md) for authoritative paywall data.

| Step | BigQuery | GA4 API (authoritative) |
|---|---|---|
| All users | 3,510 | 4,288 |
| Reached Subscription screen | 0 (data gap) | **194 (4.5%)** |
| Completed purchase | 0 | **0 (0%)** |

**Interpretation**: 194 users (4.5%) reached the subscription screen but zero converted. The paywall is being surfaced but failing to convert. See [GA4 API report](./pre-subscription-phase-metrics-ga4.md) for screen distribution and recommended actions.

### 4. Feature Engagement & Screen Distribution

**Segment funnel** (engaged users only — 1,354 of 3,510 ever loaded a level):

| Event | Count | Unique users | Rate vs started |
|---|---|---|---|
| LevelLoaded | 18,775 | 1,354 | — |
| segmentStarted | 18,682 | 1,336 | 100% |
| segmentCompleted | 10,556 | 890 | **56.5%** |
| segmentDropped | 6,325 | 827 | **33.9%** |

**Screen distribution** (inferred from `firebase_screen` param on all events):

| Screen | Events | Unique users |
|---|---|---|
| Level | 28,161 | 1,159 |
| LevelsSelection | 10,092 | 237 |
| Complete | 8,432 | 696 |
| Home | 7,144 | 1,197 |
| Profile | 173 | 75 |
| AgeGate | 8 | 7 |

> Note: `screen_view` is absent from this BigQuery export; screen data is derived from the `firebase_screen` parameter embedded on all events. `Subscription` screen never appears.

**Top levels loaded**:

| # | Level | Loads | Users |
|---|---|---|---|
| 1 | simpleIdentificationVegetablesSet2AL | 1,681 | 471 |
| 2 | stackVegetablesAndFruitsOverall2AL | 680 | 172 |
| 3 | orderBasedOnWeightSameObject | 676 | 12 |
| 4 | simpleIdentificationToysSet22AL | 640 | 267 |
| 5 | matchNumberCount1to72AL | 468 | 134 |

Note: `orderBasedOnWeightSameObject` and `maskPattern` show very high loads relative to unique users (676/12 and 353/13) — likely repeated-retry patterns, possibly indicating difficulty spikes.

### 5. Onboarding / Assessment Completion

| Metric | Value |
|---|---|
| Total users | 3,510 |
| Completed assessment | 152 (4.3%) |
| Total `assessmentCompleted` events | 155 |
| Avg completions per user | 1.0 |

4.3% completion is low. The majority of users (2,156 who opened the app, based on firebase_campaign installs vs level activity) never reach or complete the assessment. Likely cause: users come from campaigns and bounce without understanding the app's purpose.

### 6. Crash / Stability

| Metric | Value | Status |
|---|---|---|
| Total sessions | 5,376 | — |
| Crash events (`app_exception`) | 2 | ✓ |
| Users affected | 2 (0.06%) | ✓ |
| Crash rate | 0.037% of sessions | ✓ Good (<1%) |

App is stable. Crashes are not a factor at this stage.

---

### Priority Actions (Ranked)

1. **🔴 Fix conversion on the subscription screen** — 194 users reached it (GA4 API); zero converted. Review pricing clarity, trust signals, CTA, and Google Play billing flow. See [GA4 API report](./pre-subscription-phase-metrics-ga4.md).
2. **🔴 Increase paywall reach rate (4.5% → 15%+)** — Add paywall triggers on `Complete` (post-level) and `Profile` screens — both have high reach.
3. **🔴 Fix D1 retention (6.5%)** — 94% of new users don't return the next day. Add a day-1 re-engagement notification and a visible progress/streak mechanic.
4. **🟡 Onboarding funnel** — Only 4.3% complete the assessment. Review whether the assessment is surfaced prominently or skippable too easily. Completing it correlates with higher engagement.
5. **🟡 Investigate high-retry levels** — `orderBasedOnWeightSameObject` (676 loads, 12 users) and `maskPattern` (353 loads, 13 users) suggest a small number of users are retrying dozens of times. Likely difficulty spikes worth reviewing.
6. **🟢 Leverage engaged users** — 1,354 users (39%) actively play levels with a 56.5% segment completion rate. Target with a post-level paywall on the `Complete` screen.

---
- **Tools**: Stick to GA4 (free, powerful). Supplement with Google Sheets.
- **Efficiency Tips**: Start with 1-2 metrics per month. Measure impact on user growth.
- **Red Flags**: Low retention (<20% 7-day), payw
