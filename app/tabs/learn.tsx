import React, { useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  Dimensions
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/hooks/useProfile';

const { width } = Dimensions.get('window');

// --- 1. THE CURRICULUM DATA (Mock Database) ---
const CURRICULUM_DATA: Record<string, any[]> = {
  // Core: Everyone sees this
  'Core': [
    { id: 'c1', title: 'Music Theory 101', subtitle: 'Notes, Scales & Keys', icon: 'book', color: '#8b5cf6', progress: 0.4 },
    { id: 'c2', title: 'Ear Training Gym', subtitle: 'Interval Recognition', icon: 'ear', color: '#10b981', progress: 0.1, route: '/tabs/ear-training' }, // Link to your old tab page!
    { id: 'c3', title: 'Rhythm & Timing', subtitle: 'Mastering the beat', icon: 'hourglass', color: '#f59e0b', progress: 0 },
  ],
  // Instrument Specific
  'Piano': [
    { id: 'p1', title: 'Piano Basics', subtitle: 'Posture & Hand Position', image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=400', color: '#3b82f6' },
    { id: 'p2', title: 'Major Scales', subtitle: 'The foundation of melody', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400', color: '#3b82f6' },
    { id: 'p3', title: 'Chords & Inversions', subtitle: 'Triads and extensions', image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=400', color: '#3b82f6' },
  ],
  'Guitar': [
    { id: 'g1', title: 'Open Chords', subtitle: 'C, G, D, A, E', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400', color: '#ef4444' },
    { id: 'g2', title: 'Strumming Patterns', subtitle: 'Right hand techniques', image: 'https://images.unsplash.com/photo-1525201545678-450ed1fe1b91?w=400', color: '#ef4444' },
  ],
  'Vocals': [
    { id: 'v1', title: 'Breathing Control', subtitle: 'Support your voice', image: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400', color: '#ec4899' },
    { id: 'v2', title: 'Pitch Perfect', subtitle: 'Matching tones', image: 'https://images.unsplash.com/photo-1525926477800-7a3be5800fcb?w=400', color: '#ec4899' },
  ],
  // Fallback if instrument isn't in our list
  'General': [
    { id: 'gen1', title: 'Intro to Music', subtitle: 'Start your journey', color: '#6366f1' }
  ]
};

export default function Learn() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { profile, refetch } = useProfile();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // 2. Determine which sections to show
  // Default to ['Core'] if no profile, otherwise ['Core', ...userInstruments]
  const userInstruments = profile?.instruments && profile.instruments.length > 0 
    ? profile.instruments 
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={colors.backgroundGradient} style={styles.background} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Your Curriculum</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {userInstruments.length > 0 ? "Tailored to your instruments." : "Start by setting up your profile."}
          </Text>
        </View>

        {/* SECTION 1: CORE FOUNDATIONS (Always Visible) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔥 Core Foundations</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Essential skills for every musician</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {CURRICULUM_DATA['Core'].map((course) => (
              <CoreCard 
                key={course.id} 
                course={course} 
                colors={colors} 
                onPress={() => {
        if (course.route) {
          // Special case: "Ear Training" goes to its own tool page
          router.push(course.route);
        } else {
          // Standard case: "Music Theory" goes to the Course Player
          router.push(`/course/${course.id}`);
        }
      }}
              />
            ))}
          </ScrollView>
        </View>

        {/* SECTION 2: DYNAMIC INSTRUMENT SECTIONS */}
        {userInstruments.map((instrument: string) => {
          // Check if we have data for this instrument, otherwise skip or show general
          const courses = CURRICULUM_DATA[instrument] || CURRICULUM_DATA['General'];
          
          return (
            <View key={instrument} style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{instrument} Path</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Master your main instrument</Text>
                </View>
                {/* Visual Icon for the section */}
                <View style={[styles.instrumentIconBadge, { backgroundColor: colors.cardBg }]}>
                  <Ionicons name="musical-note" size={16} color={colors.tint} />
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {courses.map((course: any) => (
                  <InstrumentCard 
                    key={course.id} 
                    course={course} 
                    colors={colors} 
                    onPress={() => router.push(`/course/${course.id}`)}
                  />
                ))}
              </ScrollView>
            </View>
          );
        })}

        {/* CTA: If no instruments selected */}
        {userInstruments.length === 0 && (
          <TouchableOpacity 
            style={[styles.emptyState, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            onPress={() => router.push('/tabs/edit_profile')}
          >
            <Ionicons name="add-circle-outline" size={32} color={colors.tint} />
            <Text style={[styles.emptyText, { color: colors.text }]}>Add an instrument to get a personalized plan</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} /> 
      </ScrollView>
    </View>
  );
}

// --- COMPONENT: Core Card (Square, Icon-based) ---
function CoreCard({ course, colors, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.coreCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${course.color}20` }]}>
        <Ionicons name={course.icon} size={24} color={course.color} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.courseTitle, { color: colors.text }]} numberOfLines={1}>{course.title}</Text>
        <Text style={[styles.courseSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>{course.subtitle}</Text>
      </View>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.cardBorder }]}>
          <View style={[styles.progressFill, { width: `${course.progress * 100}%`, backgroundColor: course.color }]} />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>{Math.round(course.progress * 100)}%</Text>
      </View>
    </TouchableOpacity>
  );
}

// --- COMPONENT: Instrument Card (Rectangular, Image-based) ---
function InstrumentCard({ course, colors, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.instCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
      onPress={onPress}
    >
      {course.image ? (
        <Image source={{ uri: course.image }} style={styles.instImage} />
      ) : (
        <LinearGradient colors={[course.color, '#000']} style={styles.instImagePlaceholder}>
           <Ionicons name="musical-notes" size={32} color="white" />
        </LinearGradient>
      )}
      
      <LinearGradient 
        colors={['transparent', 'rgba(0,0,0,0.8)']} 
        style={styles.instOverlay}
      >
        <Text style={styles.instTitle}>{course.title}</Text>
        <Text style={styles.instSubtitle}>{course.subtitle}</Text>
        
        <View style={styles.playButton}>
          <Ionicons name="play" size={12} color="black" />
          <Text style={styles.playText}>Start</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  content: { paddingBottom: 50 },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14, marginTop: 4 },
  
  sectionContainer: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, marginLeft: 20, marginBottom: 12 },
  instrumentIconBadge: { padding: 8, borderRadius: 12 },
  
  horizontalScroll: { paddingHorizontal: 20, gap: 16 },
  
  // Core Card Styles
  coreCard: {
    width: 160,
    height: 160,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-between'
  },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, justifyContent: 'center' },
  courseTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 8 },
  courseSubtitle: { fontSize: 11, marginTop: 2 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  progressBar: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressText: { fontSize: 10, fontWeight: '600' },

  // Instrument Card Styles
  instCard: {
    width: 220,
    height: 280, // Taller, poster style
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  instImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  instImagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  instOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120, // Gradient height
    padding: 16,
    justifyContent: 'flex-end',
  },
  instTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  instSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 12 },
  playButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4
  },
  playText: { fontSize: 12, fontWeight: 'bold', color: 'black' },

  // Empty State
  emptyState: {
    margin: 20,
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: { textAlign: 'center', fontSize: 14, fontWeight: '500' },
});