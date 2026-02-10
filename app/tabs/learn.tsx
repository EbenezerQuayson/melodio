import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Learn() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Background */}
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#000000']}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 2. Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Learning Paths 🎓</Text>
          <Text style={styles.subtitle}>Master your craft, step by step.</Text>
        </View>

        {/* 3. "Continue Learning" (Hero Section) */}
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        <TouchableOpacity style={styles.heroCard} activeOpacity={0.9}>
          <LinearGradient
            colors={['#1e3a8a', '#172554']} // Deep Blue Gradient
            style={styles.heroGradient}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroIcon}>
                <Ionicons name="musical-notes" size={32} color="#60a5fa" />
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>IN PROGRESS</Text>
              </View>
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.heroTitle}>Piano Fundamentals</Text>
              <Text style={styles.heroSubtitle}>Module 3: Major Scales & Triads</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: '45%' }]} />
              </View>
              <Text style={styles.progressText}>45% Complete</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* 4. "Browse Paths" List */}
        <Text style={styles.sectionTitle}>Explore Paths</Text>
        
        <View style={styles.grid}>
          <PathCard 
            title="Music Theory" 
            lessons="24 Lessons" 
            icon="book" 
            color="#a855f7" 
            locked={false}
          />
          <PathCard 
            title="Sight Reading" 
            lessons="12 Lessons" 
            icon="eye" 
            color="#10b981" 
            locked={false}
          />
          <PathCard 
            title="Jazz Improvisation" 
            lessons="Advanced" 
            icon="headset" 
            color="#f59e0b" 
            locked={true}
          />
          <PathCard 
            title="Composition" 
            lessons="Coming Soon" 
            icon="create" 
            color="#ef4444" 
            locked={true}
          />
        </View>

      </ScrollView>
    </View>
  );
}

// --- Reusable Component: Path Card ---
function PathCard({ title, lessons, icon, color, locked }: { title: string, lessons: string, icon: any, color: string, locked: boolean }) {
  return (
    <TouchableOpacity style={styles.pathCard} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: locked ? '#334155' : `${color}20` }]}>
        <Ionicons name={locked ? "lock-closed" : icon} size={24} color={locked ? "#94a3b8" : color} />
      </View>
      
      <View style={styles.pathInfo}>
        <Text style={[styles.pathTitle, locked && styles.lockedText]}>{title}</Text>
        <Text style={styles.pathLessons}>{lessons}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#475569" />
    </TouchableOpacity>
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
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100, // Extra space for bottom tabs
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    marginTop: 8,
  },
  // Hero Card
  heroCard: {
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGradient: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#93c5fd',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heroInfo: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  progressContainer: {
    gap: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#60a5fa', // Light Blue
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#94a3b8',
    alignSelf: 'flex-end',
  },
  // List Styles
  grid: {
    gap: 12,
  },
  pathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)', // Glassy
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pathInfo: {
    flex: 1,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  lockedText: {
    color: '#64748b',
  },
  pathLessons: {
    fontSize: 12,
    color: '#94a3b8',
  },
});