/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function POST() {
  await connectDB();
  try {
    const result = await UserModel.deleteMany({ status: "unverified" });
    return NextResponse.json({
      message: `Deleted ${result.deletedCount} unverified users ✅`,
    });
  } catch (err: any) {
    console.error("Delete unverified error:", err);
    return NextResponse.json({ error: "Failed to delete unverified users" }, { status: 500 });
  }
}
