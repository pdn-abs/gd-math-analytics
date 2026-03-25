# Overall App Metrics — GD Math
**Period: Oct 20, 2025 – Mar 11, 2026 (143 days)**

## Table of Contents
1. [Metrics Summary](#metrics-summary)
2. [How Each Metric Is Calculated](#how-each-metric-is-calculated)
   - [User Metrics](#user-metrics)
   - [Session Metrics](#session-metrics)
   - [Engagement Duration Metrics](#engagement-duration-metrics)
   - [Activity Ratio Metrics](#activity-ratio-metrics)
3. [API Notes](#api-notes)

## Metrics Summary

| Metric | Value | Notes |
|---|---|---|
| **Active Users** | 7,598 | Unique engaged users over the period |
| **Total Users** | 8,094 | All users incl. one-time openers — matches GA4 UI |
| **New Users** | 6,949 | First-time installs |
| **Returning Users** | 1,145 | ~14% return rate |
| **Sessions** | 20,319 | Total sessions across all users |
| **Engaged Sessions** | 15,436 | 76% of all sessions are meaningfully engaged |
| **WAU/MAU** | 0.317 | Users active weekly vs monthly |
| **Sessions per Active User** | 2.67 | Per engaged user |
| **Sessions per User** | 2.51 | Per all users |
| **Avg Duration per Active User** | 384s (~6.4 min) | Per engaged user |
| **Avg Duration per User** | 361s (~6.0 min) | Across all users |

---

## How Each Metric Is Calculated

### User Metrics

**Total Users — 8,094**
GA4 assigns every device a unique `client_id` (stored in a cookie/app instance). Total Users = count of distinct `client_id`s that fired **any event** at least once during the period. If the same person uses two devices, they count as 2.

**Active Users — 7,598**
Subset of Total Users who had at least one **engaged session** (session lasting >10s, or triggered a conversion, or had 2+ screen views). Passive opens that immediately close don't qualify.

**New Users — 6,949**
Users whose **first ever** event in this GA4 property happened within the date range. GA4 tracks this via the `first_open` / `first_visit` event timestamp.

**Returning Users — 1,145**
Simply: `Total Users (8,094) − New Users (6,949) = 1,145`. These are users whose first event predates Oct 20, 2025 but who came back during the period.

---

### Session Metrics

**Sessions — 20,319**
A session starts when a user opens the app and ends after **30 minutes of inactivity**. GA4 counts every individual session across all users over the 143 days. One user can have many sessions.

**Engaged Sessions — 15,436**
Sessions that meet **at least one** of:
- Lasted longer than 10 seconds
- Triggered a conversion event
- Had 2 or more screen views

76% of all sessions (15,436 / 20,319) are engaged.

**Sessions per Active User — 2.67**
$$\frac{\text{Sessions}}{\text{Active Users}} = \frac{20{,}319}{7{,}598} = 2.67$$
Average number of times each engaged user opened the app over 143 days.

**Sessions per User — 2.51**
$$\frac{\text{Sessions}}{\text{Total Users}} = \frac{20{,}319}{8{,}094} = 2.51$$
Same but divided across all users including those who never fully engaged.

---

### Engagement Duration Metrics

**Avg Session Duration (s) — 7,992s (raw API value)**
GA4 computes this as `userEngagementDuration / engagedSessions` internally. The raw value returned over a long date range is an accumulated sum — **not meaningful on its own**, which is why the per-user calculations below are used instead.

**Avg Duration per Active User — 384s (~6.4 min)**
$$\frac{\text{Total Engagement Duration (all sessions summed)}}{\text{Active Users}} = \frac{2{,}923{,}039\text{s}}{7{,}598} = 384\text{s}$$
`userEngagementDuration` is the raw sum of all in-focus time across every session. Dividing by Active Users gives average total time each engaged user spent in the app over the whole 143-day period.

**Avg Duration per User — 361s (~6.0 min)**
$$\frac{\text{Total Engagement Duration}}{\text{Total Users}} = \frac{2{,}923{,}039\text{s}}{8{,}094} = 361\text{s}$$
Same numerator but spread across all users including less-engaged ones — so slightly lower.

---

### Activity Ratio Metrics

**WAU/MAU — 0.317**
$$\frac{\text{active7DayUsers}}{\text{active28DayUsers}} = \frac{81{,}557}{256{,}901} = 0.317$$
`active7DayUsers` and `active28DayUsers` are **rolling window** metrics — GA4 accumulates them daily across the entire date range (143 days × rolling windows), which is why the raw numbers are large. The **ratio** is still valid because both are inflated by the same factor, and it reflects how consistently users return week-over-week relative to the monthly base. 0.317 means ~32% of monthly active users are also active in any given week.

---

## API Notes

- **Rolling window metrics** (`active7DayUsers`, `active28DayUsers`) must be fetched in a **separate API call** from `totalUsers`/`activeUsers`. Mixing them in the same query causes GA4 to apply rolling window aggregation to all metrics, inflating counts by ~2x. See `fetch_overall_metrics.js` for implementation.
- All data filtered to `streamName = 'GD Math'` only.
- No `appVersion` dimension used — querying by version splits users per version and causes double-counting of users who upgraded across versions.
