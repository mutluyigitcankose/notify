import type { WikimediaCategory } from "@/types/wikimedia";

export const CATEGORY_LABELS: Record<WikimediaCategory, string> = {
  selected: "Seçilmişler",
  events: "Olaylar",
  births: "Doğumlar",
  deaths: "Ölümler",
  holidays: "Tatiller",
};

export const CATEGORY_ORDER: WikimediaCategory[] = [
  "selected",
  "events",
  "births",
  "deaths",
  "holidays",
];

export const APP_NAME = "Tarihte Bugün";
export const APP_DESCRIPTION =
  "Her gün için Türkçe tarih olayları, doğumlar, ölümler ve tatiller.";
