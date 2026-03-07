import { NextResponse } from "next/server";
import { getEventsForDate } from "@/lib/dal/events";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { dateParamsSchema } from "@/lib/security/validate";

export async function GET(
  request: Request,
  context: { params: Promise<{ month: string; day: string }> },
) {
  const ip = getClientIp(request);
  const limited = rateLimit(`events:${ip}`, 30, 60_000);

  if (!limited.success) {
    return NextResponse.json(
      { error: "Çok fazla istek gönderildi." },
      { status: 429 },
    );
  }

  const params = await context.params;
  const parsed = dateParamsSchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz tarih parametresi." },
      { status: 400 },
    );
  }

  try {
    const payload = await getEventsForDate(parsed.data.month, parsed.data.day);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
