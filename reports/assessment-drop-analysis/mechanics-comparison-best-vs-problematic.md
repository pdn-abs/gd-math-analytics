# Mechanics Comparison: Best Performing vs Problematic Levels

**Purpose:** Identify mechanical and design patterns that differentiate high-performing levels from struggling ones.

---

## Summary: Key Mechanical Differences

| Factor | Best Performing | Problematic | Impact |
|--------|---|---|---|
| **Primary Interaction** | **Recognition** (match, categorize, identify) — 7/10 use tile-to-tile matching | **Construction** (fill slots, build answers, decompose) — 6/9 require slot-filling or decomposition | Recognition tasks let users pick from visible options; construction requires working memory |
| **Complexity per Board** | **2–3 items** to sort/match per board side | **3–5+ simultaneous operations** (merge, part-whole slots, grid cells, equations) | Complexity directly correlates with wrong moves/user |
| **Visual Concreteness** | **All concrete** — animals, objects, shapes, sticks, colors, fractions (visual) | **Mixed** — 5/9 are abstract (numbers, operators, equations); only 4 are concrete | Abstract requires mental manipulation; concrete supports visual verification |
| **Board Time Allocation** | **11–20s per board** for recognition tasks | **14–36s per board** even for harder levels; extra time doesn't fix conceptual difficulty | Designers anticipated difficulty but extra time reveals rather than solves the problem |
| **Number of Boards** | **5 boards** (standard); 103 users complete `stackMultiStick1To52AL` | **5–10 boards** with extended times — `mergeNumberUpTo9WithBAsTwoAL` 4×23s, `fractionMultiplication6AL` 6×27s | Longer sessions amplify fatigue without improving learning |
| **Cognitive Load Pattern** | **Single operation per turn**: drag animal → name, or stick group → number | **Multiple simultaneous operations**: merge TWO tiles → place SUM in one of THREE slots satisfying x=a+b | Simultaneous multi-step tasks stress working memory |
| **Success Rate (Completers)** | **87–94%** — high mastery even among finishers | **54–88%** — wide range; lowest (54% for matrix) indicates true difficulty, not just drop | >75% success is healthy; <75% = content struggles to teach |
| **Wrong Moves per User** | **0.8–5.1** — all low (excellent clarity) | **5.4–25.5** — extreme range; highest (25.5 for matrix) is 31× the best level | Wrong moves reflect how hard users struggle before quitting/finishing |

---

## Detailed Mechanics Breakdown

### BEST PERFORMING LEVELS (10 levels)

| # | Level | SA | Interaction Mode | Boards | WM/User | Success% | Mechanic Description |
|---|-------|:--:|---|:---:|:--:|:--:|---|
| 1 | simpleIdentificationAnimalsSet1And22AL | 3 | Match: drag left → right pair | 5×14s | 1.6 | 92% | **Pure recognition.** 4 animal tiles (2 per side), shuffle order. Drag left→right match. No computation. |
| 2 | fillSubtractionStaticB3UpTo52AL | 5 | Drag tile → slot | 3×12s | **0.8** | 93% | **Minimal slots.** Subtraction `a−3=x` with 1–2 blanks (tens/ones columns). Only 3 boards. |
| 3 | simpleIdentifyApparelAndStationery2AL | 3 | Match: drag left → right pair | 5×14s | 1.1 | **94%** | **Pure recognition.** 4 school-supply tiles, visual matching only. |
| 4 | matchFractionWithImage4AL | 9 | Match: drag left → right pair | 5×20s | 4.2 | 87% | **Visual matching.** Fraction notation ↔ visual fraction image. No arithmetic. |
| 5 | matchObjectSetFirst2AL | 2 | Match: drag left → right pair | 5×15s | 1.0 | 93% | **Pure recognition.** 4 everyday objects. No reasoning needed. |
| 6 | sortRedGreenYellowWhiteBlackGray2AL | 3 | Drag tile → slot | 5×14s | 2.9 | 85% | **Simple categorization.** 4 colored tiles → 2 color-category slots. Clear visual rule. |
| 7 | dataHandlingIconsBirdsAnimals2AL | 6 | Match: drag left → right pair | 3×11s | 2.7 | 84% | **Category matching.** 2 objects (animal, bird) → 2 category labels. Compact 3-board structure. |
| 8 | matchShapesByObjects2AL | 4 | Match: drag left → right pair | 5×14s | 4.7 | 84% | **Shape matching.** 6 tiles (3 labels ↔ 3 objects). Geometric reasoning but visually clear. |
| 9 | stackMultiStick1To52AL | 3 | Place count → slot | 5×11s | 5.1 | 83% | **Visual counting.** Count sticks on screen → drag into labeled slot (1–5). No arithmetic. |
| 10 | cowBananaTable4AL | 7 | Match: drag left → right pair | 5×18s | 2.1 | 88% | **Visual table reading.** Cow groups ↔ banana totals from a picture table. Concrete visual reference. |

