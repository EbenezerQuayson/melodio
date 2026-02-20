import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext'; // <--- 1. Import Theme Hook

export default function EarTraining() {
  const router = useRouter();
  const { colors, isDark } = useTheme(); // <--- 2. Get colors

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* 1. Global Background (Dynamic) */}
      <LinearGradient
        colors={colors.backgroundGradient}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 2. Header */}
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Ear Gym 👂</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Sharpen your listening skills. 10 mins a day.
          </Text>
        </View>

        {/* 3. Hero: "Daily Workout" Button */}
        <TouchableOpacity 
          style={styles.heroCard}
          activeOpacity={0.9}
          onPress={() => alert("Starting Daily Workout...")}
        >
          <LinearGradient
            colors={['#a855f7', '#7c3aed']} // Keep Brand Purple fixed
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View>
                <Text style={styles.heroLabel}>TODAY'S WORKOUT</Text>
                <Text style={styles.heroTitle}>Intervals & Triads</Text>
                <Text style={styles.heroTime}>~ 5 mins • 50 XP</Text>
              </View>
              <View style={styles.playButton}>
                <Ionicons name="play" size={32} color="#a855f7" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* 4. Section: Specific Exercises */}
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Browse Exercises</Text>
        
        <View style={styles.gridContainer}>
          <ExerciseCard 
            title="Intervals" 
            level="Beginner" 
            icon="resize" 
            color="#3b82f6" 
            colors={colors} // Pass theme colors down
            onPress={() => router.push('/exercise/interval')}
          />
          <ExerciseCard 
            title="Chords" 
            level="Medium" 
            icon="grid" 
            color="#10b981" 
            colors={colors}
            onPress={() => alert("Chords Exercise Coming Soon!")}
          />
          <ExerciseCard 
            title="Scales" 
            level="Hard" 
            icon="musical-notes" 
            color="#f59e0b" 
            colors={colors}
            onPress={() => alert("Scales Exercise Coming Soon!")}
          />
          <ExerciseCard 
            title="Perfect Pitch" 
            level="Extreme" 
            icon="flash" 
            color="#ef4444" 
            colors={colors}
            onPress={() => alert("Perfect Pitch Exercise Coming Soon!")}

          />
        </View>

      </ScrollView>
    </View>
  );
}

// --- Reusable Component: Exercise Card ---
function ExerciseCard({ title, level, icon, color, colors, onPress }: { title: string, level: string, icon: any, color: string, colors: any, onPress: () => void }) {
  return (
    <TouchableOpacity 
      style={[
        styles.cardContainer, 
        { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.cardText}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.cardLevel, { color }]}>{level}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  headerContainer: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  // Hero Card Styles
  heroCard: {
    borderRadius: 24,
    marginBottom: 40,
    overflow: 'hidden',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  heroGradient: {
    padding: 24,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Keep Hero text white because background is always purple
  heroLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  // Grid Styles
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gridContainer: {
    gap: 16,
  },
  // Exercise Card Styles
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardLevel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});