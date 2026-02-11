import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext'; 

export default function HelpSupport() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const handleEmailSupport = () => {
    Linking.openURL('mailto:ebenezerquayson379@gmail.com?subject=Help Request');
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
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[styles.iconButton, { backgroundColor: colors.iconBg }]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Support Channels */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>GET IN TOUCH</Text>
        <View style={[styles.section, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          
          <TouchableOpacity style={styles.itemContainer} onPress={handleEmailSupport}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
                <Ionicons name="mail-outline" size={20} color={colors.text} />
              </View>
              <View>
                <Text style={[styles.label, { color: colors.text }]}>Email Support</Text>
                <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Response within 24 hours</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

          <TouchableOpacity style={styles.itemContainer}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
                <Ionicons name="chatbubbles-outline" size={20} color={colors.text} />
              </View>
              <Text style={[styles.label, { color: colors.text }]}>Community Forum</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>FREQUENTLY ASKED QUESTIONS</Text>
        <View style={styles.faqList}>
          <FAQItem 
            question="How do I track my practice?" 
            answer="Your practice is automatically tracked when you use the 'Practice & Learn' features on the dashboard." 
            colors={colors} 
          />
          <FAQItem 
            question="How do streaks work?" 
            answer="Complete at least one lesson or ear training exercise every day to keep your streak alive!" 
            colors={colors} 
          />
          <FAQItem 
            question="Can I change my main instrument?" 
            answer="Yes! Go to Edit Profile and select the instruments you currently play or are learning." 
            colors={colors} 
          />
        </View>

        <TouchableOpacity style={styles.feedbackBtn}>
            <Text style={[styles.feedbackText, { color: colors.tint }]}>Have feedback? Let us know!</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

function FAQItem({ question, answer, colors }: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity 
      onPress={() => setExpanded(!expanded)}
      style={[styles.faqItem, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.text }]}>{question}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={18} 
          color={colors.textSecondary} 
        />
      </View>
      {expanded && (
        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{answer}</Text>
      )}
    </TouchableOpacity>
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
  sectionHeader: { fontSize: 12, fontWeight: 'bold', marginBottom: 12, marginTop: 12, marginLeft: 8, letterSpacing: 1 },
  section: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  label: { fontSize: 16, fontWeight: '500' },
  subLabel: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginLeft: 68 },
  faqList: { gap: 12 },
  faqItem: { borderRadius: 16, borderWidth: 1, padding: 16 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  faqAnswer: { marginTop: 12, fontSize: 14, lineHeight: 20 },
  feedbackBtn: { marginTop: 32, alignItems: 'center' },
  feedbackText: { fontWeight: '600', fontSize: 14 },
});