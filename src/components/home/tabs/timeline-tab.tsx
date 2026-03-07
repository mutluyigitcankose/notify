"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CATEGORY_LABELS } from "@/lib/utils/constants";
import type { DailyEventsPayload } from "@/types/events";
import type { WikimediaCategory, WikimediaEvent } from "@/types/wikimedia";

type EventWithCategory = WikimediaEvent & { category: WikimediaCategory };

function flattenAndSort(payload: DailyEventsPayload): EventWithCategory[] {
  const list: EventWithCategory[] = [];
  for (const group of payload.groups) {
    for (const item of group.items) {
      if (typeof item.year === "number") {
        list.push({ ...item, category: group.category });
      }
    }
  }
  return list.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
}

export function TimelineTab({ payload }: { payload: DailyEventsPayload }) {
  const events = flattenAndSort(payload);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Zaman çizelgesi
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">
          Bu günün olayları, en eskiden en yeniye
        </h2>
      </div>
      <div className="relative space-y-0">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-black/10 dark:bg-white/10" />
        {events.map((event, index) => (
          <div key={index} className="relative flex gap-6 pb-8 pl-12">
            <div className="absolute left-2.5 h-4 w-4 rounded-full border-2 border-[var(--accent)] bg-[var(--background)]" />
            <Card className="flex-1 rounded-2xl p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-[var(--accent)] text-white">{event.year}</Badge>
                <Badge className="ring-1 ring-black/10 dark:ring-white/10">{CATEGORY_LABELS[event.category]}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6">{event.text}</p>
              {event.pages?.[0]?.content_urls?.desktop?.page ? (
                <Link
                  href={event.pages[0].content_urls.desktop.page}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]"
                >
                  Vikipedi
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </Card>
          </div>
        ))}
      </div>
      {events.length === 0 && (
        <Card className="rounded-[28px] p-8 text-center text-[var(--muted-foreground)]">
          Bu gün için yıllı olay bulunamadı.
        </Card>
      )}
    </div>
  );
}
