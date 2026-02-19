import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

// --- IMPORTS FROM NEW FOLDER ---
// Ensure you created these files in components/instruments/
import Piano from '@/components/instruments/Piano';
import Drums from '@/components/instruments/Drums';

// --- SOUND CONSTANTS ---
// (In a real app, you might move these to constants/AudioAssets.ts)
const PIANO_SOUNDS: Record<string, string> = {
  'C4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/c4.mp3',
  'C#4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/c4s.mp3',
  'D4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/d4.mp3',
  'D#4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/d4s.mp3',
  'E4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/e4.mp3',
  'F4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/f4.mp3',
  'F#4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/f4s.mp3',
  'G4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/g4.mp3',
  'G#4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/g4s.mp3',
  'A4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/a4.mp3',
  'A#4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/a4s.mp3',
  'B4': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/b4.mp3',
  'C5': 'https://raw.githubusercontent.com/fuhton/react-piano/master/public/audio/c5.mp3',
};

const DRUM_SOUNDS: Record<string, string> = {
  'Kick': 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
  'Snare': 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3',
  'HiHat': 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
  'Clap': 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
};

export default function VirtualInstruments() {
  const router = useRouter();
  
  // State
  const [activeTab, setActiveTab] = useState<'Piano' | 'Drums'>('Piano');
  const [activeSounds, setActiveSounds] = useState<Audio.Sound[]>([]);

  // Cleanup sounds when leaving the screen
  useEffect(() => {
    return () => {
      activeSounds.forEach(sound => sound.unloadAsync());
    };
  }, [activeSounds]);

  // Audio Engine
  const playNote = async (note: string) => {
    try {
      const url = activeTab === 'Piano' ? PIANO_SOUNDS[note] : DRUM_SOUNDS[note];
      
      if (!url) {
        console.warn(`No sound found for note: ${note}`);
        return;
      }

      // Create and play sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      // Add to state so we can unload it later
      setActiveSounds(prev => [...prev, sound]);

      // Automatically unload from memory after playback finishes (optional optimization)
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });

    } catch (error) {
      console.log('Error playing sound', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Studio Mode: Always dark status bar */}
      <StatusBar barStyle="light-content" />
      
      {/* Dark Studio Background */}
      <LinearGradient
        colors={['#1e1b4b', '#0f172a', '#000000']}
        style={styles.background}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        
        {/* TAB SWITCHER */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity 
            style={[styles.segment, activeTab === 'Piano' && styles.segmentActive]}
            onPress={() => setActiveTab('Piano')}
          >
            <Text style={[styles.segmentText, activeTab === 'Piano' && styles.segmentTextActive]}>Piano</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.segment, activeTab === 'Drums' && styles.segmentActive]}
            onPress={() => setActiveTab('Drums')}
          >
            <Text style={[styles.segmentText, activeTab === 'Drums' && styles.segmentTextActive]}>Drums</Text>
          </TouchableOpacity>
        </View>
        
        {/* Spacer for balance */}
        <View style={{ width: 40 }} /> 
      </View>

      {/* INSTRUMENT RENDERER */}
      <View style={styles.instrumentArea}>
        {activeTab === 'Piano' ? (
          <Piano onPlay={playNote} />
        ) : (
          <Drums onPlay={playNote} />
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50, // Safe area top
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  segment: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  segmentActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  segmentText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 14,
  },
  segmentTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  instrumentArea: {
    flex: 1,
    justifyContent: 'center',
    // No padding here so instruments can touch edges if needed
  },
});