import React, { useCallback, useState } from 'react';
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

// 1. IMPORT YOUR SERVICE
import { getCoursesByCategory, Course } from '@/services/curriculumService';

const { width } = Dimensions.get('window');

export default function Learn() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { profile, refetch } = useProfile();

  // State to hold the courses we fetch
  const [coreCourses, setCoreCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<Record<string, Course[]>>({});

  useFocusEffect(
    useCallback(() => {
      refetch();
      
      // 2. FETCH DATA FROM SERVICE
      // A. Get Core (Theory) Courses
      const core = getCoursesByCategory('Core');
      setCoreCourses(core);

      // B. Get Instrument Courses (based on user profile)
      const instruments = profile?.instruments || ['Piano']; // Default to Piano if empty
      const instrumentData: Record<string, Course[]> = {};
      
      instruments.forEach(inst => {
        instrumentData[inst] = getCoursesByCategory(inst);
      });
      
      setUserCourses(instrumentData);

    }, [refetch, profile])
  );

  const userInstruments = profile?.instruments && profile.instruments.length > 0 
    ? profile.instruments 
    : ['Piano']; // Fallback

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={colors.backgroundGradient} style={styles.background} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Your Curriculum</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Tailored to your instruments.
          </Text>
        </View>

        {/* SECTION 1: CORE FOUNDATIONS (Theory) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔥 Core Foundations</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Essential skills for every musician</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {/* Render Theory Courses */}
            {coreCourses.length > 0 ? coreCourses.map((course) => (
              <CoreCard 
                key={course.id} 
                course={course} 
                colors={colors} 
                onPress={() => router.push(`/course/${course.id}`)}
              />
            )) : (
              <Text style={{color: colors.textSecondary, marginLeft: 20}}>No core courses yet.</Text>
            )}
            
            {/* Keep the Ear Gym Card manually since it's a tool, not a course */}
            <CoreCard 
               course={{title: 'Ear Training', subtitle: 'Interval Practice', icon: 'ear', color: '#10b981', progress: 0.1}}
               colors={colors}
               onPress={() => router.push('/tabs/ear-training')} // Ensure this route exists!
            />
          </ScrollView>
        </View>

        {/* SECTION 2: DYNAMIC INSTRUMENT SECTIONS */}
        {userInstruments.map((instrument: string) => {
          const courses = userCourses[instrument] || [];
          
          if (courses.length === 0) return null;

          return (
            <View key={instrument} style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{instrument} Path</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Master your main instrument</Text>
                </View>
                <View style={[styles.instrumentIconBadge, { backgroundColor: colors.cardBg }]}>
                  <Ionicons name="musical-note" size={16} color={colors.tint} />
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {courses.map((course) => (
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

        <View style={{ height: 40 }} /> 
      </ScrollView>
    </View>
  );
}

// --- COMPONENTS ---

function CoreCard({ course, colors, onPress }: any) {
  // Handle both Service Data (title/instrument) and Manual Data (subtitle/icon)
  const title = course.title;
  const subtitle = course.subtitle || course.level || 'Course';
  const icon = course.icon || 'book';
  const color = course.color || '#8b5cf6';
  
  return (
    <TouchableOpacity 
      style={[styles.coreCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.courseTitle, { color: colors.text }]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.courseSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

function InstrumentCard({ course, colors, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.instCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
      onPress={onPress}
    >
      {/* Placeholder Gradient since we don't have images in JSON yet */}
      <LinearGradient colors={['#3b82f6', '#1e1b4b']} style={styles.instImagePlaceholder}>
          <Ionicons name="musical-notes" size={32} color="white" />
      </LinearGradient>
      
      <LinearGradient 
        colors={['transparent', 'rgba(0,0,0,0.8)']} 
        style={styles.instOverlay}
      >
        <Text style={styles.instTitle}>{course.title}</Text>
        <Text style={styles.instSubtitle}>{course.level} • {course.modules.length} Modules</Text>
        
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
  
  coreCard: {
    width: 160, height: 160, borderRadius: 20, borderWidth: 1, padding: 16, justifyContent: 'space-between'
  },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, justifyContent: 'center' },
  courseTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 8 },
  courseSubtitle: { fontSize: 11, marginTop: 2 },

  instCard: {
    width: 220, height: 280, borderRadius: 20, borderWidth: 1, overflow: 'hidden',
  },
  instImagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  instOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, padding: 16, justifyContent: 'flex-end',
  },
  instTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  instSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 12 },
  playButton: {
    alignSelf: 'flex-start', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4
  },
  playText: { fontSize: 12, fontWeight: 'bold', color: 'black' },
});