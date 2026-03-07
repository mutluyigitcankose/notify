import { AccountSettings } from "@/components/settings/account-settings";
import { NotificationSettings } from "@/components/notifications/notification-settings";
import { ProfileSyncSettings } from "@/components/settings/profile-sync-settings";

export default function SettingsPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
  const githubEnabled = Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Ayarlar
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold">Bildirim ve içerik tercihleri</h1>
      </section>

      <section>
        <AccountSettings googleEnabled={googleEnabled} githubEnabled={githubEnabled} />
      </section>

      <section>
        <NotificationSettings />
      </section>

      <section>
        <ProfileSyncSettings />
      </section>
    </div>
  );
}
