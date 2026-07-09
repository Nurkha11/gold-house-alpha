const fs = require('fs');
const ts = require('typescript');

const source = fs.readFileSync('data/properties.ts', 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

const moduleShim = { exports: {} };
new Function('exports', 'module', js)(moduleShim.exports, moduleShim);

const { properties } = moduleShim.exports;
const items = properties.filter((property) => property.id.startsWith('gh-2room-'));

if (items.length !== 12) {
  throw new Error(`Expected 12 two-room properties, got ${items.length}.`);
}

const complexes = ['Ulytau Park', 'Alatau Plus', 'Алем Сити', 'Алма Сити 4'];
const renovationOptions = ['Черновая отделка', 'Старый ремонт', 'Хороший ремонт', 'Евроремонт'];
const furnitureOptions = ['Нет', 'Частично', 'Полностью'];

for (const complexName of complexes) {
  const group = items.filter((property) => property.complexName === complexName);
  if (group.length !== 3) {
    throw new Error(`Expected 3 two-room properties for ${complexName}, got ${group.length}.`);
  }
  if (!group.some((property) => property.floor === 1)) {
    throw new Error(`${complexName} has no first-floor two-room property.`);
  }
  if (!group.some((property) => property.floor > 1 && property.floor < property.totalFloors)) {
    throw new Error(`${complexName} has no middle-floor two-room property.`);
  }
  if (!group.some((property) => property.floor === property.totalFloors)) {
    throw new Error(`${complexName} has no last-floor two-room property.`);
  }
}

for (const property of items) {
  if (property.city !== 'Алматы' || property.district !== 'Наурызбайский' || property.rooms !== 2) {
    throw new Error(`Invalid scope for two-room property: ${property.id}`);
  }
  if (property.area < 50 || property.area > 66) {
    throw new Error(`Invalid area for ${property.id}: ${property.area}`);
  }
  if (property.price < 29_000_000 || property.price > 35_000_000) {
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
  return rooms === '4+' ? property.rooms >= 4 : property.rooms === Number(rooms ?? 1);
}

const twoRoomResults = properties.filter((property) => property.district === 'Наурызбайский' && roomMatches(property, '2'));
if (!twoRoomResults.length) {
  throw new Error('Two-room hard filter returned no results.');
}
if (twoRoomResults.some((property) => property.rooms !== 2)) {
  throw new Error('Two-room hard filter returned a non-two-room property.');
}

console.log('Two-room dataset and hard-filter check passed.');
