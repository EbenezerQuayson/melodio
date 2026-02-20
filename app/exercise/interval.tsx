import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const {width} = Dimensions.get('window');

// 1. SOUND DATA (Reusing your virtual instrument URLs)
const SOUND_BASE = 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3/';

const PIANO_SOUNDS: string[] = [
  `${SOUND_BASE}C4.mp3`,   // 0: C4
  `${SOUND_BASE}Db4.mp3`,  // 1: C#4 (Db)
  `${SOUND_BASE}D4.mp3`,   // 2: D4
  `${SOUND_BASE}Eb4.mp3`,  // 3: D#4 (Eb)
  `${SOUND_BASE}E4.mp3`,   // 4: E4
  `${SOUND_BASE}F4.mp3`,   // 5: F4
  `${SOUND_BASE}Gb4.mp3`,  // 6: F#4 (Gb)
  `${SOUND_BASE}G4.mp3`,   // 7: G4
  `${SOUND_BASE}Ab4.mp3`,  // 8: G#4 (Ab)
  `${SOUND_BASE}A4.mp3`,   // 9: A4
  `${SOUND_BASE}Bb4.mp3`,  // 10: A#4 (Bb)
  `${SOUND_BASE}B4.mp3`,   // 11: B4
  `${SOUND_BASE}C5.mp3`,   // 12: C5
];

// 2. THE INTERVALS WE ARE TESTING
const INTERVALS = [
  { name: 'Minor 2nd', semitones: 1 },
  { name: 'Major 3rd', semitones: 4 },
  { name: 'Perfect 4th', semitones: 5 },
  { name: 'Perfect 5th', semitones: 7 },
];

const TOTAL_QUESTIONS = 10;

