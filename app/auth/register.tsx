import { View, TextInput, Pressable, Text } from 'react-native'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signUp() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    setLoading(false)
    if (error) alert(error.message)
    else alert('Check your email to confirm!')
  }

  return (
    <View style={{ padding: 24 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />

      <Pressable onPress={signUp}>
        <Text>{loading ? 'Loading...' : 'Create account'}</Text>
      </Pressable>
    </View>
  )
}
