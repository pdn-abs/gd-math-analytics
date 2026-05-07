# Drops Impact Analysis — Report Index

## Table of Contents
- [📋 Which Document Should I Use?](#-which-document-should-i-use)
  - [🟢 **For Action Planning & Final Verdicts**](#-for-action-planning--final-verdicts)
  - [🔵 **For Understanding the Gamification Timeline & Execution**](#-for-understanding-the-gamification-timeline--execution)
  - [🗄️ **For Raw Data Verification & Source Diagnostics**](#️-for-raw-data-verification--source-diagnostics)
- [🎯 Quick Decision Tree](#-quick-decision-tree)
- [📊 Key Insights: Did Drops Work?](#-key-insights-did-drops-work)
- [🔬 Methodology: How We Measured Impact](#-methodology-how-we-measured-impact)
- [🗂️ Related Files Directory](#️-related-files-directory)
- [📞 Questions?](#-questions)

---

> **Last Updated:** May 7, 2026
> **Key Insight:** The Q4 2025 "Drops" gamification system successfully drove massive user growth and weekly stickiness (WAU/MAU) without degrading session length or per-session quality.

---

## 📋 Which Document Should I Use?

### 🟢 **For Action Planning & Final Verdicts**
👉 **[Pre-Drops vs Post-Drops Engagement Analysis (Updated)](updated-drops-analysis-report.md)**

**What you'll find:**
- The final verdict on whether the gamification system succeeded or failed
- Comparisons between engagement rate, average session duration, and stickiness (DAU/WAU & WAU/MAU)
- Aggregate comparison of the Pre-Drops era (v4.3.0–v4.3.7) vs the Post-Drops era (v4.3.12–v4.3.19)

**When to use:** You are presenting the results to stakeholders or deciding whether to keep, tweak, or remove the Drops system.

---

### 🔵 **For Understanding the Gamification Timeline & Execution**
👉 **[GD Math Versions with Drops Features (Timeline)](drops-versions-timeline.md)**

**What you'll find:**
- The exact chronological timeline of when specific drop features (e.g., Combos, Confetti, Timers) were shipped per version
- The split between positive (rewards), neutral (visuals), and negative (challenges) drops
- Required additional metrics tracking capabilities to request from the engineering team ([Metrics Evaluation](drops-metrics-evaluation.md))

**When to use:** You need to correlate a specific feature launch with a specific app version, or you need to audit what data we are currently failing to track.

---

### 🗄️ **For Raw Data Verification & Source Diagnostics**
👉 **[Drops Data Sources Comparison](drops-data-sources-comparison.md)**

**What you'll find:**
- A deep dive into *why* the GA4 UI export and the GA4 API export show different user counts
- Analysis of sampling limits in Analytics
- The raw baseline API fetches (`drops-impact-analysis-api-fetch.md` / `drops-impact-analysis-ga4-api.md`)

**When to use:** You are an analyst or data engineer trying to reconcile mismatched active user counts between SQL, GA4 exports, and API data.

---

## 🎯 Quick Decision Tree

```
Are you focused on...

├─ "Did the drops system successfully increase engagement?"
│  └─> Use UPDATED DROPS ANALYSIS REPORT (`updated-drops-analysis-report.md`)
│
├─ "When exactly did we ship 'CoinPouches' vs 'GoldenCoins'?"
│  └─> Use DROPS VERSIONS TIMELINE (`drops-versions-timeline.md`)
│
├─ "What new Custom Dimensions do we need to track in Godot?"
│  └─> Use METRICS EVALUATION (`drops-metrics-evaluation.md`)
│
└─ "Why does my dashboard say 4,000 users but the CSV says 3,200?"
   └─> Use DATA SOURCES COMPARISON (`drops-data-sources-comparison.md`)
```

---

## 📊 Key Insights: Did Drops Work?

*   **Growth:** Post-Drops versions saw an astronomical surge in Active Users (+729%). While some of this may be marketing-driven, the product retained them.
*   **Weekly Stickiness (WAU/MAU):** Improved dramatically. Pre-Drops WAU/MAU sat at **9.3%**, while Post-Drops stabilized much higher at **26.9%**.
*   **Session Quality:** Average session duration naturally dipped due to the massive influx of new users, but remained remarkably stable (*~5m 11s*) demonstrating the gamification did not cause users to quit out of frustration or sensory overload.
*   **Peak Experience:** `v4.3.12` was the peak holistic experience version, pulling an exceptionally high 56.6% engagement rate.

---

## 🔬 Methodology: How We Measured Impact

Because GD Math did not A/B test the Drops system simultaneously on a single cohort, the analysis was performed chronologically by examining specific structural versions:

1.  **Pre-Drops Period:** Captured from *Jul 19 – Nov 19, 2025* spanning versions `v4.3.0`, `v4.3.2`, and `v4.3.7`.
2.  **Post-Drops Period:** Captured from *Nov 20, 2025 – Mar 11, 2026* spanning versions `v4.3.12`, `v4.3.15`, and `v4.3.19`.
3.  **Data Filtering:** Both periods were cleansed of unengaged anomalies (users with < 0 seconds engagement time) to prevent marketing bot-traffic from destroying the dataset.

---

## 🗂️ Related Files Directory

All reports are located in `/home/pdn/dev/abs/gd-math-godot/.analytics/gd-math-analytics/reports/drops-impact-analysis/`

| File | Purpose |
|------|---------|
| `updated-drops-analysis-report.md` | **[USE THIS]** The definitive verdict and engagement comparisons. |
| `drops-versions-timeline.md` | Chronological map of when specific gamification features were added to the engine. |
| `drops-metrics-evaluation.md` | Audit of missing metrics/dimensions we need to add to Godot. |
| `drops-data-sources-comparison.md` | Technical explanation of GA4 API sampling vs User Interface exports. |
| `analytics-insights-on-impact-of-drops.md` | Original exploratory insights (reference only). |
| `predrops-vs-postdrops-engagement-analysis.md` | Previous draft of the updated report (reference only). |
| `*-api-fetch.md` / `*.ga4-api.md` | Raw API CSV dumps and query parameters. |

---

## 📞 Questions?

Refer to `updated-drops-analysis-report.md` for the core strategic answers, or `drops-metrics-evaluation.md` for engineering implementation questions.
