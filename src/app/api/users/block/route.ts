import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import UserModel from "../../../../models/User";

export async function POST(req: Request) {
  await connectDB();
  try {
    const { ids } = (await req.json()) as { ids: string[] };
    await UserModel.updateMany({ _id: { $in: ids } }, { $set: { status: "blocked" } });
    return NextResponse.json({ message: "Selected users blocked ✅" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: "Action failed", details: err?.message }, { status: 500 });
  }
}
