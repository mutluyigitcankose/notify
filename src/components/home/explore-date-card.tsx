"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { DailyDigest } from "@/components/home/daily-digest";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTurkishDate, getAdjacentDates } from "@/lib/utils/date";
import type { DailyEventsPayload } from "@/types/events";

const YEAR = 2024;

function formatDateLabel(month: number, day: number) {
  const date = new Date(YEAR, month - 1, day);
  return formatTurkishDate(date, "d MMMM");
}

export function ExploreDateCard({
  initialMonth,
  initialDay,
  initialPayload,
}: {
  initialMonth: number;
  initialDay: number;
  initialPayload: DailyEventsPayload;
}) {
  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState(initialDay);
  const [payload, setPayload] = useState(initialPayload);
  const [loading, setLoading] = useState(false);

  const { previous, next } = getAdjacentDates(month, day, YEAR);
  const dateLabel = formatDateLabel(month, day);

  async function goToDate(nextMonth: number, nextDay: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${nextMonth}/${nextDay}`);
      if (!res.ok) throw new Error("Yüklenemedi");
      const data = (await res.json()) as DailyEventsPayload;
      setMonth(nextMonth);
      setDay(nextDay);
      setPayload(data);
    } catch {
      // Keep current state on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="relative space-y-4" aria-busy={loading}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Tarih
          </div>
          <div className="flex w-fit items-center gap-1 rounded-full bg-black/5 dark:bg-white/5">
            <Button
              variant="ghost"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => goToDate(previous.month, previous.day)}
              disabled={loading}
              aria-label="Önceki gün"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex min-w-[7rem] items-center justify-center gap-2 text-sm font-medium tabular-nums">
              {loading ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[var(--muted-foreground)]" aria-hidden />
              ) : null}
              {dateLabel}
            </span>
            <Button
              variant="ghost"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => goToDate(next.month, next.day)}
              disabled={loading}
              aria-label="Sonraki gün"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Link
          href={`/date/${month}/${day}`}
          className="shrink-0 self-start text-sm font-medium text-[var(--accent)] sm:self-center"
          aria-disabled={loading}
        >
          Detaya git
        </Link>
      </div>

      <div className="relative min-h-[12rem]">
        {loading ? (
          <div
            className="flex flex-col items-center justify-center gap-4 rounded-2xl py-12"
            role="status"
            aria-live="polite"
            aria-label="İçerik yükleniyor"
          >
            <Loader2 className="h-10 w-10 animate-spin text-[var(--muted-foreground)]" />
            <p className="text-sm text-[var(--muted-foreground)]">Yükleniyor…</p>
            <div className="grid w-full gap-3 pt-2 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-3xl" />
                ))}
              </div>
              <div className="grid gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-3xl" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-semibold">
                {payload.featured?.year ? `${payload.featured.year}: ` : ""}
                {payload.featured?.text ?? "Öne çıkan içerik yok"}
              </h2>
            </div>
            <DailyDigest payload={payload} />
          </>
        )}
      </div>
    </Card>
  );
}
