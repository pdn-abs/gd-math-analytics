# Assessment Levels — Precise Working

Source: `assets/config.json` + `services/boardFactory/boards/` scripts.
Generated: 2026-04-28

## Interaction Legend

| Mode | Description |
|---|---|
| **Match: drag left → right pair** | 4 or 6 tiles shown (2 or 3 per side). Player drags each left tile to its matching pair on the right. |
| **Drag tile → slot** | Blank slot(s) in an equation/sequence; player drags the right tile into it |
| **Merge tile → slot (unique)** | User overlaps two movable tiles to create a summed tile, then drags that merged result into a target slot. |
| **Place count → slot** | Visual count group (sticks/objects) dragged to a labeled quantity slot |
| **Match count → numeral** | Visual count groups paired to digit tiles |
| **Hear audio → tap tile** | Audio prompt drives selection of matching visual tile |
| **Trace dotted path** | Finger/stylus tracing along pre-drawn character paths |

## Interaction Mode Mapping (leftVariant → rightVariant)

| Left | Right | Player Action |
|---|---|---|
| `numberTile` | `numberTile` | Drag left tile to its matching pair on the right |
| `numberTile` | `numberSlot` | Drag number tile into blank slot |
| `countTile` | `numberTile` | Match visual count to numeral tile |
| `countSlot` | `countTile` | Place visual count group into labeled count slot |
| `audioTile` | `numberTile` | Hear audio clip, tap matching visual tile |
| `characterTrace` | `numberTile` | Trace dotted path |

---

## All 44 Assessment Levels

