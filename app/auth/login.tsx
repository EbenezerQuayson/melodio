import { View, TextInput, Pressable, Text } from 'react-native'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signIn() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (error) alert(error.message)
  }

  return (
    <View style={{ padding: 24 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />

      <Pressable onPress={signIn}>
        <Text>{loading ? 'Loading...' : 'Login'}</Text>
      </Pressable>
    </View>
  )
}
