type Entry = {
  count: number;
  resetAt: number;
};

const map = new Map<string, Entry>();

export function rateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = map.get(identifier);

  if (!current || now > current.resetAt) {
    map.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0 };
  }

  current.count += 1;
  return { success: true, remaining: limit - current.count };
}

export function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
