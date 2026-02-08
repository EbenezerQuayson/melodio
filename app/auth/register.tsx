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
  StatusBar,
  ScrollView 
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const router = useRouter();
  
  // New State Variables
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUp() {
    // 1. Basic Validation
    if (!email || !password || !fullName || !username) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    // 2. Pass metadata to Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
          avatar_url: '', // Optional: placeholder for later
        },
      },
    });
    
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email to confirm!');
      router.push('/auth/login');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#4c1d95', '#1e1b4b', '#000000']} 
        style={styles.background}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.header}>
            <Text style={styles.title}>Join Melodio.</Text>
            <Text style={styles.subtitle}>Create your artist profile.</Text>
          </View>

          <View style={styles.form}>
            
            {/* 1. Full Name Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.icon} />
              <TextInput 
                placeholder="Full Name" 
                placeholderTextColor="#64748b"
                onChangeText={setFullName}
                value={fullName}
                style={styles.input} 
              />
            </View>

            {/* 2. Username Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="at-outline" size={20} color="#94a3b8" style={styles.icon} />
              <TextInput 
                placeholder="Username" 
                placeholderTextColor="#64748b"
                onChangeText={setUsername}
                value={username}
                autoCapitalize="none"
                style={styles.input} 
              />
            </View>

            {/* 3. Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.icon} />
              <TextInput 
                placeholder="Email" 
                placeholderTextColor="#64748b"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input} 
              />
            </View>

            {/* 4. Password Input */}
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

            {/* Action Button */}
            <Pressable 
              onPress={signUp} 
              disabled={loading}
              style={({ pressed }) => [
                styles.buttonContainer,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
              ]}
            >
              <LinearGradient
                colors={['#a855f7', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </LinearGradient>
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <Pressable>
                  <Text style={styles.link}>Sign In</Text>
                </Pressable>
              </Link>
            </View>

          </View>
        </ScrollView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60, // Extra padding for status bar
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
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
    marginTop: 16, // Added a bit more space before button
    borderRadius: 30,
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
    paddingBottom: 20,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  link: {
    color: '#a855f7',
    fontWeight: 'bold',
    fontSize: 14,
  },
});