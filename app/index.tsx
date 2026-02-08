import { Text, View } from 'react-native';
import { use, useEffect } from 'react';
import { supabase } from '@/lib/supabase';


export default function Index() {
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    console.log('Session:', data.session)
  })
}, [])

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>🎶 Melodio is alivee!</Text>
    </View>
  );
}
