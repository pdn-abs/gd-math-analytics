# Pre-Subscription Phase Metrics — GA4 Reporting API

> **Data source**: GA4 Data API v1beta (`properties/441470574`)
> **Script**: `scripts/fetch_pre_subscription_metrics_ga4.js`
> **Output**: `data/pre_subscription_metrics_ga4.json`
> **Window**: Jan 25 → Mar 25, 2026
> **Generated**: 2026-03-26
>
> GA4 UI manual export report: [pre-subscription-phase-metrics-ga4-ui.md](./pre-subscription-phase-metrics-ga4-ui.md)
> BigQuery report: [pre-subscription-phase-metrics.md](./pre-subscription-phase-metrics.md)

---

## API Limitations & Trust Notes

| Section | Trust | Reason |
|---|---|---|
| Paywall funnel, screen views | ✅ Authoritative | GA4 processes `screen_view` + custom events; `SubscriptionOpened` is visible here but absent from BigQuery |
| Assessment completion, crashes | ✅ Reliable | Consistent with BigQuery |
| User counts / DAU / sessions | ✅ More accurate | Includes all sessions, not just those with custom events |
| D1/D7/D30 retention | ⛔ Unavailable | GA4 cohort endpoint returns 404 for this property — use [GA4 UI export](./pre-subscription-phase-metrics-ga4-ui.md) (D1 = 12.6%) |
| WAU/MAU snapshot values | ⚠ Inflated | `active7/28DayUsers` are rolling counters unbounded by the report date range — use [UI export](./pre-subscription-phase-metrics-ga4-ui.md) for correct DAU/MAU (0.021) |
| Avg session duration | ⚠ Inflated | GA4 `averageSessionDuration` includes idle time — use `Avg Engagement / User` instead |

---

## 1. User Acquisition & Activity

| Metric | Value | Notes |
|---|---|---|
| Total Users | **4,288** | All users who fired any event in window |
| Active Users | **3,841** | Users with at least one engaged session |
| New Users | **3,139** | First-time installs |
| Returning Users | **1,149** (26.8%) | |
| Sessions | **9,683** | All session types |
| Engaged Sessions | **7,179** (74.1%) | Session > 10s or conversion event |
| Avg Session Duration | 2h 6m | ⚠ Inflated by idle time — not reliable |
| **Avg Engagement / User** | **5m 11s** | `userEngagementDuration / activeUsers` — use this |
| DAU snapshot (Mar 25) | 114 | Rolling 1-day at report end date |
| Avg DAU (60d window) | 116 | Mean of daily activeUsers |
| Peak DAU | 156 | |
| DAU/MAU ratio | 0.056 | ⚠ Inflated rolling window — correct value is 0.021 (see [UI export](./pre-subscription-phase-metrics-ga4-ui.md)) |

> ⚠ WAU (38,486) and MAU (124,623) snapshots are rolling-window counters across all time, not bounded to this window. The [GA4 UI export](./pre-subscription-phase-metrics-ga4-ui.md) provides corrected values: DAU/MAU = 0.021, DAU/WAU = 0.080, and returning users = 2,056 (47.9%).

**DAU trend (last 14 days)**:

| Date | DAU |
|---|---|
| Mar 12 | 99 |
| Mar 13 | 109 |
| Mar 14 | 105 |
| Mar 15 | 126 |
| Mar 16 | 99 |
| Mar 17 | 112 |
| Mar 18 | 135 |
| Mar 19 | 99 |
| Mar 20 | 115 |
| Mar 21 | 121 |
| Mar 22 | 106 |
| Mar 23 | 102 |
| Mar 24 | 108 |
| Mar 25 | 114 |

DAU is stable in the 99–135 range with no growth trend.

---

## 2. Retention Cohorts

⛔ **Not available via this API.** The `runCohortReport` endpoint returns 404 for this property.

| Day | Authoritative rate | Source |
|---|---|---|
| D1 | **12.6%** | [GA4 UI cohort export](./pre-subscription-phase-metrics-ga4-ui.md) |
| D7 | **4.0%** | [GA4 UI cohort export](./pre-subscription-phase-metrics-ga4-ui.md) (2,118 cohort base) |
| D30 | **1.8%** | [GA4 UI cohort export](./pre-subscription-phase-metrics-ga4-ui.md) (673 cohort base) |

See the [GA4 UI export](./pre-subscription-phase-metrics-ga4-ui.md) for the full per-cohort breakdown (D1/D7/D30) across all 60 cohort dates.

---

## 3. Paywall Funnel

| Step | Users | Rate |
|---|---|---|
| All users | 4,288 | 100% |
| Reached Subscription screen | **194** | **4.5%** |
| Completed purchase (`GameSubscription` event) | **0** | **0%** |

> Note: `GameSubscription` counts all event types — the GA4 API cannot filter by event parameters. Zero is still a definitive signal; no subscription events of any kind fired.

