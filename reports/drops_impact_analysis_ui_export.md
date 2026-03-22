# Drops Impact Analysis: Pre vs Post Drops Periods (Updated with UserEngagement_Metrics_UI_Export.csv)

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
| WAU/MAU | Ratio of Weekly Active Users to Monthly Active Users. Measures user stickiness and retention over a weekly cycle. | 0.239 (ratio) | 0.285 (ratio) | 19.4 | Indicates how frequently users return to the app within a month, providing insights into long-term engagement patterns. | Higher ratio (closer to 1.0) indicates better weekly retention. Post-drops 0.285 shows 28.5% of monthly users are active weekly, up from 23.9% - a positive improvement in user stickiness. | Implement weekly challenge systems and send personalized weekly progress summaries. |
| DAU/WAU | Ratio of Daily Active Users to Weekly Active Users. Measures the intensity of daily engagement within the active user base. | 0.077 (ratio) | 0.081 (ratio) | 6.0 | Shows how consistently users engage on a daily basis among those who are weekly active, highlighting daily usage patterns. | Higher ratio means more daily activity among weekly users. 0.081 means 8.1% of weekly active users engage daily, slightly up from 7.7% - indicating improved daily habit formation. | Introduce daily login bonuses and schedule daily push notifications with quick challenges. |
| User Engagement | Total number of user engagement events recorded in the app. | 342,656 (events) | 582,322 (events) | 70.0 | Represents overall user activity and interaction volume across all features. | Higher numbers indicate more user interactions. The 70% increase from 342K to 582K events shows significantly more activity post-drops, suggesting the feature drives more engagement. | Add more interactive elements, implement gamification features like leaderboards. |
| Returning Users | Number of users who returned to the app after their initial session. | 550 (users) | 972 (users) | 76.8 | Measures user retention and the app's ability to bring users back after first use. | Higher count means better retention. 972 returning users post-drops vs 550 pre-drops represents a 77% improvement in users coming back after their first session. | Improve onboarding experience and send re-engagement campaigns to inactive users. |
| Engaged Sessions | Number of sessions where users showed active engagement (beyond just opening the app). | 1,996 (sessions) | 3,574 (sessions) | 79.1 | Indicates the quality and depth of user sessions rather than just session count. | Higher numbers show more meaningful sessions. The 79% increase suggests users are having deeper, more interactive experiences with the app after drops introduction. | Reduce loading times, add compelling content at session start. |
| Engagement Rate | Percentage of total sessions that were engaged sessions. | 76.0% (%) | 78.1% (%) | 2.8 | Shows the efficiency of sessions - what proportion of app opens result in meaningful interaction. | Higher percentage means more efficient sessions. 78.1% post-drops vs 76.0% pre-drops indicates a slight improvement in session quality - more app opens lead to active use. | Optimize app performance, improve user interface design. |
| Active Users | Total number of unique users who were active during the period. | 1,028 (users) | 1,919 (users) | 86.6 | Represents the overall user base size and reach of the app. | Higher count indicates broader reach. The 87% growth from 1,028 to 1,919 users shows significant user base expansion following drops implementation. | Expand marketing campaigns, improve app store optimization. |
| Avg Session Duration | Average time users spend in engaged sessions. | 7,082 (seconds) | 8,834 (seconds) | 24.8 | Measures session depth and user immersion in the app. | Longer durations indicate deeper engagement. The 25% increase from ~118 min to ~147 min shows users spending significantly more time per session post-drops. | Optimize session flow, add compelling content progression, reduce friction points. |
| LevelData Events | Total number of level interaction events recorded. | 7,176 (events) | 23,479 (events) | 227.2 | Represents level attempts and gameplay interactions. | Higher numbers indicate more gameplay activity. The 227% increase shows dramatically more level engagement and exploration after drops introduction. | Balance level difficulty, ensure rewarding progression, add variety to maintain interest. |
| Score Events | Total number of scoring/achievement events recorded. | 518 (events) | 1,314 (events) | 153.7 | Represents successful completions and achievements. | Higher numbers indicate more goal achievement. The 154% increase suggests better completion rates and more rewarding experiences post-drops. | Enhance achievement feedback, add meaningful rewards, improve success paths. |
| Total Events | Combined LevelData and Score events. | 7,694 (events) | 24,793 (events) | 222.2 | Represents overall level-related activity volume. | Higher totals indicate more comprehensive gameplay engagement. The 222% increase demonstrates drops driving substantial growth in all level activities. | Monitor activity balance, ensure events translate to meaningful learning outcomes. |
| LevelData/Score Ratio | Ratio of level attempts to successful completions. | 13.85 (ratio) | 17.87 (ratio) | 29.0 | Measures exploration vs completion efficiency. | Higher ratios indicate more attempts per completion. The 29% increase suggests users are exploring more levels but potentially facing more challenges or being more experimental. | Review level difficulty curves, provide better guidance, balance exploration incentives.

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
- **Definition**: Total number of user engagement events recorded in the app.
- **Units**: Count (number of events)
- **Why Chosen**: Represents overall user activity and interaction volume across all features.
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
- **Units**: Seconds
- **Why Chosen**: Measures session depth and user immersion in the app.
- **Action Items**:
  - Optimize session flow to maintain engagement
  - Add compelling content progression within sessions
  - Reduce friction points that cause early session termination
  - Implement session continuation features

### LevelData Events
- **Definition**: Total number of level interaction events recorded.
- **Units**: Count (number of events)
- **Why Chosen**: Represents level attempts and gameplay interactions.
- **Action Items**:
  - Balance level difficulty to maintain engagement without frustration
  - Ensure rewarding progression systems
  - Add variety in level types and themes
  - Monitor for level abandonment patterns

### Score Events
- **Definition**: Total number of scoring/achievement events recorded.
- **Units**: Count (number of events)
- **Why Chosen**: Represents successful completions and achievements.
- **Action Items**:
  - Enhance achievement feedback and celebration
  - Add meaningful rewards for completions
  - Improve success paths and guidance
  - Create achievement hierarchies and milestones

### Total Events
- **Definition**: Combined LevelData and Score events.
- **Units**: Count (number of events)
- **Why Chosen**: Represents overall level-related activity volume.
- **Action Items**:
  - Monitor activity balance between exploration and completion
  - Ensure events translate to meaningful learning outcomes
  - Optimize event tracking for better insights
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
- **Active Users** grew by 87%, suggesting broader user base adoption.
- **Engaged Sessions** rose by 79%, pointing to more frequent play.
- **Returning Users** improved by 77%, showing better retention.
- **WAU/MAU** and **DAU/WAU** ratios increased, reflecting stronger weekly and daily engagement patterns.
- **Engagement Rate** saw a modest 3% uplift, maintaining high user involvement.
- **Avg Session Duration** increased by 25%, showing deeper user immersion.
- **LevelData Events** surged by 227%, indicating dramatically more gameplay exploration.
- **Score Events** grew by 154%, suggesting improved completion rates.
- **Total Events** increased by 222%, demonstrating comprehensive activity growth.
- **LevelData/Score Ratio** rose by 29%, showing increased exploration relative to completions.

These results suggest that drops (rewards) effectively motivated users to engage more deeply and consistently with the app, driving both session quality improvements and substantial increases in gameplay activity.
