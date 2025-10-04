import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import UserModel from "../../../../models/User";

export async function POST(req: Request) {
  await connectDB();
  try {
    const { ids } = (await req.json()) as { ids: string[] };
    if (!ids || !ids.length) return NextResponse.json({ error: "No users selected" }, { status: 400 });

    await UserModel.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ message: "Selected users deleted ✅" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete users", details: err?.message }, { status: 500 });
  }
}
