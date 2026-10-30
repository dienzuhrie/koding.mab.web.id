import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// process.env.NEXT_DEPLOYMENT_ID di-inline saat build dari deploymentId
// (lihat next.config.ts), jadi ini selalu ID build yang sedang berjalan.
export function GET() {
  return NextResponse.json(
    { id: process.env.NEXT_DEPLOYMENT_ID ?? null },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
