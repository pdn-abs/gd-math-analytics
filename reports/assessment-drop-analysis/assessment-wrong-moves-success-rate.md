# Assessment: Wrong Moves & Success Rate by Level

> **Source:** GA4 export `CSV/assessment_wrongMoves_successRate.csv`
> **Date range:** Jan 25 – Mar 25, 2026 | **Mode:** Assessment | **Build:** Production only

## Table of Contents

1. [Column Guide](#column-guide)
2. [Summary: Top 10 Lists](#summary-top-10-lists)
   - [Highest Drop Rate](#1-highest-drop-rate)
   - [Lowest Overall Success Rate](#2-lowest-overall-success-rate)
   - [Lowest Completion Rate](#3-lowest-completion-rate)
   - [Most Wrong Moves per User](#4-most-wrong-moves-per-user)
   - [High Wrong Moves + High Drop Rate (Combined)](#5-high-wrong-moves--high-drop-rate-combined)
   - [Low Wrong Moves but High Drop Rate (Early Quit)](#6-low-wrong-moves-but-high-drop-rate-early-quit)
   - [Hardest Levels by SkillAge](#7-hardest-levels-by-skillage)
   - [Best Performing Levels](#8-best-performing-levels-low-drop-high-success-low-wrong-moves)
3. [Key Signals](#key-signals)
4. [SkillAge Overview](#skillage-overview)
5. [Full Table — Assessment Levels Only](#full-table--assessment-levels-only-sorted-by-users-started)
6. [Overall Findings & Drop Reasons](#overall-findings--drop-reasons)
7. [Gameplay Analysis: What Makes Best Levels Best](#gameplay-analysis-what-makes-best-levels-best)

---

## Column Guide

| Column | Description |
|--------|-------------|
| **Started** | Unique users who started the level (segmentStarted) |
| **Completed** | Users who finished all boards (segmentCompleted) |
| **Dropped** | Users who quit mid-level (segmentDropped) |
| **Drop%** | Dropped / Started |
| **Complete%** | Completed / Started |
| **Success% (done)** | Correct move ratio for users who completed |
| **Success% (drop)** | Correct move ratio for users who dropped |
| **Avg Time (done)** | Average seconds spent by completers |
| **Avg Time (drop)** | Average seconds spent by droppers |
| **Wrong Moves** | Total wrong moves across all users |

---

## Full Table — Assessment Levels Only (sorted by users started)

| # | Level | SkillAge | Branch | Started | Completed | Dropped | Drop% | Complete% | Success% (done) | Success% (drop) | Avg Time (done) | Avg Time (drop) | Wrong Moves |
|:--|:---|:--|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| | **(Total)** | | | **2516** | **1831** | **809** | **32%** | **73%** | | | | | |
| 1 | simpleIdentificationVegetablesSet2AL | 2 | Objects | 448 | 332 | 192 | 43% | 74% | 87% | 81% | 53s | 37s | 1549 |
| 2 | simpleIdentificationToysSet22AL | 2 | Objects | 259 | 205 | 63 | 24% | 79% | 92% | 91% | 45s | 36s | 394 |
| 3 | stackVegetablesAndFruitsOverall2AL | 3 | Objects | 170 | 124 | 90 | 53% | 73% | 74% | 61% | 66s | 32s | 1669 |
| 4 | stackColorTilesSet1And22AL | 2 | Objects | 163 | 130 | 32 | 20% | 80% | 86% | 80% | 55s | 55s | 491 |
| 5 | matchNumberCount1to72AL | 4 | Numbers | 134 | 82 | 61 | 46% | 61% | 85% | 78% | 94s | 64s | 751 |
| 6 | matchObjectWithFraction1AL | 10 | Numbers | 118 | 72 | 49 | 42% | 61% | 83% | 73% | 60s | 28s | 667 |
| 7 | matchObjectSetFirst2AL | 2 | Objects | 111 | 82 | 16 | 14% | 74% | 94% | 88% | 45s | 23s | 116 |
| 8 | stackMultiStick1To52AL | 3 | Numbers | 103 | 97 | 14 | 14% | 94% | 84% | 73% | 47s | 45s | 525 |
| 9 | simpleIdentificationAnimalsSet1And22AL | 3 | Objects | 85 | 75 | 9 | 11% | 88% | 93% | 70% | 42s | 33s | 139 |
| 10 | orderUpToSevenNumber2AL | 5 | Numbers | 77 | 67 | 32 | 42% | 87% | 85% | 75% | 48s | 72s | 417 |
| 11 | stackingDifferentPairsOfSameValue202AL | 6 | Arithmetic | 76 | 47 | 36 | 47% | 62% | 79% | 43% | 72s | 56s | 595 |
| 12 | stackUtensilsVehicles2AL | 3 | Objects | 65 | 54 | 12 | 18% | 83% | 86% | 79% | 56s | 36s | 198 |
| 13 | stackMultiStickInMultiSlot1To52AL | 4 | Numbers | 63 | 36 | 25 | 40% | 57% | 89% | 83% | 162s | 72s | 341 |
| 14 | matchActivitiesWithObject2AL | 5 | Objects | 61 | 25 | 27 | 44% | 41% | 83% | 82% | 124s | 55s | 383 |
| 15 | mergeNumberUpTo9WithBAsTwoAL | 5 | Arithmetic | 51 | 27 | 26 | 51% | 53% | 88% | 59% | 103s | 110s | 509 |
| 16 | fractionMultiplication6AL | 10 | Numbers | 49 | 30 | 12 | 24% | 61% | 72% | 61% | 71s | 23s | 424 |
| 17 | simpleIdentifyApparelAndStationery2AL | 3 | Objects | 47 | 38 | 9 | 19% | 81% | 94% | 79% | 39s | 34s | 54 |
| 18 | smallBigFrom1To99NumbersAL | 7 | Numbers | 44 | 20 | 23 | 52% | 45% | 78% | 76% | 70s | 29s | 168 |
| 19 | subtractionMissingAUpTo20AL | 6 | Arithmetic | 38 | 27 | 7 | 18% | 71% | 72% | 77% | 88s | 45s | 272 |
| 20 | sortRedGreenYellowWhiteBlackGray2AL | 3 | Objects | 32 | 27 | 3 | 9% | 84% | 85% | 80% | 44s | 85s | 93 |
| 21 | numbersFrom500To999AL | 8 | Numbers | 30 | 5 | 14 | 47% | 17% | 81% | 40% | 90s | 71s | 318 |
| 22 | matrixMultiplicationRandomNumbers3AL | 10 | Arithmetic | 26 | 12 | 10 | 38% | 46% | 54% | 40% | 144s | 99s | 663 |
| 23 | writeLevelSimpleLine2AL | 3 | Geometry | 25 | 22 | 5 | 20% | 88% | 0% | 0% | 26s | 15s | 0 |
| 24 | matchShapesByObjects2AL | 4 | Geometry | 24 | 21 | 2 | 8% | 88% | 85% | 64% | 68s | 56s | 113 |
| 25 | summarizeTheSentences1AL | 9 | Data Handling | 24 | 13 | 10 | 42% | 54% | 75% | 47% | 56s | 32s | 137 |
| 26 | dataHandlingIconsBirdsAnimals2AL | 6 | Data Handling | 23 | 20 | 3 | 13% | 87% | 84% | 67% | 33s | 20s | 61 |
| 27 | writeLevel1To52AL | 4 | Numbers | 19 | 18 | 1 | 5% | 95% | 0% | 0% | 51s | 21s | 0 |
| 28 | missingBRandomAAndB50To99AL | 7 | Arithmetic | 17 | 16 | 5 | 29% | 94% | 76% | 67% | 60s | 30s | 104 |
| 29 | stackTensAndOnes20UpTo502AL | 6 | Numbers | 17 | 16 | 0 | 0% | 94% | 84% | - | 118s | - | 204 |
| 30 | smallBigUpTo50Number2AL | 6 | Arithmetic | 13 | 11 | 1 | 8% | 85% | 75% | 75% | 60s | 60s | 87 |
| 31 | matchEdgesCorners22AL | 6 | Geometry | 11 | 11 | 1 | 9% | 100% | 65% | 64% | 61s | 84s | 120 |
| 32 | fillSubtractionStaticB3UpTo52AL | 5 | Arithmetic | 10 | 8 | 1 | 10% | 80% | 93% | 0% | 31s | 23s | 8 |
| 33 | placeValueMatrix1AL | 9 | Numbers | 10 | 8 | 1 | 10% | 80% | 82% | 0% | 56s | 18s | 94 |
| 34 | reviseDivideTable8And9AL | 9 | Arithmetic | 9 | 8 | 2 | 22% | 89% | 83% | 44% | 92s | 48s | 77 |
| 35 | givenSmartChartScale6AL | 10 | Data Handling | 9 | 5 | 4 | 44% | 56% | 87% | 36% | 79s | 189s | 55 |
| 36 | groupAdditionOf5AL | 7 | Arithmetic | 9 | 8 | 1 | 11% | 89% | 70% | 100% | 87s | 19s | 91 |
| 37 | patternBasicFoods2AL | 5 | Algebra | 9 | 8 | 1 | 11% | 89% | 86% | 80% | 63s | 9s | 50 |
| 38 | cowBananaTable4AL | 7 | Arithmetic | 8 | 6 | 1 | 13% | 75% | 88% | 100% | 44s | 7s | 17 |
| 39 | numberDiceMatching2AL | 9 | Arithmetic | 8 | 6 | 1 | 13% | 75% | 83% | 100% | 41s | 15s | 24 |
| 40 | descendingOrdering1to999by50AL | 8 | Numbers | 6 | 3 | 2 | 33% | 50% | 86% | 5% | 80s | 65s | 50 |
| 41 | matchFractionWithImage4AL | 9 | Numbers | 5 | 5 | 1 | 20% | 100% | 87% | 100% | 63s | 19s | 21 |
| 42 | greaterSmallerUpTo999OperatorsAL | 8 | Numbers | 5 | 2 | 3 | 60% | 40% | 100% | 75% | 69s | 32s | 4 |
| 43 | multiplication3TableAL | 8 | Arithmetic | 2 | 1 | 1 | 50% | 50% | 77% | 89% | 155s | 33s | 6 |
| 44 | stackLivingAndNonLivingThingsAL | 5 | Objects | 2 | 0 | 0 | 0% | 0% | - | - | - | - | 0 |
| 45 | division4TableAL | 8 | Arithmetic | 1 | 1 | 0 | 0% | 100% | 80% | - | 97s | - | 5 |


## Key Signals

- `orderUpToNineAudio` — 800s avg drop time (13+ min), likely a bug
- `matchAudioNumber1To3` — 83% drop rate, highest among levels with ≥5 starters
- `matchTopBottomFirst` — 82% drop rate
- `mergeAndMatchTensAndOnesUpTo50` — 0 completions out of 7 starters
- `matrixMultiplicationRandomNumbers3AL` / `numbersFrom500To999AL` — ~40% success rate even for droppers (content too hard)
- `patternBasicFruits` — 79% drop rate with high success% (94%) for completers: high skill gap between who makes it and who does not

---

## SkillAge Overview

> Aggregated metrics across all AL levels within each SkillAge (≥5 starters, weighted by users started).

| SkillAge | Levels | Total Started | Total Dropped | Drop% | WM / User | Success% |
| -------: | -----: | ------------: | ------------: | ----: | --------: | -------: |
| 2 | 4 | 981 | 303 | 31% | 2.6 | 89% |
| 3 | 7 | 527 | 142 | 27% | 5.1 | 79% |
| 4 | 4 | 240 | 89 | 37% | 5.0 | 78% |
| 5 | 5 | 208 | 87 | 42% | 6.6 | 83% |
| 6 | 6 | 178 | 48 | 27% | 7.5 | 75% |
| 7 | 4 | 78 | 30 | 38% | 4.9 | 78% |
| 8 | 3 | 41 | 19 | 46% | 9.1 | 61% |
| 9 | 5 | 56 | 15 | 27% | 6.3 | 78% |
| 10 | 4 | 202 | 75 | 37% | 9.0 | 75% |

**Key reads:**

| Trend | Detail |
| ----- | ------ |
| Hardest by drop% | SA 8 (46%) — `numbersFrom500To999AL` drives this |
| Hardest by WM/user | SA 8 (9.1) and SA 10 (9.0) — high number complexity |
| Lowest success% | SA 8 (61%) — well below the 75–89% range of other ages |
| Highest volume | SA 2 (981 starters) with the best success (89%) and low WM (2.6) |
| SA 5 spike | 42% drop despite decent success (83%) — matches the early-quit pattern from Table 6 |

**Board progress at drop — by SkillAge:**

> Training = boards 1–5, Speedrun = boards 6–10 (normalised). `Avg drop board` = weighted average board index at drop across all droppers in the group. `% in Training` = share of droppers who quit before board 6.

| SkillAge | Levels | Droppers | Avg Drop Board | Phase | % in Training |
| -------: | -----: | -------: | -------------: | :---: | ------------: |
| 2 | 4 | 303 | 3.7 | Training | 100% |
| 3 | 7 | 142 | 3.9 | Training | 90% |
| 4 | 4 | 89 | 4.1 | Training | 100% |
| 5 | 5 | 87 | 4.4 | Training | 69% |
| 6 | 6 | 48 | 3.1 | Training | 100% |
| 7 | 4 | 30 | 2.8 | Training | 100% |
| 8 | 3 | 19 | 3.0 | Training | 100% |
| 9 | 5 | 15 | 2.2 | Training | 100% |
| 10 | 4 | 75 | 4.6 | Training | 35% |


---

## Summary: Top 10 Lists

> **Threshold:** Minimum 5 users started. All lists are **Assessment levels only** (level IDs ending in AL).

### 1. Highest Drop Rate

| # | Level | SkillAge | Started | Dropped | Drop% | Complete% |
|---|-------|:--------:|---------|---------|-------|----------|
| 1 | greaterSmallerUpTo999OperatorsAL | 8 | 5 | 3 | 60% | 40% |
| 2 | stackVegetablesAndFruitsOverall2AL | 3 | 170 | 90 | 53% | 73% |
| 3 | smallBigFrom1To99NumbersAL | 7 | 44 | 23 | 52% | 45% |
| 4 | mergeNumberUpTo9WithBAsTwoAL | 5 | 51 | 26 | 51% | 53% |
| 5 | stackingDifferentPairsOfSameValue202AL | 6 | 76 | 36 | 47% | 62% |
| 6 | numbersFrom500To999AL | 8 | 30 | 14 | 47% | 17% |
| 7 | matchNumberCount1to72AL | 4 | 134 | 61 | 46% | 61% |
| 8 | givenSmartChartScale6AL | 10 | 9 | 4 | 44% | 56% |
| 9 | matchActivitiesWithObject2AL | 5 | 61 | 27 | 44% | 41% |
| 10 | simpleIdentificationVegetablesSet2AL | 2 | 448 | 192 | 43% | 74% |

- `greaterSmallerUpTo999OperatorsAL` — 60% drop with only 5 starters; 0.8 wrong moves/user means users quit almost immediately, not because the content is hard.
- `stackVegetablesAndFruitsOverall2AL` — largest absolute dropout: 90 of 170 starters dropped (53%); 9.8 wrong/user confirms genuine difficulty.
- `numbersFrom500To999AL` — only 17% completion; combines high drop with low success rate — a priority candidate for content review.
- `mergeNumberUpTo9WithBAsTwoAL` — 51% drop with 10.0 wrong/user; users persist through difficulty before abandoning.

### 2. Lowest Overall Success Rate

> **Note:** Write levels (`writeLevelSimpleLine2AL`, `writeLevel1To52AL`) are excluded — their 0% reflects missing tracking, not actual performance.

| # | Level | SkillAge | Started | Success% | Drop% | Wrong Moves |
|---|-------|:--------:|---------|----------|-------|-------------|
| 1 | matrixMultiplicationRandomNumbers3AL | 10 | 26 | 53% | 38% | 663 |
| 2 | numbersFrom500To999AL | 8 | 30 | 56% | 47% | 318 |
| 3 | descendingOrdering1to999by50AL | 8 | 6 | 64% | 33% | 50 |
| 4 | matchEdgesCorners22AL | 6 | 11 | 65% | 9% | 120 |
| 5 | groupAdditionOf5AL | 7 | 9 | 71% | 11% | 91 |
| 6 | fractionMultiplication6AL | 10 | 49 | 71% | 24% | 424 |
| 7 | stackVegetablesAndFruitsOverall2AL | 3 | 170 | 72% | 53% | 1669 |
| 8 | subtractionMissingAUpTo20AL | 6 | 38 | 72% | 18% | 272 |
| 9 | summarizeTheSentences1AL | 9 | 24 | 73% | 42% | 137 |
| 10 | stackingDifferentPairsOfSameValue202AL | 6 | 76 | 73% | 47% | 595 |

- `matrixMultiplicationRandomNumbers3AL` — 53% success with 25.5 wrong/user; the hardest level in the AL assessment pool.
- `numbersFrom500To999AL` — 56% success with 47% drop; users both struggle and quit — a double-failure signal.
- `matchEdgesCorners22AL` — 65% success despite 100% completion (all who start, finish); completers still average 10.9 wrong moves.
- `fractionMultiplication6AL` — 71% success with 424 total wrong moves across 49 starters; third-largest wrong-move volume in the pool.

### 3. Lowest Completion Rate

| # | Level | SkillAge | Started | Completed | Complete% | Drop% | Success% |
|---|-------|:--------:|---------|-----------|-----------|-------|----------|
| 1 | numbersFrom500To999AL | 8 | 30 | 5 | 17% | 47% | 56% |
| 2 | greaterSmallerUpTo999OperatorsAL | 8 | 5 | 2 | 40% | 60% | 91% |
| 3 | matchActivitiesWithObject2AL | 5 | 61 | 25 | 41% | 44% | 83% |
| 4 | smallBigFrom1To99NumbersAL | 7 | 44 | 20 | 45% | 52% | 78% |
| 5 | matrixMultiplicationRandomNumbers3AL | 10 | 26 | 12 | 46% | 38% | 53% |
| 6 | descendingOrdering1to999by50AL | 8 | 6 | 3 | 50% | 33% | 64% |
| 7 | mergeNumberUpTo9WithBAsTwoAL | 5 | 51 | 27 | 53% | 51% | 79% |
| 8 | summarizeTheSentences1AL | 9 | 24 | 13 | 54% | 42% | 73% |
| 9 | givenSmartChartScale6AL | 10 | 9 | 5 | 56% | 44% | 78% |
| 10 | stackMultiStickInMultiSlot1To52AL | 4 | 63 | 36 | 57% | 40% | 88% |

- `numbersFrom500To999AL` — only 5 of 30 starters completed (17%); also lowest success — the weakest level in the AL pool on multiple axes.
- `greaterSmallerUpTo999OperatorsAL` — 2 of 5 completed (40%); too small a sample but consistent with its early-quit pattern.
- `matchActivitiesWithObject2AL` — 44% drop with only 41% completion; notable given its volume (61 starters).
- `matrixMultiplicationRandomNumbers3AL` — 46% completion with 25.5 wrong/user; the completers persist through repeated failure.

### 4. Most Wrong Moves per User

| # | Level | SkillAge | Started | Total Wrong Moves | Wrong Moves / User | Drop% | Success% |
|---|-------|:--------:|---------|-------------------|--------------------|-------|----------|
| 1 | matrixMultiplicationRandomNumbers3AL | 10 | 26 | 663 | 25.5 | 38% | 53% |
| 2 | stackTensAndOnes20UpTo502AL | 6 | 17 | 204 | 12.0 | 0% | 84% |
| 3 | matchEdgesCorners22AL | 6 | 11 | 120 | 10.9 | 9% | 65% |
| 4 | numbersFrom500To999AL | 8 | 30 | 318 | 10.6 | 47% | 56% |
| 5 | groupAdditionOf5AL | 7 | 9 | 91 | 10.1 | 11% | 71% |
| 6 | mergeNumberUpTo9WithBAsTwoAL | 5 | 51 | 509 | 10.0 | 51% | 79% |
| 7 | stackVegetablesAndFruitsOverall2AL | 3 | 170 | 1669 | 9.8 | 53% | 72% |
| 8 | placeValueMatrix1AL | 9 | 10 | 94 | 9.4 | 10% | 81% |
| 9 | fractionMultiplication6AL | 10 | 49 | 424 | 8.7 | 24% | 71% |
| 10 | reviseDivideTable8And9AL | 9 | 9 | 77 | 8.6 | 22% | 82% |

- `matrixMultiplicationRandomNumbers3AL` — 25.5 wrong/user, more than double the #2 level; a clear difficulty outlier.
- `stackTensAndOnes20UpTo502AL` — 12.0 wrong/user with 0% drop rate; users persist through all boards despite struggle — scaffolding may help.
- `matchEdgesCorners22AL` — 10.9 wrong/user with 100% completion; users finish but the wrong-move volume is high throughout.
- `mergeNumberUpTo9WithBAsTwoAL` — 10.0 wrong/user combined with 51% drop; difficulty is driving both frustration and abandonment.

### 5. High Wrong Moves + High Drop Rate (Combined)

> **Method:** Combined score = average of (wrong moves per user normalized 0–1) and drop rate. Surfaces levels that are both difficult *and* causing users to quit.

| # | Level | SkillAge | Started | Wrong Moves/User | Drop% | Success% | Score |
|---|-------|:--------:|---------|-----------------|-------|----------|-------|
| 1 | matrixMultiplicationRandomNumbers3AL | 10 | 26 | 25.5 | 38% | 53% | 0.69 |
| 2 | stackVegetablesAndFruitsOverall2AL | 3 | 170 | 9.8 | 53% | 72% | 0.46 |
| 3 | mergeNumberUpTo9WithBAsTwoAL | 5 | 51 | 10.0 | 51% | 79% | 0.45 |
| 4 | numbersFrom500To999AL | 8 | 30 | 10.6 | 47% | 56% | 0.44 |
| 5 | stackingDifferentPairsOfSameValue202AL | 6 | 76 | 7.8 | 47% | 73% | 0.39 |
| 6 | matchActivitiesWithObject2AL | 5 | 61 | 6.3 | 44% | 83% | 0.34 |
| 7 | givenSmartChartScale6AL | 10 | 9 | 6.1 | 44% | 78% | 0.34 |
| 8 | matchNumberCount1to72AL | 4 | 134 | 5.6 | 46% | 84% | 0.34 |
| 9 | smallBigFrom1To99NumbersAL | 7 | 44 | 3.8 | 52% | 78% | 0.34 |
| 10 | descendingOrdering1to999by50AL | 8 | 6 | 8.3 | 33% | 64% | 0.33 |

- `matrixMultiplicationRandomNumbers3AL` — leads on difficulty (25.5 wrong/user) with 38% drop; clear priority for content intervention.
- `stackVegetablesAndFruitsOverall2AL` — largest absolute user volume (170); high on both axes with 9.8 wrong/user and 53% drop.
- `numbersFrom500To999AL` — third-highest combined score; pairs high wrong-move density with near-50% drop and only 56% success.
- `mergeNumberUpTo9WithBAsTwoAL` — 51% drop plus 10.0 wrong/user — users fail repeatedly before giving up.

### 6. Low Wrong Moves but High Drop Rate (Early Quit)

> **Method:** Combined score = average of drop rate and (1 − normalized wrong-moves/user). Surfaces levels where users quit despite barely engaging — suggesting confusion, unclear instructions, or broken UX rather than difficulty. Min 3 droppers; write levels excluded.

| # | Level | SkillAge | Started | Dropped | Drop% | Wrong Moves/User | Success% |
|---|-------|:--------:|---------|---------|-------|-----------------|----------|
| 1 | greaterSmallerUpTo999OperatorsAL | 8 | 5 | 3 | 60% | 0.8 | 91% |
| 2 | smallBigFrom1To99NumbersAL | 7 | 44 | 23 | 52% | 3.8 | 78% |
| 3 | simpleIdentificationVegetablesSet2AL | 2 | 448 | 192 | 43% | 3.5 | 87% |
| 4 | matchNumberCount1to72AL | 4 | 134 | 61 | 46% | 5.6 | 84% |
| 5 | givenSmartChartScale6AL | 10 | 9 | 4 | 44% | 6.1 | 78% |
| 6 | orderUpToSevenNumber2AL | 5 | 77 | 32 | 42% | 5.4 | 85% |
| 7 | matchActivitiesWithObject2AL | 5 | 61 | 27 | 44% | 6.3 | 83% |
| 8 | matchObjectWithFraction1AL | 10 | 118 | 49 | 42% | 5.7 | 81% |
| 9 | summarizeTheSentences1AL | 9 | 24 | 10 | 42% | 5.7 | 73% |
| 10 | stackMultiStickInMultiSlot1To52AL | 4 | 63 | 25 | 40% | 5.4 | 88% |

- `greaterSmallerUpTo999OperatorsAL` — 0.8 wrong/user with 60% drop; users barely engage before quitting, pointing to immediate comprehension failure.
- `smallBigFrom1To99NumbersAL` — 3.8 wrong/user but 52% drop; 78% success among completers confirms the content is learnable — the barrier is elsewhere.
- `simpleIdentificationVegetablesSet2AL` — highest-volume level in the pool (448 starters) with 43% drop at only 3.5 wrong/user; a UX/presentation issue at scale.
- **Tight cluster at rows 4–10** — six levels share nearly identical profiles: 40–46% drop, 5.4–6.3 wrong/user, 81–88% success. The consistency across unrelated content types (fractions, matching, stacking, summarizing) points to a **shared structural cause** — likely the level intro/instruction screen or first-board UX — rather than six separate content problems.
- `matchActivitiesWithObject2AL` (row 7) — at 6.3 wrong/user it is the highest in this table and also appears in Table 5 (combined score 0.34). It sits on the boundary between early-quit and genuine difficulty; it warrants both a UX review and a difficulty pass.
- `summarizeTheSentences1AL` (row 9) — lowest success% in Table 6 at 73%, noticeably below the 78–91% range of the other entries. Some content difficulty is likely compounding the engagement issue.
- **Absolute impact priority** — `simpleIdentificationVegetablesSet2AL` (448 starters) and `matchNumberCount1to72AL` (134 starters) together account for **253 dropped users**. Fixing the early-quit cause on these two levels alone would have the largest absolute recovery in the AL pool.

### 7. Hardest Levels by SkillAge

> **Method:** Within each SkillAge group, levels are ranked by a combined difficulty score: 40% wrong moves per user (normalized), 40% low success rate, 20% drop rate. The top 2 hardest levels are shown per SkillAge (all qualifying levels with ≥5 starters are shown where fewer than 2 exist). Write/tracing levels are excluded — their success rate and wrong-moves metrics are not tracked.

| SkillAge | Level | Branch | Started | WM/User | Drop% | Success% | Diff Score |
| -------: | ----- | ------ | ------: | ------: | ----: | -------: | ---------: |
| 2 | `simpleIdentificationVegetablesSet2AL` | Objects | 448 | 3.5 | 43% | 87% | **0.19** |
| 2 | `stackColorTilesSet1And22AL` | Objects | 163 | 3.0 | 20% | 85% | **0.15** |
| 3 | `stackVegetablesAndFruitsOverall2AL` | Objects | 170 | 9.8 | 53% | 72% | **0.37** |
| 3 | `stackMultiStick1To52AL` | Numbers | 103 | 5.1 | 14% | 83% | **0.17** |
| 4 | `matchNumberCount1to72AL` | Numbers | 134 | 5.6 | 46% | 84% | **0.24** |
| 4 | `stackMultiStickInMultiSlot1To52AL` | Numbers | 63 | 5.4 | 40% | 88% | **0.21** |
| 5 | `mergeNumberUpTo9WithBAsTwoAL` | Arithmetic | 51 | 10.0 | 51% | 79% | **0.34** |
| 5 | `matchActivitiesWithObject2AL` | Objects | 61 | 6.3 | 44% | 83% | **0.26** |
| 6 | `matchEdgesCorners22AL` | Geometry | 11 | 10.9 | 9% | 65% | **0.33** |
| 6 | `stackingDifferentPairsOfSameValue202AL` | Arithmetic | 76 | 7.8 | 47% | 73% | **0.32** |
| 7 | `groupAdditionOf5AL` | Arithmetic | 9 | 10.1 | 11% | 71% | **0.30** |
| 7 | `missingBRandomAAndB50To99AL` | Arithmetic | 17 | 6.1 | 29% | 75% | **0.25** |
| 8 | `numbersFrom500To999AL` | Numbers | 30 | 10.6 | 47% | 56% | **0.44** |
| 8 | `descendingOrdering1to999by50AL` | Numbers | 6 | 8.3 | 33% | 64% | **0.34** |
| 9 | `summarizeTheSentences1AL` | Data Handling | 24 | 5.7 | 42% | 73% | **0.28** |
| 9 | `reviseDivideTable8And9AL` | Arithmetic | 9 | 8.6 | 22% | 82% | **0.25** |
| 10 | `matrixMultiplicationRandomNumbers3AL` | Arithmetic | 26 | 25.5 | 38% | 53% | **0.67** |
| 10 | `fractionMultiplication6AL` | Numbers | 49 | 8.7 | 24% | 71% | **0.30** |


### 8. Best Performing Levels (Low Drop, High Success, Low Wrong Moves)

> **Method:** Combined score (equal 25% weight each): low wrong moves/user (normalised), high success rate, low drop rate, high completion rate. Excludes write/tracing levels.

| # | Level | SkillAge | Branch | Started | WM/User | Drop% | Complete% | Success% | Score |
|---|-------|:--------:|--------|--------:|--------:|------:|----------:|---------:|------:|
| 1 | simpleIdentificationAnimalsSet1And22AL | 3 | Objects | 85 | 1.6 | 11% | 88% | 92% | 0.91 |
| 2 | fillSubtractionStaticB3UpTo52AL | 5 | Arithmetic | 10 | 0.8 | 10% | 80% | 93% | 0.90 |
| 3 | simpleIdentifyApparelAndStationery2AL | 3 | Objects | 47 | 1.1 | 19% | 81% | 94% | 0.88 |
| 4 | matchFractionWithImage4AL | 9 | Numbers | 5 | 4.2 | 20% | 100% | 87% | 0.88 |
| 5 | matchObjectSetFirst2AL | 2 | Objects | 111 | 1.0 | 14% | 74% | 93% | 0.87 |
| 6 | sortRedGreenYellowWhiteBlackGray2AL | 3 | Objects | 32 | 2.9 | 9% | 84% | 85% | 0.87 |
| 7 | dataHandlingIconsBirdsAnimals2AL | 6 | Data Handling | 23 | 2.7 | 13% | 87% | 84% | 0.87 |
| 8 | matchShapesByObjects2AL | 4 | Geometry | 24 | 4.7 | 8% | 88% | 84% | 0.86 |
| 9 | stackMultiStick1To52AL | 3 | Numbers | 103 | 5.1 | 14% | 94% | 83% | 0.86 |
| 10 | cowBananaTable4AL | 7 | Arithmetic | 8 | 2.1 | 13% | 75% | 88% | 0.85 |

---

## Gameplay Analysis: What Makes Best Levels Best

> Derived from config mechanics (`type`, `leftVariant`, `rightVariant`, `grid`, `boardTime`, `rowCount`, `shuffle`) for all Table 8 (best) and Table 7 / Table 5 (hardest) levels.

### Finding 1 — Recognition vs Construction (the dominant factor)

The single clearest mechanical split between best and hard levels is the **right panel variant**:

| Group | `rightVariant` | Interaction |
| ----- | -------------- | ----------- |
| **Best** (8 of 10) | `numberTile` | Drag a visible tile to match another tile — **recognition** |
| **Hard** (5 of 8) | `numberSlot` | Drag individual number digits into empty slots to form an answer — **construction** |

Recognition tasks (tile→tile) let the child pick from visible options. Construction tasks (tile→slot) require the child to hold the answer in working memory and decompose it into parts — a fundamentally harder cognitive operation. `numberSlot` levels (e.g. `numbersFrom500To999AL`, `mergeNumberUpTo9WithBAsTwoAL`, `stackingDifferentPairsOfSameValue202AL`) require the user to correctly fill `hundreds | tens | ones` columns, which demands both arithmetic knowledge and place-value understanding simultaneously.

**Note on `sortRedGreenYellowWhiteBlackGray2AL`:** Although the config lists `rightVariant: numberSlot`, inspection of the panel `goConfig` shows the slots are `isSupport: true` with `opacity: 0` — they are invisible category containers, not visible empty boxes the user fills. The actual interaction is drag picture tiles from the right into colour-category buckets on the left, which is the same recognition/categorisation mechanic as every other best-performing level. This level correctly belongs in the recognition group.

---

### Finding 2 — Concept concreteness vs Abstract computation

Best levels all involve **concrete, directly perceivable relationships**:
- Animals, objects, apparel, shapes, colours — the child can see the category and verify the answer visually without calculation.
- `stackMultiStick1To52AL`: count sticks on screen and match the number (`countSlot` + `countTile` variants) — visual counting, no mental arithmetic needed.
- `cowBananaTable4AL`: match object-to-quantity from a picture table — reading a visual table, not computing.

Hard levels require **abstract multi-step reasoning**:
- `numbersFrom500To999AL` / `mergeNumberUpTo9WithBAsTwoAL`: decompose a 3-digit number into `a + b = x` across 3 columns (cols=3, rowProps include `m,n,o,p,q,x,b,a`). The child must hold the full number, identify parts, and assemble slots.
- `matrixMultiplicationRandomNumbers3AL`: 4×4 multiplication matrix (numbers 6–9), no shuffled positions — the child must multiply each row×column pair and place result tiles without position hints.
- `matchEdgesCorners22AL`: uses `audioTile` as the left variant — the cue is **audio only**, not visual. The child must process a spoken instruction and match it to a shape-property tile, adding a cross-modal memory load.
- `groupAdditionOf5AL`: structurally similar to best levels (2-panel, `numberTile`×`numberTile`, row shuffle) but has 3 row variants including `memberCount` and `groupWholePart` — requires understanding group composition, not just visual matching.

---

### Finding 3 — Board time is a signal of expected difficulty, not a cause

| Group | Avg `boardTime` |
| ----- | --------------: |
| Best levels | 11–18 s |
| Hard arithmetic levels | 23–36 s |

The level designers already anticipated higher cognitive load — they gave users more time. Despite this, hard levels still accumulate 8–25 wrong moves/user. Extra time does not compensate for concept difficulty; it just reveals how much longer users struggle before giving up or making more errors.

---

### Finding 4 — Grid width compounds difficulty

Best levels use narrow grids (1 column, 2–3 rows = 2–3 items per panel side at a time). Hard arithmetic levels span wider grids (3–5 columns) that display multiple partial sums simultaneously:

- `stackingDifferentPairsOfSameValue202AL`: `distribute(10, 5)` columns — 5 columns on the main panel, requiring the child to manage 5 simultaneous number-pair relationships.
- `numbersFrom500To999AL`: `[2.5, 2.5, 5]` column split — presents 2 operand tiles and 1 slot column, three elements to track at once.
- `matchActivitiesWithObject2AL`: 3 rows (vs 2 in most best levels) **and** 20 total boards (10 training + 10 speedrun, config `boardCount=10`) — double the length of every other level in the best group, requiring sustained attention for longer.

---

### Summary Table — Mechanical Signatures

| Factor | **Best Performing** | **Hard / Struggling** |
| ------ | ------------------- | --------------------- |
| Right variant | `numberTile` (recognition/categorisation) | `numberSlot` visible fill (construction/decomposition) |
| Concept type | Concrete visual (match/sort/identify) | Abstract numerical (place value, multiplication, group addition) |
| Grid width | 1 column, 2–3 rows | 3–5 columns, 2–3 rows |
| Board time | 11–18 s | 23–36 s |
| Left variant | Visual tile / count tile | Visual tile or `audioTile` (cross-modal) |
| Board count | 5 (10 total) | 5–10 (10–20 total) |
| Shuffle axis | Row only | Row + column, or inline only |

---

### Design Recommendations from This Analysis

1. **For hard `numberSlot` levels** — add a worked example board at the start showing digit decomposition visually before the child attempts it. The slot mechanic itself is not the problem; the missing bridge is a model of *what goes in the slot*.
2. **For `matchEdgesCorners22AL`** — the audio-only cue is a barrier. Add a visual label or icon alongside the audio tile to provide a redundant cue. Audio-only matching requires intact phonological processing and quiet surroundings — neither is guaranteed.
3. **For `matchActivitiesWithObject2AL`** — the 20-board length (double most levels) combined with 3-row layout is a sustained-attention challenge. Consider splitting into two 10-board levels at different SkillAges.
4. **For `matrixMultiplicationRandomNumbers3AL`** — this is structurally the most complex layout in the pool (matrix grid, no shuffle, 36s board time). Introduce a single-row multiplication level as a prerequisite before the full matrix.
5. **Replicate best-level structure where possible** — the `numberTile`×`numberTile`, 2-row, single-column, row-shuffle pattern is a proven design template. Whenever a new concept can be expressed as "pick the matching item from a shuffled column," use this pattern.

---

## Overall Findings & Drop Reasons

> Synthesised from all 6 top-10 tables. The 45 AL assessment levels collectively logged **809 drops out of 2,516 starts (32% overall drop rate)**. The analyses point to three distinct root causes.

---

### Root Cause 1 — Content Too Hard (Content Difficulty)

**Signal:** High wrong moves/user + low success rate + moderate-to-high drop rate.

**Levels affected:** `matrixMultiplicationRandomNumbers3AL`, `numbersFrom500To999AL`, `mergeNumberUpTo9WithBAsTwoAL`, `stackVegetablesAndFruitsOverall2AL`, `stackingDifferentPairsOfSameValue202AL`, `fractionMultiplication6AL`, `matchEdgesCorners22AL`

**Evidence across tables:**
- `matrixMultiplicationRandomNumbers3AL` — #1 in Tables 4 and 5; 25.5 wrong/user (more than double any other level), 53% success, 38% drop. The absolute difficulty outlier in the pool.
- `numbersFrom500To999AL` — appears in Tables 1, 2, 3, 4, and 5; 17% completion, 56% success, 10.6 wrong/user, 47% drop. Multi-axis failure across every metric.
- `mergeNumberUpTo9WithBAsTwoAL` — #6 in Table 4 (10.0 wrong/user), #3 in Table 5; 51% drop means difficulty is also causing abandonment.
- `stackVegetablesAndFruitsOverall2AL` — #2 in Tables 1 and 5; 9.8 wrong/user with 53% drop and 1,669 total wrong moves (highest in pool). Largest absolute-volume problem level.

**What to do:** Redesign content difficulty curve — add intermediate boards, reduce cognitive load per board, or split into two separate levels.

---

### Root Cause 2 — Users Quit Without Engaging (UX / Comprehension Barrier)

**Signal:** Low wrong moves/user + high drop rate + high success% among completers (content is learnable once started).

**Levels affected:** `greaterSmallerUpTo999OperatorsAL`, `simpleIdentificationVegetablesSet2AL`, `matchNumberCount1to72AL`, `smallBigFrom1To99NumbersAL`, `orderUpToSevenNumber2AL`, `matchObjectWithFraction1AL`, `stackMultiStickInMultiSlot1To52AL`, `givenSmartChartScale6AL`

**Evidence across tables:**
- `greaterSmallerUpTo999OperatorsAL` — #1 in Table 6; 0.8 wrong/user, 60% drop, 91% success for completers. Users quit before making a single meaningful attempt. Immediate comprehension or instruction failure.
- `simpleIdentificationVegetablesSet2AL` — #3 in Table 6 (3.5 wrong/user, 43% drop) with 448 starters. The scale makes this the single largest absolute drop source in the entire pool (192 users).
- **Tight cluster (Tables 6 rows 4–10):** Six unrelated levels (`matchNumberCount1to72AL`, `orderUpToSevenNumber2AL`, `matchObjectWithFraction1AL`, `stackMultiStickInMultiSlot1To52AL`, `matchActivitiesWithObject2AL`, `summarizeTheSentences1AL`) all show 40–46% drop, 5.4–6.3 wrong/user, and 78–88% success for completers. The cross-content-type pattern strongly implies a **shared structural element** — likely the assessment intro screen, first-board layout, or instruction presentation — rather than individual level issues.
- `simpleIdentificationVegetablesSet2AL` + `matchNumberCount1to72AL` alone account for **253 dropped users** — the highest-impact fix opportunity in the pool.

**What to do:** Audit the shared level intro / first-board UX. Improve instruction clarity, add example interactions, or reduce the number of choices/distractors on the opening board.

---

### Root Cause 3 — Content Difficult but Users Persist (Difficulty Without Drop)

**Signal:** Very high wrong moves/user + low-to-zero drop rate. Users stay but keep failing.

**Levels affected:** `stackTensAndOnes20UpTo502AL`, `matchEdgesCorners22AL`, `groupAdditionOf5AL`, `placeValueMatrix1AL`, `reviseDivideTable8And9AL`

**Evidence across tables:**
- `stackTensAndOnes20UpTo502AL` — #2 in Table 4 (12.0 wrong/user) with 0% drop; all 17 starters stayed to the end despite significant struggle.
- `matchEdgesCorners22AL` — 10.9 wrong/user, 100% completion, 65% success; users finish every board but make many mistakes throughout.
- `groupAdditionOf5AL` — 10.1 wrong/user, only 11% drop; engaged users who are struggling rather than giving up.

**What to do:** These levels do not need urgency fixes (users are not dropping) but are candidates for **scaffolding improvements** — add hints, reduce board difficulty, or break concepts into smaller steps to improve success rate without losing engagement.

---

### Priority Action Matrix

| Priority | Level | Root Cause | Key Metric | Recommended Action |
|----------|-------|-----------|------------|-------------------|
| 🔴 Critical | `matrixMultiplicationRandomNumbers3AL` | Difficulty | 25.5 wrong/user, 53% success | Redesign content; add scaffolding |
| 🔴 Critical | `numbersFrom500To999AL` | Difficulty | 17% completion, 56% success | Reduce scope; split or simplify |
| 🔴 Critical | `simpleIdentificationVegetablesSet2AL` | UX / Comprehension | 192 users dropped | Audit intro screen and first board |
| 🟠 High | `stackVegetablesAndFruitsOverall2AL` | Difficulty | 9.8 wrong/user, 53% drop | Reduce boards or add checkpoints |
| 🟠 High | `mergeNumberUpTo9WithBAsTwoAL` | Difficulty | 10.0 wrong/user, 51% drop | Add intermediate practice boards |
| 🟠 High | `matchNumberCount1to72AL` | UX / Comprehension | 61 users dropped, 5.6 wrong/user | Improve instructions and first-board UX |
| 🟠 High | `smallBigFrom1To99NumbersAL` | UX / Comprehension | 52% drop, 78% success for completers | Review level entry and instruction clarity |
| 🟡 Medium | `stackingDifferentPairsOfSameValue202AL` | Difficulty | 7.8 wrong/user, 47% drop | Simplify pairing logic |
| 🟡 Medium | `matchActivitiesWithObject2AL` | Both | 6.3 wrong/user, 44% drop | UX + difficulty review |
| 🟡 Medium | `summarizeTheSentences1AL` | Both | 73% success, 42% drop | Review task format and comprehension barrier |
| 🟢 Monitor | `stackTensAndOnes20UpTo502AL` | Persisting difficulty | 12.0 wrong/user, 0% drop | Add hints; no urgency |
| 🟢 Monitor | `matchEdgesCorners22AL` | Persisting difficulty | 10.9 wrong/user, 100% completion | Add scaffolding |
| 🟢 Monitor | `fractionMultiplication6AL` | Difficulty | 8.7 wrong/user, 424 total WM | Watch for drop increase |
