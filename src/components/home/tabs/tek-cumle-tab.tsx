"use client";

import { Card } from "@/components/ui/card";
import type { DailyEventsPayload } from "@/types/events";

export function TekCumleTab({ payload }: { payload: DailyEventsPayload }) {
  const text = payload.featured
    ? `${payload.featured.year ? payload.featured.year + " yılında " : ""}${payload.featured.text}`
    : payload.highlights[0]
      ? `${payload.highlights[0].year ? payload.highlights[0].year + " yılında " : ""}${payload.highlights[0].text}`
      : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Özet
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Bugünü tek cümlede</h2>
      </div>
      <Card className="rounded-[28px] border-2 border-[var(--accent)]/20 bg-[var(--accent)]/5 p-8">
        {text ? (
          <p className="text-xl font-medium leading-8 text-[var(--foreground)] md:text-2xl">
            {text}
          </p>
        ) : (
          <p className="text-[var(--muted-foreground)]">Bu gün için öne çıkan cümle yok.</p>
        )}
      </Card>
    </div>
  );
}
