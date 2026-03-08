import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb, isDatabaseConfigured } from "@/lib/db";

/**
 * Sağlık kontrolü. Monitoring ve load balancer için.
 * GET /api/health → 200 { ok: true, db?: "ok" | "unavailable" }
 */
export async function GET() {
  const body: { ok: boolean; db?: "ok" | "unavailable" } = { ok: true };

  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      await db.execute(sql`SELECT 1`);
      body.db = "ok";
    } catch {
      body.db = "unavailable";
    }
  }

  return NextResponse.json(body);
}
