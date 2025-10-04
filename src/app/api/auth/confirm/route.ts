// src/app/api/auth/confirm/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import UserModel from "../../../../models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await connectDB();

    const user = await UserModel.findOne({ confirmationToken: token }).exec();
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    user.status = "active";
    user.confirmationToken = undefined;
    await user.save();

    return NextResponse.json({ message: "✅ Email confirmed. You can now log in." }, { status: 200 });
  } catch (error) {
    console.error("Confirm error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
