# Drops Impact Analysis: Pre vs Post Drops Periods(based on UserEngagement_Metrics_API_Fetch.csv)

## Table of Contents
- [Analysis Period](#analysis-period)
- [Period Selection Rationale](#period-selection-rationale)
- [Metrics Comparison Table](#metrics-comparison-table)
- [Key Findings](#key-findings)
- [Summary](#summary)

## Analysis Period

This report compares the following two windows:

- **Pre-drops baseline**: 20 Oct 2025 to 31 Dec 2025
- **Post-drops observation window**: 1 Jan 2026 to 11 Mar 2026

## Period Selection Rationale

These time periods were selected for the following reasons:

1. They bracket the drops rollout closely, so the comparison stays focused on behavior before and after drops became part of the gameplay experience.
2. They are near-adjacent windows, which reduces distortion from long-term product changes unrelated to drops.
3. They are similar in duration, which makes directional comparison more reasonable for session, engagement, and level metrics.
4. They provide enough user activity volume to evaluate engagement, retention, and level-flow behavior with less noise than a very short launch window.

## Metrics Comparison Table

| Metric | What This Metric Means | Why This Metric Is Included | Unit | Pre-Drops Value | Post-Drops Value | Percentage Change | Action Items |
|--------|-------------------------|-----------------------------|------|-----------------|------------------|-------------------|--------------|
| Avg Session Duration | How long users stay in the app in one visit. | Helps show whether drops are keeping users engaged for longer. | minutes | 42.7 | 82.5 | +93.1% | Keep testing drop frequency, and review which drop types correlate with longer sessions without increasing abandonment. |
| Events per Session | How much activity happens in one visit. | Helps show whether users are doing more after drops were introduced. | events/session | 59 | 117 | +98.3% | Identify which events grew most and reinforce those flows with better onboarding and in-game prompts. |
| WAU/MAU | How many monthly users also come back weekly. | Helps measure whether users are returning regularly. | ratio | 0.241 | 0.388 | +61.0% | Strengthen weekly return loops through content refresh, streaks, and drop-linked rewards. |
| DAU/WAU | How many weekly users also come back daily. | Helps measure whether the game is becoming a daily habit. | ratio | 0.066 | 0.086 | +30.3% | Improve daily habit triggers such as daily goals, reminders, and short-session rewards. |
| User Engagement | Total time users actively spent in the app during the period. | Helps show the overall amount of attention the game received. | engagement-duration units | 718805 | 2173250 | +202.3% | Break this down by level type and app version to identify where drops create the strongest sustained engagement. |
| Returning Users | Users who came back to the app after using it before. | Helps show whether drops encourage users to return. | users | 1193 | 3175 | +166.1% | Study return behavior by cohort and add re-engagement hooks around unfinished levels or rewards left unclaimed. |
| Engaged Sessions | Visits where users spent meaningful time or interaction in the app. | Helps separate strong visits from very short or weak visits. | sessions | 3803 | 11585 | +204.6% | Preserve the flows producing engaged sessions and reduce friction in early-session moments. |
| Engagement Rate | The share of visits that were meaningful or engaged. | Helps show whether session quality improved, not just session volume. | percent | 72.8% | 81.7% | +12.2% | Investigate the first 1 to 3 minutes of play and optimize them further because that part is likely driving the gain. |
| Active Users | Total users active during the period. | Helps show whether overall usage increased after drops. | users | 1963 | 6336 | +222.7% | Segment by app version, traffic source, and age band to verify whether growth is broad-based and sustainable. |
| Level Staged | Levels where users moved into the stage/progression flow. | Helps show how users are progressing through the level journey. | events | 9902 | 10203 | +3.0% | Review whether staging events are firing consistently and check if some level types stall after staging. |
| Level Started | Levels that users actually began. | Helps show the top of the gameplay funnel. | events | 9231 | 9899 | +7.2% | Increase level-start conversion from home and map screens with clearer calls to action and faster resume flows. |
| Level Completed | Levels that users finished successfully. | Helps show whether users are able to complete gameplay successfully. | events | 5178 | 4812 | -7.1% | Audit difficult levels introduced post-drops and rebalance drop effects that may distract from completion. |
| Level Dropped | Levels that users left before finishing. | Helps show where users lose interest or quit mid-level. | events | 3068 | 3001 | -2.2% | Continue monitoring hard-exit points and reduce interruptions, especially on longer or more complex levels. |
| Level Failed | Levels that ended in failure. | Helps show whether users are struggling with gameplay difficulty. | events | 199 | 122 | -38.7% | Preserve the factors reducing failure and check whether improved support or easier recovery mechanics caused the improvement. |
| Completion Rate (Completed/Started) | The share of started levels that were completed. | Helps show overall gameplay success. | percent | 56.1% | 48.6% | -13.4% | Review post-drops level difficulty, reward timing, and whether drops interrupt learning flow before completion. |
| Drop Rate (Dropped/Started) | The share of started levels that users left midway. | Helps show how often users abandon a level. | percent | 33.2% | 30.3% | -8.7% | Continue reducing abandonment through smoother pacing, better checkpointing, and fewer disruptive effects. |
| Failure Rate (Failed/Started) | The share of started levels that ended in failure. | Helps show whether problems come from difficulty rather than user drop-off. | percent | 2.2% | 1.2% | -45.5% | Retain the mechanics helping users recover, and identify if specific content areas still fail at higher rates. |
| 1-Day Retention | Users who came back the next day. | Helps show the immediate return effect after first use. | percent | 100.0% | 100.0% | 0.0% | Validate the retention query definition because a 100% day-1 value likely needs review before decision-making. |
| 5-Day Retention | Users who came back after five days. | Helps show whether users return beyond the first few days. | percent | 3.5% | 2.8% | -20.7% | Add post-session reminders, progress visibility, and return incentives within the first week. |
| 1-Week Retention | Users who came back after one week. | Helps show whether improvements last beyond early curiosity. | percent | 18.5% | 16.0% | -13.4% | Build stronger weekly hooks such as progression milestones, streak systems, or content unlocks. |
| 2-Week Retention | Users who came back after two weeks. | Helps show whether users stay connected over a longer period. | percent | 8.7% | 8.9% | +2.1% | Double down on the features that sustain two-week return and analyze successful cohorts for common behavior patterns. |
| 1-Month Retention | Users who came back after one month. | Helps show whether drops are building long-term habit. | percent | 5.0% | 4.4% | -12.0% | Add stronger long-term progression goals and re-engagement campaigns for users who churn after the first two weeks. |

## Key Findings

1. **Session depth improved materially after drops**. Session duration, events per session, engaged sessions, engagement rate, and active users all increased strongly in the post-drops period.
2. **Stickiness improved in the short and medium term**. Both WAU/MAU and DAU/WAU improved, suggesting drops may be helping users return more frequently.
3. **Gameplay quality signals are mixed**. Drop rate and failure rate improved, but completion count and completion rate declined, which suggests that drops may be improving interest while not fully improving end-to-end level success.
4. **Retention needs closer investigation**. Some retention values declined and the 1-day retention figure at 100% should be validated before it is treated as a trustworthy decision metric.

## Summary

This report evaluates the impact of drops by comparing a pre-drops baseline window with a post-drops observation window close to the rollout period. The selected periods were chosen because they are near-adjacent, similar in duration, and large enough to support meaningful comparison.

The current evidence suggests that drops are associated with stronger engagement and better repeat usage signals, but not all outcome metrics improved. In particular, completion performance and several retention metrics still need deeper follow-up analysis. The next step should be to validate the retention definitions, segment the results by app version and level type, and identify which drop mechanics drive higher engagement without reducing level completion quality.
