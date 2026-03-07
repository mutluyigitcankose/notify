"use client";

import { useEffect, useState } from "react";
import {
  FAVORITES_UPDATED_EVENT,
  isFavoriteDate,
  readFavoriteDates,
  toggleFavoriteDate,
  writeFavoriteDates,
  type FavoriteDate,
} from "@/lib/favorites/storage";

export function useFavoriteDates() {
  const [items, setItems] = useState<FavoriteDate[]>(() => readFavoriteDates());
  const [loading, setLoading] = useState(true);
  const [syncCode, setSyncCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function syncFavorites() {
      setItems(readFavoriteDates());
    }

    window.addEventListener(FAVORITES_UPDATED_EVENT, syncFavorites);
    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRemoteFavorites() {
      try {
        const localFavorites = readFavoriteDates();
        const response = await fetch("/api/favorites");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "Favoriler alınamadı.");
        }

        const mergedFavorites = [
          ...payload.favorites,
          ...localFavorites.filter(
            (localFavorite: FavoriteDate) =>
              !payload.favorites.some(
                (remoteFavorite: FavoriteDate) =>
                  remoteFavorite.month === localFavorite.month &&
                  remoteFavorite.day === localFavorite.day,
              ),
          ),
        ];

        if (localFavorites.length > 0 && mergedFavorites.length > payload.favorites.length) {
          await Promise.all(
            localFavorites.map((favorite: FavoriteDate) =>
              fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(favorite),
              }),
            ),
          );
        }

        if (!cancelled) {
          setItems(mergedFavorites);
          writeFavoriteDates(mergedFavorites);
          setSyncCode(payload.profile.syncCode);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRemoteFavorites();

    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle(entry: FavoriteDate) {
    const nextItems = toggleFavoriteDate(items, entry);
    setItems(nextItems);
    writeFavoriteDates(nextItems);
    setError(null);

    try {
      const response = await fetch("/api/favorites", {
        method: isFavoriteDate(items, entry.month, entry.day) ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Favori senkronize edilemedi.");
      }
    } catch (err) {
      setError((err as Error).message);
      setItems(items);
      writeFavoriteDates(items);
    }
  }

  async function restore(syncCodeInput: string) {
    setError(null);

    const response = await fetch("/api/profile/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ syncCode: syncCodeInput }),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error ?? "Profil geri yüklenemedi.");
    }

    setSyncCode(payload.profile.syncCode);

    const favoritesResponse = await fetch("/api/favorites");
    const favoritesPayload = await favoritesResponse.json();

    if (!favoritesResponse.ok) {
      throw new Error(favoritesPayload.error ?? "Favoriler alınamadı.");
    }

    setItems(favoritesPayload.favorites);
    writeFavoriteDates(favoritesPayload.favorites);
  }

  return {
    items,
    loading,
    error,
    syncCode,
    isFavorite: (month: number, day: number) => isFavoriteDate(items, month, day),
    toggle,
    restore,
  };
}
