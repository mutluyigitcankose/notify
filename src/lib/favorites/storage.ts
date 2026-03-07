export type FavoriteDate = {
  month: number;
  day: number;
  label: string;
};

export const FAVORITES_STORAGE_KEY = "tarihte-bugun-favoriler";
export const FAVORITES_UPDATED_EVENT = "tarihte-bugun-favoriler-guncellendi";

export function readFavoriteDates() {
  if (typeof window === "undefined") {
    return [] as FavoriteDate[];
  }

  const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as FavoriteDate[];
  } catch {
    window.localStorage.removeItem(FAVORITES_STORAGE_KEY);
    return [];
  }
}

export function writeFavoriteDates(items: FavoriteDate[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify(items.slice(0, 12)),
  );
  window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT));
}

export function isFavoriteDate(items: FavoriteDate[], month: number, day: number) {
  return items.some((item) => item.month === month && item.day === day);
}

export function toggleFavoriteDate(
  items: FavoriteDate[],
  entry: FavoriteDate,
) {
  if (isFavoriteDate(items, entry.month, entry.day)) {
    return items.filter(
      (item) => !(item.month === entry.month && item.day === entry.day),
    );
  }

  return [entry, ...items];
}