**Common patterns:**
- ✅ 7 of 10 use **tile-to-tile matching** (recognition)
- ✅ 4 of 10 are **SA 2–3** (early, simpler content)
- ✅ All use **simple labeling** (color, category, name, count)
- ✅ **Max 5 items per board** to process
- ✅ **Board time: 11–20s** — quick, focused tasks
- ✅ **Wrong moves <5.1** — low struggle
- ✅ **Success >83%** — high mastery

---

### PROBLEMATIC LEVELS from Revised Analysis (9 levels)

| # | Level | Priority | SA | Interaction Mode | Boards | WM/User | Success% | Mechanic Description | Root Cause |
|---|-------|:---:|:--:|---|:---:|:--:|:--:|---|---|
| 1 | mergeNumberUpTo9WithBAsTwoAL | 1A | 5 | Merge tile → slot (unique) | 4×23s | **10.0** | 88% | **Tile overlap + multi-slot placement.** Left: 2 columns × 3 rows (numberTile + 2-tile only). Player drags numberTile onto 2-tile, creating sum tile. Then drags sum into slot showing silhouette target. Requires 3 simultaneous cognitive steps: identify valid pair, merge mentally, place result. | Unique merge mechanic not well-scaffolded; 51% drop despite high completion success |
| 2 | orderUpToSevenNumber2AL | 1B | 5 | Drag tile → slot | 5×14s | 5.4 | 85% | **Sequence ordering.** 4–6 shuffled number tiles (1–7) → drag into labeled position slots in ascending order. Pure ordering, no arithmetic, but 42% drop with only 1.09 WM. Users understand but quit passively. | Early-quit pattern; low engagement despite clear content (not comprehension) |
| 3 | stackMultiStickInMultiSlot1To52AL | 1C | 4 | Place count → slot | 5×25s | 5.4 | 89% | **Part-whole simultaneous fill.** 3 labeled slots per board: total `x`, part `a`, part `b` where a+b=x. All 3 slots filled from visual stick groups. Cognitive load: hold 3 relationships simultaneously, count sticks 3 times, place each correctly. | Per-board overload, not board count; 40% drop + 162s avg completion (32s/board vs 25s allotted) |
| 4 | matrixMultiplicationRandomNumbers3AL | 1D | 10 | Match: drag left → right pair | 5×36s | **25.5** | 54% | **4×4 multiplication matrix grid.** Headers [6,7,8,9] in rows/columns. 4 random blank cells. Must mentally multiply each row×column pair and place product tile. No shuffle = full grid visible = highest complexity layout in pool. | Content too hard for even completers (54% success); likely age misclassification (young child given SA 10) |
| 5 | fractionMultiplication6AL | 2A | 10 | Drag tile → slot | 6×27s | 8.7 | 72% | **Fraction arithmetic fill-in.** 2 equations `a × b = __` (mixed fractions, denom 4) per board. 6 boards × 27s each. Requires both fraction understanding AND multiplication, then correct tile placement. | Concept difficulty + age misclassification; 424 total WM across 49 users |
| 6 | simpleIdentificationToysSet22AL | 2B | 2 | Match: drag left → right pair | 5×11s | 3.5 | 91% | **Pure recognition.** 4 toy tiles (2 per side), drag left→right match. Mechanically identical to best-performing SA2 levels. | NOT a content problem; 24% drop despite 91% success = pure early quit / UX friction |
| 7 | writeLevelSimpleLine2AL | 2C | 3 | Trace dotted path | 5×14s | — | 0% | **Finger/stylus tracing.** Player traces dotted-line characters. No GA4 tracking of success/WM. 20% drop indicates UI/interface issues or low engagement with draw mechanic. | Write/trace mechanics poorly tracked; interface friction likely |
| 8 | missingBRandomAAndB50To99AL | 2D | 7 | Drag tile → slot | 5×14s | 6.1 | 76% | **Addition equation fill-in with larger range.** 2 equations `a+__=x` or `a+b=__` (sum 50–99, tens/ones columns). Higher number range adds cognitive load vs lower SkillAges. 29% drop despite 76% success. | Moderate difficulty + larger number range; possible instruction clarity issue |
| 9 | stackColorTilesSet1And22AL | 3A | 2 | Drag tile → slot | 5×18s | 3.0 | 86% | **Simple color categorization.** 4 colored tiles → 2 color slots. Mechanically identical to best-performing `sortRedGreenYellowWhiteBlackGray2AL` but with 20% drop vs 9%. | Early-quit pattern; structural UX issue affecting multiple SA2 levels, not content difficulty |

