import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { favoriteDates } from "@/lib/db/schema";

export async function listFavoriteDates(profileId: number) {
  const db = getDb();
  return db.query.favoriteDates.findMany({
    where: eq(favoriteDates.profileId, profileId),
    orderBy: (table, { asc }) => [asc(table.month), asc(table.day)],
  });
}

export async function upsertFavoriteDate(input: {
  profileId: number;
  month: number;
  day: number;
  label: string;
}) {
  const db = getDb();
  const [favorite] = await db
    .insert(favoriteDates)
    .values(input)
    .onConflictDoUpdate({
      target: [favoriteDates.profileId, favoriteDates.month, favoriteDates.day],
      set: {
        label: input.label,
        updatedAt: new Date(),
      },
    })
    .returning();

  return favorite;
}

export async function removeFavoriteDate(profileId: number, month: number, day: number) {
  const db = getDb();
  await db
    .delete(favoriteDates)
    .where(
      and(
        eq(favoriteDates.profileId, profileId),
        eq(favoriteDates.month, month),
        eq(favoriteDates.day, day),
      ),
    );
}
