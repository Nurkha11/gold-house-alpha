export type PropertyVideo = {
  label: string;
  duration: string;
};

export type ViewingTime = {
  day: string;
  time: string;
};

export type Property = {
  id: string;
  title: string;
  city: string;
  district: string;
  complexName: string;
  address: string;
  price: number;
  rooms: number;
  area: number;
  kitchenArea?: number;
  floor: number;
  totalFloors: number;
  year: number;
  buildingMaterial: string;
  renovation: string;
  furniture: string;
  appliances: string;
  balcony: string;
  elevator: string;
  parking: string;
  ceilingHeight: number;
  matchPercent: number;
  verified: boolean;
  image: string;
  imageUrl: string;
  images: string[];
  description: string;
  tags: string[];
  aiSummary: string;
  pros: string[];
  cons: string[];
  fitFor: string[];
  sellingReason: string;
  availableViewingTime: ViewingTime;
  locationText: string;
  videos: PropertyVideo[];
  ownerName?: string;
  ownerPhone?: string;
};

const apartmentVideos: PropertyVideo[] = [
  { label: 'Квартира', duration: '1:18' },
  { label: 'Подъезд', duration: '0:32' },
  { label: 'Двор', duration: '0:45' },
  { label: 'Собственник', duration: '0:26' },
];

const images = {
  ulytau: [
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  ],
  alatau: [
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=80',
  ],
  alem: [
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-890987f18a86?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80',
  ],
  alma: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
  ],
  rough: [
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  ],
};

type BaseProperty = Omit<Property, 'id' | 'title' | 'floor' | 'totalFloors' | 'matchPercent' | 'availableViewingTime'>;

const baseLocation = 'Наурызбайский район. Рядом парк, школа, супермаркет и остановка.';

const ulytauPark: BaseProperty = {
  city: 'Алматы',
  district: 'Наурызбайский',
  complexName: 'Ulytau Park',
  address: 'ЖК Ulytau Park, Наурызбайский район',
  price: 19_000_000,
  rooms: 1,
  area: 32,
  year: 2026,
  buildingMaterial: 'Монолит',
  renovation: 'Черновая отделка',
  furniture: 'Нет',
  appliances: 'Нет',
  balcony: 'Да',
  elevator: 'Да',
  parking: 'Нет',
  ceilingHeight: 2.8,
  verified: true,
  image: images.ulytau[0],
  imageUrl: images.ulytau[0],
  images: images.ulytau,
  description: 'Однокомнатная квартира в ЖК Ulytau Park. Черновая отделка, балкон, лифт, без мебели и техники.',
  tags: ['Ulytau Park', 'Черновая отделка', 'Балкон', 'Первое жилье'],
  aiSummary: 'Квартира подходит как первая покупка: 1 комната, цена 19 000 000 ₸, монолитный дом 2026 года и черновая отделка.',
  pros: ['Хороший вид из окна', 'Идеально подходит как первая квартира'],
  cons: ['Много квартир на этаже', 'Нет парковки', 'Требуется ремонт'],
  fitFor: ['Один человек', 'Молодая семья'],
  sellingReason: 'Покупали для сына, но он переехал в Астану.',
  locationText: `ЖК Ulytau Park. ${baseLocation}`,
  videos: apartmentVideos,
  ownerPhone: '+77021734499',
};

const alatauPlus: BaseProperty = {
  city: 'Алматы',
  district: 'Наурызбайский',
  complexName: 'Alatau Plus',
  address: 'ЖК Alatau Plus, Наурызбайский район',
  price: 22_000_000,
  rooms: 1,
  area: 32,
  year: 2026,
  buildingMaterial: 'Монолит',
  renovation: 'Евроремонт',
  furniture: 'Итальянская',
  appliances: 'Немецкая',
  balcony: 'Да',
  elevator: 'Да',
  parking: 'Нет',
  ceilingHeight: 2.8,
  verified: true,
  image: images.alatau[0],
  imageUrl: images.alatau[0],
  images: images.alatau,
  description: 'Однокомнатная квартира в ЖК Alatau Plus с евроремонтом, итальянской мебелью и немецкой техникой.',
  tags: ['Alatau Plus', 'Евроремонт', 'Итальянская мебель', 'Можно заехать'],
  aiSummary: 'Готовый вариант для проживания: 1 комната, цена 22 000 000 ₸, ремонт, мебель и техника уже есть.',
  pros: ['Хороший вид', 'Можно сразу заехать', 'Качественный ремонт', 'Дорогая мебель и техника'],
  cons: ['Нет парковки', 'Много квартир на этаже'],
  fitFor: ['Один человек', 'Молодая семья'],
  sellingReason: 'Готовили квартиру для дочери, но она переехала в США.',
  locationText: `ЖК Alatau Plus. ${baseLocation}`,
  videos: apartmentVideos,
  ownerPhone: '+77022222222',
};