| SA | Seq | Level ID | Boards × Time | Interaction Mode | Precise Working |
|---:|---:|---|:---:|---|---|
| 2 | 7 | `simpleIdentificationVegetablesSet2AL` | 5 × 15s | Match: drag left → right pair | 4 vegetable picture tiles shown: 2 on the left, 2 on the right. Player drags each left tile to its matching pair on the right. |
| 2 | 22 | `simpleIdentificationToysSet22AL` | 5 × 11s | Match: drag left → right pair | 4 toy picture tiles shown: 2 on the left, 2 on the right. Player drags each left tile to its matching pair on the right. |
| 2 | 32 | `stackColorTilesSet1And22AL` | 5 × 18s | Drag tile → slot | 4 colored tiles (2 per color, 2 random colors) shown shuffled. Two labeled color-category slots shown. Player drags each tile into the matching color slot. |
| 2 | 35 | `matchObjectSetFirst2AL` | 5 × 15s | Match: drag left → right pair | 4 everyday object tiles (ageThree set): 2 on the left, 2 on the right. Player drags each left tile to its matching pair on the right. |
| 3 | 7 | `stackVegetablesAndFruitsOverall2AL` | 5 × 14s | Drag tile → slot | 4 tiles (2 fruits + 2 vegetables) shuffled. Two slots labeled "fruit" / "vegetable". Player drags each to its category. |
| 3 | 15 | `stackMultiStick1To52AL` | 5 × 11s | Place count → slot | Shows a labeled count slot (number 1–5, progressing per board). Player drags the matching visual count group (sticks) into the slot. |
| 3 | 40 | `simpleIdentificationAnimalsSet1And22AL` | 5 × 14s | Match: drag left → right pair | 4 animal picture tiles (animalSetOne/Two): 2 on the left, 2 on the right. Player drags each left tile to its matching pair on the right. |
| 3 | 57 | `stackUtensilsVehicles2AL` | 5 × 14s | Drag tile → slot | 4 tiles (2 utensils + 2 vehicles) shuffled. Two labeled category slots. Player drags each to its category. |
| 3 | 60 | `simpleIdentifyApparelAndStationery2AL` | 5 × 14s | Match: drag left → right pair | 4 picture tiles (school-supplies or clothes): 2 on the left, 2 on the right. Player drags each left tile to its matching pair on the right. |
| 3 | 67 | `sortRedGreenYellowWhiteBlackGray2AL` | 5 × 14s | Drag tile → slot | 4 tiles (2 objects per color, 2 random colors from 6) shuffled. Two labeled color slots. Player sorts by color. |
| 3 | 75 | `writeLevelSimpleLine2AL` | 5 × 14s | Trace dotted path | Player traces a dotted-line path character from the `writeLevelLineSet` with finger/stylus. |
| 4 | 30 | `matchNumberCount1to72AL` | 5 × 21s | Match count → numeral | 3 rows of visual count groups (sticks, values 1–7 sliding window per board). Player matches each count group to its numeral tile. |
| 4 | 54 | `stackMultiStickInMultiSlot1To52AL` | 5 × 25s | Place count → slot | Shows 3 labeled count slots per board: total `x` (2–5), part `b` (1–2), part `a = x−b`. Player drags visual count groups into all three slots to satisfy the part-whole relationship. |
| 4 | 96 | `matchShapesByObjects2AL` | 5 × 14s | Match: drag left → right pair | 6 tiles shown (3 shapes selected from square/rectangle/triangle/circle): 3 shape-label tiles on the left, 3 corresponding shape-object tiles on the right. Player drags each left shape tile to its matching right object tile. |
| 4 | 122 | `writeLevel1To52AL` | 5 × 20s | Trace dotted path | Player traces digits 1–5 along dotted paths, one numeral per board. |
| 5 | 15 | `matchActivitiesWithObject2AL` | 10 × 14s | Match: drag left → right pair | 6 tiles shown (3 activity pairs): 3 activity-label tiles on the left, 3 matching activity-object tiles on the right. Player drags each left activity tile to its matching right object tile. |
| 5 | 24 | `orderUpToSevenNumber2AL` | 5 × 14s | Drag tile → slot | 4–6 shuffled number tiles (range 1–7, sliding window per board). Player drags them into labeled position slots in ascending order. |
| 5 | 67 | `mergeNumberUpTo9WithBAsTwoAL` | 4 × 23s | Merge tile → slot (unique) | Left side has 2 columns × 3 rows of movable number tiles: first column uses number tiles (1–7 windowed by board), second column uses only number-2 tiles. Player drags a number tile over a 2-tile to merge them; the tile value adds and a sum tile is formed. Player then drags the sum tile into the target slot(s), which show the silhouette of the required sum number. |
| 5 | 126 | `fillSubtractionStaticB3UpTo52AL` | 3 × 12s | Drag tile → slot | Shows two-column (tens/ones) subtraction `a − 3 = x` with one or two blanks. Player drags tiles to fill missing digits. |
| 5 | 232 | `patternBasicFoods2AL` | 5 × 19s | Drag tile → slot | A 6-slot food pattern (e.g. ABABAB, BAABAA) shown with first 2 slots pre-filled. Player drags correct food tiles to complete the remaining slots. |
| 6 | 99 | `stackingDifferentPairsOfSameValue202AL` | 5 × 14s | Drag tile → slot | Shows 2 addition equations `a + b = x` (sum ≤ 20, tens+ones columns) with one blank each. Player drags number tiles to fill the missing addend or sum. |
| 6 | 111 | `subtractionMissingAUpTo20AL` | 5 × 14s | Drag tile → slot | Shows 2 subtraction equations `a − b = x` (within 20, tens/ones columns) with the minuend `a` blank. Player drags the correct value to fill it. |
| 6 | 173 | `dataHandlingIconsBirdsAnimals2AL` | 3 × 11s | Match: drag left → right pair | 4 tiles shown (1 animal, 1 bird per side): 2 object tiles on the left, 2 category-label tiles on the right. Player drags each left object tile to its matching right category tile. |
| 6 | 205 | `stackTensAndOnes20UpTo502AL` | 5 × 23s | Drag tile → slot | Shows 3 composite numbers (tens from [20,30,40,50] + ones 1–9). Player drags the correct tens and ones digit tiles into each number's two blank column slots. |
| 6 | 210 | `smallBigUpTo50Number2AL` | 5 × 14s | Drag tile → slot | Shows 2 incomplete comparisons `A [op] __` (multiples of 10, range 10–50, operators >, <, =). Player drags the correct number tile to satisfy the comparison. |
| 6 | 281 | `matchEdgesCorners22AL` | 5 × 14s | Hear audio → tap tile | Audio describes an edge or corner of a triangle (e.g. "left edge", "top corner"). Player taps the matching visual tile from 6 triangle edge/corner options. |
| 7 | 37 | `smallBigFrom1To99NumbersAL` | 5 × 14s | Drag tile → slot | Shows 2 comparisons `A [op] __` (range 1–99, random >, <, = operators). Player drags the correct number tile to make each comparison true. |
| 7 | 87 | `missingBRandomAAndB50To99AL` | 5 × 14s | Drag tile → slot | Shows 2 addition equations `a + __ = x` or `a + b = __` in tens/ones columns (sum range 50–99). Player fills the missing addend or total. |
| 7 | 226 | `groupAdditionOf5AL` | 5 × 19s | Match: drag left → right pair | 6 tiles shown (3 rows): 3 balloon-group picture tiles on the left, 3 numeral tiles on the right. Player drags each balloon-group tile to the numeral matching its total (`m × foodValue`). |
| 7 | 235 | `cowBananaTable4AL` | 5 × 18s | Match: drag left → right pair | 4 tiles shown (2 rows): 2 cow-group picture tiles on the left, 2 numeral tiles on the right. Player drags each cow-group tile to the numeral matching its total bananas (`m × foodValue`). |
| 8 | 67 | `numbersFrom500To999AL` | 5 × 23s | Drag tile → slot | Shows 2 addition equations `a + b = x` (x = 500–999, 3-column layout) with one blank each. Player drags the correct 2–3 digit number tile to fill it. |
| 8 | 95 | `descendingOrdering1to999by50AL` | 5 × 16s | Drag tile → slot | 4 shuffled multiples of 50 (sliding range across boards). Player drags them into labeled position slots in descending order. |
| 8 | 97 | `greaterSmallerUpTo999OperatorsAL` | 5 × 16s | Drag tile → slot | Shows 2 comparisons `A __ B` (range 1–999). Operator slot is blank. Player drags the correct operator tile (>, <, =) to complete each comparison. |
| 8 | 265 | `multiplication3TableAL` | 3 × 27s | Drag tile → slot | Shows 4 multiplication facts `m × 3 = __` per board (m = 1–12 in windows of 4). Player fills in the product slots. |
| 8 | 279 | `division4TableAL` | 5 × 15s | Drag tile → slot | Shows 2 division equations `a ÷ 4 = __` per board (a = random multiples of 4, 1–10). Player drags the correct quotient tile into the blank. |
| 9 | 7 | `summarizeTheSentences1AL` | 4 × 18s | Match: drag left → right pair | 4 tiles shown (2 rows): a tally table of 3 persons × 2 fruit types is shown. 2 rank-label tiles on the left (MOST, LEAST), 2 fruit-name tiles on the right. Player drags each rank tile to the correct fruit. |
| 9 | 23 | `placeValueMatrix1AL` | 4 × 25s | Drag tile → slot | Shows 2 large numbers (thousands–hundreds range). A 2×2 grid has blank cells for thousands and hundreds place. Player drags the correct digit tiles to fill each cell. |
| 9 | 52 | `reviseDivideTable8And9AL` | 10 × 14s | Drag tile → slot | Shows 2 division equations `a ÷ 8 = __` or `a ÷ 9 = __` per board. Player fills in the quotient (10 boards covering both divisor tables). |
| 9 | 87 | `numberDiceMatching2AL` | 5 × 18s | Match: drag left → right pair | 4 tiles shown (2 rows): 2 die-face picture tiles on the left (die faces 3–7, each paired with multiplier `m`), 2 product numeral tiles on the right. Player drags each die tile to the numeral matching `m × die-face-value`. |
| 9 | 119 | `matchFractionWithImage4AL` | 5 × 20s | Match: drag left → right pair | Fraction pairs shown (denominator 4): fraction notation tiles on the left, visual fraction image tiles on the right. Player drags each fraction notation tile to its matching image tile. |
| 10 | 1 | `matchObjectWithFraction1AL` | 6 × 13s | Match: drag left → right pair | Fraction pairs shown (denominator 8): visual fraction image tiles (countTile) on the left, fraction notation numeral tiles on the right. Player drags each image tile to its matching fraction notation. |
| 10 | 34 | `fractionMultiplication6AL` | 6 × 27s | Drag tile → slot | Shows 2 fraction multiplication equations `a × b = __` (mixed fractions, denominator 4, result 2–12) per board. Player drags the correct fraction tile into the product slot. |
| 10 | 105 | `matrixMultiplicationRandomNumbers3AL` | 5 × 36s | Match: drag left → right pair | A 4×4 multiplication grid (row/column headers from [6,7,8,9]). 4 random cells are blank tile slots. Product numeral tiles shown separately. Player drags each product tile to its correct cell in the grid. |
| 10 | 152 | `givenSmartChartScale6AL` | 6 × 23s | Match: drag left → right pair | 6 tiles shown (3 rows): 3 bird-type picture tiles on the left with bar-chart counts (multiples of 6, scale 6–30), 3 scaled-numeral tiles on the right. Player drags each bird tile to its correct count value. |
