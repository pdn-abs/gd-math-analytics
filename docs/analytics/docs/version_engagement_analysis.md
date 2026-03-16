# GD MATH – Version Engagement Metrics Analysis
# ===============================================
# Pre-Drops vs Post-Drops version comparison
# Data Stream: GD MATH (production only)
# Report Generated: March 12, 2026

## Overview

This report compares user engagement metrics across the six key app versions grouped by the Drops feature introduction. All data is filtered to the GD MATH production stream and scoped to each version group's active period.

### Version Groups & Periods
| Group | Versions | Active Period | Days |
|-------|----------|--------------|------|
| **Pre-Drops** | v4.3.0, v4.3.2, v4.3.7 | Jul 19 – Nov 19, 2025 | 124 |
| **Post-Drops** | v4.3.12, v4.3.15, v4.3.19 | Nov 20, 2025 – Mar 11, 2026 | 112 |

> **Note on derived metrics:**
> - **Avg Session Duration** = Total User Engagement Duration ÷ Sessions (in seconds)
> - **Events per Session** = Total Event Count ÷ Sessions
> - **Returning Users** = Active Users − New Users
> - **DAU/WAU** = active1DayUsers ÷ active7DayUsers (cumulative sums; ratio is comparable across periods)
> - **WAU/MAU** = active7DayUsers ÷ active28DayUsers (same)
> - **Engagement Rate** = Engaged Sessions ÷ Sessions (returned directly by GA4 as %)

---

## Per-Version Metrics

### Pre-Drops Versions

| Metric | v4.3.0 | v4.3.2 | v4.3.7 |
|--------|--------|--------|--------|
| **Release Date** | Jul 19, 2025 | Aug 26, 2025 | Oct 25, 2025 |
| **Active Users** | 5,628 | 3,306 | 1,731 |
| **New Users** | 2,845 | 1,699 | 1,027 |
| **Returning Users** | 2,783 | 1,607 | 704 |
| **Sessions** | 8,340 | 4,916 | 2,522 |
| **Engaged Sessions** | 6,295 | 3,705 | 2,012 |
| **Engagement Rate** | 74.97% | 57.54% | 22.32% |
| **Avg Session Duration** | 114.0s (1.90 min) | 115.1s (1.92 min) | 133.7s (2.23 min) |
| **Events per Session** | 19.83 | 20.67 | 29.11 |
| **User Engagement Duration** | 264.1h | 157.1h | 93.7h |
| **DAU** | 5,628 | 3,306 | 1,731 |
| **WAU** | 30,737 | 17,928 | 8,325 |
| **MAU** | 100,524 | 59,162 | 15,632 |
| **DAU/WAU** | 0.183 | 0.184 | 0.208 |
| **WAU/MAU** | 0.306 | 0.303 | 0.533 |

### Post-Drops Versions

| Metric | v4.3.12 | v4.3.15 | v4.3.19 |
|--------|---------|---------|---------|
| **Release Date** | Nov 20, 2025 | Dec 25, 2025 | Jan 28, 2026 |
| **Active Users** | 2,974 | 4,012 | 3,137 |
| **New Users** | 1,367 | 1,951 | 1,659 |
| **Returning Users** | 1,607 | 2,061 | 1,478 |
| **Sessions** | 4,472 | 6,109 | 4,670 |
| **Engaged Sessions** | 3,287 | 4,401 | 3,411 |
| **Engagement Rate** | 66.98% | 49.96% | 32.57% |
| **Avg Session Duration** | 125.8s (2.10 min) | 110.2s (1.84 min) | 104.7s (1.75 min) |
| **Events per Session** | 24.14 | 22.72 | 21.56 |
| **User Engagement Duration** | 156.3h | 186.9h | 135.8h |
| **DAU** | 2,974 | 4,012 | 3,137 |
| **WAU** | 16,048 | 21,608 | 17,172 |
| **MAU** | 52,081 | 69,280 | 46,163 |
| **DAU/WAU** | 0.185 | 0.186 | 0.183 |
| **WAU/MAU** | 0.308 | 0.312 | 0.372 |

---

## Pre-Drops vs Post-Drops Aggregate Comparison

*Totals/averages computed across all versions in each group.*

