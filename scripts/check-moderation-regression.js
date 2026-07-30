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
    ['changes_requested', 'adminComment?: string'],
  ],
  [
    'data/ownerStore.ts',
    ['getPublishedProperties', 'submissionToProperty', 'floorCategory', 'adminComment'],
  ],
  [
    'app/admin.tsx',
    ['verifyAdminPin', 'getAllSubmissions', '/admin-submission', 'changes_requested'],
  ],
  [
    'app/admin-submission.tsx',
    ['updateSubmissionStatus', 'published', 'changes_requested', 'rejected'],
  ],
  [
    'app/owner-dashboard.tsx',
    ['adminComment', 'changes_requested', '/owner-submission'],
  ],
  [
    'app/owner-submission.tsx',
    ['saveSubmission', "status === 'submitted'", 'adminComment'],
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
