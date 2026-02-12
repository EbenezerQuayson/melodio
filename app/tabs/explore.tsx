import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native'; // Standard import

const INSTRUMENT_FILTERS = ['Vocals', 'Piano', 'Guitar', 'Bass', 'Drums', 'Producer'];

export default function Explore() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Search Logic
  const searchMusicians = async (query: string, instrument: string | null) => {
    setLoading(true);
    try {
      let request = supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, instruments, level');

      // 1. Filter by Username (if typing)
      if (query.trim().length > 0) {
        request = request.ilike('username', `%${query}%`);
      }

      // 2. Filter by Instrument (if selected)
      if (instrument) {
        request = request.contains('instruments', [instrument]);
      }

      // 3. If nothing is typed/selected, show recent users
      if (!query && !instrument) {
        request = request.limit(10).order('updated_at', { ascending: false });
      } else {
        request = request.limit(20);
      }

      const { data, error } = await request;

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when query or filter changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchMusicians(searchQuery, activeFilter);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeFilter]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={colors.backgroundGradient} style={styles.background} />

      {/* 1. SEARCH HEADER (No Back Button) */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Search musicians..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            // autoFocus removed to prevent keyboard jump on tab switch
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. INSTRUMENT FILTERS */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            onPress={() => setActiveFilter(null)}
            style={[styles.chip, !activeFilter && { backgroundColor: colors.tint, borderColor: colors.tint }]}
          >
            <Text style={[styles.chipText, { color: !activeFilter ? '#fff' : colors.text }]}>All</Text>
          </TouchableOpacity>
          
          {INSTRUMENT_FILTERS.map((item) => (
            <TouchableOpacity 
              key={item}
              onPress={() => setActiveFilter(item === activeFilter ? null : item)}
              style={[
                styles.chip, 
                activeFilter === item 
                  ? { backgroundColor: colors.tint, borderColor: colors.tint } 
                  : { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }
              ]}
            >
              <Text style={[
                styles.chipText, 
                { color: activeFilter === item ? '#fff' : colors.text }
              ]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. RESULTS LIST */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.tint} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled" // Allows tapping results while keyboard is open
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery ? "No musicians found." : "Try searching for a skill!"}
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.userCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
              // FUTURE: Link to Public Profile
              // onPress={() => router.push({ pathname: '/public-profile', params: { userId: item.id } })}
            >
              <Image 
                source={{ 
                  uri: item.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.display_name ?? 'User')}&background=a855f7&color=fff`
                }} 
                style={styles.avatar} 
              />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>{item.display_name || 'Unknown Artist'}</Text>
                <Text style={[styles.userHandle, { color: colors.textSecondary }]}>@{item.username || 'user'}</Text>
                
                <View style={styles.tagContainer}>
                  {/* SAFE CHECK: Ensure instruments exists before mapping */}
                  {(item.instruments || []).slice(0, 3).map((inst: string) => (
                    <View key={inst} style={[styles.tag, { backgroundColor: colors.iconBg }]}>
                      <Text style={[styles.tagText, { color: colors.text }]}>{inst}</Text>
                    </View>
                  ))}
                  {/* Show +1 if they have more instruments */}
                  {(item.instruments || []).length > 3 && (
                     <Text style={[styles.moreText, { color: colors.textSecondary }]}>+{item.instruments.length - 3}</Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: { flex: 1, fontSize: 16, height: '100%' },
  filterWrapper: { paddingVertical: 12 },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 14, fontWeight: '600' },
  listContent: { padding: 16, gap: 12, paddingBottom: 100 }, // Extra padding for bottom tab
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  userHandle: { fontSize: 13, marginBottom: 4 },
  tagContainer: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: '600' },
  moreText: { fontSize: 10 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 }
});