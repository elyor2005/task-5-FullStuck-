// src/lib/authGuard.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt"; // returns payload or throws/returns null
import { connectDB } from "./mongodb";
import UserModel from "@/models/User";

export async function serverAuthGuard(req: Request | { headers?: Headers }) {
  try {
    // Next.js route.ts has Request; cookies are in headers -> read cookie header
    const cookieHeader = (req as any).headers?.get ? (req as any).headers.get("cookie") : undefined;
    // fallback: if Request object has cookies property (server runtime different forms)
    // You may also use 'cookie' npm parse if necessary.
    const token = (() => {
      if (!cookieHeader) return null;
      // basic parse for token cookie; this is simple and safe
      const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    })();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const payload = verifyToken(token) as { id?: string } | null;
    if (!payload?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // DB + fetch current user
    await connectDB();
    const user = await UserModel.findById(payload.id).lean().exec();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // If user is blocked or deleted -> forbid
    if (user.status === "blocked") {
      return NextResponse.json({ error: "Your account is blocked" }, { status: 403 });
    }

    // success -> return user object (not NextResponse)
    return user;
  } catch (err) {
    console.error("serverAuthGuard error:", err);
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 });
  }
}
