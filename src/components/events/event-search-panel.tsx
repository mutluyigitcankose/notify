"use client";

import { useDeferredValue, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { EventCategoryTabs } from "@/components/events/event-category-tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { DailyEventsPayload } from "@/types/events";

export function EventSearchPanel({ payload }: { payload: DailyEventsPayload }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalized = deferredQuery.trim().toLocaleLowerCase("tr");

  const filteredGroups = normalized
    ? payload.groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            const pageTitles = item.pages?.map((page) => page.title).join(" ") ?? "";
            return `${item.text} ${pageTitles}`.toLocaleLowerCase("tr").includes(normalized);
          }),
        }))
        .filter((group) => group.items.length > 0)
    : payload.groups;

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge>Akıllı Filtre</Badge>
          <h3 className="mt-3 text-2xl font-semibold">Günün içeriğinde ara</h3>
        </div>
        <label className="flex h-12 min-w-[260px] items-center gap-3 rounded-full border border-black/10 bg-transparent px-4 dark:border-white/10">
          <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Örn. Atatürk, İstanbul, Osmanlı"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </label>
      </div>
      {normalized && filteredGroups.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/15 p-6 text-sm text-[var(--muted-foreground)] dark:border-white/15">
          <Sparkles className="mb-3 h-5 w-5" />
          Aramanızla eşleşen kayıt bulunamadı.
        </div>
      ) : (
        <EventCategoryTabs groups={filteredGroups} />
      )}
    </Card>
  );
}
