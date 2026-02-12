import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

// --- MOCK DATA FOR LESSONS ---
// In a real app, you'd fetch this from Supabase using the 'id'
const COURSE_DETAILS: Record<string, any> = {
  // --- PIANO ---
  'p1': {
    title: 'Piano Basics',
    description: 'Learn the fundamental hand positions, posture, and your first 5-finger scale.',
    lessons: [
      { id: 'l1', title: 'Sitting Posture & Hand Shape', duration: '5:00', completed: true },
      { id: 'l2', title: 'The Musical Alphabet', duration: '3:20', completed: true },
      { id: 'l3', title: 'Finding Middle C', duration: '4:15', completed: false },
    ]
  },
  
  // --- GUITAR (New!) ---
  'g1': {
    title: 'Guitar Chords',
    description: 'Master the essential open chords: C, G, D, A, and E.',
    lessons: [
      { id: 'gl1', title: 'Tuning Your Guitar', duration: '4:00', completed: false },
      { id: 'gl2', title: 'Reading Chord Diagrams', duration: '3:30', completed: false },
      { id: 'gl3', title: 'Your First Chord (E Minor)', duration: '5:10', completed: false },
    ]
  },

  // --- VOCALS (New!) ---
  'v1': {
    title: 'Vocal Control',
    description: 'Learn to support your voice with proper breathing techniques.',
    lessons: [
      { id: 'vl1', title: 'Diaphragmatic Breathing', duration: '6:00', completed: false },
      { id: 'vl2', title: 'Warm-up Sirens', duration: '4:45', completed: false },
    ]
  },

  // --- CORE THEORY ---
  'c1': {
    title: 'Music Theory 101',
    description: 'Understand the building blocks of music: Notes, Scales, and Keys.',
    lessons: [
      { id: 'mt1', title: 'The Staff & Clefs', duration: '4:00', completed: false },
      { id: 'mt2', title: 'Whole & Half Steps', duration: '5:30', completed: false },
    ]
  },

  // --- FALLBACK ---
  'default': {
    title: 'Coming Soon',
    description: 'We are still filming lessons for this module!',
    lessons: []
  }
};

export default function CourseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // <--- Captures 'p1', 'c1', etc.
  const { colors, isDark } = useTheme();

  // Load data based on ID
  const courseId = typeof id === 'string' ? id : 'default';
  const courseData = COURSE_DETAILS[courseId] || COURSE_DETAILS['default'];

  // State for the "Video Player" placeholder
  const [activeLesson, setActiveLesson] = useState(courseData.lessons[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. HERO / VIDEO AREA (Fixed at top) */}
      <View style={[styles.videoContainer, { backgroundColor: '#000' }]}>
        {/* Background Image/Thumbnail */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=800' }} 
          style={[styles.videoThumbnail, { opacity: isPlaying ? 0.3 : 0.6 }]} 
        />
        
        {/* Controls Overlay */}
        <View style={styles.videoOverlay}>
           {/* Back Button (Absolute) */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Ionicons name="chevron-down" size={28} color="white" />
          </TouchableOpacity>

          {/* Play Button */}
          <TouchableOpacity 
            onPress={() => setIsPlaying(!isPlaying)}
            style={styles.playButtonLarge}
          >
            <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="black" />
          </TouchableOpacity>
        </View>

        {/* Video Progress Bar (Visual only) */}
        <View style={styles.videoProgressBar}>
          <View style={[styles.videoProgressFill, { width: '35%', backgroundColor: colors.tint }]} />
        </View>
      </View>

      {/* 2. SCROLLABLE CONTENT */}
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header Info */}
          <View style={styles.infoSection}>
            <Text style={[styles.courseTitle, { color: colors.text }]}>{courseData.title}</Text>
            <Text style={[styles.lessonTitle, { color: colors.tint }]}>
              Now Playing: {activeLesson.title}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {courseData.description}
            </Text>
            
            <View style={styles.metaRow}>
              <View style={[styles.tag, { backgroundColor: colors.cardBg }]}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                  {courseData.lessons.length} Lessons
                </Text>
              </View>
              <View style={[styles.tag, { backgroundColor: colors.cardBg }]}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>4.8 Rating</Text>
              </View>
            </View>
          </View>

          {/* Lesson List */}
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Syllabus</Text>
          
          <View style={styles.lessonList}>
            {courseData.lessons.map((lesson: any, index: number) => {
              const isActive = activeLesson.id === lesson.id;
              return (
                <TouchableOpacity 
                  key={lesson.id}
                  onPress={() => setActiveLesson(lesson)}
                  style={[
                    styles.lessonItem, 
                    { 
                      backgroundColor: isActive ? `${colors.tint}15` : colors.cardBg,
                      borderColor: isActive ? colors.tint : 'transparent',
                      borderWidth: 1
                    }
                  ]}
                >
                  {/* Leading Icon (Play or Lock) */}
                  <View style={[styles.lessonIcon, { backgroundColor: isActive ? colors.tint : colors.iconBg }]}>
                    <Ionicons 
                      name={isActive ? "play" : "lock-open-outline"} 
                      size={16} 
                      color={isActive ? "white" : colors.textSecondary} 
                    />
                  </View>

                  {/* Text Content */}
                  <View style={styles.lessonText}>
                    <Text style={[styles.lessonItemTitle, { color: colors.text, fontWeight: isActive ? 'bold' : 'normal' }]}>
                      {index + 1}. {lesson.title}
                    </Text>
                    <Text style={[styles.lessonDuration, { color: colors.textSecondary }]}>
                      {lesson.duration}
                    </Text>
                  </View>

                  {/* Trailing Icon (Checkmark) */}
                  {lesson.completed && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.tint} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>
      </View>

      {/* 3. BOTTOM ACTION BAR */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.cardBorder }]}>
        <TouchableOpacity 
          style={[styles.completeButton, { backgroundColor: colors.tint }]}
          onPress={() => Alert.alert("Nice work!", "Lesson marked as complete.")}
        >
          <Text style={styles.completeButtonText}>Mark Lesson Complete</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Video Player Styles
  videoContainer: {
    width: '100%',
    height: width * 0.5625, // 16:9 Aspect Ratio
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  backButton: {
    position: 'absolute',
    top: 40, // adjust for safe area
    left: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  playButtonLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  videoProgressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  videoProgressFill: {
    height: '100%',
  },

  // Content Styles
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Space for bottom bar
  },
  infoSection: {
    marginBottom: 24,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Lesson List Styles
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lessonList: {
    gap: 12,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  lessonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonText: {
    flex: 1,
  },
  lessonItemTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  lessonDuration: {
    fontSize: 12,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40, // adjust for home indicator
    borderTopWidth: 1,
  },
  completeButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});