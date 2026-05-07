# Pre-Subscription Phase Metrics

## Overview

This directory contains reports generated during the GD Math Pre-Subscription Phase (January - March 2026). The primary goal during this phase was to understand why, despite strong initial downloads and valid user usage, the app saw zero subscription conversions.

These reports cover the deep diagnostics into funnel drop-offs, event tracking bugs, and the formulation of action plans to drive the first subscriber.

## Decision Tree

If you are trying to understand the pre-subscription phase analytics, start here:

- **I want the final, definitive conclusions on why conversions were zero.**
  - Read: [`pre-subscription-final-report.md`](pre-subscription-final-report.md)
- **I want to see the original plan for tracking pre-subscription metrics.**
  - Read: [`pre-subscription-phase-metrics-analysis-plan.md`](pre-subscription-phase-metrics-analysis-plan.md)
- **I want to know how data sources (BigQuery, GA4 API, GA4 UI) compared during this time.**
  - Read: [`metric-source-verification.md`](metric-source-verification.md)
  - Also see: [`subscription-analytics-guide.md`](subscription-analytics-guide.md)
- **I want to see raw metrics exports from GA4.**
  - Read: [`pre-subscription-phase-metrics-ga4.md`](pre-subscription-phase-metrics-ga4.md)
  - Read: [`pre-subscription-phase-metrics-ga4-ui.md`](pre-subscription-phase-metrics-ga4-ui.md)
- **I want to look at engagement ratios (DAU/WAU/MAU) and usage patterns.**
  - Read: [`dau-wau-mau-ratios.md`](dau-wau-mau-ratios.md)
  - Read: [`average-session-duration-enhancement.md`](average-session-duration-enhancement.md)
  - Read: [`daily-usage-enhancement-plan.md`](daily-usage-enhancement-plan.md)
- **I want to explore how specific app versions performed.**
  - Read: [`version-metrics-table.md`](version-metrics-table.md)
  - Read: [`monthly-version-metrics.md`](monthly-version-metrics.md)
  - Read: [`version-engagement-analysis.md`](version-engagement-analysis.md)

## Key Technical Insights

1. **Free Trial Mechanics:** The assessment counts against the 30-minute free trial limit. A 15-20 minute assessment left almost no actual gameplay before hitting a hard paywall.
2. **Lock Screen Bug:** High-intent users reaching the paywall were blocked by an Android system lock screen issue due to dead code in `ageGate/main.gd`.
3. **Gender Selection Friction:** The single biggest profile creation drop-off was gender selection (30% drop).

## Directory Index

- [`average-session-duration-enhancement.md`](average-session-duration-enhancement.md)
- [`daily-usage-enhancement-plan.md`](daily-usage-enhancement-plan.md)
- [`dau-wau-mau-ratios.md`](dau-wau-mau-ratios.md)
- [`metric-source-verification.md`](metric-source-verification.md)
- [`monthly-version-metrics.md`](monthly-version-metrics.md)
- [`overall-metrics-report.md`](overall-metrics-report.md)
- [`pre-subscription-final-report.md`](pre-subscription-final-report.md)
- [`pre-subscription-phase-metrics-analysis-plan.md`](pre-subscription-phase-metrics-analysis-plan.md)
- [`pre-subscription-phase-metrics-ga4.md`](pre-subscription-phase-metrics-ga4.md)
- [`pre-subscription-phase-metrics-ga4-ui.md`](pre-subscription-phase-metrics-ga4-ui.md)
- [`pre-subscription-phase-metrics.md`](pre-subscription-phase-metrics.md)
- [`subscription-analytics-guide.md`](subscription-analytics-guide.md)
- [`version-engagement-analysis.md`](version-engagement-analysis.md)
- [`version-metrics-table.md`](version-metrics-table.md)
