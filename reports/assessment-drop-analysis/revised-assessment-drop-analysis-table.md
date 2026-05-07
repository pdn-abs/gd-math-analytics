# Assessment Drop Analysis: Revised Action Plan (Non-First Levels)

## Table of Contents
- [📌 Executive Summary](#-executive-summary)
- [🔴 Tier 1: Critical High-Impact Issues](#-tier-1-critical-high-impact-issues)
  - [Priority 1A: `mergeNumberUpTo9WithBAsTwoAL` (SkillAge 5)](#priority-1a-mergenumberupto9withbastwoal-skillage-5)
  - [Priority 1B: `orderUpToSevenNumber2AL` (SkillAge 5)](#priority-1b-orderuptosevennumber2al-skillage-5)
  - [Priority 1C: `stackMultiStickInMultiSlot1To52AL` (SkillAge 4)](#priority-1c-stackmultistickinmultislot1to52al-skillage-4)
  - [Priority 1D: `matrixMultiplicationRandomNumbers3AL` (SkillAge 10)](#priority-1d-matrixmultiplicationrandomnumbers3al-skillage-10)
- [🟡 Tier 2: Moderate Impact Issues](#-tier-2-moderate-impact-issues)
  - [Priority 2A: `fractionMultiplication6AL` (SkillAge 10)](#priority-2a-fractionmultiplication6al-skillage-10)
  - [Priority 2B: `simpleIdentificationToysSet22AL` (SkillAge 2)](#priority-2b-simpleidentificationtoysset22al-skillage-2)
  - [Priority 2C: `writeLevelSimpleLine2AL` (SkillAge 3, Geometry)](#priority-2c-writelevelsimpleline2al-skillage-3-geometry)
  - [Priority 2D: `missingBRandomAAndB50To99AL` (SkillAge 7)](#priority-2d-missingbrandomaandb50to99al-skillage-7)
- [🟢 Tier 3: Lower Priority](#-tier-3-lower-priority)
  - [Priority 3A: `stackColorTilesSet1And22AL` (SkillAge 2)](#priority-3a-stackcolortilesset1and22al-skillage-2)
- [📊 Comparison: Non-First Levels vs First Levels](#-comparison-non-first-levels-vs-first-levels)
- [🔎 Mechanics Overlap Check (9 Problematic vs Remaining 35)](#-mechanics-overlap-check-9-problematic-vs-remaining-35)
  - [A) Broad Mechanic-Family Overlap (parser + leftVariant + rightVariant)](#a-broad-mechanic-family-overlap-parser-leftvariant-rightvariant)
  - [B) Strict Nearest-Mechanic Twins (same family + closest cognitive pattern)](#b-strict-nearest-mechanic-twins-same-family-closest-cognitive-pattern)
  - [Practical Takeaway](#practical-takeaway)
  - [C) Performance Comparison: 9 Problematic Levels vs Twins](#c-performance-comparison-9-problematic-levels-vs-twins)
    - [Readout](#readout)
- [🎯 Recommendations Summary](#-recommendations-summary)
  - [Immediate Actions (High Impact)](#immediate-actions-high-impact)
  - [Medium-Term Actions](#medium-term-actions)
  - [Lower Priority](#lower-priority)
- [� Section D: Twin-Comparison Inferences — Why Each Problematic Level Underperforms](#-section-d-twin-comparison-inferences-why-each-problematic-level-underperforms)
  - [D1. `mergeNumberUpTo9WithBAsTwoAL` vs `numbersFrom500To999AL`](#d1-mergenumberupto9withbastwoal-vs-numbersfrom500to999al)
  - [D2. `orderUpToSevenNumber2AL` vs `descendingOrdering1to999by50AL`](#d2-orderuptosevennumber2al-vs-descendingordering1to999by50al)
  - [D3. `stackMultiStickInMultiSlot1To52AL` vs `stackMultiStick1To52AL`](#d3-stackmultistickinmultislot1to52al-vs-stackmultistick1to52al)
  - [D4. `matrixMultiplicationRandomNumbers3AL` vs `givenSmartChartScale6AL`*](#d4-matrixmultiplicationrandomnumbers3al-vs-givensmartchartscale6al)
  - [D5. `fractionMultiplication6AL` vs `multiplication3TableAL`](#d5-fractionmultiplication6al-vs-multiplication3tableal)
  - [D6. `simpleIdentificationToysSet22AL` vs `simpleIdentificationVegetablesSet2AL`](#d6-simpleidentificationtoysset22al-vs-simpleidentificationvegetablesset2al)
  - [D7. `writeLevelSimpleLine2AL` vs `writeLevel1To52AL`](#d7-writelevelsimpleline2al-vs-writelevel1to52al)
  - [D8. `missingBRandomAAndB50To99AL` vs `stackingDifferentPairsOfSameValue202AL`](#d8-missingbrandomaandb50to99al-vs-stackingdifferentpairsofsamevalue202al)
  - [D9. `stackColorTilesSet1And22AL` vs `sortRedGreenYellowWhiteBlackGray2AL`](#d9-stackcolortilesset1and22al-vs-sortredgreenyellowwhiteblackgray2al)
- [�📋 Related Documents](#-related-documents)

---


> **Last Updated:** April 28, 2026
> **Methodology:** Excludes first assessment level for each SkillAge to remove onboarding friction bias
> **First Levels Excluded:** 9 levels (see [First-Level Onboarding Analysis](first-level-onboarding-analysis.md))
> **WM Methodology:** Wrong Moves (WM) shown as **per-group averages** — Droppers WM/user vs Completers (Done) WM/user. Previous blended totals have been replaced with accurate per-group figures.

---

## 📌 Executive Summary

After excluding first assessment levels (which have +24.4% higher drop rates due to onboarding friction), we identify the *actual* content quality problems:

- **Tier 1 (Critical):** 4 levels with 38–51% drop rates and significant user volume
- **Tier 2 (Moderate):** 4 levels with 20–29% drop rates, mixed causes
- **Tier 3 (Lower Priority):** 1 level with 19% drop rate

**Key Finding:** Non-first levels show *three distinct patterns*:
1. **Content Difficulty / Frustration** — Droppers make *more* wrong moves than completers; users struggle and eventually give up (not a UI issue)
2. **Content Too Hard** — Users lack skill; success rates are low even for completers; wrong moves are extreme
3. **Early Quit / Passive Disengagement** — Droppers make very few wrong moves before leaving; content is understood but users don't feel compelled to finish

---

## 🔴 Tier 1: Critical High-Impact Issues

**Selection Criteria:** ≥20 users started AND ≥38% drop rate

### Priority 1A: `mergeNumberUpTo9WithBAsTwoAL` (SkillAge 5)

| Metric | Value |
|--------|-------|
| **Mechanic** | Merge-and-place: 4 boards × 23s. Left side shows 2 columns × 3 rows of movable tiles: one column has number tiles (1–7 windowed by board), the other has only 2-tiles. Player drags a number tile over a 2-tile to merge and create a sum tile, then drags that sum tile into slot(s) with silhouette targets of the required sum number. This interaction template is also used by `numbersFrom500To999AL` (with larger place values). |
| **Users Started** | 51 |
| **Drop Rate** | 51.0% |
| **Success (Completers)** | 88% |
| **Success (Droppers)** | 59% |
| **Drop WM/User** | **11.92** |
| **Done WM/User** | 7.37 |
| **Avg Time (Done/Drop)** | 103s / 110s |

**Root Cause: Content Difficulty + Frustration (Droppers Struggle Harder Than Completers)**
- Droppers make **11.92 wrong moves per user** — *more* than completers (7.37 WM/user)
- This is the defining signal: slower learners make more mistakes, get frustrated, and quit — despite partial success (59%)
- Those who complete have **88% success** and fewer wrong moves → faster learners push through
- Droppers spend **110 seconds** (similar to completers at 103s) — showing they engage deeply before quitting
- **Signature:** Drop WM > Done WM = frustration/difficulty barrier, not a UI or instruction issue

**Action:**
1. **Add merge-mechanic onboarding on first board** — Use a forced mini-demo: drag a number tile over a 2-tile to create a sum tile, then place it into a silhouette slot.
2. **Add merge-specific adaptive hints** — Trigger contextual hints when users make repeated non-merge drags (e.g., highlight valid merge pairs, then pulse the target silhouette after a correct merge).
3. **Strengthen merge feedback to reduce frustration** — Add clear snap/glow/sum-pop feedback at merge time and positive reinforcement for valid merge attempts, not only final correct placement.
4. **Reduce complexity ramp after merge mastery** — Keep early boards constrained to easier sums and gradually increase number range only after users demonstrate successful merge-and-place completion.

---

### Priority 1B: `orderUpToSevenNumber2AL` (SkillAge 5)

| Metric | Value |
|--------|-------|
| **Mechanic** | Order: 5 boards × 14s (70s total). 4–6 shuffled number tiles (range 1–7, window advances per board). Player drags them into ascending-order position slots. |
| **Users Started** | 77 |
| **Drop Rate** | 41.6% |
| **Success (Completers)** | 85% |
| **Success (Droppers)** | 75% |
| **Drop WM/User** | **1.09** |
| **Done WM/User** | 5.70 |
| **Avg Time (Done/Drop)** | 48s / 72s |

**Root Cause: Early Quit / Passive Disengagement (NOT Comprehension)**
- Droppers make only **1.09 wrong moves per user** — near-zero content engagement before leaving
- Despite spending **72 seconds** at the level, they barely attempt the boards (vs 5.70 WM for completers)
- Droppers have **75% success** on boards they do attempt → they understand the content perfectly
- **Signature:** Low drop WM (1.09) + long drop time (72s) + high dropper success (75%) = users understand but feel uncompelled to continue
- **The level is 5 boards × 14s = 70s total.** Drop time of 72s ≈ full level duration — droppers are spending time on all boards without placing tiles, effectively letting the timer expire rather than engaging (≈0.22 WM per board)
- The root cause is **lack of engagement with the drag-to-sort mechanic**, not board count or length
- ⚠️ **Previous classification as "Comprehension Barrier" was incorrect** — based on blended 5.41 WM/user that mixed completer and dropper data
- ⚠️ **Previous attribution to "20-board length" was also incorrect** — the level has 5 boards; that note was based on an earlier misread of the config

**Action:**
1. **Improve mechanic engagement** — The level is already only 5 boards; the problem is that passive users let the timer run out without dragging tiles. Consider adding an animated drag-prompt when no interaction occurs for >3s
2. **Improve first-move activation before scaling challenge** — Add ghost-drag guidance and a quick reward for first placement; only increase tile count after first-move rate improves.
3. **Review ordering mechanic appeal** — Consider adding visual variation (e.g. number line display, colour coding) to make the ascending-sort goal more compelling
4. **Do NOT add more instructions** — Dropper WM data confirms users understand the content; adding tutorials would have no impact

---

### Priority 1C: `stackMultiStickInMultiSlot1To52AL` (SkillAge 4)

| Metric | Value |
|--------|-------|
| **Mechanic** | Part-whole count: 5 boards × 25s (125s total). Each board shows 3 labeled count slots — total `x` (2–5), part `b` (1–2), part `a = x−b`. Player drags visual stick-count groups into all three slots simultaneously. |
| **Users Started** | 63 |
| **Drop Rate** | 39.7% |
| **Success (Completers)** | 89% |
| **Success (Droppers)** | 83% |
| **Drop WM/User** | **2.84** |
| **Done WM/User** | 7.50 |
| **Avg Time (Done/Drop)** | 162s / 72s |

**Root Cause: Per-Board Cognitive Overload (NOT Board Count)**
- **162-second completion time** vs 125s allotted (5 boards × 25s) — completers consistently exceed the board time, averaging ~32s per board
- The level has **only 5 boards**; the grind comes from per-board complexity: filling 3 simultaneous count slots (x, a, b where a+b=x) requires understanding a part-whole relationship plus correctly counting and placing each stick group
- Droppers make **2.84 WM/user** — moderate engagement; they attempt the mechanic but abandon when the 3-slot constraint is not resolved within the time limit
- Droppers understand the concept at a surface level (83% success, 72s drop time) but the simultaneous 3-slot fill requirement amplifies errors under time pressure

**Action:**
1. **Preserve 3-slot construct but scaffold early boards** — Keep the x/a/b part-whole structure, but prefill one slot on initial boards so users solve the same construct with lower working-memory load.
2. **Extend the board time** — 25s is insufficient for the 3-slot fill at this age; increase to 35–40s to reduce time-pressure abandonment
3. **Streamline animations** — Faster stick placement to reduce mechanical wait time per board

---

### Priority 1D: `matrixMultiplicationRandomNumbers3AL` (SkillAge 10)

| Metric | Value |
|--------|-------|
| **Mechanic** | Matrix fill: 5 boards × 36s. A 4×4 multiplication grid with headers from [6,7,8,9]. 4 random cells are blank per board. Player drags the correct product tile into each blank cell. |
| **Users Started** | 26 |
| **Drop Rate** | 38.5% |
| **Success (Completers)** | 54% |
| **Success (Droppers)** | 40% |
| **Drop WM/User** | **11.00** |
| **Done WM/User** | **46.08** ⚠️ extreme |
| **Avg Time (Done/Drop)** | 144s / 99s |

**Root Cause: Content Too Hard + Likely Age Misclassification**
- **Done WM/user = 46.08** — catastrophically high; completers make 46 wrong moves to finish the level
- **Drop WM/user = 11.00** — even droppers who quit early rack up 11 wrong moves
- Success rate **54%** for completers (below 75% threshold) confirms the content is genuinely too hard
- Data strongly suggests a **young child** is being given parent-level content
- Most drops (65%) occur in **Speedrun** (timed phase), indicating parent gives up under time pressure

**Action (Immediate):**
1. **Fix DOB/age-profiling system first** — This level is expected to perform better once age classification improves
2. **Post-fix monitoring** — Re-evaluate this level's metrics after clean age data is available

**Action (Content):**
1. **Add a prerequisite training level** — Introduce matrix multiplication concept with smaller numbers
2. **Simplify the matrix dimensions** — Use 2×2 or 2×3 instead of larger grids
3. **Allow unlimited time in training** — Remove time pressure until the mechanic is mastered

---

## 🟡 Tier 2: Moderate Impact Issues

**Selection Criteria:** ≥10 users started AND 20–37% drop rate

### Priority 2A: `fractionMultiplication6AL` (SkillAge 10)

| Metric | Value |
|--------|-------|
| **Mechanic** | Fraction fill-in: 6 boards × 27s. Shows 2 fraction multiplication equations `a × b = __` per board (mixed fractions, denominator 4, result 2–12). Player drags the correct fraction tile into the product slot. |
| **Users Started** | 49 |
| **Drop Rate** | 24.5% |
| **Success (Completers)** | 72% |
| **Success (Droppers)** | 61% |
| **Drop WM/User** | **3.00** |
| **Done WM/User** | 12.93 |

**Root Cause: Content Difficulty + Age Misclassification**
- Completers make **12.93 WM/user** — confirming the content is genuinely hard for engaged users
- Droppers make **3.00 WM/user** — partial engagement before quitting; some early-quit component
- **72% success for completers** (below 75% threshold) indicates the concept is hard even when mastered
- Similar to 1D: likely impacted by young children receiving SkillAge 10 content

**Action:**
1. **Fix age-profiling first** — Much of this issue may resolve with correct user ages
2. **Add fraction prerequisite concepts** — Ensure users understand basic fractions before multiplication
3. **Use visual fraction bars** — Make the multiplication operation visually concrete

---

### Priority 2B: `simpleIdentificationToysSet22AL` (SkillAge 2)

| Metric | Value |
|--------|-------|
| **Mechanic** | Drag-to-match: 5 boards × 11s. 4 toy picture tiles shown — 2 on the left, 2 on the right. Player drags each left tile to its matching pair on the right. |
| **Users Started** | 259 |
| **Drop Rate** | 24.3% |
| **Success (Completers)** | 92% |
| **Success (Droppers)** | 91% |
| **Drop WM/User** | **0.35** ⚠️ |
| **Done WM/User** | 1.81 |

**Root Cause: Pure Early Quit — Users Barely Engage Before Leaving**
- Droppers make only **0.35 wrong moves per user** — near-zero engagement; users glance at the level and quit
- **91–92% success for both groups** confirms the content is easy and well-understood
- This is not a content problem; users are leaving for motivational or contextual reasons before even trying
- The 24.3% drop likely carries over from users who pattern-quit after the first-level assessment experience

**Action:**
1. **Monitor after DOB fix** — Drop rate should improve once first-level dropout filter is better
2. **A/B test toy theme vs vegetable theme** — Determine if content variety helps retention
3. **Low priority** — Consider this level lower priority until age-profiling is fixed

---

### Priority 2C: `writeLevelSimpleLine2AL` (SkillAge 3, Geometry)

| Metric | Value |
|--------|-------|
| **Mechanic** | Trace: 5 boards × 14s. Player traces a dotted-line path character from the `writeLevelLineSet` (simple lines, not numerals) with finger/stylus. |
| **Users Started** | 25 |
| **Drop Rate** | 20.0% |
| **Success (Completers)** | 0% |
| **Success (Droppers)** | 0% |
| **Wrong Moves Total** | 0 |

**Root Cause: Write/Trace Level (Data Not Tracked)**
- Write/trace levels do not track success metrics or wrong moves in GA4
- **Drop rate of 20%** is the only reliable signal
- Likely indicating: users struggle with interface, difficulty is high, or the activity is not engaging

**Action:**
1. **Conduct UX testing** — Observe how children interact with the drawing interface
2. **Validate difficulty** — Is the line-drawing task too hard for SkillAge 3?
3. **Explore engagement** — Is the write/trace mechanic less engaging than matching/stacking?
4. **Consider alternative mechanics** — Replace writing with a selection-based activity if low engagement persists

---

### Priority 2D: `missingBRandomAAndB50To99AL` (SkillAge 7)

| Metric | Value |
|--------|-------|
| **Mechanic** | Addition fill-in: 5 boards × 14s. Shows 2 equations `a + __ = x` or `a + b = __` in tens/ones columns (sum range 50–99). Player drags the missing addend or total tile into the blank slot. |
| **Users Started** | 17 |
| **Drop Rate** | 29.4% |
| **Success (Completers)** | 76% |
| **Success (Droppers)** | 67% |
| **Drop WM/User** | **2.40** |
| **Done WM/User** | 5.75 |

**Root Cause: Moderate Difficulty + Low Volume**
- 29.4% drop is elevated but not critical
- **Small user volume (17)** makes this a lower statistical priority
- Droppers make **2.40 WM/user** and have 67% success — moderate engagement, then give up
- Done users at **5.75 WM/user** confirms some challenge but the content is learnable

**Action:**
1. **Monitor retention** — Track if drop rate stays stable or worsens
2. **Simplify number range** — Start with 50–75, then progress to 50–99
3. **Add visual number line** — Help users anchor the missing number spatially

---

## 🟢 Tier 3: Lower Priority

**Selection Criteria:** ≥5 users started AND 15–19% drop rate

### Priority 3A: `stackColorTilesSet1And22AL` (SkillAge 2)

| Metric | Value |
|--------|-------|
| **Mechanic** | Category sort: 5 boards × 18s. 4 colored tiles (2 per color, 2 random colors from 6) shown shuffled. Two labeled color-category slots shown. Player drags each tile into its matching color slot. |
| **Users Started** | 163 |
| **Drop Rate** | 19.6% |
| **Success (Completers)** | 86% |
| **Success (Droppers)** | 80% |
| **Drop WM/User** | **1.06** |
| **Done WM/User** | 3.52 |

**Root Cause: Minor Drop Signal / Mild Early Quit**
- 19.6% drop rate is close to expected baseline for SkillAge 2
- **High success rates (86% / 80%)** indicate strong understanding for both groups
- **Drop WM/user of 1.06** and **Done WM/user of 3.52** both confirm low difficulty and high understanding
- Droppers leave early with minimal wrong moves — mild disengagement, not content difficulty
- This is likely natural variation or carry-over from early-level dropout patterns

**Action:**
1. **Monitor but no immediate action** — This level is performing acceptably
2. **Track changes** — If drop rate climbs above 25%, revisit

---

## 📊 Comparison: Non-First Levels vs First Levels

| Metric | Non-First Levels (Tier 1–3) | First Levels Only | Difference |
|--------|:--:|:--:|:--:|
| **Average Drop Rate** | 32.0% | 46.2% | **+14.2%** |
| **Sample Levels** | 9 | 9 | - |
| **Total Users Started** | 437 | 1,107 | - |
| **Highest Drop Rate** | 51.0% | 52.9% | Similar |

**Interpretation:**
- **Non-first levels have 14.2% lower drop rates** than first levels on average
- First-level friction accounts for ~25% of all assessment drops
- Non-first levels show more *variation* in drop rates, indicating genuine content quality differences rather than uniform onboarding friction

---

## 🔎 Mechanics Overlap Check (9 Problematic vs Remaining 35)

Question answered: among the 35 non-problematic assessment levels, do any share mechanics with the 9 problematic levels?

### A) Broad Mechanic-Family Overlap (parser + leftVariant + rightVariant)

| Problematic Level | Mechanic Family | Matching Levels in Remaining 35 |
|---|---|---:|
| `mergeNumberUpTo9WithBAsTwoAL` | `icmV2 | numberTile | numberSlot` | 17 |
| `orderUpToSevenNumber2AL` | `icmV2 | numberTile | numberSlot` | 17 |
| `missingBRandomAAndB50To99AL` | `icmV2 | numberTile | numberSlot` | 17 |
| `fractionMultiplication6AL` | `icmV2 | numberTile | numberSlot` | 17 |
| `stackColorTilesSet1And22AL` | `icmV2 | numberTile | numberSlot` | 17 |
| `matrixMultiplicationRandomNumbers3AL` | `icmV2 | numberTile | numberTile` | 12 |
| `simpleIdentificationToysSet22AL` | `icmV2 | numberTile | numberTile` | 12 |
| `stackMultiStickInMultiSlot1To52AL` | `icmV2 | countSlot | countTile` | 1 |
| `writeLevelSimpleLine2AL` | `legacy | characterTrace | numberTile` | 1 |

### B) Strict Nearest-Mechanic Twins (same family + closest cognitive pattern)

| Problematic Level | Strict Nearest Twin(s) in Remaining 35 | Why Nearest |
|---|---|---|
| `stackMultiStickInMultiSlot1To52AL` | `stackMultiStick1To52AL` | Same count-slot/count-tile family and same visual stick counting construct; closest operational behavior.
| `writeLevelSimpleLine2AL` | `writeLevel1To52AL` | Same trace mechanic family (`legacy | characterTrace | numberTile`), same finger/stylus tracing loop.
| `simpleIdentificationToysSet22AL` | `simpleIdentificationVegetablesSet2AL`, `matchObjectSetFirst2AL`, `simpleIdentificationAnimalsSet1And22AL` | Same tile-to-tile recognition style with low abstraction and similar SA2–3 interaction demands.
| `orderUpToSevenNumber2AL` | `descendingOrdering1to999by50AL` | Same drag-to-slot ordering pattern (sequence placement), but different number range/direction.
| `missingBRandomAAndB50To99AL` | `fillSubtractionStaticB3UpTo52AL`, `stackingDifferentPairsOfSameValue202AL`, `subtractionMissingAUpTo20AL` | Same equation slot-fill family; nearest arithmetic fill-in behavior (different operators/ranges).
| `fractionMultiplication6AL` | `multiplication3TableAL`, `division4TableAL` | Same slot-fill arithmetic family; nearest in operation-driven numeric construction (fraction complexity is higher).
| `stackColorTilesSet1And22AL` | `sortRedGreenYellowWhiteBlackGray2AL`, `stackVegetablesAndFruitsOverall2AL`, `stackUtensilsVehicles2AL` | Same slot-fill family and same category-sort cognitive pattern (concrete visual grouping).
| `mergeNumberUpTo9WithBAsTwoAL` | `numbersFrom500To999AL` | Same merge-then-place equation template (tile overlap merge, then slot placement). Main difference is numeric range/place-value complexity.
| `matrixMultiplicationRandomNumbers3AL` | *(No true twin)* | Shares tile-to-tile family with 12 levels, but 4×4 matrix blank-cell multiplication makes it uniquely high-load.

### Practical Takeaway

- **Yes, overlap exists heavily at broad mechanic-family level** (especially `icmV2 | numberTile | numberSlot`).
- **Only 2 problematic levels have true near-twins by strict behavior** (`stackMultiStickInMultiSlot1To52AL`, `writeLevelSimpleLine2AL`).
- For `mergeNumberUpTo9WithBAsTwoAL` and `matrixMultiplicationRandomNumbers3AL`, family overlap is misleading: their *internal task structure* is effectively unique and should be treated as custom design problems.

### C) Performance Comparison: 9 Problematic Levels vs Twins

Metrics source: `.analytics/gd-math-analytics/CSV/assessment_wrongMoves_successRate.csv`

| Problematic Level | Twin Used for Comparison | Drop Rate % (P vs T) | Done Success % (P vs T) | Drop WM/User (P vs T) | Done WM/User (P vs T) | Done Avg Duration s (P vs T) |
|---|---|---:|---:|---:|---:|---:|
| `mergeNumberUpTo9WithBAsTwoAL` | `numbersFrom500To999AL` | 51.0 vs 46.7 | 88.3 vs 81.3 | 11.92 vs 19.07 | 7.37 vs 10.20 | 103.0 vs 90.5 |
| `orderUpToSevenNumber2AL` | `descendingOrdering1to999by50AL` | 41.6 vs 33.3 | 85.0 vs 86.1 | 1.09 vs 18.00 | 5.70 vs 4.67 | 47.9 vs 79.8 |
| `stackMultiStickInMultiSlot1To52AL` | `stackMultiStick1To52AL` | 39.7 vs 13.6 | 88.6 vs 83.8 | 2.84 vs 3.29 | 7.50 vs 4.94 | 162.1 vs 47.1 |
| `matrixMultiplicationRandomNumbers3AL` | `givenSmartChartScale6AL`* | 38.5 vs 44.4 | 54.4 vs 86.5 | 11.00 vs 6.75 | 46.08 vs 5.60 | 143.9 vs 78.9 |
| `fractionMultiplication6AL` | `multiplication3TableAL` | 24.5 vs 50.0 | 71.6 vs 77.3 | 3.00 vs 1.00 | 12.93 vs 5.00 | 71.2 vs 154.5 |
| `simpleIdentificationToysSet22AL` | `simpleIdentificationVegetablesSet2AL` | 24.3 vs 42.9 | 92.4 vs 87.4 | 0.35 vs 1.22 | 1.81 vs 3.96 | 44.9 vs 53.4 |
| `writeLevelSimpleLine2AL` | `writeLevel1To52AL` | 20.0 vs 5.3 | 0.0 vs 0.0 | 0.00 vs 0.00 | 0.00 vs 0.00 | 26.0 vs 51.3 |
| `missingBRandomAAndB50To99AL` | `stackingDifferentPairsOfSameValue202AL` | 29.4 vs 47.4 | 76.0 vs 79.1 | 2.40 vs 5.75 | 5.75 vs 8.26 | 59.9 vs 71.9 |
| `stackColorTilesSet1And22AL` | `sortRedGreenYellowWhiteBlackGray2AL` | 19.6 vs 9.4 | 85.6 vs 85.0 | 1.06 vs 1.67 | 3.52 vs 3.26 | 54.7 vs 43.7 |

\* `matrixMultiplicationRandomNumbers3AL` has no strict twin; `givenSmartChartScale6AL` is used as closest available same-family comparator (icmV2 numberTile→numberTile, SA10).

#### Readout

- `stackMultiStickInMultiSlot1To52AL` underperforms its true twin strongly on drop (39.7% vs 13.6%) and time (162s vs 47s), confirming overload in the 3-slot part-whole layout.
- `mergeNumberUpTo9WithBAsTwoAL` and `numbersFrom500To999AL` are same-template merge-and-place levels; the lower-range level still drops more, so friction is not only number size.
- `orderUpToSevenNumber2AL` shows low dropper WM (1.09) compared to its twin's high dropper WM (18.00), reinforcing passive disengagement rather than comprehension failure.
- `matrixMultiplicationRandomNumbers3AL` remains uniquely severe: done WM/user is 46.08 versus 5.60 for comparator, despite similar family.
- `writeLevelSimpleLine2AL` vs `writeLevel1To52AL` confirms tracking limits (success/WM both zero), so drop rate is the only reliable differentiator.

---

## 🎯 Recommendations Summary

### Immediate Actions (High Impact)

1. **Fix DOB/age-profiling** — Two Tier 1 levels (matrixMultiplicationRandomNumbers3AL, fractionMultiplication6AL) are primarily impacted by young children receiving SkillAge 10 content.

2. **Target merge-mechanic friction in `mergeNumberUpTo9WithBAsTwoAL`** — This level uses the same merge-and-place flow as `numbersFrom500To999AL` (tile overlap to create a sum, then slot placement), but with a lower-number scaffold. Prioritize merge onboarding, merge-specific hints, and stronger merge feedback before general difficulty tuning.

3. **Fix passive disengagement in `orderUpToSevenNumber2AL`** — The level is **5 boards, not 20**. Dropper WM of 1.09 (≈0.22 per board) and drop time of 72s ≈ full level duration confirm users are letting the timer expire without placing tiles. This is a **mechanic engagement** problem, NOT a length or comprehension problem. Add an idle-prompt animation and do not add tutorials.

4. **Reduce per-board overload in `stackMultiStickInMultiSlot1To52AL`** — Already only 5 boards. Keep the 3-slot part-whole construct (x, a, b where a+b=x), but prefill one slot on early boards and increase board time to 35–40s.

### Medium-Term Actions

5. **UX testing for write/trace** — Investigate why writeLevelSimpleLine2AL has a 20% drop
6. **Monitor post-DOB fix** — Several levels may improve without content changes

### Lower Priority

7. **Monitor Tier 3** — stackColorTilesSet1And22AL is performing adequately; revisit if drop rate increases

---

## � Section D: Twin-Comparison Inferences — Why Each Problematic Level Underperforms

Each pair shares the same core mechanic family. Differences in drop rate, WM, success rate, and completion time isolate the specific failure mode for each problematic level.

---

### D1. `mergeNumberUpTo9WithBAsTwoAL` vs `numbersFrom500To999AL`
**Metrics:** Drop 51.0% vs 46.7% | Done success 88.3% vs 81.3% | Drop WM/user 11.92 vs 19.07 | Done WM/user 7.37 vs 10.20 | Done time 103s vs 90.5s

These are **identical-template** merge-and-place levels (same `mergeable: "self"` config, same panel structure). The SA5 level uses small numbers (sum 3–9, b always =2); the SA8 level uses 3-digit numbers (500–999).

**Inferences:**
- The SA5 level drops more (51% vs 46.7%) despite involving simpler arithmetic, which rules out number difficulty as the cause. The merge-tile mechanic itself is the source of friction.
- Dropper WM is lower for SA5 (11.92 vs 19.07): SA5 users are giving up earlier and with less effort. SA8 users who drop are genuinely wrestling with the mechanic — they try more before quitting.
- Done WM and time are both higher for SA8 (10.20 WM, 90.5s) but completers still succeed at 81.3%, so the SA8 version rewards persistence — harder numbers do not break the mechanic.
- **Root cause:** SA5 users encounter the merge-and-place mechanic with less prior game experience. The tile-overlap interaction required for merging is non-intuitive without exposure history. SA8 users have played more levels and arrive with more game fluency, so they tolerate the same confusing mechanic longer. The fix is merge-specific onboarding, not number range reduction.

---

### D2. `orderUpToSevenNumber2AL` vs `descendingOrdering1to999by50AL`
**Metrics:** Drop 41.6% vs 33.3% | Done success 85.0% vs 86.1% | Drop WM/user 1.09 vs 18.00 | Done WM/user 5.70 vs 4.67 | Done time 47.9s vs 79.8s

**Inferences:**
- The two levels exhibit entirely opposite failure modes: SA5 ascending ordering is **passive disengagement**; SA8 descending ordering is **active frustration dropout**.
- Drop WM of 1.09 for SA5 means droppers placed fewer than 2 tiles total before leaving — they are not confused by the number order, they simply did not engage with the task.
- Drop WM of 18.00 for SA8 means droppers tried extensively (3.6 WM/board on a 5-board level) before quitting — these users understood the mechanic and were beaten by the difficulty.
- Done time is shorter for SA5 completers (47.9s vs 79.8s), consistent with easier numbers completing quickly.
- **Root cause for SA5:** The visual presentation of 1–7 ascending ordering does not compel action. The numbers are small enough that the correct order is immediately obvious, removing the cognitive challenge that normally drives engagement. Users see the task as trivial or repetitive and exit without completing it. The fix is an idle-prompt (e.g., animation highlighting the first slot) rather than any content change — the problem is visibility of required action, not comprehension.

---

### D3. `stackMultiStickInMultiSlot1To52AL` vs `stackMultiStick1To52AL`
**Metrics:** Drop 39.7% vs 13.6% | Done success 88.6% vs 83.8% | Drop WM/user 2.84 vs 3.29 | Done WM/user 7.50 vs 4.94 | Done time 162.1s vs 47.1s

**Inferences:**
- The drop rate gap (26 percentage points) is the largest absolute gap in the 9 pairs. The mechanic is counting sticks into slots — identical visual logic — but the multi-slot version requires filling x, a, and b simultaneously where a+b=x.
- Done time of 162s vs 47s (3.4× longer) is the most diagnostic signal: even users who succeed are cognitively strained for nearly 3 minutes. The single-slot variant takes 47s for completers.
- Drop WM is similar (2.84 vs 3.29), meaning droppers from both versions disengage at roughly the same frustration level. The difference is not that multi-slot causes more wrong moves — it causes users to reach a decision point faster where they abandon the level entirely.
- Done WM is higher for multi-slot (7.50 vs 4.94), confirming that completing the 3-slot task requires more correction attempts even for skilled users.
- **Root cause:** The 3-slot part-whole constraint (x = a+b, all slots present simultaneously) exceeds the working memory capacity of the SA4 target population. Users must track 3 interdependent values and count physical stick objects for each. The visual layout is not providing enough scaffolding to offload the coordination cost. The single-slot version presents one unknown at a time, which is well within reach.

---

### D4. `matrixMultiplicationRandomNumbers3AL` vs `givenSmartChartScale6AL`*
**Metrics:** Drop 38.5% vs 44.4% | Done success 54.4% vs 86.5% | Drop WM/user 11.00 vs 6.75 | Done WM/user 46.08 vs 5.60 | Done time 143.9s vs 78.9s

*Not a strict twin — closest same-family SA10 comparator only.*

**Inferences:**
- Unusually, the problematic level drops LESS than its comparator (38.5% vs 44.4%). The problem here is not drop rate — it is completion quality.
- Done WM/user of 46.08 is the single most extreme value in the entire dataset. Completers need 46 wrong moves on average to finish the level. The comparator's completers need 5.60. This alone marks matrix multiplication as a broken experience for its population.
- Done success of 54.4% means nearly half of all level-completion attempts end in failure, vs 86.5% for the comparator.
- Done time of 143.9s (vs 78.9s) reflects the extended trial-and-error required to force a correct answer through repeated attempts.
- **Root cause:** Matrix multiplication in a drag-and-drop grid creates compounding confusion — users must track which cell they are targeting, compute the product of row × column, locate the correct tile, and drag it accurately. Each of these steps can fail independently, and errors in grid targeting compound with errors in multiplication. This is almost certainly an **age-profiling problem**: SA10 content is reaching young children who lack both the arithmetic skill and the spatial grid-reading ability. The level is not salvageable through content changes without fixing the DOB-based routing upstream.

---

### D5. `fractionMultiplication6AL` vs `multiplication3TableAL`
**Metrics:** Drop 24.5% vs 50.0% | Done success 71.6% vs 77.3% | Drop WM/user 3.00 vs 1.00 | Done WM/user 12.93 vs 5.00 | Done time 71.2s vs 154.5s

**Inferences:**
- Counter-intuitive: the "problematic" level has a lower drop rate than its twin (24.5% vs 50.0%). The twin drops at 50% — the higher drop here reflects a mechanic engagement issue specific to that level.
- fractionMultiplication is labeled problematic due to its absolute done WM/user of 12.93, combined with its SA10 classification — it is expected to be hard, but the completion error rate signals the task is beyond current user skill.
- The multiplication3Table twin's 50% drop rate with only 1.00 WM/dropper is a textbook passive-disengagement pattern: users see multiplication tiles at SA8, do almost nothing, and exit. This likely reflects young users who are not ready for multiplication being routed to SA8 content.
- fractionMultiplication droppers make 3.00 WM before quitting — they try more than multiplication droppers — but done users need 12.93 WM, indicating the fraction arithmetic step genuinely requires more attempts to get right.
- **Root cause for fractionMultiplication:** The fraction representation in the drag tile is not intuitive enough — users understand they are multiplying but cannot reliably identify which fraction tile corresponds to the required product. The 12.93 done WM/user reflects tile mis-selection rather than arithmetic ignorance. The same SA10 DOB-profiling caveat applies; fixing age routing will reduce the population encountering this level without readiness.

---

### D6. `simpleIdentificationToysSet22AL` vs `simpleIdentificationVegetablesSet2AL`
**Metrics:** Drop 24.3% vs 42.9% | Done success 92.4% vs 87.4% | Drop WM/user 0.35 vs 1.22 | Done WM/user 1.81 vs 3.96 | Done time 44.9s vs 53.4s

**Inferences:**
- The twin (vegetables) drops significantly more (42.9% vs 24.3%), and both have extremely low WM. Neither level is causing comprehension failure — both are object-image-to-slot recognition tasks with near-zero wrong moves.
- Drop WM of 0.35 for toys means droppers place fewer than half a tile on average — they open the level and leave almost immediately. This is pure early-exit, not frustration.
- The toys level's lower drop (24.3%) relative to its twin is likely a **sequence position effect**: the toy level appears after the user has already seen vegetable-style identification, providing implicit mechanic familiarity. Users who reach the toy level have demonstrated willingness to engage with this format.
- The vegetables level's higher drop (42.9%) despite being structurally identical suggests the vegetable imagery is less immediately recognizable or motivating for the specific user demographic. Visual category mismatch (unfamiliar vegetables) can cause an early-exit decision before any interaction begins.
- **Root cause for toys:** The 24.3% drop is likely irreducible churn — a portion of users will always exit a second repetition of the same mechanic type regardless of content. Done success of 92.4% confirms the level works correctly for users who engage. No content fix is needed; this is sequence-saturation behavior.

---

### D7. `writeLevelSimpleLine2AL` vs `writeLevel1To52AL`
**Metrics:** Drop 20.0% vs 5.3% | Done success 0.0% vs 0.0% (untracked) | Drop WM/user 0 vs 0 (untracked) | Done WM/user 0 vs 0 (untracked) | Done time 26.0s vs 51.3s

**Inferences:**
- Both levels have zero tracked success/WM due to a known tracking limitation in write/trace levels (not instrumented for wrong-move counting). Drop rate is the only available comparative signal.
- Drop rate gap is 14.7 percentage points (20.0% vs 5.3%) — this is the most reliable signal available.
- Drop time of 26.0s for line-trace vs 51.3s for digit-trace reveals that line-trace droppers quit in roughly half the time. Users who abandon digit-tracing have at least spent 51s engaging with recognizable shapes.
- **Root cause:** Tracing numerals (1–5) gives users a clear recognizable goal — the shape has a name and a visual prototype that the user knows from everyday experience. The "correct" trace feels obvious when it matches the number. Abstract straight or curved lines do not provide this anchor: the user cannot tell whether their trace was correct or incorrect, making the experience feel unrewarding and arbitrary. The faster abandonment (26s) confirms that users decide early that the task has no clear feedback loop. The fix is adding visible trace-completion confirmation (e.g., color fill, sound cue, checkmark) that is currently absent or insufficiently prominent.

---

### D8. `missingBRandomAAndB50To99AL` vs `stackingDifferentPairsOfSameValue202AL`
**Metrics:** Drop 29.4% vs 47.4% | Done success 76.0% vs 79.1% | Drop WM/user 2.40 vs 5.75 | Done WM/user 5.75 vs 8.26 | Done time 59.9s vs 71.9s

**Inferences:**
- The twin (stacking SA6) drops markedly more (47.4% vs 29.4%) and with higher drop WM (5.75 vs 2.40), indicating genuine frustration-driven dropout rather than passive disengagement.
- missingBRandomAAndB50To99AL is in the problematic list due to its absolute 29.4% drop rate (above the 20% threshold), but relatively it is the better-performing level of the pair.
- The stacking level's higher drop WM (5.75) means droppers made on average nearly 6 wrong moves before quitting — they understand the mechanic is fill-the-slot but cannot find the right tile for the pairing constraint (both a and b must sum to x, and both must equal a specific pair value). This is a cognitive search failure, not a UI confusion.
- missingBRandomAAndB50To99AL's lower drop WM (2.40) with still-elevated drop rate (29.4%) signals a mixed population: some users quit quickly (early-exit) and some quit after limited wrong-move exploration. Done success of 76% is lower than stacking's 79.1%, suggesting the missing-b arithmetic discovery is somewhat harder for completers.
- **Root cause for missingB:** Users need to identify an unknown b by reasoning backward from a known sum (a+b=x, find b). For 50–99 range with random seeds, there is no shortcut — the user must either compute or trial-and-error. The 29.4% drop reflects a portion of users who recognize the problem requires mental arithmetic and exit rather than attempt it. The fix is a visual scaffold (e.g., number line or counting aid) to offload the computation step.

---

### D9. `stackColorTilesSet1And22AL` vs `sortRedGreenYellowWhiteBlackGray2AL`
**Metrics:** Drop 19.6% vs 9.4% | Done success 85.6% vs 85.0% | Drop WM/user 1.06 vs 1.67 | Done WM/user 3.52 vs 3.26 | Done time 54.7s vs 43.7s

**Inferences:**
- The drop rate is 2× higher for the stack-color level (19.6% vs 9.4%), yet all other metrics (done success, WM, time) are nearly identical. The problem is purely in the drop-entry decision, not in execution quality.
- Drop WM of 1.06 vs 1.67 — both levels have early-exit droppers who barely interact. This is not frustration.
- Done success (85.6% vs 85.0%) and done WM (3.52 vs 3.26) are effectively the same, meaning users who engage with either level perform identically.
- **Root cause:** The stackColor level appears later in the SA2 color-sort sequence than sortColor. Users who have already completed a color-sort level earlier in their journey are more likely to perceive the stackColor level as a repeat, reducing motivation to engage for a second pass through the same concept. The 10-point drop gap (19.6% vs 9.4%) is consistent with cumulative mechanic saturation rather than any content defect. This level is lower priority — success quality is intact, and the drop behavior is characteristic of repeat-type disengagement that content changes cannot easily address.

---

## �📋 Related Documents

- [First-Level Onboarding Analysis](first-level-onboarding-analysis.md) — Detailed breakdown of why first levels have 46.2% average drop rate
- [Assessment Drop Analysis Table](assessment-drop-analysis-table.md) — Original analysis (includes first levels; use for reference only)
