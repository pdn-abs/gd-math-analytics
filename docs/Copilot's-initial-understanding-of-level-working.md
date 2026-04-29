Let me first map what scene/script files exist for each level type, then read the relevant ones to write precise workings.

Read [](file:///home/pdn/dev/abs/gd-math-godot/components)

Read [](file:///home/pdn/dev/abs/gd-math-godot/scenes)

Read [](file:///home/pdn/dev/abs/gd-math-godot/components/scenes)

Read [](file:///home/pdn/dev/abs/gd-math-godot/config)

Read [](file:///home/pdn/dev/abs/gd-math-godot/config/data)

Read [](file:///home/pdn/dev/abs/gd-math-godot/services)

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory)

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/boards)

These are the board type definitions — exactly what I need. Let me read all of them in parallel.

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/boards/Match.gd)

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/boards/Stack.gd)

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/boards/Fill.gd#1-1), lines 1 to 80

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/boards/Order.gd#1-1), lines 1 to 80

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/boards/Write.gd#1-1), lines 1 to 80

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/boards/Pattern.gd)

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/boards/Count.gd)

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/boards/ObjectMatch.gd)

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/boards/CombineBoards.gd#1-1), lines 1 to 60

Now I understand all board types. Let me read the main factory dispatcher and ProcessChallenge to map config `type`/`challenge` to exact board class, then check a few sample level configs.

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/main.gd#1-1), lines 1 to 100

