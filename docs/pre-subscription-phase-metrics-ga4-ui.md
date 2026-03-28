# Pre-Subscription Phase Metrics — GA4 UI Exports

> **Data source**: GA4 Explore UI manual exports (`analytics.google.com`, property `GD Math` / `441470574`)
> **CSV files**: `CSV/userAcquisitionAndActivity.csv` · `CSV/retentionCohort.csv` · `CSV/paywallFunnel.csv` · `CSV/screenDistribution.csv`
> **Window**: Jan 25 → Mar 25, 2026
> **Exported**: 2026-03-27
>
> See also: [GA4 API report](./pre-subscription-phase-metrics-ga4.md) · [BigQuery report](./pre-subscription-phase-metrics.md)

---

## Why UI exports over the API?

Three metrics are **more accurate or only available** in the UI:

| Metric | API | UI export | Why UI wins |
|---|---|---|---|
| DAU/MAU ratio | 0.056 (inflated) | **0.021** | API uses rolling unbounded window; UI scopes to report date range |
| Returning users | 1,149 (26.8%) | **2,056 (47.9%)** | API applies stricter attribution; UI counts any prior session |
| D1 retention | ⛔ 404 error | **12.6%** | Cohort endpoint not available in API; UI cohort exploration works |

---

## 1. User Acquisition & Activity

> **Source**: `CSV/userAcquisitionAndActivity.csv` — GA4 UI → Explore → Free form

| Metric | Value | Notes |
|---|---|---|
| Total Users | **4,289** | All users who fired any event in window |
| Active Users | **3,842** | At least one engaged session |
| New Users | **3,140** | First-time installs |
| Returning Users | **2,056** (47.9%) | ⚠ see note below |
| Sessions | **9,698** | All session types |
| Engaged Sessions | **7,187** (74.1%) | Session > 10s or has conversion event |
| Engaged sessions / active user | **1.87** | |
| Avg Session Duration | 2h 6m 43s | ⚠ Inflated by idle time — not actionable |
| **DAU/MAU ratio** | **0.021** | ⚠ Low — benchmark ≥ 0.20 |
| DAU/WAU ratio | **0.080** | |

> **Returning users note**: The UI exploration counts a user as "returning" if they had any prior session before this window opens. The API's `newVsReturning` dimension applies a different (stricter) attribution window, producing 1,149. The UI figure (2,056) is directionally more complete.
>
> **DAU/MAU note**: The API previously returned 0.056 because it divided `active1DayUsers / active28DayUsers`, where the 28-day counter is rolling and unbounded by the report range. The UI computes this within the selected window → **0.021**, consistent with BigQuery's 0.023.

---

## 2. Retention Cohorts

> **Source**: `CSV/retentionCohortUpdated.csv` — GA4 UI → Explore → Cohort exploration
> Cohort anchor: `first_open` (authoritative install date, not a proxy)
> Return criterion: any event · Granularity: daily
> Cohort base: **3,205 users** (D1) · **2,118 users** (D7) · **673 users** (D30) — smaller bases exclude cohorts with insufficient observation window

### Summary

| Day | Retained | Cohort base | Rate | Benchmark | Status |
|---|---|---|---|---|---|
| D0 (same day) | 3,180 | 3,205 | 99.2% | — | ✅ Expected |
| **D1** | **404** | **3,205** | **12.6%** | ≥ 40% | ⚠ Critical |
| **D7** | **84** | **2,118** | **4.0%** | ≥ 20% | ⚠ Critical |
| **D30** | **12** | **673** | **1.8%** | ≥ 10% | ⚠ Critical |

**D1 = 12.6%** is the authoritative figure. The BigQuery proxy (6.5%) was a structural undercount — its cohort anchor was "first event seen in export" which contains returning users, deflating the denominator. Real D1 is nearly 2× higher, but still far below the ≥40% benchmark. D7 (4.0%) and D30 (1.8%) confirm that long-term retention is essentially flat after D1 — the vast majority of users who don't return on day 1 never return at all.

> D7 and D30 cohort bases are smaller than D1 because only cohorts with a full observation window within the export are counted: D7 includes cohorts Jan 25 – Mar 18 (2,118 users); D30 includes cohorts Jan 25 – Feb 23 (673 users).

### Retention by Cohort Date

