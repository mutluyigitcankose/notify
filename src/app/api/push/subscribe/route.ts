import { NextResponse } from "next/server";
import { saveSubscription } from "@/lib/dal/subscriptions";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { pushSubscriptionSchema } from "@/lib/security/validate";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`subscribe:${ip}`, 5, 60_000);

  if (!limited.success) {
    return NextResponse.json(
      { error: "Abonelik limiti aşıldı." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const parsed = pushSubscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz abonelik verisi.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const subscription = await saveSubscription(
      parsed.data,
      request.headers.get("user-agent"),
      parsed.data.settings,
    );

    return NextResponse.json({ success: true, subscriptionId: subscription.id });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
