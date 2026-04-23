import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Code from "@/lib/models/Code";
import User from "@/lib/models/User";
import { validateCodeLimiter, getIp } from "@/lib/rateLimit";
import { logCodeValidated, logRateLimit, logSecurityEvent } from "@/lib/discord";
import { sendCodeValidatedEmail } from "@/lib/email";

export async function POST(req) {
  // Rate limiting — 10 validations per IP per minute
  const ip = getIp(req);
  const limit = validateCodeLimiter.check(ip);
  if (!limit.allowed) {
    logRateLimit({ route: "/api/codes/validate", ip });
    return NextResponse.json(
      { valid: false, error: `Trop de tentatives. Réessayez dans ${limit.retryAfter} secondes.` },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
      }
    );
  }

  const { code, userId } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ valid: false, error: "Code manquant ou invalide" }, { status: 400 });
  }

  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalized)) {
    return NextResponse.json({ valid: false, error: "Format de code invalide" }, { status: 400 });
  }

  try {
    await connectDB();
    const filter = { code: normalized };
    if (userId) filter.userId = userId;

    const record = await Code.findOne(filter);
    if (!record) {
      logSecurityEvent({ event: "Code invalide", detail: `Code tenté : \`${normalized}\``, ip });
      return NextResponse.json({ valid: false, error: "Code invalide ou inexistant" });
    }
    if (record.used) return NextResponse.json({ valid: false, error: "Code déjà utilisé" });

    await Code.updateOne({ _id: record._id }, { used: true, usedAt: new Date() });

    // Log to Discord (non-blocking)
    try {
      const ownerForLog = await User.findById(record.userId).select("businessName name").lean();
      logCodeValidated({ code: normalized, businessName: ownerForLog?.businessName || ownerForLog?.name || "—" });
    } catch {}

    // Send notification email to the business owner (non-blocking)
    try {
      const owner = await User.findById(record.userId).lean();
      if (owner?.email) {
        sendCodeValidatedEmail({
          to: owner.email,
          businessName: owner.businessName || owner.name,
          code: normalized,
        });
      }
    } catch (emailErr) {
      console.error("[validate] Failed to send notification email:", emailErr);
    }

    return NextResponse.json({ valid: true, code: normalized, message: "Code validé avec succès !" });
  } catch {
    return NextResponse.json({ valid: false, error: "Erreur serveur" }, { status: 500 });
  }
}
