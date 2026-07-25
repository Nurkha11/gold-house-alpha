const fs = require('fs');
const ts = require('typescript');

const source = fs.readFileSync('data/properties.ts', 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

const moduleShim = { exports: {} };
new Function('exports', 'module', js)(moduleShim.exports, moduleShim);

const { properties } = moduleShim.exports;

function roomMatches(property, rooms) {
  const selectedRooms = String(rooms ?? '1')
    .split(',')
    .map((room) => room.trim())
    .filter(Boolean);

  if (!selectedRooms.length || selectedRooms.includes('all')) return true;
  return selectedRooms.some((room) => (room === '4+' ? property.rooms >= 4 : property.rooms === Number(room)));
}

function propertyFloorCategory(property) {
  if (['first', 'middle', 'last'].includes(property.floorCategory)) return property.floorCategory;
  if (property.floor === 1) return 'first';
  if (property.floor === property.totalFloors) return 'last';
  return 'middle';
}

function floorMatches(property, selectedFloorCategories) {
  return selectedFloorCategories.length > 0 && selectedFloorCategories.includes(propertyFloorCategory(property));
}

const bostandykItems = properties.filter((property) => property.id.startsWith('bostandyk-'));
const bostandykDistrict = bostandykItems[0]?.district;
if (!bostandykDistrict) throw new Error('Bostandyk district seed was not found.');

function hardFilter({ rooms, selectedFloorCategories }) {
  return properties.filter(
    (property) =>
      property.city === bostandykItems[0].city &&
      property.district === bostandykDistrict &&
      roomMatches(property, rooms) &&
      floorMatches(property, selectedFloorCategories),
  );
}

const allFloorCategories = ['first', 'middle', 'last'];
const oneRoomItems = bostandykItems.filter((property) => property.id.startsWith('bostandyk-1room-'));
const twoRoomItems = bostandykItems.filter((property) => property.id.startsWith('bostandyk-2room-'));
const threeRoomItems = bostandykItems.filter((property) => property.id.startsWith('bostandyk-3room-'));

const newFirstIds = ['bostandyk-3room-4you-first-029', 'bostandyk-2room-estet-first-030', 'bostandyk-3room-riviera-first-031', 'bostandyk-3room-afd-plaza-first-032'];
const newLastIds = ['bostandyk-3room-4you-last-033', 'bostandyk-2room-estet-last-034', 'bostandyk-3room-riviera-last-035', 'bostandyk-3room-afd-plaza-last-036'];

const newFirstItems = properties.filter((property) => newFirstIds.includes(property.id));
const newLastItems = properties.filter((property) => newLastIds.includes(property.id));

if (bostandykItems.length !== 36) throw new Error(`Expected 36 total Bostandyk properties, got ${bostandykItems.length}.`);
if (oneRoomItems.length !== 12) throw new Error(`Expected 12 Bostandyk one-room properties, got ${oneRoomItems.length}.`);
if (twoRoomItems.length !== 14) throw new Error(`Expected 14 Bostandyk two-room properties, got ${twoRoomItems.length}.`);
if (threeRoomItems.length !== 10) throw new Error(`Expected 10 Bostandyk three-room properties, got ${threeRoomItems.length}.`);

if (newFirstItems.length !== 4) throw new Error(`Expected 4 new first-floor properties, got ${newFirstItems.length}.`);
if (newLastItems.length !== 4) throw new Error(`Expected 4 new last-floor properties, got ${newLastItems.length}.`);
if (newFirstItems.some((property) => property.floor !== 1 || propertyFloorCategory(property) !== 'first')) {
  throw new Error('New first-floor properties must have floor=1 and floorCategory=first.');
}
if (newLastItems.some((property) => property.floor !== property.totalFloors || propertyFloorCategory(property) !== 'last')) {
  throw new Error('New last-floor properties must satisfy floor === totalFloors and floorCategory=last.');
}

const lastFloors = new Set(newLastItems.map((property) => `${property.floor}/${property.totalFloors}`));
for (const expected of ['8/8', '12/12', '16/16', '21/21']) {
  if (!lastFloors.has(expected)) throw new Error(`Missing expected last-floor unit ${expected}.`);
}

const allRoomsAllFloors = hardFilter({ rooms: 'all', selectedFloorCategories: allFloorCategories });
if (allRoomsAllFloors.length !== 36) {
  throw new Error(`All floor categories should return all 36 Bostandyk properties, got ${allRoomsAllFloors.length}.`);
}

const noFloorSelection = hardFilter({ rooms: 'all', selectedFloorCategories: [] });
if (noFloorSelection.length !== 0) {
  throw new Error('Empty floor selection should not return properties.');
}

const twoRoomAllFloors = hardFilter({ rooms: '2', selectedFloorCategories: allFloorCategories });
if (twoRoomAllFloors.length !== 14 || twoRoomAllFloors.some((property) => property.rooms !== 2)) {
  throw new Error('Two-room filter should return only Bostandyk two-room properties.');
}
if (!twoRoomAllFloors.some((property) => property.id === 'bostandyk-2room-estet-last-034')) {
  throw new Error('Estet last-floor unit must appear for 2-room selection.');
}

const threeRoomAllFloors = hardFilter({ rooms: '3', selectedFloorCategories: allFloorCategories });
if (threeRoomAllFloors.length !== 10 || threeRoomAllFloors.some((property) => property.rooms !== 3)) {
  throw new Error('Three-room filter should return only Bostandyk three-room properties.');
}
for (const id of ['bostandyk-3room-4you-last-033', 'bostandyk-3room-riviera-last-035', 'bostandyk-3room-afd-plaza-last-036']) {
  if (!threeRoomAllFloors.some((property) => property.id === id)) throw new Error(`${id} must appear for 3-room selection.`);
}

const onlyLast = hardFilter({ rooms: 'all', selectedFloorCategories: ['last'] });
if (onlyLast.length !== 12 || onlyLast.some((property) => propertyFloorCategory(property) !== 'last')) {
  throw new Error('Last-floor filter should return only last floor category properties.');
}
for (const id of newLastIds) {
  if (!onlyLast.some((property) => property.id === id)) throw new Error(`${id} must appear in last-floor filter.`);
}

const onlyFirst = hardFilter({ rooms: 'all', selectedFloorCategories: ['first'] });
if (onlyFirst.some((property) => newLastIds.includes(property.id) || propertyFloorCategory(property) !== 'first')) {
  throw new Error('First-floor filter must not return new last-floor properties.');
}

const onlyMiddle = hardFilter({ rooms: 'all', selectedFloorCategories: ['middle'] });
if (onlyMiddle.some((property) => newFirstIds.includes(property.id) || newLastIds.includes(property.id) || propertyFloorCategory(property) !== 'middle')) {
  throw new Error('Middle-floor filter must not return first or last category properties.');
}
if (!onlyMiddle.some((property) => property.id === 'bostandyk-3room-estet-middle-026')) {
  throw new Error('Estet 2/12 middle-floor unit must appear for middle selection.');
}

const firstLast = hardFilter({ rooms: 'all', selectedFloorCategories: ['first', 'last'] });
if (firstLast.some((property) => propertyFloorCategory(property) === 'middle')) {
  throw new Error('First+last filter must exclude middle category properties.');
}
for (const id of newLastIds) {
  if (!firstLast.some((property) => property.id === id)) throw new Error(`${id} must appear in first+last filter.`);
}

const middleLast = hardFilter({ rooms: 'all', selectedFloorCategories: ['middle', 'last'] });
if (middleLast.some((property) => propertyFloorCategory(property) === 'first')) {
  throw new Error('Middle+last filter must exclude first category properties.');
}
for (const id of newLastIds) {
  if (!middleLast.some((property) => property.id === id)) throw new Error(`${id} must appear in middle+last filter.`);
}

const firstMiddle = hardFilter({ rooms: 'all', selectedFloorCategories: ['first', 'middle'] });
if (firstMiddle.some((property) => newLastIds.includes(property.id) || propertyFloorCategory(property) === 'last')) {
  throw new Error('First+middle filter must exclude last category properties.');
}

const softBudgetCheck = hardFilter({ rooms: '1,2,3', selectedFloorCategories: allFloorCategories }).filter((property) => property.price > 90_000_000);
if (!softBudgetCheck.some((property) => property.id === 'bostandyk-3room-4you-last-033')) {
  throw new Error('Budget remains a soft score factor: expensive last-floor properties should remain visible before scoring.');
}

const ids = new Set(bostandykItems.map((property) => property.id));
const phones = new Set(bostandykItems.map((property) => property.ownerPhone));
if (ids.size !== bostandykItems.length) throw new Error('Bostandyk dataset contains duplicate IDs.');
if (phones.size !== bostandykItems.length) throw new Error('Bostandyk dataset contains duplicate owner phones.');

console.log('Bostandyk floor-category checks passed.');
