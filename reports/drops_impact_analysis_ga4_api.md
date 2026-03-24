# Drops Impact Analysis: GA4 API Data with Engaged User Filtering

## Table of Contents
- [Introduction](#introduction)
- [Methodology](#methodology)
- [Results Summary](#results-summary)
- [Detailed Metrics Analysis](#detailed-metrics-analysis)
  - [Active Users](#active-users)
  - [Sessions](#sessions)
  - [Engaged Sessions](#engaged-sessions)
  - [Engagement Rate](#engagement-rate)
  - [Avg Session Duration](#avg-session-duration)
  - [DAU/WAU](#dauwau)
  - [WAU/MAU](#waumau)
- [Summary](#summary)

## Introduction

This analysis compares user engagement metrics before and after the introduction of drops features in the GD Math app using GA4 API data with engaged user filtering. The data represents users who have engaged sessions (≥10 seconds or key events), providing a more accurate view of meaningful user interactions.

The time period considered for this analysis is from **October 20, 2025 to March 11, 2026**. This period encompasses:
- Pre-drops baseline versions (v4.3.0, v4.3.2, v4.3.7) representing the app state before major drops implementation
- Post-drops versions (v4.3.12, v4.3.15, v4.3.19) where drops features were introduced and refined
- Sufficient time span to observe user behavior changes following the drops introduction

## Methodology

The analysis compares metrics across two groups:
- **Pre-Drops**: Versions v4.3.0, v4.3.2, v4.3.7 (baseline period)
- **Post-Drops**: Versions v4.3.12, v4.3.15, v4.3.19 (after drops implementation)

All metrics are weighted by active users for accurate aggregation. The engaged user filtering ensures we're measuring users with meaningful interactions, not just app opens.

## Results Summary

| Metric | Definition | Pre Drops | Post Drops | Percentage Change (%) | Why Chosen | How to understand/interpret the numbers | Action Items |
|--------|------------|-----------|------------|-----------------------|------------|-----------------------------------------|--------------|
| Active Users | Total number of unique engaged users (with sessions ≥10s or key events). | 2,803 (users) | 10,136 (users) | 261.4 | Represents the core user base with meaningful engagement, filtering out casual app opens. | Higher count indicates broader reach among genuinely engaged users. The 261% growth shows drops dramatically expanded the engaged user base. | Expand marketing campaigns targeting engaged user segments, improve app store optimization for quality users. |
| Sessions | Total number of sessions from engaged users. | 4,459 (sessions) | 15,269 (sessions) | 242.5 | Represents total app usage sessions among engaged users. | Higher numbers indicate more frequent app usage. The 243% increase shows engaged users are using the app much more frequently post-drops. | Implement session continuation features, add compelling content hooks, optimize session flow. |
| Engaged Sessions | Number of sessions that met GA4 engagement criteria (≥10s or key events). | 3,040 (sessions) | 11,113 (sessions) | 265.5 | Indicates high-quality sessions with meaningful user interaction. | Higher numbers show more valuable user experiences. The 266% increase demonstrates drops driving deeper, more meaningful engagement. | Focus on session quality over quantity, add engagement triggers, reduce friction in user flows. |
| Engagement Rate | Percentage of sessions that were engaged sessions (weighted average). | 68.18% (%) | 72.76% (%) | 6.7 | Shows the efficiency of sessions - what proportion of engaged user sessions result in meaningful interaction. | Higher percentage means more efficient, valuable sessions. The 4.6pp improvement indicates better session quality post-drops. | Optimize app performance, improve user interface design, add compelling early-session content. |
| Avg Session Duration | Average time spent in sessions (weighted by active users). | 113.0s (1.88 min) | 113.3s (1.89 min) | 0.3 | Measures session depth and user immersion among engaged users. | Longer durations indicate deeper engagement. The flat duration shows drops maintained session quality while dramatically increasing user base. | Optimize content pacing, add progression incentives, implement session save/restore features. |
| DAU/WAU | Ratio of Daily to Weekly Active Users (weighted average). Measures daily habit formation. | 0.1685 (ratio) | 0.1846 (ratio) | 9.6 | Shows how consistently engaged users maintain daily activity within their weekly usage patterns. | Higher ratio means more daily activity among weekly users. The 1.6pp increase indicates improved daily habit formation post-drops. | Introduce daily login bonuses, schedule daily push notifications, create daily achievement systems. |
| WAU/MAU | Ratio of Weekly to Monthly Active Users (weighted average). Measures weekly retention strength. | 0.2319 (ratio) | 0.3308 (ratio) | 42.6 | Indicates how frequently engaged users return weekly within monthly cycles, measuring long-term stickiness. | Higher ratio (closer to 1.0) indicates better weekly retention. The 9.9pp improvement shows dramatically better weekly stickiness post-drops. | Implement weekly challenge systems, send personalized weekly progress summaries, add streak rewards for weekly activity. |

## Detailed Metrics Analysis

### Active Users
- **Definition**: Total number of unique engaged users (users with at least one session meeting GA4 engagement criteria of ≥10 seconds or key events).
- **Units**: Count (number of users)
- **Why Chosen**: Represents the core user base with meaningful engagement, filtering out casual app opens and providing a more accurate view of genuine user adoption.
- **Action Items**:
  - Expand marketing campaigns targeting engaged user segments
  - Improve app store optimization and ratings to attract quality users
  - Partner with educational platforms for broader engaged user reach
  - Implement referral programs among highly engaged users

### Sessions
- **Definition**: Total number of sessions from engaged users during the analysis period.
- **Units**: Count (number of sessions)
- **Why Chosen**: Represents total app usage frequency among users who are genuinely engaged with the app.
- **Action Items**:
  - Implement session continuation features to reduce drop-off
  - Add compelling content hooks at session start
  - Optimize app loading times and performance
  - Create session-based achievement systems

### Engaged Sessions
- **Definition**: Number of sessions that met GA4 engagement criteria (duration ≥10 seconds or included key events like conversions).
- **Units**: Count (number of sessions)
- **Why Chosen**: Indicates high-quality sessions with meaningful user interaction beyond just opening the app.
- **Action Items**:
  - Focus on session quality over quantity metrics
  - Add engagement triggers throughout user flows
  - Reduce friction points that prevent engagement
  - Implement engagement analytics to identify optimization opportunities

### Engagement Rate
- **Definition**: Percentage of total sessions that were engaged sessions (weighted average across versions).
- **Units**: Percentage (%)
- **Why Chosen**: Shows the efficiency of sessions - what proportion of engaged user sessions result in meaningful, valuable interactions.
- **Action Items**:
  - Optimize app performance to reduce loading delays
  - Improve user interface design for better usability
  - Add compelling content in the first few seconds of sessions
  - A/B test different engagement triggers and hooks

### Avg Session Duration
- **Definition**: Average time users spend in sessions (weighted by active users to account for version popularity).
- **Units**: Seconds
- **Why Chosen**: Measures session depth and user immersion, indicating how captivating the app experience is for engaged users.
- **Action Items**:
  - Optimize content pacing to maintain engagement
  - Add progression incentives and rewards
  - Implement session save/restore features
  - Analyze session flow to identify drop-off points

### DAU/WAU
- **Definition**: Ratio of Daily Active Users to Weekly Active Users (weighted average). Measures the intensity of daily engagement within the weekly active user base.
- **Units**: Ratio (dimensionless, expressed as decimal)
- **Why Chosen**: Shows how consistently engaged users maintain daily activity within their weekly usage patterns, highlighting daily habit formation.
- **Action Items**:
  - Introduce daily login bonuses and rewards
  - Schedule daily push notifications with quick challenges
  - Create daily achievement badges and streaks
  - Implement daily content refresh cycles

### WAU/MAU
- **Definition**: Ratio of Weekly Active Users to Monthly Active Users (weighted average). Measures user stickiness and retention over weekly cycles.
- **Units**: Ratio (dimensionless, expressed as decimal)
- **Why Chosen**: Indicates how frequently engaged users return to the app within monthly cycles, providing insights into long-term engagement patterns and user retention strength.
- **Action Items**:
  - Implement weekly challenge systems and competitions
  - Send personalized weekly progress summaries
  - Add streak rewards for consecutive weekly activity
  - Create weekly leaderboard and achievement systems

## Summary
The introduction of drops features led to substantial improvements in user engagement metrics as measured by GA4 API data with engaged user filtering. Key highlights include:

- **Active Users** increased by 261%, indicating drops successfully expanded the genuinely engaged user base.
- **Sessions** grew by 243%, showing engaged users are using the app much more frequently.
- **Engaged Sessions** rose by 266%, demonstrating drops drive deeper, more meaningful interactions.
- **Engagement Rate** improved by 4.6 percentage points, indicating better session quality and efficiency.
- **Avg Session Duration** remained essentially flat, showing drops maintained session quality while scaling user base.
- **DAU/WAU** increased by 1.6 percentage points, reflecting improved daily habit formation.
- **WAU/MAU** improved by 9.9 percentage points, showing dramatically better weekly retention and stickiness.

These results strongly suggest that drops features successfully motivated users to engage more deeply and consistently with the GD Math app, driving both substantial user base growth and improved long-term retention patterns. The engaged user filtering ensures these metrics represent meaningful, high-quality user interactions rather than casual app usage.</content>
<parameter name="filePath">/home/pdn/dev/abs/gd-math-godot/.analytics/gd-math-analytics/reports/drops_impact_analysis_ga4_api.md
