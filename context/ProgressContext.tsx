import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressContextType {
  xp: number;
  completedLessons: string[]; // Array of lesson IDs like ['l_01', 'th_01']
  markLessonComplete: (lessonId: string, earnedXp: number) => Promise<void>;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load data when the app starts
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedXp = await AsyncStorage.getItem('@user_xp');
        const savedLessons = await AsyncStorage.getItem('@completed_lessons');
        
        if (savedXp) setXp(parseInt(savedXp, 10));
        if (savedLessons) setCompletedLessons(JSON.parse(savedLessons));
      } catch (e) {
        console.error("Failed to load progress:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, []);

  // 2. Function to save progress
  const markLessonComplete = async (lessonId: string, earnedXp: number) => {
    // Don't add it twice if they already completed it!
    if (completedLessons.includes(lessonId)) return;

    try {
      const newXp = xp + earnedXp;
      const newLessons = [...completedLessons, lessonId];

      // Update React State (UI updates instantly)
      setXp(newXp);
      setCompletedLessons(newLessons);

      // Save to Local Storage (Survives app restart)
      await AsyncStorage.setItem('@user_xp', newXp.toString());
      await AsyncStorage.setItem('@completed_lessons', JSON.stringify(newLessons));
    } catch (e) {
      console.error("Failed to save progress:", e);
    }
  };

  return (
    <ProgressContext.Provider value={{ xp, completedLessons, markLessonComplete, isLoading }}>
      {children}
    </ProgressContext.Provider>
  );
}

// Custom hook to use this context easily
export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}