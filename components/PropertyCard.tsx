import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { formatPrice } from '@/components/BudgetSlider';
import { ResolvedImage } from '@/components/ResolvedImage';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { Property } from '@/data/properties';

type PropertyCardProps = {
  property: Property;
  onPress?: () => void;
};

export function PropertyCard({ property, onPress }: PropertyCardProps) {
  const cover = property.images?.[0] ?? property.imageUrl;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <ResolvedImage uri={cover} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.price}>{formatPrice(property.price)}</Text>
          <Badge label={`${property.matchPercent}%`} />
        </View>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.address}>{property.address}</Text>
        <Text style={styles.meta}>
          {property.district} • {property.rooms} комн. • {property.area} м² • {property.floor}/{property.totalFloors} этаж • {property.renovation}
        </Text>
        <View style={styles.tags}>
          {property.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} label={tag} tone="neutral" />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: '100%',
    height: 310,
    backgroundColor: colors.surface,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  price: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
  },
  address: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