---

## Side-by-Side Mechanical Comparison

### Pattern 1: Recognition (Tile-to-Tile Matching) — BEST Pattern

**Best Examples:**
- `simpleIdentificationAnimalsSet1And22AL` (SA 3, WM 1.6, Success 92%)
- `matchObjectSetFirst2AL` (SA 2, WM 1.0, Success 93%)
- `matchFractionWithImage4AL` (SA 9, WM 4.2, Success 87%)

**Problematic Counterpart:**
- `matrixMultiplicationRandomNumbers3AL` (SA 10, WM 25.5, Success 54%) — Also tile-to-tile matching BUT in a complex 4×4 matrix grid

**Why the difference?**
- Best: 2–4 tiles per side, clear one-to-one pairing, visual distinctness
- Problematic: 16 cells in a matrix, no shuffle, requires arithmetic to find blanks, multiple possible answers

**Insight:** Recognition works when pairing is **explicit and unambiguous**. Matrix grids fail because they require users to first compute which cells are blank, then mentally calculate the product, then find the matching tile.

---

### Pattern 2: Construction via Slots — Mixed Results

**Best Example:**
- `fillSubtractionStaticB3UpTo52AL` (SA 5, WM 0.8, Success 93%) — 3 boards, 2 blanks, simple subtraction

**Problematic Examples:**
- `mergeNumberUpTo9WithBAsTwoAL` (SA 5, WM 10.0, Success 88%) — 4 boards, merge first + place in slot
- `fractionMultiplication6AL` (SA 10, WM 8.7, Success 72%) — 6 boards, fraction multiplication
- `missingBRandomAAndB50To99AL` (SA 7, WM 6.1, Success 76%) — 5 boards, range 50–99

**Why the difference?**
- Best: Minimal slots (1–2 blanks), simple operation (subtraction only), only 3 boards
- Problematic: 2+ blanks, complex operations (merge + place, multiply fractions, larger range), 4–6 boards

**Insight:** Slot-filling works only when:
1. ≤2 blanks per equation (working memory limit)
2. The operation is single-step (not merge-then-place)
3. The number range is narrow (not 50–99 for SA7)
4. Board count is minimal (≤3 boards reduces fatigue)

---

### Pattern 3: Concrete vs Abstract Concepts

