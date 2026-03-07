import { and, eq, gt } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { eventsCache } from "@/lib/db/schema";

export async function getFreshEventCache(month: number, day: number) {
  const db = getDb();
  return db.query.eventsCache.findMany({
    where: and(
      eq(eventsCache.month, month),
      eq(eventsCache.day, day),
      gt(eventsCache.staleAt, new Date()),
    ),
  });
}

export async function upsertEventCache(
  month: number,
  day: number,
  entries: Array<{ category: string; data: unknown }>,
) {
  const db = getDb();
  const staleAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.transaction(async (tx) => {
    for (const entry of entries) {
      await tx
        .insert(eventsCache)
        .values({
          month,
          day,
          category: entry.category,
          data: entry.data,
          fetchedAt: new Date(),
          staleAt,
        })
        .onConflictDoUpdate({
          target: [eventsCache.month, eventsCache.day, eventsCache.category],
          set: {
            data: entry.data,
            fetchedAt: new Date(),
            staleAt,
          },
        });
    }
  });
}
