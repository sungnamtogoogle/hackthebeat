import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await query<{ now: string }>("select now()::text as now");

    return NextResponse.json({
      ok: true,
      database: "postgres",
      checkedAt: result.rows[0]?.now,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: "postgres",
        message: error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 },
    );
  }
}

