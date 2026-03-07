import { getDb } from "@/lib/db";
import { notificationLog } from "@/lib/db/schema";

export async function insertNotificationLog(entry: {
  subscriptionId?: number | null;
  month: number;
  day: number;
  status: string;
  errorMessage?: string;
  payload?: unknown;
}) {
  const db = getDb();
  await db.insert(notificationLog).values({
    subscriptionId: entry.subscriptionId ?? null,
    month: entry.month,
    day: entry.day,
    status: entry.status,
    errorMessage: entry.errorMessage,
    payload: entry.payload,
  });
}
