# Drops Impact Analysis: Data Source Comparison

## Overview
This table compares key metrics from two different data sources analyzing the drops feature impact:

- **UI Export**: Based on `UserEngagement_Metrics_UI_Export.csv` (GA4 UI export data)
- **API Fetch**: Based on `UserEngagement_Metrics_API_Fetch.csv` (GA4 API fetched data)

Both analyze the same time period (Oct 20, 2025 – Mar 11, 2026) but use different data collection methods.

## Comparison Table

| Metric | UI Export Pre-Drops | UI Export Post-Drops | UI Export Change | API Fetch Pre-Drops | API Fetch Post-Drops | API Fetch Change | Data Source Notes |
|--------|---------------------|----------------------|------------------|---------------------|----------------------|-------------------|-------------------|
| **Active Users** | 1,028 | 1,919 | +86.6% | 1,963 | 6,336 | +222.7% | API shows 2× higher absolute numbers |
| **Returning Users** | 550 | 972 | +76.8% | 1,193 | 3,175 | +166.1% | API shows ~2-3× higher counts |
| **Engaged Sessions** | 1,996 | 3,574 | +79.1% | 3,803 | 11,585 | +204.6% | API shows 2× higher session counts |
| **Engagement Rate** | 76.0% | 78.1% | +2.8% | 72.8% | 81.7% | +12.2% | Similar directional improvement |
| **Avg Session Duration** | 118 min | 147 min | +24.8% | 42.7 min | 82.5 min | +93.1% | **Major discrepancy** - API shows much shorter durations |
| **WAU/MAU** | 0.239 | 0.285 | +19.4% | 0.241 | 0.388 | +61.0% | API shows stronger improvement |
| **DAU/WAU** | 0.077 | 0.081 | +6.0% | 0.066 | 0.086 | +30.3% | API shows stronger improvement |
| **User Engagement** | 342,656 events | 582,322 events | +70.0% | 718,805 units | 2,173,250 units | +202.3% | Different units/metrics |
| **LevelData Events** | 7,176 | 23,479 | +227.2% | N/A | N/A | N/A | UI Export only |
| **Score Events** | 518 | 1,314 | +153.7% | N/A | N/A | N/A | UI Export only |
| **Level Started** | N/A | N/A | N/A | 9,231 | 9,899 | +7.2% | API Fetch only |
| **Level Completed** | N/A | N/A | N/A | 5,178 | 4,812 | -7.1% | API Fetch only |
| **Completion Rate** | N/A | N/A | N/A | 56.1% | 48.6% | -13.4% | API Fetch only |
| **1-Day Retention** | N/A | N/A | N/A | 100.0% | 100.0% | 0.0% | API Fetch only |
| **1-Week Retention** | N/A | N/A | N/A | 18.5% | 16.0% | -13.4% | API Fetch only |

## Key Discrepancies & Insights

### 1. **Scale Differences**
- **API shows 2-3× higher user/session counts** than UI export
- **Possible causes**: Different sampling, data collection methods, or filtering criteria
- **Impact**: Makes direct comparison challenging

### 2. **Session Duration Discrepancy**
- **UI Export**: 118min → 147min (+24.8%)
- **API Fetch**: 42.7min → 82.5min (+93.1%)
- **Difference**: ~3× longer durations in UI export
- **Possible causes**: Different duration calculation methods, engaged vs total sessions, data processing differences

### 3. **Retention Metrics**
- **API shows stronger stickiness improvements**: WAU/MAU +61% vs +19.4%, DAU/WAU +30.3% vs +6.0%
- **UI Export lacks detailed retention data** beyond returning users
- **API provides comprehensive retention analysis** (1-day through 1-month)

### 4. **Level Metrics Coverage**
- **UI Export**: Focuses on LevelData/Score events and ratios
- **API Fetch**: Detailed level progression (Started, Completed, Dropped, Failed)
- **Complementary insights**: UI shows activity volume, API shows completion behavior

### 5. **Engagement Rate Consistency**
- Both sources show **positive engagement rate improvement** post-drops
- **UI Export**: +2.8% (76.0% → 78.1%)
- **API Fetch**: +12.2% (72.8% → 81.7%)
- **Consistent signal**: Drops improve session quality

## Recommendations

### For Analysis
1. **Reconcile data sources**: Investigate root causes of scale/duration discrepancies
2. **Use API for retention**: More comprehensive retention metrics available
3. **Use UI for level activity**: Better coverage of gameplay event volume
4. **Cross-validate key metrics**: Compare engagement rate and user growth trends

### For Decision Making
1. **Drops impact is positive** across both data sources
2. **User growth**: 87-223% increase (strong signal)
3. **Engagement quality**: Improved in both datasets
4. **Retention**: Mixed signals - investigate API retention decline
5. **Session depth**: Significant improvement in both (despite duration discrepancy)

### Next Steps
1. Validate data collection methodologies between UI export and API fetch
2. Investigate session duration calculation differences
3. Consider using API data for retention analysis, UI data for activity volume
4. Monitor completion rate decline in API data (potential concern)

## Summary Verdict
Despite data source discrepancies, **drops implementation shows clear positive impact** on user engagement and growth across both datasets. The complementary nature of the data sources provides a more complete picture when analyzed together.</content>
<parameter name="filePath">/home/pdn/dev/abs/gd-math-godot/.analytics/gd-math-analytics/reports/drops_data_sources_comparison.md
