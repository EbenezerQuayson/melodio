import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons'; // Built into Expo

// Use a nice background image if you have one, or just rely on the gradient
// const BG_IMAGE = require('../../assets/studio-bg.jpg'); 

export default function Welcome() {
  const router = useRouter();

  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Smooth fade-in entrance
    opacity.value = withTiming(1, { duration: 1000 });
    translateY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Deep, Rich Background Gradient */}
      <LinearGradient
        colors={['#2e026d', '#15162c', '#000000']} // Purple to Deep Blue/Black
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* 2. Main Content Area */}
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.heroSection, animatedStyle]}>
          <View style={styles.iconContainer}>
            <Ionicons name="musical-notes" size={60} color="#a855f7" />
          </View>
          
          <Text style={styles.title}>Melodio</Text>
          <Text style={styles.tagline}>
            Learn music. Train your ear.{'\n'}Master your instrument.
          </Text>
        </Animated.View>

        {/* 3. Action Buttons */}
        <Animated.View style={[styles.bottomContainer, animatedStyle]}>
          
          {/* Primary Button: Create Account */}
          <Pressable 
            onPress={() => router.push('/auth/register')}
            style={({ pressed }) => [
              styles.buttonPrimary,
              pressed && styles.buttonPressed
            ]}
          >
            <LinearGradient
              colors={['#a855f7', '#7c3aed']} // Vibrant Purple Gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonTextPrimary}>Get Started Free</Text>
            </LinearGradient>
          </Pressable>

          {/* Secondary Button: Login */}
          <Pressable 
            onPress={() => router.push('/auth/login')}
            style={({ pressed }) => [
              styles.buttonSecondary,
              pressed && styles.buttonPressedSecondary
            ]}
          >
            <Text style={styles.buttonTextSecondary}>I have an account</Text>
          </Pressable>

        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 50,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)', // Subtle purple border
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: '#cbd5e1', // Light gray
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.8,
  },
  bottomContainer: {
    gap: 16,
    width: '100%',
  },
  buttonPrimary: {
    borderRadius: 30,
    overflow: 'hidden', // Ensures gradient stays inside rounded corners
    elevation: 5,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }], // Subtle shrink on press
    opacity: 0.9,
  },
  buttonTextPrimary: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonSecondary: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)', // Glassy look
  },
  buttonPressedSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonTextSecondary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});