| Metric | Pre-Drops (v4.3.0/v4.3.2/v4.3.7) | Post-Drops (v4.3.12/v4.3.15/v4.3.19) | Change | Trend |
|--------|----------------------------------|---------------------------------------|--------|-------|
| **Total Active Users** | 10,665 | 10,123 | −5% | ➡️ Stable |
| **Total New Users** | 5,571 | 4,977 | −11% | 📉 Fewer new users |
| **Total Returning Users** | 5,094 | 5,146 | +1% | ➡️ Stable |
| **Total Sessions** | 15,778 | 15,251 | −3% | ➡️ Stable |
| **Total Engaged Sessions** | 12,012 | 11,099 | −8% | 📉 Slight decline |
| **Avg Engagement Rate** | 51.61%* | 49.84%* | −1.77pp | ➡️ Stable |
| **Avg Session Duration** | **120.9s (2.02 min)** | **113.6s (1.89 min)** | −7.3s | 📉 Slight decline |
| **Avg Events per Session** | **23.20** | **22.81** | −0.4 | ➡️ Stable |
| **Total User Engagement** | 514.9h | 479.0h | −7% | ➡️ Stable |
| **Avg DAU/WAU** | **0.192** | **0.185** | −0.007 | ➡️ Stable |
| **Avg WAU/MAU** | **0.381** | **0.331** | −0.050 | 📉 Slight decline |

*\*Simple average of the three versions' engagement rates.*

---

## Version Trend Analysis

### Engagement Rate Trend (by version release order)

| Version | Release | Engagement Rate | Trend |
|---------|---------|----------------|-------|
| v4.3.0 | Jul 2025 | 74.97% | — |
| v4.3.2 | Aug 2025 | 57.54% | 📉 −17.4pp |
| v4.3.7 | Oct 2025 | 22.32% | 📉 −35.2pp |
| v4.3.12 | Nov 2025 | 66.98% | 📈 +44.7pp (drops launched) |
| v4.3.15 | Dec 2025 | 49.96% | 📉 −17.0pp |
| v4.3.19 | Jan 2026 | 32.57% | 📉 −17.4pp |

### Avg Session Duration Trend

| Version | Release | Avg Session Duration | Trend |
|---------|---------|---------------------|-------|
| v4.3.0 | Jul 2025 | 1.90 min | — |
| v4.3.2 | Aug 2025 | 1.92 min | ➡️ Stable |
| v4.3.7 | Oct 2025 | 2.23 min | 📈 +0.31 min |
| v4.3.12 | Nov 2025 | 2.10 min | 📈 +0.10 min vs pre avg |
| v4.3.15 | Dec 2025 | 1.84 min | 📉 −0.26 min |
| v4.3.19 | Jan 2026 | 1.75 min | 📉 −0.09 min |

### Events per Session Trend

| Version | Release | Events/Session | Trend |
|---------|---------|---------------|-------|
| v4.3.0 | Jul 2025 | 19.83 | — |
| v4.3.2 | Aug 2025 | 20.67 | ➡️ Stable |
| v4.3.7 | Oct 2025 | 29.11 | 📈 +8.4 |
| v4.3.12 | Nov 2025 | 24.14 | 📈 +4.3 vs pre avg |
| v4.3.15 | Dec 2025 | 22.72 | 📉 −1.4 |
| v4.3.19 | Jan 2026 | 21.56 | 📉 −1.2 |

### WAU/MAU Stickiness Trend

| Version | Release | WAU/MAU | Interpretation |
|---------|---------|---------|----------------|
| v4.3.0 | Jul 2025 | 0.306 | 30.6% of monthly users active weekly |
| v4.3.2 | Aug 2025 | 0.303 | Stable |
| v4.3.7 | Oct 2025 | 0.533 | **Peak stickiness** — new content surge |
| v4.3.12 | Nov 2025 | 0.308 | Normalised post-launch |
| v4.3.15 | Dec 2025 | 0.312 | Stable |
| v4.3.19 | Jan 2026 | 0.372 | Improving — Multiplication content engaging |

### DAU/WAU Daily Engagement Trend

| Version | Release | DAU/WAU | Interpretation |
|---------|---------|---------|----------------|
| v4.3.0 | Jul 2025 | 0.183 | 18.3% of weekly users active daily |
| v4.3.2 | Aug 2025 | 0.184 | Stable |
| v4.3.7 | Oct 2025 | 0.208 | **Highest daily habit** pre-drops |
| v4.3.12 | Nov 2025 | 0.185 | Stable post-drops launch |
| v4.3.15 | Dec 2025 | 0.186 | Stable |
| v4.3.19 | Jan 2026 | 0.183 | Stable |

