import Link from "next/link";
import type { Metadata } from "next";
import { EventCategoryTabs } from "@/components/events/event-category-tabs";
import { EventSearchPanel } from "@/components/events/event-search-panel";
import { DailyDigest } from "@/components/home/daily-digest";
import { DateNavigator } from "@/components/home/date-navigator";
import { FavoriteDates } from "@/components/home/favorite-dates";
import { ShareDateCard } from "@/components/home/share-date-card";
import { Card } from "@/components/ui/card";
import { getEventsForDate } from "@/lib/dal/events";
import { dateParamsSchema } from "@/lib/security/validate";
import { formatTurkishDate } from "@/lib/utils/date";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tarihtebugun.app";

type PageProps = {
  params: Promise<{ month: string; day: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const parsed = dateParamsSchema.parse(resolved);
  const date = new Date(2026, parsed.month - 1, parsed.day);
  const title = `${formatTurkishDate(date, "d MMMM")} tarihinde neler oldu?`;
  const description = "Belirli bir güne ait Türkçe tarih olayları, doğumlar ve ölümler.";
  const url = `${baseUrl}/date/${parsed.month}/${parsed.day}`;

  return {
    title: formatTurkishDate(date, "d MMMM"),
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: url },
  };
}

export default async function DatePage({ params }: PageProps) {
  const resolved = await params;
  const parsed = dateParamsSchema.parse(resolved);
  const data = await getEventsForDate(parsed.month, parsed.day);
  const date = new Date(2026, parsed.month - 1, parsed.day);
  const dateLabel = formatTurkishDate(date, "d MMMM");
  const pageUrl = `${baseUrl}/date/${parsed.month}/${parsed.day}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${dateLabel} tarihinde neler oldu? | Tarihte Bugün`,
    description: "Belirli bir güne ait Türkçe tarih olayları, doğumlar ve ölümler.",
    url: pageUrl,
    inLanguage: "tr",
    isPartOf: {
      "@type": "WebSite",
      name: "Tarihte Bugün",
      url: baseUrl,
    },
  };

  return (
    <div className="flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section>
        <Card>
          <p className="text-sm text-[var(--muted-foreground)]">
            <Link href="/" className="text-[var(--accent)]">
              Ana Sayfa
            </Link>{" "}
            /{" "}
            <Link href="/kesfet" className="text-[var(--accent)]">
              Keşfet
            </Link>{" "}
            / Tarih / {dateLabel}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold">
            {formatTurkishDate(date, "d MMMM")} tarihinde neler oldu?
          </h1>
        </Card>
      </section>

      <section>
        <DateNavigator month={parsed.month} day={parsed.day} />
      </section>

      <section>
        <DailyDigest payload={data} />
      </section>

      <section>
        <EventCategoryTabs groups={data.groups} />
      </section>

      <section>
        <EventSearchPanel payload={data} />
      </section>

      <section>
        <FavoriteDates
          month={parsed.month}
          day={parsed.day}
          label={dateLabel}
        />
      </section>

      <section>
        <ShareDateCard
          month={parsed.month}
          day={parsed.day}
          label={dateLabel}
        />
      </section>
    </div>
  );
}
