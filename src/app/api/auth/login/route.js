import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { logLogin, logSecurityEvent } from "@/lib/discord";

// Seed admin — creates if missing, always syncs password with env var
async function ensureAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return;

  const hashed = await bcrypt.hash(adminPassword, 12);
  const exists = await User.findOne({ email: adminEmail });

  if (!exists) {
    await User.create({
      email: adminEmail,
      password: hashed,
      name: "Admin VisiumBoost",
      role: "admin",
      plan: "pro",
      businessName: "VisiumBoost HQ",
    });
    console.log("[VisiumBoost] Admin account created:", adminEmail);
  } else {
    // Always sync password so changing ADMIN_PASSWORD in env takes effect immediately
    await User.updateOne({ email: adminEmail }, { password: hashed });
  }
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    await connectDB();
    await ensureAdmin();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    if (!user.active) {
      return NextResponse.json({ error: "Compte désactivé. Contactez le support." }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      logSecurityEvent({ event: "Mot de passe incorrect", detail: `Email : ${email}` });
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    // Update last login
    await User.updateOne({ _id: user._id }, { lastLogin: new Date() });

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });
    setAuthCookie(token);

    await logLogin({ name: user.name, email: user.email, role: user.role });

    return NextResponse.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role, plan: user.plan },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