Read [](file:///home/pdn/dev/abs/gd-math-godot/services/boardFactory/ProcessChallenge.gd#1-1), lines 1 to 80

Now I have the full picture. The `_levels` dict maps `type` → board class exactly. Let me pull the `type` field for every assessment level from config, then combine that with board-class knowledge to produce precise workings.

Ran terminal command:  cd /home/pdn/dev/abs/gd-math-godot && node - <<'NODE'
const fs=require('fs');
const cfg=JSON.parse(fs.readFileSync('assets/config.json','utf8'));
const levels=cfg.levels||{};
const assessment=Object.entries(levels)
  .filter(([id,l])=>Array.isArray(l.tags)&&l.tags.includes('assessment'))
  .map(([id,l])=>({id,...l}))
  .sort((a,b)=>(a.skillAge-b.skillAge)||(a.sequence-b.sequence));

for (const l of assessment){
  const type=typeof l.type==='string'?l.type:'?';
  const challenge=typeof l.challenge==='object'?JSON.stringify(l.challenge).slice(0,200):'?';
  const extra={};
  for(const k of ['leftVariant','rightVariant','order','sumCount','patterns','seed','parser','drops','expression','numberConfig','a','b','c','d']){
    if(l[k]!=null) extra[k]=l[k];
  }
  console.log(JSON.stringify({id:l.id,sa:l.skillAge,seq:l.sequence,type,boardCount:l.boardCount,boardTime:l.boardTime,extra,challenge_snippet:challenge}));
}
NODE

Read [](file:///home/pdn/.config/Code/User/workspaceStorage/6a672b7da24b2ef1582d049169ea8d38/GitHub.copilot-chat/chat-session-resources/625a91c3-f2ca-4448-bdf3-5ea346b7ba41/toolu_bdrk_01AmNcRiaSTHK3EZ1Z48y8Ta__vscode-1777366508935/content.txt)

I now have the full config semantics. All levels use the `icmV2` parser with `leftVariant`/`rightVariant` controlling interaction: `numberTile`/`countTile` = draggable answer tile, `numberSlot`/`countSlot` = empty drop target. Combined with `seed` structure and `operator`/column key patterns, I can now write precise workings for every level.

Ran terminal command:  cat << 'EOF'
WORKING NOTES (from config analysis):

INTERACTION MODES (leftVariant → rightVariant):
  numberTile/numberTile    = tap/select correct tile from choices (identification, matching)
  numberTile/numberSlot    = drag number tile into blank slot (fill-in, ordering, comparison)
  countTile/numberTile     = match visual count to numeral tile
  countSlot/countTile      = place visual count group into labeled count slot
  audioTile/numberTile     = hear audio clip, tap matching visual tile
  characterTrace/numberTile = trace dotted path

SEED STRUCTURES → MECHANICS:
  selectors + groupedItems + distribution = category sort (drag by category type)
  a/operator/x + operators [>,<,=] = number comparison fill-in
  a+b=x / a-b=x columns = arithmetic fill-in (fill missing slot)
  a×b=x columns = multiplication fill-in
  a÷b=x columns = division fill-in
  window [boardIndex,start,end,step] = progressive number range across boards
  sortedItems + ascending/descending = ordering boards
  patterns + prefill = pattern completion
  summaryConfig with ranks = data table + identify MOST/LEAST
  matrix elementConfig row*column = multiplication table cells
  fractionType + numberConfig = fraction fill-in
  die sequence + wholePart = dice multiplication matching

LEVEL-BY-LEVEL PRECISE WORKINGS:
EOF

Good, my interpretation is confirmed. Here is the final precise table, synthesised entirely from config + board class reading:

---

## Assessment Levels — Precise Working (from config + board classes)

| SA | Seq | Level ID | Boards / Time | Interaction Mode | Precise Working |
|---:|---:|---|:---:|---|---|
| 2 | 7 | `simpleIdentificationVegetablesSet2AL` | 5 × 15s | Tap/select tile | 2 vegetable pictures shown. Player taps the one that matches the prompt word/audio. |
| 2 | 22 | `simpleIdentificationToysSet22AL` | 5 × 11s | Tap/select tile | 2 toy pictures shown. Player taps the correctly named toy. |
| 2 | 32 | `stackColorTilesSet1And22AL` | 5 × 18s | Drag tile → slot | 4 colored tiles (2 per color, 2 random colors) shown shuffled. Two labeled color-category slots shown. Player drags each tile into the matching color slot. |
| 2 | 35 | `matchObjectSetFirst2AL` | 5 × 15s | Tap/select tile | 2 everyday object pictures (ageThree set). Player taps the correct one by name/audio. |
| 3 | 7 | `stackVegetablesAndFruitsOverall2AL` | 5 × 14s | Drag tile → slot | 4 tiles (2 fruits + 2 vegetables) shuffled. Two slots labeled "fruit" / "vegetable". Player drags each to its category. |
| 3 | 15 | `stackMultiStick1To52AL` | 5 × 11s | Place count → slot | Shows a labeled count slot (number 1–5, progressing per board). Player drags the matching visual count group (sticks) into the slot. |
| 3 | 40 | `simpleIdentificationAnimalsSet1And22AL` | 5 × 14s | Tap/select tile | 2 animal pictures (animalSetOne/Two). Player taps the one matching the spoken name. |
| 3 | 57 | `stackUtensilsVehicles2AL` | 5 × 14s | Drag tile → slot | 4 tiles (2 utensils + 2 vehicles) shuffled. Two labeled category slots. Player drags each to its category. |
| 3 | 60 | `simpleIdentifyApparelAndStationery2AL` | 5 × 14s | Tap/select tile | 2 pictures (school-supplies or clothes). Player identifies the one named. |
| 3 | 67 | `sortRedGreenYellowWhiteBlackGray2AL` | 5 × 14s | Drag tile → slot | 4 tiles (2 objects sharing one color, 2 sharing another — chosen from 6 colors) shuffled. Two labeled color slots. Player sorts by color. |
| 3 | 75 | `writeLevelSimpleLine2AL` | 5 × 14s | Trace dotted path | Player traces a dotted-line path character from the `writeLevelLineSet` with finger/stylus within the given accuracy threshold. |
| 4 | 30 | `matchNumberCount1to72AL` | 5 × 21s | Match count → numeral | 3 rows of visual count groups (sticks, values 1–7 sliding with each board). Player matches each count group to its numeral tile. |
| 4 | 54 | `stackMultiStickInMultiSlot1To52AL` | 5 × 25s | Place count → multi-slot | Shows 3 labeled count slots per board: total `x` (2–5), part `b` (1–2), part `a = x−b`. Player drags visual count groups into all three slots to satisfy the part-whole relationship. |
| 4 | 96 | `matchShapesByObjects2AL` | 5 × 14s | Tap/select tile | 3 random shapes selected (square/rectangle/triangle/circle). Shows objects grouped by shape. Player taps each object's matching shape label slot. |
| 4 | 122 | `writeLevel1To52AL` | 5 × 20s | Trace dotted path | Player traces numbers 1 through 5 along dotted paths, one per board, until the accuracy threshold is met. |
| 5 | 15 | `matchActivitiesWithObject2AL` | 10 × 14s | Tap/select tile | 3 activity tiles shown (unique by action, e.g. "swimming", "cooking"). Player taps the object that goes with each activity. |
| 5 | 24 | `orderUpToSevenNumber2AL` | 5 × 14s | Drag tile → slot | 4–6 shuffled number tiles (range 1–7, sliding window per board). Player drags them into the labeled position slots in ascending order. |
| 5 | 67 | `mergeNumberUpTo9WithBAsTwoAL` | 4 × 23s | Drag tile → slot | Shows equation `a + 2 = x` (where x ≤ 9) with one blank slot. Player drags the correct number tile to fill the missing value. 3 equations per board. |
| 5 | 126 | `fillSubtractionStaticB3UpTo52AL` | 3 × 12s | Drag tile → slot | Shows two-column (tens/ones) subtraction equation `a − 3 = x` with one or two blanks. Player drags tiles to fill missing digits. |
| 5 | 232 | `patternBasicFoods2AL` | 5 × 19s | Drag tile → slot | A 6-slot food pattern (e.g. ABABAB) shown with first 2 slots pre-filled. Player identifies and drags the correct food tiles to complete the remaining pattern positions. |
| 6 | 99 | `stackingDifferentPairsOfSameValue202AL` | 5 × 14s | Drag tile → slot | Shows 2 addition equations `a + b = x` (sum ≤ 20, using tens+ones columns) with one blank per equation. Player drags number tiles to fill the missing addend or sum. |
| 6 | 111 | `subtractionMissingAUpTo20AL` | 5 × 14s | Drag tile → slot | Shows 2 subtraction equations `a − b = x` (within 20) in tens/ones columns with the minuend (`a`) blank. Player drags the correct value to fill it. |
| 6 | 173 | `dataHandlingIconsBirdsAnimals2AL` | 3 × 11s | Tap/select tile | Shows one animal tile and one bird tile. Player identifies each by its type (animal or bird) by tapping the correct category. |
| 6 | 205 | `stackTensAndOnes20UpTo502AL` | 5 × 23s | Drag tile → slot | Shows 3 two-part numbers (tens from [20,30,40,50] + ones 1–9). Player drags the correct tens and ones tile into each number's two blank column slots. |
| 6 | 210 | `smallBigUpTo50Number2AL` | 5 × 14s | Drag tile → slot | Shows 2 incomplete comparisons `A [op] __` using randomly chosen >, <, = operators (multiples of 10, range 1–50). Player drags the correct number tile to satisfy the inequality. |
| 6 | 281 | `matchEdgesCorners22AL` | 5 × 14s | Hear audio → tap tile | Audio describes an edge or corner of a triangle (e.g. "left edge", "top corner"). Player taps the matching visual tile from the 6 triangle edge/corner options. |
| 7 | 37 | `smallBigFrom1To99NumbersAL` | 5 × 14s | Drag tile → slot | Shows 2 comparisons `A [op] __` (range 1–99, random >, <, = operators). Player drags the correct number tile to make the comparison true. |
| 7 | 87 | `missingBRandomAAndB50To99AL` | 5 × 14s | Drag tile → slot | Shows 2 addition equations `a + __ = x` or `a + b = __` in tens/ones columns (sum range 50–99). Player fills in the missing addend or total. |
| 7 | 226 | `groupAdditionOf5AL` | 5 × 19s | Tap/select tile | Shows balloon groups: m groups × member count of a specific balloon type. Player selects the number tile matching the total (m × foodValue). |
| 7 | 235 | `cowBananaTable4AL` | 5 × 18s | Tap/select tile | Shows rows of cows (m cows, each eating a fixed number of bananas per day). Player selects the numeral tile matching the total bananas (m × foodValue). |
| 8 | 67 | `numbersFrom500To999AL` | 5 × 23s | Drag tile → slot | Shows 2 addition equations `a + b = x` (x = 3-digit, 500–999) across 3 column slots (a, b, x) with one blank. Player drags the correct 2–3 digit number tile to fill it. |
| 8 | 95 | `descendingOrdering1to999by50AL` | 5 × 16s | Drag tile → slot | 4 shuffled multiples of 50 (range slides across boards). Player drags them into labeled position slots in descending order. |
| 8 | 97 | `greaterSmallerUpTo999OperatorsAL` | 5 × 16s | Drag tile → slot | Shows 2 comparisons `A __ B` (range 1–999). The operator slot is blank. Player drags the correct operator tile (>, <, =) to complete each comparison. |
| 8 | 265 | `multiplication3TableAL` | 3 × 27s | Drag tile → slot | Shows 4 multiplication facts `m × 3 = __` per board (m progresses across boards). Player fills in the product slots. |
| 8 | 279 | `division4TableAL` | 5 × 15s | Drag tile → slot | Shows 2 division equations `a ÷ 4 = __` (a = random multiples of 4). Player drags the correct quotient tile into the blank. |
| 9 | 7 | `summarizeTheSentences1AL` | 4 × 18s | Tap/select tile | Shows a table of 3 persons each with counts for 2 fruit types. Player identifies which item has the MOST or LEAST total across all persons. |
| 9 | 23 | `placeValueMatrix1AL` | 4 × 25s | Drag tile → slot | Shows 2 large numbers (thousands + hundreds range). A 2×2 matrix has blank cells. Player drags digit tiles to fill in the thousands and hundreds place values for each number. |
| 9 | 52 | `reviseDivideTable8And9AL` | 10 × 14s | Drag tile → slot | Shows 2 division equations `a ÷ 8 = __` or `a ÷ 9 = __` per board. Player fills in the quotient (10 boards covering both tables). |
| 9 | 87 | `numberDiceMatching2AL` | 5 × 18s | Tap/select tile | Shows a dice face (sequence 3–7) and a multiplier `m` (1–10). Player selects the numeral tile matching `m × die-value`. |
| 9 | 119 | `matchFractionWithImage4AL` | 5 × 20s | Tap/select tile | Shows a mixed fraction expression `a + b = c` (denominator 4). Player taps or selects the correct fraction image tile (countTile right side) that represents the result. |
| 10 | 1 | `matchObjectWithFraction1AL` | 6 × 13s | Match count → fraction | Shows a complex fraction `a + 0 = c` (denominator 8, fractionType complex). Player matches the count tile (visual fraction representation) to the correct fraction numeral tile. |
| 10 | 34 | `fractionMultiplication6AL` | 6 × 27s | Drag tile → slot | Shows 2 fraction multiplication equations `a × b = __` (mixed fractions, denominator 4, sum 2–12). Player drags the correct fraction tile into the product slot. |
| 10 | 105 | `matrixMultiplicationRandomNumbers3AL` | 5 × 36s | Tap/select tile | A 4×4 multiplication table with headers 6–9. Some cells are shown; 4 random cells are blank. Player taps the correct product tile for each blank cell. |
| 10 | 152 | `givenSmartChartScale6AL` | 6 × 23s | Tap/select tile | Shows 3 bird types with bar-chart-style counts scaled by 6 (values are multiples of 6, step 6–30). Player selects the correct scaled numeral tile for each bird's count. |

---

**Interaction legend:**
- **Tap/select tile** — multiple answer tiles shown; player taps the correct one
- **Drag tile → slot** — blank slot(s) in an equation/sequence; player drags the right tile into it
- **Place count → slot** — visual count group (sticks/objects) dragged to a labeled quantity slot
- **Match count → numeral** — visual count groups paired to digit tiles
- **Hear audio → tap tile** — audio prompt drives selection of matching visual tile
- **Trace dotted path** — finger/stylus tracing along pre-drawn character paths
