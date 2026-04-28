# Assessment Drop Analysis — Report Index

> **Last Updated:** April 27, 2026
> **Key Insight:** First assessment levels have +24% higher drop rates due to onboarding friction, not content quality

---

## 📋 Which Document Should I Use?

### 🟢 **For Action Planning / Content Improvement**
👉 **[Revised Assessment Drop Analysis (Non-First Levels)](revised-assessment-drop-analysis-table.md)**

**What you'll find:**
- Tier 1, 2, 3 action plans **excluding first levels**
- Root cause analysis for each problematic level
- Specific, actionable recommendations
- Comparison between first-level friction and real content issues

**When to use:** You're deciding what to fix in the game

---

### 🔵 **For Understanding First-Level Friction**
👉 **[First-Level Onboarding Analysis](first-level-onboarding-analysis.md)**

**What you'll find:**
- Why first levels have 46.2% average drop rate (vs 32% for non-first)
- Drop rate analysis by SkillAge
- Root causes: unmet expectations, difficulty ramp confusion, UI friction
- 5 solutions to reduce first-level friction with expected impact
- Implementation roadmap

**When to use:** You're improving the assessment mode entry experience

---

### ⚠️ **For Reference Only (DEPRECATED)**
👉 **[Original Assessment Drop Analysis Table](assessment-drop-analysis-table.md)**

**Status:** Includes first levels; methodology issues identified
**Kept for:** Historical reference / git history
**DO NOT USE FOR:** New action planning (use Revised Analysis instead)

---

## 🎯 Quick Decision Tree

```
Are you focused on...

├─ "What content should we redesign?"
│  └─> Use REVISED ANALYSIS (non-first levels)
│
├─ "How do we make assessment mode less scary?"
│  └─> Use FIRST-LEVEL ONBOARDING ANALYSIS
│
├─ "I want to understand the original analysis"
│  └─> Use ORIGINAL TABLE (reference only)
│
└─ "I want to understand the methodology"
   └─> Keep reading this document
```

---

## 📊 Key Numbers to Remember

| Metric | First Levels | Non-First Levels | Difference |
|--------|:---:|:---:|:---:|
| **Average Drop Rate** | 46.2% | 32.0% | +14.2% |
| **Sample Levels** | 9 (one per SkillAge) | 35+ | - |
| **Total Users** | 1,107 | 1,409 | - |
| **Range (First)** | 41.5%–52.9% | 0%–51.0% | - |
| **Range (Non-First)** | - | 0%–51.0% | - |

---

## 🔬 Methodology: Why We Split Analysis

### Original Problem
The initial assessment drop analysis flagged `simpleIdentificationVegetablesSet2AL` (42.9% drop) as a critical content issue. But follow-up analysis revealed:

**All 9 SkillAges** have first levels with **5.7%–37.8% higher drop rates** than their non-first levels. This pattern is too consistent to be a content quality issue—it's a systemic onboarding problem.

### Root Cause
First assessment levels confound two separate issues:
1. **Onboarding friction** — Users are unfamiliar with assessment mode UI, expectations, and format
2. **Content quality** — Some levels genuinely have harder mechanics or concepts

**Solution:** Separate the analysis into two independent tracks.

### How We Did It
1. **Identified first level** (lowest sequence number) for each SkillAge 2–10
2. **Calculated drop rates** for first vs non-first within each SkillAge
3. **Found +24.4% average difference** — Onboarding friction is massive
4. **Analyzed non-first levels separately** to identify real content issues

---

## 📈 Expected Improvements from Both Solutions

| Intervention | Expected Drop Rate Reduction | Effort | Timeline |
|---|:---:|:---:|:---:|
| **Revised Content Fixes** (Tier 1 from non-first levels) | 3–15% (per level) | High | 2–4 weeks |
| **Onboarding UX Improvements** (from first-level analysis) | 20–41% (across all first levels) | High | 2–3 weeks |
| **Combined Effect** | 23–56% overall reduction | Very High | 4–6 weeks |

---

## 🗂️ Related Files

All reports are in `/home/pdn/dev/abs/gd-math-godot/.analytics/gd-math-analytics/reports/assessment-drop-analysis/`

| File | Purpose |
|------|---------|
| `revised-assessment-drop-analysis-table.md` | **[USE THIS]** Action plans excluding first levels |
| `first-level-onboarding-analysis.md` | Separate analysis of first-level friction |
| `assessment-drop-analysis-table.md` | Original analysis (reference only) |
| `assessment-wrong-moves-success-rate.md` | Detailed metrics by level (supporting data) |
| `level-failure-by-skillage.md` | Failure rates by SkillAge (supporting data) |
| `final-assessment-drop-analysis-report.md` | Comprehensive original report (reference) |

---

## ❓ FAQ

**Q: Should I fix the first levels first or non-first levels first?**
A: **Parallel:** Fix non-first content issues (3–4 weeks) while designing first-level UX improvements (2–3 weeks). Both can proceed independently.

**Q: Why does SkillAge 8 have only 10.9% friction but SkillAge 6 has 37.8%?**
A: Unknown; hypothesis is that older users (SkillAge 8–10) are more resilient to UI/format changes. Lower SkillAges may be more sensitive to assessment mode anxiety.

**Q: Is age-profiling really not the issue?**
A: Correct. Age-profiling (young children getting SkillAge 10 content) exists and affects levels like `matrixMultiplicationRandomNumbers3AL`, but it does NOT explain first-level friction because:
- Pattern is uniform across all SkillAges (age groups)
- Non-first levels show low drops, proving ages aren't uniformly wrong
- First levels are threshold issue, not systematic misclassification

**Q: What should I prioritize if I have limited time?**
A:
1. Fix onboarding UX first (20–41% drop reduction, affects all users)
2. Then fix Tier 1 non-first levels (mergeNumber, orderUpToSeven, stackMultiStick, matrixMultiplication)

---

## 📞 Questions?

Refer to the specific analysis documents for detailed explanations, data tables, and implementation guidance.
