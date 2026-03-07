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

type PageProps = {
  params: Promise<{ month: string; day: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const parsed = dateParamsSchema.parse(resolved);
  const date = new Date(2026, parsed.month - 1, parsed.day);

  return {
    title: `${formatTurkishDate(date, "d MMMM")} Tarihte Bugün`,
    description: "Belirli bir güne ait Türkçe tarih olayları, doğumlar ve ölümler.",
  };
}

export default async function DatePage({ params }: PageProps) {
  const resolved = await params;
  const parsed = dateParamsSchema.parse(resolved);
  const data = await getEventsForDate(parsed.month, parsed.day);
  const date = new Date(2026, parsed.month - 1, parsed.day);

  return (
    <div className="flex flex-col gap-10">
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
            / Tarih / {formatTurkishDate(date, "d MMMM")}
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
          label={formatTurkishDate(date, "d MMMM")}
        />
      </section>

      <section>
        <ShareDateCard
          month={parsed.month}
          day={parsed.day}
          label={formatTurkishDate(date, "d MMMM")}
        />
      </section>
    </div>
  );
}
