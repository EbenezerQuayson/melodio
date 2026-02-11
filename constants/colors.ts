// constants/Colors.ts

const tintColorLight = '#0054e6'; 
const tintColorDark = '#a855f7';

export const Colors = {
  light: {
    text: '#0f172a',
    // 1. ADDED THESE:
    textPrimary: '#0f172a',    // High contrast (Slate 900)
    textSecondary: '#64748b',  // Muted gray (Slate 500)

    background: '#ffffff',
    backgroundGradient: ['#e0f2fe', '#f0f9ff', '#ffffff'] as const, 
    cardBg: 'rgba(204, 204, 205, 0.3)',
    cardBorder: 'rgba(0,0,0,0.05)',
    iconBg: 'rgba(0,0,0,0.05)',
    tabBar: '#ffffff',
    tint: tintColorLight,
    tabBarActiveTintColor: tintColorLight,
    tabBarInactiveTintColor: '#64748b',
    proText: '#000000a4', 
    statsContainerBg: 'rgba(204, 204, 205, 0.3)',
    statsDivider: 'rgba(7, 6, 6, 0.1)',
    statsLabel: '#131415', 
    sectionTitle: '#131415', 
    menuItemBg: 'rgba(204, 204, 205, 0.3)',
    menuIconBoxBg: 'rgba(0, 0, 0, 0.38)',
  },
  dark: {
    text: '#ffffff',
    // 2. ADDED THESE:
    textPrimary: '#ffffff',    // High contrast (White)
    textSecondary: '#94a3b8',  // Lighter gray for dark mode (Slate 400)

    background: '#0f172a',
    backgroundGradient: ['#0f172a', '#1e1b4b', '#000000'] as const,
    cardBg: 'rgba(30, 41, 59, 0.5)',
    cardBorder: 'rgba(255,255,255,0.1)',
    iconBg: 'rgba(255,255,255,0.1)',
    tabBar: '#0f172a',
    tint: tintColorDark,
    tabBarActiveTintColor: tintColorDark,
    tabBarInactiveTintColor: '#64748b',
    proText: '#fbbf24', 
    statsContainerBg: 'rgba(30, 41, 59, 0.5)',
    statsDivider: 'rgba(255,255,255,0.1)',
    statsLabel: '#94a3b8', 
    sectionTitle: '#94a3b8', 
    menuItemBg: 'rgba(30, 41, 59, 0.3)',
    menuIconBoxBg: 'rgba(255,255,255,0.1)',
  },
};