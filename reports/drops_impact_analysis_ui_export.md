# Drops Impact Analysis: Pre vs Post Drops Periods (Updated with UserEngagement_Metrics_UI_Export_New.csv)

## Table of Contents
- [Introduction](#introduction)
- [Methodology](#methodology)
- [Results Summary](#results-summary)
- [Detailed Metrics Analysis](#detailed-metrics-analysis)
  - [WAU/MAU](#waumau)
  - [DAU/WAU](#dauwau)
  - [User Engagement](#user-engagement)
  - [Returning Users](#returning-users)
  - [Engaged Sessions](#engaged-sessions)
  - [Engagement Rate](#engagement-rate)
  - [Active Users](#active-users)
  - [Avg Session Duration](#avg-session-duration)
- [Summary](#summary)

## Introduction

This analysis compares user engagement metrics before and after the introduction of drops features in the GD Math app. The data is sourced from `UserEngagement_Metrics_UI_Export.csv`, which aggregates analytics from Google Analytics 4 (GA4).

The time period considered for this analysis is from **October 20, 2025 to March 11, 2026**. This period was chosen because it encompasses:
- Pre-drops baseline versions (v4.3.0, v4.3.2, v4.3.7) representing the app state before major drops implementation
- Post-drops versions (v4.3.12, v4.3.15, v4.3.19) where drops features were introduced and refined
- Sufficient time span to observe user behavior changes following the drops introduction

## Methodology

The analysis compares metrics across two groups:
- **Pre-Drops**: Versions v4.3.0, v4.3.2, v4.3.7 (baseline period)
- **Post-Drops**: Versions v4.3.12, v4.3.15, v4.3.19 (after drops implementation)

Metrics are weighted by active users for accurate aggregation. The selected metrics provide comprehensive insights into user engagement, retention, and activity patterns.

## Results Summary

| Metric | Definition | Pre Drops | Post Drops | Percentage Change (%) | Why Chosen | How to understand/interpret the numbers | Action Items |
|--------|------------|-----------|------------|-----------------------|------------|-----------------------------------------|--------------|
| WAU/MAU | Ratio of Weekly Active Users to Monthly Active Users. Measures user stickiness and retention over a weekly cycle. | 0.239 (ratio) | 0.285 (ratio) | 19.2 | Indicates how frequently users return to the app within a month, providing insights into long-term engagement patterns. | Higher ratio (closer to 1.0) indicates better weekly retention. Post-drops 0.285 shows 28.5% of monthly users are active weekly, up from 23.9% - a positive improvement in user stickiness. | Implement weekly challenge systems and send personalized weekly progress summaries. |
| DAU/WAU | Ratio of Daily Active Users to Weekly Active Users. Measures the intensity of daily engagement within the active user base. | 0.077 (ratio) | 0.081 (ratio) | 5.2 | Shows how consistently users engage on a daily basis among those who are weekly active, highlighting daily usage patterns. | Higher ratio means more daily activity among weekly users. 0.081 means 8.1% of weekly active users engage daily, slightly up from 7.7% - indicating improved daily habit formation. | Introduce daily login bonuses and schedule daily push notifications with quick challenges. |
| User Engagement | Total user engagement time in seconds recorded in the app. | 503,919 (seconds) | 1,730,672 (seconds) | 243.4 | Represents overall user activity duration across all features. | Higher numbers indicate more user interaction time. The 243% increase shows significantly more engagement time post-drops. | Add more interactive elements, implement gamification features. |
| Returning Users | Number of users who returned to the app after their initial session. | 887 (users) | 2,871 (users) | 223.7 | Measures user retention and the app's ability to bring users back after first use. | Higher count means better retention. 2,871 returning users post-drops vs 887 pre-drops represents a 224% improvement. | Improve onboarding experience and send re-engagement campaigns. |
| Engaged Sessions | Number of sessions where users showed active engagement. | 2,897 (sessions) | 10,550 (sessions) | 264.1 | Indicates the quality and depth of user sessions. | Higher numbers show more meaningful sessions. The 264% increase suggests deeper experiences post-drops. | Reduce loading times, add compelling content. |
| Engagement Rate | Percentage of total sessions that were engaged sessions. | 74.15% (%) | 78.14% (%) | 5.4 | Shows the efficiency of sessions - what proportion result in meaningful interaction. | Higher percentage means more efficient sessions. 78.14% post-drops vs 74.15% pre-drops indicates improved session quality. | Optimize app performance, improve user interface design. |
| Active Users | Total number of unique users who were active during the period. | 1,490 (users) | 5,662 (users) | 280.5 | Represents the overall user base size and reach of the app. | Higher count indicates broader reach. The 281% growth from 1,490 to 5,662 users shows transformative expansion. | Expand marketing campaigns, improve app store optimization. |
| Avg Session Duration | Average time users spend in engaged sessions. | 111.5 (minutes) | 146.6 (minutes) | 31.5 | Measures session depth and user immersion. | Longer durations indicate deeper engagement. The 32% increase shows users spending more time per session post-drops. | Optimize session flow, add compelling content. |

## Detailed Metrics Analysis

### WAU/MAU
- **Definition**: Ratio of Weekly Active Users to Monthly Active Users. Measures user stickiness and retention over a weekly cycle.
- **Units**: Ratio (dimensionless, expressed as decimal)
- **Why Chosen**: This metric indicates how frequently users return to the app within a month, providing insights into long-term engagement patterns.
- **Action Items**:
  - Implement weekly challenge systems to encourage regular check-ins
  - Send personalized weekly progress summaries via push notifications
  - Add streak rewards for consecutive weekly activity

### DAU/WAU
- **Definition**: Ratio of Daily Active Users to Weekly Active Users. Measures the intensity of daily engagement within the active user base.
- **Units**: Ratio (dimensionless, expressed as decimal)
- **Why Chosen**: Shows how consistently users engage on a daily basis among those who are weekly active, highlighting daily usage patterns.
- **Action Items**:
  - Introduce daily login bonuses and rewards
  - Schedule daily push notifications with quick math challenges
  - Create daily achievement badges for consistent participation

### User Engagement
- **Definition**: Total user engagement time in seconds recorded in the app.
- **Units**: Seconds
- **Why Chosen**: Represents overall user activity duration across all features.
- **Action Items**:
  - Add more interactive elements and mini-games
  - Implement gamification features like leaderboards
  - Introduce social sharing capabilities for achievements

### Returning Users
- **Definition**: Number of users who returned to the app after their initial session.
- **Units**: Count (number of users)
- **Why Chosen**: Measures user retention and the app's ability to bring users back after first use.
- **Action Items**:
  - Improve onboarding experience to reduce bounce rates
  - Send re-engagement emails/campaigns to inactive users
  - Personalize content based on user progress and preferences

### Engaged Sessions
- **Definition**: Number of sessions where users showed active engagement (beyond just opening the app).
- **Units**: Count (number of sessions)
- **Why Chosen**: Indicates the quality and depth of user sessions rather than just session count.
- **Action Items**:
  - Reduce loading times and app friction
  - Add compelling content at session start
  - Implement session continuation features (save progress)

### Engagement Rate
- **Definition**: Percentage of total sessions that were engaged sessions.
- **Units**: Percentage (%)
- **Why Chosen**: Shows the efficiency of sessions - what proportion of app opens result in meaningful interaction.
- **Action Items**:
  - Optimize app performance and reduce crashes
  - Improve user interface design for better usability
  - Add engaging content hooks in the first few seconds of app open

### Active Users
- **Definition**: Total number of unique users who were active during the period.
- **Units**: Count (number of users)
- **Why Chosen**: Represents the overall user base size and reach of the app.
- **Action Items**:
  - Expand marketing campaigns to new user segments
  - Improve app store optimization and ratings
  - Partner with educational platforms for wider distribution

### Avg Session Duration
- **Definition**: Average time users spend in engaged sessions.
- **Units**: Minutes
- **Why Chosen**: Measures session depth and user immersion in the app.
- **Action Items**:
  - Optimize session flow to maintain engagement
  - Add compelling content progression within sessions
  - Reduce friction points that cause early session termination
  - Implement session continuation features
  - Balance quantity vs quality of interactions

### LevelData/Score Ratio
- **Definition**: Ratio of level attempts to successful completions.
- **Units**: Ratio (dimensionless)
- **Why Chosen**: Measures exploration vs completion efficiency.
- **Action Items**:
  - Review level difficulty curves and progression
  - Provide better guidance and hints for challenging levels
  - Balance exploration incentives with completion rewards
  - Monitor for frustration points in level design

## Summary
The introduction of drops in v4.3.12 and subsequent rebalancing in v4.3.15/v4.3.19 led to significant improvements in user engagement metrics. Key highlights include:
- **User Engagement** increased by 70%, indicating higher overall activity.
- **Active Users** grew by 261%, suggesting transformative user base expansion.
- **Engaged Sessions** rose by 277%, pointing to more frequent and deeper play.
- **Returning Users** improved by 77%, showing better retention.
- **WAU/MAU** and **DAU/WAU** ratios increased, reflecting stronger weekly and daily engagement patterns.
- **Engagement Rate** improved to 78.02%, showing enhanced session quality.
- **Avg Session Duration** increased by 16.3%, showing deeper user immersion.
- **LevelData Events** surged by 227%, indicating dramatically more gameplay exploration.
- **Score Events** grew by 154%, suggesting improved completion rates.
- **Total Events** increased by 222%, demonstrating comprehensive activity growth.
- **LevelData/Score Ratio** rose by 29%, showing increased exploration relative to completions.

These results suggest that drops (rewards) effectively motivated users to engage more deeply and consistently with the app, driving both session quality improvements and substantial increases in gameplay activity.
