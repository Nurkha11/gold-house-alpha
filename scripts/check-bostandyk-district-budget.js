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

function floorMatches(property, preference) {
  if (preference === 'notFirst') return property.floor !== 1;
  if (preference === 'notLast') return property.floor !== property.totalFloors;
  if (preference === 'middle') return property.floor > 1 && property.floor < property.totalFloors;
  return true;
}

function hardFilter({ districts, rooms, floorPreference = 'any' }) {
  return properties.filter(
    (property) =>
      property.city === 'Алматы' &&
      districts.includes(property.district) &&
      roomMatches(property, rooms) &&
      floorMatches(property, floorPreference),
  );
}

const bostandykItems = properties.filter((property) => property.id.startsWith('bostandyk-1room-'));
const bostandykTwoRoomItems = properties.filter((property) => property.id.startsWith('bostandyk-2room-'));
const bostandykTwoRoomFirstItems = properties.filter((property) => property.id.startsWith('bostandyk-2room-') && property.floor === 1);
const bostandykTwoRoomMiddleItems = properties.filter((property) => property.id.startsWith('bostandyk-2room-') && property.floor > 1 && property.floor < property.totalFloors);
const bostandykTwoRoomLastItems = properties.filter((property) => property.id.startsWith('bostandyk-2room-') && property.floor === property.totalFloors);
const allBostandykItems = properties.filter((property) => property.district === 'Бостандыкский');
const firstFloorItems = bostandykItems.filter((property) => property.floor === 1);
const middleFloorItems = bostandykItems.filter((property) => property.floor > 1 && property.floor < property.totalFloors);
const lastFloorItems = bostandykItems.filter((property) => property.floor === property.totalFloors);

if (bostandykItems.length !== 12) {
  throw new Error(`Expected 12 Bostandyk one-room properties, got ${bostandykItems.length}.`);
}

if (bostandykTwoRoomItems.length !== 12) {
  throw new Error(`Expected 12 Bostandyk two-room properties, got ${bostandykTwoRoomItems.length}.`);
}

if (bostandykTwoRoomFirstItems.length !== 4) {
  throw new Error(`Expected 4 first-floor Bostandyk two-room properties, got ${bostandykTwoRoomFirstItems.length}.`);
}

if (bostandykTwoRoomMiddleItems.length !== 4) {
  throw new Error(`Expected 4 middle-floor Bostandyk two-room properties, got ${bostandykTwoRoomMiddleItems.length}.`);
}

if (bostandykTwoRoomLastItems.length !== 4) {
  throw new Error(`Expected 4 last-floor Bostandyk two-room properties, got ${bostandykTwoRoomLastItems.length}.`);
}

if (allBostandykItems.length !== 24) {
  throw new Error(`Expected 24 total Bostandyk properties, got ${allBostandykItems.length}.`);
}

if (bostandykTwoRoomItems.some((property) => property.rooms !== 2)) {
  throw new Error('Every Sprint 4/4.2 Bostandyk property must be two-room.');
}

if (firstFloorItems.length !== 4) {
  throw new Error(`Expected 4 first-floor Bostandyk properties, got ${firstFloorItems.length}.`);
}

if (middleFloorItems.length !== 4) {
  throw new Error(`Expected 4 middle-floor Bostandyk properties, got ${middleFloorItems.length}.`);
}

if (lastFloorItems.length !== 4) {
  throw new Error(`Expected 4 last-floor Bostandyk properties, got ${lastFloorItems.length}.`);
}

if (bostandykItems.some((property) => property.district !== 'Бостандыкский' || property.rooms !== 1)) {
  throw new Error('Bostandyk dataset contains a property outside the required district/room scope.');
}

const ids = new Set(bostandykItems.map((property) => property.id));
const phones = new Set(allBostandykItems.map((property) => property.ownerPhone));
const allIds = new Set(allBostandykItems.map((property) => property.id));
if (ids.size !== bostandykItems.length || allIds.size !== allBostandykItems.length) {
  throw new Error('Bostandyk dataset contains duplicate IDs.');
}
if (phones.size !== allBostandykItems.length) {
  throw new Error('Bostandyk dataset contains duplicate owner phones.');
}

for (const complexName of ['4YOU', 'Abay130', 'Riviera', 'Акварель']) {
  const group = bostandykItems.filter((property) => property.complexName === complexName);
  if (group.length !== 3) {
    throw new Error(`Expected 3 Bostandyk properties for ${complexName}, got ${group.length}.`);
  }
  if (!group.some((property) => property.floor === 1)) {
    throw new Error(`${complexName} has no first-floor Bostandyk property.`);
  }
  if (!group.some((property) => property.floor > 1 && property.floor < property.totalFloors)) {
    throw new Error(`${complexName} has no middle-floor Bostandyk property.`);
  }
  if (!group.some((property) => property.floor === property.totalFloors)) {
    throw new Error(`${complexName} has no last-floor Bostandyk property.`);
  }
}

const allFloors = hardFilter({ districts: ['Бостандыкский'], rooms: '1', floorPreference: 'any' });
if (allFloors.length !== 12) {
  throw new Error(`Any-floor filter should return all 12 Bostandyk properties, got ${allFloors.length}.`);
}

const oneRoomOnly = hardFilter({ districts: ['Бостандыкский'], rooms: '1', floorPreference: 'any' });
if (oneRoomOnly.length !== 12 || oneRoomOnly.some((property) => property.rooms !== 1)) {
  throw new Error('One-room filter should return only the 12 existing Bostandyk one-room properties.');
}

