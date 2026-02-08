import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  StatusBar 
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { supabase } from '@/lib/supabase'; // Keeping your path
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Your Logic
  async function signIn() {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      // Optional: You might not need an alert here if it redirects instantly
      // alert('Logged in successfully!'); 
      router.replace('/tabs'); // Use replace to prevent going back to login
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Background Gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#000000']}
        style={styles.background}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.content}
      >
        {/* 2. Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back.</Text>
          <Text style={styles.subtitle}>Sign in to continue your session.</Text>
        </View>

        {/* 3. Input Fields */}
        <View style={styles.form}>
          
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.icon} />
            <TextInput 
              placeholder="Email" 
              placeholderTextColor="#64748b"
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none" // Important for emails!
              keyboardType="email-address"
              style={styles.input} 
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.icon} />
            <TextInput 
              placeholder="Password" 
              placeholderTextColor="#64748b"
              secureTextEntry 
              onChangeText={setPassword}
              value={password}
              style={styles.input} 
            />
          </View>

          {/* 4. Main Action Button */}
          <Pressable 
            onPress={signIn} 
            disabled={loading}
            style={({ pressed }) => [
              styles.buttonContainer,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
            ]}
          >
            <LinearGradient
              colors={['#a855f7', '#7c3aed']} // Purple Gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* 5. Footer Links */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/auth/register" asChild>
              <Pressable>
                <Text style={styles.link}>Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8', // Slate-400
  },
  form: {
    gap: 16, // Space between inputs
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)', // Transparent dark blue
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)', // Subtle border
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    height: '100%',
  },
  buttonContainer: {
    marginTop: 8,
    borderRadius: 30, // Pill shape
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#a855f7',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  link: {
    color: '#a855f7', // Brand purple
    fontWeight: 'bold',
    fontSize: 14,
  },
});