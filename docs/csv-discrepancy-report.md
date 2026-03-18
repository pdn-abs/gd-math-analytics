# CSV Discrepancy Report: GA4 UI Export vs API Fetch
**Date:** March 12, 2026
**Files Compared:**
- `UserEngagement_Metrics_UI_Export.csv` — GA4 Free-form Exploration export (manual UI export)
- `UserEngagement_Metrics_API_Fetch.csv` — GA4 Data API fetch (script-based)
**Period:** Oct 20, 2025 – Mar 11, 2026 | Stream: GD Math

---

## Side-by-Side Comparison

| Metric | v4.3.19 UI | v4.3.19 API | v4.3.15 UI | v4.3.15 API | v4.3.12 UI | v4.3.12 API | v4.3.7 UI | v4.3.7 API | v4.3.2 UI | v4.3.2 API | v4.3.0 UI | v4.3.0 API | Grand Total UI | Grand Total API | How UI Value is Calculated | How API Value is Calculated | Which to Use |
|--------|------------|-------------|------------|-------------|------------|-------------|-----------|------------|-----------|------------|-----------|------------|----------------|----------------|----------------------------|-----------------------------|--------------|
| **Active Users** | 1,885 | 3,137 | 2,188 | 4,012 | 1,588 | 2,982 | 1,222 | 2,239 | 174 | 351 | 94 | 213 | 6,577 | 12,934 | Users with at least one engaged session (≥10s or key event) | All users with any session (engaged or not) | UI for quality users, API for total reach |
| **Returning Users** | 923 | 1,478 | 1,119 | 2,061 | 827 | 1,609 | 641 | 1,163 | 159 | 328 | 87 | 203 | 3,266 | 6,842 | Native GA4 segment: users whose first session was before report period | Computed as `activeUsers − newUsers` (approximation) | UI (accurate native segment) |
| **Engagement Rate** | 78.41% | 32.59% | 77.87% | 49.96% | 78.08% | 68.71% | 80.74% | 73.44% | 54.86% | 67.45% | 53.14% | 54.06% | 76.50% | 57.70% | Engaged sessions ÷ active users | Engaged sessions ÷ total sessions | UI for user quality, API for session quality |
| **DAU/WAU** | 0.0865 | 0.1827 | 0.0797 | 0.1857 | 0.0774 | 0.1854 | 0.0781 | 0.1829 | 0.0703 | 0.1539 | 0.0701 | 0.1686 | 0.4622 | 0.1831 | Daily average ratio over the full period | End-of-period rolling window ratio | UI per-version values for stickiness trends |
| **WAU/MAU** | 0.3255 | 0.3720 | 0.2653 | 0.3119 | 0.2634 | 0.3086 | 0.2603 | 0.3049 | 0.0929 | 0.1293 | 0.2255 | 0.2616 | 1.4329 | 0.3069 | Daily average ratio over the full period | End-of-period rolling window ratio | UI per-version values for stickiness trends |

> Note: User engagement seconds and engaged sessions are consistent across both sources — these are not affected by the differences described below.

---

## Root Cause Analysis

### 1. Active Users — ~2× Gap

**UI value:** 1,885 (v4.3.19) | **API value:** 3,137 (v4.3.19)

The GA4 Free-form Exploration counts **Active users** as users who had at least one **engaged session** (session ≥ 10 seconds, or triggered a key event). The GA4 Data API metric `activeUsers` counts **all users who had any session**, engaged or not.

The gap represents users who opened the app but did not engage meaningfully (< 10s sessions, bounce sessions, etc.). Depending on the version, this is 40–55% additional users counted in the API.

**Which to use:** UI value is more conservative and closer to "quality users". API value is the true reach figure.

---

### 2. Returning Users — Different Definitions

**UI value:** 923 (v4.3.19) | **API value (computed):** 1,478 (v4.3.19)

The GA4 UI "Returning users" is a **native GA4 user segment** — it identifies users whose first session occurred **before** the report period (Oct 20, 2025). This is the most accurate definition.

