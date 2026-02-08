import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Main Background */}
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#000000']}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 2. Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Evening,</Text>
            <Text style={styles.username}>Maestro 🎶</Text>
          </View>
          {/* Avatar Placeholder */}
          <View style={styles.avatarContainer}>
             <Ionicons name="person" size={24} color="#fff" />
          </View>
        </View>

        {/* 3. Stats Row */}
        <View style={styles.statsRow}>
          <StatCard 
            label="Level" 
            value="Beginner" 
            icon="school-outline" 
            accent="#3b82f6" 
          />
          <StatCard 
            label="Instrument" 
            value="Keyboard" 
            icon="musical-notes-outline" 
            accent="#a855f7" 
          />
          <StatCard 
            label="Streak" 
            value="3 Days" 
            icon="flame" 
            accent="#f97316" 
          />
        </View>

        {/* 4. Section Title */}
        <Text style={styles.sectionTitle}>Practice & Learn</Text>

        {/* 5. Feature Cards */}
        <View style={styles.featuresGrid}>
          <FeatureCard 
            title="Virtual Piano" 
            subtitle="Practice scales & chords"
            icon="keypad"
            colors={['#2563eb', '#1d4ed8']} // Blue Gradient
          />
          <FeatureCard 
            title="Ear Training" 
            subtitle="Identify intervals"
            icon="ear"
            colors={['#16a34a', '#15803d']} // Green Gradient
          />
          <FeatureCard 
            title="Music Theory" 
            subtitle="Master the basics"
            icon="book"
            colors={['#9333ea', '#7e22ce']} // Purple Gradient
          />
        </View>

      </ScrollView>
    </View>
  );
}

// --- Reusable Components ---

function StatCard({ label, value, icon, accent }: { label: string; value: string; icon: any; accent: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.iconBox, { backgroundColor: `${accent}20` }]}>
        <Ionicons name={icon} size={20} color={accent} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12, // Gap only works on newer React Native versions, fallback uses margins
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.5)', // Glassy dark blue
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'flex-start',
    gap: 8,
  },
  iconBox: {
    padding: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14, // Slightly smaller to fit "Beginner"
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCardContainer: {
    height: 100,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  featureGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  featureContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  featureIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
});