const alemCity: BaseProperty = {
  city: 'Алматы',
  district: 'Наурызбайский',
  complexName: 'Алем Сити',
  address: 'ЖК Алем Сити, Наурызбайский район',
  price: 23_000_000,
  rooms: 1,
  area: 32,
  year: 2026,
  buildingMaterial: 'Монолит',
  renovation: 'Хороший ремонт',
  furniture: 'Итальянская',
  appliances: 'Немецкая',
  balcony: 'Да',
  elevator: 'Да',
  parking: 'Нет',
  ceilingHeight: 2.8,
  verified: true,
  image: images.alem[0],
  imageUrl: images.alem[0],
  images: images.alem,
  description: 'Однокомнатная квартира в ЖК Алем Сити с хорошим ремонтом, мебелью и техникой.',
  tags: ['Алем Сити', 'Хороший ремонт', 'Готова к проживанию', 'Балкон'],
  aiSummary: 'Квартира готова к проживанию: 1 комната, цена 23 000 000 ₸, хороший ремонт, итальянская мебель и немецкая техника.',
  pros: ['Хороший вид', 'Готова к проживанию', 'Хороший ремонт'],
  cons: ['Нет парковки', 'Много квартир на этаже'],
  fitFor: ['Один человек', 'Молодая семья'],
  sellingReason: 'Покупаем квартиру большей площади.',
  locationText: `ЖК Алем Сити. ${baseLocation}`,
  videos: apartmentVideos,
  ownerPhone: '+77011111111',
};

const almaCity4: BaseProperty = {
  city: 'Алматы',
  district: 'Наурызбайский',
  complexName: 'Алма Сити 4',
  address: 'ЖК Алма Сити 4, Наурызбайский район',
  price: 23_000_000,
  rooms: 1,
  area: 32,
  year: 2026,
  buildingMaterial: 'Монолит',
  renovation: 'Старый ремонт',
  furniture: 'Российская',
  appliances: 'Старая',
  balcony: 'Да',
  elevator: 'Да',
  parking: 'Нет',
  ceilingHeight: 2.8,
  verified: true,
  image: images.alma[0],
  imageUrl: images.alma[0],
  images: images.alma,
  description: 'Однокомнатная квартира в ЖК Алма Сити 4 со старым ремонтом, российской мебелью и старой техникой.',
  tags: ['Алма Сити 4', 'Старый ремонт', 'Можно обновить', 'Балкон'],
  aiSummary: 'Квартира с существующим старым ремонтом: 1 комната, цена 23 000 000 ₸, можно жить и постепенно обновлять.',
  pros: ['Есть ремонт', 'Можно постепенно обновить квартиру'],
  cons: ['Нет парковки', 'Много квартир на этаже'],
  fitFor: ['Один человек', 'Молодая семья'],
  sellingReason: 'Покупаем квартиру большей площади.',
  locationText: `ЖК Алма Сити 4. ${baseLocation}`,
  videos: apartmentVideos,
  ownerPhone: '+77077777777',
};

const roughBase: BaseProperty = {
  city: 'Алматы',
  district: 'Наурызбайский',
  complexName: 'Gold Rough Test',
  address: 'Наурызбайский район, квартира без ремонта',
  price: 20_500_000,
  rooms: 1,
  area: 34,
  year: 2026,
  buildingMaterial: 'Монолит',
  renovation: 'Черновая планировка',
  furniture: 'Нет',
  appliances: 'Нет',
  balcony: 'Да',
  elevator: 'Да',
  parking: 'Нет',
  ceilingHeight: 2.8,
  verified: true,
  image: images.rough[0],
  imageUrl: images.rough[0],
  images: images.rough,
  description: 'Черновая планировка — голые стены, без чистовой отделки. Можно сделать ремонт полностью под себя.',
  tags: ['Черновая планировка', 'Без мебели', 'Без техники', 'Ремонт под себя'],
  aiSummary: 'Черновая планировка: голые стены, без чистовой отделки, без кухни и сантехники. Подходит покупателю, который хочет сделать ремонт полностью под себя.',
  pros: ['Можно сделать ремонт полностью под себя', 'Новая база для индивидуального дизайна'],
  cons: ['Голые серые стены', 'Без чистовой отделки', 'Без кухни', 'Без сантехники', 'Требуется полный ремонт'],
  fitFor: ['Покупатель под ремонт', 'Инвестор', 'Один человек'],
  sellingReason: 'Инвестиционный объект без ремонта выставлен на продажу.',
  locationText: `Квартира без ремонта. ${baseLocation}`,
  videos: apartmentVideos,
  ownerPhone: '+77030000000',
};

function createProperty(base: BaseProperty, id: string, floor: number, totalFloors: number, matchPercent: number, day: string): Property {
  return {
    ...base,
    id,
    title: `${base.rooms}-комнатная в ${base.complexName}, ${floor}/${totalFloors} этаж`,
    floor,
    totalFloors,
    matchPercent,
    availableViewingTime: { day, time: day === 'Сегодня' ? '18:00–20:00' : '12:00–14:00' },
  };
}

