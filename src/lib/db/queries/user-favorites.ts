import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { userFavoriteDates } from "@/lib/db/schema";

export async function listUserFavoriteDates(userId: string) {
  const db = getDb();
  return db.query.userFavoriteDates.findMany({
    where: eq(userFavoriteDates.userId, userId),
    orderBy: (table, { asc }) => [asc(table.month), asc(table.day)],
  });
}

export async function upsertUserFavoriteDate(input: {
  userId: string;
  month: number;
  day: number;
  label: string;
}) {
  const db = getDb();
  const [favorite] = await db
    .insert(userFavoriteDates)
    .values(input)
    .onConflictDoUpdate({
      target: [userFavoriteDates.userId, userFavoriteDates.month, userFavoriteDates.day],
      set: {
        label: input.label,
        updatedAt: new Date(),
      },
    })
    .returning();

  return favorite;
}

export async function removeUserFavoriteDate(userId: string, month: number, day: number) {
  const db = getDb();
  await db
    .delete(userFavoriteDates)
    .where(
      and(
        eq(userFavoriteDates.userId, userId),
        eq(userFavoriteDates.month, month),
        eq(userFavoriteDates.day, day),
      ),
    );
}
