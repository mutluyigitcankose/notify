import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { userSettings } from "@/lib/db/schema";

export async function getSettingsForSubscription(subscriptionId: number) {
  const db = getDb();
  return db.query.userSettings.findFirst({
    where: eq(userSettings.subscriptionId, subscriptionId),
  });
}
