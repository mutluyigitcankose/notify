"use client";

import { useState } from "react";
import { usePushSubscription } from "@/hooks/use-push-subscription";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { NotificationSettingsInput } from "@/types/push";

const defaultSettings: NotificationSettingsInput = {
  notifyEvents: true,
  notifyBirths: true,
  notifyDeaths: true,
  notifyHolidays: true,
  notifyTime: "09:00",
  timezone: "Europe/Istanbul",
};

export function NotificationSettings() {
  const { permission, loading, message, enable, disable } = usePushSubscription();
  const [settings, setSettings] = useState(defaultSettings);

  function toggle(key: keyof Omit<NotificationSettingsInput, "notifyTime" | "timezone">) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Bildirim tercihleri</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Tarayıcı izni verildiğinde seçimleriniz abonelikle birlikte saklanır.
        </p>
      </div>

      <div className="space-y-4">
        <PreferenceRow
          label="Olaylar"
          checked={settings.notifyEvents}
          onChange={() => toggle("notifyEvents")}
        />
        <PreferenceRow
          label="Doğumlar"
          checked={settings.notifyBirths}
          onChange={() => toggle("notifyBirths")}
        />
        <PreferenceRow
          label="Ölümler"
          checked={settings.notifyDeaths}
          onChange={() => toggle("notifyDeaths")}
        />
        <PreferenceRow
          label="Tatiller"
          checked={settings.notifyHolidays}
          onChange={() => toggle("notifyHolidays")}
        />
      </div>

      <label className="grid gap-2 text-sm font-medium">
        Bildirim saati
        <input
          type="time"
          value={settings.notifyTime}
          onChange={(event) =>
            setSettings((prev) => ({ ...prev, notifyTime: event.target.value }))
          }
          className="h-12 rounded-2xl border border-black/10 bg-transparent px-4 dark:border-white/10"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <Button disabled={loading} onClick={() => void enable(settings)}>
          {permission === "granted" ? "Ayarları güncelle" : "Bildirimleri etkinleştir"}
        </Button>
        <Button variant="secondary" disabled={loading} onClick={() => void disable()}>
          Bildirimleri kapat
        </Button>
      </div>

      <p className="text-sm text-[var(--muted-foreground)]">
        İzin durumu: <strong>{permission}</strong>
        {message ? ` • ${message}` : ""}
      </p>
    </Card>
  );
}

function PreferenceRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/10 p-4 dark:border-white/10">
      <span className="font-medium">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
