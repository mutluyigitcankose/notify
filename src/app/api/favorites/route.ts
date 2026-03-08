import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, sanitizeErrorMessage } from "@/lib/api/response";
import {
  deleteSyncedFavorite,
  getSyncedFavorites,
  saveSyncedFavorite,
} from "@/lib/profile/session";
import { dateParamsSchema } from "@/lib/security/validate";

const FAVORITES_ERROR = "Favoriler yüklenemedi. Lütfen sayfayı yenileyin.";

const favoriteSchema = dateParamsSchema.extend({
  label: z.string().trim().min(1).max(120),
});

export async function GET() {
  try {
    const result = await getSyncedFavorites();
    return NextResponse.json({
      accountType: result.accountType,
      profile:
        result.accountType === "profile"
          ? {
              id: result.profile.id,
              syncCode: result.profile.syncCode,
            }
          : null,
      user:
        result.accountType === "user"
          ? {
              id: result.user.id,
              name: result.user.name,
              email: result.user.email,
              image: result.user.image,
            }
          : null,
      favorites: result.favorites.map((favorite) => ({
        month: favorite.month,
        day: favorite.day,
        label: favorite.label,
      })),
    });
  } catch (error) {
    const message = sanitizeErrorMessage(error, FAVORITES_ERROR);
    return apiError(message, 500, "INTERNAL_ERROR");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = favoriteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz favori verisi.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const favorite = await saveSyncedFavorite(parsed.data);
    return NextResponse.json({
      favorite: {
        month: favorite.month,
        day: favorite.day,
        label: favorite.label,
      },
    });
  } catch (error) {
    const message = sanitizeErrorMessage(error, "Favori kaydedilemedi.");
    return apiError(message, 500, "INTERNAL_ERROR");
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const parsed = dateParamsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz tarih." }, { status: 400 });
    }

    await deleteSyncedFavorite(parsed.data.month, parsed.data.day);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = sanitizeErrorMessage(error, "Favori silinemedi.");
    return apiError(message, 500, "INTERNAL_ERROR");
  }
}
