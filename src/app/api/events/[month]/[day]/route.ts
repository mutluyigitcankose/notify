import { getEventsForDate } from "@/lib/dal/events";
import { apiError } from "@/lib/api/response";
import { getClientIp, rateLimit } from "@/lib/security/rate-limit";
import { dateParamsSchema } from "@/lib/security/validate";

export async function GET(
  request: Request,
  context: { params: Promise<{ month: string; day: string }> },
) {
  const ip = getClientIp(request);
  const limited = rateLimit(`events:${ip}`, 30, 60_000);

  if (!limited.success) {
    return apiError("Çok fazla istek gönderildi.", 429, "RATE_LIMIT");
  }

  const params = await context.params;
  const parsed = dateParamsSchema.safeParse(params);

  if (!parsed.success) {
    return apiError("Geçersiz tarih parametresi.", 400, "VALIDATION_ERROR", parsed.error.flatten());
  }

  try {
    const payload = await getEventsForDate(parsed.data.month, parsed.data.day);
    return Response.json(payload);
  } catch (error) {
    return apiError((error as Error).message, 500, "INTERNAL_ERROR");
  }
}
