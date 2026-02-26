import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  SafeAreaView,
  useWindowDimensions, // <--- 1. Import this
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

import Piano from '@/components/instruments/Piano';
import Drums from '@/components/instruments/Drums';

// --- SOUND CONSTANTS (Keep existing) ---
const SOUND_BASE = 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/';

const PIANO_SOUNDS: Record<string, string> = {
  'C4': `${SOUND_BASE}C4.mp3`,
  'C#4': `${SOUND_BASE}Db4.mp3`,
  'D4': `${SOUND_BASE}D4.mp3`,
  'D#4': `${SOUND_BASE}Eb4.mp3`,
  'E4': `${SOUND_BASE}E4.mp3`,
  'F4': `${SOUND_BASE}F4.mp3`,
  'F#4': `${SOUND_BASE}Gb4.mp3`,
  'G4': `${SOUND_BASE}G4.mp3`,
  'G#4': `${SOUND_BASE}Ab4.mp3`,
  'A4': `${SOUND_BASE}A4.mp3`,
  'A#4': `${SOUND_BASE}Bb4.mp3`,
  'B4': `${SOUND_BASE}B4.mp3`,
  'C5': `${SOUND_BASE}C5.mp3`,
  'C#5': `${SOUND_BASE}Db5.mp3`,
  'D5': `${SOUND_BASE}D5.mp3`,
  'D#5': `${SOUND_BASE}Eb5.mp3`,
  'E5': `${SOUND_BASE}E5.mp3`,
  'F5': `${SOUND_BASE}F5.mp3`,
  'F#5': `${SOUND_BASE}Gb5.mp3`,
  'G5': `${SOUND_BASE}G5.mp3`,
  'G#5': `${SOUND_BASE}Ab5.mp3`,
  'A5': `${SOUND_BASE}A5.mp3`,
  'A#5': `${SOUND_BASE}Bb5.mp3`,
  'B5': `${SOUND_BASE}B5.mp3`,
  'C6': `${SOUND_BASE}C6.mp3`,
};

const DRUM_SOUNDS: Record<string, string> = {
  'Kick': 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
  'Snare': 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3',
  'HiHat': 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
  'Clap': 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
};

