import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useWindowDimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DrumsProps {
  onPlay: (note: string) => void;
}

export default function Drums({ onPlay }: DrumsProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const pads = [
    { id: 'Kick', label: 'KICK', icon: 'ellipse', color: '#ef4444' },     // Red
    { id: 'Snare', label: 'SNARE', icon: 'square', color: '#3b82f6' },    // Blue
    { id: 'HiHat', label: 'HI-HAT', icon: 'triangle', color: '#eab308' }, // Yellow
    { id: 'Clap', label: 'CLAP', icon: 'flash', color: '#a855f7' },       // Purple
  ];

  return (
    <View style={[
      styles.drumContainer, 
      { 
        // Landscape: Align to bottom to be reachable
        justifyContent: isPortrait ? 'center' : 'flex-end',
        paddingBottom: isPortrait ? 0 : 20 
      }
    ]}>
      
      <View style={[
        styles.padGrid,
        {
          // Portrait: Wrap (2x2). Landscape: No Wrap (4x1).
          flexWrap: isPortrait ? 'wrap' : 'nowrap', 
          gap: isPortrait ? 16 : 12,
        }
      ]}>
        
        {pads.map((pad) => (
          <TouchableOpacity
            key={pad.id}
            activeOpacity={0.6}
            onPressIn={() => onPlay(pad.id)}
            style={[
              styles.drumPad,
              {
                borderColor: pad.color,
                // Responsive Sizing:
                // Portrait: 46% width (2 per row) + Square aspect ratio
                // Landscape: Flex 1 (share width equally) + Taller fixed height
                width: isPortrait ? '46%' : undefined,
                flex: isPortrait ? undefined : 1, 
                aspectRatio: isPortrait ? 1 : 1.3, // Rectangular in landscape to save vertical space
              }
            ]}
          >
            {/* Inner "Rubber" Surface */}
            <View style={[styles.padInner, { backgroundColor: `${pad.color}30` }]}>
               
               {/* Icon */}
               <Ionicons name={pad.icon as any} size={isPortrait ? 40 : 32} color={pad.color} />
               
               {/* Label */}
               <Text style={[
                 styles.padLabel, 
                 { fontSize: isPortrait ? 16 : 12, marginTop: isPortrait ? 8 : 4 }
               ]}>
                 {pad.label}
               </Text>

               {/* LED Light Indicator (Visual flair) */}
               <View style={[styles.led, { backgroundColor: pad.color }]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drumContainer: {
    flex: 1,
    padding: 16,
    // Background is handled by parent, but we ensure it's centered
  },
  padGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  drumPad: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 4, // Inner spacing for the "border" effect
    backgroundColor: '#111', // Dark housing
    
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  padInner: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  padLabel: {
    color: 'white',
    fontWeight: '800',
    letterSpacing: 1,
  },
  led: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.8,
  }
});