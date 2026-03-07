import { AccountSettings } from "@/components/settings/account-settings";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
  const githubEnabled = Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <Card className="space-y-4">
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Giriş
        </div>
        <h1 className="font-serif text-4xl font-semibold">Hesabınıza bağlanın</h1>
        <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
          Google veya GitHub hesabıyla giriş yaptığınızda favorileriniz kullanıcı hesabınıza taşınır
          ve cihazlar arasında otomatik senkronize edilir.
        </p>
      </Card>
      <AccountSettings googleEnabled={googleEnabled} githubEnabled={githubEnabled} />
      <Card className="space-y-3">
        <div className="text-lg font-semibold">Gerekli ortam değişkenleri</div>
        <pre className="overflow-x-auto rounded-2xl bg-black/5 p-4 text-sm dark:bg-white/5">
{`AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=`}
        </pre>
      </Card>
    </section>
  );
}
