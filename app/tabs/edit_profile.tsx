import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, 
  ScrollView, KeyboardAvoidingView, Platform, StatusBar, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext'; 
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';
import * as ImagePicker from 'expo-image-picker'; // <--- 1. Import this

const INSTRUMENTS = [
  'Vocals', 'Piano', 'Guitar', 'Bass', 'Drums', 
  'Violin', 'Saxophone', 'Producer', 'DJ', 'Songwriter'
];

export default function EditProfile() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { profile, loading: profileLoading } = useProfile();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); // <--- 2. New loading state for image

  useEffect(() => {
    if (!profile) return;
    setName(profile.display_name ?? '');
    setUsername(profile.username ?? '');
    setBio(profile.bio ?? '');
    setSelectedInstruments(profile.instruments ?? []);
    setAvatarUrl(profile.avatar_url ?? null);
  }, [profile]);

  const toggleInstrument = (instrument: string) => {
    if (selectedInstruments.includes(instrument)) {
      setSelectedInstruments(prev => prev.filter(i => i !== instrument));
    } else {
      setSelectedInstruments(prev => [...prev, instrument]);
    }
  };

  // --- 3. New Function: Pick and Upload Image ---
  const pickImage = async () => {
    try {
      // 1. Pick Image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Images only
        allowsEditing: true, // Crop square
        aspect: [1, 1],
        quality: 0.5, // Compress to save data
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];
      setUploading(true);

      // 2. Prepare for Upload
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const arrayBuffer = await fetch(image.uri).then(res => res.arrayBuffer());
      const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 3. Upload to Supabase Storage 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 4. Get Public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 5. Update State (Show new image immediately)
      setAvatarUrl(data.publicUrl);

    } catch (error: any) {
      Alert.alert("Upload Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert("Error", "You must be logged in to save changes.");
        setSaving(false);
        return;
      }

      const updates = {
        id: user.id,
        username,
        display_name: name,
        bio,
        instruments: selectedInstruments,
        avatar_url: avatarUrl || null, // Saves the new URL we got from pickImage
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updates);

      if (error) throw error;

      Alert.alert("Success", "Profile updated successfully! ✅");
      router.back();
    } catch (err: any) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={colors.backgroundGradient} style={styles.background} />

      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: colors.iconBg }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={profileLoading || saving}>
          <Text style={[styles.saveText, { color: saving ? colors.textSecondary : colors.tint }]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, { borderColor: colors.cardBorder }]}>
              {/* Show Spinner if uploading */}
              {uploading ? (
                <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.cardBg }]}>
                  <ActivityIndicator color={colors.tint} />
                </View>
              ) : (
                <Image 
                  source={{ 
                    uri: avatarUrl 
                      ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Melodio User')}&background=a855f7&color=fff&size=200`
                  }} 
                  style={styles.avatar} 
                />
              )}

              {/* Camera Button now calls pickImage */}
              <TouchableOpacity 
                onPress={pickImage} 
                disabled={uploading}
                style={[styles.cameraButton, { borderColor: colors.background }]}
              >
                <Ionicons name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.changePhotoText, { color: colors.tint }]}>
              {uploading ? "Uploading..." : "Change Profile Photo"}
            </Text>
          </View>

          {/* ... The rest of your form (Inputs, Skills) remains exactly the same ... */}
          <View style={styles.form}>
            <InputField label="Display Name" value={name} onChange={setName} icon="person-outline" colors={colors} />
            <InputField label="Username" value={username} onChange={setUsername} icon="at-outline" colors={colors} />
            <InputField label="Bio" value={bio} onChange={setBio} icon="information-circle-outline" colors={colors} multiline />

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>My Skills (Select all that apply)</Text>
              <View style={styles.chipContainer}>
                {INSTRUMENTS.map((inst) => {
                  const isSelected = selectedInstruments.includes(inst);
                  return (
                    <TouchableOpacity
                      key={inst}
                      onPress={() => toggleInstrument(inst)}
                      style={[
                        styles.chip,
                        { 
                          backgroundColor: isSelected ? colors.tint : colors.cardBg,
                          borderColor: isSelected ? colors.tint : colors.cardBorder,
                        }
                      ]}
                    >
                      {isSelected && <Ionicons name="checkmark" size={16} color="white" style={{ marginRight: 4 }} />}
                      <Text style={[styles.chipText, { color: isSelected ? 'white' : colors.text }]}>
                        {inst}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ... Keep your InputField component and Styles exactly as they were ...
function InputField({ label, value, onChange, icon, colors, multiline = false }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[
        styles.inputContainer, 
        { 
          backgroundColor: colors.cardBg, 
          borderColor: colors.cardBorder,
          height: multiline ? 100 : 56,
          alignItems: multiline ? 'flex-start' : 'center',
          paddingVertical: multiline ? 12 : 0,
        }
      ]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={colors.textSecondary} 
          style={[styles.inputIcon, { marginTop: multiline ? 4 : 0 }]} 
        />
        <TextInput
          value={value}
          onChangeText={onChange}
          style={[styles.input, { color: colors.text, height: '100%' }]}
          placeholderTextColor={colors.textSecondary}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  saveText: { fontSize: 16, fontWeight: 'bold' },
  iconButton: { padding: 8, borderRadius: 20 },
  content: { padding: 24, paddingBottom: 50 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative', marginBottom: 16, borderWidth: 2, borderRadius: 60, padding: 4 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3b82f6', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  changePhotoText: { fontWeight: '600', fontSize: 14 },
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '500', marginLeft: 4 },
  inputContainer: { flexDirection: 'row', borderWidth: 1, borderRadius: 16, paddingHorizontal: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: '600' },
});