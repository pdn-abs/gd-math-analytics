# Formal Failure Analysis (Drops Excluded)

> **Period**: Jan 25 → Mar 25, 2026 (60 days)
> **Source**: BigQuery — `segmentStarted`, `segmentCompleted` (status=fail only)
> **Scope**: Only scored outcomes where the user reached the end and got it wrong. Silent drops excluded.
> **Last updated**: 2026-03-30

---

## Summary

Formal failure rates are **universally low** across all skill ages (0.7–6.4%). The dominant churn
signal in the app is silent drops (abandonment), not scored failures. This report focuses on the
failure-specific dimension: which levels users actually attempt, finish wrong, and whether they
persist through retries.

---

## Complete Data Table

All levels with at least 10 starts and at least 1 formal failure, ordered by skill age then Fail%.
Drops are excluded from all calculations.

| Skill Age | Level | Branch | Started | Pass | Fail | Users | Fail% | AvgWrong(F) | AvgAttempt(F) | AvgWrong(P) |
|---|---|---|---|---|---|---|---|---|---|---|
| 2 Y | zeroFromDifferentNumbers | Numbers | 10 | 3 | 2 | 1 | 20.0% | 0.0 | 1.0 | 0.3 |
| 2 Y | patternBasicFruits | Algebra | 12 | 2 | 2 | 1 | 16.7% | 4.5 | 1.5 | 10.0 |
| 2 Y | matchActivityWithTheirDuration1 | Time | 15 | 6 | 2 | 1 | 13.3% | 0.5 | 1.5 | 0.3 |
| 2 Y | matchThingsWithMoney2 | Money | 18 | 8 | 2 | 1 | 11.1% | 0.0 | 1.5 | 0.1 |
| 2 Y | stackVegetablesAndFruitsSet1 | Objects | 19 | 7 | 2 | 2 | 10.5% | 4.5 | 1.0 | 5.0 |
| 2 Y | stackMultiStick1To52AL | Numbers | 276 | 203 | 28 | 23 | 10.1% | 2.1 | 1.0 | 1.9 |
| 2 Y | sortBirdsAndAnimalsInsectsAquatic | Objects | 22 | 10 | 2 | 2 | 9.1% | 7.0 | 1.0 | 5.8 |
| 2 Y | calculateReachTime2 | Time | 11 | 6 | 1 | 1 | 9.1% | 1.0 | 1.0 | 4.2 |
| 2 Y | simpleIdentificationToysSet22AL | Objects | 591 | 401 | 52 | 47 | 8.8% | 1.2 | 1.0 | 0.6 |
| 2 Y | orderHrsAndMinutesSameHr | Time | 24 | 14 | 2 | 1 | 8.3% | 0.5 | 1.0 | 0.8 |
| 3 Y | matchCountAudio7To9 | Numbers | 23 | 9 | 6 | 2 | 26.1% | 8.0 | 1.7 | 9.8 |
| 3 Y | matchCountNumber1To3 | Numbers | 13 | 4 | 3 | 2 | 23.1% | 6.3 | 1.3 | 8.0 |
| 3 Y | countWithSingleStick1To3 | Numbers | 11 | 5 | 2 | 1 | 18.2% | 3.5 | 1.5 | 2.4 |
| 3 Y | stackRectangleAndTriangle | Geometry | 26 | 10 | 3 | 1 | 11.5% | 7.3 | 2.0 | 1.5 |
| 3 Y | simpleIdentificationFruitsSet3 | Objects | 45 | 27 | 5 | 3 | 11.1% | 4.4 | 1.4 | 0.9 |
| 3 Y | matchShapesByObjects2AL | Geometry | 36 | 29 | 4 | 4 | 11.1% | 4.5 | 1.0 | 2.6 |
| 3 Y | stackMultiStickInMultiSlot1To52AL | Numbers | 120 | 45 | 13 | 12 | 10.8% | 3.8 | 1.0 | 4.2 |
| 3 Y | stackVegetablesAndFruitsSet3 | Objects | 11 | 7 | 1 | 1 | 9.1% | 15.0 | 1.0 | 12.3 |
| 3 Y | matchNumberCount1to72AL | Numbers | 436 | 200 | 18 | 16 | 4.1% | 5.2 | 1.0 | 2.5 |
| 4 Y | matchBasicShapeTiles | Geometry | 45 | 14 | 8 | 4 | 17.8% | 4.3 | 1.4 | 3.7 |
| 4 Y | between0To20Transition | Numbers | 13 | 10 | 1 | 1 | 7.7% | 3.0 | 1.0 | 2.6 |
| 4 Y | mergeNumberUpTo9WithBAsTwoAL | Arithmetic | 100 | 40 | 6 | 5 | 6.0% | 4.3 | 1.0 | 3.6 |
| 4 Y | matchAudioByColorSet1 | Objects | 44 | 11 | 1 | 1 | 2.3% | 9.0 | 1.0 | 8.5 |
| 4 Y | orderUpToSevenNumber2AL | Numbers | 273 | 180 | 5 | 5 | 1.8% | 4.8 | 1.0 | 1.8 |
| 4 Y | matchActivitiesWithObject2AL | Objects | 142 | 39 | 2 | 2 | 1.4% | 9.0 | 1.0 | 6.0 |
| 5 Y | dataHandlingIconsBirdsAnimals2AL | Data Handling | 54 | 42 | 8 | 7 | 14.8% | 0.8 | 1.0 | 1.0 |
| 5 Y | smallBigUpTo50Number2AL | Arithmetic | 26 | 20 | 3 | 3 | 11.5% | 9.0 | 1.0 | 2.4 |
| 5 Y | matchEdgesCorners22AL | Geometry | 22 | 19 | 2 | 2 | 9.1% | 5.0 | 1.0 | 4.9 |
| 5 Y | subtractionMissingAUpTo20AL | Arithmetic | 95 | 61 | 8 | 6 | 8.4% | 3.1 | 1.0 | 3.6 |
| 5 Y | stackTensAndOnes20UpTo502AL | Numbers | 39 | 29 | 3 | 3 | 7.7% | 4.7 | 1.0 | 6.2 |
| 5 Y | orderUpToThreeNumber | Numbers | 14 | 7 | 1 | 1 | 7.1% | 3.0 | 1.0 | 2.1 |
| 5 Y | stackingDifferentPairsOfSameValue202AL | Arithmetic | 275 | 133 | 15 | 10 | 5.5% | 2.7 | 1.0 | 2.5 |
| 6 Y | matchTopBottomFirst | Geometry | 12 | 6 | 1 | 1 | 8.3% | 4.0 | 1.0 | 4.0 |
| 6 Y | smallBigFrom1To99NumbersAL | Numbers | 104 | 47 | 4 | 4 | 3.8% | 2.0 | 1.0 | 2.9 |
| 7 Y | numbersFrom500To999AL | Numbers | 53 | 9 | 2 | 2 | 3.8% | 9.0 | 1.0 | 3.7 |
| 8 Y | rotateObject1 | Algebra | 11 | 6 | 2 | 1 | 18.2% | 4.0 | 1.5 | 9.5 |
| 8 Y | grid4Row4Column | Arithmetic | 57 | 50 | 5 | 1 | 8.8% | 13.4 | 1.8 | 8.1 |
| 8 Y | arrangeLifeSpan | Time | 70 | 60 | 3 | 1 | 4.3% | 12.3 | 2.0 | 18.2 |
| 9 Y | — | — | — | — | — | — | 0% | — | — | — |
| 10 Y | matrixMultiplicationRandomNumbers3AL | Arithmetic | 36 | 16 | 2 | 2 | 5.6% | 34.0 | 1.0 | 18.9 |
| 10 Y | simpleIdentificationFruitsSet1 | Objects | 19 | 7 | 1 | 1 | 5.3% | 0.0 | 1.0 | 1.7 |
| 10 Y | matchObjectWithFraction1AL | Numbers | 331 | 166 | 9 | 7 | 2.7% | 3.4 | 1.0 | 2.6 |
| 10 Y | fractionMultiplication6AL | Numbers | 101 | 60 | 2 | 2 | 2.0% | 5.5 | 1.0 | 4.6 |

