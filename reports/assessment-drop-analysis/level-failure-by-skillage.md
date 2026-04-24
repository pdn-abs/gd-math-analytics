# Level Failure & Drop Analysis by Skill Age

> **Period**: Jan 25 → Mar 25, 2026 (60 days)
> **Source**: BigQuery — `segmentStarted`, `segmentCompleted` (status=fail/pass), `segmentDropped`
> **Min threshold**: 10 segment starts per level per skill age
> **Last updated**: 2026-03-30

---

## How to read this table

- **Fail%** = `segmentCompleted` with `status=fail` ÷ started — user reached a scored outcome but got it wrong
- **Drop%** = `segmentDropped` ÷ started — user abandoned silently without being scored
- **F+D%** = combined failure+drop rate — primary churn signal

---

## Top 10 Levels by F+D% per Skill Age

| Skill Age | Level | Branch | Users | Started | Pass | Fail | Drop | Fail% | Drop% | F+D% |
|---|---|---|---|---|---|---|---|---|---|---|
| **2 Y** | subtractionBothMissingUpTo99 | Arithmetic | 8 | 11 | 0 | 0 | 11 | 0% | 100% | **100%** |
| 2 Y | withBorrow500To999B4 | Arithmetic | 6 | 10 | 0 | 0 | 10 | 0% | 100% | **100%** |
| 2 Y | moneyCompositionForNumbersMaster | Money | 7 | 11 | 0 | 0 | 11 | 0% | 100% | **100%** |
| 2 Y | absenteeCountMatch | Time | 10 | 13 | 0 | 0 | 13 | 0% | 100% | **100%** |
| 2 Y | fillSlotWithFoodFraction7 | Numbers | 8 | 10 | 0 | 0 | 10 | 0% | 100% | **100%** |
| 2 Y | fractionMultiplication14 | Numbers | 6 | 13 | 0 | 0 | 13 | 0% | 100% | **100%** |
| 2 Y | mixedFractionImageMatching2 | Numbers | 5 | 10 | 0 | 0 | 10 | 0% | 100% | **100%** |
| 2 Y | writeLevelSimpleLine | Geometry | 6 | 11 | 0 | 0 | 11 | 0% | 100% | **100%** |
| 2 Y | matrixMultiplicationRandomNumbers6 | Arithmetic | 6 | 10 | 0 | 0 | 10 | 0% | 100% | **100%** |
| 2 Y | matchObjectWithFraction2 | Numbers | 8 | 10 | 0 | 0 | 10 | 0% | 100% | **100%** |
| **3 Y** | matchCountNumber1To3 | Numbers | 6 | 13 | 4 | 3 | 5 | 23.1% | 38.5% | **61.5%** |
| 3 Y | countWithSingleStick1To3 | Numbers | 4 | 11 | 5 | 2 | 3 | 18.2% | 27.3% | **45.5%** |
| 3 Y | matchCountAudio7To9 | Numbers | 7 | 23 | 9 | 6 | 3 | 26.1% | 13.0% | **39.1%** |
| 3 Y | stackMultiStickInMultiSlot1To52AL | Numbers | 56 | 120 | 45 | 13 | 29 | 10.8% | 24.2% | **35.0%** |
| 3 Y | matchNumberCount1to72AL | Numbers | 125 | 436 | 200 | 18 | 104 | 4.1% | 23.9% | **28.0%** |
| 3 Y | simpleIdentificationFruitsSet1 | Objects | 6 | 11 | 7 | 0 | 3 | 0% | 27.3% | **27.3%** |
| 3 Y | writeLevelSimpleLine | Geometry | 16 | 32 | 22 | 0 | 8 | 0% | 25.0% | **25.0%** |
| 3 Y | stackRectangleAndTriangle | Geometry | 9 | 26 | 10 | 3 | 2 | 11.5% | 7.7% | **19.2%** |
| 3 Y | stackVegetablesAndFruitsSet3 | Objects | 5 | 11 | 7 | 1 | 1 | 9.1% | 9.1% | **18.2%** |
| 3 Y | simpleIdentificationFruitsSet3 | Objects | 18 | 45 | 27 | 5 | 3 | 11.1% | 6.7% | **17.8%** |
| **4 Y** | matchAudioByColorSet1 | Objects | 15 | 44 | 11 | 1 | 18 | 2.3% | 40.9% | **43.2%** |
| 4 Y | mergeNumberUpTo9WithBAsTwoAL | Arithmetic | 43 | 100 | 40 | 6 | 34 | 6.0% | 34.0% | **40.0%** |
| 4 Y | matchActivitiesWithObject2AL | Objects | 57 | 142 | 39 | 2 | 52 | 1.4% | 36.6% | **38.0%** |
| 4 Y | matchBasicShapeTiles | Geometry | 18 | 45 | 14 | 8 | 9 | 17.8% | 20.0% | **37.8%** |
| 4 Y | patternBasicFruits | Algebra | 8 | 19 | 6 | 0 | 7 | 0% | 36.8% | **36.8%** |
| 4 Y | orderUpToNineAudio | Numbers | 6 | 10 | 6 | 0 | 3 | 0% | 30.0% | **30.0%** |
| 4 Y | orderUpToSevenNumber2AL | Numbers | 67 | 273 | 180 | 5 | 52 | 1.8% | 19.0% | **20.9%** |
| 4 Y | between0To20Transition | Numbers | 5 | 13 | 10 | 1 | 1 | 7.7% | 7.7% | **15.4%** |
| 4 Y | mergeExample | Objects | 21 | 22 | 21 | 0 | 1 | 0% | 4.5% | **4.5%** |
| 4 Y | introLevelStack | Objects | 21 | 22 | 22 | 0 | 0 | 0% | 0% | **0%** |
| **5 Y** | orderUpToThreeNumber | Numbers | 6 | 14 | 7 | 1 | 5 | 7.1% | 35.7% | **42.9%** |
| 5 Y | stackDomesticAndWildAnimal | Objects | 11 | 24 | 11 | 0 | 10 | 0% | 41.7% | **41.7%** |
| 5 Y | stackingDifferentPairsOfSameValue202AL | Arithmetic | 70 | 275 | 133 | 15 | 63 | 5.5% | 22.9% | **28.4%** |
| 5 Y | patternBasicAnimals | Algebra | 6 | 11 | 2 | 0 | 3 | 0% | 27.3% | **27.3%** |
| 5 Y | dataHandlingIconsBirdsAnimals2AL | Data Handling | 20 | 54 | 42 | 8 | 2 | 14.8% | 3.7% | **18.5%** |
| 5 Y | simpleIdentificationOfLines | Geometry | 6 | 12 | 8 | 0 | 2 | 0% | 16.7% | **16.7%** |
| 5 Y | subtractionMissingAUpTo20AL | Arithmetic | 35 | 95 | 61 | 8 | 7 | 8.4% | 7.4% | **15.8%** |
| 5 Y | smallBigUpTo50Number2AL | Arithmetic | 11 | 26 | 20 | 3 | 1 | 11.5% | 3.8% | **15.4%** |
| 5 Y | matchEdgesCorners22AL | Geometry | 10 | 22 | 19 | 2 | 1 | 9.1% | 4.5% | **13.6%** |
| 5 Y | stackTensAndOnes20UpTo502AL | Numbers | 15 | 39 | 29 | 3 | 0 | 7.7% | 0% | **7.7%** |
| **6 Y** | introLevelStack | Objects | 11 | 13 | 8 | 0 | 5 | 0% | 38.5% | **38.5%** |
| 6 Y | matchMusicalInstrumentsIndian | Objects | 5 | 13 | 4 | 0 | 5 | 0% | 38.5% | **38.5%** |
| 6 Y | matchTopBottomFirst | Geometry | 5 | 12 | 6 | 1 | 3 | 8.3% | 25.0% | **33.3%** |
| 6 Y | smallBigFrom1To99NumbersAL | Numbers | 39 | 104 | 47 | 4 | 29 | 3.8% | 27.9% | **31.7%** |
| 6 Y | patternWithEmptyAndFilledShapes | Algebra | 5 | 10 | 8 | 0 | 2 | 0% | 20.0% | **20.0%** |
| 6 Y | missingBRandomAAndB50To99AL | Arithmetic | 18 | 39 | 28 | 0 | 7 | 0% | 17.9% | **17.9%** |
| 6 Y | groupAdditionOf5AL | Arithmetic | 9 | 18 | 15 | 0 | 1 | 0% | 5.6% | **5.6%** |
| 6 Y | orderBasedOnWeightSameObject | Measurements | 2 | 25 | 22 | 0 | 1 | 0% | 4.0% | **4.0%** |
| 6 Y | cowBananaTable4AL | Arithmetic | 7 | 13 | 12 | 0 | 0 | 0% | 0% | **0%** |
| **7 Y** | numbersFrom500To999AL | Numbers | 25 | 53 | 9 | 2 | 24 | 3.8% | 45.3% | **49.1%** |
| 7 Y | matchMusicalInstrumentsIndian | Objects | 4 | 10 | 9 | 0 | 1 | 0% | 10.0% | **10.0%** |
| **8 Y** | rotateObject1 | Algebra | 3 | 11 | 6 | 2 | 1 | 18.2% | 9.1% | **27.3%** |
| 8 Y | summarizeTheSentences1AL | Data Handling | 18 | 61 | 30 | 0 | 16 | 0% | 26.2% | **26.2%** |
| 8 Y | numberDiceMatching2AL | Arithmetic | 6 | 11 | 10 | 0 | 1 | 0% | 9.1% | **9.1%** |
| 8 Y | grid4Row4Column | Arithmetic | 1 | 57 | 50 | 5 | 0 | 8.8% | 0% | **8.8%** |
| 8 Y | reviseDivideTable8And9AL | Arithmetic | 6 | 15 | 13 | 0 | 1 | 0% | 6.7% | **6.7%** |
| 8 Y | arrangeLifeSpan | Time | 2 | 70 | 60 | 3 | 1 | 4.3% | 1.4% | **5.7%** |
| 8 Y | placeValueMatrix1AL | Numbers | 8 | 20 | 17 | 0 | 1 | 0% | 5.0% | **5.0%** |
| 8 Y | findCountOfToys3 | Money | 1 | 81 | 76 | 0 | 2 | 0% | 2.5% | **2.5%** |
| 8 Y | matchFamilyAge | Time | 2 | 50 | 49 | 0 | 1 | 0% | 2.0% | **2.0%** |
| 8 Y | orderBasedOnWeightSameObject | Measurements | 2 | 510 | 500 | 0 | 5 | 0% | 1.0% | **1.0%** |
| **9 Y** | fractionMultiplication6AL | Numbers | 3 | 12 | 7 | 0 | 3 | 0% | 25.0% | **25.0%** |
| 9 Y | matchObjectWithFraction1AL | Numbers | 7 | 23 | 15 | 0 | 3 | 0% | 13.0% | **13.0%** |
| **10 Y** | simpleIdentificationFruitsSet1 | Objects | 3 | 19 | 7 | 1 | 8 | 5.3% | 42.1% | **47.4%** |
| 10 Y | orderBasedOnWeightSameObject | Measurements | 2 | 11 | 5 | 0 | 5 | 0% | 45.5% | **45.5%** |
| 10 Y | matrixMultiplicationRandomNumbers3AL | Arithmetic | 21 | 36 | 16 | 2 | 9 | 5.6% | 25.0% | **30.6%** |
| 10 Y | matchObjectWithFraction1AL | Numbers | 98 | 331 | 166 | 9 | 90 | 2.7% | 27.2% | **29.9%** |
| 10 Y | fractionMultiplication6AL | Numbers | 40 | 101 | 60 | 2 | 21 | 2.0% | 20.8% | **22.8%** |
| 10 Y | numberPattern1 | Algebra | 4 | 11 | 9 | 0 | 2 | 0% | 18.2% | **18.2%** |
| 10 Y | matchObjectWithFraction1 | Numbers | 5 | 11 | 7 | 0 | 2 | 0% | 18.2% | **18.2%** |
| 10 Y | arrangeLifeSpan | Time | 3 | 15 | 9 | 0 | 2 | 0% | 13.3% | **13.3%** |
| 10 Y | matchMirrorImage | Geometry | 6 | 11 | 10 | 0 | 1 | 0% | 9.1% | **9.1%** |
| 10 Y | matchCornersOfObjects | Geometry | 4 | 23 | 19 | 0 | 0 | 0% | 0% | **0%** |

