import { fetchWikimediaEvents } from "@/lib/api/wikimedia";
import { isDatabaseConfigured } from "@/lib/db";
import { getFreshEventCache, upsertEventCache } from "@/lib/db/queries/events";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/utils/constants";
import type { DailyEventsPayload } from "@/types/events";
import type { WikimediaCategory, WikimediaResponse } from "@/types/wikimedia";

/** API bazen tek harf veya anlamsız text döndürüyor (özellikle tatiller). Bunları göstermiyoruz. */
const MIN_EVENT_TEXT_LENGTH = 2;

function isMeaningfulText(text: string): boolean {
  return text.trim().length >= MIN_EVENT_TEXT_LENGTH;
}

function filterMeaningful(raw: WikimediaResponse): WikimediaResponse {
  return CATEGORY_ORDER.reduce(
    (acc, category) => {
      acc[category] = (raw[category] ?? []).filter((item) => isMeaningfulText(item.text));
      return acc;
    },
    {} as WikimediaResponse,
  );
}

function buildStats(raw: WikimediaResponse) {
  const years = CATEGORY_ORDER.flatMap((category) =>
    raw[category].flatMap((item) => (typeof item.year === "number" ? [item.year] : [])),
  );
  const totalEvents = CATEGORY_ORDER.reduce(
    (sum, category) => sum + raw[category].length,
    0,
  );

  return {
    totalEvents,
    categoriesWithContent: CATEGORY_ORDER.filter((category) => raw[category].length > 0).length,
    earliestYear: years.length > 0 ? Math.min(...years) : undefined,
    latestYear: years.length > 0 ? Math.max(...years) : undefined,
  };
}

function buildHighlights(raw: WikimediaResponse) {
  return CATEGORY_ORDER.flatMap((category) =>
    raw[category].slice(0, category === "selected" ? 2 : 1).map((item) => ({
      category,
      label: CATEGORY_LABELS[category],
      year: item.year,
      text: item.text,
    })),
  ).slice(0, 5);
}

function toPayload(month: number, day: number, raw: WikimediaResponse): DailyEventsPayload {
  const filtered = filterMeaningful(raw);

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: filtered[category] ?? [],
  }));

  return {
    month,
    day,
    groups,
    featured:
      filtered.selected[0] ??
      filtered.events[0] ??
      filtered.births[0] ??
      filtered.deaths[0] ??
      filtered.holidays[0],
    stats: buildStats(filtered),
    highlights: buildHighlights(filtered),
  };
}

function fromCache(
  rows: Array<{ category: string; data: unknown }>,
  month: number,
  day: number,
) {
  const raw = CATEGORY_ORDER.reduce((acc, category) => {
    const found = rows.find((row) => row.category === category);
    acc[category] = Array.isArray(found?.data) ? found.data : [];
    return acc;
  }, {} as WikimediaResponse);

  return toPayload(month, day, raw);
}

export async function getEventsForDate(month: number, day: number) {
  if (isDatabaseConfigured()) {
    try {
      const cached = await getFreshEventCache(month, day);
      if (cached.length > 0) {
        return fromCache(cached, month, day);
      }
    } catch {
      // Veritabanı erişilemiyorsa veya tablo yoksa API'den çekmeye devam et
    }
  }

  const fresh = await fetchWikimediaEvents(month, day);

  if (isDatabaseConfigured()) {
    try {
      const entries = Object.entries(fresh).map(([category, data]) => ({
        category,
        data,
      }));
      await upsertEventCache(month, day, entries);
    } catch {
      // Cache yazma başarısız olsa da veriyi döndür
    }
  }

  return toPayload(month, day, fresh);
}

export async function searchEventsForDate(month: number, day: number, query: string) {
  const payload = await getEventsForDate(month, day);
  const normalizedQuery = query.toLocaleLowerCase("tr");

  const groups = payload.groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const pageText = item.pages?.map((page) => page.title ?? "").join(" ") ?? "";
        return `${item.text} ${pageText}`.toLocaleLowerCase("tr").includes(normalizedQuery);
      }),
    }))
    .filter((group) => group.items.length > 0);

  return {
    ...payload,
    groups,
    stats: {
      ...payload.stats,
      totalEvents: groups.reduce((sum, group) => sum + group.items.length, 0),
      categoriesWithContent: groups.length,
    },
    highlights: payload.highlights.filter((highlight) =>
      highlight.text.toLocaleLowerCase("tr").includes(normalizedQuery),
    ),
  };
}

export function pickNotificationItems(
  payload: DailyEventsPayload,
  allowedCategories: WikimediaCategory[],
  limit = 3,
) {
  const items = payload.groups
    .filter((group) => allowedCategories.includes(group.category))
    .flatMap((group) =>
      group.items.slice(0, limit).map((item) => ({
        category: group.category,
        label: group.label,
        item,
      })),
    );

  return items.slice(0, limit);
}
