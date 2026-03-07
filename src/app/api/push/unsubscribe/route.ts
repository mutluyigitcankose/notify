import { NextResponse } from "next/server";
import { unsubscribe } from "@/lib/dal/subscriptions";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { unsubscribeSchema } from "@/lib/security/validate";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`unsubscribe:${ip}`, 5, 60_000);

  if (!limited.success) {
    return NextResponse.json(
      { error: "Abonelik iptal limiti aşıldı." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const parsed = unsubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz endpoint." },
        { status: 400 },
      );
    }

    await unsubscribe(parsed.data.endpoint);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