**Funnel**: All users — (4.5% of total / 5.05% of active) → Paywall — (0%) → Purchase

> For exact active-user denominator, abandonment rates, and step-by-step breakdown, see the [GA4 UI funnel export](./pre-subscription-phase-metrics-ga4-ui.md).

---

## 4. Screen Distribution

Full screen view data from `unifiedScreenName` dimension:

| Screen | Views | Unique users | Notes |
|---|---|---|---|
| (not set) | 10,215 | 3,838 | System events before first screen assignment |
| Home | 9,888 | 1,340 | Main entry point |
| Level | 7,885 | 1,194 | Core gameplay |
| Profile | 4,320 | 2,494 | High reach — strong placement for subscription prompt |
| Complete | 4,020 | 659 | Post-level completion — ideal paywall trigger point |
| Onboard | 3,748 | 2,564 | Most users pass through |
| AgeGate | 3,534 | 860 | |
| Consent | 3,034 | 2,651 | |
| LevelsSelection | 1,131 | 133 | |
| About | 593 | 353 | |
| **Subscription** | **447** | **194** | Paywall screen — 4.5% of users |
| Settings | 345 | 217 | |
| PlayerReport | 112 | 78 | |
| TimeOut | 25 | 10 | |

**Onboarding flow**: Consent (2,651) → AgeGate (860) → Onboard (2,564) → Profile (2,494). Drop-off between Consent and Onboard visible here.

> ⚠ **ProfileWizard** (15,007 all-event-count) is a screen absent from this `screen_view` data — it fires custom events but no `screen_view`. See the [GA4 UI export](./pre-subscription-phase-metrics-ga4-ui.md) for the full event-count-by-screen breakdown.

---

## 5. Onboarding / Assessment Completion

| Metric | Value |
|---|---|
| Total users | 4,288 |
| Completed assessment | **149** (3.5%) |
| `assessmentCompleted` events | 152 |

3,748 users visited the `Onboard` screen; only 149 completed the assessment — **4.0% of Onboard visitors**. The assessment is being reached but almost universally abandoned or skipped.

---

## 6. Crash / Stability

| Metric | Value | Status |
|---|---|---|
| Total sessions | 9,683 | — |
| Crash events (`app_exception`) | **2** | ✓ |
| Users affected | 2 (0.05%) | ✓ |
| Crash rate | 0.021% of sessions | ✓ Good (<1%) |

App is stable. Crashes are not a contributing factor to low retention or conversion.

---

## Priority Actions

1. **🔴 Fix conversion (0%)** — 194 users reached the paywall; zero subscribed. Verify the billing flow end-to-end, then redesign the subscription screen.
2. **🔴 Fix D1 retention (12.6%)** — Real D1 from [GA4 UI cohorts](./pre-subscription-phase-metrics-ga4-ui.md). 87% of users don't return the next day. Add day-1 push notification and a visible progress hook.
3. **🔴 Increase paywall reach (5% → 15%+)** — Add triggers on `Complete` (post-level, 659 users) and `Profile` (highest engagement screen).
4. **🟡 Investigate ProfileWizard** — 15,007 events on a screen absent from `screen_view` reports. Map what fires here and the drop-off rate. See [UI export](./pre-subscription-phase-metrics-ga4-ui.md).
5. **🟡 Onboarding drop-off** — 2,564 visit `Onboard`; 149 complete assessment (4.0%). Investigate the ProfileWizard flow.
6. **🟢 Target engaged users** — Level + Complete screens show 1,194 active players. Post-level paywall on `Complete` is the highest-intent trigger point.
7. **🟢 Investigate high-retention cohort dates** — Feb 26, Mar 1–2 show D1 ≥ 20% (2× average). See [UI export](./pre-subscription-phase-metrics-ga4-ui.md) for full cohort table.

---

## GA4 UI Navigation Guide

How to find every metric from this report in the GA4 web interface (`analytics.google.com`, property `GD Math` / `441470574`).

---

### 1. User Acquisition & Activity

#### Total users, new users, returning users, sessions, engaged sessions

**Reports → Life cycle → Acquisition → Overview**
- Cards at the top: `New users`, `Sessions`, `Engaged sessions`
- Change date range (top-right) to `Jan 25 – Mar 25, 2026`

**Reports → Life cycle → Acquisition → User acquisition**
- Table shows `First user medium/source` with `New users`, `Sessions`, `Engaged sessions`, `Engagement rate`

#### DAU / WAU / MAU trend and DAU/MAU ratio

**Reports → Life cycle → Retention**
- Bottom section: "User activity over time" — bar chart with DAU / WAU / MAU toggles
- The ratio line (`DAU/MAU`) appears as a overlaid metric on the same chart

#### Avg engagement time per user

**Reports → Life cycle → Engagement → Overview**
- Card: `Average engagement time per session` and `Average engagement time per user`
- This is the `5m 11s` equivalent — use "per active user" not "per session"

