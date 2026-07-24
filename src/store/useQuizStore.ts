import { create } from 'zustand';
import type { QuizQuestion } from '../services/api';

export type ScreenState = 'home' | 'modes' | 'quiz' | 'result';
export type QuizMode = 'classic' | 'hangman' | 'survival' | 'true-false' | null;

interface QuizState {
  userName: string;
  setUserName: (name: string) => void;
  
  currentScreen: ScreenState;
  setCurrentScreen: (screen: ScreenState) => void;
  
  activeMode: QuizMode;
  setActiveMode: (mode: QuizMode) => void;

  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  questionBank: Record<string, QuizQuestion[]>;
  addQuestionsToBank: (category: string, questions: QuizQuestion[]) => void;
  removeQuestionsFromBank: (category: string, count: number) => void;

  score: number;
  addScore: (points: number) => void;
  resetGame: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  userName: '',
  setUserName: (userName) => set({ userName }),
  
  currentScreen: 'home',
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  
  activeMode: null,
  setActiveMode: (mode) => set({ activeMode: mode }),

  selectedCategory: 'Random',
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  questionBank: {},
  addQuestionsToBank: (category, questions) => set((state) => ({
    questionBank: {
      ...state.questionBank,
      [category]: [...(state.questionBank[category] || []), ...questions]
    }
  })),
  removeQuestionsFromBank: (category, count) => set((state) => {
    const currentBank = state.questionBank[category] || [];
    return {
      questionBank: {
        ...state.questionBank,
        [category]: currentBank.slice(count)
      }
    };
  }),

  score: 0,
  addScore: (points) => set((state) => ({ score: state.score + points })),
  resetGame: () => set({ score: 0, currentScreen: 'modes', activeMode: null }),
}));