const twoRoomOnly = hardFilter({ districts: ['Бостандыкский'], rooms: '2', floorPreference: 'any' });
if (twoRoomOnly.length !== 12 || twoRoomOnly.some((property) => property.rooms !== 2)) {
  throw new Error('Two-room filter should return only the 12 Bostandyk two-room properties.');
}

const oneOrTwoRooms = hardFilter({ districts: ['Бостандыкский'], rooms: '1,2', floorPreference: 'any' });
if (oneOrTwoRooms.length !== 24 || !oneOrTwoRooms.some((property) => property.rooms === 1) || !oneOrTwoRooms.some((property) => property.rooms === 2)) {
  throw new Error('Combined one-or-two-room filter should return both room groups.');
}

const threeRoomOnly = hardFilter({ districts: ['Бостандыкский'], rooms: '3', floorPreference: 'any' });
if (threeRoomOnly.some((property) => property.id.startsWith('bostandyk-2room-'))) {
  throw new Error('Three-room filter should not return Sprint 4 Bostandyk two-room properties.');
}

const notFirst = hardFilter({ districts: ['Бостандыкский'], rooms: '1', floorPreference: 'notFirst' });
if (notFirst.length !== 8 || notFirst.some((property) => property.floor === 1)) {
  throw new Error('Not-first filter should exclude every first-floor Bostandyk property.');
}

const twoRoomNotFirst = hardFilter({ districts: ['Бостандыкский'], rooms: '2', floorPreference: 'notFirst' });
if (twoRoomNotFirst.length !== 8 || twoRoomNotFirst.some((property) => property.floor === 1)) {
  throw new Error('Two-room not-first filter should exclude every Sprint 4.2 first-floor property.');
}

const notLast = hardFilter({ districts: ['Бостандыкский'], rooms: '1', floorPreference: 'notLast' });
if (notLast.length !== 8 || notLast.some((property) => property.floor === property.totalFloors)) {
  throw new Error('Not-last filter should exclude every last-floor Bostandyk property.');
}

const twoRoomNotLast = hardFilter({ districts: ['Бостандыкский'], rooms: '2', floorPreference: 'notLast' });
if (twoRoomNotLast.length !== 8 || twoRoomNotLast.some((property) => property.floor === property.totalFloors)) {
  throw new Error('Two-room not-last filter should keep first and middle floors and exclude only last floors.');
}

const twoRoomLast = hardFilter({ districts: ['Бостандыкский'], rooms: '2', floorPreference: 'any' }).filter((property) => property.floor === property.totalFloors);
if (twoRoomLast.length !== 4 || twoRoomLast.some((property) => property.floor !== property.totalFloors)) {
  throw new Error('Two-room last-floor dataset should contain exactly 4 properties with floor === totalFloors.');
}

const middle = hardFilter({ districts: ['Бостандыкский'], rooms: '1', floorPreference: 'middle' });
if (middle.length !== 4 || middle.some((property) => property.floor === 1 || property.floor === property.totalFloors)) {
  throw new Error('Middle-floor filter should return only middle-floor Bostandyk properties.');
}

const twoRoomMiddle = hardFilter({ districts: ['Бостандыкский'], rooms: '2', floorPreference: 'middle' });
if (twoRoomMiddle.length !== 4 || twoRoomMiddle.some((property) => property.rooms !== 2 || property.floor <= 1 || property.floor >= property.totalFloors)) {
  throw new Error('Two-room + middle-floor filter should return all 4 Sprint 4 middle-floor properties.');
}

const twoRoomPriceOrder = [
  ['4YOU', 91_000_000, 86_000_000, 84_000_000],
  ['Симфония', 53_000_000, 50_000_000, 48_000_000],
  ['Riviera', 60_000_000, 55_000_000, 53_000_000],
  ['4Hills', 62_000_000, 58_000_000, 56_000_000],
];

for (const [complexName, middlePrice, firstPrice, lastPrice] of twoRoomPriceOrder) {
  const group = bostandykTwoRoomItems.filter((property) => property.complexName === complexName);
  if (group.length !== 3) {
    throw new Error(`Expected first/middle/last two-room properties for ${complexName}, got ${group.length}.`);
  }
  if (!group.some((property) => property.floor > 1 && property.floor < property.totalFloors && property.price === middlePrice)) {
    throw new Error(`${complexName} middle-floor two-room price is not ${middlePrice}.`);
  }
  if (!group.some((property) => property.floor === 1 && property.price === firstPrice)) {
    throw new Error(`${complexName} first-floor two-room price is not ${firstPrice}.`);
  }
  if (!group.some((property) => property.floor === property.totalFloors && property.price === lastPrice)) {
    throw new Error(`${complexName} last-floor two-room price is not ${lastPrice}.`);
  }
  if (!(middlePrice > firstPrice && firstPrice > lastPrice)) {
    throw new Error(`${complexName} price order must be middle > first > last.`);
  }
}

const bothDistrictsMiddle = hardFilter({ districts: ['Наурызбайский', 'Бостандыкский'], rooms: '1', floorPreference: 'middle' });
if (!bothDistrictsMiddle.some((property) => property.district === 'Наурызбайский') || !bothDistrictsMiddle.some((property) => property.district === 'Бостандыкский')) {
  throw new Error('Combined district filter should keep floor filtering active for both districts.');
}

const softBudgetCheck = hardFilter({ districts: ['Бостандыкский'], rooms: '1,2', floorPreference: 'any' }).filter((property) => property.price > 30_000_000);
if (softBudgetCheck.length !== 24) {
  throw new Error('Budget must be a soft score factor: Bostandyk properties above 30m should remain visible.');
}

console.log('Bostandyk room and floor-filter checks passed.');
