import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="rounded-[28px] border border-black/10 bg-[var(--card)] p-8 text-center dark:border-white/10">
      <h1 className="font-serif text-4xl font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-3 text-[var(--muted-foreground)]">
        İstenen tarih veya içerik mevcut değil.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/">Ana sayfaya dön</Link>
      </Button>
    </div>
  );
}
