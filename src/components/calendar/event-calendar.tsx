"use client";

import { useState } from "react";
import { tr } from "date-fns/locale";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { useFavoriteDates } from "@/hooks/use-favorite-dates";
import { formatTurkishDate } from "@/lib/utils/date";
import { DayCell } from "@/components/calendar/day-cell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EventCalendar({ selectedDate }: { selectedDate: Date }) {
  const router = useRouter();
  const [activeDate, setActiveDate] = useState(selectedDate);
  const { isFavorite, toggle } = useFavoriteDates();
  const activeMonth = activeDate.getMonth() + 1;
  const activeDay = activeDate.getDate();
  const favorite = isFavorite(activeMonth, activeDay);

  return (
    <Card className="overflow-hidden">
      <DayPicker
        locale={tr}
        mode="single"
        selected={activeDate}
        onSelect={(date) => {
          if (!date) {
            return;
          }

          setActiveDate(date);
          router.push(`/date/${date.getMonth() + 1}/${date.getDate()}`);
        }}
        showOutsideDays
        className="!m-0"
        classNames={{
          month_caption: "mb-4 flex items-center justify-between text-lg font-semibold",
          month_grid: "w-full border-collapse",
          weekdays: "grid grid-cols-7 text-center text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]",
          week: "mt-2 grid grid-cols-7",
          day: "flex items-center justify-center",
          chevron: "fill-[var(--foreground)]",
        }}
        components={{
          DayButton: ({ day, modifiers, ...props }) => (
            <button {...props}>
              <DayCell
                date={day.date}
                selected={modifiers.selected}
                today={modifiers.today}
                favorite={isFavorite(day.date.getMonth() + 1, day.date.getDate())}
              />
            </button>
          ),
        }}
      />
      <div className="mt-4 flex flex-col gap-3 rounded-[24px] bg-black/5 p-4 dark:bg-white/5">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Seçili gün
          </div>
          <div className="mt-1 text-lg font-semibold">
            {formatTurkishDate(activeDate, "d MMMM")}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={favorite ? "default" : "secondary"}
            onClick={() =>
              toggle({
                month: activeMonth,
                day: activeDay,
                label: formatTurkishDate(activeDate, "d MMMM"),
              })
            }
          >
            {favorite ? (
              <BookmarkCheck className="mr-2 h-4 w-4" />
            ) : (
              <Bookmark className="mr-2 h-4 w-4" />
            )}
            {favorite ? "Favoriden çıkar" : "Günü favorile"}
          </Button>
          <span className="text-sm text-[var(--muted-foreground)]">
            Favori günler bu cihazda kayıtlı tutulur.
          </span>
        </div>
      </div>
    </Card>
  );
}
