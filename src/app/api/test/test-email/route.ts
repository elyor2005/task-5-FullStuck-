/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/src/lib/email";

export async function GET() {
  try {
    // fake token for testing
    const token = "test-token-123";
    const email = process.env.SMTP_USER || "your@email.com";

    await sendConfirmationEmail(email, token);

    return NextResponse.json({ message: "✅ Test email sent to " + email });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
