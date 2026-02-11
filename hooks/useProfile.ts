import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Session['user'] | null>(null);

  // 1. Define the fetch logic as a reusable function
  const fetchProfile = useCallback(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setLoading(false);
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Initial Fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 3. Return 'refetch' so components can force a reload
  return { 
    profile, 
    loading, 
    user, 
    refetch: fetchProfile  // <--- The secret sauce
  };
}