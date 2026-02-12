import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext'; 

export default function Notifications() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // State for toggles
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [friendActivity, setFriendActivity] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [emailDigest, setEmailDigest] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* 1. Dynamic Background */}
      <LinearGradient
        colors={colors.backgroundGradient}
        style={styles.background}
      />

      {/* 2. Header */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: colors.iconBg }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <View style={{ width: 40 }} /> {/* Spacer to balance header */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Section 1: Practice & Goals */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>PRACTICE & GOALS</Text>
        <View style={[styles.section, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          
          <ToggleItem 
            label="Daily Reminders" 
            subLabel="Get reminded at 6:00 PM"
            value={practiceReminders} 
            onValueChange={setPracticeReminders} 
            colors={colors}
            icon="alarm-outline"
          />
          
          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          
          <ToggleItem 
            label="Streak Alerts" 
            subLabel="Don't lose your progress!"
            value={streakAlerts} 
            onValueChange={setStreakAlerts} 
            colors={colors}
            icon="flame-outline"
            iconColor="#f97316" // Orange for streak
          />

        </View>

        {/* Section 2: Social */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>SOCIAL</Text>
        <View style={[styles.section, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          
          <ToggleItem 
            label="Friend Activity" 
            value={friendActivity} 
            onValueChange={setFriendActivity} 
            colors={colors}
            icon="people-outline"
          />
          
          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          
          <ToggleItem 
            label="New Followers" 
            value={newFollowers} 
            onValueChange={setNewFollowers} 
            colors={colors}
            icon="person-add-outline"
          />

        </View>

        {/* Section 3: App Updates */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>UPDATES</Text>
        <View style={[styles.section, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          
          <ToggleItem 
            label="Product News" 
            value={productUpdates} 
            onValueChange={setProductUpdates} 
            colors={colors}
            icon="newspaper-outline"
          />
          
          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          
          <ToggleItem 
            label="Email Digest" 
            subLabel="Weekly summary of your progress"
            value={emailDigest} 
            onValueChange={setEmailDigest} 
            colors={colors}
            icon="mail-outline"
          />

        </View>

      </ScrollView>
    </View>
  );
}

// --- Reusable Toggle Component ---
function ToggleItem({ label, subLabel, value, onValueChange, colors, icon, iconColor }: any) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
          <Ionicons name={icon} size={20} color={iconColor || colors.text} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: 24,
    paddingBottom: 50,
  },
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
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  subLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 68, // Aligns with text, skipping icon
  },
});