---

## Formal Failure Rates by Skill Age

| Age | Started | Pass | Fail | Fail% | Users w/Fail | Avg Wrong on Fail | Avg Wrong on Pass |
|---|---|---|---|---|---|---|---|
| 2 Y | 9,563 | 4,265 | 302 | 3.2% | 155 | 2.3 | — |
| 3 Y | 1,081 | 574 | 69 | 6.4% | 41 | 4.7 | — |
| 4 Y | 878 | 459 | 23 | 2.6% | 16 | 5.0 | — |
| 5 Y | 693 | 398 | 44 | 6.3% | 18 | 3.6 | — |
| 6 Y | 587 | 259 | 7 | 1.2% | 7 | 1.9 | — |
| 7 Y | 181 | 83 | 8 | 4.4% | 4 | 3.8 | — |
| **8 Y** | 2,364 | 2,139 | 16 | **0.7%** | 3 | 8.8 | — |
| 9 Y | 44 | 26 | 0 | **0%** | 0 | — | — |
| 10 Y | 1,851 | 886 | 18 | 1.0% | 13 | 6.8 | — |

**Observations:**
- **3 Y and 5 Y have the highest formal fail rates** (6.4% and 6.3%) — users at these ages are
  more likely to reach a scored wrong outcome than to abandon silently.
