"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

const STREAK_KEY = "tarihte-bugun-streak";
const LAST_VISIT_KEY = "tarihte-bugun-last-visit";

function getStoredStreak(): { streak: number; lastVisit: string } {
  if (typeof window === "undefined") return { streak: 0, lastVisit: "" };
  const last = window.localStorage.getItem(LAST_VISIT_KEY) ?? "";
  const streak = Number(window.localStorage.getItem(STREAK_KEY) ?? 0);
  return { streak, lastVisit: last };
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function SerimTab({ month, day }: { month: number; day: number }) {
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = todayKey();
    const { streak: s, lastVisit } = getStoredStreak();

    if (lastVisit === today) {
      setStreak(s);
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

    let next = s;
    if (lastVisit === yesterdayStr) {
      next = s + 1;
    } else if (lastVisit !== today) {
      next = 1;
    }

    window.localStorage.setItem(STREAK_KEY, String(next));
    window.localStorage.setItem(LAST_VISIT_KEY, today);
    setStreak(next);
  }, [month, day]);

  if (!mounted) {
    return (
      <Card className="rounded-[28px] p-8">
        <div className="h-24 animate-pulse rounded-2xl bg-black/10 dark:bg-white/10" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Seri
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Ziyaret serin</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Üst üste her gün uğrayarak serini yükselt.
        </p>
      </div>
      <Card className="flex flex-col items-center justify-center gap-4 rounded-[28px] p-12">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--accent)]/15">
          <Flame className="h-12 w-12 text-[var(--accent)]" />
        </div>
        <p className="text-5xl font-bold tabular-nums">{streak}</p>
        <p className="text-sm text-[var(--muted-foreground)]">
          {streak === 0
            ? "Yarın tekrar gel, seri başlasın."
            : streak === 1
              ? "1 gün üst üste geldin. Yarın devam et!"
              : `${streak} gün üst üste geldin. Harikasın!`}
        </p>
      </Card>
    </div>
  );
}
