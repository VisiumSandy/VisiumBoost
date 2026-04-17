import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const { email, password, name, businessName, phone } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Mot de passe trop court (min. 6 caractères)" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Un compte avec cet email existe déjà" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      name,
      businessName: businessName || name,
      phone: phone || "",
      role: "client",
      trialEndsAt,
    });

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });
    setAuthCookie(token);

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ to: user.email, name: user.name });

    return NextResponse.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role, plan: user.plan },
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
