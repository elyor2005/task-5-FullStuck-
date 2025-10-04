// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/jwt";
import { connectDB } from "../../../../lib/mongodb";
import UserModel from "../../../../models/User";

export async function GET(req: Request) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  const payload = verifyToken(token);
  if (!payload?.id) return NextResponse.json({ user: null }, { status: 200 });

  const user = await UserModel.findById(payload.id).lean();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  return NextResponse.json({ user });
}
