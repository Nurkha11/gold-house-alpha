const cases = [
  { floor: 1, totalFloors: 9, category: 'first' },
  { floor: 9, totalFloors: 9, category: 'last' },
  { floor: 4, totalFloors: 9, category: 'middle' },
  { floor: 5, totalFloors: 5, category: 'last' },
  { floor: 10, totalFloors: 10, category: 'last' },
  { floor: 18, totalFloors: 18, category: 'last' },
  { floor: 8, totalFloors: 18, category: 'middle' },
  { floor: 2, totalFloors: 5, category: 'middle' },
  { floor: 2, totalFloors: 12, floorCategory: 'middle', category: 'middle', label: 'Estet 2/12' },
];

function propertyFloorCategory(property) {
  if (['first', 'middle', 'last'].includes(property.floorCategory)) return property.floorCategory;
  if (property.floor === 1) return 'first';
  if (property.floor === property.totalFloors) return 'last';
  return 'middle';
}

function floorMatches(property, selectedFloorCategories) {
  return selectedFloorCategories.length > 0 && selectedFloorCategories.includes(propertyFloorCategory(property));
}

function assertScenario(selectedFloorCategories, expectedCategories, label) {
  const actual = cases.filter((item) => floorMatches(item, selectedFloorCategories));

  if (actual.some((item) => !expectedCategories.includes(propertyFloorCategory(item)))) {
    throw new Error(`${label} returned a wrong floor category.`);
  }

  for (const category of expectedCategories) {
    if (!actual.some((item) => propertyFloorCategory(item) === category)) {
      throw new Error(`${label} did not return category ${category}.`);
    }
  }
}

assertScenario(['middle'], ['middle'], 'Middle only');
assertScenario(['first', 'middle'], ['first', 'middle'], 'First + middle');
assertScenario(['middle', 'last'], ['middle', 'last'], 'Middle + last');
assertScenario(['first', 'middle', 'last'], ['first', 'middle', 'last'], 'All categories');

const emptyResults = cases.filter((item) => floorMatches(item, []));
if (emptyResults.length !== 0) {
  throw new Error('Empty floor selection must not return any properties.');
}

const estet = cases.find((item) => item.label === 'Estet 2/12');
if (!floorMatches(estet, ['middle'])) {
  throw new Error('Estet 2/12 must appear for middle floor selection.');
}
if (floorMatches(estet, ['first'])) {
  throw new Error('Estet 2/12 must not appear for first floor selection.');
}

console.log('Floor multiselect hard-filter check passed.');
