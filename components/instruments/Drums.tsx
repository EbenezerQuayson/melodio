import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DrumsProps {
  onPlay: (note: string) => void;
}

export default function Drums({ onPlay }: DrumsProps) {
  const pads = [
    { id: 'Kick', color: '#ef4444' },
    { id: 'Snare', color: '#3b82f6' },
    { id: 'HiHat', color: '#eab308' },
    { id: 'Clap', color: '#a855f7' },
  ];

  return (
    <View style={styles.drumContainer}>
      <View style={styles.padGrid}>
        {pads.map((pad) => (
          <TouchableOpacity
            key={pad.id}
            style={[styles.drumPad, { borderColor: pad.color }]}
            activeOpacity={0.5}
            onPressIn={() => onPlay(pad.id)}
          >
            <View style={[styles.padInner, { backgroundColor: `${pad.color}40` }]}>
               <Ionicons name="musical-note" size={32} color={pad.color} />
               <Text style={styles.padLabel}>{pad.id}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drumContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  padGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  drumPad: { width: '45%', aspectRatio: 1, borderRadius: 24, borderWidth: 2, padding: 4 },
  padInner: { flex: 1, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  padLabel: { color: 'white', marginTop: 8, fontSize: 16, fontWeight: 'bold' },
});