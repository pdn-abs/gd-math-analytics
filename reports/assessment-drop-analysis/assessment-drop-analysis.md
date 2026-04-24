# Assessment Drop Analysis — Complete Summary

**Period:** Jan 25 – Mar 25, 2026
**Sources:** GA4 UI + BigQuery
**Scope:** All versions, Production Only

---

## Table of Contents

1. [Funnel Overview](#1-funnel-overview)
2. [WHEN — At Which Segment Do Users Drop?](#2-when--at-which-segment-do-users-drop)
3. [WHERE — At Which Board Inside the Level?](#3-where--at-which-board-inside-the-level)
4. [WHY — What the Drop Signals Tell Us](#4-why--what-the-drop-signals-tell-us)
   - [4a. Time Spent Before Dropping](#4a-time-spent-before-dropping)
   - [4b. Training vs Speedrun Drops](#4b-training-vs-speedrun-drops)
   - [4c. Avg Board at Drop vs Board Count](#4c-avg-board-at-drop-vs-board-count)
5. [Drop Rate by Skill Age](#5-drop-rate-by-skill-age)
6. [Table 1 — High Drop Rate Levels](#6-table-1--high-drop-rate-levels)
7. [Table 2 — High Completion Rate Levels](#7-table-2--high-completion-rate-levels)
8. [Two Failure Archetypes](#8-two-failure-archetypes)
9. [Immediate Actions](#9-immediate-actions)

---

## 1. Funnel Overview

| Stage | Users | Rate |
|-------|-------|------|
| Entered assessment (`segmentStarted`) | **1,155** | — |
| Completed at least one segment | **778** | 67.4% of starters |
| Dropped at least one segment | **654** | 56.6% of starters |
| **Completed full assessment** (`assessmentCompleted`) | **108** | **9.3% of starters** |

Only 1 in 11 users who begin an assessment level actually complete the full assessment. The funnel collapses overwhelmingly before `assessmentCompleted` fires.

---

## 2. WHEN — At Which Segment Do Users Drop?

From the path exploration (all events, not filtered to assessment type):

| Segment # | Users entering | Dropped | Drop rate at this step |
|-----------|---------------|---------|------------------------|
| **1st level** | 1,107 | **388** | **35.1%** ← worst |
| 2nd level | 710 | 126 | 17.7% |
| 3rd level | 558 | 128 | 22.9% |
| 4th level | 428 | 56 | 13.1% |
| 5th level | 372 | — | declining |

**Segment 1 is the wall.** Users who survive it are 2× more likely to continue. Each subsequent step the retention stabilises — the problem is almost entirely first-level rejection.

---

## 3. WHERE — At Which Board Inside the Level?

From BigQuery `boardIndex` analysis (954 total drop events):

| Board | Drops | Share |
|-------|-------|-------|
| **Board 1** | **457** | **48%** |
| Board 2 | 159 | 17% |
| Board 3 | 125 | 13% |
| Board 4 | 110 | 12% |
| Board 5+ | 103 | 11% |

Nearly half of all drops happen on the very first board of the level. The level loads — users see it — and leave. This is **content rejection, not difficulty failure**.

---

## 4. WHY — What the Drop Signals Tell Us

### 4a. Time Spent Before Dropping

| Signal | Value | Interpretation |
|--------|-------|----------------|
| Median duration before drop | **21s** | Most users don't even try |
| Avg duration before drop | 43s | Pulled up by a struggling minority |
| Quit under 10s (immediate) | **329 users (34.5%)** | Instant rejection — wrong content |
| Quit under 30s (quick) | **570 users (59.7%)** | Barely engaged |
| Avg error rate on drops | 22.3% | Low — they're not failing, they're leaving |

> A 22% error rate with a 21s median means users are not struggling and quitting — they see the level and navigate away before meaningfully engaging.

### 4b. Training vs Speedrun Drops

| Segment | Users Started | Users Dropped | Drop% | Drop Events | Avg duration | Error rate | Quit <30s |
|---------|-------------|--------------|-------|------------|-------------|------------|----------|
| **Training** | **795** | **408** | **51.3%** | 799 | 46s | 24.2% | 479 |
| Speedrun | **517** | **133** | **25.7%** | 158 | 28s | **15.3%** | 91 |

> Drop% = unique users who dropped ÷ users started. Drop Events exceeds Users Dropped because one user can drop multiple assessment levels within the same session (each level fires a separate `segmentDropped` event). Training averages ~2.0 drop events per user who dropped; Speedrun averages ~1.2.

Training accounts for 3× more unique droppers and 5× more drop events. Speedrun drops are faster (28s) and lower error — users who reach speedrun and quit do so decisively, not from confusion.

### 4c. Avg Board at Drop vs Board Count

> **Source:** Config boardCount from `assets/config.json`. Avg board at drop from BigQuery (`AVG(boardIndex)` per drop event — more accurate than GA4 which divides boardIndex sum by unique users, inflating the figure when users drop a level more than once).

| Level | Users Started | GA4 Unique Droppers | BQ Drop Events | Drop% | Config Board Count | Avg Board at Drop (BQ) | Progress at Drop | Pattern |
|-------|-------------|-------------------|---------------|-------|-------------------|----------------------|-----------------|---------|
| matchActivitiesWithObject2AL | 61 | 27 | 49 | 44.3% | **10** | **3.5 / 10** | 35% | Mid-level struggle |
| matrixMultiplicationRandomNumbers3AL | 26 | 10 | 7 | 38.5% | **5** | **2.6 / 5** | 52% | Fails past midpoint |
| simpleIdentificationVegetablesSet2AL | 448 | 138 | 282 | 30.8%\* | **5** | **2.2 / 5** | 44% | Early quit |
| numbersFrom500To999AL | 30 | 14 | 26 | 46.7% | **5** | **1.6 / 5** | 32% | Fails on first boards |
| orderUpToNineAudio | 6 | 3 | — | 50.0% | **10** | — (n<5) | — | Likely bug (avg 13m 20s drop) |

> \* GA4 showed 192 unique droppers for `simpleIdentificationVegetablesSet2AL` but BQ has 138 — the 54-user gap is the Jan 25–Feb 11 BQ data absence. Drop% here uses GA4 numerator (192) over 448 starters = 42.9% in GA4; BQ-aligned drop% = 30.8%.

**Key corrections vs previous table:**
- "Total boards" was previously calculated as `boardCount_sum / started_users` from GA4 — this was wrong because GA4 sums boardCount across all events including restarts. Config values are authoritative.
- "Avg board at drop" was previously `boardIndex_sum / unique_users` from GA4 — inflated because 1 user can generate multiple drop events. BQ per-event `AVG(boardIndex)` is correct.
- `numbersFrom500To999AL` drops at board **1.6 / 5** — users fail in the first third, confirming the difficulty-spike diagnosis.

---

## 5. Drop Rate by Skill Age

| Skill Age | Started | Completed | Completion% | Dropped | Drop% |
|-----------|---------|-----------|-------------|---------|-------|
| 2Y | 609 | 453 | 74.4% | 329 | 54.0% |
| 3Y | 137 | 84 | 61.3% | 74 | 54.0% |
| 4Y | 109 | 70 | 64.2% | 68 | 62.4% |
| 10Y | 107 | 65 | 60.7% | 54 | 50.5% |
| 5Y | 76 | 47 | 61.8% | 37 | 48.7% |
| 6Y | 45 | 20 | 44.4% | 29 | **64.4%** |
| **7Y** | 30 | 6 | **20.0%** | 14 | 46.7% |
| 8Y | 23 | 13 | 56.5% | 10 | 43.5% |

**7Y is a critical outlier** — only 20% completion. The training segment is entirely responsible (6/30 = 20%) while speedrun at 7Y has 100% completion (6/6). The **7Y training content is the problem**, not the age group.

---

## 6. Table 1 — High Drop Rate Levels

Sorted by drop rate descending. Threshold: ≥5 starters. 39 levels at ≥40% drop rate.

| Level | Started | Drop% | Completion% | Avg time (drop) | Total time |
|-------|---------|-------|-------------|----------------|------------|
| matchAudioNumber1To3 | 6 | **83.3%** | 16.7% | 1m 32s | 11m 27s |
| matchTopBottomFirst | 11 | **81.8%** | 36.4% | 17s | 14m 58s |
| patternBasicFruits | 14 | **78.6%** | 21.4% | 58s | 22m 12s |
| mergeAndMatchTensAndOnesUpTo50 | 7 | **71.4%** | **0.0%** | 2m 47s | 13m 57s |
| matchCountNumber1To3 | 15 | 66.7% | 40.0% | 1m 09s | 56m 20s |
| matchColorTilesOne | 9 | 66.7% | 33.3% | 22s | 16m 48s |
| dataHandlingMatchCountGroupedFruits | 10 | 60.0% | 40.0% | 42s | 12m 14s |
| greaterSmallerUpTo999OperatorsAL | 5 | 60.0% | 40.0% | 32s | 5m 4s |
| **stackVegetablesAndFruitsOverall2AL** | **170** | 52.9% | 72.9% | 32s | **8h 53m** |
| mergeNumberUpTo9WithBAsTwoAL | 51 | 51.0% | 52.9% | 1m 50s | 2h 56m |
| maskPattern | 8 | 50.0% | 62.5% | 48s | 28m 29s |
| moneyComposition1And2ForNumbers | 10 | 50.0% | 60.0% | 1m 08s | 37m 10s |
| orderUpToNineAudio | 6 | 50.0% | 50.0% | **13m 20s** | 43m 47s |
| **stackingDifferentPairsOfSameValue202AL** | **76** | 47.4% | 61.8% | 56s | **4h 8m** |
| **numbersFrom500To999AL** | 30 | 46.7% | **16.7%** | 1m 11s | 49m 36s |
| matchMusicalInstrumentsIndian | 15 | 46.7% | 66.7% | 32s | 24m 54s |
| **matchNumberCount1to72AL** | **134** | 45.5% | 61.2% | 1m 04s | **8h 4m** |
| givenSmartChartScale6AL | 9 | 44.4% | 55.6% | 3m 09s | 28m 54s |
| reviseMatchLinesWithObject | 9 | 44.4% | 55.6% | 1m 26s | 23m 4s |
| **matchActivitiesWithObject2AL** | 61 | 44.3% | 41.0% | 55s | **2h 26m** |
| matchAudioByColorSet1 | 23 | 43.5% | 39.1% | 36s | 45m 1s |
| **simpleIdentificationVegetablesSet2AL** | **448** | 42.9% | 74.1% | 37s | **17h 34m** |
| sortBirdsAndAnimalsInsectsAquatic | 7 | 42.9% | 71.4% | 1m 03s | 35m 39s |
| simpleIdentificationFruitsSet1 | 57 | 42.1% | 73.7% | 43s | 2h 10m |
| summarizeTheSentences1AL | 24 | 41.7% | 54.2% | 32s | 50m 5s |
| matchCountAudio7To9 | 12 | 41.7% | 66.7% | 56s | 41m 16s |
| **orderUpToSevenNumber2AL** | 77 | 41.6% | **87.0%** | 1m 12s | **4h 4m** |
| **matchObjectWithFraction1AL** | 118 | 41.5% | 61.0% | 28s | **4h 27m** |
| stackDomesticAndWildAnimal | 17 | 41.2% | 47.1% | 44s | 41m 44s |
| matrixMultiplicationRandomNumbers3AL | 26 | 38.5% | 46.2% | 1m 39s | 1h 33m |

---

## 7. Table 2 — High Completion Rate Levels

Sorted by completion rate descending. 33 levels at ≥80% completion rate.

| Level | Started | Completion% | Drop% | Avg time (done) | Total time |
|-------|---------|-------------|-------|----------------|------------|
| matchEdgesCorners22AL | 11 | **100%** | 9.1% | 1m 01s | 24m 53s |
| simpleIdentificationAnimalsOverall | 8 | **100%** | 12.5% | 1m 17s | 20m 21s |
| simpleIdentificationToysOverall | 6 | **100%** | 16.7% | 48s | 12m 57s |
| matchFractionWithImage4AL | 5 | **100%** | 20.0% | 1m 03s | 9m 42s |
| writeLevel1To52AL | 19 | 94.7% | 5.3% | 51s | 29m 24s |
| **stackMultiStick1To52AL** | **103** | **94.2%** | 13.6% | 47s | **3h 39m** |
| missingBRandomAAndB50To99AL | 17 | 94.1% | 29.4% | 1m 00s | 32m 0s |
| stackTensAndOnes20UpTo502AL | 17 | 94.1% | 0.0% | 1m 58s | 1h 10m |
| simpleIdentificationVegetablesSet1 | 20 | 90.0% | 25.0% | 1m 28s | 1h 3m |
| reviseDivideTable8And9AL | 9 | 88.9% | 22.2% | 1m 32s | 27m 42s |
| groupAdditionOf5AL | 9 | 88.9% | 11.1% | 1m 27s | 22m 0s |
| patternBasicFoods2AL | 9 | 88.9% | 11.1% | 1m 03s | 17m 54s |
| **simpleIdentificationAnimalsSet1And22AL** | **85** | **88.2%** | 10.6% | 42s | **2h 7m** |
| writeLevelSimpleLine2AL | 25 | 88.0% | 20.0% | 26s | 19m 32s |
| matchShapesByObjects2AL | 24 | 87.5% | 8.3% | 1m 08s | 48m 24s |
| **orderUpToSevenNumber2AL** | 77 | **87.0%** | 41.6% | 48s | **4h 4m** |
| dataHandlingIconsBirdsAnimals2AL | 23 | 87.0% | 13.0% | 33s | 30m 28s |
| simpleIdentificationOfLines | 7 | 85.7% | 14.3% | 2m 20s | 28m 56s |
| smallBigUpTo50Number2AL | 13 | 84.6% | 7.7% | 1m 00s | 27m 56s |
| sortRedGreenYellowWhiteBlackGray2AL | 32 | 84.4% | 9.4% | 44s | 42m 8s |
| **stackUtensilsVehicles2AL** | 65 | **83.1%** | 18.5% | 56s | **1h 55m** |
| simpleIdentificationFoodOverall | 21 | 81.0% | 19.0% | 43s | 31m 31s |
| **simpleIdentifyApparelAndStationery2AL** | 47 | **80.9%** | 19.1% | 39s | 53m 49s |
| fillSubtractionStaticB3UpTo52AL | 10 | 80.0% | 10.0% | 31s | 9m 46s |
| placeValueMatrix1AL | 10 | 80.0% | 10.0% | 56s | 23m 44s |
| **stackColorTilesSet1And22AL** | **163** | **79.8%** | 19.6% | 55s | **4h 39m** |
| **simpleIdentificationToysSet22AL** | **259** | **79.2%** | 24.3% | 45s | **6h 39m** |

---

## 8. Two Failure Archetypes

### Archetype A — "Quick Reject"

Drop duration <30s, drop on Board 1. Content doesn't match expectation or skill level.

**Characteristics:** User sees the level and leaves without meaningful interaction. Low error rate. High volume of <10s exits.

**Examples:**
- `simpleIdentificationVegetablesSet2AL` — 204 of 285 BQ drop events in <30s
- `matchTopBottomFirst` — avg drop at 17s
- `matchColorTilesOne` — avg drop at 22s

**Fix direction:** Review Board 1 visuals, instructions, and skill-age assignment. The level may be presented to the wrong age group or the first board is visually confusing before any interaction.

### Archetype B — "Prolonged Struggle"

Drop duration >90s, deeper board index. Mechanic is unclear or difficulty spikes.

**Characteristics:** User invests significant time then gives up. Higher error rate. Drops spread across multiple boards.

**Examples:**
- `orderUpToNineAudio` — avg 13m 20s before drop (possible audio/timer bug)
- `mergeAndMatchTensAndOnesUpTo50` — 2m 47s avg drop, 0% completion rate
- `matrixMultiplicationRandomNumbers3AL` — 1m 39s avg drop, 60.6% error rate
- `matchActivitiesWithObject2AL` — users reach board 7.5 / 24 on average before quitting

**Fix direction:** Add hint system after N wrong moves, simplify mid-level difficulty curve, or investigate for bugs (especially audio-dependent levels).

---

## 9. Immediate Actions

### 🔴 Priority 1 — Remove or Fix Broken Content

| Level | Issue | Action |
|-------|-------|--------|
| `mergeAndMatchTensAndOnesUpTo50` | 71.4% drop, **0% completion** | Remove from assessment until fixed |
| `numbersFrom500To999AL` | 46.7% drop, 16.7% completion, 53.5% error rate | Reduce difficulty or split into simpler steps |
| `matchAudioNumber1To3` | 83.3% drop | Verify audio assets load correctly — likely a bug |
| `orderUpToNineAudio` | 50% drop, avg 13m 20s drop duration | Investigate audio/timer bug causing excessive wait |

### 🟠 Priority 2 — Fix 7Y Training Content

| Finding | Action |
|---------|--------|
| 7Y training: 20% completion (6/30 users) | Audit the levels assigned at 7Y in training mode — they are the sole cause of 7Y collapse |
| 7Y speedrun: 100% completion (6/6 users) | Speedrun content at 7Y is fine — isolate and compare training-only level assignments |

### 🟡 Priority 3 — Reduce First-Board Friction on High-Volume Levels

These levels have large user bases and early drop patterns — small content or UX improvements have the highest aggregate impact.

| Level | Users | Drop% | Avg drop board | Recommendation |
|-------|-------|-------|---------------|----------------|
| `simpleIdentificationVegetablesSet2AL` | 448 | 42.9% | 4.3 / 18 | Add onboarding cue on Board 1 — highest ROI of any single change |
| `matchObjectWithFraction1AL` | 118 | 41.5% | 5.3 / 20 | Add a worked example on the first board |
| `stackVegetablesAndFruitsOverall2AL` | 170 | 52.9% | 4.0 / 20 | 36% error rate — simplify early boards |
| `matchActivitiesWithObject2AL` | 61 | 44.3% | 7.5 / 24 | Users invest 55s avg — add hint system after 3 wrong moves |

### 🟢 Priority 4 — Use Top Performers as Templates

The best-performing high-volume levels share a pattern: avg completion time 40–55s, low error rate, clear visual mechanic, gradual difficulty ramp.

**Model levels to replicate:**
- `stackMultiStick1To52AL` — 94.2% completion, 103 users, 3h 39m total time
- `simpleIdentificationToysSet22AL` — 79.2% completion, 259 users, 6h 39m total time
- `simpleIdentificationAnimalsSet1And22AL` — 88.2% completion, 85 users, 2h 7m total time

Apply their board structure, pacing, and difficulty curve when redesigning failing levels.

### 🔵 Priority 5 — Instrument Drop Reason in Code

Currently there is no way to distinguish *why* a user leaves — back button press, app close, or a redirect. Adding a `dropReason` parameter to the `segmentDropped` event in `autoload/UserEvents.gd` would enable separating voluntary exits from crashes and timeouts.

```gdscript
# In _sendLevelDropSignal() — scenes/screens/levels/main.gd
PubSub.segmentDropped.emit({
    "level": currentLevel,
    # ... existing params ...
    "dropReason": "userExit",   # vs "timeout", "appBackground" etc.
})
```

---

*Generated: 14 April 2026 | Data: GA4 property 441470574 + BigQuery gd-math-71c48.analytics_441470574*
