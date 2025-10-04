// src/app/api/auth/me/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "../../../../lib/jwt";
import { connectDB } from "../../../../lib/mongodb";
import UserModel from "../../../../models/User";

export async function GET(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const payload = verifyToken(token);

  // Type guard to ensure payload has 'id'
  if (!payload || typeof payload === "string" || !("id" in payload)) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // TypeScript now knows payload.id exists
  const user = await UserModel.findById(payload.id).lean();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user });
}
