import { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, spacing } from '@/constants/theme';
import { getAutoBuyerProfile } from '@/data/buyerProfileStore';

export default function WelcomeScreen() {
  useEffect(() => {
    const profile = getAutoBuyerProfile();
    if (profile) router.replace('/buyer-cabinet' as never);
  }, []);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=80' }}
      style={styles.hero}
      imageStyle={styles.image}
    >
      <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.98)']} style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.brand}>Gold House</Text>
          <Text style={styles.title}>Добро пожаловать в Gold House.</Text>
          <Text style={styles.subtitle}>Ответьте на несколько вопросов, а мы сразу покажем подходящие квартиры.</Text>
          <View style={styles.actions}>
            <PrimaryButton title="Начать поиск" onPress={() => router.push('/buyer-profile' as never)} />
            <PrimaryButton title="Я собственник" variant="secondary" onPress={() => router.push('/owner-login' as never)} />
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
});
