import { z } from "zod";
import type { WikimediaResponse } from "@/types/wikimedia";

const WIKIMEDIA_BASE_URL = "https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1_000;

const wikiPageSchema = z.object({
  title: z.string(),
  normalizedtitle: z.string().optional(),
  extract: z.string().optional(),
  thumbnail: z
    .object({
      source: z.string().url(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
  content_urls: z
    .object({
      desktop: z.object({ page: z.string().url() }).optional(),
      mobile: z.object({ page: z.string().url() }).optional(),
    })
    .optional(),
});

const wikiEventSchema = z.object({
  text: z.string(),
  year: z.number().optional(),
  pages: z.array(wikiPageSchema).optional(),
});

const wikiResponseSchema = z.object({
  selected: z.array(wikiEventSchema).default([]),
  events: z.array(wikiEventSchema).default([]),
  births: z.array(wikiEventSchema).default([]),
  deaths: z.array(wikiEventSchema).default([]),
  holidays: z.array(wikiEventSchema).default([]),
});

function getUserAgent() {
  const email = process.env.WIKIMEDIA_CONTACT_EMAIL ?? "admin@example.com";
  return `TarihteBugun/1.0 (mailto:${email})`;
}

export async function fetchWikimediaEvents(
  month: number,
  day: number,
): Promise<WikimediaResponse> {
  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");
  const url = `${WIKIMEDIA_BASE_URL}/all/${paddedMonth}/${paddedDay}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": getUserAgent(),
        },
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        throw new Error(`Wikimedia API ${response.status} döndürdü.`);
      }

      const raw = await response.json();
      return wikiResponseSchema.parse(raw);
    } catch (error) {
      lastError = error as Error;

      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)),
        );
      }
    }
  }

  throw new Error(
    `Wikimedia verisi alınamadı: ${lastError?.message ?? "bilinmeyen hata"}`,
  );
}