**Concrete (Best):**
- `stackMultiStick1To52AL` — Visual sticks, count them, place in slot. User can verify correctness by seeing if the stick group matches the slot label. ✅ 83% success
- `cowBananaTable4AL` — Cow groups + banana picture table. Visual reference always available. ✅ 88% success
- `sortRedGreenYellowWhiteBlackGray2AL` — Colors are self-verifying. Red tile into red slot is visually obvious. ✅ 85% success

**Abstract (Problematic):**
- `matrixMultiplicationRandomNumbers3AL` — User must mentally multiply 6×7, 6×8, etc. No visual support. Only arithmetic knowledge matters. ❌ 54% success
- `fractionMultiplication6AL` — Fractions are conceptually hard. Multiplying fractions is even harder. No visual reference in the answer. ❌ 72% success
- `mergeNumberUpTo9WithBAsTwoAL` — User must understand that dragging 5 onto 2 creates 7, then place 7 where silhouette shows 7. Abstraction at multiple levels. ❌ 51% drop despite 88% success

**Insight:** Best levels let users **verify answers visually**. Problematic levels require **mental calculation** where verification happens only after placement (or not at all).

---

### Pattern 4: Single vs Multiple Simultaneous Operations

**Single Operation (Best):**
- `simpleIdentificationAnimalsSet1And22AL` — Single action: "drag left animal to matching right animal" (1 rule)
- `stackMultiStick1To52AL` — Single action: "drag stick group to matching number slot" (1 rule)
- `sortRedGreenYellowWhiteBlackGray2AL` — Single action: "sort tiles by color" (1 rule)

**Multiple Simultaneous (Problematic):**
- `stackMultiStickInMultiSlot1To52AL` — 3 simultaneous rules: fill slot `x` (total), fill slot `a` (part), fill slot `b` (part where a+b=x). All 3 must be correct simultaneously.
- `mergeNumberUpTo9WithBAsTwoAL` — 2 sequential then 1 simultaneous: (1) identify number + 2-tile pair, (2) drag to merge, (3) place sum in correct slot
- `matrixMultiplicationRandomNumbers3AL` — Multiple operations: (1) identify blank cells, (2) compute product for each, (3) find matching tile, (4) place in correct cell

**Insight:** Cognitive load scales non-linearly. 3 simultaneous constraints are NOT 3× harder; they are 5–10× harder due to working memory limits.

---

### Pattern 5: Board Time Misalignment

| Level | Boards | Time/Board | WM/User | Issue |
|---|:---:|:---:|:---:|---|
| `fillSubtractionStaticB3UpTo52AL` | 3 | 12s | 0.8 | **Perfect:** Few boards, little time pressure, low struggle |
| `stackMultiStick1To52AL` | 5 | 11s | 5.1 | **Optimal:** Standard 5 boards, quick pace, visual task is clear |
| `mergeNumberUpTo9WithBAsTwoAL` | 4 | 23s | 10.0 | **Extended but insufficient:** Extra time doesn't help because the mechanic itself is complex, not just arithmetic |
| `fractionMultiplication6AL` | 6 | 27s | 8.7 | **Long session, hard concept:** 6 boards + 27s each = 162s total; users struggle throughout, not just time-pressure |
| `matrixMultiplicationRandomNumbers3AL` | 5 | 36s | 25.5 | **Longest time, highest struggle:** Designers gave 36s per board, but the grid complexity makes even 36s insufficient |

**Insight:** Extra board time signals designer anticipation of difficulty BUT doesn't solve the problem. It just extends the struggle.

---

## Design Principles Extracted

### ✅ BEST PERFORMING PATTERN

1. **Interaction type:** Recognition/matching (tile-to-tile)
2. **Cognitive ops:** Single rule per turn
3. **Items per board:** 2–4 per side
4. **Concept:** Concrete, visually verifiable
5. **Slots/Blanks:** 0–1 (no decomposition)
6. **Board count:** 5 (standard)
7. **Board time:** 11–18s
8. **Result:** WM <5.1, Success >83%, Drop <20%

### ❌ PROBLEMATIC PATTERN

