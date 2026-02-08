import { View, Text, StyleSheet } from 'react-native'

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back 🎶</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="Level" value="Beginner" />
        <StatCard label="Instrument" value="Keyboard" />
        <StatCard label="Streak" value="0 days" />
      </View>

      {/* Feature cards */}
      <FeatureCard title="Virtual Piano" color="#3b82f6" />
      <FeatureCard title="Ear Training" color="#22c55e" />
      <FeatureCard title="Music Theory" color="#a855f7" />
    </View>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  )
}

function FeatureCard({ title, color }: { title: string; color: string }) {
  return (
    <View style={[styles.featureCard, { backgroundColor: color }]}>
      <Text style={styles.featureText}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 12,
    width: '30%',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureCard: {
    padding: 24,
    borderRadius: 18,
    marginBottom: 16,
  },
  featureText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})
