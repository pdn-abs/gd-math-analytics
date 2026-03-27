# Pre-Subscription Phase Metrics — GA4 Reporting API

> **Data source**: GA4 Data API v1beta (`properties/441470574`)
> **Script**: `scripts/fetch_pre_subscription_metrics_ga4.js`
> **Output**: `data/pre_subscription_metrics_ga4.json`
> **Window**: Jan 25 → Mar 25, 2026
> **Generated**: 2026-03-26
>
> Cross-validate with: [pre-subscription-phase-metrics.md](./pre-subscription-phase-metrics.md)

---

## API Limitations & Trust Notes

| Section | Trust | Reason |
|---|---|---|
| Paywall funnel, screen views | ✅ Authoritative | GA4 processes `screen_view` + custom events; `SubscriptionOpened` is visible here but absent from BigQuery |
| Assessment completion, crashes | ✅ Reliable | Consistent with BigQuery |
| User counts / DAU / sessions | ✅ More accurate | Includes all sessions, not just those with custom events |
| D1/D7/D30 retention | ⛔ Unavailable | GA4 cohort endpoint returns 404 for this property — see BigQuery report |
| WAU/MAU snapshot values | ⚠ Inflated | `active7/28DayUsers` are rolling counters unbounded by the report date range |
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
| DAU/MAU ratio | **0.056** | ⚠ Low — benchmark ≥ 0.20 |

> ⚠ WAU (38,486) and MAU (124,623) snapshots are rolling-window counters across all time, not bounded to this window. They significantly exceed the 60-day total user count of 4,288. Use only for directional DAU/MAU ratio, not as absolute counts.

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

⛔ **Not available via GA4 API for this property.** The `runCohortReport` endpoint returns 404.

See [pre-subscription-phase-metrics.md](./pre-subscription-phase-metrics.md) for D1/D7/D30 data (D1 = 6.5%, D7 = 2.4%, D30 = 2.0% — all critical).

---

## 3. Paywall Funnel

| Step | Users | Rate |
|---|---|---|
| All users | 4,288 | 100% |
| Reached Subscription screen | **194** | **4.5%** |
| Completed purchase (`GameSubscription` event) | **0** | **0%** |

> Note: `GameSubscription` counts all event types — the GA4 API cannot filter by event parameters. Zero is still a definitive signal; no subscription events of any kind fired.

**Funnel**: All users — (4.5%) → Paywall — (0%) → Purchase

**Interpretation**: The paywall is being surfaced (194 users, 4.5%) but zero convert. The problem is **conversion quality**, not visibility — though 4.5% reach rate is still below the ≥15% target.

**Immediate actions**:
1. Review subscription screen UX — pricing clarity, plan descriptions, trust signals (ratings, reviews)
2. Test the Google Play billing flow end-to-end on a real device
3. Add a paywall trigger on `Complete` screen (post-level) and `Profile` screen (both have high reach)
4. A/B test plan ordering (monthly vs annual vs lifetime visible first)

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

1. **🔴 Fix conversion on subscription screen** — 194 users reached it; zero converted. Review pricing, trust signals, CTA, and Google Play billing flow.
2. **🔴 Increase paywall reach rate (4.5% → 15%+)** — `Complete` (4,020 views) and `Profile` (4,320 views) are underutilised trigger points.
3. **🔴 Fix D1 retention** — See [BigQuery report](./pre-subscription-phase-metrics.md). 94% of users don't return after day 1.
4. **🟡 Onboarding drop-off** — 2,564 visit `Onboard`; 149 complete assessment (4.0%). Investigate skip/abandon path.
5. **🟢 Target engaged users** — Level + Complete screens show 1,194 active players. Post-level paywall on `Complete` reaches the highest-intent users.
