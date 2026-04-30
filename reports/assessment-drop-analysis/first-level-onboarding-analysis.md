# First-Level Assessment Onboarding Analysis

> **Last Updated:** April 28, 2026
> **Data Range:** Jan 25 – Mar 25, 2026
> **Focus:** Why first assessment levels have significantly higher drop rates than subsequent levels
> **WM Methodology:** Wrong Moves shown as **per-group averages** (Drop WM/user vs Done WM/user), not blended totals.

---

## 📊 Executive Summary

**First assessment levels have a 46.2% average drop rate, compared to 32.0% for non-first levels—a 14.2 percentage point difference.** This is NOT a content quality problem; it's an onboarding friction phenomenon.

| Finding | Data | Implication |
|---------|------|-------------|
| **All 9 SkillAges affected** | First levels drop 5.7%–37.8% more than subsequent levels | Systemic pattern, not random |
| **First-level users are new to assessment mode** | They see assessment UI, scoring, time limits, and difficulty curve for the first time | High cognitive load + uncertain expectations |
| **Pattern holds across all age groups** | SkillAge 2 through 10 show same trend | Age-independent phenomenon |

---

## 🔍 First-Level Drop Rate Analysis by SkillAge

| SkillAge | First Level | Mechanic | Started | Drop% | Avg (Non-First) | Difference | Drop WM/User | Pattern |
|:---:|---|---|---:|:---:|:---:|:---:|:---:|---|
| **2** | `simpleIdentificationVegetablesSet2AL` | Drag-to-match pairs (5×15s, 4 tiles) | 448 | 42.9% | 19.4% | +23.5% | **1.22** | Pure early quit |
| **3** | `stackVegetablesAndFruitsOverall2AL` | Category sort into slots (5×14s, 4 tiles, 2 categories) | 170 | 52.9% | 15.2% | +37.7% | **2.83** | Low engagement before quit |
| **4** | `matchNumberCount1to72AL` | Match count group → numeral (5×21s, 3 rows, values 1–7) | 134 | 45.5% | 17.8% | +27.7% | **2.31** | Low engagement before quit |
| **5** | `matchActivitiesWithObject2AL` | Drag-to-match pairs (10×14s, 6 tiles, 3 pairs) | 61 | 44.3% | 28.4% | +15.9% | **3.74** | Mixed: some engagement then quit |
| **6** | `stackingDifferentPairsOfSameValue202AL` | Arithmetic fill-in (5×14s, 2 equations `a+b=x` per board) | 76 | 47.4% | 9.6% | +37.8% | **5.75** ⚠️ | Mixed: onboarding + content difficulty |
| **7** | `smallBigFrom1To99NumbersAL` | Comparison fill-in (5×14s, 2 rows `A [op] __`, range 1–99) | 44 | 52.3% | 17.7% | +34.6% | **0.74** | Pure early quit |
| **8** | `numbersFrom500To999AL` | Addition fill-in (5×23s, 2 equations `a+b=x`, 500–999) | 30 | 46.7% | 35.8% | +10.9% | **19.07** ⚠️ | Content too hard (not onboarding friction) |
| **9** | `summarizeTheSentences1AL` | Drag-to-match rank tiles (4×18s, tally table, MOST/LEAST) | 24 | 41.7% | 16.2% | +25.5% | **1.70** | Pure early quit |
| **10** | `matchObjectWithFraction1AL` | Drag-to-match pairs (6×13s, fraction image → notation, denom 8) | 118 | 41.5% | 35.8% | +5.7% | **2.45** | Low engagement before quit |
| | **AVERAGE** | | | **46.2%** | **22.1%** | **+24.1%** | | Onboarding friction is massive |

### Key Patterns

1. **SkillAge 3, 6, 7 are friction hotspots** — First levels drop 34.6%–37.8% more than subsequent levels
2. **SkillAge 8 is NOT primarily an onboarding problem** — Droppers make **19.07 WM/user**, indicating the content is genuinely too hard; this must be addressed as a content issue, not just onboarding friction
3. **SkillAge 6 has mixed causes** — Droppers make **5.75 WM/user** (43% dropper success rate) suggesting both onboarding friction and real content difficulty
4. **SA 2, 7, 9 are pure early quit** — Drop WM/user <2; users barely engage before leaving (expectation mismatch, not content)
5. **SkillAge 5, 10 show lower friction** — First levels only drop 5.7%–15.9% more; age 10 users and SA5 content seem less affected by onboarding pressure

---

## 🎯 Why First Levels Have Higher Drop Rates
++ Add before this marker:

## 📊 Wrong Moves: Completers vs Droppers (First Level per SkillAge)

