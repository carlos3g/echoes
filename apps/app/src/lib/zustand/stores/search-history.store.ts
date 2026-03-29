import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStateStorage } from '@/lib/zustand';

interface SearchHistoryState {
  history: string[];
  addSearch: (term: string) => void;
  removeSearch: (term: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      addSearch: (term) =>
        set((state) => ({
          history: [term, ...state.history.filter((t) => t !== term)].slice(0, 10),
        })),
      removeSearch: (term) =>
        set((state) => ({
          history: state.history.filter((t) => t !== term),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'search-history',
      version: 1,
      storage: createJSONStorage(() => zustandStateStorage),
    }
  )
);
