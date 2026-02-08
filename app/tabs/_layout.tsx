import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // 1. The Colors
        tabBarActiveTintColor: '#a855f7', // Brand Purple
        tabBarInactiveTintColor: '#64748b', // Slate Gray (muted)
        
        // 2. The Bar Style
        tabBarStyle: {
          backgroundColor: '#0f172a', // Matches dashboard bottom gradient
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.1)', // Subtle glass border
          height: Platform.OS === 'ios' ? 85 : 65, // Taller for better touch targets
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        
        // 3. Text Style
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={24} color={color} /> 
            // 'grid' looks more like a Dashboard than 'home'
          ),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ear-training"
        options={{
          title: 'Ear Gym', // "Gym" sounds more active/training focused
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ear-outline" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}