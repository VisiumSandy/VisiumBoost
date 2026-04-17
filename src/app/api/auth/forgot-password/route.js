import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to avoid user enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await User.updateOne(
      { _id: user._id },
      { resetToken: token, resetTokenExpiry: expiry }
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://visium-boost.fr";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
