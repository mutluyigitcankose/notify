import { connection } from "next/server";
import { ExploreDateCard } from "@/components/home/explore-date-card";
import { Badge } from "@/components/ui/badge";
import { getEventsForDate } from "@/lib/dal/events";
import { getAdjacentDates, getMonthDayInIstanbul } from "@/lib/utils/date";

export default async function ExplorePage() {
  await connection();
  const today = getMonthDayInIstanbul();
  const adjacent = getAdjacentDates(today.month, today.day);

  const curatedDates = [
    today,
    adjacent.previous,
    adjacent.next,
    { month: 4, day: 23 },
    { month: 10, day: 29 },
  ];

  const uniqueDates = curatedDates.filter(
    (date, index, items) =>
      items.findIndex((candidate) => candidate.month === date.month && candidate.day === date.day) ===
      index,
  );

  const cards = await Promise.all(
    uniqueDates.map(async (date) => ({
      ...date,
      payload: await getEventsForDate(date.month, date.day),
    })),
  );

  return (
    <div className="flex flex-col gap-10">
      <section>
        <Badge>Keşfet</Badge>
        <h1 className="mt-3 font-serif text-4xl font-semibold">
          Editoryal tarih rotaları
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
          Sadece bugünü değil, komşu günleri ve sembolik tarihleri de hızlıca tarayın.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {cards.map((card) => (
          <ExploreDateCard
            key={`${card.month}-${card.day}`}
            initialMonth={card.month}
            initialDay={card.day}
            initialPayload={card.payload}
          />
        ))}
      </section>
    </div>
  );
}
