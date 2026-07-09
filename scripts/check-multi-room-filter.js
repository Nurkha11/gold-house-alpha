const properties = [
  { rooms: 1 },
  { rooms: 2 },
  { rooms: 3 },
  { rooms: 4 },
  { rooms: 5 },
];

function roomMatches(property, rooms) {
  const selectedRooms = String(rooms ?? '1')
    .split(',')
    .map((room) => room.trim())
    .filter(Boolean);

  if (!selectedRooms.length || selectedRooms.includes('all')) return true;
  return selectedRooms.some((room) => (room === '4+' ? property.rooms >= 4 : property.rooms === Number(room)));
}

const cases = [
  { rooms: '1', expected: [1] },
  { rooms: '2', expected: [2] },
  { rooms: '1,2', expected: [1, 2] },
  { rooms: '2,3', expected: [2, 3] },
  { rooms: 'all', expected: [1, 2, 3, 4, 5] },
  { rooms: '4+', expected: [4, 5] },
];

for (const item of cases) {
  const actual = properties.filter((property) => roomMatches(property, item.rooms)).map((property) => property.rooms);
  if (actual.join(',') !== item.expected.join(',')) {
    throw new Error(`Multi-room filter failed for ${item.rooms}. Expected ${item.expected.join(',')}, got ${actual.join(',')}.`);
  }
}

console.log('Multi-room hard-filter check passed.');
