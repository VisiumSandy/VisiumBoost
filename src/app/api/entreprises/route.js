import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Entreprise from "@/lib/models/Entreprise";

// GET — list current user's entreprises
export async function GET() {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  await connectDB();
  const entreprises = await Entreprise.find({ userId: session.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ entreprises });
}

// POST — create entreprise
export async function POST(req) {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { slug, nom, logo, couleur_principale, couleur_secondaire, lien_avis, cta_text, rewards } = body;

  if (!slug || !nom) return NextResponse.json({ error: "slug et nom sont requis" }, { status: 400 });

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets" }, { status: 400 });
  }

  try {
    await connectDB();

    const exists = await Entreprise.findOne({ slug });
    if (exists) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé. Choisissez-en un autre." }, { status: 409 });
    }

    const entreprise = await Entreprise.create({
      userId: session.id,
      slug,
      nom,
      logo: logo || "",
      couleur_principale: couleur_principale || "#3B82F6",
      couleur_secondaire: couleur_secondaire || "#0EA5E9",
      lien_avis: lien_avis || "",
      cta_text: cta_text || "Laissez-nous un avis et tentez votre chance !",
      rewards: rewards || undefined,
    });

    return NextResponse.json({ entreprise }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé." }, { status: 409 });
    }
    console.error("Entreprise create error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH — update entreprise
export async function PATCH(req) {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { id } = body;
  await connectDB();

  // Ensure user owns this entreprise
  const existing = await Entreprise.findOne({ _id: id, userId: session.id });
  if (!existing) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  // Whitelist updatable fields — never allow userId, totalScans, totalReviews, _id
  const ALLOWED_FIELDS = [
    "nom", "slug", "logo", "couleur_principale", "couleur_secondaire",
    "lien_avis", "cta_text", "rewards", "active", "theme",
    "wheel_segment_colors", "wheel_border_color", "wheel_center_color",
    "wheel_center_logo", "wheel_font", "wheel_size",
    "page_bg", "page_bg_type", "page_bg_gradient", "page_banner",
    "page_title", "page_welcome", "page_btn_color", "page_btn_text",
    "page_thanks", "page_text_color",
  ];
  const updates = {};
  ALLOWED_FIELDS.forEach(f => { if (body[f] !== undefined) updates[f] = body[f]; });

  // If changing slug, validate format and uniqueness
  if (updates.slug && updates.slug !== existing.slug) {
    if (!/^[a-z0-9-]+$/.test(updates.slug)) {
      return NextResponse.json({ error: "Slug invalide" }, { status: 400 });
    }
    const conflict = await Entreprise.findOne({ slug: updates.slug });
    if (conflict) return NextResponse.json({ error: "Ce slug est déjà utilisé." }, { status: 409 });
  }

  const updated = await Entreprise.findByIdAndUpdate(id, { $set: updates }, { new: true, lean: true });

  return NextResponse.json({ entreprise: updated });
}

// DELETE — delete entreprise
export async function DELETE(req) {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await req.json();
  await connectDB();

  const existing = await Entreprise.findOne({ _id: id, userId: session.id });
  if (!existing) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await Entreprise.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