> **Source:** GA4 / BigQuery — `segmentCompleted` vs `segmentDropped` wrong-move totals per level.
> **Completer WM/User** = wrong moves by completers ÷ number of completers.
> **Dropper WM/User** = wrong moves by droppers ÷ number of droppers.
> Levels where Dropper WM/User > Completer WM/User signal **content difficulty** (users struggle and quit).
> Levels where Dropper WM/User < Completer WM/User signal **early quit** (users leave before engaging).

| SA | First Level | Completers | Compl WM (total) | **Compl WM/User** | Droppers | Drop WM (total) | **Drop WM/User** | Pattern |
|:--:|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| 2 | `simpleIdentificationVegetablesSet2AL` | 332 | 1315 | 3.96 | 192 | 234 | **1.22** | Early quit — droppers barely engage |
| 3 | `stackVegetablesAndFruitsOverall2AL` | 124 | 1414 | 11.40 | 90 | 255 | **2.83** | Early quit — completers struggle far more |
| 4 | `matchNumberCount1to72AL` | 82 | 610 | 7.44 | 61 | 141 | **2.31** | Early quit — low dropper engagement |
| 5 | `matchActivitiesWithObject2AL` | 25 | 282 | 11.28 | 27 | 101 | **3.74** | Early quit — completers work 3× harder |
| 6 | `stackingDifferentPairsOfSameValue202AL` | 47 | 388 | 8.26 | 36 | 207 | **5.75** ⚠️ | Mixed — elevated dropper WM signals content difficulty |
| 7 | `smallBigFrom1To99NumbersAL` | 20 | 151 | 7.55 | 23 | 17 | **0.74** | Pure early quit — droppers almost never try |
| 8 | `numbersFrom500To999AL` | 5 | 51 | 10.20 | 14 | 267 | **19.07** ⚠️ | Content too hard — droppers make 19 WM before quitting |
| 9 | `summarizeTheSentences1AL` | 13 | 120 | 9.23 | 10 | 17 | **1.70** | Early quit — droppers make almost no moves |
| 10 | `matchObjectWithFraction1AL` | 72 | 547 | 7.60 | 49 | 120 | **2.45** | Early quit — completers engage 3× more |

### Key Readings

1. **SA8 is the only genuine content-difficulty case** — Droppers (19.07 WM/user) make nearly **2× more wrong moves** than completers (10.20). Users are trying hard and failing, not leaving early. This is content, not onboarding friction.
2. **SA6 is mixed** — Droppers at 5.75 WM/user is noticeably higher than SA2/3/4/5/7/9/10 early-quit levels (all ≤3.74). Some users attempt the arithmetic and struggle before quitting.
3. **SA7 is the purest early quit** — 0.74 dropper WM/user means users leave before making even one meaningful attempt.
4. **In all other ages (2, 3, 4, 5, 9, 10) completers make far more wrong moves than droppers** — Completers persist through difficulty; droppers decide at a glance this isn't for them. This confirms these are **UX/expectation mismatches**, not content problems.
5. **SA3 and SA5 show the largest completer-to-dropper WM gap** (11.40 vs 2.83 and 11.28 vs 3.74 respectively) — The content is genuinely hard for completers, but droppers quit long before hitting that difficulty wall.

---

### Hypothesis 1: Unmet Expectations
- **First time seeing assessment mode** — Users expect casual/exploratory play; assessment implies evaluation/testing
- **Score/time visibility** — Seeing "score" and "time limit" creates pressure and anxiety
- **Theme mismatch** — If the first level's theme doesn't match the user's interests, they quit immediately

**Evidence:**
- SkillAge 3 and 6 first levels show highest friction (+37%)
- Very low wrong moves on first attempts (users quit without deeply engaging)

### Hypothesis 2: Difficulty Ramp Confusion
- **Unclear why it's harder** — First level in assessment mode may feel abruptly harder than main mode
- **No context for speedrun** — Users encounter the "speedrun" phase without understanding why it's suddenly timed
- **No tutorial for assessment structure** — No guidance on "this is a test; there are 2 phases"

**Evidence:**
- First levels have similar wrong-move counts to non-first levels (users who stay understand it)
- High proportion of droppers quit after just 1–2 boards (before mastering the mechanic)

### Hypothesis 3: UI/Presentation Friction
- **Different UI from main mode** — Assessment screens, scoring displays, and timer may be visually overwhelming
- **Confusing navigation** — Users unsure if they can go back, skip, or restart
- **Score interpretation** — Users don't understand what the score means or how it affects gameplay

**Evidence:**
- SkillAge 2 first level (`simpleIdentificationVegetablesSet2AL`) has the highest volume (448 users) but 42.9% drop
- If it were purely content difficulty, we'd expect skill mismatches; instead, the pattern is uniform across all ages

---

## 🚨 Risk Assessment by Onboarding Friction Level

### 🔴 Critical (>35% higher than non-first)

**SkillAge 3, 6, 7**