#### DAU by day (the 14-day trend table)

**Explore → Free form exploration**
1. Create new exploration
2. Dimensions: `Date`
3. Metrics: `Active users`
4. Rows: `Date`
5. Date range: custom `Jan 25 – Mar 25, 2026`
6. Results show daily active user count — same values as the script output

---

### 2. Retention Cohorts (D1 / D7 / D30)

**Reports → Life cycle → Retention**
- Top chart: "User retention by cohort" — shows % of week-0 users still active on week N
- This uses weekly granularity by default

**For day-level D1/D7/D30:**

**Explore → Cohort exploration**
1. New exploration → select `Cohort exploration` technique
2. Cohort inclusion: `First touch` (or `App first open` if available)
3. Return criteria: `Any event` (or filter by a specific event)
4. Cohort granularity: `Daily`
5. Breakdown: leave empty for aggregate
6. Columns show D0, D1, D2 … D30 retention percentages
7. Date range: `Jan 25 – Feb 25` to see a full D30 cohort

> Note: GA4 UI cohort explorer works for this property (confirmed via UI export). D1 = 12.6% from the UI cohort exploration. See [GA4 UI export](./pre-subscription-phase-metrics-ga4-ui.md) for full results.

---

### 3. Paywall Funnel (Subscription reach → Purchase)

**Explore → Funnel exploration**

1. New exploration → select `Funnel exploration` technique
2. Add steps:
   - **Step 1** — name: `Any active user`, condition: Event `session_start`
   - **Step 2** — name: `Reached Subscription`, condition: Event `screen_view` → filter `firebase_screen` **contains** `Subscription`
     *(or Event `SubscriptionOpened` directly if visible in your event list)*
   - **Step 3** — name: `Completed purchase`, condition: Event `GameSubscription`
3. Date range: `Jan 25 – Mar 25, 2026`
4. Breakdown dimension: `Platform` (optional, to see Android vs iOS split)

Expected: ~4,288 → 194 → 0

**Alternatively via standard reports:**

**Reports → Life cycle → Monetization → Overview**
- Shows `Purchasers`, `Revenue`, `ARPU` — will show 0 for `GameSubscription` until a purchase fires, but confirms the event is wired up

---

### 4. Screen Distribution

**Reports → Life cycle → Engagement → Pages and screens**
- Table shows `Screen name` (= `unifiedScreenName`), `Screen views`, `Users`
- Sort by `Users` descending to match the table in this report
- Date range: `Jan 25 – Mar 25, 2026`

> This is the most direct match to Section 4 of this report. You'll see Consent, Onboard, Profile, Home, Level, Complete, Subscription, etc.

**To see the onboarding drop-off visually:**

**Explore → Funnel exploration**
1. Steps: `Consent` → `AgeGate` → `Onboard` → `Profile` → `Home`
2. Condition for each: Event `screen_view` → `firebase_screen` **equals** `<screen name>`

---

### 5. Assessment Completion

**Reports → Life cycle → Engagement → Events**
- Find `assessmentCompleted` in the event list
- Click it to see event count, users, and a time trend
- The user count here matches this report's 149 figure

**To see the drop-off:**

**Explore → Funnel exploration**
1. Step 1: Event `screen_view` where `firebase_screen` = `Onboard` — users who entered onboarding
2. Step 2: Event `assessmentCompleted` — users who finished
3. Shows: 2,564 → 149 (4.0% conversion through onboarding)

---

### 6. Crash Rate

**Reports → Life cycle → Engagement → Events**
- Find `app_exception` in the event list
- Event count = 2, Users = 2

**For more detail:**

**Explore → Free form exploration**
1. Dimensions: `Event name`, `App version`
2. Metric: `Event count`
3. Filter: `Event name` **exactly matches** `app_exception`
4. Shows which app version the 2 crashes occurred on

---

### Quick Reference: Report Section → GA4 UI Path

| Metric | GA4 UI Path |
|---|---|
| Total / new / returning users | Reports → Acquisition → User acquisition |
| DAU/MAU ratio, retention trend | Reports → Life cycle → Retention |
| Avg engagement time per user | Reports → Engagement → Overview |
| DAU by day (custom) | Explore → Free form (Date × Active users) |
| D1/D7/D30 cohort retention | Explore → Cohort exploration |
| Paywall funnel | Explore → Funnel exploration (3-step) |
| Screen views by screen | Reports → Engagement → Pages and screens |
| Onboarding drop-off funnel | Explore → Funnel exploration (5-step) |
| `assessmentCompleted` count | Reports → Engagement → Events |
| Onboarding → assessment funnel | Explore → Funnel exploration (2-step) |
| `app_exception` crashes | Reports → Engagement → Events |
| Purchase revenue (when live) | Reports → Monetization → Overview |
