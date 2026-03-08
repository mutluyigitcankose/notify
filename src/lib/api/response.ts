import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "RATE_LIMIT"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "INTERNAL_ERROR";

/**
 * İstemciye gönderilecek hata mesajını güvenli hale getirir.
 * Veritabanı sorgu metni veya iç detaylar gönderilmez.
 */
export function sanitizeErrorMessage(error: unknown, fallback: string): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (
    /failed query|select .+ from|insert into|update .+ set|delete from|syntax error|relation .+ does not exist/i.test(
      msg,
    )
  ) {
    return fallback;
  }
  return msg;
}

/**
 * Tutarlı API hata yanıtı. Tüm route'lar bu formatta dönebilir.
 */
export function apiError(
  message: string,
  status: number,
  code?: ApiErrorCode,
  details?: unknown,
) {
  return NextResponse.json(
    {
      error: message,
      ...(code && { code }),
      ...(details !== undefined && { details }),
    },
    { status },
  );
}
