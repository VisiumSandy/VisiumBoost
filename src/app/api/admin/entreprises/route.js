import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Entreprise from "@/lib/models/Entreprise";
import User from "@/lib/models/User";
import Code from "@/lib/models/Code";

function requireAdmin() {
  const s = getCurrentUser();
  return s?.role === "admin" ? s : null;
}

// GET /api/admin/entreprises?userId=&q=
export async function GET(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const search = searchParams.get("q") || "";

    const filter = {};
    if (userId) filter.userId = userId;
    if (search) filter.$or = [
      { nom: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];

    const entreprises = await Entreprise.find(filter).sort({ createdAt: -1 }).lean();

    const userIds = [...new Set(entreprises.map(e => e.userId?.toString()).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } }).select("name email plan").lean();
    const userMap = {};
    users.forEach(u => (userMap[u._id.toString()] = u));

    const enriched = entreprises.map(e => ({
      ...e,
      owner: userMap[e.userId?.toString()] || null,
    }));

    return NextResponse.json({ entreprises: enriched });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/admin/entreprises
export async function PATCH(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    await connectDB();
    const { entrepriseId, ...update } = await req.json();

    const allowed = ["nom", "slug", "couleur_principale", "couleur_secondaire", "lien_avis", "cta_text", "active", "rewards", "logo"];
    const filtered = {};
    allowed.forEach(f => { if (update[f] !== undefined) filtered[f] = update[f]; });

    const ent = await Entreprise.findByIdAndUpdate(entrepriseId, filtered, { new: true }).lean();
    return NextResponse.json({ entreprise: ent });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/admin/entreprises — deletes entreprise (codes stay, belong to user)
export async function DELETE(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    await connectDB();
    const { entrepriseId } = await req.json();
    await Entreprise.findByIdAndDelete(entrepriseId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