- **8 Y and 9 Y almost never formally fail** (0.7% / 0%) — content is well matched to ability.
- **2 Y has the most absolute failures (302)** due to sheer volume (9,563 starts), not rate.
- **Avg wrong on fail climbs with skill age** (2.3 at 2Y → 8.8 at 8Y) — older users persist
  longer before being scored wrong, indicating genuine engagement with hard content.

---

## Top Levels by Formal Fail% per Skill Age (min 10 starts, at least 1 failure)

### 2 Y

| Level | Branch | Started | Pass | Fail | Users | Fail% | AvgWrong(F) | AvgWrong(P) |
|---|---|---|---|---|---|---|---|---|
| zeroFromDifferentNumbers | Numbers | 10 | 3 | 2 | 1 | 20.0% | 0.0 | 0.3 |
| patternBasicFruits | Algebra | 12 | 2 | 2 | 1 | 16.7% | 4.5 | 10.0 |
| matchActivityWithTheirDuration1 | Time | 15 | 6 | 2 | 1 | 13.3% | 0.5 | 0.3 |
| matchThingsWithMoney2 | Money | 18 | 8 | 2 | 1 | 11.1% | 0.0 | 0.1 |
| stackVegetablesAndFruitsSet1 | Objects | 19 | 7 | 2 | 2 | 10.5% | 4.5 | 5.0 |
| **stackMultiStick1To52AL** | Numbers | 276 | 203 | **28** | **23** | 10.1% | 2.1 | 1.9 |
| sortBirdsAndAnimalsInsectsAquatic | Objects | 22 | 10 | 2 | 2 | 9.1% | 7.0 | 5.8 |
| calculateReachTime2 | Time | 11 | 6 | 1 | 1 | 9.1% | 1.0 | 4.2 |
| **simpleIdentificationToysSet22AL** | Objects | 591 | 401 | **52** | **47** | 8.8% | 1.2 | 0.6 |
| orderHrsAndMinutesSameHr | Time | 24 | 14 | 2 | 1 | 8.3% | 0.5 | 0.8 |

> **Note**: Most top-failure-rate rows at 2Y have only 1–2 users. The two high-volume failures
> (`simpleIdentificationToysSet22AL`: 52 fails / 47 users, `stackMultiStick1To52AL`: 28 fails / 23
> users) are the actionable items.

---

### 3 Y

