const fs = require('fs');
const ts = require('typescript');

const source = fs.readFileSync('data/properties.ts', 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

const moduleShim = { exports: {} };
new Function('exports', 'module', js)(moduleShim.exports, moduleShim);

const { properties } = moduleShim.exports;
const rough = properties.filter((property) => property.id.startsWith('gh-rough-'));

if (rough.length !== 9) {
  throw new Error(`Expected 9 rough renovation properties, got ${rough.length}.`);
}

const first = rough.filter((property) => property.floor === 1);
const middle = rough.filter((property) => property.floor > 1 && property.floor < property.totalFloors);
const last = rough.filter((property) => property.floor === property.totalFloors);

if (first.length !== 3 || middle.length !== 3 || last.length !== 3) {
  throw new Error(`Expected floor distribution 3/3/3, got first=${first.length}, middle=${middle.length}, last=${last.length}.`);
}

for (const property of rough) {
  if (
    property.district !== 'Наурызбайский' ||
    property.rooms !== 1 ||
    property.renovation !== 'Черновая планировка' ||
    property.furniture !== 'Нет' ||
    property.appliances !== 'Нет' ||
    property.verified !== true
  ) {
    throw new Error(`Rough property has invalid base data: ${property.id}`);
  }
}

console.log('Renovation dataset check passed.');