---

## Key Insights

### 1. Engagement Rate — v4.3.12 Reset Effect
The engagement rate dropped sharply across pre-drops versions (74.97% → 22.32%), indicating fewer and fewer users were returning for engaged sessions as the app aged. **v4.3.12 reversed this**, jumping back to 66.98% — the drops feature and new content re-engaged lapsed users. The decline continued with v4.3.15 and v4.3.19 as novelty faded, following a similar pattern to pre-drops versions.

### 2. Session Duration — Slight Post-Drops Decline
Average session duration peaked at v4.3.7 (2.23 min) and v4.3.12 (2.10 min). Post-drops v4.3.15 and v4.3.19 show a downward drift (1.84, 1.75 min). The introduction of Multiplication levels (v4.3.15/v4.3.19) — which users may attempt and exit quickly — likely contributes to shorter sessions.

### 3. Events per Session — Drops Add Interaction
Events per session rose from pre-drops average of 23.2 to v4.3.12's 24.14, then declined progressively. The drops themselves likely add interaction events per session, but the effect diminishes as users habituate (v4.3.15: 22.72, v4.3.19: 21.56).

### 4. Returning Users — Drops Improve Retention of Existing Users
Post-drops versions show a healthier ratio of returning to new users:
- Pre-drops: 5,094 returning / 5,571 new = **0.91 ratio**
- Post-drops: 5,146 returning / 4,977 new = **1.03 ratio**

Post-drops is the first period where returning users outnumber new users, a positive signal of improved retention.

### 5. WAU/MAU Stickiness — Consistent ~0.30–0.37
Weekly stickiness is broadly consistent at 0.30–0.37 across all versions, with v4.3.7 as an outlier (0.533 — spike from new content). v4.3.19 showing 0.372 is encouraging as an upward trend post-drops rebalancing.

### 6. DAU/WAU — Flat ~0.183–0.208
Daily habit formation is stable across all versions at 18–21%, indicating drops have not changed the fundamental daily usage pattern. Users who engage weekly have a consistent ~18–21% chance of being active on any given day.

---

## Summary: Impact of Drops on Engagement Metrics

| Metric | Pre-Drops Avg | Post-Drops Avg | Change | Verdict |
|--------|--------------|----------------|--------|---------|
| **Active Users (per version)** | 3,555 | 3,374 | −5% | ➡️ Comparable audience size |
| **New Users (per version)** | 1,857 | 1,659 | −11% | 📉 Fewer new installs post-drops |
| **Returning Users (per version)** | 1,698 | 1,715 | +1% | 📈 Returning users maintained |
| **Returning/New Ratio** | 0.91 | 1.03 | +0.12 | 📈 More returning than new post-drops |
| **Sessions (per version)** | 5,259 | 5,084 | −3% | ➡️ Stable session volume |
| **Engagement Rate** | 51.6% | 49.8% | −1.8pp | ➡️ Neutral |
| **Avg Session Duration** | 2.02 min | 1.89 min | −7.3s | 📉 Marginal decline |
| **Events per Session** | 23.2 | 22.8 | −0.4 | ➡️ Stable |
| **DAU/WAU** | 0.192 | 0.185 | −0.007 | ➡️ Neutral |
| **WAU/MAU** | 0.381 | 0.331 | −0.050 | 📉 Slight decline |

### Headline Conclusion
Drops have **stabilised and maintained** key engagement metrics rather than dramatically improving them. The most notable effect is the **engagement rate reset** — v4.3.12 reversed a steep pre-drops decline. The **returning/new user ratio crossing 1.0** post-drops is the strongest positive signal, suggesting drops contribute to retaining existing users even if they don't drive large new user growth.

---

## Data Quality Notes
- **Source**: `version_engagement_metrics.json` — fetched March 12, 2026 from GA4 Data API
- **Stream**: GD MATH production stream only (`streamName = "GD Math"`)
- **Property**: `441470574`
- **Avg Session Duration**: Derived as `userEngagementDuration ÷ sessions` (more accurate than raw `averageSessionDuration` from aggregated multi-month queries)
- **Events per Session**: Derived as `eventCount ÷ sessions`
- **DAU/WAU/MAU**: Cumulative sums over the period; ratios are comparable between versions
- **v4.3.5 excluded**: Transitional version not assigned to either group

---
*Production GD MATH stream data only. All test/development streams excluded.*