| Level | Branch | Started | Pass | Fail | Users | Fail% | AvgWrong(F) | AvgAttempt(F) | AvgWrong(P) |
|---|---|---|---|---|---|---|---|---|---|
| **matchCountAudio7To9** | Numbers | 23 | 9 | 6 | 2 | 26.1% | 8.0 | 1.7 | 9.8 |
| **matchCountNumber1To3** | Numbers | 13 | 4 | 3 | 2 | 23.1% | 6.3 | 1.3 | 8.0 |
| countWithSingleStick1To3 | Numbers | 11 | 5 | 2 | 1 | 18.2% | 3.5 | 1.5 | 2.4 |
| stackRectangleAndTriangle | Geometry | 26 | 10 | 3 | 1 | 11.5% | 7.3 | 2.0 | 1.5 |
| simpleIdentificationFruitsSet3 | Objects | 45 | 27 | 5 | 3 | 11.1% | 4.4 | 1.4 | 0.9 |
| matchShapesByObjects2AL | Geometry | 36 | 29 | 4 | 4 | 11.1% | 4.5 | 1.0 | 2.6 |
| **stackMultiStickInMultiSlot1To52AL** | Numbers | 120 | 45 | 13 | 12 | 10.8% | 3.8 | 1.0 | 4.2 |
| stackVegetablesAndFruitsSet3 | Objects | 11 | 7 | 1 | 1 | 9.1% | 15.0 | 1.0 | 12.3 |
| **matchNumberCount1to72AL** | Numbers | 436 | 200 | 18 | 16 | 4.1% | 5.2 | 1.0 | 2.5 |

> `matchCountAudio7To9` and `matchCountNumber1To3` lead fail% (+20%). `stackRectangleAndTriangle`
> shows a retry signal (avg 2.0 attempts on fail) and `matchCountAudio7To9` at 1.7 attempts —
> users are persisting, which is positive engagement. `matchNumberCount1to72AL` has the highest
> absolute failures (18 fails, 16 users) at this age.

---

### 4 Y

| Level | Branch | Started | Pass | Fail | Users | Fail% | AvgWrong(F) | AvgAttempt(F) | AvgWrong(P) |
|---|---|---|---|---|---|---|---|---|---|
| **matchBasicShapeTiles** | Geometry | 45 | 14 | 8 | 4 | 17.8% | 4.3 | 1.4 | 3.7 |
| between0To20Transition | Numbers | 13 | 10 | 1 | 1 | 7.7% | 3.0 | 1.0 | 2.6 |
| **mergeNumberUpTo9WithBAsTwoAL** | Arithmetic | 100 | 40 | 6 | 5 | 6.0% | 4.3 | 1.0 | 3.6 |
| matchAudioByColorSet1 | Objects | 44 | 11 | 1 | 1 | 2.3% | 9.0 | 1.0 | 8.5 |
| **orderUpToSevenNumber2AL** | Numbers | 273 | 180 | 5 | 5 | 1.8% | 4.8 | 1.0 | 1.8 |
| matchActivitiesWithObject2AL | Objects | 142 | 39 | 2 | 2 | 1.4% | 9.0 | 1.0 | 6.0 |

> `matchBasicShapeTiles` stands out: 17.8% fail rate with avg 1.4 attempts on fail — users are
> retrying and still failing. Possible difficulty spike for 4Y geometry. `orderUpToSevenNumber2AL`
> has the highest absolute count (5 fails, 5 users) on 273 starts.

---

### 5 Y

| Level | Branch | Started | Pass | Fail | Users | Fail% | AvgWrong(F) | AvgAttempt(F) | AvgWrong(P) |
|---|---|---|---|---|---|---|---|---|---|
| **dataHandlingIconsBirdsAnimals2AL** | Data Handling | 54 | 42 | 8 | 7 | 14.8% | 0.8 | 1.0 | 1.0 |
| smallBigUpTo50Number2AL | Arithmetic | 26 | 20 | 3 | 3 | 11.5% | 9.0 | 1.0 | 2.4 |
| matchEdgesCorners22AL | Geometry | 22 | 19 | 2 | 2 | 9.1% | 5.0 | 1.0 | 4.9 |
| **subtractionMissingAUpTo20AL** | Arithmetic | 95 | 61 | 8 | 6 | 8.4% | 3.1 | 1.0 | 3.6 |
| stackTensAndOnes20UpTo502AL | Numbers | 39 | 29 | 3 | 3 | 7.7% | 4.7 | 1.0 | 6.2 |
| orderUpToThreeNumber | Numbers | 14 | 7 | 1 | 1 | 7.1% | 3.0 | 1.0 | 2.1 |
| **stackingDifferentPairsOfSameValue202AL** | Arithmetic | 275 | 133 | 15 | 10 | 5.5% | 2.7 | 1.0 | 2.5 |

