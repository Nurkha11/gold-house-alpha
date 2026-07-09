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

function hardFilter(property, preferences) {
  return (
    property.city === preferences.city &&
    property.district === preferences.district &&
    roomMatches(property, preferences.rooms) &&
    property.price <= preferences.budgetMax
  );
}

const preferences = {
  city: 'Алматы',
  district: 'Наурызбайский',
  rooms: '1,2',
  budgetMin: 30_000_000,
  budgetMax: 45_000_000,
};

const results = properties.filter((property) => hardFilter(property, preferences));
const hasAffordableOneRoom = results.some((property) => property.rooms === 1 && property.price === 19_000_000);
const hasOverBudget = results.some((property) => property.price > preferences.budgetMax);
const hasWrongRoom = results.some((property) => property.rooms !== 1 && property.rooms !== 2);

if (!hasAffordableOneRoom) {
  throw new Error('Soft budget filter did not include the 19M one-room apartment for 30-45M + 1,2 rooms.');
}

if (hasOverBudget) {
  throw new Error('Soft budget filter returned a property above the selected budget max.');
}

if (hasWrongRoom) {
  throw new Error('Soft budget filter returned a property outside selected rooms.');
}

console.log('Soft budget lower-bound check passed.');
