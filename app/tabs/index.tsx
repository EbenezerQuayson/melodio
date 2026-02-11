import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/hooks/useProfile';

export default function Dashboard() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  
  // 1. Fetch real profile data
  const { profile, refetch } = useProfile();

  // 2. Refresh profile data whenever dashboard is viewed
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const avatarUrl = profile?.avatar_url 
    ? profile.avatar_url 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name ?? 'User')}&background=a855f7&color=fff`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <LinearGradient
        colors={colors.backgroundGradient}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good Evening,</Text>
            <Text style={[styles.username, { color: colors.text }]}>
              {profile?.display_name?.split(' ')[0] ?? 'Artist'} 🎶
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Pressable 
              onPress={toggleTheme} 
              style={[styles.iconButton, { backgroundColor: colors.iconBg }]}
            >
              <Ionicons 
                name={isDark ? "sunny" : "moon"} 
                size={22} 
                color={isDark ? "#fbbf24" : "#6366f1"} 
              />
            </Pressable>

            {/* REAL AVATAR */}
            <Pressable 
              onPress={() => router.push('/tabs/profile')}
              style={[styles.avatarContainer, { borderColor: colors.tint }]}
            >
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            </Pressable>
          </View>
        </View>

        {/* 3. NEW SEARCH BAR */}
        <Pressable 
          onPress={() => router.push('/tabs/explore')} // We will build this next
          style={[styles.searchContainer, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
            Search musicians or skills...
          </Text>
        </Pressable>

        {/* STATS ROW */}
        <View style={styles.statsRow}>
          <StatCard 
            label="Level" 
            value={profile?.level ?? "Beginner"} 
            icon="school-outline" 
            accent="#3b82f6" 
            theme={colors}
          />
          <StatCard 
            label="Streak" 
            value={`${profile?.streak ?? 0} Days`} 
            icon="flame" 
            accent="#f97316" 
            theme={colors}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Practice & Learn</Text>

        <View style={styles.featuresGrid}>
          <FeatureCard 
            title="Virtual Piano" 
            subtitle="Practice scales & chords"
            icon="keypad"
            colors={['#2563eb', '#1d4ed8']} 
          />
          <FeatureCard 
            title="Ear Training" 
            subtitle="Identify intervals"
            icon="ear"
            colors={['#16a34a', '#15803d']} 
          />
          <FeatureCard 
            title="Music Theory" 
            subtitle="Master the basics"
            icon="book"
            colors={['#9333ea', '#7e22ce']} 
          />
        </View>

      </ScrollView>
    </View>
  );
}

// --- Keep StatCard and FeatureCard components from your code ---

function StatCard({ label, value, icon, accent, theme }: any) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      <View style={[styles.iconBox, { backgroundColor: `${accent}20` }]}>
        <Ionicons name={icon} size={20} color={accent} />
      </View>
      <View>
        <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
      </View>
    </View>
  );
}

function FeatureCard({ title, subtitle, icon, colors }: { title: string; subtitle: string; icon: any; colors: readonly [string, string, ...string[]] }) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.featureCardContainer,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featureGradient}
      >
        <View style={styles.featureContent}>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureSubtitle}>{subtitle}</Text>
          </View>
          <View style={styles.featureIconBubble}>
             <Ionicons name={icon} size={28} color="white" />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  scrollContent: { padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting: { fontSize: 16, marginBottom: 4 },
  username: { fontSize: 28, fontWeight: 'bold' },
  iconButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden', borderWidth: 2 },
  avatarImage: { width: '100%', height: '100%' },
  
  // NEW SEARCH BAR STYLES
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
    gap: 12,
  },
  searchPlaceholder: { fontSize: 16 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, padding: 12, borderRadius: 16, borderWidth: 1, alignItems: 'flex-start', gap: 8 },
  iconBox: { padding: 6, borderRadius: 8, marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  statLabel: { fontSize: 11 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  featuresGrid: { gap: 16 },
  featureCardContainer: { height: 100, borderRadius: 24, overflow: 'hidden', elevation: 5 },
  featureGradient: { flex: 1, padding: 20, justifyContent: 'center' },
  featureContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featureTextContainer: { flex: 1 },
  featureTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  featureSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  featureIconBubble: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginLeft: 16 },
});