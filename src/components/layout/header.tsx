import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { APP_NAME } from "@/lib/utils/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[color:color-mix(in_oklab,var(--background)_86%,transparent)] backdrop-blur dark:border-white/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="rounded-2xl bg-[var(--accent)] p-2 text-white">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <div className="font-serif text-lg font-semibold">{APP_NAME}</div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Günlük tarih mikroöğrenmesi
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/kesfet">Keşfet</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/giris">Giriş</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/settings">Ayarlar</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