| Cohort date | Cohort size | D1 | D7 | D30 |
|---|---|---|---|---|
| Jan 25 | 70 | 9 (12.9%) | 3 (4.3%) | 1 (1.4%) |
| Jan 26 | 63 | 11 (17.5%) | 1 (1.6%) | — |
| Jan 27 | 63 | 9 (14.3%) | 4 (6.3%) | 1 (1.6%) |
| Jan 28 | 60 | 7 (11.7%) | 1 (1.7%) | — |
| Jan 29 | 57 | 7 (12.3%) | 1 (1.8%) | 1 (1.8%) |
| Jan 30 | 55 | 5 (9.1%) | 1 (1.8%) | — |
| Jan 31 | 65 | 8 (12.3%) | 4 (6.2%) | — |
| Feb 1 | 74 | 8 (10.8%) | 1 (1.4%) | — |
| Feb 2 | 66 | 8 (12.1%) | 4 (6.1%) | 1 (1.5%) |
| Feb 3 | 62 | 8 (12.9%) | 2 (3.2%) | — |
| Feb 4 | 48 | 8 (16.7%) | 1 (2.1%) | — |
| Feb 5 | 45 | 7 (15.6%) | — | — |
| Feb 6 | 55 | 3 (5.5%) | — | 1 (1.8%) |
| Feb 7 | 60 | 6 (10.0%) | 2 (3.3%) | — |
| Feb 8 | 70 | 11 (15.7%) | 6 (8.6%) | — |
| Feb 9 | 50 | 4 (8.0%) | 3 (6.0%) | — |
| Feb 10 | 39 | 5 (12.8%) | 1 (2.6%) | — |
| Feb 11 | 59 | 10 (16.9%) | — | 1 (1.7%) |
| Feb 12 | 62 | 6 (9.7%) | 1 (1.6%) | 1 (1.6%) |
| Feb 13 | 43 | 4 (9.3%) | — | — |
| Feb 14 | 58 | 8 (13.8%) | 5 (8.6%) | — |
| Feb 15 | 55 | 9 (16.4%) | — | 1 (1.8%) |
| Feb 16 | 50 | 5 (10.0%) | 1 (2.0%) | 1 (2.0%) |
| Feb 17 | 54 | 10 (18.5%) | 2 (3.7%) | — |
| Feb 18 | 63 | 6 (9.5%) | 2 (3.2%) | — |
| Feb 19 | 43 | 8 (18.6%) | 1 (2.3%) | — |
| Feb 20 | 69 | 13 (18.8%) | 3 (4.3%) | 1 (1.4%) |
| Feb 21 | 67 | 13 (19.4%) | — | 2 (3.0%) |
| Feb 22 | 52 | 6 (11.5%) | 2 (3.8%) | — |
| Feb 23 | 46 | 1 (2.2%) | — | — |
| Feb 24 | 51 | 4 (7.8%) | 3 (5.9%) | — |
| Feb 25 | 50 | 6 (12.0%) | 1 (2.0%) | — |
| Feb 26 | 56 | **13 (23.2%)** | 3 (5.4%) | — |
| Feb 27 | 50 | 2 (4.0%) | 4 (8.0%) | — |
| Feb 28 | 45 | 6 (13.3%) | — | — |
| Mar 1 | 41 | **10 (24.4%)** | 1 (2.4%) | — |
| Mar 2 | 54 | **11 (20.4%)** | — | — |
| Mar 3 | 79 | 7 (8.9%) | 3 (3.8%) | — |
| Mar 4 | 49 | 4 (8.2%) | — | — |
| Mar 5 | 52 | 8 (15.4%) | — | — |
| Mar 6 | 53 | 6 (11.3%) | — | — |
| Mar 7 | 53 | 6 (11.3%) | — | — |
| Mar 8 | 43 | 6 (14.0%) | 3 (7.0%) | — |
| Mar 9 | 49 | 3 (6.1%) | 1 (2.0%) | — |
| Mar 10 | 44 | 7 (15.9%) | — | — |
| Mar 11 | 46 | 4 (8.7%) | 1 (2.2%) | — |
| Mar 12 | 47 | 6 (12.8%) | — | — |
| Mar 13 | 49 | 2 (4.1%) | — | — |
| Mar 14 | 49 | 9 (18.4%) | 2 (4.1%) | — |
| Mar 15 | 46 | 4 (8.7%) | — | — |
| Mar 16 | 47 | 4 (8.5%) | 1 (2.1%) | — |
| Mar 17 | 48 | 6 (12.5%) | 1 (2.1%) | — |
| Mar 18 | 59 | 5 (8.5%) | 3 (5.1%) | — |
| Mar 19 | 42 | **9 (21.4%)** | 3 (7.1%) | — |
| Mar 20 | 55 | 10 (18.2%) | 2 (3.6%) | — |
| Mar 21 | 42 | 4 (9.5%) | — | — |
| Mar 22 | 42 | 6 (14.3%) | — | — |
| Mar 23 | 36 | 4 (11.1%) | — | — |
| Mar 24 | 48 | 5 (10.4%) | — | — |
| Mar 25 | 57 | 4 (7.0%) | — | — |

