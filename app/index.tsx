import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=80' }}
      style={styles.hero}
      imageStyle={styles.image}
    >
      <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.98)']} style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.brand}>Gold House</Text>
          <Text style={styles.title}>Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ РІ Gold House.</Text>
          <Text style={styles.subtitle}>РћС‚РІРµС‚СЊС‚Рµ РЅР° РЅРµСЃРєРѕР»СЊРєРѕ РІРѕРїСЂРѕСЃРѕРІ, Р° РјС‹ СЃСЂР°Р·Сѓ РїРѕРєР°Р¶РµРј РїРѕРґС…РѕРґСЏС‰РёРµ РєРІР°СЂС‚РёСЂС‹.</Text>
          <View style={styles.actions}>
            <PrimaryButton title="РќР°С‡Р°С‚СЊ РїРѕРёСЃРє" onPress={() => router.push('/buyer-profile' as never)} />
            <PrimaryButton title="РЇ СЃРѕР±СЃС‚РІРµРЅРЅРёРє" variant="secondary" onPress={() => router.push('/owner-login' as never)} />
          <Pressable style={styles.adminLink} onPress={() => router.push('/admin' as never)}>
            <Text style={styles.adminText}>Gold Admin</Text>
          </Pressable>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    opacity: 0.96,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  brand: {
    color: colors.accentDark,
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  title: {
    color: colors.text,
    fontSize: 42,
    lineHeight: 47,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 24,
  },
  actions: {
    gap: spacing.md,
  },
  adminLink: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  adminText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    opacity: 0.42,
    textTransform: 'uppercase',
  },
});


