# Assessment Drop Analysis: Revised Action Plan (Non-First Levels)

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
| **Mechanic** | Merge-and-place (unique among equation-style levels): 4 boards × 23s. Left side shows 2 columns × 3 rows of movable tiles: one column has number tiles (1–7 windowed by board), the other has only 2-tiles. Player drags a number tile over a 2-tile to merge and create a sum tile, then drags that sum tile into slot(s) with silhouette targets of the required sum number. Most other equation-style levels in this report are standard drag-and-fill blanks, not merge-based. |
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

## 🎯 Recommendations Summary

### Immediate Actions (High Impact)

1. **Fix DOB/age-profiling** — Two Tier 1 levels (matrixMultiplicationRandomNumbers3AL, fractionMultiplication6AL) are primarily impacted by young children receiving SkillAge 10 content.

2. **Target merge-mechanic friction in `mergeNumberUpTo9WithBAsTwoAL`** — This level uses a unique merge-and-place flow (tile overlap to create a sum, then slot placement). Prioritize merge onboarding, merge-specific hints, and stronger merge feedback before general difficulty tuning.

3. **Fix passive disengagement in `orderUpToSevenNumber2AL`** — The level is **5 boards, not 20**. Dropper WM of 1.09 (≈0.22 per board) and drop time of 72s ≈ full level duration confirm users are letting the timer expire without placing tiles. This is a **mechanic engagement** problem, NOT a length or comprehension problem. Add an idle-prompt animation and do not add tutorials.

4. **Reduce per-board overload in `stackMultiStickInMultiSlot1To52AL`** — Already only 5 boards. Keep the 3-slot part-whole construct (x, a, b where a+b=x), but prefill one slot on early boards and increase board time to 35–40s.

### Medium-Term Actions

5. **UX testing for write/trace** — Investigate why writeLevelSimpleLine2AL has a 20% drop
6. **Monitor post-DOB fix** — Several levels may improve without content changes

### Lower Priority

7. **Monitor Tier 3** — stackColorTilesSet1And22AL is performing adequately; revisit if drop rate increases

---

## 📋 Related Documents

- [First-Level Onboarding Analysis](first-level-onboarding-analysis.md) — Detailed breakdown of why first levels have 46.2% average drop rate
- [Assessment Drop Analysis Table](assessment-drop-analysis-table.md) — Original analysis (includes first levels; use for reference only)
