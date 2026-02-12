import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  StatusBar,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext'; 
import { supabase } from '@/lib/supabase';

export default function Privacy() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // State
  const [isPublic, setIsPublic] = useState(true);
  const [allowSearch, setAllowSearch] = useState(true);
  const [dataUsage, setDataUsage] = useState(false);

  // Handlers
  const handlePasswordReset = async () => {
    Alert.alert(
      "Reset Password",
      "We will send a password reset link to your email.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send Email", 
          onPress: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
              await supabase.auth.resetPasswordForEmail(user.email);
              Alert.alert("Email Sent", "Check your inbox for instructions.");
            }
          } 
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you absolutely sure? This action cannot be undone and you will lose all your data.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            // In a real app, you might need a backend function to fully wipe data
            Alert.alert("Request Received", "Your account deletion request has been processed.");
            supabase.auth.signOut();
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <LinearGradient
        colors={colors.backgroundGradient}
        style={styles.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: colors.iconBg }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* SECTION 1: SECURITY */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>SECURITY</Text>
        <View style={[styles.section, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          
          <TouchableOpacity style={styles.itemContainer} onPress={handlePasswordReset}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
                <Ionicons name="key-outline" size={20} color={colors.text} />
              </View>
              <Text style={[styles.label, { color: colors.text }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

          <TouchableOpacity style={styles.itemContainer}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.text} />
              </View>
              <Text style={[styles.label, { color: colors.text }]}>Two-Factor Authentication</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.iconBg }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>OFF</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* SECTION 2: PRIVACY */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>PRIVACY</Text>
        <View style={[styles.section, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          
          <ToggleItem 
            label="Public Profile" 
            subLabel="Allow others to see your stats"
            value={isPublic} 
            onValueChange={setIsPublic} 
            colors={colors}
            icon="eye-outline"
          />
          
          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          
          <ToggleItem 
            label="Allow Search" 
            subLabel="Let friends find you by email"
            value={allowSearch} 
            onValueChange={setAllowSearch} 
            colors={colors}
            icon="search-outline"
          />
           <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          
           <ToggleItem 
            label="Data Usage" 
            subLabel="Share anonymous crash reports"
            value={dataUsage} 
            onValueChange={setDataUsage} 
            colors={colors}
            icon="analytics-outline"
          />

        </View>

        {/* SECTION 3: DANGER ZONE */}
        <Text style={[styles.sectionHeader, { color: '#ef4444' }]}>DANGER ZONE</Text>
        <View style={[styles.section, { backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
          
          <TouchableOpacity style={styles.itemContainer} onPress={handleDeleteAccount}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </View>
              <View>
                <Text style={[styles.label, { color: '#ef4444', fontWeight: 'bold' }]}>Delete Account</Text>
                <Text style={[styles.subLabel, { color: '#f87171' }]}>Permanently remove your data</Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </View>
  );
}

// --- Reusable Toggle Component (Same as Notifications) ---
function ToggleItem({ label, subLabel, value, onValueChange, colors, icon }: any) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
          <Ionicons name={icon} size={20} color={colors.text} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          {subLabel && <Text style={[styles.subLabel, { color: colors.textSecondary }]}>{subLabel}</Text>}
        </View>
      </View>
      
      <Switch
        trackColor={{ false: '#767577', true: colors.tint }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  iconButton: { padding: 8, borderRadius: 20 },
  content: { padding: 24, paddingBottom: 50 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
    marginLeft: 8,
    letterSpacing: 1,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 56,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: { flex: 1, marginRight: 12 },
  label: { fontSize: 16, fontWeight: '500' },
  subLabel: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginLeft: 68 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
});