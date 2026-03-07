import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { pushSubscriptions, userSettings } from "@/lib/db/schema";
import type {
  NotificationSettingsInput,
  PushSubscriptionInput,
} from "@/types/push";

export async function upsertPushSubscription(
  payload: PushSubscriptionInput,
  userAgent?: string | null,
  settings?: NotificationSettingsInput,
) {
  const db = getDb();
  const [subscription] = await db
    .insert(pushSubscriptions)
    .values({
      endpoint: payload.endpoint,
      p256dh: payload.keys.p256dh,
      auth: payload.keys.auth,
      userAgent: userAgent ?? undefined,
      isActive: true,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        p256dh: payload.keys.p256dh,
        auth: payload.keys.auth,
        userAgent: userAgent ?? undefined,
        isActive: true,
        updatedAt: new Date(),
      },
    })
    .returning();

  await db
    .insert(userSettings)
    .values({
      subscriptionId: subscription.id,
      notifyEvents: settings?.notifyEvents ?? true,
      notifyBirths: settings?.notifyBirths ?? true,
      notifyDeaths: settings?.notifyDeaths ?? true,
      notifyHolidays: settings?.notifyHolidays ?? true,
      notifyTime: settings?.notifyTime ?? "09:00",
      timezone: settings?.timezone ?? "Europe/Istanbul",
    })
    .onConflictDoUpdate({
      target: userSettings.subscriptionId,
      set: {
        notifyEvents: settings?.notifyEvents ?? true,
        notifyBirths: settings?.notifyBirths ?? true,
        notifyDeaths: settings?.notifyDeaths ?? true,
        notifyHolidays: settings?.notifyHolidays ?? true,
        notifyTime: settings?.notifyTime ?? "09:00",
        timezone: settings?.timezone ?? "Europe/Istanbul",
        updatedAt: new Date(),
      },
    });

  return subscription;
}

export async function deactivateSubscription(endpoint: string) {
  const db = getDb();
  const [subscription] = await db
    .update(pushSubscriptions)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(pushSubscriptions.endpoint, endpoint))
    .returning();

  return subscription;
}

export async function listActiveSubscriptionsWithSettings() {
  const db = getDb();
  return db
    .select({
      id: pushSubscriptions.id,
      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      auth: pushSubscriptions.auth,
      failureCount: pushSubscriptions.failureCount,
      settings: {
        notifyEvents: userSettings.notifyEvents,
        notifyBirths: userSettings.notifyBirths,
        notifyDeaths: userSettings.notifyDeaths,
        notifyHolidays: userSettings.notifyHolidays,
        notifyTime: userSettings.notifyTime,
        timezone: userSettings.timezone,
      },
    })
    .from(pushSubscriptions)
    .innerJoin(
      userSettings,
      eq(userSettings.subscriptionId, pushSubscriptions.id),
    )
    .where(and(eq(pushSubscriptions.isActive, true)));
}

export async function markSubscriptionSuccess(subscriptionId: number) {
  const db = getDb();
  await db
    .update(pushSubscriptions)
    .set({
      failureCount: 0,
      lastSuccessAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(pushSubscriptions.id, subscriptionId));
}

export async function markSubscriptionFailure(
  subscriptionId: number,
  nextFailureCount: number,
  deactivate: boolean,
) {
  const db = getDb();
  await db
    .update(pushSubscriptions)
    .set({
      failureCount: nextFailureCount,
      isActive: deactivate ? false : true,
      updatedAt: new Date(),
    })
    .where(eq(pushSubscriptions.id, subscriptionId));
}
