# Production vs Internal Testing — Segment Analysis Plan

> **Period**: Jan 25 → Mar 25, 2026
> **Dataset**: `analytics_441470574` · **Project**: `gd-math-71c48`
> **Location**: `asia-south1`
> **Purpose**: Re-run all key metrics from the pre-subscription final report separated by app track so that internal tester activity does not contaminate production user figures.

---

## Version → Track Mapping

### Production builds active during the analytics window

| Build | Version | Active from | Active until |
|---|---|---|---|
| 65 | v4.3.12 | Jan 25, 2026 | Jan 28, 2026 |
| 68 | v4.3.15 | Jan 28, 2026 | Feb 28, 2026 |
| 72 | v4.3.19 | Feb 28, 2026 | Mar 25, 2026 |

### Internal Testing builds active during the analytics window

| Build | Version | Active from | Active until |
|---|---|---|---|
| 71 | v4.3.18 | Jan 25, 2026 | Feb 26, 2026 |
| 73 | v4.3.20 | Feb 26, 2026 | Mar 25, 2026 |

---

## Segment Classification Method

Each user is classified by the app version they were **first seen on** in the window:

- **production** → `v4.3.12`, `v4.3.15`, `v4.3.19`
- **internal** → `v4.3.18`, `v4.3.20`
- **other** → any older build seen re-engaging during the window (excluded from both segment reports)

Users who migrated from internal → production mid-window fall into `other` and are excluded. This prevents any cross-contamination and matches the methodology already in use in `query_levelplayer_retention.js`.

---

## Metrics to Re-run Per Segment

### 1 — User Acquisition & Activity

### 1 — User Acquisition & Activity

Outputs per track: MAU, new users, active users, total sessions, avg DAU.

---

### 2 — D1 / D7 / D30 Retention

Cohort anchor: `first_open` event (GA4 methodology). Outputs per track: cohort size, D1/D7/D30 eligible and retained counts. Divide retained ÷ eligible for each day to get the rate.

---

### 3 — Paywall Funnel

Outputs per track: total users, unique users who reached the paywall (`SubscriptionOpened`), total paywall open events, completed purchases (`GameSubscription` type=Created).

> ⚠ `SubscriptionOpened` may show 0 in BigQuery — cross-check against GA4 UI with a production audience filter if counts appear as zero.

---

### 4 — Gameplay Funnel (Segment Funnel)

Outputs per track: users who loaded a level, level load events, users/events for `segmentStarted` / `segmentCompleted` / `segmentDropped`, segment completion %.

---

### 5 — App Usage by Skill Age

Outputs per track × skill age: users, total levels, avg levels/user, seg started/completed/dropped, completion %, avg seg/user.

---

### 6 — Retention by Skill Age (level players only)

Same D1/D7/D30 methodology as Query 2, broken down by `track` × `skill_age`. Only users who fired at least one `segmentStarted` are included.

---

### 7 — Level Failure & Drop Analysis by Skill Age

Outputs per track × skill age: started, passed, failed, dropped, fail%, drop%, avg wrong moves on fail.

---

### 8 — Top 25 High Failure+Drop Levels

Scoped to production only (run separately for internal). Filters to levels with ≥ 20 starts. Outputs: level, branch, skill age, users, started/passed/failed/dropped, fail+drop%.

---

### 9 — Onboarding / Assessment Completion

Outputs per track: total users, users who completed assessment, assessment events, completion %.

---

### 10 — Crash / Stability

Outputs per track: total users, `app_exception` events, users affected, crash rate %.

---

## Expected Insights When Results Are In

### What the production-only numbers will clarify

| Metric | Combined report | Expected production shift | Reason |
|---|---|---|---|
| MAU | 3,510 | Lower | Internal testers removed |
| D1 retention | 12.6% (GA4 UI) | Likely similar or slightly lower | Internal testers inflate daily return rate |
| D7 / D30 retention | 4.0% / 1.8% | Will drop for internal | Testers return far more often than real users |
| Paywall reach (194 users) | 5.05% | Will drop in raw count | Some of the 194 are internal testers |
| 8Y cohort depth (23 users, 106 avg levels) | In combined | Expected to collapse or vanish | Almost certainly internal testers/developers |
| Segment completion rate | 56.5% | Will change | 8Y outlier artificially inflates pass counts |
| Total segmentStarted | 292,898 | Will drop | 8Y users alone account for 41,520 events |
| Assessment completion | 4.3% | May improve slightly | Internal testers likely skip assessment |

### What the internal-testing-only numbers will confirm

1. **Whether 8Y outlier users are internal testers** — if the 23 users with 106 avg levels appear entirely in the `internal` track, this is confirmed.
2. **How many of the 194 paywall-reach users are testers** — any internal tester reaching the paywall is not a real conversion signal.
3. **Whether any internal testers contributed app_exception events** — unlikely but worth confirming.

---

## Notes on Methodology

- **Version classification by first event**: a user seen on build 73 (internal) one day and build 72 (production) the next day is classified as `internal`. This is conservative — it prevents any internal-testing activity from contaminating production metrics.
- **`other` track**: builds not active during the Jan 25 – Mar 25 window (all older versions). These appear only if a user had a prior install-event before the window and is seen again. They are excluded from both segment reports.
- **GA4 UI retention figures cannot be filtered by version** in the standard UI without creating a custom audience segment. The BigQuery D1/D7/D30 figures from Query 2 above are therefore the only way to get production-scoped retention.
- **Subscriptions confirmed zero** across all sources. No version filter changes this.
