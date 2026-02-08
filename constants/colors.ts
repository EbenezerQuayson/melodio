// constants/Colors.ts

const tintColorLight = '#0054e6'; 
const tintColorDark = '#a855f7';

export const Colors = {
  light: {
    text: '#0f172a',
    background: '#ffffff',
    backgroundGradient: ['#e0f2fe', '#f0f9ff', '#ffffff'] as const, // Cast as const for LinearGradient
    cardBg: 'rgba(255, 255, 255, 0.8)',
    cardBorder: 'rgba(0,0,0,0.05)',
    iconBg: 'rgba(0,0,0,0.05)',
    tabBar: '#ffffff',
    tint: tintColorLight,
    tabBarActiveTintColor: tintColorLight,
    tabBarInactiveTintColor: '#64748b',// Slate Gray (muted)
  },
  dark: {
    text: '#ffffff',
    background: '#0f172a',
    backgroundGradient: ['#0f172a', '#1e1b4b', '#000000'] as const,
    cardBg: 'rgba(30, 41, 59, 0.5)',
    cardBorder: 'rgba(255,255,255,0.1)',
    iconBg: 'rgba(255,255,255,0.1)',
    tabBar: '#0f172a',
    tint: tintColorDark,
    tabBarActiveTintColor: tintColorDark,
    tabBarInactiveTintColor: '#64748b',// Slate Gray (muted)
  },
};