# New Analytics Events for GD Math

## Overview

This document compiles all recommended new analytics events needed for comprehensive GD Math analysis, based on gaps identified across all analytics reports. Events are categorized by functional area with detailed reasoning for each.

## Table of Contents
- [Assessment & Level Tracking Events](#assessment--level-tracking-events)
- [Subscription & Monetization Events](#subscription--monetization-events)
- [User Experience & Drop-off Events](#user-experience--drop-off-events)
- [Gamification & Engagement Events](#gamification--engagement-events)
- [Technical & Error Events](#technical--error-events)
- [Session & Attempt Tracking Events](#session--attempt-tracking-events)

---

## Assessment & Level Tracking Events

| Event Name | Reason | Source File |
|------------|--------|-------------|
| `LevelStarted` | Replace generic `LevelData` (type=levelStarted) with dedicated event including `skill_age` for better segmentation | `gd-math-subscription-conversion-diag.md` |
| `AssessmentStarted` | Track when users begin assessment to measure entry friction | `gd-math-subscription-conversion-diag.md` |
| `AssessmentBoardCompleted` | Track progress through individual assessment boards | `gd-math-subscription-conversion-diag.md` |
| `AssessmentAbandoned` | Track when users abandon assessment mid-way with board number and time spent | `gd-math-subscription-conversion-diag.md` |
| `PlayerReportViewed` | Track when users view their assessment results | `gd-math-subscription-conversion-diag.md` |
| `LevelAbandoned` | Track mid-level abandonment with specific board and time spent | `gd-math-subscription-conversion-diag.md` |
| `segmentDropped` with `dropReason` | Distinguish between voluntary exits, crashes, and timeouts | `assessment-drop-analysis.md` |

## Subscription & Monetization Events

| Event Name | Reason | Source File |
|------------|--------|-------------|
| `PaywallReached` | Track when users hit the 30-minute trial limit | `gd-math-subscription-conversion-diag.md` |
| `SubscriptionScreenViewed` | Track subscription screen views with source and plan count | `gd-math-subscription-conversion-diag.md` |
| `BuyButtonTapped` | Track specific plan selections and pricing | `gd-math-subscription-conversion-diag.md` |
| `SubscriptionAbandoned` | Track subscription screen abandonment with time spent | `gd-math-subscription-conversion-diag.md` |
| `FreeTrialMilestone` | Track progress toward trial expiration | `gd-math-subscription-conversion-diag.md` |
| `FreeTrialExpired` | Track when users hit the 30-minute limit | `gd-math-subscription-conversion-diag.md` |

## User Experience & Drop-off Events

| Event Name | Reason | Source File |
|------------|--------|-------------|
| `AgeGateShown` | Track age gate displays to measure barrier impact | `gd-math-subscription-conversion-diag.md` |
| `AgeGatePassed` | Track successful age gate completion | `gd-math-subscription-conversion-diag.md` |
| `AgeGateFailed` | Track age gate failures | `gd-math-subscription-conversion-diag.md` |
| `ProfileWizardCheckpoint` | Track progress through profile creation steps | `pre-subscription-phase-metrics-ga4-ui.md` |
| `OnboardingStepCompleted` | Track completion of individual onboarding steps | `presubscription-phase-metrics-index.md` |

## Gamification & Engagement Events

| Event Name | Reason | Source File |
|------------|--------|-------------|
| `DropSpawned` | Track when drops appear during gameplay | `drops-metrics-evaluation.md` |
| `DropCollected` | Track successful drop collection | `drops-metrics-evaluation.md` |
| `DropTypeDistribution` | Track which drop types are spawned/collected | `drops-metrics-evaluation.md` |
| `ConsecutiveSuccessStreak` | Track 3+ successes for hattrick drops | `drops-metrics-evaluation.md` |
| `MultiLevelSession` | Track sessions with 5+ levels played | `drops-metrics-evaluation.md` |
| `SessionIntensityScore` | Measure overall session engagement | `drops-metrics-evaluation.md` |

## Technical & Error Events

| Event Name | Reason | Source File |
|------------|--------|-------------|
| `BillingConnectionError` | Track billing system failures with error codes | `gd-math-subscription-conversion-diag.md` |
| `AppCrash` | Track application crashes | `segment-tracking-discrepancy.md` |
| `ForceClose` | Track when users force-close the app | `segment-tracking-discrepancy.md` |
| `AppSuspended` | Track app backgrounding during active sessions | `segment-tracking-discrepancy.md` |

## Session & Attempt Tracking Events

| Event Name | Reason | Source File |
|------------|--------|-------------|
| `AttemptStarted` with `attempt_id` | Generate UUID for each level attempt to track retries | `segment-tracking-discrepancy.md` |
| `ImplicitDrop` | Track sessions that end without explicit completion/drop | `segment-tracking-discrepancy.md` |
| `SessionResumed` | Track when users return to interrupted sessions | `segment-tracking-discrepancy.md` |
| `DailySessionLimitHit` | Track when users hit daily time limits | `pre-subscription-phase-metrics.md` |

---

## Implementation Priority

### High Priority (Immediate - Week 1-2)
- `LevelStarted` (replace existing generic event)
- `AssessmentStarted` and `AssessmentAbandoned`
- `PaywallReached` and `SubscriptionScreenViewed`
- `AgeGateShown/Passed/Failed`
- `attempt_id` implementation for all level events

### Medium Priority (Week 3-4)
- Drop-specific events (`DropSpawned`, `DropCollected`)
- `BillingConnectionError` with proper error handling
- `ProfileWizardCheckpoint` events
- Session intensity metrics

### Low Priority (Future Enhancement)
- Advanced streak tracking
- Implicit drop calculations
- Detailed error categorization

## Technical Notes

- **Custom Dimensions**: Register `attempt_id`, `dropReason`, `skill_age`, `age_group` in GA4 console
- **Event Parameters**: Ensure consistent parameter naming across events
- **BigQuery Integration**: Use `attempt_id` for perfect funnel math
- **Error Handling**: Replace `printerr()` calls with proper analytics events

## Expected Impact

Implementing these events will provide:
- **Accurate Funnel Tracking**: Eliminate Started ≠ Completed + Dropped discrepancies
- **Conversion Insights**: Full visibility into subscription barriers
- **Engagement Attribution**: Direct measurement of drops impact
- **User Experience Optimization**: Identify exact friction points in onboarding

---

*Compiled from all analytics reports in the GD Math repository*