---

## Key Findings

### 🔴 2 Y — Content routing bug (critical)

All 10 worst levels for 2Y users have a **100% drop rate with 0 passes**. The level IDs are advanced content that does not belong in the 2Y skill-age bucket:

| Level | Why it's wrong for 2Y |
|---|---|
| `fractionMultiplication14` | Fraction multiplication — 8–10Y content |
| `matrixMultiplicationRandomNumbers6` | Matrix multiplication — 9–10Y content |
| `mixedFractionImageMatching2` | Mixed fractions — 8–10Y content |
| `withBorrow500To999B4` | Subtraction with borrowing up to 999 — 6–7Y content |
| `subtractionBothMissingUpTo99` | Double-missing subtraction — 5–6Y content |
| `moneyCompositionForNumbersMaster` | Money composition — 5–6Y content |
| `writeLevelSimpleLine` | Geometry line writing — possibly misrouted |
| `absenteeCountMatch` | Absentee count — possibly misrouted |
| `fillSlotWithFoodFraction7` | Fraction matching — 7–8Y content |
| `matchObjectWithFraction2` | Fraction matching — 7–8Y content |

**Action**: Audit the level routing/selection logic for `currentSkillAge = 2 Y`. These levels should never appear for 2Y users.

---

### 🟠 High-volume problem levels (broad impact)

| Level | Skill Age | Users | Started | F+D% | Notes |
|---|---|---|---|---|---|
| `matchNumberCount1to72AL` | 3 Y | 125 | 436 | 28% | Highest volume at 3Y — 104 drops |
| `matchActivitiesWithObject2AL` | 4 Y | 57 | 142 | 38% | 52 drops, only 39 passes |
| `stackingDifferentPairsOfSameValue202AL` | 5 Y | 70 | 275 | 28.4% | 63 drops across wide audience |
| `matchObjectWithFraction1AL` | 10 Y | 98 | 331 | 29.9% | Highest volume at 10Y — 90 drops |
| `numbersFrom500To999AL` | 7 Y | 25 | 53 | 49.1% | Only 9/53 pass — severe difficulty spike |
| `smallBigFrom1To99NumbersAL` | 6 Y | 39 | 104 | 31.7% | 29 drops |

---

### ✅ 8 Y — Healthiest cohort

8Y has the lowest overall F+D% (5.9%) of any age group. Even the worst level (`rotateObject1` at 27.3%) has only 11 starts. The 8Y experience is working well — use as reference for content calibration.
