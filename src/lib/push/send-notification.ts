import webPush from "web-push";
import { configureWebPush } from "@/lib/push/web-push";

export interface NotificationPayload {
  title: string;
  body: string;
  url: string;
  tag: string;
}

export async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: NotificationPayload,
) {
  configureWebPush();

  try {
    const result = await webPush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload),
      {
        TTL: 86_400,
        urgency: "normal",
        topic: "daily-history",
      },
    );

    return { success: true, statusCode: result.statusCode };
  } catch (error) {
    const err = error as { statusCode?: number; message?: string };
    return {
      success: false,
      statusCode: err.statusCode,
      error: err.message ?? "Bilinmeyen web-push hatası",
    };
  }
}
