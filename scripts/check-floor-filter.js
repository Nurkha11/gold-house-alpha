const cases = [
  { floor: 1, totalFloors: 9, middle: false },
  { floor: 9, totalFloors: 9, middle: false },
  { floor: 4, totalFloors: 9, middle: true },
  { floor: 5, totalFloors: 5, middle: false },
  { floor: 10, totalFloors: 10, middle: false },
  { floor: 18, totalFloors: 18, middle: false },
  { floor: 8, totalFloors: 18, middle: true },
  { floor: 2, totalFloors: 5, middle: true },
];

function floorMatches(property, preference) {
  if (preference === 'notFirst') return property.floor !== 1;
  if (preference === 'notLast') return property.floor !== property.totalFloors;
  if (preference === 'middle') return property.floor > 1 && property.floor < property.totalFloors;
  return true;
}

for (const item of cases) {
  const actual = floorMatches(item, 'middle');
  if (actual !== item.middle) {
    throw new Error(`Middle floor filter failed for ${item.floor}/${item.totalFloors}. Expected ${item.middle}, got ${actual}.`);
  }
}

const middleResults = cases.filter((item) => floorMatches(item, 'middle'));
if (middleResults.some((item) => item.floor === 1 || item.floor === item.totalFloors)) {
  throw new Error('Middle floor filter returned first or last floor.');
}

console.log('Floor hard-filter check passed.');
