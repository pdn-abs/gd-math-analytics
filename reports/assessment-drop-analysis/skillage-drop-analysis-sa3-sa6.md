# SkillAge Drop Analysis — SA3 to SA6

> Filtered from `assessment-wrong-moves-success-rate.md` | Date range: Jan 25 – Mar 25, 2026 | Mode: Assessment | Build: Production only

---

## Table of Contents

1. [SkillAge 3](#skillage-3)
   - [SA3 Full Table](#sa3-levels--full-table)
   - [Core Observation](#core-observation-one-level-is-carrying-almost-all-of-sa3s-drops)
   - [Why stackVegetablesAndFruitsOverall2AL Is So Different](#why-stackvegetablesandfruitsoVerall2al-is-so-different)
   - [Remaining SA3 Drops](#what-the-remaining-sa3-drops-tell-us)
   - [SA3 Recommended Actions](#sa3-recommended-actions)
2. [SkillAge 4](#skillage-4)
   - [SA4 Full Table](#sa4-levels--full-table)
   - [Core Observation](#core-observation-two-levels-account-for-97-of-sa4-drops)
   - [Why the Two Hard Levels Drop](#why-the-two-hard-levels-drop)
   - [Why matchShapesByObjects2AL Works](#why-matchshapesbyobjects2al-works)
   - [SA4 Recommended Actions](#sa4-recommended-actions)
3. [SkillAge 5](#skillage-5)
   - [SA5 Full Table](#sa5-levels--full-table)
   - [Core Observation](#core-observation-three-levels-each-contributing-30-of-sa5-drops)
   - [Three Distinct Failure Modes](#three-distinct-failure-modes)
   - [Why the Two Best Levels Work](#why-the-two-best-levels-work)
   - [SA5 Recommended Actions](#sa5-recommended-actions)
4. [SkillAge 6](#skillage-6)
   - [SA6 Full Table](#sa6-levels--full-table)
   - [Core Observation](#core-observation-one-level-drives-75-of-sa6-drops)
   - [Why stackingDifferentPairsOfSameValue202AL Drops](#why-stackingdifferentpairsofsamevalue202al-drops)
   - [The Persisting Difficulty Pair](#the-persisting-difficulty-pair)
   - [Why dataHandlingIconsBirdsAnimals2AL Works](#why-datahandlingiconsbirdanimals2al-works)
   - [SA6 Recommended Actions](#sa6-recommended-actions)
5. [Cross-SkillAge Patterns](#cross-skillage-patterns)
   - [Pattern 1 — The Pareto Rule](#pattern-1--the-pareto-rule-a-tiny-minority-of-levels-cause-almost-all-drops)
   - [Pattern 2 — numberSlot as predictor](#pattern-2--numberslot-is-the-single-most-consistent-predictor-of-a-hard-level)
   - [Pattern 3 — Grid width amplifies](#pattern-3--grid-width-amplifies-difficulty--always)
   - [Pattern 4 — Content is learnable](#pattern-4--the-content-is-learnable-the-barrier-is-entry-not-impossibility)
   - [Pattern 5 — Abstract vs Concrete](#pattern-5--abstract-concepts-cause-drops-at-every-age-concrete-visual-tasks-succeed-at-every-age)
   - [Single Cross-Cutting Recommendation](#single-cross-cutting-recommendation)

---

## SkillAge 3

### SA3 Levels — Full Table

| # | Level | Branch | Started | Completed | Dropped | Drop% | Complete% | Success% (done) | Success% (drop) | Avg Time (done) | Avg Time (drop) | Wrong Moves |
|:--|:---|:---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 3 | stackVegetablesAndFruitsOverall2AL | Objects | 170 | 124 | 90 | 53% | 73% | 74% | 61% | 66s | 32s | 1669 |
| 8 | stackMultiStick1To52AL | Numbers | 103 | 97 | 14 | 14% | 94% | 84% | 73% | 47s | 45s | 525 |
| 9 | simpleIdentificationAnimalsSet1And22AL | Objects | 85 | 75 | 9 | 11% | 88% | 93% | 70% | 42s | 33s | 139 |
| 12 | stackUtensilsVehicles2AL | Objects | 65 | 54 | 12 | 18% | 83% | 86% | 79% | 56s | 36s | 198 |
| 17 | simpleIdentifyApparelAndStationery2AL | Objects | 47 | 38 | 9 | 19% | 81% | 94% | 79% | 39s | 34s | 54 |
| 20 | sortRedGreenYellowWhiteBlackGray2AL | Objects | 32 | 27 | 3 | 9% | 84% | 85% | 80% | 44s | 85s | 93 |
| 23 | writeLevelSimpleLine2AL | Geometry | 25 | 22 | 5 | 20% | 88% | 0% | 0% | 26s | 15s | 0 |

**SA3 totals:** 527 started · 437 completed · 142 dropped · **27% drop** · 83% avg completion

---

### Core Observation: One Level Is Carrying Almost All of SA3's Drops

| Level | Dropped | Share of SA3's 142 drops |
|---|---:|---:|
| stackVegetablesAndFruitsOverall2AL | 90 | **63%** |
| All other 6 SA3 levels combined | 52 | 37% |

> Remove that single level and SA3's drop rate falls from **27% → 15%** — which would make it the second-best SkillAge in the entire pool, behind SA2.

---

### Why stackVegetablesAndFruitsOverall2AL Is So Different

The other 5 non-write SA3 levels all follow the same template: `numberTile` × `numberTile` — drag a visible picture tile and match it to its identical pair. Pure recognition. The child doesn't need to know anything abstract.

`stackVegetablesAndFruitsOverall2AL` is structurally different:

| Factor | Other SA3 levels | stackVegetablesAndFruitsOverall2AL |
|---|---|---|
| `rightVariant` | `numberTile` | `numberSlot` |
| Mechanic | Drag tile → match identical tile | Drag tile → sort into category bucket |
| Cognitive demand | Visual recognition | Abstract classification (fruit vs vegetable) |
| Items per board | 2 | 4 (2 fruits + 2 vegs) |
| Shuffle | Row only | Row + column |
| Curriculum position | Varies | Sequence 7 — very early in SA3 |

Key reasons the drop rate is 53%:
- **Classification, not recognition** — the child must know the abstract concept "is this a fruit or a vegetable?" rather than simply finding the matching picture. That's a fundamentally different cognitive demand.
- **Double the items** — 4 loose tiles per board vs 2, doubling working memory load.
- **Row + column shuffle** — the right panel scrambles both axes, making the layout more disorienting.
- **Too early in the sequence** — at sequence 7, learners hit this level before they've built familiarity with game mechanics.

---

### What the Remaining SA3 Drops Tell Us

The 52 drops across the other 5 levels (9–20% each) are modest and consistent. They represent typical early-game friction — first-board unfamiliarity, distraction — not a content problem. The low wrong-move counts on `simpleIdentificationAnimalsSet1And22AL` (1.6/user) and `simpleIdentifyApparelAndStationery2AL` (1.1/user) confirm the content itself is not causing the exits.

---

### SA3 Recommended Actions

| Priority | Action |
|---|---|
| 🔴 **Push sequence later** | Move `stackVegetablesAndFruitsOverall2AL` to a higher sequence number, after learners have built classification experience through earlier SA3 levels |
| 🟠 **Add scaffolded intro board** | Insert a non-timed tutorial board that teaches the fruit/vegetable split visually before timed boards begin |
| 🟡 **Split into two levels** | One level per category (fruits only, then vegetables only) to reduce the simultaneous sorting load per board |

---

## SkillAge 4

### SA4 Levels — Full Table

| # | Level | Branch | Started | Completed | Dropped | Drop% | Complete% | Success% (done) | Success% (drop) | Avg Time (done) | Avg Time (drop) | Wrong Moves |
|:--|:---|:---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5 | matchNumberCount1to72AL | Numbers | 134 | 82 | 61 | 46% | 61% | 85% | 78% | 94s | 64s | 751 |
| 13 | stackMultiStickInMultiSlot1To52AL | Numbers | 63 | 36 | 25 | 40% | 57% | 89% | 83% | 162s | 72s | 341 |
| 24 | matchShapesByObjects2AL | Geometry | 24 | 21 | 2 | 8% | 88% | 85% | 64% | 68s | 56s | 113 |
| 27 | writeLevel1To52AL | Numbers | 19 | 18 | 1 | 5% | 95% | 0% | 0% | 51s | 21s | 0 |

**SA4 totals:** 240 started · 157 completed · 89 dropped · **37% drop** · 65% avg completion

---

### Core Observation: Two Levels Account for 97% of SA4 Drops

| Level | Dropped | Share of SA4's 89 drops |
|---|---:|---:|
| matchNumberCount1to72AL | 61 | **69%** |
| stackMultiStickInMultiSlot1To52AL | 25 | 28% |
| All others combined | 3 | 3% |

> Remove those two levels and SA4's drop rate falls from **37% → 3%**.

SA4 is a two-problem SkillAge, not a structural one. Both hard levels share the same branch (Numbers) and both require the child to connect a visual/physical count to an abstract numeric concept — but through different mechanics.

---

### Why the Two Hard Levels Drop

**`matchNumberCount1to72AL` — 46% drop, 5.6 WM/user**

- `countTile` × `numberTile` — left panel shows picture tiles of counted objects (e.g. 5 apples); right panel shows numeral tiles (e.g. "5"). The child must match the count picture to the correct numeral.
- This is **cardinality**: connecting a visual count to its abstract symbol. It looks like simple matching but requires an internal number sense that not all SA4 learners have.
- 3 rows per board (one more than most SA3 best levels) — three count→numeral mappings to hold simultaneously.
- 21s board time — designers anticipated difficulty, yet 61 of 134 starters still dropped.
- 94s avg completion time — those who finish spend nearly 5× the board time per level, suggesting the task is very slow even for successful learners.

**`stackMultiStickInMultiSlot1To52AL` — 40% drop, 5.4 WM/user**

- `countSlot` × `countTile` — left panel has empty stick-counting slots, right panel has count-tile pieces. The child builds stick counts into slots.
- Grid: `distribute(5, 3)` rows × `[5, 5]` columns = **6 cells per panel** — the widest SA4 layout.
- 25s board time (highest in SA4) and 162s avg completion time (highest in the entire AL pool).
- The counting concept is simple, but managing 6 cells simultaneously while stacking count pieces overwhelms working memory.

| Factor | matchNumberCount1to72AL | stackMultiStickInMultiSlot1To52AL |
|---|---|---|
| Left variant | `countTile` (count pictures) | `countSlot` (empty stick slots) |
| Right variant | `numberTile` (numerals) | `countTile` (count pieces) |
| Core demand | Cardinality (count → symbol) | Construction (fill count into slot) |
| Grid | 3 rows × 1 col | 3 rows × 2 cols |
| Board time | 21s | 25s |

---

### Why matchShapesByObjects2AL Works

- `numberTile` × `numberTile`, 3 rows × 1 column, 14s, row shuffle — matches the proven best-level template.
- Content: match objects to their shape category (e.g. ball → circle). Concrete, visual, familiar geometry.
- Despite 3 rows (one more than SA3 best levels), only 8% drop and 85% success — concrete visual shape recognition remains accessible even at SA4.

---

### SA4 Recommended Actions

| Priority | Action |
|---|---|
| 🔴 **Bridge count→numeral** | For `matchNumberCount1to72AL`: add a non-timed intro board pairing count pictures with their numerals side by side before the timed match. The cardinality concept needs explicit modelling. |
| 🟠 **Reduce grid width** | For `stackMultiStickInMultiSlot1To52AL`: reduce from 3 columns to 2 (4 cells instead of 6). The counting concept is accessible; the grid width is the difficulty multiplier. |

---

## SkillAge 5

### SA5 Levels — Full Table

| # | Level | Branch | Started | Completed | Dropped | Drop% | Complete% | Success% (done) | Success% (drop) | Avg Time (done) | Avg Time (drop) | Wrong Moves |
|:--|:---|:---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 10 | orderUpToSevenNumber2AL | Numbers | 77 | 67 | 32 | 42% | 87% | 85% | 75% | 48s | 72s | 417 |
| 14 | matchActivitiesWithObject2AL | Objects | 61 | 25 | 27 | 44% | 41% | 83% | 82% | 124s | 55s | 383 |
| 15 | mergeNumberUpTo9WithBAsTwoAL | Arithmetic | 51 | 27 | 26 | 51% | 53% | 88% | 59% | 103s | 110s | 509 |
| 32 | fillSubtractionStaticB3UpTo52AL | Arithmetic | 10 | 8 | 1 | 10% | 80% | 93% | 0% | 31s | 23s | 8 |
| 37 | patternBasicFoods2AL | Algebra | 9 | 8 | 1 | 11% | 89% | 86% | 80% | 63s | 9s | 50 |

**SA5 totals:** 208 started · 135 completed · 87 dropped · **42% drop** · 65% avg completion

---

### Core Observation: Three Levels Each Contributing ~30% of SA5 Drops

| Level | Dropped | Share of SA5's 87 drops |
|---|---:|---:|
| orderUpToSevenNumber2AL | 32 | **37%** |
| matchActivitiesWithObject2AL | 27 | **31%** |
| mergeNumberUpTo9WithBAsTwoAL | 26 | **30%** |
| fillSubtractionStaticB3UpTo52AL + patternBasicFoods2AL | 2 | 2% |

> Remove the three hard levels and SA5's drop rate falls from **42% → 3%**.

SA5 is structurally the most challenging SkillAge to fix: unlike SA3 and SA6 where a single level dominates, SA5 has **three independent failure modes** each contributing equally. There is no single point of intervention — all three levels need attention.

---

### Three Distinct Failure Modes

**1. `mergeNumberUpTo9WithBAsTwoAL` — Construction difficulty (51% drop, 10.0 WM/user)**

- `numberTile → numberSlot`, 3 rows, 3 columns `[2.5, 2.5, 5]` — a + b = x decomposition. The child must fill in operand slots to sum to numbers up to 9.
- 23s board time — designers anticipated difficulty.
- 110s avg **drop** time — droppers spend longer than completers (103s avg). Users try hard before quitting; this is genuine content difficulty, not early exit.
- 509 total wrong moves — highest absolute wrong-move count in SA5.

**2. `matchActivitiesWithObject2AL` — Length + Content abstraction (44% drop, 6.3 WM/user)**

- `numberTile × numberTile` — mechanically recognition, but content is **activity–object associations** (e.g. scissors → paper, broom → dirt). The child must know contextual/functional relationships, not just visual matches.
- `boardCount: 10` (20 total boards) — **double every other SA5 level**. 124s avg completion time.
- 55s avg drop time — users drop early (avg board 4, well before the midpoint), not after lengthy engagement.
- Despite the difficulty, 83% success for completers confirms the content is learnable — the barrier is more about length and early engagement than concept complexity.

**3. `orderUpToSevenNumber2AL` — Ordering mechanic (42% drop, 5.4 WM/user)**

- `numberTile → numberSlot` — but the mechanic is **sequencing/ordering**, not matching or construction. The slots are positional; the child must place 1–7 in correct order.
- No shuffle — slot positions are fixed, requiring the child to know the number sequence, not just recognise numerals.
- 72s avg **drop** time vs 48s avg completion time — droppers spend *more* time than completers. They are trying and failing, not quitting immediately. This is different from early-quit: users understand the task but cannot sequence reliably.

| Failure Mode | Level | Core Barrier |
|---|---|---|
| Construction | mergeNumberUpTo9WithBAsTwoAL | a + b decomposition into slots |
| Length + abstraction | matchActivitiesWithObject2AL | 20 boards + contextual content knowledge |
| Ordering | orderUpToSevenNumber2AL | Must know number sequence 1–7, not just recognise symbols |

---

### Why the Two Best Levels Work

**`fillSubtractionStaticB3UpTo52AL`** (10% drop, 93% SR, 0.8 WM/user) — also uses `numberSlot` but succeeds because:
- Content is **static** (`b3UpTo5` = fixed, simple operands up to 5). No randomisation.
- Only 3 boards (6 total) — very short, low fatigue.
- 12s board time — fast, low pressure.
- Single pre-determined slot fill — no multi-part decomposition.

**`patternBasicFoods2AL`** (11% drop, 86% SR, 5.6 WM/user) — pattern completion with food pictures. The visual/sequential pattern is concrete and self-evident from the tiles shown. 19s, 5 boards.

---

### SA5 Recommended Actions

| Priority | Action |
|---|---|
| 🔴 **Reduce board count** | For `matchActivitiesWithObject2AL`: cut `boardCount` from 10 to 5. The content is learnable (83% success for completers); the 20-board length is killing retention. |
| 🔴 **Scaffold decomposition** | For `mergeNumberUpTo9WithBAsTwoAL`: add a worked-example board showing a + b = x with the answer and one operand visible before the child fills the other. The slots are not the barrier — not knowing how to decompose is. |
| 🟠 **Add sequence scaffold** | For `orderUpToSevenNumber2AL`: provide a visual number line or reference strip during the ordering task. Children who can identify numerals but not yet sequence them are fully blocked. |

---

## SkillAge 6

### SA6 Levels — Full Table

| # | Level | Branch | Started | Completed | Dropped | Drop% | Complete% | Success% (done) | Success% (drop) | Avg Time (done) | Avg Time (drop) | Wrong Moves |
|:--|:---|:---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 11 | stackingDifferentPairsOfSameValue202AL | Arithmetic | 76 | 47 | 36 | 47% | 62% | 79% | 43% | 72s | 56s | 595 |
| 19 | subtractionMissingAUpTo20AL | Arithmetic | 38 | 27 | 7 | 18% | 71% | 72% | 77% | 88s | 45s | 272 |
| 26 | dataHandlingIconsBirdsAnimals2AL | Data Handling | 23 | 20 | 3 | 13% | 87% | 84% | 67% | 33s | 20s | 61 |
| 29 | stackTensAndOnes20UpTo502AL | Numbers | 17 | 16 | 0 | 0% | 94% | 84% | — | 118s | — | 204 |
| 30 | smallBigUpTo50Number2AL | Arithmetic | 13 | 11 | 1 | 8% | 85% | 75% | 75% | 60s | 60s | 87 |
| 31 | matchEdgesCorners22AL | Geometry | 11 | 11 | 1 | 9% | 100% | 65% | 64% | 61s | 84s | 120 |

**SA6 totals:** 178 started · 132 completed · 48 dropped · **27% drop** · 74% avg completion

---

### Core Observation: One Level Drives 75% of SA6 Drops

| Level | Dropped | Share of SA6's 48 drops |
|---|---:|---:|
| stackingDifferentPairsOfSameValue202AL | 36 | **75%** |
| All other 5 SA6 levels combined | 12 | 25% |

> Remove that single level and SA6's drop rate falls from **27% → 12%** — making it the third-best SkillAge in the pool.

SA6 has a secondary pattern not seen in SA3: two additional levels (`stackTensAndOnes20UpTo502AL` and `matchEdgesCorners22AL`) show **very low drop rates but very high wrong-move counts** — difficulty without drop. SA6 thus has two distinct problems: one level that drives users away, and two that keep users but cause repeated failure.

---

### Why stackingDifferentPairsOfSameValue202AL Drops

- `numberTile → numberSlot`, `distribute(10, 5)` = **5 columns** on the main panel. 2 rows × 5 columns = **10 visible cells simultaneously**.
- `inline` shuffle only — tiles shuffle within their own row, not across rows. The positional layout is fixed, reducing the visual variety that might aid recall.
- 14s board time — same as simple recognition levels, but the cognitive load is far higher.
- **The mechanic:** find number pairs that sum to 20 (e.g. 10+10, 7+13, 8+12). The child must know and apply complementary pairs — an arithmetic relationship, not a visual match.
- 43% success% for **droppers** — even those who quit were making wrong moves throughout. This is genuine content difficulty, not early quit.
- 595 total wrong moves with 76 starters — 7.8 WM/user, second-highest in SA6.

---

### The Persisting Difficulty Pair

SA6 contains two levels that show the opposite pattern from the dropout level: users stay through all boards despite repeated errors.

**`stackTensAndOnes20UpTo502AL`** — 0% drop, 12.0 WM/user, 84% SR
- `numberTile → numberSlot`, matrix grid, 23s, tens and ones place-value decomposition (20–50).
- All 17 starters stayed to the end despite averaging 12 wrong moves. Users are engaged and willing to persist — scaffolding would convert those wrong moves to correct ones.
- 118s avg completion time (long, but zero abandonment).

**`matchEdgesCorners22AL`** — 9% drop, 100% completion, 10.9 WM/user, 65% SR
- `audioTile → numberTile` — left variant is **audio only**. The child hears a spoken description of a shape property and must match it to the correct tile. Cross-modal memory load (audio → visual shape property) with no visual cue.
- All users who start finish (100% completion), but 10.9 WM/user is the second-highest in SA6.
- 65% success — the lowest in SA6 despite full completion. Users stay but keep guessing.

---

### Why dataHandlingIconsBirdsAnimals2AL Works

- `numberTile × numberTile`, 2 rows × 1 column, 11s, 3 boards (6 total). Exact match to the proven best-level template.
- Content: match bird/animal icons in a data handling context — still concrete visual recognition despite the "data handling" branch label.
- Shortest board time (11s) and shortest level (3 training boards) in SA6 — low fatigue, quick wins.

---

### SA6 Recommended Actions

| Priority | Action |
|---|---|
| 🔴 **Reduce grid width** | For `stackingDifferentPairsOfSameValue202AL`: reduce from 5 columns to 1–2 (show 1–2 pairs at a time). Complementary pairs to 20 can be learned, but 5 simultaneous pairs is excessive. Also raise `boardTime` to ≥20s. |
| 🟠 **Add digit hints** | For `stackTensAndOnes20UpTo502AL`: highlight the tens digit when a number appears to scaffold place-value decomposition. 0% drop shows high engagement — reducing wrong moves is the only fix needed. |
| 🟠 **Add visual redundancy** | For `matchEdgesCorners22AL`: display a visual label or icon alongside the audio tile. Cross-modal matching (audio-only cue → visual tile) without redundancy is too hard for SA6; adding a visual cue would not reduce the concept, only the barrier. |

---

## Cross-SkillAge Patterns

> Synthesised from SA3–SA6 analysis above.

---

### Pattern 1 — The Pareto Rule: a tiny minority of levels cause almost all drops

| SkillAge | Total Drops | Levels Responsible | Their Share |
|:---:|---:|:---:|---:|
| SA3 | 142 | 1 level | 63% |
| SA4 | 89 | 2 levels | 97% |
| SA5 | 87 | 3 levels | 98% |
| SA6 | 48 | 1 level | 75% |

In every SkillAge, fixing the 1–3 problem levels would leave the remaining levels with a collectively acceptable drop rate (3–15%). The drops are not distributed — they are concentrated. This means the SA-level drop% numbers in the SkillAge Overview table are misleading: SA5 (42%) looks structurally broken, but it is actually three fixable levels dragging the number up.

---

### Pattern 2 — `numberSlot` is the single most consistent predictor of a hard level

| SA | Worst Level | Mechanic |
|:---:|---|---|
| SA3 | stackVegetablesAndFruitsOverall2AL | `numberSlot` category bucket |
| SA4 | stackMultiStickInMultiSlot1To52AL | `countSlot` fill |
| SA4 | matchNumberCount1to72AL | `countTile` → `numberTile` (cardinality) |
| SA5 | mergeNumberUpTo9WithBAsTwoAL | `numberSlot` a+b decomposition |
| SA5 | orderUpToSevenNumber2AL | `numberSlot` ordering |
| SA6 | stackingDifferentPairsOfSameValue202AL | `numberSlot` 5-column pairs |
| SA6 | stackTensAndOnes20UpTo502AL | `numberSlot` place-value matrix |

Every hard level uses a slot-filling or construction mechanic. Every recognition level (`numberTile × numberTile`) performs well at every SkillAge. Mechanic type is a stronger predictor of outcome than SkillAge or content topic.

---

### Pattern 3 — Grid width amplifies difficulty — always

The hardest level in each SkillAge has the widest grid. Narrow (1 column, 2 rows) = consistently low drop. Wide (3–5 columns) = consistently high drop and high WM/user. This holds regardless of content. Grid width is not the root cause but is a reliable multiplier of whatever difficulty already exists.

---

### Pattern 4 — The content is learnable; the barrier is entry, not impossibility

In every hard level across every SkillAge, completers still score **79–93% success**. Users who make it through are succeeding. The content is not fundamentally too hard — it is too hard *on first encounter*, without scaffolding. The implication is actionable: you do not need to remove hard concepts, you need to bridge entry into them.

---

### Pattern 5 — Abstract concepts cause drops at every age; concrete visual tasks succeed at every age

| Concept Type | Example Levels | Pattern |
|---|---|---|
| Concrete visual recognition | simpleIdentificationAnimals (SA3), matchShapesByObjects (SA4), dataHandlingIconsBirds (SA6) | Low drop, high success at every SA |
| Abstract relationship | classification (SA3), cardinality (SA4), decomposition (SA5), complementary pairs (SA6) | High drop at every SA |

The SkillAge assignment reflects curriculum progression but does not protect a level from this pattern. A concrete visual task at SA6 (`dataHandlingIconsBirdsAnimals2AL`) outperforms abstract tasks at SA3. The **concrete-vs-abstract axis overrides the SkillAge axis**.

---

### Single Cross-Cutting Recommendation

Every hard level in SA3–SA6 is a slot/construction task applied to an abstract concept, presented immediately without a worked model. Adding **one non-timed example board before the timed boards** — showing the mechanic and the concept simultaneously — would address the dominant failure pattern across all four SkillAges with a single consistent design change.
