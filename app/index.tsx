import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable, StatusBar } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  withSpring,
  Easing,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthProvider';

const { width, height } = Dimensions.get('window');

// --- Ripple Component (Keep this, it's great) ---
const RippleRing = ({ delay, active }: { delay: number, active: boolean }) => {
  const ring = useSharedValue(0);

  useEffect(() => {
    // Only animate if active
    if (active) {
      ring.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
          -1, false
        )
      );
    } else {
      ring.value = withTiming(0); // Fade out when done
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: active ? interpolate(ring.value, [0, 0.7, 1], [0.8, 0.4, 0]) : withTiming(0),
    transform: [
      { scale: interpolate(ring.value, [0, 1], [0.8, 3]) },
    ],
  }));

  return <Animated.View style={[styles.ring, animatedStyle]} />;
};

export default function Index() {
  const { session, loading } = useAuth();
  const router = useRouter();

  // Animation Values
  const logoScale = useSharedValue(1);
  const logoTranslateY = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  useEffect(() => {
    // 1. The Heartbeat (While Loading)
    if (loading) {
      logoScale.value = withRepeat(
        withTiming(1.2, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        -1, true
      );
    } else {
      // 2. The Transformation (When Loaded)
      // Stop the heartbeat and reset scale
      logoScale.value = withTiming(1, { duration: 500 });
      
      if (!session) {
        // If not logged in: Move Logo UP and Show Buttons
        logoTranslateY.value = withSpring(-120, { damping: 12 }); // Slide up
        
        // Delay the text fade-in slightly for cinematic effect
        contentOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
        contentTranslateY.value = withDelay(300, withSpring(0, { damping: 12 }));
      }
    }
  }, [loading, session]);

  // Styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { translateY: logoTranslateY.value }
    ],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  // --- RENDER ---

  // 1. If Logged In: Silent Redirect (Keep it fast)
  if (!loading && session) return <Redirect href="/tabs" />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background */}
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#000000']}
        style={StyleSheet.absoluteFill}
      />

      {/* The Sound Waves (Only visible when loading) */}
      <View style={styles.rippleContainer}>
        <RippleRing delay={0} active={loading} />
        <RippleRing delay={500} active={loading} />
        <RippleRing delay={1000} active={loading} />
      </View>

      {/* The Morphing Logo */}
      <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
        <View style={styles.logoContainer}>
          <Ionicons name="musical-notes" size={50} color="white" />
        </View>
      </Animated.View>

      {/* The Welcome Content (Fades in) */}
      <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
        
        <View style={styles.textBlock}>
          <Text style={styles.title}>Melodio.</Text>
          <Text style={styles.tagline}>
            Master your instrument.{'\n'}Find your rhythm.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* Primary Button */}
          <Pressable 
            onPress={() => router.push('/auth/register')}
            style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
          >
            <LinearGradient
              colors={['#a855f7', '#7c3aed']}
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <Text style={styles.btnTextPrimary}>Get Started</Text>
            </LinearGradient>
          </Pressable>

          {/* Secondary Button */}
          <Pressable 
            onPress={() => router.push('/auth/login')}
            style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnTextSecondary}>I have an account</Text>
          </Pressable>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  rippleContainer: {
    position: 'absolute',
    top: height / 2 - 50, // Center vertically based on initial logo position
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  logoWrapper: {
    position: 'absolute',
    zIndex: 20,
    // Initially centered
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6366f1', // Brand Purple
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 50, // Anchored to bottom
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  textBlock: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#cbd5e1', // Slate-300
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  btnPrimary: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientBtn: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  btnTextPrimary: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnSecondary: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  btnTextSecondary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});