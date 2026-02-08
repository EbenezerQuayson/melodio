import { View, Text, Pressable } from 'react-native'
import { supabase } from '@/lib/supabase'

export default function Profile() {
  return (
    <View>
      <Text>Profile</Text>
      <Pressable onPress={() => supabase.auth.signOut()}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  )
}
