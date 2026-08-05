const fs = require('fs');

const source = fs.readFileSync('data/parkingTypes.ts', 'utf8');

const requiredMarkers = [
  "export type ParkingType = 'none' | 'open' | 'covered' | 'underground'",
  'normalizeParkingData',
  'getParkingLabel',
  'hasPrivateParkingSpace',
  'parkingSpaceIncludedInPrice',
  "'Открытая парковка'",
  "'Крытая наземная парковка'",
  "'Подземный паркинг'",
];

for (const marker of requiredMarkers) {
  if (!source.includes(marker)) {
    throw new Error(`Missing parking marker: ${marker}`);
  }
}

const ownerForm = fs.readFileSync('app/owner-submission.tsx', 'utf8');
for (const marker of ['Парковка у дома', 'Есть собственное парковочное место?', 'Парковочное место входит в стоимость квартиры?', 'updateParkingType']) {
  if (!ownerForm.includes(marker)) {
    throw new Error(`Owner form is missing parking UI marker: ${marker}`);
  }
}

const adminForm = fs.readFileSync('app/admin-submission.tsx', 'utf8');
for (const marker of ['Собственное место', 'Входит в стоимость', 'normalizeParkingData']) {
  if (!adminForm.includes(marker)) {
    throw new Error(`Admin view is missing parking marker: ${marker}`);
  }
}

const details = fs.readFileSync('app/property/[id].tsx', 'utf8');
if (!details.includes('getParkingLabel(property)')) {
  throw new Error('Property details page must render normalized parking text');
}

console.log('Parking data check OK');