function createRoughProperty(id: string, complexName: string, price: number, floor: number, totalFloors: number, matchPercent: number, imageIndex: number): Property {
  return createProperty(
    {
      ...roughBase,
      complexName,
      address: `ЖК ${complexName}, Наурызбайский район`,
      price,
      image: images.rough[imageIndex % images.rough.length],
      imageUrl: images.rough[imageIndex % images.rough.length],
      images: [images.rough[imageIndex % images.rough.length], ...images.rough.filter((_, index) => index !== imageIndex % images.rough.length)],
      locationText: `ЖК ${complexName}. ${baseLocation}`,
      ownerPhone: `+7703000000${imageIndex + 1}`,
    },
    id,
    floor,
    totalFloors,
    matchPercent,
    imageIndex % 2 === 0 ? 'Сегодня' : 'Завтра',
  );
}

function createPriceAreaProperty({
  id,
  complexName,
  price,
  area,
  floor,
  totalFloors,
  renovation,
  furniture,
  appliances,
  pros,
  cons,
  matchPercent,
  imageIndex,
}: {
  id: string;
  complexName: string;
  price: number;
  area: number;
  floor: number;
  totalFloors: number;
  renovation: string;
  furniture: string;
  appliances: string;
  pros: string[];
  cons: string[];
  matchPercent: number;
  imageIndex: number;
}): Property {
  const imagePool = [images.ulytau[imageIndex % images.ulytau.length], images.alatau[imageIndex % images.alatau.length], images.alem[imageIndex % images.alem.length]];
  const image = imagePool[imageIndex % imagePool.length];
  const priceLabel = new Intl.NumberFormat('ru-RU').format(price);

  return createProperty(
    {
      city: 'Алматы',
      district: 'Наурызбайский',
      complexName,
      address: `ЖК ${complexName}, Наурызбайский район`,
      price,
      rooms: 1,
      area,
      year: 2026,
      buildingMaterial: 'Монолит',
      renovation,
      furniture,
      appliances,
      balcony: 'Да',
      elevator: 'Да',
      parking: 'Нет',
      ceilingHeight: 2.8,
      verified: true,
      image,
      imageUrl: image,
      images: imagePool,
      description: `Однокомнатная квартира площадью ${area} м² за ${priceLabel} ₸. Объект добавлен для проверки влияния цены и площади на рекомендации.`,
      tags: [`${area} м²`, `${priceLabel} ₸`, renovation, complexName],
      aiSummary: `Тестовый объект для price/area scoring: ${area} м², ${priceLabel} ₸, ${renovation}.`,
      pros,
      cons,
      fitFor: ['Один человек', 'Покупатель, сравнивающий цену и площадь'],
      sellingReason: 'Тестовый объект Gold House для проверки рекомендательного алгоритма.',
      locationText: `ЖК ${complexName}. ${baseLocation}`,
      videos: apartmentVideos,
      ownerPhone: `+770400000${imageIndex.toString().padStart(2, '0')}`,
    },
    id,
    floor,
    totalFloors,
    matchPercent,
    imageIndex % 2 === 0 ? 'Сегодня' : 'Завтра',
  );
}

type TwoRoomPropertyInput = {
  id: string;
  complexName: string;
  rooms?: number;
  price: number;
  area: number;
  floor: number;
  totalFloors: number;
  year: number;
  buildingMaterial: string;
  ceilingHeight: number;
  balcony: string;
  elevator: string;
  parking: string;
  renovation: 'Черновая отделка' | 'Старый ремонт' | 'Хороший ремонт' | 'Евроремонт';
  furniture: 'Нет' | 'Частично' | 'Полностью';
  appliances: 'Нет' | 'Частично' | 'Полностью';
  pros: string[];
  cons: string[];
  fitFor: string[];
  sellingReason: string;
  ownerPhone: string;
  aiSummary: string;
  matchPercent: number;
  imageSet: keyof typeof images;
};

function createTwoRoomProperty(input: TwoRoomPropertyInput): Property {
  const imagePool = images[input.imageSet];
  const image = imagePool[input.floor % imagePool.length];
  const priceLabel = new Intl.NumberFormat('ru-RU').format(input.price);

  return createProperty(
    {
      city: 'Алматы',
      district: 'Наурызбайский',
      complexName: input.complexName,
      address: `ЖК ${input.complexName}, Наурызбайский район`,
      price: input.price,
      rooms: input.rooms ?? 2,
      area: input.area,
      year: input.year,
      buildingMaterial: input.buildingMaterial,
      renovation: input.renovation,
      furniture: input.furniture,
      appliances: input.appliances,
      balcony: input.balcony,
      elevator: input.elevator,
      parking: input.parking,
      ceilingHeight: input.ceilingHeight,
      verified: true,
      image,
      imageUrl: image,
      images: imagePool,
      description: `${input.area} м², 2 комнаты, ${input.floor}/${input.totalFloors} этаж. ${input.aiSummary}`,
      tags: [input.complexName, '2 комнаты', input.renovation, `${input.area} м²`, `${priceLabel} ₸`],
      aiSummary: input.aiSummary,
      pros: input.pros,
      cons: input.cons,
      fitFor: input.fitFor,
      sellingReason: input.sellingReason,
      locationText: `ЖК ${input.complexName}. Наурызбайский район. Рядом школа, супермаркет, остановка и прогулочная зона.`,
      videos: apartmentVideos,
      ownerPhone: input.ownerPhone,
    },
    input.id,
    input.floor,
    input.totalFloors,
    input.matchPercent,
    input.floor === 1 ? 'Сегодня' : 'Завтра',
  );
}

