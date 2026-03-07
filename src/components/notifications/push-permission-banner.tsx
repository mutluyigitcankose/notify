"use client";

import { Bell } from "lucide-react";
import { usePushSubscription } from "@/hooks/use-push-subscription";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PushPermissionBanner() {
  const { permission, loading, message, enable } = usePushSubscription();

  if (permission === "granted") {
    return null;
  }

  return (
    <Card className="flex flex-col gap-4 bg-[var(--accent)] text-white md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <Bell className="mt-1 h-5 w-5" />
        <div>
          <div className="text-lg font-semibold">Saat 09:00 için bildirim açın</div>
          <p className="text-sm text-white/80">
            Her sabah günün tarih içeriklerini tarayıcı bildirimi olarak alın.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          disabled={loading}
          onClick={() =>
            void enable({
              notifyEvents: true,
              notifyBirths: true,
              notifyDeaths: true,
              notifyHolidays: true,
              notifyTime: "09:00",
              timezone: "Europe/Istanbul",
            })
          }
        >
          Bildirimleri etkinleştir
        </Button>
        {message ? <span className="text-xs text-white/80">{message}</span> : null}
      </div>
    </Card>
  );
}
