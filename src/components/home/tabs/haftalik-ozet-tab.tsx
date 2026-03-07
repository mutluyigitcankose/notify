"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatTurkishDate, getAdjacentDates } from "@/lib/utils/date";

function getLast7Days(month: number, day: number) {
  const days: { month: number; day: number; label: string }[] = [];
  let m = month;
  let d = day;
  for (let i = 0; i < 7; i++) {
    const date = new Date(2024, m - 1, d);
    days.push({
      month: date.getMonth() + 1,
      day: date.getDate(),
      label: formatTurkishDate(date, "d MMMM"),
    });
    const prev = getAdjacentDates(m, d).previous;
    m = prev.month;
    d = prev.day;
  }
  return days;
}

export function HaftalikOzetTab({ month, day }: { month: number; day: number }) {
  const last7 = getLast7Days(month, day);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Haftalık
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Son 7 gün</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Geriye doğru her güne tıklayarak o günün tarihine gidebilirsiniz.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {last7.map(({ month: m, day: d, label }) => (
          <Link key={`${m}-${d}`} href={`/date/${m}/${d}`}>
            <Card className="flex items-center gap-4 rounded-2xl p-4 transition hover:bg-black/5 dark:hover:bg-white/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="font-medium">{label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
