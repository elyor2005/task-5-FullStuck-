import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function GET(req: Request) {
  await connectDB();

  try {
    const users = await UserModel.find(
      {},
      {
        name: 1,
        email: 1,
        status: 1,
        lastLogin: 1,
        createdAt: 1,
      }
    )
      .sort({ lastLogin: -1 }) // sort by lastLogin descending
      .lean()
      .exec();

    return NextResponse.json({ users }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Failed to fetch users:", err);
    return NextResponse.json({ error: "Failed to fetch users", details: err?.message }, { status: 500 });
  }
}