export default function IntervalExercise() {
  const router = useRouter();

  // Game State
  const [rootIndex, setRootIndex] = useState<number>(0);
  const [targetInterval, setTargetInterval] = useState(INTERVALS[0]);
  const [options, setOptions] = useState<string[]>([]);
  
  // Player State & Progress State
  const [hasGuessed, setHasGuessed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // --- GAME LOGIC ---

  // Generate a new question
  const generateQuestion = useCallback(() => {
    // 1. Pick a random interval from our list
    const randomInterval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
    
    // 2. Pick a root note (Make sure root + interval doesn't go past C5, index 12)
    const maxRootIndex = 12 - randomInterval.semitones;
    const randomRoot = Math.floor(Math.random() * (maxRootIndex + 1));

    // 3. Shuffle options (We want the correct answer + 3 random ones)
    // For simplicity, we'll just show all 4 intervals as the fixed options for now
    const shuffledOptions = [...INTERVALS].map(i => i.name).sort(() => Math.random() - 0.5);

    setRootIndex(randomRoot);
    setTargetInterval(randomInterval);
    setOptions(shuffledOptions);
    setHasGuessed(false);
    setSelectedAnswer(null);

    // Automatically play the sound for the new question
    setTimeout(() => playInterval(randomRoot, randomInterval.semitones), 500);
  }, []);

  // Initialize first question on mount
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  // Audio Engine: Play Root, wait, Play Target
  const playInterval = async (root: number, intervalJump: number) => {
    if (isPlaying) return;
    setIsPlaying(true);

    try {
      // Play Note 1
      const rootUrl = PIANO_SOUNDS[root];
      const { sound: sound1 } = await Audio.Sound.createAsync({ uri: rootUrl }, { shouldPlay: true });
      
      // Wait 600ms
      await new Promise(resolve => setTimeout(resolve, 600));

      // Play Note 2
      const targetUrl = PIANO_SOUNDS[root + intervalJump];
      const { sound: sound2 } = await Audio.Sound.createAsync({ uri: targetUrl }, { shouldPlay: true });

      // Cleanup
      setTimeout(() => {
        sound1.unloadAsync();
        sound2.unloadAsync();
        setIsPlaying(false);
      }, 2000);

    } catch (error) {
      console.log('Audio Error:', error);
      setIsPlaying(false);
    }
  };

  // Handle User Guess
  const handleGuess = (answer: string) => {
    if (hasGuessed) return; // Prevent multiple guesses

    setSelectedAnswer(answer);
    setHasGuessed(true);

    if (answer === targetInterval.name) {
       const isHotStreak = streak >=2;
       const earnedXP = isHotStreak ? 20 : 10; // Bonus XP for hot streaks
      setScore(prev => prev + earnedXP); // +10 XP
      setStreak(prev => prev + 1);
    } else {
        //Wrong Guess, reset streak
        setStreak(0);
    }
  };

  //Handle Next Button
  const handleNext = () => {
    if (questionCount + 1 >= TOTAL_QUESTIONS) {
      setIsGameOver(true);
    } else {
        setQuestionCount(prev => prev + 1);
        generateQuestion();
    }
  }

  // --- GAME OVER SCREEN ---
  if (isGameOver) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" />
        <Ionicons name="trophy" size={80} color="#fbbf24" style={{ marginBottom: 20 }} />
        <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>Session Complete!</Text>
        <Text style={{ color: '#94a3b8', fontSize: 18, marginBottom: 40 }}>You earned <Text style={{ color: '#fbbf24', fontWeight: 'bold' }}>{score} XP</Text></Text>
        
        <TouchableOpacity 
          style={[styles.nextBtn, { width: '80%', marginBottom: 16 }]} 
          onPress={() => router.back()}
        >
          <Text style={styles.nextBtnText}>Return to Gym</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  

  // --- ACTIVE GAME UI ---
  const progressPercentage = Math.round((questionCount / TOTAL_QUESTIONS) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
     {/* 1. HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        
        {/* NEW STATS CONTAINER */}
        <View style={styles.statsContainer}>
          
          {/* Streak Pill (Turns red when streak >= 3) */}
          <View style={[
            styles.statPill, 
            { backgroundColor: streak >= 3 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)' }
          ]}>
            <Text style={[
              styles.statText, 
              { color: streak >= 3 ? '#ef4444' : '#f8fafc' }
            ]}>
              🔥 {streak}
            </Text>
          </View>

          {/* XP Score Pill with Multiplier Badge */}
          <View style={[styles.statPill, { backgroundColor: 'rgba(251,191,36,0.1)', flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
            <Text style={[styles.statText, { color: '#fbbf24' }]}>
              ⭐ {score} XP
            </Text>
            
            {/* The x2 Badge (Only visible when streak is 3+) */}
            {streak >= 3 && (
              <View style={styles.multiplierBadge}>
                <Text style={styles.multiplierText}>x2</Text>
              </View>
            )}
          </View>
          
        </View>
      </View>

      {/* 2. PROGRESS BAR */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Question {questionCount} of {TOTAL_QUESTIONS}</Text>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      {/* 3. PLAY BUTTON AREA */}
      <View style={styles.playArea}>
        <Text style={styles.promptText}>Listen to the interval...</Text>
        
        <TouchableOpacity 
          style={[styles.playBtn, isPlaying && styles.playBtnActive]}
          onPress={() => playInterval(rootIndex, targetInterval.semitones)}
          disabled={isPlaying}
        >
          <Ionicons name={isPlaying ? "musical-notes" : "volume-high"} size={64} color={isPlaying ? "#a855f7" : "#fff"} />
        </TouchableOpacity>
        
        <Text style={styles.helperText}>Tap to replay</Text>
      </View>

      {/* 4. MULTIPLE CHOICE GRID */}
      <View style={styles.grid}>
        {options.map((option) => {
          // Determine button color based on guess state
          let bgColor = '#1e293b'; // Default dark blue
          let borderColor = 'rgba(255,255,255,0.1)';

          if (hasGuessed) {
            if (option === targetInterval.name) {
              bgColor = '#10b981'; // Green (Correct answer is always revealed)
              borderColor = '#059669';
            } else if (option === selectedAnswer) {
              bgColor = '#ef4444'; // Red (Wrong guess)
              borderColor = '#b91c1c';
            }
          }

          return (
            <TouchableOpacity 
              key={option}
              style={[styles.optionBtn, { backgroundColor: bgColor, borderColor }]}
              onPress={() => handleGuess(option)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 5. NEXT BUTTON (Only shows after guessing) */}
      <View style={styles.footer}>
        {hasGuessed && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>{questionCount >= TOTAL_QUESTIONS ? "Finish" : "Next Question"}</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },

  //Header
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  iconBtn: { padding: 4 },
  statsContainer: { flexDirection: 'row', gap: 8 },
  statPill: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  statText: { fontWeight: 'bold', fontSize: 16 },
  multiplierBadge: {
    backgroundColor: '#fbbf24', // Solid Gold
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  multiplierText: {
    color: '#000', // Black text on gold background
    fontSize: 12,
    fontWeight: '900',
  },

  // Progress Bar
  progressContainer: { paddingHorizontal: 20, marginBottom: 10 },
  progressText: { color: '#64748b', fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  progressBarTrack: { height: 8, backgroundColor: '#1e293b', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 4 },

  //Play Area
  playArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  promptText: { color: '#94a3b8', fontSize: 18, marginBottom: 40 },
  playBtn: { 
    width: 140, height: 140, borderRadius: 70, 
    backgroundColor: '#3b82f6', 
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#3b82f6", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10
  },
  playBtnActive: { backgroundColor: '#1e1b4b', shadowColor: '#a855f7' },
  helperText: { color: '#64748b', fontSize: 14, marginTop: 24 },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 16, justifyContent: 'center' },
  optionBtn: { 
    width: '46%', paddingVertical: 24, 
    borderRadius: 16, borderWidth: 2, 
    justifyContent: 'center', alignItems: 'center' 
  },
  optionText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  // Footer
  footer: { height: 100, padding: 20, justifyContent: 'flex-start' },
  nextBtn: { 
    backgroundColor: '#a855f7', flexDirection: 'row', 
    justifyContent: 'center', alignItems: 'center', 
    padding: 18, borderRadius: 16, gap: 8 
  },
  nextBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});