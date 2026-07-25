const fs = require('fs');

const checks = [
  ['data/locationTypes.ts', ['PropertyLocation', 'ResidentialComplexSuggestion', 'locationConfirmed']],
  ['data/residentialComplexes.ts', ['residentialComplexes', 'searchMockAddresses', 'findDuplicateComplexIds', 'buildLocationWarnings']],
  ['components/OwnerLocationPicker.tsx', ['Адрес и карта', 'locationConfirmed', 'Предложить новый ЖК']],
  ['app/owner-submission.tsx', ['OwnerLocationPicker', 'canGoNext', 'Где находится квартира?']],
  ['app/admin-submission.tsx', ['Проверка локации', 'updateSubmissionLocationReview', 'Подтвердить локацию']],
  ['outputs/gold-house-computer-preview.html', ['ownerLocationBody', 'adminLocationSection', 'GOLD_HOUSE_YANDEX_MAPS_API_KEY']],
  ['.env.example', ['EXPO_PUBLIC_YANDEX_MAPS_API_KEY=', 'VITE_YANDEX_MAPS_API_KEY=']],
];

for (const [file, needles] of checks) {
  const text = fs.readFileSync(file, 'utf8');
  for (const needle of needles) {
    if (!text.includes(needle)) {
      throw new Error(`${file} does not include required marker: ${needle}`);
    }
  }
}

console.log('Owner location flow check OK');
