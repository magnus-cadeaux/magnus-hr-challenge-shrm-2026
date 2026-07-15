import { NextResponse, type NextRequest } from "next/server";

/**
 * Rate-limiting preparation stub.
 * Edge middleware records a lightweight request fingerprint. Replace with
 * Upstash/Vercel KV counters before high-traffic launch.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-magnus-request-id", crypto.randomUUID());
  response.headers.set("x-magnus-path", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
