// middleware.ts (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./src/lib/jwt";
import { connectDB } from "./src/lib/mongodb";
import UserModel from "./src/models/User";

/**
 * Nota bene: middleware runs for all requests — careful with DB calls (performance).
 * We restrict middleware matching to private pages and API routes.
 */

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // 1️⃣ Exclude public/auth routes
  const PUBLIC_PATHS = ["/api/auth", "/login", "/register", "/api/test", "/auth/confirmed"];
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2️⃣ Get token from cookies
  const token = req.cookies.get("token")?.value;
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Verify token
  const payload = verifyToken(token);
  if (!payload?.id) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    // 4️⃣ Connect DB and get user
    await connectDB();
    const user = await UserModel.findById(payload.id).lean().exec();

    // 5️⃣ Check user status
    if (!user) {
      // User deleted
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (user.status === "blocked") {
      // Blocked user
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (user.status === "unverified") {
      // Unverified user
      url.pathname = "/login";
      // Optionally, add query to show message on login page
      url.searchParams.set("error", "unverified");
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.error("Middleware DB error:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 6️⃣ Everything OK, allow request
  return NextResponse.next();
}

// Only run middleware for private routes (admin/user management)
export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
