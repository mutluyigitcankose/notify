"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-black/10 bg-[var(--card)] p-8 dark:border-white/10">
      <h2 className="font-serif text-3xl font-semibold">Bir hata oluştu</h2>
      <p className="mt-3 text-sm text-[var(--muted-foreground)]">{error.message}</p>
      <Button className="mt-6" onClick={() => reset()}>
        Tekrar dene
      </Button>
    </div>
  );
}
