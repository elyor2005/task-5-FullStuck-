// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    }).exec();

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.status === "blocked") {
      const res = NextResponse.json({ error: "Your account is blocked. Contact support." }, { status: 403 });
      res.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      });
      return res;
    }

    if (user.status === "unverified") {
      return NextResponse.json({ error: "Please confirm your email before logging in." }, { status: 403 });
    }

    const pwOk = await comparePassword(password, user.passwordHash);
    if (!pwOk) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({
      id: user.id.toString(),
      email: user.email,
      status: user.status,
    });

    const res = NextResponse.json(
      {
        message: "✅ Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
        },
      },
      { status: 200 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // required by Vercel HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // needed for cross-site cookies
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed", details: err?.message }, { status: 500 });
  }
}
