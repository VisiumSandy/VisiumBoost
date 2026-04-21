import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Entreprise from "@/lib/models/Entreprise";
import Spin from "@/lib/models/Spin";
import { spinLimiter, getIp } from "@/lib/rateLimit";

// Génère un code gagnant unique format WIN-XXXX-XXXX
function generateWinCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `WIN-${rand(4)}-${rand(4)}`;
}

// POST /api/play/spin
// Appelé par le client final après que la roue a tourné côté client
// body: { slug, rewardName, rewardIndex }
// Retourne: { winCode, rewardName }
export async function POST(req) {
  try {
    // Rate limiting — 20 spins per IP per minute
    const ip = getIp(req);
    const limit = spinLimiter.check(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Trop de requêtes. Réessayez dans ${limit.retryAfter} secondes.` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const { slug, rewardName, rewardIndex, clientName, clientEmail, clientPhone } = await req.json();

    if (!slug || typeof slug !== "string" || !rewardName || typeof rewardName !== "string") {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    await connectDB();

    const entreprise = await Entreprise.findOne({ slug: slug.toLowerCase().slice(0, 100), active: true });
    if (!entreprise) {
      return NextResponse.json({ error: "Entreprise introuvable" }, { status: 404 });
    }

    // Validate rewardName is one of the configured rewards
    const validRewardNames = (entreprise.rewards || []).map(r => r.name);
    if (validRewardNames.length > 0 && !validRewardNames.includes(rewardName)) {
      return NextResponse.json({ error: "Récompense invalide" }, { status: 400 });
    }

    // Générer un code unique (retry si collision)
    let winCode, tries = 0;
    do {
      winCode = generateWinCode();
      tries++;
    } while (tries < 10 && (await Spin.exists({ winCode })));

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";

    const spin = await Spin.create({
      entrepriseId: entreprise._id,
      winCode,
      rewardName,
      rewardIndex: rewardIndex ?? 0,
      clientName:  (clientName  || "").slice(0, 100),
      clientEmail: (clientEmail || "").slice(0, 200),
      clientPhone: (clientPhone || "").slice(0, 30),
      ip: ip.split(",")[0].trim(),
    });

    // Incrémenter le compteur de scans
    await Entreprise.updateOne({ _id: entreprise._id }, { $inc: { totalScans: 1 } });

    return NextResponse.json({ winCode: spin.winCode, rewardName: spin.rewardName });
  } catch (err) {
    console.error("Spin error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
