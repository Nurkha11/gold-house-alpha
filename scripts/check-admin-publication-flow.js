const fs = require('fs');

const checks = [
  [
    'data/ownerTypes.ts',
    ['pending_moderation', 'changes_requested', 'published', 'rejected'],
  ],
  [
    'data/ownerStore.ts',
    [
      "status: 'pending_moderation'",
      'normalizeSubmissionStatus',
      "submission.status === 'published'",
      'submissionToProperty',
      'ownerPhone: submission.ownerPhone',
    ],
  ],
  [
    'app/owner-submission.tsx',
    ["persist('pending_moderation')", "status === 'pending_moderation'"],
  ],
  [
    'app/admin.tsx',
    ['adminTabs', 'visibleSubmissions', "'pending_moderation'", 'Открыть заявку', '/admin-submission'],
  ],
  [
    'app/admin-submission.tsx',
    ['Согласовано и опубликовать', "'changes_requested'", "'rejected'", '/property/[id]'],
  ],
  [
    'app/owner-dashboard.tsx',
    ['adminComment', 'Посмотреть как покупатель', '/property/[id]'],
  ],
  [
    'data/propertyStore.ts',
    ['getPublishedProperties', 'return [...getPublishedProperties(), ...properties]'],
  ],
];

for (const [file, needles] of checks) {
  const text = fs.readFileSync(file, 'utf8');
  for (const needle of needles) {
    if (!text.includes(needle)) {
      throw new Error(`${file} is missing publication-flow marker: ${needle}`);
    }
  }
}

console.log('Admin publication flow check OK');