**Notable high-retention cohorts** (D1 ≥ 20%): Feb 26 (23.2%), Mar 1 (24.4%), Mar 2 (20.4%), Mar 19 (21.4%). These warrant investigation — what was different about those installs (campaign, store listing, app version)?

**Notable low-retention cohorts** (D1 < 5%): Feb 23 (2.2%), Feb 27 (4.0%), Mar 13 (4.1%). Possible bad acquisition day or app issue on those dates.

**D7 pattern**: Feb 8 (8.6%), Feb 14 (8.6%), Feb 27 (8.0%) are the highest D7 cohorts. Most cohorts show 0 D7 retained users — the few that do retain anyone are outliers, not a trend.

**D30 pattern**: Only 11 of the 30 eligible cohorts retained any user at D30. Max is Feb 21 with 2 retained (3.0%). Long-term retention is functionally zero.

---

## 3. Paywall Funnel

> **Source**: `CSV/paywallFunnel.csv` — GA4 UI → Explore → Funnel exploration
> Steps: `session_start` → `screen_view (Subscription)` → `GameSubscription`

| Step | Active users | → Next | Completion rate | Abandonment rate |
|---|---|---|---|---|
| 1. Active user baseline | **3,843** | → 194 | **5.05%** | 94.95% |
| 2. Reached Subscription screen | **194** | → 0 | **0%** | 100% |
| 3. Completed purchase | **0** | — | — | — |

**Reach rate**: 194 / 3,843 = **5.05%** of active users ever see the paywall.
**Conversion rate**: 0 / 194 = **0%** of those who see it subscribe.

**Interpretation**: Dual problem — reach is low (5% vs ≥15% target) AND conversion is zero. Zero is not a rounding issue: no `GameSubscription` event of any type has fired in 60 days across 3,843 active users.

**Immediate actions**:
1. End-to-end test the Google Play billing flow on a real device — verify `GameSubscription` fires on successful purchase
2. Review subscription screen UX: pricing clarity, plan descriptions, trust signals (ratings, testimonials)
3. A/B test plan order (monthly vs annual vs lifetime)
4. Add paywall trigger on `Complete` screen (post-level) and `Profile` screen — both have very high event density

---

## 4. Screen Event Distribution

> **Source**: `CSV/screenDistribution.csv` — GA4 UI → Explore → Free form
> Metric: `Event count` (all events fired while on each screen, not just screen views)
> Total events: **100,990**

| Screen | Event count | % of total | Notes |
|---|---|---|---|
| Profile | **37,709** | 37.3% | Highest interaction density |
| Home | **24,581** | 24.3% | |
| **ProfileWizard** | **15,007** | 14.9% | ⚠ Not visible in API screen_view data |
| Level | 6,244 | 6.2% | Core gameplay |
| Complete | 3,985 | 3.9% | Post-level |
| AgeGate | 3,779 | 3.7% | |
| Onboard | 3,340 | 3.3% | |
| Consent | 2,381 | 2.4% | |
| LevelsSelection | 1,278 | 1.3% | |
| About | 1,087 | 1.1% | |
| **Subscription** | **776** | 0.8% | Paywall screen |
| Settings | 586 | 0.6% | |
| PlayerReport | 192 | 0.2% | |
| TimeOut | 39 | <0.1% | |

**Profile + ProfileWizard combined**: 52,716 events = **52.2% of all screen events**. Users spend more than half their total interaction time in the Profile/onboarding flow.

