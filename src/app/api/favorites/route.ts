import { NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteSyncedFavorite,
  getSyncedFavorites,
  saveSyncedFavorite,
} from "@/lib/profile/session";
import { dateParamsSchema } from "@/lib/security/validate";

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
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
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
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
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
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
