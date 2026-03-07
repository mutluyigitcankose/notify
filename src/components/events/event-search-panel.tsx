"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { DailyEventsPayload } from "@/types/events";
import type { EventGroup } from "@/types/events";

const MAX_PREVIEW_LEN = 72;

function buildSuggestions(payload: DailyEventsPayload) {
  return Array.from(
    new Set(
      payload.groups
        .flatMap((group) => group.items.flatMap((item) => item.pages?.map((page) => page.title) ?? []))
        .filter(Boolean),
    ),
  ).slice(0, 8);
}

function getFilteredMatches(
  payload: DailyEventsPayload,
  normalized: string,
): { group: EventGroup; item: (EventGroup["items"][0] & { groupLabel: string }) }[] {
  const out: { group: EventGroup; item: (EventGroup["items"][0] & { groupLabel: string }) }[] = [];
  for (const group of payload.groups) {
    for (const item of group.items) {
      const pageTitles = item.pages?.map((p) => p.title).join(" ") ?? "";
      if (`${item.text} ${pageTitles}`.toLocaleLowerCase("tr").includes(normalized)) {
        out.push({ group, item: { ...item, groupLabel: group.label } });
      }
    }
  }
  return out;
}

export function EventSearchPanel({
  payload,
  compact = false,
}: {
  payload: DailyEventsPayload;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalized = deferredQuery.trim().toLocaleLowerCase("tr");
  const suggestions = buildSuggestions(payload);
  const matches = normalized ? getFilteredMatches(payload, normalized) : [];

  const totalCount = payload.groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <Card className={compact ? "space-y-4 p-4" : "space-y-5 p-6"}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge>Akıllı Filtre</Badge>
          <h3 className={compact ? "mt-2 text-lg font-semibold" : "mt-3 text-2xl font-semibold"}>
            Bu güne göre filtrele
          </h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {totalCount} kayıt var. Aşağıya yazarak listeleyin.
          </p>
        </div>
        <label
          className={`flex shrink-0 items-center gap-3 rounded-full border border-black/10 bg-transparent px-4 dark:border-white/10 ${
            compact ? "h-10 min-w-[200px]" : "h-12 min-w-[240px]"
          }`}
        >
          <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="İsim, yer, konu..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </label>
      </div>

      {!normalized && suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="rounded-full bg-black/5 px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {normalized && matches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 p-6 text-sm text-[var(--muted-foreground)] dark:border-white/15">
          <Sparkles className="mb-2 h-5 w-5" />
          Eşleşen kayıt yok.
        </div>
      ) : normalized && matches.length > 0 ? (
        <ul className="space-y-2">
          {matches.map(({ item }, i) => {
            const preview =
              item.text.length > MAX_PREVIEW_LEN ? item.text.slice(0, MAX_PREVIEW_LEN) + "…" : item.text;
            const url =
              item.pages?.[0]?.content_urls?.desktop?.page ??
              item.pages?.[0]?.content_urls?.mobile?.page;
            return (
              <li key={i}>
                <div className="flex flex-wrap items-start justify-between gap-2 rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 dark:border-white/10 dark:bg-white/[0.02]">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.year != null && (
                        <Badge className="bg-[var(--accent)] text-white">{item.year}</Badge>
                      )}
                      <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                        {item.groupLabel}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-6">{preview}</p>
                  </div>
                  {url ? (
                    <Link
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--accent)]"
                    >
                      Vikipedi
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </Card>
  );
}
