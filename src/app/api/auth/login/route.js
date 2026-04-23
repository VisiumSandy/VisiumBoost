import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { loginLimiter, getIp } from "@/lib/rateLimit";
import { logLogin, logRateLimit, logSecurityEvent } from "@/lib/discord";

// Seed admin on first call if needed
async function ensureAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return;

  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await User.create({
      email: adminEmail,
      password: hashed,
      name: "Admin VisiumBoost",
      role: "admin",
      plan: "pro",
      businessName: "VisiumBoost HQ",
    });
    console.log("[VisiumBoost] Admin account created:", adminEmail);
  }
}

export async function POST(req) {
  try {
    // Rate limiting — 5 attempts per IP per 15 minutes
    const ip = getIp(req);
    const limit = loginLimiter.check(ip);
    if (!limit.allowed) {
      logRateLimit({ route: "/api/auth/login", ip });
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${limit.retryAfter} secondes.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(limit.retryAfter),
            "X-RateLimit-Reset": String(limit.resetAt),
          },
        }
      );
    }

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
      logSecurityEvent({ event: "Mot de passe incorrect", detail: `Email : ${email}`, ip });
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    // Update last login
    await User.updateOne({ _id: user._id }, { lastLogin: new Date() });

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });
    setAuthCookie(token);

    // Log to Discord (non-blocking)
    logLogin({ name: user.name, email: user.email, role: user.role });

    return NextResponse.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role, plan: user.plan },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