> `dataHandlingIconsBirdsAnimals2AL` is notable: 14.8% fail rate but avg wrong on fail = 0.8
> (below 1) — users are failing almost immediately with near-zero wrong moves. This suggests a
> UI/interaction confusion rather than a concept difficulty. The level may have a control or
> layout issue. `subtractionMissingAUpTo20AL` (8 fails, 6 users on 95 starts) is the highest
> absolute failure volume.

---

### 6 Y

| Level | Branch | Started | Pass | Fail | Users | Fail% | AvgWrong(F) | AvgAttempt(F) | AvgWrong(P) |
|---|---|---|---|---|---|---|---|---|---|
| matchTopBottomFirst | Geometry | 12 | 6 | 1 | 1 | 8.3% | 4.0 | 1.0 | 4.0 |
| smallBigFrom1To99NumbersAL | Numbers | 104 | 47 | 4 | 4 | 3.8% | 2.0 | 1.0 | 2.9 |

> 6Y has very few formal failures overall. Only 2 levels qualify (min 10 starts, ≥1 fail). The
> dominant 6Y problem is drops (43.3% drop rate), not scored failures.

---

### 7 Y

| Level | Branch | Started | Pass | Fail | Users | Fail% | AvgWrong(F) | AvgAttempt(F) | AvgWrong(P) |
|---|---|---|---|---|---|---|---|---|---|
| numbersFrom500To999AL | Numbers | 53 | 9 | 2 | 2 | 3.8% | 9.0 | 1.0 | 3.7 |

> Only 1 level qualifies for 7Y. Formal failures are minimal — but this level's dominant problem
> is its 45.3% drop rate (24 drops on 53 starts). The 2 formal failures had avg 9 wrong moves
> vs only 3.7 for passes, confirming a real difficulty gap.

---

### 8 Y

| Level | Branch | Started | Pass | Fail | Users | Fail% | AvgWrong(F) | AvgAttempt(F) | AvgWrong(P) |
|---|---|---|---|---|---|---|---|---|---|
| **rotateObject1** | Algebra | 11 | 6 | 2 | 1 | 18.2% | 4.0 | 1.5 | 9.5 |
| **grid4Row4Column** | Arithmetic | 57 | 50 | 5 | 1 | 8.8% | **13.4** | **1.8** | 8.1 |
| **arrangeLifeSpan** | Time | 70 | 60 | 3 | 1 | 4.3% | **12.3** | **2.0** | 18.2 |

> Despite 8Y having the healthiest overall profile, these 3 levels show concentrated difficulty.
> `grid4Row4Column`: avg **13.4 wrong moves on fail** with **1.8 attempts** — the single user
> who fails this is genuinely grinding through repeated wrong answers across multiple retries.
> `arrangeLifeSpan`: avg **12.3 wrong moves** and **2.0 attempts** — same pattern. These are
> legitimate hard-content cases, not routing errors.

---

### 9 Y

> **No formal failures** recorded in the 60-day window (9Y had 44 total starts, all outcomes
> were either pass or drop).

---

### 10 Y

| Level | Branch | Started | Pass | Fail | Users | Fail% | AvgWrong(F) | AvgAttempt(F) | AvgWrong(P) |
|---|---|---|---|---|---|---|---|---|---|
| matrixMultiplicationRandomNumbers3AL | Arithmetic | 36 | 16 | 2 | 2 | 5.6% | **34.0** | 1.0 | 18.9 |
| simpleIdentificationFruitsSet1 | Objects | 19 | 7 | 1 | 1 | 5.3% | 0.0 | 1.0 | 1.7 |
| **matchObjectWithFraction1AL** | Numbers | 331 | 166 | 9 | 7 | 2.7% | 3.4 | 1.0 | 2.6 |
| fractionMultiplication6AL | Numbers | 101 | 60 | 2 | 2 | 2.0% | 5.5 | 1.0 | 4.6 |

