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
  bostandyk: [
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80',
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

type BostandykPropertyInput = {
  id: string;
  complexName: string;
  rooms?: number;
  price: number;
  area: number;
  kitchenArea: number;
  floor: number;
  totalFloors: number;
  year: number;
  renovation: string;
  furniture: string;
  appliances: string;
  elevator: string;
  ceilingHeight: number;
  pros: string[];
  cons: string[];
  fitFor: string[];
  sellingReason: string;
  ownerPhone: string;
  aiSummary: string;
  matchPercent: number;
  imageOffset: number;
};

function createBostandykOneRoomProperty(input: BostandykPropertyInput): Property {
  const image = images.bostandyk[input.imageOffset % images.bostandyk.length];
  const gallery = [image, ...images.bostandyk.filter((_, index) => index !== input.imageOffset % images.bostandyk.length)];
  const priceLabel = new Intl.NumberFormat('ru-RU').format(input.price);
  const rooms = input.rooms ?? 1;
  const roomsLabel = rooms === 1 ? '1 комната' : `${rooms} комнаты`;

  return createProperty(
    {
      city: 'Алматы',
      district: 'Бостандыкский',
      complexName: input.complexName,
      address: `ЖК ${input.complexName}, Бостандыкский район`,
      price: input.price,
      rooms,
      area: input.area,
      kitchenArea: input.kitchenArea,
      year: input.year,
      buildingMaterial: 'Монолит',
      renovation: input.renovation,
      furniture: input.furniture,
      appliances: input.appliances,
      balcony: 'Да',
      elevator: input.elevator,
      parking: 'Да',
      ceilingHeight: input.ceilingHeight,
      verified: true,
      image,
      imageUrl: image,
      images: gallery,
      description: `${input.aiSummary} ${input.area} м², кухня ${input.kitchenArea} м², ${input.floor}/${input.totalFloors} этаж.`,
      tags: [input.complexName, 'Бостандыкский', roomsLabel, input.renovation, `${priceLabel} ₸`],
      aiSummary: input.aiSummary,
      pros: input.pros,
      cons: input.cons,
      fitFor: input.fitFor,
      sellingReason: input.sellingReason,
      locationText: `ЖК ${input.complexName}. Бостандыкский район. Рядом школа, супермаркет, остановка и городская инфраструктура.`,
      videos: apartmentVideos,
      ownerPhone: input.ownerPhone,
    },
    input.id,
    input.floor,
    input.totalFloors,
    input.matchPercent,
    input.imageOffset % 2 === 0 ? 'Сегодня' : 'Завтра',
  );
}

export const properties: Property[] = [
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-4you-001', complexName: '4YOU', price: 71_000_000, area: 48, kitchenArea: 15, floor: 5, totalFloors: 10, year: 2023, renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '2 лифта', ceilingHeight: 3, pros: ['Свежий евроремонт', 'Полностью меблирована', 'Техника остается', 'Средний этаж', 'Бостандыкский район'], cons: ['Высокая цена для однокомнатной квартиры'], fitFor: ['Молодая семья', 'Один человек'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000001', aiSummary: 'Готовая однокомнатная квартира с евроремонтом, мебелью и техникой. Подойдет тем, кто хочет сразу заехать и жить в Бостандыкском районе.', matchPercent: 92, imageOffset: 0 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-abay130-002', complexName: 'Abay130', price: 50_000_000, area: 37, kitchenArea: 10, floor: 6, totalFloors: 9, year: 2024, renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', elevator: '1 лифт', ceilingHeight: 3, pros: ['Свежий ремонт', 'Никто не жил', 'Новая мебель', 'Хороший вид из окон', 'Высокие двери'], cons: ['Часть мебели и техники нужно докупить'], fitFor: ['Молодая семья', 'Один человек'], sellingReason: 'Переезжаем в квартиру большей площади.', ownerPhone: '+77770000002', aiSummary: 'Однокомнатная квартира в новом доме со свежим ремонтом, хорошим видом и частичной мебелью. Подойдет для спокойного старта без капитального ремонта.', matchPercent: 90, imageOffset: 1 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-riviera-003', complexName: 'Riviera', price: 37_000_000, area: 42, kitchenArea: 12, floor: 10, totalFloors: 16, year: 2026, renovation: 'Черновая отделка', furniture: 'Нет', appliances: 'Нет', elevator: '2 лифта', ceilingHeight: 3, pros: ['Застройщик Bazis-A', 'Закрытый двор', 'Хорошая планировка', 'Можно сделать ремонт под себя'], cons: ['Требуется полный ремонт'], fitFor: ['Покупатель, который хочет сделать дизайн под себя', 'Покупатель, который сам выбирает материалы'], sellingReason: 'Изменились семейные планы.', ownerPhone: '+77770000003', aiSummary: 'Однокомнатная квартира в черновой отделке с закрытым двором и хорошей планировкой. Подойдет тем, кто хочет сделать ремонт полностью под себя.', matchPercent: 88, imageOffset: 2 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-akvarel-004', complexName: 'Акварель', price: 39_000_000, area: 40, kitchenArea: 10, floor: 5, totalFloors: 12, year: 2018, renovation: 'Старый ремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '2 лифта', ceilingHeight: 2.7, pros: ['Застройщик Bazis-A', 'Закрытый двор', 'Хорошая планировка', 'Развитая инфраструктура'], cons: ['Желательно обновить ремонт'], fitFor: ['Молодая семья', 'Один человек'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000004', aiSummary: 'Однокомнатная квартира в развитой части Бостандыкского района. Можно жить сейчас и постепенно обновить ремонт под себя.', matchPercent: 87, imageOffset: 0 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-4you-first-005', complexName: '4YOU', price: 67_000_000, area: 47, kitchenArea: 14, floor: 1, totalFloors: 10, year: 2023, renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '2 лифта', ceilingHeight: 3, pros: ['Евроремонт', 'Полностью готова к проживанию', 'Удобно для семьи с коляской', 'Быстрый выход во двор'], cons: ['Первый этаж', 'Меньше приватности'], fitFor: ['Молодая семья', 'Покупатель, которому важен быстрый доступ во двор'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000005', aiSummary: 'Готовая однокомнатная квартира на первом этаже в 4YOU. Подойдет тем, кому важны евроремонт, мебель и быстрый выход во двор.', matchPercent: 86, imageOffset: 1 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-abay130-first-006', complexName: 'Abay130', price: 48_000_000, area: 37, kitchenArea: 10, floor: 1, totalFloors: 9, year: 2024, renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', elevator: '1 лифт', ceilingHeight: 3, pros: ['Свежий ремонт', 'Новый дом', 'Удобный первый этаж', 'Хороший вариант для аренды'], cons: ['Первый этаж', 'Часть мебели и техники нужно докупить'], fitFor: ['Один человек', 'Инвестор под аренду'], sellingReason: 'Переезжаем в квартиру большей площади.', ownerPhone: '+77770000006', aiSummary: 'Однокомнатная квартира на первом этаже в Abay130 со свежим ремонтом. Хороший вариант для жизни или аренды без капитального ремонта.', matchPercent: 84, imageOffset: 2 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-riviera-first-007', complexName: 'Riviera', price: 35_000_000, area: 42, kitchenArea: 12, floor: 1, totalFloors: 16, year: 2026, renovation: 'Черновая отделка', furniture: 'Нет', appliances: 'Нет', elevator: '2 лифта', ceilingHeight: 3, pros: ['Застройщик Bazis-A', 'Закрытый двор', 'Можно сделать ремонт под себя', 'Цена ниже средних этажей'], cons: ['Первый этаж', 'Требуется полный ремонт'], fitFor: ['Покупатель под ремонт', 'Инвестор'], sellingReason: 'Изменились семейные планы.', ownerPhone: '+77770000007', aiSummary: 'Однокомнатная квартира на первом этаже в Riviera в черновой отделке. Подойдет покупателю, который хочет сделать ремонт полностью под себя.', matchPercent: 82, imageOffset: 0 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-akvarel-first-008', complexName: 'Акварель', price: 37_000_000, area: 40, kitchenArea: 10, floor: 1, totalFloors: 12, year: 2018, renovation: 'Старый ремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '2 лифта', ceilingHeight: 2.7, pros: ['Закрытый двор', 'Развитая инфраструктура', 'Мебель и техника остаются', 'Можно жить и обновлять постепенно'], cons: ['Первый этаж', 'Желательно обновить ремонт'], fitFor: ['Один человек', 'Молодая семья'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000008', aiSummary: 'Однокомнатная квартира на первом этаже в Акварели. Можно заехать сразу и постепенно обновить ремонт под себя.', matchPercent: 83, imageOffset: 1 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-4you-last-009', complexName: '4YOU', price: 69_000_000, area: 48, kitchenArea: 15, floor: 10, totalFloors: 10, year: 2023, renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '2 лифта', ceilingHeight: 3, pros: ['ЖК от BI Group', 'Закрытый двор', 'Полностью готова к заселению', 'Парковочное место в подарок', 'Отличная транспортная доступность', 'Нет соседей сверху'], cons: ['Последний этаж'], fitFor: ['Молодая семья', 'Один человек'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000009', aiSummary: 'Готовая однокомнатная квартира на последнем этаже в 4YOU с евроремонтом, мебелью и техникой. Подойдет тем, кто хочет заехать без ремонта.', matchPercent: 88, imageOffset: 2 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-abay130-last-010', complexName: 'Abay130', price: 48_000_000, area: 37, kitchenArea: 10, floor: 9, totalFloors: 9, year: 2024, renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', elevator: '1 лифт', ceilingHeight: 3, pros: ['Свежий ремонт', 'Никто не проживал', 'Новая мебель и техника', 'Красивый вид из окна', 'Высота дверей 2,2 м', 'Нет соседей сверху'], cons: ['Последний этаж'], fitFor: ['Молодая семья', 'Один человек'], sellingReason: 'Переезд в квартиру большей площади.', ownerPhone: '+77770000010', aiSummary: 'Однокомнатная квартира на последнем этаже в Abay130 со свежим ремонтом и красивым видом. Подойдет для спокойной жизни без капитального ремонта.', matchPercent: 86, imageOffset: 0 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-riviera-last-011', complexName: 'Riviera', price: 36_000_000, area: 42, kitchenArea: 12, floor: 16, totalFloors: 16, year: 2026, renovation: 'Черновая отделка', furniture: 'Нет', appliances: 'Нет', elevator: '2 лифта', ceilingHeight: 3, pros: ['ЖК от Bazis-A', 'Закрытый двор', 'Отличная планировка', 'Идеально для ремонта под себя', 'Нет соседей сверху'], cons: ['Последний этаж', 'Требуется полный ремонт'], fitFor: ['Покупатель, который хочет сделать квартиру полностью под себя'], sellingReason: 'Изменились семейные планы.', ownerPhone: '+77770000011', aiSummary: 'Однокомнатная квартира на последнем этаже в Riviera в черновой отделке. Подойдет тем, кто хочет сделать ремонт полностью под себя.', matchPercent: 84, imageOffset: 1 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-1room-akvarel-last-012', complexName: 'Акварель', price: 38_000_000, area: 40, kitchenArea: 10, floor: 12, totalFloors: 12, year: 2018, renovation: 'Старый ремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '2 лифта', ceilingHeight: 2.7, pros: ['ЖК от Bazis-A', 'Закрытый двор', 'Хорошая планировка', 'Развитая инфраструктура района', 'Нет соседей сверху'], cons: ['Последний этаж', 'Желательно обновить ремонт'], fitFor: ['Молодая семья', 'Один человек'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000012', aiSummary: 'Однокомнатная квартира на последнем этаже в Акварели с мебелью и техникой. Можно жить сейчас и постепенно обновить ремонт.', matchPercent: 85, imageOffset: 2 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-4you-middle-013', complexName: '4YOU', rooms: 2, price: 91_000_000, area: 78, kitchenArea: 15, floor: 6, totalFloors: 10, year: 2023, renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '2 лифта', ceilingHeight: 3, pros: ['ЖК от BI Group', 'Закрытый двор', 'Полностью готова к заселению', 'Парковочное место в подарок', 'Отличная транспортная доступность', 'Просторная площадь для двухкомнатной квартиры'], cons: ['Нет существенных недостатков'], fitFor: ['Молодая семья', 'Пара', 'Покупатель, которому нужно место для работы из дома'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000013', aiSummary: 'Просторная двухкомнатная квартира в 4YOU на среднем этаже с евроремонтом, мебелью и техникой. Подойдет семье или паре, которым важно дополнительное пространство.', matchPercent: 91, imageOffset: 0 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-simfoniya-middle-014', complexName: 'Симфония', rooms: 2, price: 53_000_000, area: 60, kitchenArea: 12, floor: 6, totalFloors: 12, year: 2024, renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', elevator: '1 лифт', ceilingHeight: 3, pros: ['Свежий ремонт', 'Никто не проживал', 'Новая мебель и техника', 'Красивый вид из окна', 'Высота дверей 2,2 м', 'Современный жилой комплекс'], cons: ['Квартира укомплектована мебелью и техникой только частично'], fitFor: ['Молодая семья', 'Пара', 'Один человек, которому нужна отдельная спальня'], sellingReason: 'Переезд в квартиру большей площади.', ownerPhone: '+77770000014', aiSummary: 'Двухкомнатная квартира в ЖК Симфония на среднем этаже со свежим хорошим ремонтом. Подойдет семье, паре или одному человеку, которому нужна отдельная спальня.', matchPercent: 88, imageOffset: 1 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-riviera-middle-015', complexName: 'Riviera', rooms: 2, price: 60_000_000, area: 72, kitchenArea: 12, floor: 9, totalFloors: 16, year: 2026, renovation: 'Черновая отделка', furniture: 'Нет', appliances: 'Нет', elevator: '2 лифта', ceilingHeight: 3, pros: ['ЖК от Bazis-A', 'Закрытый двор', 'Просторная площадь', 'Отличная планировка', 'Возможность выполнить ремонт полностью под себя', 'Средний этаж'], cons: ['Требуется полный ремонт', 'Необходимо приобрести мебель и технику'], fitFor: ['Покупатель, который хочет самостоятельно разработать дизайн и выполнить ремонт под себя'], sellingReason: 'Изменились семейные планы.', ownerPhone: '+77770000015', aiSummary: 'Двухкомнатная квартира в Riviera на среднем этаже в черновой отделке. Подойдет тем, кто хочет самостоятельно спланировать ремонт и интерьер.', matchPercent: 86, imageOffset: 2 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-4hills-middle-016', complexName: '4Hills', rooms: 2, price: 62_000_000, area: 54, kitchenArea: 10, floor: 2, totalFloors: 3, year: 2021, renovation: 'Старый ремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '1 лифт', ceilingHeight: 3, pros: ['Закрытый двор', 'Малоэтажный жилой комплекс', 'Хорошая планировка', 'Полностью укомплектована мебелью и техникой', 'Развитая инфраструктура района', 'Средний этаж'], cons: ['Желательно обновить ремонт', 'Компактная площадь для двухкомнатной квартиры'], fitFor: ['Молодая семья', 'Пара', 'Один человек, которому нужна компактная двухкомнатная квартира'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000016', aiSummary: 'Компактная двухкомнатная квартира в 4Hills на среднем этаже. Мебель и техника остаются, ремонт можно постепенно обновить.', matchPercent: 87, imageOffset: 0 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-4you-first-017', complexName: '4YOU', rooms: 2, price: 86_000_000, area: 76, kitchenArea: 15, floor: 1, totalFloors: 10, year: 2023, renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '2 лифта', ceilingHeight: 3, pros: ['ЖК от BI Group', 'Закрытый двор', 'Полностью готова к заселению', 'Парковочное место в подарок', 'Отличная транспортная доступность', 'Удобно семьям с маленькими детьми', 'Не нужно ждать лифт', 'Быстрый выход во двор'], cons: ['Первый этаж', 'Возможен шум со стороны двора или подъезда', 'Меньше приватности, чем на средних этажах'], fitFor: ['Молодая семья', 'Семья с маленьким ребенком', 'Пожилые люди', 'Покупатель, который не хочет зависеть от лифта'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000017', aiSummary: 'Двухкомнатная квартира на первом этаже в 4YOU с евроремонтом, мебелью и техникой. Подойдет семье с маленьким ребенком или тем, кому важен быстрый выход во двор.', matchPercent: 84, imageOffset: 1 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-simfoniya-first-018', complexName: 'Симфония', rooms: 2, price: 50_000_000, area: 60, kitchenArea: 10, floor: 1, totalFloors: 12, year: 2024, renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', elevator: '1 лифт', ceilingHeight: 3, pros: ['Свежий ремонт', 'Никто не проживал', 'Новая мебель и техника', 'Высота дверей 2,2 м', 'Удобный доступ без лифта', 'Быстрый выход из подъезда', 'Подходит для семьи с ребенком'], cons: ['Первый этаж', 'Мебелью и техникой укомплектована только частично', 'Возможен шум возле входной группы'], fitFor: ['Молодая семья', 'Семья с маленьким ребенком', 'Один человек, которому нужна отдельная спальня'], sellingReason: 'Переезд в квартиру большей площади.', ownerPhone: '+77770000018', aiSummary: 'Двухкомнатная квартира на первом этаже в ЖК Симфония со свежим хорошим ремонтом. Подойдет семье с ребенком или покупателю, которому нужна отдельная спальня.', matchPercent: 83, imageOffset: 2 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-riviera-first-019', complexName: 'Riviera', rooms: 2, price: 55_000_000, area: 75, kitchenArea: 12, floor: 1, totalFloors: 16, year: 2026, renovation: 'Черновая отделка', furniture: 'Нет', appliances: 'Нет', elevator: '2 лифта', ceilingHeight: 3, pros: ['ЖК от Bazis-A', 'Закрытый двор', 'Просторная площадь', 'Отличная планировка', 'Возможность сделать ремонт полностью под себя', 'Удобно заносить мебель и строительные материалы', 'Не нужно пользоваться лифтом во время ремонта'], cons: ['Первый этаж', 'Требуется полный ремонт', 'Необходимо приобрести мебель и технику', 'Возможен шум со стороны двора или входной группы'], fitFor: ['Покупатель под ремонт', 'Семья с ребенком', 'Покупатель, которому важен удобный доступ без лифта'], sellingReason: 'Изменились семейные планы.', ownerPhone: '+77770000019', aiSummary: 'Двухкомнатная квартира на первом этаже в Riviera в черновой отделке. Подойдет тем, кто хочет сделать ремонт под себя и ценит удобный доступ без лифта.', matchPercent: 82, imageOffset: 0 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-4hills-first-020', complexName: '4Hills', rooms: 2, price: 58_000_000, area: 54, kitchenArea: 10, floor: 1, totalFloors: 3, year: 2021, renovation: 'Старый ремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '1 лифт', ceilingHeight: 3, pros: ['Закрытый двор', 'Малоэтажный жилой комплекс', 'Хорошая планировка', 'Полностью укомплектована мебелью и техникой', 'Развитая инфраструктура района', 'Удобный выход во двор', 'Подходит семье с маленьким ребенком'], cons: ['Первый этаж', 'Желательно обновить ремонт', 'Компактная площадь для двухкомнатной квартиры', 'Меньше приватности, чем на верхних этажах'], fitFor: ['Молодая семья', 'Семья с маленьким ребенком', 'Пожилые люди', 'Один человек, которому нужна компактная двухкомнатная квартира'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000020', aiSummary: 'Компактная двухкомнатная квартира на первом этаже в 4Hills. Мебель и техника остаются, ремонт можно обновить постепенно.', matchPercent: 82, imageOffset: 1 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-4you-last-021', complexName: '4YOU', rooms: 2, price: 84_000_000, area: 76, kitchenArea: 15, floor: 10, totalFloors: 10, year: 2023, renovation: 'Евроремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '2 лифта', ceilingHeight: 3, pros: ['ЖК от BI Group', 'Закрытый двор', 'Полностью готова к заселению', 'Парковочное место в подарок', 'Отличная транспортная доступность', 'Красивый вид из окон', 'Нет соседей сверху', 'Меньше шума с улицы и из подъезда'], cons: ['Последний этаж', 'Зависимость от работы лифта', 'В жаркую погоду квартира может сильнее нагреваться', 'Необходимо проверить состояние крыши и технического этажа'], fitFor: ['Молодая семья', 'Пара', 'Один человек, который ценит красивый вид, тишину и отсутствие соседей сверху'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000021', aiSummary: 'Двухкомнатная квартира на последнем этаже в 4YOU с евроремонтом, мебелью и техникой. Подойдет тем, кто ценит красивый вид, тишину и готовый формат для заселения.', matchPercent: 85, imageOffset: 2 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-simfoniya-last-022', complexName: 'Симфония', rooms: 2, price: 48_000_000, area: 60, kitchenArea: 10, floor: 12, totalFloors: 12, year: 2024, renovation: 'Хороший ремонт', furniture: 'Частично', appliances: 'Частично', elevator: '1 лифт', ceilingHeight: 3, pros: ['Свежий ремонт', 'Никто не проживал', 'Новая мебель и техника', 'Высота дверей 2,2 м', 'Панорамный вид', 'Нет соседей сверху', 'Меньше шума от двора и входной группы'], cons: ['Последний этаж', 'Мебелью и техникой укомплектована только частично', 'Зависимость от одного лифта', 'В жаркое время квартира может сильнее нагреваться'], fitFor: ['Молодая семья', 'Пара', 'Один человек, который хочет новую квартиру с хорошим видом и отдельной спальней'], sellingReason: 'Переезд в квартиру большей площади.', ownerPhone: '+77770000022', aiSummary: 'Двухкомнатная квартира на последнем этаже в ЖК Симфония со свежим хорошим ремонтом и панорамным видом. Подойдет тем, кому важны новый дом и отдельная спальня.', matchPercent: 84, imageOffset: 0 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-riviera-last-023', complexName: 'Riviera', rooms: 2, price: 53_000_000, area: 75, kitchenArea: 12, floor: 16, totalFloors: 16, year: 2026, renovation: 'Черновая отделка', furniture: 'Нет', appliances: 'Нет', elevator: '2 лифта', ceilingHeight: 3, pros: ['ЖК от Bazis-A', 'Закрытый двор', 'Просторная площадь', 'Отличная планировка', 'Возможность сделать ремонт полностью под себя', 'Красивый вид с верхнего этажа', 'Нет соседей сверху', 'Меньше шума с улицы'], cons: ['Последний этаж', 'Требуется полный ремонт', 'Необходимо приобрести мебель и технику', 'Зависимость от лифта', 'Во время ремонта сложнее поднимать строительные материалы', 'Необходимо проверить состояние крыши и технического этажа'], fitFor: ['Покупатель, который хочет самостоятельно сделать дизайн квартиры, ценит простор, вид и отсутствие соседей сверху'], sellingReason: 'Изменились семейные планы.', ownerPhone: '+77770000023', aiSummary: 'Двухкомнатная квартира на последнем этаже в Riviera в черновой отделке. Подойдет тем, кто хочет сделать ремонт полностью под себя и ценит просторный видовой этаж.', matchPercent: 83, imageOffset: 1 }),
  createBostandykOneRoomProperty({ id: 'bostandyk-2room-4hills-last-024', complexName: '4Hills', rooms: 2, price: 56_000_000, area: 54, kitchenArea: 10, floor: 3, totalFloors: 3, year: 2021, renovation: 'Старый ремонт', furniture: 'Полностью', appliances: 'Полностью', elevator: '1 лифт', ceilingHeight: 3, pros: ['Закрытый двор', 'Малоэтажный жилой комплекс', 'Хорошая планировка', 'Полностью укомплектована мебелью и техникой', 'Развитая инфраструктура района', 'Нет соседей сверху', 'Меньше шума из подъезда', 'Последний этаж находится всего на третьем уровне'], cons: ['Последний этаж', 'Желательно обновить ремонт', 'Компактная площадь для двухкомнатной квартиры', 'Необходимо проверить состояние крыши', 'Зависимость от лифта при перевозке тяжелых вещей'], fitFor: ['Молодая семья', 'Пара', 'Один человек, который хочет жить в малоэтажном доме без соседей сверху'], sellingReason: 'Покупаем квартиру большей площади.', ownerPhone: '+77770000024', aiSummary: 'Компактная двухкомнатная квартира на последнем этаже в 4Hills. Мебель и техника остаются, ремонт можно обновить постепенно, а малоэтажный формат дает спокойное ощущение дома.', matchPercent: 83, imageOffset: 2 }),
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
