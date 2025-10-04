// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { hashPassword } from "@/lib/hash";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    await connectDB();

    // check if user exists
    const existingUser = await UserModel.findOne({ email }).exec();
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // generate hashed password
    const hashedPassword = await hashPassword(password);

    // generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString("hex");

    // create new user with "unverified" status
    const user = new UserModel({
      name,
      email,
      passwordHash: hashedPassword,
      status: "unverified",
      confirmationToken,
      createdAt: new Date(),
    });

    await user.save();

    // send confirmation email
    await sendConfirmationEmail(email, confirmationToken);

    return NextResponse.json(
      {
        message: "✅ User registered. Please check your email to confirm your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
