import { NextResponse } from "next/server";
import { getProfileSession, restoreProfileSession } from "@/lib/profile/session";
import { z } from "zod";

const restoreSchema = z.object({
  syncCode: z.string().trim().min(6).max(64),
});

export async function GET() {
  try {
    const profile = await getProfileSession();
    return NextResponse.json({
      profile: {
        id: profile.id,
        syncCode: profile.syncCode,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = restoreSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz senkron kodu." }, { status: 400 });
    }

    const profile = await restoreProfileSession(parsed.data.syncCode);
    return NextResponse.json({
      profile: {
        id: profile.id,
        syncCode: profile.syncCode,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