1. **Interaction type:** Construction, decomposition, grid-based
2. **Cognitive ops:** 2+ simultaneous rules or multi-step sequences
3. **Items per board:** 5–16 (e.g. matrix) or 3 simultaneous constraints
4. **Concept:** Abstract, requires mental calculation
5. **Slots/Blanks:** 2–4 per board (requires building answer)
6. **Board count:** 4–10
7. **Board time:** 14–36s (extended but ineffective)
8. **Result:** WM 5.4–25.5, Success 54–88%, Drop 24–51%

---

## Key Insights

### Insight 1: Mechanics Ceiling
The **tile-to-tile matching mechanic has a natural ceiling** at SA 9–10 when used for abstract concepts (fractions, matrices). At lower SkillAges (2–7), the same mechanic excels with concrete content.

- `matchFractionWithImage4AL` (SA 9, matching fractions) works at 87% success only because fractions have **visual representations**.
- `matrixMultiplicationRandomNumbers3AL` (SA 10, matching matrix products) fails at 54% success because **products have no visual reference**.

### Insight 2: The Simplicity Payoff
The **3 boards in `fillSubtractionStaticB3UpTo52AL` with 0.8 WM/user outperforms** 4–10 boards with 5.4–25.5 WM/user. Reducing board count by half doesn't just save time—it fundamentally changes the difficulty profile.

**Hypothesis:** Fewer boards = more focused practice per board = better learning of the single rule = fewer errors on each board.

### Insight 3: The Part-Whole Overload
`stackMultiStickInMultiSlot1To52AL` and `mergeNumberUpTo9WithBAsTwoAL` both have simultaneous multi-constraint layouts (3 slots for part-whole, merge + slot for sum). Despite 89% and 88% success for completers (high), both have **40–51% drop rates** because users quit when the constraint **loading becomes apparent on early boards**.

This is **not a comprehension problem** (completers succeed); it's an **expectation-setting problem**. Users see complexity and leave before trying.

### Insight 4: Early Quit vs Content Difficulty
- `simpleIdentificationToysSet22AL` (24% drop, 91% success) — **Early quit** (UX barrier, not content)
- `orderUpToSevenNumber2AL` (42% drop, 85% success) — **Early quit** (1.09 WM, users quit passively)
- `matrixMultiplicationRandomNumbers3AL` (38% drop, 54% success) — **Content difficulty** (25.5 WM, users struggle even when staying)

The distinction: **Low WM + high drop = UX issue. High WM + high drop = content issue.**

### Insight 5: Scaffold Before Complexity
`fillSubtractionStaticB3UpTo52AL` succeeds by starting simple (3 boards, minimal blanks). Then higher SkillAges use the same mechanic but ramp up (more boards, more blanks, larger ranges). The **scaffolding works forward** because users have mastered the basic pattern.

`mergeNumberUpTo9WithBAsTwoAL` **skips the scaffold** — it introduces the unique merge mechanic at full complexity (2 columns, 3 rows, merge + place) without a practice board or guided example first.

---

## Recommendations

| Problematic Level | Mechanical Issue | Solution |
|---|---|---|
| `mergeNumberUpTo9WithBAsTwoAL` | Unique mechanic, no scaffolding | Add 1–2 guided merge demo boards before open play |
| `stackMultiStickInMultiSlot1To52AL` | 3 simultaneous slots | Prefill one slot on early boards; increase board time to 35–40s |
| `matrixMultiplicationRandomNumbers3AL` | Abstract grid, no visual support | Reduce grid size (2×2), add visual number pairs on grid, or split into two 2-row levels |
| `fractionMultiplication6AL` | Complex concept, 6 boards | Reduce to 4 boards; add fraction visual bar; include worked example |
| `orderUpToSevenNumber2AL` | Early quit despite low WM | Fix intro screen; add first-board idle animation to trigger engagement |
| `writeLevelSimpleLine2AL` | Draw mechanic, no tracking | Add visual feedback on stroke completion; test interface responsiveness |
| `simpleIdentificationToysSet22AL` | Mechanically identical to best but drops more | Audit shared intro/first-board UX across all SA2 levels |
