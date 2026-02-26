import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

interface ProgressContextType {
  xp: number;
  completedLessons: string[];
  markLessonComplete: (lessonId: string, earnedXp: number) => Promise<void>;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const CACHE_XP = '@user_xp';
const CACHE_LESSONS = '@completed_lessons';
const CACHE_DIRTY = '@progress_dirty';

const toNumber = (v: string | null) => (v ? parseInt(v, 10) || 0 : 0);
const toLessons = (v: string | null): string[] => {
  if (!v) return [];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const xpRef = useRef(0);
  const lessonsRef = useRef<string[]>([]);

  useEffect(() => {
    xpRef.current = xp;
  }, [xp]);

  useEffect(() => {
    lessonsRef.current = completedLessons;
  }, [completedLessons]);

  const saveCache = async (nextXp: number, nextLessons: string[], dirty: '0' | '1') => {
    await AsyncStorage.multiSet([
      [CACHE_XP, String(nextXp)],
      [CACHE_LESSONS, JSON.stringify(nextLessons)],
      [CACHE_DIRTY, dirty],
    ]);
  };

  useEffect(() => {
    const loadProgress = async () => {
      try {
        // 1) Load cache first (offline/fast startup)
        const cached = await AsyncStorage.multiGet([CACHE_XP, CACHE_LESSONS, CACHE_DIRTY]);
        const cachedMap = Object.fromEntries(cached);
        const cachedXp = toNumber(cachedMap[CACHE_XP] ?? null);
        const cachedLessons = toLessons(cachedMap[CACHE_LESSONS] ?? null);
        const isDirty = cachedMap[CACHE_DIRTY] === '1';

        setXp(cachedXp);
        setCompletedLessons(cachedLessons);

        // 2) Supabase is source of truth when available
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (!userId) return;

        if (isDirty) {
          // Try to sync offline progress first
          const { error: syncError } = await supabase
            .from('profiles')
            .update({ xp: cachedXp, completed_lessons: cachedLessons })
            .eq('id', userId);

          if (!syncError) {
            await AsyncStorage.setItem(CACHE_DIRTY, '0');
          }
        }

        // Always pull latest server state afterward
        const { data, error } = await supabase
          .from('profiles')
          .select('xp, completed_lessons')
          .eq('id', userId)
          .single();

        if (!error && data) {
          const serverXp = typeof data.xp === 'number' ? data.xp : 0;
          const serverLessons = Array.isArray(data.completed_lessons) ? data.completed_lessons : [];
          setXp(serverXp);
          setCompletedLessons(serverLessons);
          await saveCache(serverXp, serverLessons, '0');
        }
      } catch (e) {
        console.error('Failed to load progress:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  const markLessonComplete = async (lessonId: string, earnedXp: number) => {
    if (lessonsRef.current.includes(lessonId)) return;

    const nextXp = xpRef.current + earnedXp;
    const nextLessons = [...lessonsRef.current, lessonId];

    // Optimistic UI + local cache
    setXp(nextXp);
    setCompletedLessons(nextLessons);
    await saveCache(nextXp, nextLessons, '1');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('profiles')
        .update({ xp: nextXp, completed_lessons: nextLessons })
        .eq('id', userId)
        .select('xp, completed_lessons')
        .single();

      if (error) {
        console.error('Failed to sync progress:', error);
        return;
      }

      // Confirm with server response (source of truth)
      const serverXp = typeof data?.xp === 'number' ? data.xp : nextXp;
      const serverLessons = Array.isArray(data?.completed_lessons)
        ? data.completed_lessons
        : nextLessons;

      setXp(serverXp);
      setCompletedLessons(serverLessons);
      await saveCache(serverXp, serverLessons, '0');
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  };

  return (
    <ProgressContext.Provider value={{ xp, completedLessons, markLessonComplete, isLoading }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within a ProgressProvider');
  return context;
}
