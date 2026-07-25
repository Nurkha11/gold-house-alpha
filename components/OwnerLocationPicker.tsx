import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { PropertyLocation, ResidentialComplexSuggestion } from '@/data/locationTypes';
import { YandexPropertyMap } from '@/components/YandexPropertyMap';
import {
  buildLocationWarnings,
  createLocation,
  findDuplicateComplexIds,
  findResidentialComplexes,
  residentialComplexes,
} from '@/data/residentialComplexes';
import { getYandexMapsApiKey, isDevelopmentMode, loadYandexMapsApi, YANDEX_MAPS_ENV_NAME } from '@/utils/loadYandexMapsApi';

type OwnerLocationPickerProps = {
  city: string;
  district: string;
  complexName: string;
  street: string;
  location?: PropertyLocation;
  complexId?: string;
  newComplex?: ResidentialComplexSuggestion | null;
  onAddressChange: (payload: {
    city: string;
    district: string;
    complexName: string;
    street: string;
    location: PropertyLocation;
    complexId?: string;
    newComplex?: ResidentialComplexSuggestion | null;
  }) => void;
};

const showMapDevDetails = isDevelopmentMode();

type YandexAddressSuggestion = {
  displayName: string;
  value: string;
  uri?: string;
};

export function OwnerLocationPicker({
  city,
  district,
  complexName,
  street,
  location,
  complexId,
  newComplex,
  onAddressChange,
}: OwnerLocationPickerProps) {
  const hasYandexKey = Boolean(getYandexMapsApiKey());
  const [addressQuery, setAddressQuery] = useState(street || complexName);
  const [complexQuery, setComplexQuery] = useState(complexName);
  const [isSearching, setIsSearching] = useState(false);
  const [addressSearchError, setAddressSearchError] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<YandexAddressSuggestion[]>([]);
  const [debouncedAddressQuery, setDebouncedAddressQuery] = useState(addressQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedAddressQuery(addressQuery), 420);
    return () => clearTimeout(timer);
  }, [addressQuery]);

  useEffect(() => {
    const query = debouncedAddressQuery.trim();
    if (query.length < 3) {
      setIsSearching(false);
      setAddressSuggestions([]);
      setAddressSearchError('');
      return;
    }

    if (!hasYandexKey) {
      setAddressSuggestions([]);
      setAddressSearchError(showMapDevDetails ? `Yandex Maps API key не найден. Добавьте ${YANDEX_MAPS_ENV_NAME} в .env и перезапустите development server.` : 'Не удалось загрузить карту. Попробуйте обновить страницу.');
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    setAddressSearchError('');

    loadYandexMapsApi()
      .then((ymaps3: any) =>
        ymaps3.suggest({
          text: `${city}, ${query}`,
          center: [76.889709, 43.238949],
          limit: 6,
          types: ['geo', 'street', 'house'],
        }),
      )
      .then((items: any[]) => {
        if (cancelled) return;

        setAddressSuggestions(
          items.map((item) => ({
            displayName: item.title?.text || item.value || item.address?.formattedAddress,
            value: item.address?.formattedAddress || item.subtitle?.text || item.value || item.title?.text,
            uri: item.uri,
          })),
        );
      })
      .catch(() => {
        if (cancelled) return;
        setAddressSuggestions([]);
        setAddressSearchError('Не удалось получить подсказки Яндекса. Попробуйте еще раз.');
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city, debouncedAddressQuery]);

  useEffect(() => {
    if (!location || addressQuery === location.fullAddress) {
      return;
    }

    const timer = setTimeout(() => {
      emit({ ...location, fullAddress: addressQuery, source: 'manual', locationConfirmed: false });
    }, 360);

    return () => clearTimeout(timer);
  }, [addressQuery]);

  useEffect(() => {
    if (!location || complexQuery === complexName) {
      return;
    }

    const timer = setTimeout(() => {
      emit({ ...location, locationConfirmed: false }, complexQuery, undefined, null);
    }, 360);

    return () => clearTimeout(timer);
  }, [complexQuery]);

  const complexSuggestions = useMemo(() => findResidentialComplexes(complexQuery, district), [complexQuery, district]);
  const selectedComplex = useMemo(() => residentialComplexes.find((complex) => complex.id === complexId) ?? null, [complexId]);
  const warnings = useMemo(
    () => buildLocationWarnings({ location, selectedDistrict: district, selectedComplex, newComplex }),
    [district, location, newComplex, selectedComplex],
  );

  function emit(nextLocation: PropertyLocation, nextComplexName = complexName, nextComplexId = complexId, nextNewComplex = newComplex ?? null) {
    onAddressChange({
      city: nextLocation.city,
      district: nextLocation.district ?? district,
      complexName: nextComplexName,
      street: nextLocation.fullAddress,
      location: {
        ...nextLocation,
        locationWarnings: buildLocationWarnings({
          location: nextLocation,
          selectedDistrict: nextLocation.district ?? district,
          selectedComplex: nextComplexId ? residentialComplexes.find((complex) => complex.id === nextComplexId) ?? null : null,
          newComplex: nextNewComplex,
        }),
      },
      complexId: nextComplexId,
      newComplex: nextNewComplex,
    });
  }

  function pickSuggestion(index: number) {
    const suggestion = addressSuggestions[index];
    if (!suggestion) return;

    setIsSearching(true);
    setAddressSearchError('');

    loadYandexMapsApi()
      .then((ymaps3: any) =>
        ymaps3.search({
          text: suggestion.uri || suggestion.value,
          center: [76.889709, 43.238949],
          limit: 1,
          types: ['geo', 'street', 'house'],
        }),
      )
      .then((features: any[]) => {
        const firstObject = features[0];
        const coords = firstObject?.geometry?.coordinates as [number, number] | undefined;
        if (!coords) {
          setAddressSearchError('Адрес не найден в Яндекс.Картах.');
          return;
        }

        const fullAddress = firstObject.properties?.name || firstObject.properties?.description || suggestion.value;
        const nextLocation = createLocation({
          city,
          district,
          fullAddress,
          latitude: coords[1],
          longitude: coords[0],
          source: 'yandex',
          districtSource: 'yandex',
          yandexObjectId: suggestion.uri || suggestion.value,
          locationConfirmed: false,
        });

        setAddressQuery(fullAddress);
        emit(nextLocation, complexQuery || complexName, complexId, newComplex ?? null);
      })
      .catch(() => setAddressSearchError('Не удалось определить координаты адреса через Яндекс.Карты.'))
      .finally(() => setIsSearching(false));
  }

  function chooseMapPoint(latitude: number, longitude: number) {
    const fullAddress = `${city}, ${district}, выбранная точка на карте`;
    const nextLocation = createLocation({
      city,
      district,
      fullAddress,
      latitude,
      longitude,
      source: 'yandex',
      districtSource: 'coordinates',
      locationConfirmed: false,
    });

    setAddressQuery(fullAddress);
    emit(nextLocation, complexQuery || complexName, complexId, newComplex ?? null);
  }

  function pickComplex(id: string) {
    const complex = residentialComplexes.find((item) => item.id === id);
    if (!complex) return;

    setComplexQuery(complex.name);
    const nextLocation = createLocation({
      city: complex.city,
      district: complex.district,
      fullAddress: `${complex.city}, ${complex.district}, ЖК ${complex.name}, ${complex.addressHint}`,
      latitude: complex.latitude,
      longitude: complex.longitude,
      source: 'yandex',
      districtSource: 'yandex',
      locationConfirmed: false,
    });
    setAddressQuery(nextLocation.fullAddress);
    emit(nextLocation, complex.name, complex.id, null);
  }

  function proposeNewComplex() {
    const trimmed = complexQuery.trim();
    if (!trimmed) return;

    const duplicateComplexIds = findDuplicateComplexIds(trimmed, location?.latitude, location?.longitude);
    const suggestion: ResidentialComplexSuggestion = {
      name: trimmed,
      district,
      latitude: location?.latitude,
      longitude: location?.longitude,
      duplicateComplexIds,
      status: 'pending_admin_review',
    };

    const nextLocation = location ?? createLocation({ fullAddress: street || `${city}, ${district}, ${trimmed}`, district, source: 'manual' });
    emit({ ...nextLocation, locationConfirmed: false }, trimmed, undefined, suggestion);
  }

  function confirmLocation() {
    const nextLocation = location ?? createLocation({ fullAddress: addressQuery || `${city}, ${district}`, district, source: 'manual' });
    emit({ ...nextLocation, locationConfirmed: !nextLocation.locationConfirmed });
  }

  const activeLatitude = location?.latitude ?? null;
  const activeLongitude = location?.longitude ?? null;

  return (
    <View style={styles.wrap}>
      <View style={styles.apiNote}>
        <Text style={styles.apiTitle}>Адрес и карта</Text>
        <Text style={styles.apiText}>
          {hasYandexKey
            ? 'Карта и поиск адреса работают через официальный Yandex Maps JavaScript API.'
            : showMapDevDetails
              ? `Yandex Maps API key не найден. Добавьте ${YANDEX_MAPS_ENV_NAME} в .env и перезапустите development server.`
              : 'Не удалось загрузить карту. Попробуйте обновить страницу.'}
        </Text>
      </View>

      <View style={styles.lockedRow}>
        <View style={styles.lockedPill}>
          <Text style={styles.lockedLabel}>Город</Text>
          <Text style={styles.lockedValue}>{city}</Text>
        </View>
        <View style={styles.lockedPill}>
          <Text style={styles.lockedLabel}>Район</Text>
          <Text style={styles.lockedValue}>{district}</Text>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Адрес или ЖК</Text>
        <TextInput
          value={addressQuery}
          onChangeText={setAddressQuery}
          placeholder="Начните вводить улицу, номер дома или название ЖК"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>

      {addressQuery.trim().length >= 3 ? (
        <View style={styles.suggestions}>
          {isSearching ? <Text style={styles.muted}>Ищем адрес...</Text> : null}
          {!isSearching && addressSearchError ? <Text style={styles.muted}>{addressSearchError}</Text> : null}
          {!isSearching && !addressSearchError && hasYandexKey && addressSuggestions.length === 0 ? <Text style={styles.muted}>Адрес не найден в Яндекс.Картах.</Text> : null}
          {addressSuggestions.map((suggestion, index) => (
            <Pressable key={`${suggestion.value}-${index}`} style={styles.suggestion} onPress={() => pickSuggestion(index)}>
              <Text style={styles.suggestionTitle}>{suggestion.displayName}</Text>
              <Text style={styles.suggestionText}>{suggestion.value}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <YandexPropertyMap
        coordinates={{ latitude: activeLatitude, longitude: activeLongitude }}
        onCoordinatesChange={({ latitude, longitude }) => chooseMapPoint(latitude, longitude)}
      />

      <View style={styles.actions}>
        <Pressable
          style={[styles.confirmButton, location?.locationConfirmed && styles.confirmButtonActive]}
          onPress={confirmLocation}
        >
          <Text style={[styles.confirmText, location?.locationConfirmed && styles.confirmTextActive]}>
            {location?.locationConfirmed ? 'Дом подтвержден' : 'Я подтверждаю правильный дом'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>ЖК / название дома</Text>
        <TextInput
          value={complexQuery}
          onChangeText={setComplexQuery}
          placeholder="Например, Riviera"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>

      {complexQuery.trim().length >= 2 ? (
        <View style={styles.suggestions}>
          {complexSuggestions.map((complex) => (
            <Pressable key={complex.id} style={styles.suggestion} onPress={() => pickComplex(complex.id)}>
              <Text style={styles.suggestionTitle}>{complex.name}</Text>
              <Text style={styles.suggestionText}>{complex.district} · {complex.addressHint}</Text>
            </Pressable>
          ))}
          <Pressable style={styles.newComplexButton} onPress={proposeNewComplex}>
            <Text style={styles.newComplexText}>Предложить новый ЖК: {complexQuery.trim()}</Text>
          </Pressable>
        </View>
      ) : null}

      {newComplex ? (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Новый ЖК отправится на проверку</Text>
          <Text style={styles.warningText}>{newComplex.name} · {newComplex.district}</Text>
          {newComplex.duplicateComplexIds.length ? (
            <Text style={styles.warningText}>Похожие ЖК: {newComplex.duplicateComplexIds.join(', ')}</Text>
          ) : null}
        </View>
      ) : null}

      {warnings.length ? (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Предупреждения для модерации</Text>
          {warnings.map((warning) => (
            <Text key={warning} style={styles.warningText}>• {warning}</Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  apiNote: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  apiTitle: {
    color: colors.accentDark,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  apiText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  lockedRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  lockedPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    padding: spacing.md,
  },
  lockedLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  lockedValue: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 5,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: spacing.md,
  },
  suggestions: {
    gap: spacing.sm,
  },
  suggestion: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    padding: spacing.md,
    gap: spacing.xs,
  },
  suggestionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  suggestionText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  mapBox: {
    height: 320,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: '#edf4f7',
    overflow: 'hidden',
    ...shadows.card,
  },
  mapImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#efe8db',
    opacity: 0.9,
  },
  mapRoad: {
    position: 'absolute',
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  mapRoadOne: {
    width: '118%',
    top: 70,
    left: -30,
    transform: [{ rotate: '-12deg' }],
  },
  mapRoadTwo: {
    width: '105%',
    top: 150,
    right: -24,
    transform: [{ rotate: '18deg' }],
  },
  mapRoadThree: {
    width: '72%',
    top: 118,
    left: 28,
    transform: [{ rotate: '74deg' }],
  },
  mapLabelTop: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  mapLabelText: {
    color: colors.accentDark,
    fontSize: 13,
    fontWeight: '900',
  },
  mapChip: {
    position: 'absolute',
    zIndex: 3,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    margin: 4,
  },
  mapChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  marker: {
    position: 'absolute',
    zIndex: 4,
    marginLeft: -24,
    marginTop: -46,
  },
  markerBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.accentSoft,
  },
  markerText: {
    color: colors.accentSoft,
    fontSize: 14,
    fontWeight: '900',
  },
  mapOverlay: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    alignItems: 'center',
  },
  mapTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  mapText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    fontWeight: '700',
  },
  openMapButton: {
    minHeight: 42,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openMapText: {
    color: colors.accentDark,
    fontSize: 13,
    fontWeight: '900',
  },
  actions: {
    gap: spacing.sm,
  },
  softButton: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  softButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  confirmButton: {
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  confirmButtonActive: {
    backgroundColor: colors.accentSoft,
  },
  confirmText: {
    color: colors.accentDark,
    fontSize: 15,
    fontWeight: '900',
  },
  confirmTextActive: {
    color: colors.text,
  },
  newComplexButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    padding: spacing.md,
  },
  newComplexText: {
    color: colors.accentDark,
    fontSize: 15,
    fontWeight: '900',
  },
  warningBox: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    padding: spacing.md,
    gap: spacing.xs,
  },
  warningTitle: {
    color: colors.accentDark,
    fontSize: 14,
    fontWeight: '900',
  },
  warningText: {
    color: colors.accentDark,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
});
