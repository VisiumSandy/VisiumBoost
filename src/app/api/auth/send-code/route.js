import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { sendVerificationCodeEmail } from "@/lib/email";
import { sendCodeLimiter, getIp } from "@/lib/rateLimit";

// POST /api/auth/send-code
// body: { action: "change_email", newEmail }
//    or { action: "change_password", currentPassword, newPassword }
export async function POST(req) {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // Rate limit — 3 sends per 10 min per IP
  const ip = getIp(req);
  const limit = sendCodeLimiter.check(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${limit.retryAfter} secondes.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const { action, newEmail, currentPassword, newPassword } = await req.json();

  await connectDB();
  const user = await User.findById(session.id);
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  if (action === "change_email") {
    if (!newEmail || typeof newEmail !== "string") {
      return NextResponse.json({ error: "Nouvel email requis" }, { status: 400 });
    }
    const cleanEmail = newEmail.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
    }
    if (cleanEmail === user.email) {
      return NextResponse.json({ error: "C'est déjà votre email actuel" }, { status: 400 });
    }
    // Check if new email already in use
    const taken = await User.findOne({ email: cleanEmail });
    if (taken) return NextResponse.json({ error: "Cet email est déjà utilisé par un autre compte" }, { status: 409 });

    await User.updateOne({ _id: user._id }, {
      pendingCode: { code, action: "change_email", data: cleanEmail, expiresAt, attempts: 0 },
    });

    await sendVerificationCodeEmail({ to: user.email, name: user.name, code, action: "change_email" });
    return NextResponse.json({ ok: true, message: "Code envoyé à votre email actuel" });
  }

  if (action === "change_password") {
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Mot de passe actuel et nouveau requis" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Le nouveau mot de passe doit faire au moins 8 caractères" }, { status: 400 });
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });

    // Hash the new password now and store it pending verification
    const hashedNew = await bcrypt.hash(newPassword, 12);

    await User.updateOne({ _id: user._id }, {
      pendingCode: { code, action: "change_password", data: hashedNew, expiresAt, attempts: 0 },
    });

    await sendVerificationCodeEmail({ to: user.email, name: user.name, code, action: "change_password" });
    return NextResponse.json({ ok: true, message: "Code envoyé à votre email" });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
