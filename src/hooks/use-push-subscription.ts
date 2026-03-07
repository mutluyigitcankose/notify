"use client";

import { useEffect, useState } from "react";
import {
  registerServiceWorker,
  subscribeToPush,
} from "@/lib/push/service-worker-register";
import type { NotificationSettingsInput } from "@/types/push";

export function usePushSubscription() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function enable(settings?: NotificationSettingsInput) {
    setLoading(true);
    setMessage(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        throw new Error("Bildirim izni verilmedi.");
      }

      const registration = await registerServiceWorker();

      if (!registration) {
        throw new Error("Service worker desteklenmiyor.");
      }

      const subscription = await subscribeToPush(registration);

      if (!subscription) {
        throw new Error("Push aboneliği oluşturulamadı.");
      }

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.toJSON().keys?.p256dh,
            auth: subscription.toJSON().keys?.auth,
          },
          settings,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Abonelik kaydedilemedi.");
      }

      setMessage("Bildirimler etkinleştirildi.");
      return true;
    } catch (error) {
      setMessage((error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function disable() {
    setLoading(true);
    setMessage(null);

    try {
      const registration = await navigator.serviceWorker.getRegistration("/");
      const subscription = await registration?.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }

      setMessage("Bildirimler kapatıldı.");
      return true;
    } catch (error) {
      setMessage((error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { permission, loading, message, enable, disable };
}
