// src/app/api/users/unblock/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { serverAuthGuard } from "@/lib/authDuard";

export async function POST(req: Request) {
  const guard = await serverAuthGuard(req);
  if (guard instanceof NextResponse) return guard; // auth failed / blocked etc

  // guard is current user
  const currentUser: any = guard;

  try {
    const body = await req.json(); // { ids: []}
    const ids: string[] = body?.ids || [];

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No ids provided" }, { status: 400 });
    }

    await connectDB();

    const result = await UserModel.updateMany({ _id: { $in: ids } }, { $set: { status: "active" } }).exec();

    return NextResponse.json({ message: `Unblocked ${result.modifiedCount || 0} users` });
  } catch (err: any) {
    console.error("Unblock error:", err);
    return NextResponse.json({ error: "Unblock failed", details: err?.message }, { status: 500 });
  }
}
