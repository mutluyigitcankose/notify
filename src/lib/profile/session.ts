import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { listFavoriteDates, removeFavoriteDate, upsertFavoriteDate } from "@/lib/db/queries/favorites";
import { createProfile, getProfileById, getProfileBySyncCode, touchProfile } from "@/lib/db/queries/profiles";
import {
  listUserFavoriteDates,
  removeUserFavoriteDate,
  upsertUserFavoriteDate,
} from "@/lib/db/queries/user-favorites";

export const PROFILE_COOKIE_NAME = "codexnotify-profile";

function generateSyncCode() {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}

async function setProfileCookie(profileId: number) {
  const store = await cookies();
  store.set(PROFILE_COOKIE_NAME, String(profileId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function getExistingProfileSession() {
  const store = await cookies();
  const currentProfileId = Number(store.get(PROFILE_COOKIE_NAME)?.value);

  if (!currentProfileId) {
    return null;
  }

  return getProfileById(currentProfileId);
}

export async function ensureProfileSession() {
  if (!isDatabaseConfigured()) {
    throw new Error("Profil senkronizasyonu için DATABASE_URL gerekli.");
  }

  const store = await cookies();
  const currentProfileId = Number(store.get(PROFILE_COOKIE_NAME)?.value);

  if (currentProfileId) {
    const existing = await getProfileById(currentProfileId);

    if (existing) {
      await touchProfile(existing.id);
      return existing;
    }
  }

  const profile = await createProfile(generateSyncCode());
  await setProfileCookie(profile.id);
  return profile;
}

export async function restoreProfileSession(syncCode: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Profil senkronizasyonu için DATABASE_URL gerekli.");
  }

  const profile = await getProfileBySyncCode(syncCode.trim().toUpperCase());

  if (!profile) {
    throw new Error("Bu senkron kodu bulunamadı.");
  }

  await setProfileCookie(profile.id);
  await touchProfile(profile.id);
  return profile;
}

export async function getProfileSession() {
  return ensureProfileSession();
}

export async function getSyncedFavorites() {
  const session = await getAuthSession();

  if (session?.user?.id) {
    try {
      await migrateProfileFavoritesToUser(session.user.id);
      const favorites = await listUserFavoriteDates(session.user.id);
      return {
        accountType: "user" as const,
        user: session.user,
        favorites,
      };
    } catch {
      // Giriş yapmış kullanıcı için DB hatasında boş liste; sayfa açılsın
      return {
        accountType: "user" as const,
        user: session.user,
        favorites: [],
      };
    }
  }

  const profile = await ensureProfileSession();
  const favorites = await listFavoriteDates(profile.id);
  return {
    accountType: "profile" as const,
    profile,
    favorites,
  };
}

export async function saveSyncedFavorite(input: {
  month: number;
  day: number;
  label: string;
}) {
  const session = await getAuthSession();

  if (session?.user?.id) {
    return upsertUserFavoriteDate({
      userId: session.user.id,
      month: input.month,
      day: input.day,
      label: input.label,
    });
  }

  const profile = await ensureProfileSession();
  const favorite = await upsertFavoriteDate({
    profileId: profile.id,
    month: input.month,
    day: input.day,
    label: input.label,
  });
  await touchProfile(profile.id);
  return favorite;
}

export async function deleteSyncedFavorite(month: number, day: number) {
  const session = await getAuthSession();

  if (session?.user?.id) {
    await removeUserFavoriteDate(session.user.id, month, day);
    return;
  }

  const profile = await ensureProfileSession();
  await removeFavoriteDate(profile.id, month, day);
  await touchProfile(profile.id);
}

export async function migrateProfileFavoritesToUser(userId: string) {
  const profile = await getExistingProfileSession();

  if (!profile) {
    return;
  }

  const profileFavorites = await listFavoriteDates(profile.id);

  for (const favorite of profileFavorites) {
    await upsertUserFavoriteDate({
      userId,
      month: favorite.month,
      day: favorite.day,
      label: favorite.label,
    });
    await removeFavoriteDate(profile.id, favorite.month, favorite.day);
  }
}