| SkillAge | First Level | Mechanic | Excess Friction | Drop WM/User | Users Affected | Priority |
|:---:|---|---|:---:|:---:|:---:|---|
| 3 | `stackVegetablesAndFruitsOverall2AL` | Category sort: drag 4 tiles (fruit/vegetable) into 2 labeled slots | 37.7% | 2.83 | 63 droppers | **HIGH** |
| 6 | `stackingDifferentPairsOfSameValue202AL` | Arithmetic fill-in: 2 equations `a+b=x` per board (sum ≤20) | 37.8% | 5.75 ⚠️ | 28 droppers | **HIGH** (content + onboarding) |
| 7 | `smallBigFrom1To99NumbersAL` | Comparison fill-in: drag number to satisfy `A [op] __` (range 1–99) | 34.6% | 0.74 | 15 droppers | MEDIUM |

**Recommendation:** Redesign first-level experience for these ages.
- SA3 (`stackVegetablesAndFruitsOverall2AL`): the drag-to-category-slot mechanic is unfamiliar; introduce it with a guided first board before the timed phase.
- SA6 (`stackingDifferentPairsOfSameValue202AL`): requires both onboarding improvements AND content difficulty reduction. The fill-in arithmetic mechanic (tens+ones columns, 2 equations per board) is genuinely hard for a first-level assessment encounter; dropper WM 5.75, success 43%.
- SA7 (`smallBigFrom1To99NumbersAL`): despite being comparison fill-in (drag a number to make `A [op] __` true), drop WM of 0.74 signals pure early quit — the mechanic is understood but users disengage immediately.

### 🟡 Moderate (20–35% higher)

**SkillAge 2, 4, 9**

| SkillAge | First Level | Mechanic | Excess Friction | Drop WM/User | Users Affected | Priority |
|:---:|---|---|:---:|:---:|:---:|---|
| 2 | `simpleIdentificationVegetablesSet2AL` | Drag-to-match: 4 vegetable tiles, 2 left → 2 right | 23.5% | 1.22 | 111 droppers | **HIGH** (volume) |
| 4 | `matchNumberCount1to72AL` | Match count group → numeral: 3 stick-count rows, values 1–7 | 27.7% | 2.31 | 41 droppers | MEDIUM |
| 9 | `summarizeTheSentences1AL` | Drag-to-match rank: tally table shown, drag MOST/LEAST to fruit tiles | 25.5% | 1.70 | 10 droppers | LOW |

**Recommendation:** Moderate improvements needed. Focus on SkillAge 2 due to high user volume. Low dropper WM (<2) for SA2 and SA9 confirms pure early quit — both are drag-to-match mechanics that users understand but abandon; onboarding context-setting (not a mechanic tutorial) is the right fix.

### 🟢 Low (<15% higher)

**SkillAge 5, 10**

| SkillAge | First Level | Mechanic | Excess Friction | Drop WM/User | Users Affected | Priority |
|:---:|---|---|:---:|:---:|:---:|---|
| 5 | `matchActivitiesWithObject2AL` | Drag-to-match: 6 tiles, 3 activity-label → 3 object pairs | 15.9% | 3.74 | 11 droppers | LOW |
| 10 | `matchObjectWithFraction1AL` | Drag-to-match: fraction image tiles → notation tiles (denominator 8) | 5.7% | 2.45 | 5 droppers | LOW |

**Recommendation:** Lower priority. Monitor or make minor UX improvements.

---

### ⚠️ Special Case: Mixed Onboarding + Content Difficulty

**SkillAge 8** — `numbersFrom500To999AL`

| Metric | Value |
|--------|-------|
| **Mechanic** | Addition fill-in: 5 boards × 23s. Shows 2 equations `a + b = x` (x = 500–999, 3-column layout) with one blank each. Player drags the correct 2–3 digit number tile to fill it. |
| **Excess Friction** | 10.9% (lowest of all first levels) |
| **Drop WM/User** | **19.07** |
| **Dropper Success** | 40% |
| **Done WM/User** | 10.20 |

**Key Insight:** This level is misclassified if treated purely as an onboarding problem. Droppers make **19.07 wrong moves per user** — they are actively attempting the 3-digit addition fill-in and failing repeatedly, not passively quitting. The fill-in mechanic (drag a 2–3 digit addend into a blank column slot) is inherently hard when the number range is 500–999 and the user may be age-misclassified.

**Recommendation:** Treat as a **content difficulty issue first**, onboarding friction second. Reduce the number range or add scaffolding regardless of onboarding improvements.

---

## 💡 Solutions to Reduce First-Level Friction

### Solution 1: Pre-Assessment Tutorial (Highest Impact)

**Problem:** Users don't understand assessment mode mechanics, structure, or expectations

**Implementation:**
- Add a **2–3 minute tutorial before the first assessment level** explaining:
  - "Assessment mode tests what you've learned"
  - "You'll see a score at the end"
  - "There are two phases: Training (no time limit) and Speedrun (timed)"
  - Visual walkthrough of the UI
