import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import UserModel, { IUser } from "@/models/User";
import type { JwtPayload } from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // ✅ Allow public routes (no authentication required)
  const PUBLIC_PATHS = ["/api/auth", "/login", "/register", "/auth/confirmed", "/api/test"];

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ✅ Get token from cookies
  const token = req.cookies.get("token")?.value;

  // ✅ If no token → redirect to login (but avoid redirect loops)
  if (!token && !pathname.startsWith("/login")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ Verify token
  const payload = verifyToken(token || "") as string | JwtPayload;

  if (!payload || typeof payload === "string" || !("id" in payload)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    await connectDB();

    const user = (await UserModel.findById(payload.id).lean()) as IUser | null;

    if (!user) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // ✅ Prevent blocked users
    if (user.status === "blocked") {
      url.pathname = "/login";
      url.searchParams.set("error", "blocked");
      return NextResponse.redirect(url);
    }

    // ✅ Prevent unverified users
    if (user.status === "unverified") {
      url.pathname = "/login";
      url.searchParams.set("error", "unverified");
      return NextResponse.redirect(url);
    }

    // ✅ Redirect logged-in users away from login/register
    if ((pathname === "/login" || pathname === "/register") && user.status === "active") {
      url.pathname = "/admin"; // default protected page
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.error("❌ Middleware DB error:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ Allow valid users to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
