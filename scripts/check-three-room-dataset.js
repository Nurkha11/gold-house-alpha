const fs = require('fs');
const ts = require('typescript');

const source = fs.readFileSync('data/properties.ts', 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

const moduleShim = { exports: {} };
new Function('exports', 'module', js)(moduleShim.exports, moduleShim);

const { properties } = moduleShim.exports;
const items = properties.filter((property) => property.id.startsWith('gh-3room-'));

if (items.length !== 12) {
  throw new Error(`Expected 12 three-room properties, got ${items.length}.`);
}

const complexes = ['Ulytau Park', 'Alatau Plus', 'Алем Сити', 'Алма Сити 4'];
const renovationOptions = ['Черновая отделка', 'Старый ремонт', 'Хороший ремонт', 'Евроремонт'];
const furnitureOptions = ['Нет', 'Частично', 'Полностью'];

for (const complexName of complexes) {
  const group = items.filter((property) => property.complexName === complexName);
  if (group.length !== 3) {
    throw new Error(`Expected 3 three-room properties for ${complexName}, got ${group.length}.`);
  }
  if (!group.some((property) => property.floor === 1)) {
    throw new Error(`${complexName} has no first-floor three-room property.`);
  }
  if (!group.some((property) => property.floor > 1 && property.floor < property.totalFloors)) {
    throw new Error(`${complexName} has no middle-floor three-room property.`);
  }
  if (!group.some((property) => property.floor === property.totalFloors)) {
    throw new Error(`${complexName} has no last-floor three-room property.`);
  }
}

for (const property of items) {
  if (property.city !== 'Алматы' || property.district !== 'Наурызбайский' || property.rooms !== 3) {
    throw new Error(`Invalid scope for three-room property: ${property.id}`);
  }
  if (property.area < 70 || property.area > 90) {
    throw new Error(`Invalid area for ${property.id}: ${property.area}`);
  }
  if (property.price < 38_000_000 || property.price > 50_000_000) {
    throw new Error(`Invalid price for ${property.id}: ${property.price}`);
  }
  if (!renovationOptions.includes(property.renovation)) {
    throw new Error(`Invalid renovation for ${property.id}: ${property.renovation}`);
  }
  if (!furnitureOptions.includes(property.furniture) || !furnitureOptions.includes(property.appliances)) {
    throw new Error(`Invalid furniture/appliances for ${property.id}.`);
  }
}

function roomMatches(property, rooms) {
  const selectedRooms = String(rooms ?? '1')
    .split(',')
    .map((room) => room.trim())
    .filter(Boolean);

  if (!selectedRooms.length || selectedRooms.includes('all')) return true;
  return selectedRooms.some((room) => (room === '4+' ? property.rooms >= 4 : property.rooms === Number(room)));
}

const filterCases = [
  { rooms: '3', allowed: [3] },
  { rooms: '2,3', allowed: [2, 3] },
  { rooms: '1,3', allowed: [1, 3] },
  { rooms: '1,2,3', allowed: [1, 2, 3] },
];

for (const item of filterCases) {
  const results = properties.filter((property) => property.district === 'Наурызбайский' && roomMatches(property, item.rooms));
  const actualRooms = new Set(results.map((property) => property.rooms));
  if ([...actualRooms].some((room) => !item.allowed.includes(room))) {
    throw new Error(`Room filter ${item.rooms} returned rooms outside ${item.allowed.join(',')}.`);
  }
  if (!item.allowed.every((room) => actualRooms.has(room))) {
    throw new Error(`Room filter ${item.rooms} did not include all expected room groups.`);
  }
}

const middleThreeRooms = items.filter((property) => property.floor > 1 && property.floor < property.totalFloors);
if (middleThreeRooms.length !== 4) {
  throw new Error(`Expected 4 middle-floor three-room properties, got ${middleThreeRooms.length}.`);
}

const euroThreeRooms = items.filter((property) => property.renovation === 'Евроремонт');
if (euroThreeRooms.length !== 4) {
  throw new Error(`Expected 4 euro-renovated three-room properties, got ${euroThreeRooms.length}.`);
}

const budgetThreeRooms = items.filter((property) => property.price <= 45_000_000);
if (!budgetThreeRooms.length || budgetThreeRooms.some((property) => property.rooms !== 3 || property.price > 45_000_000)) {
  throw new Error('Budget + three-room check failed.');
}

console.log('Three-room dataset and room-filter check passed.');
