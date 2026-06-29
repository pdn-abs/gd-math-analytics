# GD Math Analytics Hub

## Overview

This is the central hub for all GD Math analytics documentation, reports, and data analysis. The analytics ecosystem is organized into two main sections: **Reports** (targeted analytical deep-dives and findings) and **Docs** (foundational documentation, setup guides, and operational references).

## Directory Structure

### 📊 Reports
Deep-dive analytical reports on specific topics, with data-driven insights and recommendations.

- **[Assessment Drop Analysis Index](reports/assessment-drop-analysis/assessment-drop-analysis-index.md)**: Analysis of user drop-offs during the assessment phase, including level-by-level breakdowns and action plans.
- **[Drops Impact Analysis Index](reports/drops-impact-analysis/drops-impact-analysis-index.md)**: Comprehensive analysis of the gamification drops feature, including version timelines, user engagement metrics, and retention impacts.
- **[Pre-Subscription Phase Metrics Index](reports/presubscription-phase-metrics/presubscription-phase-metrics-index.md)**: Metrics and diagnostics from the pre-subscription phase, focusing on why conversions were zero and funnel optimization.

### 📚 Documentation
Foundational documentation, setup guides, event summaries, and system notes.

- **[Analytics Documentation Index](docs/analytics-docs-index.md)**: Index of all documentation files, including GA4 setup, event tracking, version segmentation, and diagnostic reports.

### 📁 Data & CSVs
Raw data exports and processed CSVs for analysis.

- **[CSV Folder](CSV/)**: Contains exported data from GA4, BigQuery, and UI reports.

## Quick Start Guide

If you're new to GD Math analytics:

1. **Read the Final Summary**: [Final Analytics Summary Report](reports/final-analytics-summary.md) for executive overview of all problems, evidence, and fixes.
2. **Start with the Documentation Index**: [Analytics Docs Index](docs/analytics-docs-index.md) for setup and event tracking basics.
3. **Explore Key Reports**: Use the indices above to navigate to specific analytical findings.
4. **Dive into Data**: Check the [CSV folder](CSV/) for raw data to verify insights.

## Key Insights Summary

- **Zero Conversions Issue**: Diagnosed in [GD Math Subscription Conversion Diagnosis](docs/gd-math-subscription-conversion-diag.md) — root causes include age gate bugs, assessment friction, and content routing issues.
- **Drops Feature Impact**: Added in v4.3.7, expected to boost session duration by 15-25% for engaged users ([Drops Analysis Summary](docs/chat-summary-drops-analysis.md)).
- **Assessment Drop Rates**: First levels show +24% higher drop rates due to onboarding friction ([Assessment Drop Analysis](reports/assessment-drop-analysis/assessment-drop-analysis-index.md)).
- **New Analytics Events**: Comprehensive table of [40+ recommended events](docs/new-analytics-events-table.md) for better tracking and analysis.

## Tools & Setup

- **GA4 Setup**: [Complete Guide](docs/ga4-setup-guide.md)
- **Automation Scripts**: [Python Automation](docs/automation-steps-python.md)
- **Version Segmentation**: [App Versions Guide](docs/app-version-segments.md)

## Contact & Updates

For questions or updates, refer to the individual report indices or the [Copilot Analytics Guide](docs/copilot-analytics-guide.md).

---

*Last Updated: May 8, 2026*
