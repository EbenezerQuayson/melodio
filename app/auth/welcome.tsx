import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'

export default function Welcome() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Melodio 🎵</Text>
      <Text style={{ marginVertical: 12 }}>
        Learn music. Train your ear. Master your instrument.
      </Text>

      <Pressable onPress={() => router.push('/auth/login')}>
        <Text>Login</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/auth/register')}>
        <Text>Create account</Text>
      </Pressable>
    </View>
  )
}
