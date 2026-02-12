import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface PianoProps {
  onPlay: (note: string) => void;
}

export default function Piano({ onPlay }: PianoProps) {
  const whiteKeys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
  const blackKeys = [
    { note: 'C#4', pos: 1 }, 
    { note: 'D#4', pos: 2 }, 
    { note: 'F#4', pos: 4 }, 
    { note: 'G#4', pos: 5 }, 
    { note: 'A#4', pos: 6 }
  ];

  return (
    <View style={styles.pianoContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pianoScroll}>
        {/* White Keys */}
        {whiteKeys.map((note) => (
          <TouchableOpacity
            key={note}
            style={styles.whiteKey}
            activeOpacity={0.8}
            onPressIn={() => onPlay(note)}
          >
            <Text style={styles.keyLabel}>{note}</Text>
          </TouchableOpacity>
        ))}

        {/* Black Keys */}
        {blackKeys.map((k) => (
          <TouchableOpacity
            key={k.note}
            style={[styles.blackKey, { left: (k.pos * 60) - 18 }]} 
            activeOpacity={0.8}
            onPressIn={() => onPlay(k.note)}
          />
        ))}
      </ScrollView>
      <Text style={styles.instructionText}>Scroll to play more octaves</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pianoContainer: { height: 300, justifyContent: 'center' },
  pianoScroll: { paddingHorizontal: 20, position: 'relative' },
  whiteKey: {
    width: 60, height: 240, backgroundColor: 'white', marginRight: 2,
    borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
    justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 16,
  },
  blackKey: {
    position: 'absolute', top: 0, width: 36, height: 140,
    backgroundColor: '#1f2937', borderBottomLeftRadius: 6, borderBottomRightRadius: 6,
    zIndex: 10,
  },
  keyLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  instructionText: { textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: 20 },
});