The API fetch computes returning users as `activeUsers − newUsers`, which is an approximation. Because `activeUsers` (API) overcounts relative to the UI definition, the derived returning count is also inflated.

**Which to use:** UI value (native GA4 segment) is the accurate definition of returning users.

---

### 3. DAU/WAU and WAU/MAU — Computation Method Differs

**UI DAU/WAU:** 0.0865 (v4.3.19) | **API DAU/WAU:** 0.1827 (v4.3.19)
**UI WAU/MAU:** 0.3255 (v4.3.19) | **API WAU/MAU:** 0.3720 (v4.3.19)

- **GA4 UI exploration**: Computes these as **daily averages over the full period** — for each day in Oct 20–Mar 11, it calculates the ratio and then averages across all days. This is the standard industry interpretation of stickiness.
- **GA4 Data API**: Returns `active1DayUsers`, `active7DayUsers`, `active28DayUsers` as **cumulative rolling window sums over the entire period**. The ratio `active1DayUsers ÷ active7DayUsers` is therefore not a true DAU/WAU — it's the ratio of period-total 1-day windows to 7-day windows, which inflates the value.

The **grand total WAU/MAU of 1.43 in the UI** (mathematically impossible as a ratio) confirms the UI is aggregating the metric incorrectly at the grand-total level by summing the per-version ratio values rather than recomputing from raw totals.

**Which to use:** UI per-version values are more meaningful for stickiness trend analysis. Discard the grand total row ratios from both sources.

---

### 4. Engagement Rate — Different Denominators

**UI value:** 78.41% (v4.3.19) | **API value:** 32.59% (v4.3.19)

- **GA4 UI exploration**: `Engagement rate = Engaged sessions ÷ Active users`
- **GA4 Data API**: `engagementRate = Engaged sessions ÷ Total sessions`

Since one active user can have multiple sessions (`total sessions > active users`), the API denominator is larger, producing a lower rate. The UI rate is higher because it normalises per user, not per session.

Neither is "wrong" — they measure different things:
- UI rate answers: *"What share of users had at least one engaged session?"*
- API rate answers: *"What share of all sessions were engaged?"*

**Which to use:** Depends on the question. For user quality: UI. For session quality: API.

---

## Summary Table

| Metric | How UI Value is Calculated | How API Value is Calculated | Which to Use |
|--------|----------------------------|-----------------------------|--------------|
| **Active Users** | Users with at least one engaged session (≥10s or key event) | All users with any session (engaged or not) | UI for quality users, API for total reach |
| **Returning Users** | Native GA4 segment: users whose first session was before report period | Computed as `activeUsers − newUsers` (approximation) | UI (accurate native segment) |
| **DAU/WAU** | Daily average ratio over the full period | End-of-period rolling window ratio | UI per-version values for stickiness trends |
| **WAU/MAU** | Daily average ratio over the full period | End-of-period rolling window ratio | UI per-version values for stickiness trends |
| **Engagement Rate** | Engaged sessions ÷ active users | Engaged sessions ÷ total sessions | UI for user quality, API for session quality |
| **User Engagement (seconds)** | Same | Same | Either |
| **Engaged Sessions** | Same | Same | Either |

---

## Recommendation

For the Drops impact study, use the **GA4 UI CSV** (`UserEngagement Metrics.csv`) for:
- Active users (quality-adjusted)
- Returning users (accurate segment)
- DAU/WAU and WAU/MAU (properly time-averaged stickiness)
- Engagement rate (user-level quality signal)

Use the **API CSV** (`UserEngagement Metrics v2.csv`) for:
- Total reach and raw session volumes
- Avg Session Duration (not available in UI export)
- Cross-referencing user engagement hours

---

*Both files cover the same period (Oct 20, 2025 – Mar 11, 2026) and GD Math production stream. User Engagement (seconds) values match confirming the same underlying data — only metric definitions and computation methods differ.*
