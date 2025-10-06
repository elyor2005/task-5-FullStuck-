import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ids: string[] = body?.ids || [];

    console.log("🟢 Unblock request received:", ids);

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No ids provided" }, { status: 400 });
    }

    await connectDB();

    // Convert IDs to ObjectId
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    const result = await UserModel.updateMany({ _id: { $in: objectIds } }, { $set: { status: "active" } });

    console.log("🔵 Mongo result:", result);

    const updated = await UserModel.find({ _id: { $in: objectIds } });
    console.log("✅ Updated users after unblock:", updated);

    return NextResponse.json({
      message: `Unblocked ${result.modifiedCount} users`,
      updated,
    });
  } catch (err: any) {
    console.error("🔴 Unblock error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
