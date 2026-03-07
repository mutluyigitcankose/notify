import { NotificationSettings } from "@/components/notifications/notification-settings";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Ayarlar
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold">Bildirim ve içerik tercihleri</h1>
      </div>
      <NotificationSettings />
    </section>
  );
}
