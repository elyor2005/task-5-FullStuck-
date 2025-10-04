import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function POST(req: Request) {
  await connectDB();
  try {
    const { ids } = (await req.json()) as { ids: string[] };
    if (!ids || !ids.length) return NextResponse.json({ error: "No users selected" }, { status: 400 });

    await UserModel.updateMany({ _id: { $in: ids } }, { $set: { status: "active" } });

    return NextResponse.json({ message: "Selected users unblocked ✅" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to unblock users", details: err?.message }, { status: 500 });
  }
}
