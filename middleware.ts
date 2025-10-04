import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import type { JwtPayload } from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const PUBLIC_PATHS = ["/api/auth", "/login", "/register", "/api/test", "/auth/confirmed"];
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ Fix — ensure we handle both string and object payloads
  const payload = verifyToken(token) as string | JwtPayload;

  if (!payload || typeof payload === "string" || !("id" in payload)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    await connectDB();
    const user = await UserModel.findById(payload.id).lean().exec();

    if (!user) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (user.status === "blocked") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (user.status === "unverified") {
      url.pathname = "/login";
      url.searchParams.set("error", "unverified");
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.error("Middleware DB error:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
