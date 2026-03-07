"use client";

import { useState } from "react";
import { Copy, RefreshCcw, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useFavoriteDates } from "@/hooks/use-favorite-dates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ProfileSyncSettings() {
  const { status } = useSession();
  const { syncCode, restore, error, loading } = useFavoriteDates();
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  if (status === "authenticated") {
    return (
      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          <ShieldCheck className="h-4 w-4" />
          Misafir Senkronu
        </div>
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">
          Artık gerçek kullanıcı hesabı kullanıyorsunuz. Favorileriniz hesabınıza bağlı olduğu için
          ek senkron kodu gerekmiyor.
        </p>
      </Card>
    );
  }

  async function copyCode() {
    if (!syncCode) {
      return;
    }

    await navigator.clipboard.writeText(syncCode);
    setMessage("Senkron kodu panoya kopyalandı.");
  }

  async function connectProfile() {
    try {
      await restore(input);
      setMessage("Bu tarayıcı profilinize bağlandı.");
    } catch (err) {
      setMessage((err as Error).message);
    }
  }

  return (
    <Card className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          <ShieldCheck className="h-4 w-4" />
          Favori Senkronu
        </div>
        <h2 className="mt-3 text-2xl font-semibold">Tarayıcılar arasında favorileri eşitle</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Aşağıdaki senkron kodunu başka bir tarayıcıda girerek aynı favori gün listesine bağlanabilirsiniz.
        </p>
      </div>

      <div className="rounded-3xl bg-black/5 p-4 dark:bg-white/5">
        <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Sizin senkron kodunuz
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="rounded-2xl bg-[var(--card)] px-4 py-3 text-lg font-semibold tracking-[0.2em]">
            {syncCode ?? (loading ? "Yükleniyor..." : "Hazır değil")}
          </code>
          <Button variant="secondary" disabled={!syncCode} onClick={() => void copyCode()}>
            <Copy className="mr-2 h-4 w-4" />
            Kopyala
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="grid gap-2 text-sm font-medium">
          Başka tarayıcıdan bağlan
          <input
            value={input}
            onChange={(event) => setInput(event.target.value.toUpperCase())}
            placeholder="Senkron kodunu girin"
            className="h-12 rounded-2xl border border-black/10 bg-transparent px-4 uppercase tracking-[0.2em] dark:border-white/10"
          />
        </label>
        <Button disabled={!input || loading} onClick={() => void connectProfile()}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Bu tarayıcıyı bağla
        </Button>
      </div>

      <p className="text-sm text-[var(--muted-foreground)]">
        {message ?? error ?? "Favorileriniz PostgreSQL üzerinde profil bazlı saklanır."}
      </p>
    </Card>
  );
}
