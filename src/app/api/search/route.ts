import { NextResponse } from "next/server";
import { searchEventsForDate } from "@/lib/dal/events";
import { eventSearchSchema } from "@/lib/security/validate";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { getMonthDayInIstanbul } from "@/lib/utils/date";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`search:${ip}`, 20, 60_000);

  if (!limited.success) {
    return NextResponse.json({ error: "Arama limiti aşıldı." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = eventSearchSchema.safeParse({
    q: searchParams.get("q"),
    month: searchParams.get("month") ?? undefined,
    day: searchParams.get("day") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz arama parametreleri.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const fallbackDate = getMonthDayInIstanbul();

  try {
    const result = await searchEventsForDate(
      parsed.data.month ?? fallbackDate.month,
      parsed.data.day ?? fallbackDate.day,
      parsed.data.q,
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
