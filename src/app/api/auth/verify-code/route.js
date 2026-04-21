import { NextResponse } from "next/server";
import { getCurrentUser, signToken, setAuthCookie } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

// POST /api/auth/verify-code
// body: { action: "change_email" | "change_password", code }
export async function POST(req) {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { action, code } = await req.json();

  if (!code || typeof code !== "string" || !/^\d{6}$/.test(code.trim())) {
    return NextResponse.json({ error: "Code invalide (6 chiffres attendus)" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findById(session.id);
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const pending = user.pendingCode;

  if (!pending?.code || pending.action !== action) {
    return NextResponse.json({ error: "Aucun code en attente pour cette action" }, { status: 400 });
  }
  if (new Date() > pending.expiresAt) {
    await User.updateOne({ _id: user._id }, { "pendingCode.code": null });
    return NextResponse.json({ error: "Le code a expiré. Refaites la demande." }, { status: 410 });
  }
  if (pending.attempts >= 5) {
    await User.updateOne({ _id: user._id }, { "pendingCode.code": null });
    return NextResponse.json({ error: "Trop de tentatives. Refaites la demande." }, { status: 429 });
  }

  if (code.trim() !== pending.code) {
    await User.updateOne({ _id: user._id }, { $inc: { "pendingCode.attempts": 1 } });
    const remaining = 4 - pending.attempts;
    return NextResponse.json(
      { error: `Code incorrect. ${remaining} tentative${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}.` },
      { status: 401 }
    );
  }

  // Code is correct — apply the change
  if (action === "change_email") {
    const newEmail = pending.data;
    // Double-check the new email isn't already taken (race condition guard)
    const taken = await User.findOne({ email: newEmail, _id: { $ne: user._id } });
    if (taken) {
      await User.updateOne({ _id: user._id }, { "pendingCode.code": null });
      return NextResponse.json({ error: "Cet email est déjà utilisé par un autre compte" }, { status: 409 });
    }
    await User.updateOne({ _id: user._id }, {
      email: newEmail,
      "pendingCode.code": null,
    });
    // Re-issue JWT with new email
    const newToken = signToken({ id: user._id.toString(), email: newEmail, role: user.role, name: user.name });
    setAuthCookie(newToken);
    return NextResponse.json({ ok: true, message: "Email mis à jour avec succès", newEmail });
  }

  if (action === "change_password") {
    await User.updateOne({ _id: user._id }, {
      password: pending.data,
      "pendingCode.code": null,
    });
    return NextResponse.json({ ok: true, message: "Mot de passe mis à jour avec succès" });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
