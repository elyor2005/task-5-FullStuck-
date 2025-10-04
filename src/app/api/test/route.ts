import { connectDB } from "../../../lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "MongoDB Connected Successfully ✅" });
  } catch (error) {
    return Response.json({ error: "MongoDB Connection Failed ❌", details: (error as Error).message }, { status: 500 });
  }
}
