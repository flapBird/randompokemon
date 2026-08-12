import type { FavoriteTeam, SavedGeneration } from "@/types/generator";

const VERSION = 1;
const RECENT_KEY = "rpg-recent-v1";
const FAVORITES_KEY = "rpg-favorites-v1";

type Stored<T> = { version: number; items: T[] };

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "null") as Stored<T> | null;
    return parsed?.version === VERSION && Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify({ version: VERSION, items }));
    return true;
  } catch {
    return false;
  }
}

export const storage = {
  recent: () => read<SavedGeneration>(RECENT_KEY),
  favorites: () => read<FavoriteTeam>(FAVORITES_KEY),
  saveRecent(item: SavedGeneration) {
    const next = [item, ...read<SavedGeneration>(RECENT_KEY).filter((entry) => entry.id !== item.id)].slice(0, 10);
    return write(RECENT_KEY, next) ? next : null;
  },
  saveFavorite(item: FavoriteTeam) {
    const next = [item, ...read<FavoriteTeam>(FAVORITES_KEY).filter((entry) => entry.id !== item.id)].slice(0, 20);
    return write(FAVORITES_KEY, next) ? next : null;
  },
  removeRecent(id: string) {
    const next = read<SavedGeneration>(RECENT_KEY).filter((entry) => entry.id !== id);
    write(RECENT_KEY, next);
    return next;
  },
  removeFavorite(id: string) {
    const next = read<FavoriteTeam>(FAVORITES_KEY).filter((entry) => entry.id !== id);
    write(FAVORITES_KEY, next);
    return next;
  },
  clearRecent(pageMode?: SavedGeneration["pageMode"]) {
    const next = pageMode ? read<SavedGeneration>(RECENT_KEY).filter((entry) => {
      const storedMode = entry.pageMode ?? "standard";
      return pageMode === "standard" ? storedMode !== "standard" && storedMode !== "team" : storedMode !== pageMode;
    }) : [];
    write<SavedGeneration>(RECENT_KEY, next);
  },
};
