import type { WikimediaCategory, WikimediaEvent } from "@/types/wikimedia";

export interface EventGroup {
  category: WikimediaCategory;
  label: string;
  items: WikimediaEvent[];
}

export interface EventStatBlock {
  totalEvents: number;
  categoriesWithContent: number;
  earliestYear?: number;
  latestYear?: number;
}

export interface EventHighlight {
  category: WikimediaCategory;
  label: string;
  year?: number;
  text: string;
}

export interface DailyEventsPayload {
  month: number;
  day: number;
  groups: EventGroup[];
  featured?: WikimediaEvent;
  stats: EventStatBlock;
  highlights: EventHighlight[];
}
