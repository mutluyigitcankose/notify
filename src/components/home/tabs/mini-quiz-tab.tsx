"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CATEGORY_LABELS } from "@/lib/utils/constants";
import type { DailyEventsPayload } from "@/types/events";
import type { WikimediaCategory, WikimediaEvent } from "@/types/wikimedia";

const ROUND_SIZE = 5;
const MAX_TEXT_LEN = 100;
const CATEGORY_OPTIONS: WikimediaCategory[] = ["events", "births", "deaths", "holidays"];

type QuizQuestion =
  | { type: "year"; event: WikimediaEvent }
  | { type: "event"; year: number; correct: WikimediaEvent; wrong: WikimediaEvent[] }
  | { type: "category"; event: WikimediaEvent; category: WikimediaCategory };

function getEventsWithYear(payload: DailyEventsPayload): WikimediaEvent[] {
  return payload.groups.flatMap((g) => g.items).filter((e) => typeof e.year === "number");
}

function buildQuestions(payload: DailyEventsPayload): QuizQuestion[] {
  const events = getEventsWithYear(payload);
  const questions: QuizQuestion[] = [];

  // "Bu olay hangi yıl?" soruları
  for (const event of events) {
    questions.push({ type: "year", event });
  }

  // "Bu yılda ne oldu?" soruları
  for (const correct of events) {
    const year = correct.year!;
    const wrong = events
      .filter((e) => e.year !== year)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    if (wrong.length >= 3) {
      questions.push({ type: "event", year, correct, wrong });
    }
  }

  // "Bu kayıt hangi kategoride?" soruları
  for (const group of payload.groups) {
    if (!CATEGORY_OPTIONS.includes(group.category)) continue;
    for (const event of group.items.slice(0, 3)) {
      if (event.text.trim().length >= 10) {
        questions.push({ type: "category", event, category: group.category });
      }
    }
  }

  return questions.sort(() => Math.random() - 0.5);
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

export function MiniQuizTab({ payload }: { payload: DailyEventsPayload }) {
  const allQuestions = useMemo(() => buildQuestions(payload), [payload]);
  const roundQuestions = useMemo(
    () => allQuestions.slice(0, Math.min(ROUND_SIZE, allQuestions.length)),
    [allQuestions],
  );

  const [roundKey, setRoundKey] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);

  const resetRound = useCallback(() => {
    setRoundKey((k) => k + 1);
    setIndex(0);
    setSelected(null);
    setReveal(false);
    setScore(0);
  }, []);

  const question = roundQuestions[index];
  const isLast = index >= roundQuestions.length - 1;
  const roundComplete = reveal && isLast;

  function handleAnswer(value: number | string, isCorrect: boolean) {
    if (reveal) return;
    setSelected(value);
    setReveal(true);
    if (isCorrect) setScore((s) => s + 1);
  }

  function nextQuestion() {
    setSelected(null);
    setReveal(false);
    setIndex((i) => Math.min(i + 1, roundQuestions.length - 1));
  }

  if (roundQuestions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Mini bilgi
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">Tarih Quiz</h2>
        </div>
        <Card className="rounded-[28px] p-8 text-center">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-[var(--muted-foreground)]" />
          <p className="text-[var(--muted-foreground)]">
            Bugün için yeterli yıllı olay yok. Başka bir güne göz atın.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Mini bilgi
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">Tarih Quiz</h2>
        </div>
        {!roundComplete && (
          <div className="flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 dark:bg-white/5">
            <span className="text-sm font-medium tabular-nums">
              {index + 1} / {roundQuestions.length}
            </span>
            <span className="text-sm text-[var(--muted-foreground)]">•</span>
            <span className="text-sm text-[var(--muted-foreground)]">{score} doğru</span>
          </div>
        )}
      </div>

      {roundComplete ? (
        <Card className="space-y-6 rounded-[28px] p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)]/15">
            <Sparkles className="h-10 w-10 text-[var(--accent)]" />
          </div>
          <h3 className="text-2xl font-semibold">Tur bitti</h3>
          <p className="text-4xl font-bold tabular-nums text-[var(--accent)]">
            {score} / {roundQuestions.length}
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            {score === roundQuestions.length
              ? "Hepsi doğru! Harikasın."
              : score >= roundQuestions.length / 2
                ? "Güzel gidiyorsun, tekrar dene."
                : "Tarih tekrar etmek için güzel bir fırsat."}
          </p>
          <Button className="gap-2" onClick={resetRound}>
            <RotateCcw className="h-4 w-4" />
            Tekrar oyna
          </Button>
        </Card>
      ) : question ? (
        <Card className="space-y-6 rounded-[28px] p-6">
          {question.type === "year" ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Bu olay hangi yıl gerçekleşti?
                </p>
                <p className="mt-3 text-lg leading-8">{question.event.text}</p>
              </div>
              <YearOptions
                correctYear={question.event.year!}
                events={getEventsWithYear(payload)}
                currentEvent={question.event}
                selected={selected}
                reveal={reveal}
                onSelect={handleAnswer}
              />
            </>
          ) : question.type === "event" ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {question.year} yılında aşağıdakilerden hangisi gerçekleşti?
                </p>
              </div>
              <EventOptions
                correct={question.correct}
                wrong={question.wrong}
                selected={selected}
                reveal={reveal}
                onSelect={handleAnswer}
              />
            </>
          ) : (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Bu kayıt hangi kategoride?
                </p>
                <p className="mt-3 text-lg leading-8">{truncate(question.event.text, MAX_TEXT_LEN)}</p>
              </div>
              <CategoryOptions
                correctCategory={question.category}
                selected={selected}
                reveal={reveal}
                onSelect={handleAnswer}
              />
            </>
          )}

          {reveal && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-4 dark:border-white/10">
              <p
                className={
                  selected !== null && isCorrect(question, selected)
                    ? "text-sm font-medium text-green-700 dark:text-green-400"
                    : "text-sm text-[var(--muted-foreground)]"
                }
              >
                {selected !== null && isCorrect(question, selected)
                  ? "Doğru!"
                  : question.type === "year"
                    ? `Doğru yıl: ${question.event.year}`
                    : question.type === "event"
                      ? `Doğru: ${truncate(question.correct.text, 60)}`
                      : `Doğru: ${CATEGORY_LABELS[question.category]}`}
              </p>
              {(question.type === "year" || question.type === "category") && question.event.pages?.[0]?.content_urls?.desktop?.page ? (
                <Link
                  href={question.event.pages[0].content_urls.desktop.page}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]"
                >
                  Vikipedi’de oku
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
              <Button variant="secondary" onClick={nextQuestion}>
                {isLast ? "Sonucu gör" : "Sonraki soru"}
              </Button>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}

function isCorrect(question: QuizQuestion, selected: number | string): boolean {
  if (question.type === "year") return question.event.year === selected;
  if (question.type === "category") return CATEGORY_LABELS[question.category] === selected;
  return selected === key(truncate(question.correct.text, MAX_TEXT_LEN));
}

function key(text: string) {
  return text.slice(0, 80);
}

function YearOptions({
  correctYear,
  events,
  currentEvent,
  selected,
  reveal,
  onSelect,
}: {
  correctYear: number;
  events: WikimediaEvent[];
  currentEvent: WikimediaEvent;
  selected: number | string | null;
  reveal: boolean;
  onSelect: (value: number, isCorrect: boolean) => void;
}) {
  const wrong =
    events.filter((e) => e !== currentEvent && e.year != null).length >= 3
      ? events
          .filter((e) => e !== currentEvent && e.year != null)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((e) => e.year!)
      : [correctYear - 10, correctYear + 5, correctYear - 50].filter((y) => y > 0 && y !== correctYear).slice(0, 3);
  const options = [correctYear, ...wrong].sort(() => Math.random() - 0.5);

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((year) => {
        const correct = correctYear === year;
        const chosen = selected === year;
        return (
          <Button
            key={year}
            variant="secondary"
            className="h-14 text-lg"
            onClick={() => onSelect(year, correct)}
            disabled={reveal}
          >
            {year}
            {reveal && chosen && (correct ? <Check className="ml-2 h-5 w-5 text-green-600" /> : <X className="ml-2 h-5 w-5 text-red-500" />)}
          </Button>
        );
      })}
    </div>
  );
}

function EventOptions({
  correct,
  wrong,
  selected,
  reveal,
  onSelect,
}: {
  correct: WikimediaEvent;
  wrong: WikimediaEvent[];
  selected: number | string | null;
  reveal: boolean;
  onSelect: (value: string, isCorrect: boolean) => void;
}) {
  const keyFn = (t: string) => t.slice(0, 80);
  const correctKey = keyFn(correct.text);
  const options = [correct, ...wrong]
    .map((e) => truncate(e.text, MAX_TEXT_LEN))
    .sort(() => Math.random() - 0.5);
  return (
    <div className="grid gap-3">
      {options.map((text) => {
        const optionKey = keyFn(text);
        const correctOption = optionKey === correctKey;
        const chosen = selected === optionKey;
        return (
          <Button
            key={optionKey}
            variant="secondary"
            className="h-auto min-h-14 py-4 text-left text-base font-normal"
            onClick={() => onSelect(optionKey, correctOption)}
            disabled={reveal}
          >
            <span className="block">{text}</span>
            {reveal && chosen && (correctOption ? <Check className="ml-2 h-5 w-5 shrink-0 text-green-600" /> : <X className="ml-2 h-5 w-5 shrink-0 text-red-500" />)}
          </Button>
        );
      })}
    </div>
  );
}

function CategoryOptions({
  correctCategory,
  selected,
  reveal,
  onSelect,
}: {
  correctCategory: WikimediaCategory;
  selected: number | string | null;
  reveal: boolean;
  onSelect: (value: string, isCorrect: boolean) => void;
}) {
  const options = [...CATEGORY_OPTIONS]
    .map((c) => CATEGORY_LABELS[c])
    .sort(() => Math.random() - 0.5);
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((label) => {
        const correct = label === CATEGORY_LABELS[correctCategory];
        const chosen = selected === label;
        return (
          <Button
            key={label}
            variant="secondary"
            className="h-14"
            onClick={() => onSelect(label, correct)}
            disabled={reveal}
          >
            {label}
            {reveal && chosen && (correct ? <Check className="ml-2 h-5 w-5 text-green-600" /> : <X className="ml-2 h-5 w-5 text-red-500" />)}
          </Button>
        );
      })}
    </div>
  );
}
