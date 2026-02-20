// services/curriculumService.ts

// 1. Define Types (So TypeScript helps you)
export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'practice';
  videoId?: string;    // Optional, only for videos
  scoreUrl?: string;   // Optional, only for practice
  duration?: number;   // In seconds
  xp?: number;
  completed?: boolean; // We'll handle this later
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instrument: string;
  level: string;
  modules: Module[];
}

// 2. The Mock Data (Your JSON goes here for now)
const CURRICULUM: Course[] = [
  {
      "id": "piano_101",
      "title": "Piano Foundations",
      "instrument": "Piano",
      "level": "Beginner",
      "modules": [
        {
          "title": "Module 1: The C Major Scale",
          "lessons": [
            {
              "id": "l_01",
              "title": "Introduction to the C Major Scale",
              "type": "video",
              "videoId": "oU5jRnpJqM4", 
              "duration": 300
            },
            {
              "id": "l_02",
              "title": "Playing C Major",
              "type": "practice",
              "scoreUrl":"https://raw.githubusercontent.com/opensheetmusicdisplay/opensheetmusicdisplay/master/test/data/MuzioClementi_SonatinaOpus36No1_Part1.xml",
              "xp": 50
            }
          ]
        }
      ]
    },

    // Inside CURRICULUM array in services/curriculumService.ts
{
  id: 'theory_101',
  title: 'Music Theory 101',
  instrument: 'Theory',
  level: 'Beginner',
  modules: [
    {
      title: 'Module 1: Rhythm',
      lessons: [
        { id: 'th_01', title: 'Note Values', type: 'video', videoId: '89G9UjXb48' } // Use real ID
      ]
    }
  ]
}
];

// 3. The Helper Functions
export const getCourseById = (courseId: string): Course | undefined => {
  return CURRICULUM.find(c => c.id === courseId);
};

export const getLessonById = (lessonId: string): Lesson | undefined => {
  // Search through all courses/modules to find the lesson
  for (const course of CURRICULUM) {
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
  }
  return undefined;
};

// Add this to services/curriculumService.ts

export const getCoursesByCategory = (category: string) => {
  if (category === 'Core') {
    return CURRICULUM.filter(c => c.instrument === 'Theory');
  }
  return CURRICULUM.filter(c => c.instrument === category);
};

export const getAllCourses = () => CURRICULUM;