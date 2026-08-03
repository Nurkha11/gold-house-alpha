const fs = require('fs');

const checks = [
  [
    'data/buyerProfileStore.ts',
    [
      'getBuyerPropertyById',
      'removeBuyerFavorite',
      'FINAL_RECOMMENDATION',
      'propertySnapshot: createPropertySnapshot(findProperty(signal.propertyId))',
    ],
  ],
  [
    'app/buyer-cabinet.tsx',
    [
      'Мои рекомендации',
      'Убрать из избранного',
      'getActiveBuyerEvents',
      "router.push('/personal-recommendations'",
    ],
  ],
  [
    'data/ownerTypes.ts',
    ['pending_moderation', 'changes_requested', 'adminComment?: string', 'balconyType?: BalconyType', 'elevatorCount?: ElevatorCount', 'hasFreightElevator?: boolean | null', 'parkingType?: ParkingType'],
  ],
  [
    'data/balconyTypes.ts',
    ['BalconyType', 'balcony_and_loggia', 'normalizeBalconyType', 'getBalconyLabel'],
  ],
  [
    'data/elevatorTypes.ts',
    ['ElevatorCount', 'normalizeElevatorData', 'getElevatorLabel', 'hasFreightElevator'],
  ],
  [
    'data/parkingTypes.ts',
    ['ParkingType', 'normalizeParkingData', 'getParkingLabel', 'parkingSpaceIncludedInPrice'],
  ],
  [
    'data/ownerStore.ts',
    ['getPublishedProperties', 'submissionToProperty', 'floorCategory', 'adminComment', 'normalizeSubmissionStatus', 'pending_moderation', 'normalizeBalconyType', 'normalizeElevatorData', 'normalizeParkingData'],
  ],
  [
    'app/admin.tsx',
    ['verifyAdminPin', 'getAllSubmissions', '/admin-submission', 'changes_requested'],
  ],
  [
    'app/admin-submission.tsx',
    ['updateSubmissionStatus', 'published', 'changes_requested', 'rejected', 'Балкон / лоджия', 'Количество лифтов', 'Грузовой лифт', 'Собственное место', 'Входит в стоимость'],
  ],
  [
    'app/owner-dashboard.tsx',
    ['adminComment', 'changes_requested', '/owner-submission'],
  ],
  [
    'app/owner-submission.tsx',
    ['saveSubmission', "status === 'pending_moderation'", 'adminComment', 'Балкон / лоджия', 'updateBalcony', 'Количество лифтов', 'Есть грузовой лифт?', 'updateElevatorCount', 'Парковка у дома', 'Есть собственное парковочное место?', 'updateParkingType'],
  ],
  [
    'app/property/[id].tsx',
    ['Балкон / лоджия', 'normalizeBalconyType', 'getElevatorLabel', 'getParkingLabel'],
  ],
];

for (const [file, needles] of checks) {
  const text = fs.readFileSync(file, 'utf8');
  for (const needle of needles) {
    if (!text.includes(needle)) {
      throw new Error(`${file} is missing regression marker: ${needle}`);
    }
  }
}

console.log('Moderation and buyer cabinet regression check OK');