export const properties: Property[] = [
  createProperty(ulytauPark, 'gh-test-001', 4, 9, 92, 'Сегодня'),
  createProperty(alatauPlus, 'gh-test-002', 7, 9, 94, 'Сегодня'),
  createProperty(alemCity, 'gh-test-003', 5, 9, 95, 'Завтра'),
  createProperty(almaCity4, 'gh-test-004', 2, 9, 88, 'Завтра'),
  createProperty(ulytauPark, 'gh-test-005', 1, 9, 84, 'Сегодня'),
  createProperty(alatauPlus, 'gh-test-006', 1, 9, 87, 'Сегодня'),
  createProperty(alemCity, 'gh-test-007', 1, 9, 88, 'Завтра'),
  createProperty(almaCity4, 'gh-test-008', 1, 9, 82, 'Завтра'),
  createProperty(ulytauPark, 'gh-test-009', 9, 9, 85, 'Сегодня'),
  createProperty(alatauPlus, 'gh-test-010', 9, 9, 89, 'Сегодня'),
  createProperty(alemCity, 'gh-test-011', 9, 9, 90, 'Завтра'),
  createProperty(almaCity4, 'gh-test-012', 9, 9, 83, 'Завтра'),
  createRoughProperty('gh-rough-001', 'Ulytau Park Draft', 19_500_000, 1, 5, 80, 0),
  createRoughProperty('gh-rough-002', 'Alatau Plus Draft', 20_000_000, 1, 9, 81, 1),
  createRoughProperty('gh-rough-003', 'Алем Сити Draft', 20_500_000, 1, 18, 82, 2),
  createRoughProperty('gh-rough-004', 'Алма Сити Draft', 21_000_000, 2, 5, 86, 0),
  createRoughProperty('gh-rough-005', 'Ulytau Park Grey', 21_500_000, 4, 9, 87, 1),
  createRoughProperty('gh-rough-006', 'Alatau Plus Grey', 22_000_000, 8, 18, 88, 2),
  createRoughProperty('gh-rough-007', 'Алем Сити Grey', 22_500_000, 5, 5, 83, 0),
  createRoughProperty('gh-rough-008', 'Алма Сити Grey', 23_000_000, 9, 9, 84, 1),
  createRoughProperty('gh-rough-009', 'Naýryz Grey House', 23_000_000, 18, 18, 85, 2),
  createPriceAreaProperty({ id: 'gh-price-area-001', complexName: 'Ulytau Compact', price: 18_000_000, area: 30, floor: 2, totalFloors: 9, renovation: 'Старый ремонт', furniture: 'Частично', appliances: 'Нет', pros: ['Самая доступная цена', 'Низкий порог входа', 'Подходит как первое жилье'], cons: ['Небольшая площадь', 'Техника не остается'], matchPercent: 82, imageIndex: 1 }),
  createPriceAreaProperty({ id: 'gh-price-area-002', complexName: 'Alatau Mini', price: 18_500_000, area: 31, floor: 1, totalFloors: 5, renovation: 'Черновая планировка', furniture: 'Нет', appliances: 'Нет', pros: ['Низкая цена', 'Можно сделать ремонт под себя'], cons: ['Первый этаж', 'Требуется полный ремонт'], matchPercent: 80, imageIndex: 2 }),
  createPriceAreaProperty({ id: 'gh-price-area-003', complexName: 'Alem Smart', price: 19_000_000, area: 32, floor: 5, totalFloors: 9, renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', pros: ['Доступная цена', 'Средний этаж', 'Есть базовая мебель'], cons: ['Компактная площадь', 'Кухня небольшая'], matchPercent: 85, imageIndex: 3 }),
  createPriceAreaProperty({ id: 'gh-price-area-004', complexName: 'Alma Balance', price: 21_000_000, area: 34, floor: 4, totalFloors: 9, renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', pros: ['Баланс цены и площади', 'Средний этаж', 'Можно быстро заехать'], cons: ['Нет парковки', 'Не вся техника остается'], matchPercent: 88, imageIndex: 4 }),
  createPriceAreaProperty({ id: 'gh-price-area-005', complexName: 'Ulytau Standard', price: 22_000_000, area: 35, floor: 7, totalFloors: 18, renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Частично', pros: ['Средняя площадь', 'Евроремонт', 'Мебель остается'], cons: ['Цена выше компактных вариантов', 'Высокий этаж подойдет не всем'], matchPercent: 90, imageIndex: 5 }),
  createPriceAreaProperty({ id: 'gh-price-area-006', complexName: 'Alatau Middle', price: 23_000_000, area: 36, floor: 9, totalFloors: 9, renovation: 'Старый ремонт', furniture: 'Частично', appliances: 'Старая', pros: ['Больше места, чем в компактных квартирах', 'Понятная цена за метр'], cons: ['Последний этаж', 'Ремонт устарел'], matchPercent: 84, imageIndex: 6 }),
  createPriceAreaProperty({ id: 'gh-price-area-007', complexName: 'Alem Space', price: 25_000_000, area: 38, floor: 3, totalFloors: 9, renovation: 'Хороший ремонт', furniture: 'Полностью', appliances: 'Полностью', pros: ['Большая площадь для 1-комнатной', 'Мебель и техника остаются', 'Средний этаж'], cons: ['Цена выше среднего сегмента', 'Нет парковки'], matchPercent: 91, imageIndex: 7 }),
  createPriceAreaProperty({ id: 'gh-price-area-008', complexName: 'Alma Large', price: 26_000_000, area: 40, floor: 8, totalFloors: 18, renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Немецкая', pros: ['Около 40 м²', 'Евроремонт', 'Хорошая техника'], cons: ['Высокая цена', 'Коммунальные расходы выше'], matchPercent: 93, imageIndex: 8 }),
  createPriceAreaProperty({ id: 'gh-price-area-009', complexName: 'Naýryz Grand 1', price: 27_000_000, area: 42, floor: 18, totalFloors: 18, renovation: 'Хороший ремонт', furniture: 'Полностью', appliances: 'Полностью', pros: ['Максимальная площадь в тестовой группе', 'Готова к проживанию', 'Видовой этаж'], cons: ['Самая высокая цена группы', 'Последний этаж'], matchPercent: 92, imageIndex: 9 }),
  createTwoRoomProperty({ id: 'gh-2room-001', complexName: 'Ulytau Park', price: 29_000_000, area: 50, floor: 1, totalFloors: 9, year: 2026, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Черновая отделка', furniture: 'Нет', appliances: 'Нет', pros: ['Новая планировка', 'Можно сделать ремонт под себя', 'Цена у нижней границы сегмента'], cons: ['Первый этаж', 'Нужен полный ремонт', 'Парковка не закреплена'], fitFor: ['Молодая семья', 'Покупатель под ремонт'], sellingReason: 'Переезд в другой город.', ownerPhone: '+77051000001', aiSummary: 'Двухкомнатная квартира в черновой отделке. Хороший вариант для тех, кто хочет сделать ремонт полностью под себя.', matchPercent: 84, imageSet: 'ulytau' }),
  createTwoRoomProperty({ id: 'gh-2room-002', complexName: 'Ulytau Park', price: 31_000_000, area: 54, floor: 5, totalFloors: 9, year: 2026, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', pros: ['Средний этаж', 'Удобная площадь для семьи', 'Можно быстро заехать'], cons: ['Часть мебели нужно докупить', 'Парковка во дворе общая'], fitFor: ['Молодая семья', 'Пара с ребенком'], sellingReason: 'Планируем расширение.', ownerPhone: '+77051000002', aiSummary: 'Светлая двухкомнатная квартира с хорошим ремонтом. Подойдет молодой семье, можно заехать без долгой подготовки.', matchPercent: 91, imageSet: 'ulytau' }),
  createTwoRoomProperty({ id: 'gh-2room-003', complexName: 'Ulytau Park', price: 33_000_000, area: 58, floor: 9, totalFloors: 9, year: 2026, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', pros: ['Готова к проживанию', 'Мебель и техника остаются', 'Видовой последний этаж'], cons: ['Последний этаж', 'Цена выше базовых вариантов'], fitFor: ['Семья', 'Покупатель без ремонта'], sellingReason: 'Переезжаем ближе к работе.', ownerPhone: '+77051000003', aiSummary: 'Просторная двухкомнатная квартира с евроремонтом. Подойдет семье, которая хочет сразу заехать и жить.', matchPercent: 93, imageSet: 'ulytau' }),
  createTwoRoomProperty({ id: 'gh-2room-004', complexName: 'Alatau Plus', price: 30_000_000, area: 52, floor: 1, totalFloors: 12, year: 2025, buildingMaterial: 'Монолит', ceilingHeight: 2.9, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Старый ремонт', furniture: 'Частично', appliances: 'Нет', pros: ['Есть парковка', 'Площадь больше 50 м²', 'Можно жить и постепенно обновлять'], cons: ['Первый этаж', 'Ремонт требует обновления', 'Техника не остается'], fitFor: ['Семья', 'Покупатель с бюджетом на обновление'], sellingReason: 'Купили квартиру большей площади.', ownerPhone: '+77051000004', aiSummary: 'Двухкомнатная квартира со старым ремонтом. Можно жить сейчас и постепенно обновлять интерьер под себя.', matchPercent: 86, imageSet: 'alatau' }),
  createTwoRoomProperty({ id: 'gh-2room-005', complexName: 'Alatau Plus', price: 32_000_000, area: 56, floor: 6, totalFloors: 12, year: 2025, buildingMaterial: 'Монолит', ceilingHeight: 2.9, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', pros: ['Средний этаж', 'Есть парковка', 'Хороший баланс цены и площади'], cons: ['Не вся техника остается', 'Нужно докупить часть мебели'], fitFor: ['Молодая семья', 'Семья с одним ребенком'], sellingReason: 'Переезжаем ближе к школе.', ownerPhone: '+77051000005', aiSummary: 'Двухкомнатная квартира с хорошим ремонтом и удобной площадью. Подойдет семье, которой важен средний этаж.', matchPercent: 92, imageSet: 'alatau' }),
  createTwoRoomProperty({ id: 'gh-2room-006', complexName: 'Alatau Plus', price: 35_000_000, area: 66, floor: 12, totalFloors: 12, year: 2025, buildingMaterial: 'Монолит', ceilingHeight: 2.9, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', pros: ['Максимальная площадь в группе', 'Евроремонт', 'Парковка'], cons: ['Последний этаж', 'Самая высокая цена в группе'], fitFor: ['Семья', 'Покупатель, которому нужна большая площадь'], sellingReason: 'Переезд в частный дом.', ownerPhone: '+77051000006', aiSummary: 'Большая двухкомнатная квартира с евроремонтом. Хороший вариант для семьи, которой нужна площадь до 66 м².', matchPercent: 94, imageSet: 'alatau' }),
  createTwoRoomProperty({ id: 'gh-2room-007', complexName: 'Алем Сити', price: 29_500_000, area: 50, floor: 1, totalFloors: 10, year: 2024, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Черновая отделка', furniture: 'Нет', appliances: 'Нет', pros: ['Доступная цена для 2 комнат', 'Можно спланировать ремонт под себя', 'Новый дом'], cons: ['Первый этаж', 'Без мебели и техники', 'Нужен ремонт'], fitFor: ['Покупатель под ремонт', 'Молодая семья'], sellingReason: 'Продаем инвестиционный объект.', ownerPhone: '+77051000007', aiSummary: 'Двухкомнатная квартира в черновой отделке. Подойдет тем, кто хочет самостоятельно выбрать материалы и планировку.', matchPercent: 83, imageSet: 'alem' }),
  createTwoRoomProperty({ id: 'gh-2room-008', complexName: 'Алем Сити', price: 32_500_000, area: 60, floor: 5, totalFloors: 10, year: 2024, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', pros: ['Средний этаж', '60 м²', 'Хороший ремонт'], cons: ['Парковка не закреплена', 'Часть мебели забирают'], fitFor: ['Семья', 'Пара с ребенком'], sellingReason: 'Меняем район из-за работы.', ownerPhone: '+77051000008', aiSummary: 'Просторная двухкомнатная квартира с хорошим ремонтом. Подойдет семье, которой важны средний этаж и площадь около 60 м².', matchPercent: 92, imageSet: 'alem' }),
  createTwoRoomProperty({ id: 'gh-2room-009', complexName: 'Алем Сити', price: 34_000_000, area: 64, floor: 10, totalFloors: 10, year: 2024, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Частично', pros: ['Большая площадь', 'Евроремонт', 'Мебель остается'], cons: ['Последний этаж', 'Не вся техника остается'], fitFor: ['Семья', 'Покупатель готового жилья'], sellingReason: 'Переезд к родителям ближе.', ownerPhone: '+77051000009', aiSummary: 'Двухкомнатная квартира с евроремонтом и большой площадью. Можно заехать и жить без капитальных вложений.', matchPercent: 93, imageSet: 'alem' }),
  createTwoRoomProperty({ id: 'gh-2room-010', complexName: 'Алма Сити 4', price: 30_500_000, area: 52, floor: 1, totalFloors: 16, year: 2023, buildingMaterial: 'Монолит', ceilingHeight: 2.7, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Старый ремонт', furniture: 'Частично', appliances: 'Частично', pros: ['Есть парковка', 'Можно жить сразу', 'Цена спокойная для 2 комнат'], cons: ['Первый этаж', 'Ремонт не новый'], fitFor: ['Семья', 'Покупатель с умеренным бюджетом'], sellingReason: 'Покупаем квартиру ближе к центру.', ownerPhone: '+77051000010', aiSummary: 'Двухкомнатная квартира со старым ремонтом. Подойдет тем, кому важно заехать быстро и обновлять квартиру постепенно.', matchPercent: 86, imageSet: 'alma' }),
  createTwoRoomProperty({ id: 'gh-2room-011', complexName: 'Алма Сити 4', price: 33_000_000, area: 62, floor: 8, totalFloors: 16, year: 2023, buildingMaterial: 'Монолит', ceilingHeight: 2.7, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Хороший ремонт', furniture: 'Полностью', appliances: 'Частично', pros: ['Средний этаж', '62 м²', 'Мебель остается'], cons: ['Часть техники забирают', 'Потолки ниже, чем в новых ЖК'], fitFor: ['Семья', 'Покупатель без долгого ремонта'], sellingReason: 'Нужна квартира рядом с работой.', ownerPhone: '+77051000011', aiSummary: 'Двухкомнатная квартира с хорошим ремонтом и мебелью. Подойдет семье, которой нужна площадь больше 60 м².', matchPercent: 91, imageSet: 'alma' }),
  createTwoRoomProperty({ id: 'gh-2room-012', complexName: 'Алма Сити 4', price: 35_000_000, area: 66, floor: 16, totalFloors: 16, year: 2023, buildingMaterial: 'Монолит', ceilingHeight: 2.7, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', pros: ['Большая площадь', 'Готова к проживанию', 'Парковка'], cons: ['Последний этаж', 'Цена у верхней границы диапазона'], fitFor: ['Семья', 'Покупатель готового жилья'], sellingReason: 'Переезжаем в дом за городом.', ownerPhone: '+77051000012', aiSummary: 'Просторная двухкомнатная квартира с евроремонтом. Подойдет семье, которая хочет сразу заехать и жить.', matchPercent: 94, imageSet: 'alma' }),
  createTwoRoomProperty({ id: 'gh-3room-001', rooms: 3, complexName: 'Ulytau Park', price: 38_000_000, area: 70, floor: 1, totalFloors: 9, year: 2026, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Черновая отделка', furniture: 'Нет', appliances: 'Нет', pros: ['70 м² для семьи', 'Можно сделать ремонт под себя', 'Новый дом'], cons: ['Первый этаж', 'Нужен полный ремонт', 'Парковка не закреплена'], fitFor: ['Семья с ребенком', 'Покупатель под ремонт'], sellingReason: 'Переезд в другой город.', ownerPhone: '+77053000001', aiSummary: 'Трехкомнатная квартира в черновой отделке. Подойдет семье, которая хочет сделать ремонт полностью под себя.', matchPercent: 84, imageSet: 'ulytau' }),
  createTwoRoomProperty({ id: 'gh-3room-002', rooms: 3, complexName: 'Ulytau Park', price: 42_000_000, area: 78, floor: 5, totalFloors: 9, year: 2026, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', pros: ['Средний этаж', 'Удобная планировка для семьи', 'Хороший ремонт'], cons: ['Парковка общая', 'Часть мебели нужно докупить'], fitFor: ['Семья с детьми', 'Покупатель без капитального ремонта'], sellingReason: 'Планируем переезд ближе к школе.', ownerPhone: '+77053000002', aiSummary: 'Трехкомнатная квартира с хорошим ремонтом и удобной площадью. Подойдет семье, которой важен средний этаж.', matchPercent: 91, imageSet: 'ulytau' }),
  createTwoRoomProperty({ id: 'gh-3room-003', rooms: 3, complexName: 'Ulytau Park', price: 47_000_000, area: 86, floor: 9, totalFloors: 9, year: 2026, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', pros: ['Большая площадь', 'Евроремонт', 'Мебель и техника остаются'], cons: ['Последний этаж', 'Цена ближе к верхней границе'], fitFor: ['Большая семья', 'Покупатель готового жилья'], sellingReason: 'Переезжаем в частный дом.', ownerPhone: '+77053000003', aiSummary: 'Просторная трехкомнатная квартира с евроремонтом. Можно сразу заехать и жить большой семье.', matchPercent: 94, imageSet: 'ulytau' }),
  createTwoRoomProperty({ id: 'gh-3room-004', rooms: 3, complexName: 'Alatau Plus', price: 39_000_000, area: 72, floor: 1, totalFloors: 12, year: 2025, buildingMaterial: 'Монолит', ceilingHeight: 2.9, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Старый ремонт', furniture: 'Частично', appliances: 'Нет', pros: ['Есть парковка', 'Можно жить и обновлять постепенно', 'Цена ниже среднего для 3 комнат'], cons: ['Первый этаж', 'Ремонт требует обновления', 'Техника не остается'], fitFor: ['Семья', 'Покупатель с бюджетом на ремонт'], sellingReason: 'Купили квартиру большей площади.', ownerPhone: '+77053000004', aiSummary: 'Трехкомнатная квартира со старым ремонтом. Можно заехать сейчас и постепенно обновлять интерьер.', matchPercent: 86, imageSet: 'alatau' }),
  createTwoRoomProperty({ id: 'gh-3room-005', rooms: 3, complexName: 'Alatau Plus', price: 43_000_000, area: 80, floor: 6, totalFloors: 12, year: 2025, buildingMaterial: 'Монолит', ceilingHeight: 2.9, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', pros: ['Средний этаж', '80 м²', 'Есть парковка'], cons: ['Не вся техника остается', 'Нужно освежить детскую'], fitFor: ['Семья с двумя детьми', 'Покупатель просторной квартиры'], sellingReason: 'Переезд ближе к работе.', ownerPhone: '+77053000005', aiSummary: 'Трехкомнатная квартира с хорошим ремонтом и площадью 80 м². Подойдет семье, которой нужно больше пространства.', matchPercent: 92, imageSet: 'alatau' }),
  createTwoRoomProperty({ id: 'gh-3room-006', rooms: 3, complexName: 'Alatau Plus', price: 50_000_000, area: 90, floor: 12, totalFloors: 12, year: 2025, buildingMaterial: 'Монолит', ceilingHeight: 2.9, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', pros: ['90 м²', 'Евроремонт', 'Парковка'], cons: ['Последний этаж', 'Цена у верхней границы диапазона'], fitFor: ['Большая семья', 'Покупатель готового жилья'], sellingReason: 'Переезд в дом за городом.', ownerPhone: '+77053000006', aiSummary: 'Большая трехкомнатная квартира с евроремонтом. Хороший вариант для семьи, которой нужна площадь до 90 м².', matchPercent: 95, imageSet: 'alatau' }),
  createTwoRoomProperty({ id: 'gh-3room-007', rooms: 3, complexName: 'Алем Сити', price: 38_500_000, area: 70, floor: 1, totalFloors: 10, year: 2024, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Черновая отделка', furniture: 'Нет', appliances: 'Нет', pros: ['Доступная цена для 3 комнат', 'Новый дом', 'Можно выбрать ремонт самому'], cons: ['Первый этаж', 'Без мебели и техники', 'Нужен ремонт'], fitFor: ['Семья под ремонт', 'Инвестор'], sellingReason: 'Продаем инвестиционный объект.', ownerPhone: '+77053000007', aiSummary: 'Трехкомнатная квартира в черновой отделке. Подойдет тем, кто хочет спланировать семейное пространство с нуля.', matchPercent: 83, imageSet: 'alem' }),
  createTwoRoomProperty({ id: 'gh-3room-008', rooms: 3, complexName: 'Алем Сити', price: 44_000_000, area: 82, floor: 5, totalFloors: 10, year: 2024, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', pros: ['Средний этаж', '82 м²', 'Хороший ремонт'], cons: ['Парковка не закреплена', 'Часть мебели забирают'], fitFor: ['Семья', 'Пара с двумя детьми'], sellingReason: 'Меняем район из-за работы.', ownerPhone: '+77053000008', aiSummary: 'Просторная трехкомнатная квартира с хорошим ремонтом. Подойдет семье, которой важны средний этаж и площадь больше 80 м².', matchPercent: 92, imageSet: 'alem' }),
  createTwoRoomProperty({ id: 'gh-3room-009', rooms: 3, complexName: 'Алем Сити', price: 48_000_000, area: 88, floor: 10, totalFloors: 10, year: 2024, buildingMaterial: 'Монолит', ceilingHeight: 2.8, balcony: 'Да', elevator: 'Да', parking: 'Нет', renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Частично', pros: ['88 м²', 'Евроремонт', 'Мебель остается'], cons: ['Последний этаж', 'Не вся техника остается'], fitFor: ['Большая семья', 'Покупатель готовой квартиры'], sellingReason: 'Переезд к родителям ближе.', ownerPhone: '+77053000009', aiSummary: 'Трехкомнатная квартира с евроремонтом и большой площадью. Можно заехать без капитальных вложений.', matchPercent: 93, imageSet: 'alem' }),
  createTwoRoomProperty({ id: 'gh-3room-010', rooms: 3, complexName: 'Алма Сити 4', price: 40_000_000, area: 74, floor: 1, totalFloors: 16, year: 2023, buildingMaterial: 'Монолит', ceilingHeight: 2.7, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Старый ремонт', furniture: 'Частично', appliances: 'Частично', pros: ['Есть парковка', 'Можно жить сразу', 'Цена умеренная для 3 комнат'], cons: ['Первый этаж', 'Ремонт не новый'], fitFor: ['Семья', 'Покупатель с умеренным бюджетом'], sellingReason: 'Покупаем квартиру ближе к центру.', ownerPhone: '+77053000010', aiSummary: 'Трехкомнатная квартира со старым ремонтом. Подойдет семье, которой важно быстро заехать и обновлять квартиру постепенно.', matchPercent: 86, imageSet: 'alma' }),
  createTwoRoomProperty({ id: 'gh-3room-011', rooms: 3, complexName: 'Алма Сити 4', price: 45_000_000, area: 84, floor: 8, totalFloors: 16, year: 2023, buildingMaterial: 'Монолит', ceilingHeight: 2.7, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Хороший ремонт', furniture: 'Полностью', appliances: 'Частично', pros: ['Средний этаж', '84 м²', 'Мебель остается'], cons: ['Часть техники забирают', 'Потолки ниже, чем в новых ЖК'], fitFor: ['Семья', 'Покупатель без долгого ремонта'], sellingReason: 'Нужна квартира рядом с работой.', ownerPhone: '+77053000011', aiSummary: 'Трехкомнатная квартира с хорошим ремонтом и мебелью. Подойдет семье, которой нужна площадь больше 80 м².', matchPercent: 91, imageSet: 'alma' }),
  createTwoRoomProperty({ id: 'gh-3room-012', rooms: 3, complexName: 'Алма Сити 4', price: 49_000_000, area: 90, floor: 16, totalFloors: 16, year: 2023, buildingMaterial: 'Монолит', ceilingHeight: 2.7, balcony: 'Да', elevator: 'Да', parking: 'Да', renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', pros: ['90 м²', 'Готова к проживанию', 'Парковка'], cons: ['Последний этаж', 'Цена ближе к верхней границе'], fitFor: ['Большая семья', 'Покупатель готового жилья'], sellingReason: 'Переезжаем в дом за городом.', ownerPhone: '+77053000012', aiSummary: 'Просторная трехкомнатная квартира с евроремонтом. Подойдет большой семье, которая хочет сразу заехать и жить.', matchPercent: 94, imageSet: 'alma' }),
];
