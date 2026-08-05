const fs = require('fs');

const source = fs.readFileSync('data/elevatorTypes.ts', 'utf8');

const requiredMarkers = [
  'export type ElevatorCount = 0 | 1 | 2 | 3',
  'normalizeElevatorData',
  'getElevatorLabel',
  'hasFreightElevator',
  "'1 пассажирский лифт'",
  "'2 пассажирских лифта'",
  "'3 и более, есть грузовой'",
];

for (const marker of requiredMarkers) {
  if (!source.includes(marker)) {
    throw new Error(`Missing elevator marker: ${marker}`);
  }
}

const ownerForm = fs.readFileSync('app/owner-submission.tsx', 'utf8');
for (const marker of ['Количество лифтов', 'Есть грузовой лифт?', 'updateElevatorCount', 'updateFreightElevator']) {
  if (!ownerForm.includes(marker)) {
    throw new Error(`Owner form is missing elevator UI marker: ${marker}`);
  }
}

const adminForm = fs.readFileSync('app/admin-submission.tsx', 'utf8');
for (const marker of ['Количество лифтов', 'Грузовой лифт', 'getElevatorCountLabel']) {
  if (!adminForm.includes(marker)) {
    throw new Error(`Admin view is missing elevator marker: ${marker}`);
  }
}

const details = fs.readFileSync('app/property/[id].tsx', 'utf8');
if (!details.includes('getElevatorLabel(property)')) {
  throw new Error('Property details page must render normalized elevator text');
}

console.log('Elevator data check OK');
