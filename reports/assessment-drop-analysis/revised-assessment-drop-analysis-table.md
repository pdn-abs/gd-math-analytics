# Assessment Drop Analysis: Revised Action Plan (Non-First Levels)

> **Last Updated:** April 27, 2026
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
1. **Reduce difficulty ramp** — Add 2–3 easier starter boards before complexity increases
2. **Add adaptive hints** — When a user makes >4 wrong moves on a single board, show a scaffolded hint
3. **Reduce wrong-move frustration** — Add positive reinforcement for near-correct answers, not only for correct ones
4. **Consider splitting** — Break into shorter sub-levels to reduce accumulated frustration before dropout

---

### Priority 1B: `orderUpToSevenNumber2AL` (SkillAge 5)

| Metric | Value |
|--------|-------|
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
- Likely cause: 20-board length feels overwhelming; users disengage rather than struggle
- ⚠️ **Previous classification as "Comprehension Barrier" was incorrect** — based on blended 5.41 WM/user that mixed completer and dropper data

**Action:**
1. **Shorten the level** — Reduce from 20 boards to 10; this is the most direct fix for passive disengagement
2. **Add mid-level motivation** — Insert a reward/milestone at the halfway point to encourage completion
3. **Review engagement of the ordering mechanic** — Consider adding visual variation or challenge escalation
4. **Do NOT add more instructions** — Dropper WM data confirms users understand the content; adding tutorials would have no impact

---

### Priority 1C: `stackMultiStickInMultiSlot1To52AL` (SkillAge 4)

| Metric | Value |
|--------|-------|
| **Users Started** | 63 |
| **Drop Rate** | 39.7% |
| **Success (Completers)** | 89% |
| **Success (Droppers)** | 83% |
| **Drop WM/User** | **2.84** |
| **Done WM/User** | 7.50 |
| **Avg Time (Done/Drop)** | 162s / 72s |

**Root Cause: Grind/Complexity (Confirmed by Moderate Drop WM)**
- **162-second completion time** is nearly *triple* the level average
- Droppers make **2.84 WM/user** — moderate engagement; they try the content but quit when the level feels endless
- Droppers understand the mechanic well (83% success, 72s drop time) but abandon due to length fatigue
- Completers work through it (7.50 WM) but it takes over 2.5 minutes

**Action:**
1. **Reduce boards per level** — Drop from 10 to 6–7 boards
2. **Simplify the stacking rules** — Fewer constraints or clearer visual feedback
3. **Streamline animations** — Faster stick placement to reduce perceived grind

---

### Priority 1D: `matrixMultiplicationRandomNumbers3AL` (SkillAge 10)

| Metric | Value |
|--------|-------|
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

2. **Reduce difficulty ramp for `mergeNumberUpTo9WithBAsTwoAL`** — Droppers make *more* wrong moves than completers (11.92 vs 7.37); this is a frustration pattern. Add easier starter boards and adaptive hints — not just better instructions.

3. **Shorten `orderUpToSevenNumber2AL` from 20 to 10 boards** — Dropper WM of 1.09 confirms users understand the content but passively disengage. This is a length/motivation problem, NOT a comprehension problem. Do not add tutorials.

4. **Reduce grind** — stackMultiStickInMultiSlot1To52AL needs **fewer boards** and **simpler mechanics**, not content difficulty reduction.

### Medium-Term Actions

4. **Split long levels** — orderUpToSevenNumber2AL should be split into two 10-board levels
5. **UX testing for write/trace** — Investigate why writeLevelSimpleLine2AL has a 20% drop
6. **Monitor post-DOB fix** — Several levels may improve without content changes

### Lower Priority

7. **Monitor Tier 3** — stackColorTilesSet1And22AL is performing adequately; revisit if drop rate increases

---

## 📋 Related Documents

- [First-Level Onboarding Analysis](first-level-onboarding-analysis.md) — Detailed breakdown of why first levels have 46.2% average drop rate
- [Assessment Drop Analysis Table](assessment-drop-analysis-table.md) — Original analysis (includes first levels; use for reference only)
