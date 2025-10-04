// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { verifyToken } from "./src/lib/jwt";
// import { connectDB } from "./src/lib/mongodb";
// import UserModel from "./src/models/User";

// export async function middleware(req: NextRequest) {
//   const url = req.nextUrl.clone();
//   const pathname = url.pathname;

//   const PUBLIC_PATHS = ["/api/auth", "/login", "/register", "/api/test", "/auth/confirmed"];
//   if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
//     return NextResponse.next();
//   }

//   const token = req.cookies.get("token")?.value;
//   if (!token) {
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   const payload = verifyToken(token);

//   // Type guard: ensure payload is an object with 'id'
//   if (!payload || typeof payload === "string" || !("id" in payload)) {
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   try {
//     await connectDB();
//     const user = await UserModel.findById(payload.id).lean().exec();

//     if (!user) {
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }

//     if (user.status === "blocked") {
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }

//     if (user.status === "unverified") {
//       url.pathname = "/login";
//       url.searchParams.set("error", "unverified");
//       return NextResponse.redirect(url);
//     }
//   } catch (err) {
//     console.error("Middleware DB error:", err);
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/api/:path*"],
// };
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Allow public routes
  const PUBLIC_PATHS = ["/api/auth/login", "/api/auth/register", "/api/auth/confirm", "/login", "/register", "/auth/confirmed", "/api/test"];

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check token
  const token = req.cookies.get("token")?.value;
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const payload = verifyToken(token);

    // If token invalid or expired
    if (!payload || !payload.id) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // ✅ Token is valid — allow request
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware JWT error:", error);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
