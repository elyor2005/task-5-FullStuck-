// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Allow public routes
  const PUBLIC_PATHS = ["/api/auth", "/login", "/register", "/auth/confirmed"];
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for token
  const token = req.cookies.get("token")?.value;
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ Do NOT use mongoose or JWT verification here (Edge runtime limitation)
  return NextResponse.next();
}

// ✅ Only protect pages (not all API routes)
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
