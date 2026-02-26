import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview'; // For YouTube & OSMD
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock Data (Replace with fetch from your Supabase/JSON)
const LESSON_DATA = {
  'l_01': { type: 'video', videoId: '89G9UjXb48', title: 'Hand Position' }, // Example ID
  'l_02': { 
    type: 'score', 
    title: 'C Major Practice', 
    // We load a MusicXML file into the WebView to render it with OSMD
    scoreUrl: 'https://raw.githubusercontent.com/opensheetmusicdisplay/spl/master/Mozart_KV331_1st_Mov_Theme.musicxml' 
  }
};

export default function LessonPlayer() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const lesson = LESSON_DATA[id as keyof typeof LESSON_DATA] || LESSON_DATA['l_01'];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{lesson.title}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* CONTENT AREA */}
      <View style={styles.content}>
        {lesson.type === 'video' && 'videoId' in lesson ? (
          <VideoPlayer videoId={lesson.videoId} />
        ) : lesson.type === 'score' && 'scoreUrl' in lesson ? (
          <SheetMusicPlayer scoreUrl={lesson.scoreUrl} />
        ) : null}
      </View>

      {/* CONTROLS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={() => alert('Lesson Complete! +50XP')}>
          <Text style={styles.nextText}>Mark Complete</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- SUB-COMPONENT: YOUTUBE PLAYER ---
function VideoPlayer({ videoId }: { videoId: string }) {
  return (
    <WebView
      style={styles.webview}
      javaScriptEnabled={true}
      source={{ uri: `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&showinfo=0&controls=1` }}
    />
  );
}

// --- SUB-COMPONENT: INTERACTIVE SHEET MUSIC (OSMD) ---
// We inject HTML that runs the OpenSheetMusicDisplay library inside a WebView
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
      style={styles.webview}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#111',
  },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, backgroundColor: '#000' },
  webview: { flex: 1, backgroundColor: 'transparent' },
  footer: { padding: 20, backgroundColor: '#111' },
  nextButton: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});