import { isDatabaseConfigured } from "@/lib/db";
import { insertNotificationLog } from "@/lib/db/queries/notifications";
import {
  deactivateSubscription,
  listActiveSubscriptionsWithSettings,
  markSubscriptionFailure,
  markSubscriptionSuccess,
  upsertPushSubscription,
} from "@/lib/db/queries/subscriptions";
import type { NotificationSettingsInput, PushSubscriptionInput } from "@/types/push";

export async function saveSubscription(
  payload: PushSubscriptionInput,
  userAgent?: string | null,
  settings?: NotificationSettingsInput,
) {
  if (!isDatabaseConfigured()) {
    throw new Error("Push aboneliği için DATABASE_URL gerekli.");
  }

  return upsertPushSubscription(payload, userAgent, settings);
}

export async function unsubscribe(endpoint: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Push aboneliği için DATABASE_URL gerekli.");
  }

  return deactivateSubscription(endpoint);
}

export async function getActiveSubscriptions() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  return listActiveSubscriptionsWithSettings();
}

export async function logNotificationResult(entry: {
  subscriptionId?: number | null;
  month: number;
  day: number;
  status: string;
  errorMessage?: string;
  payload?: unknown;
}) {
  if (!isDatabaseConfigured()) {
    return;
  }

  await insertNotificationLog(entry);
}

export async function handleNotificationSuccess(subscriptionId: number) {
  if (!isDatabaseConfigured()) {
    return;
  }

  await markSubscriptionSuccess(subscriptionId);
}

export async function handleNotificationFailure(
  subscriptionId: number,
  nextFailureCount: number,
  deactivate: boolean,
) {
  if (!isDatabaseConfigured()) {
    return;
  }

  await markSubscriptionFailure(subscriptionId, nextFailureCount, deactivate);
}
