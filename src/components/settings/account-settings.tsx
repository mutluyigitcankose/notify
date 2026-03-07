"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AccountSettings({
  googleEnabled,
  githubEnabled,
}: {
  googleEnabled: boolean;
  githubEnabled: boolean;
}) {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <Card className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Hesap
        </div>
        <h2 className="mt-3 text-2xl font-semibold">Gerçek kullanıcı hesabı</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Giriş yaptığınızda favorileriniz kullanıcı hesabınıza bağlanır ve cihazlar arasında taşınır.
        </p>
      </div>

      {status === "authenticated" && user ? (
        <div className="flex flex-col gap-4 rounded-3xl bg-black/5 p-4 dark:bg-white/5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Profil görseli"}
                width={56}
                height={56}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                {(user.name ?? user.email ?? "U").slice(0, 1)}
              </div>
            )}
            <div>
              <div className="text-lg font-semibold">{user.name ?? "Kullanıcı"}</div>
              <div className="text-sm text-[var(--muted-foreground)]">{user.email}</div>
            </div>
          </div>
          <Button variant="secondary" onClick={() => void signOut({ callbackUrl: "/" })}>
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış yap
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {googleEnabled ? (
              <Button onClick={() => void signIn("google", { callbackUrl: "/settings" })}>
                <LogIn className="mr-2 h-4 w-4" />
                Google ile giriş yap
              </Button>
            ) : null}
            {githubEnabled ? (
              <Button
                variant="secondary"
                onClick={() => void signIn("github", { callbackUrl: "/settings" })}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub ile giriş yap
              </Button>
            ) : null}
          </div>
          {!googleEnabled && !githubEnabled ? (
            <p className="text-sm text-[var(--muted-foreground)]">
              OAuth sağlayıcıları henüz yapılandırılmamış. `.env.local` içine sağlayıcı anahtarlarını ekleyin.
              Ayrıntılar için <Link href="/giris" className="text-[var(--accent)]">giriş sayfasına</Link> bakın.
            </p>
          ) : null}
        </div>
      )}
    </Card>
  );
}