export default function VirtualInstruments() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [activeTab, setActiveTab] = useState<'Piano' | 'Drums'>('Piano');
  const [activeSounds, setActiveSounds] = useState<Audio.Sound[]>([]);

  // 1. Allow Rotation (Unlock on mount)
  useEffect(() => {
    async function unlockOrientation() {
      await ScreenOrientation.unlockAsync();
    }
    unlockOrientation();
    return () => {
      // Optional: Lock back to portrait when leaving if you want
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    return () => {
      activeSounds.forEach(sound => sound.unloadAsync());
    };
  }, [activeSounds]);

  const playNote = async (note: string) => {
    try {
      const url = activeTab === 'Piano' ? PIANO_SOUNDS[note] : DRUM_SOUNDS[note];
      if (!url) return;
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
      setActiveSounds(prev => [...prev, sound]);
    } catch (error) {
      console.log('Error playing sound', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
      <StatusBar hidden={isLandscape} barStyle="light-content" />
      
      {/* --- RESPONSIVE HEADER --- */}
      <View style={[
        styles.topBar, 
        // In Portrait, stack vertically. In Landscape, row.
        { flexDirection: isLandscape ? 'row' : 'column', height: isLandscape ? 50 : 'auto', gap: isLandscape ? 0 : 12 }
      ]}>
        
        <View style={styles.leftControls}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
            {isLandscape && <Text style={styles.navText}>Exit</Text>}
          </TouchableOpacity>
          
          <View style={styles.divider} />

          {/* Instrument Switcher */}
          <View style={styles.instrumentSwitcher}>
             <TouchableOpacity 
               style={[styles.switchBtn, activeTab === 'Piano' && styles.switchBtnActive]}
               onPress={() => setActiveTab('Piano')}
             >
                <Ionicons name="musical-notes" size={16} color={activeTab === 'Piano' ? '#fff' : '#888'} />
                {/* Show text only in Portrait for clarity, or always */}
                {!isLandscape && <Text style={[styles.btnText, {color: activeTab === 'Piano' ? '#fff':'#888', marginLeft: 4}]}>Piano</Text>}
             </TouchableOpacity>
             <TouchableOpacity 
               style={[styles.switchBtn, activeTab === 'Drums' && styles.switchBtnActive]}
               onPress={() => setActiveTab('Drums')}
             >
                <Ionicons name="ellipse" size={16} color={activeTab === 'Drums' ? '#fff' : '#888'} />
                {!isLandscape && <Text style={[styles.btnText, {color: activeTab === 'Drums' ? '#fff':'#888', marginLeft: 4}]}>Drums</Text>}
             </TouchableOpacity>
          </View>
        </View>

        {/* Studio Controls (Hide some in Portrait to save space) */}
        <View style={[styles.studioControls, { display: isLandscape ? 'flex' : 'none' }]}>
            <View style={styles.usbButton}>
              <View style={styles.ledLight} />
              <Text style={styles.usbText}>MIDI</Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.outlineBtn}><Text style={styles.btnText}>SCALE</Text></TouchableOpacity>
              <TouchableOpacity style={styles.outlineBtn}><Text style={styles.btnText}>KEY</Text></TouchableOpacity>
            </View>
        </View>

        {/* Right Side Info */}
        <View style={styles.rightControls}>
          <Text style={styles.scaleText}>C Major</Text>
        </View>
      </View>

      {/* --- SECONDARY BAR (Only visible in Landscape) --- */}
      {isLandscape && (
        <View style={styles.secondaryBar}>
          <TouchableOpacity style={styles.outlineBtnSmall}>
             <Text style={styles.btnTextSmall}>CHORD PAD</Text>
          </TouchableOpacity>

          <View style={styles.transposer}>
             <Text style={styles.transposerText}>—</Text>
             <View style={{flex:1}} />
             <Text style={styles.transposerText}>+</Text>
          </View>

          <TouchableOpacity style={styles.outlineBtnSmall}>
             <Text style={styles.btnTextSmall}>OCTAVE</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- INSTRUMENT AREA --- */}
      <View style={styles.instrumentArea}>
        {activeTab === 'Piano' ? (
           <Piano onPlay={playNote} />
        ) : (
           <Drums onPlay={playNote} />
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222', 
  },
  // TOP BAR
  topBar: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  studioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    // In portrait, push this to the right using auto margin if needed
    marginLeft: 'auto', 
  },
  
  // Navigation & Switcher
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  navText: { color: '#ccc', fontSize: 12, fontWeight: '700' },
  divider: { width: 1, height: 20, backgroundColor: '#444' },

  instrumentSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#333',
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  switchBtnActive: {
    backgroundColor: '#444',
  },

  // Other Controls
  usbButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 6,
  },
  ledLight: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4fd1c5' },
  usbText: { color: '#ccc', fontWeight: '600', fontSize: 10 },
  
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: '#555',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  btnText: { color: '#ccc', fontSize: 10, fontWeight: '600' },
  scaleText: { color: '#fff', fontSize: 14, fontFamily: 'monospace' },

  // SECONDARY BAR
  secondaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 4, 
    height: 40, 
  },
  outlineBtnSmall: {
    borderWidth: 1,
    borderColor: '#555',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  btnTextSmall: { color: '#aaa', fontSize: 9, fontWeight: '600' },
  transposer: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: '#111',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: 300,
    borderWidth: 1,
    borderColor: '#333',
  },
  transposerText: { color: '#666', fontSize: 14, fontWeight: 'bold' },

  // INSTRUMENT AREA
  instrumentArea: {
    flex: 1, 
    backgroundColor: '#000',
    borderTopWidth: 4,
    borderTopColor: '#111',
  },
});