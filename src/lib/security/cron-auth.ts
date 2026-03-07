export function verifyCronSecret(request: Request) {
  return request.headers.get("x-cron-secret") === process.env.CRON_SECRET;
}
