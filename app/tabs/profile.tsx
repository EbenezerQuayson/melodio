import React, {useCallback} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/hooks/useProfile';

export default function Profile() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { profile, loading, user , refetch} = useProfile();

  useFocusEffect(
    useCallback(() => {
      refetch(); // Refetch profile data when the screen is focused
    }, [refetch])
  );

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/'); 
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', backgroundColor: colors.background }]}>
        <Text style={{ textAlign: 'center', color: colors.text }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  // --- FIX: Robust Avatar Logic ---
  // 1. If profile has a custom avatar, use it.
  // 2. If not, use UI Avatars with their display name.
  // 3. If display name is also missing, fallback to "Melodio User".
  const displayName = profile?.display_name || 'Melodio User';
  const avatarUrl = profile?.avatar_url 
    ? profile.avatar_url 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=a855f7&color=fff&size=200`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* 1. Background */}
      <LinearGradient
        colors={colors.backgroundGradient}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 2. Profile Header (Avatar + Name) */}
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { borderColor: colors.tint }]}> 
             {/* Added borderColor logic to match theme */}
            <Image 
              key={avatarUrl} // Force re-render if URL changes
              source={{ uri: avatarUrl }} 
              style={styles.avatar} 
            />
            <View style={[styles.editBadge, { borderColor: colors.background }]}>
               {/* Badge border matches background to look cut-out */}
              <Ionicons name="pencil" size={16} color="white" />
            </View>
          </View>

          <Text style={[styles.name, { color: colors.text }]}>
            {profile?.display_name || 'Set your name'}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {profile?.username ? `@${profile.username}` : user?.email}
          </Text>
          
          <View style={styles.proBadge}>
            <Text style={styles.proText}>PRO MEMBER</Text>
          </View>
        </View>

        {/* 3. Stats Grid */}
        <View style={[styles.statsContainer, { backgroundColor: colors.cardBg }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{profile?.streak ?? 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Streak</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{profile?.xp ?? 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total XP</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>Lv. {profile?.level ?? 1}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rank</Text>
          </View>
        </View>

        {/* 4. Menu Options */}
        <View style={styles.menuContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>General</Text>
          
          <MenuItem 
            icon="person-outline" 
            label="Edit Profile" 
            colors={colors} 
            onPress={() => router.push('/tabs/edit_profile')} // Make sure this path is correct!
          />
          <MenuItem 
          icon="notifications-outline" 
          label="Notifications" colors={colors} 
          onPress={() => router.push('/tabs/notifications')}
           />

          <MenuItem 
           icon="shield-checkmark-outline" 
           label="Privacy & Security"
           colors={colors}
           onPress={() => router.push('/tabs/privacy')}
           />
          
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Support</Text>
          <MenuItem 
  icon="help-buoy-outline" 
  label="Help & Support" 
  colors={colors} 
  onPress={() => router.push('/tabs/help_support')} 
/>
          <MenuItem icon="star-outline" label="Rate Melodio" colors={colors} />
        </View>

        {/* 5. Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0 (Beta)</Text>

      </ScrollView>
    </View>
  );
}

// --- Reusable Menu Item ---
function MenuItem({ icon, label, colors, onPress }: { icon: any, label: string, colors: any, onPress?: () => void }) {
  return (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: colors.cardBg }]} 
      onPress={onPress}
    >
      <View style={[styles.menuIconBox, { backgroundColor: colors.iconBg }]}>
        <Ionicons name={icon} size={22} color={colors.text} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
    borderWidth: 4, 
    borderRadius: 54, // slightly larger than avatar
    padding: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3, 
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 12,
  },
  proBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)', // Gold tint
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  proText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)', // Red border
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red tint
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  },
});