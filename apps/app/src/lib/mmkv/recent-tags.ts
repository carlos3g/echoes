import { storage } from '@/lib/react-native-mmkv';

const RECENT_TAGS_KEY = 'recent-tags';
const MAX_RECENT_TAGS = 5;

interface RecentTagEntry {
  uuid: string;
  timestamp: number;
}

export const getRecentTagUuids = (): string[] => {
  const raw = storage.getString(RECENT_TAGS_KEY);
  if (!raw) return [];

  const entries = JSON.parse(raw) as RecentTagEntry[];
  return entries
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_RECENT_TAGS)
    .map((e) => e.uuid);
};

export const addRecentTag = (uuid: string): void => {
  const raw = storage.getString(RECENT_TAGS_KEY);
  const entries: RecentTagEntry[] = raw ? (JSON.parse(raw) as RecentTagEntry[]) : [];

  const filtered = entries.filter((e) => e.uuid !== uuid);
  filtered.unshift({ uuid, timestamp: Date.now() });

  storage.set(RECENT_TAGS_KEY, JSON.stringify(filtered.slice(0, MAX_RECENT_TAGS)));
};
