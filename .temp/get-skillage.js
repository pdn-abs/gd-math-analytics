const config = require('/home/pdn/dev/abs/gd-math-godot/assets/config.json');
const levels = config.levels;

const alLevels = [
  'simpleIdentificationVegetablesSet2AL','simpleIdentificationToysSet22AL','stackVegetablesAndFruitsOverall2AL',
  'stackColorTilesSet1And22AL','matchNumberCount1to72AL','matchObjectWithFraction1AL',
  'matchObjectSetFirst2AL','stackMultiStick1To52AL','simpleIdentificationAnimalsSet1And22AL',
  'orderUpToSevenNumber2AL','stackingDifferentPairsOfSameValue202AL','stackUtensilsVehicles2AL',
  'stackMultiStickInMultiSlot1To52AL','matchActivitiesWithObject2AL','mergeNumberUpTo9WithBAsTwoAL',
  'fractionMultiplication6AL','simpleIdentifyApparelAndStationery2AL','smallBigFrom1To99NumbersAL',
  'subtractionMissingAUpTo20AL','sortRedGreenYellowWhiteBlackGray2AL','numbersFrom500To999AL',
  'matrixMultiplicationRandomNumbers3AL','writeLevelSimpleLine2AL','matchShapesByObjects2AL',
  'summarizeTheSentences1AL','dataHandlingIconsBirdsAnimals2AL','writeLevel1To52AL',
  'missingBRandomAAndB50To99AL','stackTensAndOnes20UpTo502AL','smallBigUpTo50Number2AL',
  'matchEdgesCorners22AL','fillSubtractionStaticB3UpTo52AL','placeValueMatrix1AL',
  'reviseDivideTable8And9AL','givenSmartChartScale6AL','groupAdditionOf5AL',
  'patternBasicFoods2AL','cowBananaTable4AL','numberDiceMatching2AL',
  'descendingOrdering1to999by50AL','matchFractionWithImage4AL','greaterSmallerUpTo999OperatorsAL',
  'multiplication3TableAL','stackLivingAndNonLivingThingsAL','division4TableAL'
];

alLevels.forEach(id => {
  const e = levels[id];
  if (!e) { console.log(id + ' | NOT FOUND | - | -'); return; }
  const branch = e.branch || '-';
  const sa = e.skillAge !== undefined ? e.skillAge : '-';
  const title = (e.title || '').trim();
  console.log(id + ' | ' + sa + ' | ' + branch + ' | ' + title);
});