> `matrixMultiplicationRandomNumbers3AL` is the most extreme case in the entire dataset: avg
> **34 wrong moves on fail** (vs 18.9 on pass). Users who fail this level are making enormous
> numbers of errors — the level is genuinely hard and likely requires a progressive difficulty
> reduction or hint system. `matchObjectWithFraction1AL` has the highest absolute failure count
> at 10Y (9 fails, 7 users on 331 starts).

---

## Cross-Cutting Findings

### Avg wrong moves on fail — interpretation guide

| Range | Interpretation | Example |
|---|---|---|
| < 1 | UI confusion — user fails before interacting meaningfully | 5Y `dataHandlingIconsBirdsAnimals2AL` (0.8) |
| 1–4 | Concept gap — user understands the mechanic but gets the answer wrong | Most 2Y–5Y levels |
| 5–10 | Moderate difficulty — user persists before failing | 3Y `matchCountAudio7To9` (8.0), 7Y `numbersFrom500To999AL` (9.0) |
| > 10 | Severe difficulty — user grinds through many wrong moves | 8Y `grid4Row4Column` (13.4), 8Y `arrangeLifeSpan` (12.3), 10Y matrix (34.0) |

### Retry signal (AvgAttempt on fail > 1.0)

Levels where users fail multiple times (i.e., attempt 2+ ): these users are engaged and trying,
not bouncing. These are candidates for hints or scaffolding rather than removal.

| Level | Age | AvgAttempt(F) | AvgWrong(F) | Signal |
|---|---|---|---|---|
| stackRectangleAndTriangle | 3 Y | 2.0 | 7.3 | Persistent, genuinely hard |
| matchCountAudio7To9 | 3 Y | 1.7 | 8.0 | Persistent, genuinely hard |
| matchBasicShapeTiles | 4 Y | 1.4 | 4.3 | Retry with moderate difficulty |
| matchCountNumber1To3 | 3 Y | 1.3 | 6.3 | Retry with high wrong count |
| rotateObject1 | 8 Y | 1.5 | 4.0 | Retry — spatial reasoning gap |
| grid4Row4Column | 8 Y | 1.8 | 13.4 | High persistence, extreme difficulty |
| arrangeLifeSpan | 8 Y | 2.0 | 12.3 | Highest retry at 8Y — time ordering |

### Levels with near-zero wrong on fail (UI / mechanic confusion)

These users fail without making meaningful wrong-move attempts — the scoring mechanic or UI may
be confusing rather than the concept being hard.

| Level | Age | AvgWrong(F) | Fail | Notes |
|---|---|---|---|---|
| zeroFromDifferentNumbers | 2 Y | 0.0 | 2 | Possibly triggers fail on first interaction |
| matchThingsWithMoney2 | 2 Y | 0.0 | 2 | Same pattern |
| simpleIdentificationFruitsSet1 | 10 Y | 0.0 | 1 | Wrong user routing (10Y getting beginner content) |
| dataHandlingIconsBirdsAnimals2AL | 5 Y | 0.8 | 8 | Highest-volume UI confusion case — 7 users |

---

## Comparison: Failures vs. Drops

| | Formal Failures | Drops |
|---|---|---|
| **Total** | ~487 scored wrong outcomes | ~6,325 silent abandonments |
| **Rate** | 0.7–6.4% across ages | 5.2–44.4% across ages |
| **Worst age (rate)** | 3 Y and 5 Y (~6%) | 2 Y (44.4%) and 6 Y (43.3%) |
| **Worst age (volume)** | 2 Y (302 fails) | 2 Y (4,248 drops) |
| **Churn driver?** | Minor — users who fail sometimes retry | Major — silent exit with no re-engagement |
| **Fix** | Hints, scaffolding, difficulty tuning | Content routing fix, onboarding clarity |

**Conclusion**: Formal failures are a secondary signal. They point to specific levels with genuine
difficulty (candidates for hints or tuning), not a systemic content problem. The systemic problem
is drops — users never reaching a scored outcome at all.
