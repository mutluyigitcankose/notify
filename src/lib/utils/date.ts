import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function formatTurkishDate(date: Date, pattern = "d MMMM yyyy") {
  return format(date, pattern, { locale: tr });
}

export function getIstanbulToday() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [year, month, day] = formatted.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getMonthDayInIstanbul() {
  const today = getIstanbulToday();
  return { month: today.getMonth() + 1, day: today.getDate() };
}

export function isValidMonthDay(month: number, day: number, year = 2024) {
  if (!Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  const candidate = new Date(year, month - 1, day);
  return candidate.getMonth() + 1 === month && candidate.getDate() === day;
}

export function getAdjacentDates(month: number, day: number, year = 2024) {
  const current = new Date(year, month - 1, day);
  const previous = new Date(current);
  const next = new Date(current);
  previous.setDate(current.getDate() - 1);
  next.setDate(current.getDate() + 1);

  return {
    previous: { month: previous.getMonth() + 1, day: previous.getDate() },
    next: { month: next.getMonth() + 1, day: next.getDate() },
  };
}
