export type WikimediaCategory =
  | "selected"
  | "events"
  | "births"
  | "deaths"
  | "holidays";

export interface WikimediaPageThumbnail {
  source: string;
  width: number;
  height: number;
}

export interface WikimediaPageContentUrls {
  desktop?: { page: string };
  mobile?: { page: string };
}

export interface WikimediaPage {
  title: string;
  normalizedtitle?: string;
  extract?: string;
  thumbnail?: WikimediaPageThumbnail;
  content_urls?: WikimediaPageContentUrls;
}

export interface WikimediaEvent {
  text: string;
  year?: number;
  pages?: WikimediaPage[];
}

export type WikimediaResponse = Record<WikimediaCategory, WikimediaEvent[]>;
