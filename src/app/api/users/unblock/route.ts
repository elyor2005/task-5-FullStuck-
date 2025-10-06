import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { serverAuthGuard } from "@/lib/authGuard"; // ✅ fixed import
import mongoose from "mongoose";

export async function POST(req: Request) {
  const guard = await serverAuthGuard(req);
  if (guard instanceof NextResponse) return guard;

  try {
    const body = await req.json();
    const ids: string[] = body?.ids || [];

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No ids provided" }, { status: 400 });
    }

    await connectDB();

    // ✅ Convert string IDs to ObjectId
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    const result = await UserModel.updateMany({ _id: { $in: objectIds } }, { $set: { status: "active" } });

    return NextResponse.json({ message: `Unblocked ${result.modifiedCount || 0} users` });
  } catch (err: any) {
    console.error("Unblock error:", err);
    return NextResponse.json({ error: "Unblock failed", details: err?.message }, { status: 500 });
  }
}
