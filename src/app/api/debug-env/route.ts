import { NextResponse } from "next/server";

// TEMPORARY diagnostic endpoint — do not leak secrets, only shapes/prefixes.
// Remove this file once the env var quoting issue is confirmed fixed.
export async function GET() {
  const url = process.env.NEXTAUTH_URL ?? null;
  const dbUrl = process.env.DATABASE_URL ?? null;
  const secret = process.env.NEXTAUTH_SECRET ?? null;
  const trustHost = process.env.AUTH_TRUST_HOST ?? null;

  return NextResponse.json({
    NEXTAUTH_URL: {
      raw: url,
      length: url?.length ?? null,
      startsWithQuote: url?.startsWith('"') ?? null,
      firstChar: url?.[0] ?? null,
      lastChar: url?.[url.length - 1] ?? null,
    },
    DATABASE_URL: {
      length: dbUrl?.length ?? null,
      first12: dbUrl?.slice(0, 12) ?? null,
      startsWithQuote: dbUrl?.startsWith('"') ?? null,
    },
    NEXTAUTH_SECRET: {
      length: secret?.length ?? null,
      startsWithQuote: secret?.startsWith('"') ?? null,
    },
    AUTH_TRUST_HOST: trustHost,
  });
}
