"use client";

import { tr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { DayCell } from "@/components/calendar/day-cell";
import { Card } from "@/components/ui/card";

export function EventCalendar({ selectedDate }: { selectedDate: Date }) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden">
      <DayPicker
        locale={tr}
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (!date) {
            return;
          }

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
              <DayCell date={day.date} selected={modifiers.selected} today={modifiers.today} />
            </button>
          ),
        }}
      />
    </Card>
  );
}
