import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStateStorage } from '@/lib/zustand';

export type ActivityItem = {
  id: string;
  type: 'favorite' | 'tag_created';
  description: string;
  timestamp: number;
};

interface ActivityState {
  activities: ActivityItem[];
  favoritesCount: number;
  tagsCount: number;
  readCount: number;
  addActivity: (item: Omit<ActivityItem, 'timestamp' | 'id'>) => void;
  incrementFavorites: () => void;
  decrementFavorites: () => void;
  incrementTags: () => void;
  incrementRead: () => void;
}

let counter = 0;
function generateId(): string {
  return `${Date.now()}-${++counter}`;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      favoritesCount: 0,
      tagsCount: 0,
      readCount: 0,
      addActivity: (item) =>
        set((state) => ({
          activities: [{ ...item, id: generateId(), timestamp: Date.now() }, ...state.activities].slice(0, 20),
        })),
      incrementFavorites: () => set((state) => ({ favoritesCount: state.favoritesCount + 1 })),
      decrementFavorites: () => set((state) => ({ favoritesCount: Math.max(0, state.favoritesCount - 1) })),
      incrementTags: () => set((state) => ({ tagsCount: state.tagsCount + 1 })),
      incrementRead: () => set((state) => ({ readCount: state.readCount + 1 })),
    }),
    {
      name: 'activity-store',
      version: 1,
      storage: createJSONStorage(() => zustandStateStorage),
    }
  )
);
