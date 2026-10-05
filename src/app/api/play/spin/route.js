import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Entreprise from "@/lib/models/Entreprise";
import Spin from "@/lib/models/Spin";
import { spinLimiter, getIp } from "@/lib/rateLimit";
import { logSpin, logRateLimit, logServerError } from "@/lib/discord";

const IP_WINDOW_MS = 24 * 60 * 60 * 1000;         // fenêtre du plafond par IP
const VALIDITY_MS = 30 * 24 * 60 * 60 * 1000;     // lot valable 30 jours
const MAX_SPINS_PER_IP = 10;                      // plafond par IP / 24 h : un wifi de commerce est partagé

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
      logRateLimit({ route: "/api/play/spin", ip });
      return NextResponse.json(
        { error: `Trop de requêtes. Réessayez dans ${limit.retryAfter} secondes.` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const { slug, rewardName, rewardIndex, clientName, clientEmail, clientPhone, deviceId: rawDeviceId } = await req.json();
    const deviceId = typeof rawDeviceId === "string" && /^[A-Za-z0-9-]{8,64}$/.test(rawDeviceId) ? rawDeviceId : "";

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

    // Anti-rejeu : une seule partie par appareil et par entreprise (+ plafond par IP sur 24 h en filet de sécurité)
    const since = new Date(Date.now() - IP_WINDOW_MS);
    const [lastByDevice, countByIp] = await Promise.all([
      deviceId
        ? Spin.findOne({ entrepriseId: entreprise._id, deviceId }).select("_id").lean()
        : null,
      ip && ip !== "unknown"
        ? Spin.countDocuments({ entrepriseId: entreprise._id, ip, createdAt: { $gte: since } })
        : 0,
    ]);
    if (lastByDevice || countByIp >= MAX_SPINS_PER_IP) {
      return NextResponse.json(
        { error: "Vous avez déjà joué.", code: "ALREADY_PLAYED" },
        { status: 429 }
      );
    }

    // Générer un code unique (retry si collision)
    let winCode, tries = 0;
    do {
      winCode = generateWinCode();
      tries++;
    } while (tries < 10 && (await Spin.exists({ winCode })));

    const spin = await Spin.create({
      entrepriseId: entreprise._id,
      winCode,
      rewardName,
      rewardIndex: rewardIndex ?? 0,
      clientName:  (clientName  || "").slice(0, 100),
      clientEmail: (clientEmail || "").slice(0, 200),
      clientPhone: (clientPhone || "").slice(0, 30),
      ip,
      deviceId,
      expiresAt: new Date(Date.now() + VALIDITY_MS),
    });

    // Incrémenter le compteur de scans + log Discord (awaited before response)
    await Promise.all([
      Entreprise.updateOne({ _id: entreprise._id }, { $inc: { totalScans: 1 } }),
      logSpin({
        nom:         entreprise.nom,
        slug,
        rewardName,
        winCode:     spin.winCode,
        clientName:  spin.clientName  || null,
        clientEmail: spin.clientEmail || null,
        clientPhone: spin.clientPhone || null,
      }),
    ]);

    return NextResponse.json({ winCode: spin.winCode, rewardName: spin.rewardName });
  } catch (err) {
    console.error("Spin error:", err);
    logServerError({ route: "/api/play/spin", message: err.message });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