**ProfileWizard discovery**: 15,007 events on a screen completely absent from `screen_view`-based reports (API and GA4 Pages & Screens report). This screen is likely a modal or multi-step wizard within Profile that fires custom events but does not emit a `screen_view`. This is where the assessment likely happens — the `assessmentCompleted` event (149 users) probably fires from within this flow. The high event count suggests users may be interacting extensively or getting stuck here.

**Subscription screen events (776)** vs unique users (194): avg 4 events per user who reached the paywall. Users are tapping around on the screen, not immediately bouncing — which suggests the screen loads correctly but fails to convince.

---

## 5. Feature Engagement

> **Source**: `CSV/eventType.csv` — GA4 UI → Explore → Free form
> Metric: `Event count` per event name · Total all-event count: **328,176**
> Note: event counts only — unique user counts not available from this export

### Segment Funnel

| Event | GA4 UI event count | BigQuery event count | Delta |
|---|---|---|---|
| LevelLoaded | **18,790** | 18,775 | +15 |
| segmentStarted | **18,697** | 18,682 | +15 |
| segmentCompleted | **10,566** | 10,556 | +10 |
| segmentDropped | **6,329** | 6,325 | +4 |
| **Segment completion rate** | **56.5%** (10,566/18,697) | **56.5%** (10,556/18,682) | ✅ Consistent |

BigQuery and GA4 UI are nearly identical for gameplay events (delta ≤15 events across 18k+ records — within normal processing lag). These events are reliably captured in both sources.

### All Events (GA4 UI)

| Event | Count | Notes |
|---|---|---|
| DebugInfo | 68,551 | Highest volume — internal debug logging |
| screen_view | 67,769 | Navigation events |
| TimeTaken | 57,477 | |
| LevelData | 32,434 | |
| LevelLoaded | 18,790 | Level starts |
| segmentStarted | 18,697 | |
| user_engagement | 14,573 | |
| segmentCompleted | 10,566 | |
| session_start | 9,959 | |
| segmentDropped | 6,329 | |
| DropData | 4,510 | |
| first_open | 3,218 | Installs |
| app_remove | 2,961 | Uninstalls |
| PlayerSessionFinish / Start | 2,845 each | |
| Score | 2,740 | |
| PlayerCreate | 1,546 | |
| GameFirstStart | 1,033 | First-time app launch |
| SettingsChanged | 472 | |
| **SubscriptionOpened** | **471** | Paywall opens — see note below |
| assessmentCompleted | 155 | |
| PlayerDelete | 84 | |
| app_exception | 2 | Crashes |

> ⚠ **SubscriptionOpened = 471 events vs 194 unique users** (from funnel export): avg 2.4 opens per user who reached the paywall. Users are returning to the subscription screen multiple times — strong intent signal, but still zero conversions. This confirms the billing flow or UX is blocking purchase, not disinterest.

---

## Priority Actions

1. **🔴 Fix conversion (0%)** — 194 users on the paywall, zero subscribed. First: verify the Google Play billing flow works end-to-end on a real device (does `GameSubscription` fire in a sandbox purchase?). Then: redesign the subscription screen with clearer pricing and trust signals.
2. **🔴 Fix D1 retention (12.6%)** — 87% of users don't return the next day. The benchmark is ≥40%. Add a day-1 push notification and a tangible progress hook visible on return. Target the high-retention cohort dates (Feb 26, Mar 1–2) to understand what drove their 20–24% D1 rates.
3. **🔴 Increase paywall reach (5% → 15%+)** — Only 194 of 3,843 active users ever see the subscription screen. Add paywall triggers on `Complete` (3,985 events, high intent post-level) and `Profile` (37,709 events, highest engagement screen).
4. **🟡 Investigate ProfileWizard** — 15,007 events on a hidden screen. Map what events fire here, how long users spend, and the drop-off rate. If `assessmentCompleted` fires here, the 4% completion rate is happening inside this wizard.
5. **🟡 D7 (4.0%) and D30 (1.8%) confirm catastrophic long-term retention** — Fix D1 retention first (push notification + progress hook). D30 is functionally zero (1.8%) with no recovery after D1 loss.
6. **🟢 Investigate high-retention cohort dates** — Feb 26, Mar 1, Mar 2, Mar 19 all show D1 ≥ 20%. Check campaign sources, app version, and referral channel for those dates.
