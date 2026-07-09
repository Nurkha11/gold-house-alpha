const fs = require('fs');
const ts = require('typescript');

const source = fs.readFileSync('data/properties.ts', 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

const moduleShim = { exports: {} };
new Function('exports', 'module', js)(moduleShim.exports, moduleShim);

const { properties } = moduleShim.exports;
const items = properties.filter((property) => property.id.startsWith('gh-price-area-'));

if (items.length !== 9) {
  throw new Error(`Expected 9 price/area properties, got ${items.length}.`);
}

const compactLow = items.filter((property) => property.area >= 30 && property.area <= 32 && property.price >= 18_000_000 && property.price <= 19_000_000);
const mediumMid = items.filter((property) => property.area >= 34 && property.area <= 36 && property.price >= 21_000_000 && property.price <= 23_000_000);
const largeHigh = items.filter((property) => property.area >= 38 && property.area <= 42 && property.price >= 25_000_000 && property.price <= 27_000_000);

if (compactLow.length !== 3 || mediumMid.length !== 3 || largeHigh.length !== 3) {
  throw new Error(`Expected price/area groups 3/3/3, got compactLow=${compactLow.length}, mediumMid=${mediumMid.length}, largeHigh=${largeHigh.length}.`);
}

for (const property of items) {
  if (property.city !== 'Алматы' || property.district !== 'Наурызбайский' || property.rooms !== 1) {
    throw new Error(`Invalid scope for price/area property: ${property.id}`);
  }
}

console.log('Price/area dataset check passed.');
