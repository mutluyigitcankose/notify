import Link from "next/link";
import { connection } from "next/server";
import { EventSearchPanel } from "@/components/events/event-search-panel";
import { EventCalendar } from "@/components/calendar/event-calendar";
import { EventCategoryTabs } from "@/components/events/event-category-tabs";
import { DailyDigest } from "@/components/home/daily-digest";
import { DateNavigator } from "@/components/home/date-navigator";
import { FavoriteDates } from "@/components/home/favorite-dates";
import { HomeTabs } from "@/components/home/home-tabs";
import { ReadingPaths } from "@/components/home/reading-paths";
import { PushPermissionBanner } from "@/components/notifications/push-permission-banner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getEventsForDate } from "@/lib/dal/events";
import { formatTurkishDate, getIstanbulToday } from "@/lib/utils/date";

export default async function HomePage() {
  await connection();
  const today = getIstanbulToday();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const data = await getEventsForDate(month, day);

  return (
    <HomeTabs payload={data} month={month} day={day}>
      <div className="flex flex-col gap-12">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(27,60,52,0.96),rgba(38,77,67,0.9))] text-white">
            <Badge className="w-fit bg-white/10 text-white">Bugünün Rotası</Badge>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight md:text-6xl">
              {formatTurkishDate(today, "d MMMM")} için tarih sahnesi hazır.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 md:text-base">
              Takvimden herhangi bir güne gidin, öne çıkan olayları okuyun ve sabah 09:00
              bildirimleriyle seriyi günlük alışkanlığa çevirin.
            </p>
            {data.featured ? (
              <div className="mt-8 rounded-[28px] bg-white/10 p-5 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Öne çıkan not
                </div>
                <p className="mt-3 text-lg leading-8">
                  {data.featured.year ? `${data.featured.year}: ` : ""}
                  {data.featured.text}
                </p>
              </div>
            ) : null}
          </Card>

          <EventCalendar selectedDate={today} />
        </section>

        <PushPermissionBanner />

        <section>
          <DailyDigest payload={data} />
        </section>

        <section>
          <FavoriteDates
            month={month}
            day={day}
            label={formatTurkishDate(today, "d MMMM")}
          />
        </section>

        <section>
          <ReadingPaths payload={data} />
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Günün akışı
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold">
                {formatTurkishDate(today, "d MMMM")} tarihinde neler oldu?
              </h2>
            </div>
            <Link
              href={`/date/${month}/${day}`}
              className="text-sm font-medium text-[var(--accent)]"
            >
              Detay sayfasına git
            </Link>
          </div>
          <DateNavigator month={month} day={day} />
          <EventCategoryTabs groups={data.groups} />
        </section>

        <section>
          <EventSearchPanel payload={data} compact />
        </section>
      </div>
    </HomeTabs>
  );
}
