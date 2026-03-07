import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";

export async function createProfile(syncCode: string) {
  const db = getDb();
  const [profile] = await db
    .insert(userProfiles)
    .values({ syncCode, lastSeenAt: new Date() })
    .returning();

  return profile;
}

export async function getProfileById(profileId: number) {
  const db = getDb();
  return db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, profileId),
  });
}

export async function getProfileBySyncCode(syncCode: string) {
  const db = getDb();
  return db.query.userProfiles.findFirst({
    where: eq(userProfiles.syncCode, syncCode),
  });
}

export async function touchProfile(profileId: number) {
  const db = getDb();
  await db
    .update(userProfiles)
    .set({ lastSeenAt: new Date(), updatedAt: new Date() })
    .where(eq(userProfiles.id, profileId));
}
