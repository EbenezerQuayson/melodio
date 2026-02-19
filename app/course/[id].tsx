import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SectionList,
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview'; 
import YoutubePlayer from "react-native-youtube-iframe"; // <--- 1. Import new player
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { getCourseById, Lesson } from '@/services/curriculumService'; 

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.5625; // Perfect 16:9 aspect ratio

export default function CourseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const { colors, isDark } = useTheme();

  const course = getCourseById(id as string);
  const firstLesson = course?.modules[0]?.lessons[0];
  const [activeLesson, setActiveLesson] = useState<Lesson | undefined>(firstLesson);
  const [isPlaying, setIsPlaying] = useState(false); // Track video play state

  if (!course || !activeLesson) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Course content not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.tint }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sections = course.modules.map(mod => ({
    title: mod.title,
    data: mod.lessons
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- 1. THE PLAYER AREA (Top) --- */}
      <View style={styles.playerContainer}>
        {/* Back Button Overlay */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-down" size={28} color="white" />
        </TouchableOpacity>

        {/* 2. THE NEW YOUTUBE PLAYER */}
        {activeLesson.type === 'video' && activeLesson.videoId ? (
          <View style={{ marginTop: 40 }}> {/* Push down below the back button */}
            <YoutubePlayer
              height={VIDEO_HEIGHT}
              play={isPlaying}
              videoId={activeLesson.videoId}
              onChangeState={(state: string) => {
                if (state === 'ended') {
                  setIsPlaying(false);
                  Alert.alert("Awesome!", "Ready for the next lesson?");
                }
              }}
            />
          </View>
        ) : activeLesson.type === 'practice' && activeLesson.scoreUrl ? (
          <View style={{ flex: 1, marginTop: 40 }}>
             <SheetMusicPlayer scoreUrl={activeLesson.scoreUrl} />
          </View>
        ) : (
          <View style={styles.placeholder}>
             <Text style={{color: 'white'}}>Content loading...</Text>
          </View>
        )}
      </View>

      {/* --- 2. LESSON LIST (Bottom) --- */}
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        
        <View style={styles.infoSection}>
          <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
          <Text style={[styles.lessonTitle, { color: colors.tint }]}>
             Now Playing: {activeLesson.title}
          </Text>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>{title}</Text>
          )}
          renderItem={({ item }) => {
            const isActive = activeLesson.id === item.id;
            return (
              <TouchableOpacity 
                onPress={() => {
                  setActiveLesson(item);
                  setIsPlaying(false); // Reset play state when switching lessons
                }}
                style={[
                  styles.lessonItem, 
                  { 
                    backgroundColor: isActive ? `${colors.tint}15` : colors.cardBg,
                    borderColor: isActive ? colors.tint : 'transparent',
                    borderWidth: 1
                  }
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: isActive ? colors.tint : colors.iconBg }]}>
                  <Ionicons 
                    name={item.type === 'video' ? 'play' : 'musical-notes'} 
                    size={16} 
                    color={isActive ? "white" : colors.textSecondary} 
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={[styles.itemTitle, { color: colors.text, fontWeight: isActive ? 'bold' : 'normal' }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>
                    {item.type === 'video' ? `${Math.floor((item.duration || 0) / 60)} mins` : `${item.xp} XP`}
                  </Text>
                </View>
                {item.completed && <Ionicons name="checkmark-circle" size={18} color={colors.tint} />}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* --- 3. FOOTER --- */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.cardBorder }]}>
        <TouchableOpacity 
          style={[styles.completeButton, { backgroundColor: colors.tint }]}
          onPress={() => Alert.alert("Nice!", "Lesson marked as complete.")}
        >
          <Text style={styles.completeButtonText}>Mark Complete</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// --- SUB-COMPONENT: Sheet Music Renderer ---
function SheetMusicPlayer({ scoreUrl }: { scoreUrl: string }) {
  const osmdHtml = `
    <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/opensheetmusicdisplay/1.8.6/opensheetmusicdisplay.min.js"></script>
        <style>body { background: #fff; margin: 0; display: flex; justify-content: center; }</style>
      </head>
      <body>
        <div id="osmdCanvas" style="width: 100%; height: 100vh;"></div>
        <script>
          var osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmdCanvas", {
            autoResize: true,
            backend: "svg",
            drawingParameters: "compacttight"
          });
          osmd.load("${scoreUrl}").then(function() {
            osmd.render();
          });
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: osmdHtml }}
      style={{ flex: 1, backgroundColor: 'white' }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  playerContainer: {
    width: '100%',
    backgroundColor: '#000',
    paddingTop: 10, 
    minHeight: VIDEO_HEIGHT + 40, // Ensure enough height for the video + back button
  },
  placeholder: { height: VIDEO_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  
  backButton: {
    position: 'absolute',
    top: 40, 
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  infoSection: { padding: 20, paddingBottom: 10 },
  courseTitle: { fontSize: 22, fontWeight: 'bold' },
  lessonTitle: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  
  sectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
  },
  iconBox: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  itemTitle: { fontSize: 14 },
  itemMeta: { fontSize: 11 },

  bottomBar: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  completeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});