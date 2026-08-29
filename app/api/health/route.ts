import { NextResponse } from "next/server";
import { getRegistrationCount } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const registrationCount = await getRegistrationCount();

    return NextResponse.json({
      ok: true,
      database: "postgres",
      registrationCount,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: "postgres",
        message:
          error instanceof Error
            ? error.message
            : "Unknown Supabase Postgres connection error",
      },
      { status: 500 },
    );
  }
}
