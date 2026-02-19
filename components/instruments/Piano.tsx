import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  useWindowDimensions 
} from 'react-native';

interface PianoProps {
  onPlay: (note: string) => void;
}

export default function Piano({ onPlay }: PianoProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // RESPONSIVE LOGIC:
  // Portrait: Fit exactly 7 white keys (1 Octave) on screen for thumb play.
  // Landscape: Fixed 60px width for range (2+ Octaves).
  const WHITE_KEY_WIDTH = isPortrait ? width / 7 : 60;
  const BLACK_KEY_WIDTH = WHITE_KEY_WIDTH * 0.6; // Black keys are 60% of white width
  const BLACK_KEY_HEIGHT = isPortrait ? '55%' : '60%'; // Slightly shorter in portrait

  // Key Definition
  const whiteKeys = [
    { note: 'C4', label: 'C4', type: 'C' }, 
    { note: 'D4', label: '', type: '' }, 
    { note: 'E4', label: '', type: '' }, 
    { note: 'F4', label: '', type: '' }, 
    { note: 'G4', label: '', type: '' }, 
    { note: 'A4', label: '', type: '' }, 
    { note: 'B4', label: '', type: '' }, 
    { note: 'C5', label: 'C5', type: 'C' },
    { note: 'D5', label: '', type: '' }, 
    { note: 'E5', label: '', type: '' }, 
    { note: 'F5', label: '', type: '' }, 
    { note: 'G5', label: '', type: '' }, 
    { note: 'A5', label: '', type: '' }, 
    { note: 'B5', label: '', type: '' }, 
    { note: 'C6', label: 'C6', type: 'C' },
  ];

  const blackKeys = [
    { note: 'C#4', pos: 1 }, 
    { note: 'D#4', pos: 2 }, 
    // Skip E
    { note: 'F#4', pos: 4 }, 
    { note: 'G#4', pos: 5 }, 
    { note: 'A#4', pos: 6 },
    // Skip B
    { note: 'C#5', pos: 8 }, 
    { note: 'D#5', pos: 9 }, 
    // Skip E
    { note: 'F#5', pos: 11 }, 
    { note: 'G#5', pos: 12 }, 
    { note: 'A#5', pos: 13 },
  ];

  return (
    <View style={styles.pianoContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.pianoScroll}
        // In portrait, we might want to start scrolling slightly if 7 keys don't fit perfectly, 
        // but usually we want to start at C4.
      >
        
        {/* WHITE KEYS */}
        {whiteKeys.map((k) => (
          <TouchableOpacity
            key={k.note}
            style={[
              styles.whiteKey, 
              { width: WHITE_KEY_WIDTH } // Apply Dynamic Width
            ]}
            activeOpacity={0.9}
            onPressIn={() => onPlay(k.note)}
          >
            {k.label ? <Text style={styles.keyLabel}>{k.label}</Text> : null}
            
            <View style={[
              styles.colorStrip, 
              { backgroundColor: k.type === 'C' ? '#4fd1c5' : '#6366f1' } 
            ]} />
          </TouchableOpacity>
        ))}

        {/* BLACK KEYS (Overlay) */}
        {blackKeys.map((k) => (
          <TouchableOpacity
            key={k.note}
            style={[
              styles.blackKey, 
              { 
                width: BLACK_KEY_WIDTH,
                height: BLACK_KEY_HEIGHT,
                // Calculate position based on dynamic white key width
                // (Pos * WhiteWidth) - (BlackWidth / 2) to center it on the line
                left: (k.pos * WHITE_KEY_WIDTH) - (BLACK_KEY_WIDTH / 2) 
              }
            ]}
            activeOpacity={0.9}
            onPressIn={() => onPlay(k.note)}
          />
        ))}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pianoContainer: {
    flex: 1,
    backgroundColor: '#000', 
  },
  pianoScroll: {
    paddingRight: 0, // Removed extra padding so it fits snug in portrait
  },
  whiteKey: {
    height: '100%', 
    backgroundColor: 'white',
    marginRight: 2, 
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12, // Increased padding
    position: 'relative',
  },
  blackKey: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#222',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#000',
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  keyLabel: {
    color: '#333',
    fontSize: 16, // Larger font
    fontWeight: '700',
    marginBottom: 8,
  },
  colorStrip: {
    width: '80%',
    height: 14, // Thicker strip
    borderRadius: 4,
    marginBottom: 4,
    opacity: 0.9,
  },
});