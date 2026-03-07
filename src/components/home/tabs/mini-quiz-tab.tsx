"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DailyEventsPayload } from "@/types/events";
import type { WikimediaEvent } from "@/types/wikimedia";

function getEventsWithYear(payload: DailyEventsPayload): WikimediaEvent[] {
  return payload.groups.flatMap((g) => g.items).filter((e) => typeof e.year === "number");
}

export function MiniQuizTab({ payload }: { payload: DailyEventsPayload }) {
  const events = getEventsWithYear(payload);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const event = events[currentIndex];
  const wrongOptions =
    event && events.length >= 4
      ? events
          .filter((e) => e !== event && e.year != null)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((e) => e.year!)
      : event?.year != null
        ? [event.year - 10, event.year + 5, event.year - 50].filter((y) => y > 0)
        : [];

  const options = event
    ? [event.year!, ...wrongOptions].sort(() => Math.random() - 0.5)
    : [];

  function handleAnswer(year: number) {
    if (showResult) return;
    setAnswer(year);
    setShowResult(true);
  }

  function nextQuestion() {
    setAnswer(null);
    setShowResult(false);
    setCurrentIndex((i) => (i + 1) % Math.max(1, events.length));
  }

  if (events.length === 0) {
    return (
      <Card className="rounded-[28px] p-8 text-center">
        <p className="text-[var(--muted-foreground)]">
          Bugün için yıllı olay bulunamadı. Başka bir güne göz atın.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Mini bilgi
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Bu olay hangi yıl?</h2>
      </div>
      <Card className="space-y-6 rounded-[28px] p-6">
        <p className="text-lg leading-8">{event?.text}</p>
        <div className="grid grid-cols-2 gap-3">
          {options.map((year) => {
            const correct = event?.year === year;
            const chosen = answer === year;
            const reveal = showResult;
            return (
              <Button
                key={year}
                variant="secondary"
                className="h-14 text-lg"
                onClick={() => handleAnswer(year)}
                disabled={showResult}
              >
                {year}
                {reveal && chosen &&
                  (correct ? (
                    <Check className="ml-2 h-5 w-5 text-green-600" />
                  ) : (
                    <X className="ml-2 h-5 w-5 text-red-500" />
                  ))}
              </Button>
            );
          })}
        </div>
        {showResult && (
          <div className="flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
            <p className="text-sm text-[var(--muted-foreground)]">
              {answer === event?.year ? "Doğru!" : `Doğru yıl: ${event?.year}`}
            </p>
            <Button variant="secondary" onClick={nextQuestion}>
              Sonraki soru
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