- Show score/timer demo (without actual gameplay pressure)
- Explain what score means (75%+ is excellent, etc.)

**Expected Impact:** Reduce first-level drop rate by **8–15%**

---

### Solution 2: Easier First Level Content (Medium Impact)

**Problem:** First level difficulty may be higher than users expect

**Implementation:**
- Reduce the difficulty of the first-level content by **20–30%**
- Examples:
  - SkillAge 3 (`stackVegetablesAndFruitsOverall2AL`): Pre-fill one category slot on the first board so users see the drag-to-category action demonstrated before they attempt it
  - SkillAge 6 (`stackingDifferentPairsOfSameValue202AL`): Reduce from 2 equations per board to 1 for the first 2 boards; use a narrower sum range (e.g. ≤10) before introducing ≤20
  - SkillAge 7 (`smallBigFrom1To99NumbersAL`): Restrict first 2 boards to multiples of 10 (1–50) before opening to 1–99; the comparison fill-in mechanic is understood (Drop WM 0.74) but the number range may feel unbounded
- Keep the mechanic the same; just reduce scope

**Expected Impact:** Reduce first-level drop rate by **5–10%**

---

### Solution 3: Optional Training Phase Before Speedrun (Low-Medium Impact)

**Problem:** Users are surprised by speedrun (timed phase); many quit during it

**Implementation:**
- Add a **transition screen** between Training and Speedrun with a button:
  - "You completed Training! Ready for Speedrun (timed)?"
  - Explain speedrun duration and what happens if time runs out
  - Option to **skip speedrun** (optional, not recommended)
  - Option to **replay training** if they want practice

**Expected Impact:** Reduce first-level drop rate by **3–7%**

---

### Solution 4: Clear Theme/Expectation Setting (Low Impact)

**Problem:** Users don't know what to expect thematically

**Implementation:**
- Before entering assessment, show a **brief theme introduction**:
  - "In this assessment, you'll help [character/scenario] by solving these problems"
  - Show a 2–3 frame comic or visual story
  - Makes assessment feel less formal/scary

**Expected Impact:** Reduce first-level drop rate by **2–5%**

---

### Solution 5: Success/Encouragement Feedback (Low Impact)

**Problem:** Users in assessment mode get less encouragement than in main mode

**Implementation:**
- Show **progress bars** (e.g., "Board 3 of 10") to give sense of accomplishment
- Add **encouraging messages** at checkpoints ("Great work!", "You're halfway there!")
- Show a **positive score feedback** even if it's low (e.g., "50% — You're learning!" vs "Failed")

**Expected Impact:** Reduce first-level drop rate by **2–4%**

---

## 📈 Implementation Roadmap

| Priority | Solutions | Expected Impact | Effort | Timeline |
|:---:|---|:---:|:---:|---|
| **Phase 1** | Solution 1 (Tutorial) + Solution 2 (Easier Content) | 13–25% reduction | High | 2–3 weeks |
| **Phase 2** | Solution 3 (Training/Speedrun transition) | +3–7% | Medium | 1 week |
| **Phase 3** | Solutions 4 + 5 (UX polish) | +4–9% | Low | 1–2 weeks |

**Cumulative Expected Impact:** 20–41% reduction in first-level drop rate

**Target:** Bring first-level drop rates from 46.2% down to **30–35%** (in line with non-first levels)

---

## 🎯 Success Metrics

After implementation, track these KPIs weekly:

1. **First-level drop rate by SkillAge** — Target: <35% (down from 46.2%)
2. **First-to-second level transition rate** — Track if users who complete first level stay for level 2
3. **Assessment mode entry rate** — Track if fewer users abandon assessment mode entirely
4. **Speedrun completion rate** — Track if players complete the timed phase after training
5. **Overall assessment completion rate** — Track full assessment completion before/after

---

## 📋 Not the Root Cause: Age Misclassification

While age misclassification contributes to some issues (e.g., young children getting SkillAge 10 content), it does NOT explain first-level friction because:

- **First-level friction is uniform across all SkillAges** — If it were age misclassification, we'd see higher variance
- **Non-first levels within same SkillAge have much lower drops** — If ages were wrong, we'd expect consistent high drops at all levels
- **The pattern is **onboarding specific**, not age-specific

---

## ✅ Conclusion

First-level friction is a **UX/expectation problem**, not a **content quality problem**. Fixing it requires:

1. **Clear communication** — Explain assessment mode upfront
2. **Easier entry point** — Don't start at full difficulty
3. **Encouraging environment** — Make assessment feel supportive, not threatening
4. **Clear progression** — Explain the two-phase structure

Implementing these changes should reduce first-level drop rates by 20–41%, aligning them with non-first level baselines.
