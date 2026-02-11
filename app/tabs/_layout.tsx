import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
  <Tabs
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.tint, // Use your theme color
    tabBarInactiveTintColor: colors.tabBarInactiveTintColor, // e.g., '#64748b'
    
    tabBarStyle: {
      backgroundColor: colors.background,
      borderTopColor: colors.cardBorder,
      borderTopWidth: 1,
      height: Platform.OS === 'ios' ? 85 : 65,
      paddingBottom: Platform.OS === 'ios' ? 30 : 10,
      paddingTop: 10,
      elevation: 0, // Removes Android shadow for a cleaner flat look
    },
    
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
      marginTop: 2,
    },
  }}
>
  {/* 1. HOME: The Dashboard */}
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color, focused }) => (
        // "Home" is warmer than "Grid". 
        // Using "focused" lets us switch between filled/outline icons!
        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
      ),
    }}
  />

  {/* 2. LEARN: The Classroom (Includes Ear Gym now) */}
  <Tabs.Screen
    name="learn"
    options={{
      title: 'Learn',
      tabBarIcon: ({ color, focused }) => (
        <Ionicons name={focused ? "book" : "book-outline"} size={24} color={color} />
      ),
    }}
  />

  {/* 3. EXPLORE: The Community */}
  <Tabs.Screen
    name="explore" 
    options={{
      title: 'Explore',
      tabBarIcon: ({ color, focused }) => (
        <Ionicons name={focused ? "compass" : "compass-outline"} size={26} color={color} />
      ),
    }}
  />

  {/* 4. PROFILE: The User */}
  <Tabs.Screen
    name="profile"
    options={{
      title: 'Profile',
      tabBarIcon: ({ color, focused }) => (
        <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
      ),
    }}
  />




      <Tabs.Screen
  name="edit_profile" // This must match the filename exactly
  options={{
    href: null, // <--- This hides it from the bottom bar
    headerShown: false,
  }}
/>

<Tabs.Screen
  name="notifications" // This must match the filename exactly
  options={{
    href: null, // <--- This hides it from the bottom bar
    headerShown: false,
  }}
/>

<Tabs.Screen
  name="privacy" // This must match the filename exactly
  options={{
    href: null, // <--- This hides it from the bottom bar
    headerShown: false,
  }}
/>

<Tabs.Screen
  name="help_support" 
  options={{
    href: null,
  }}
/>

<Tabs.Screen
  name="ear-training" 
  options={{
    href: null,
  }}
/>

    </Tabs>
  );
}