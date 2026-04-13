import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Entreprise from "@/lib/models/Entreprise";

// GET /api/entreprises/[slug] — public fetch by slug
export async function GET(req, { params }) {
  const { slug } = params;

  if (!slug) return NextResponse.json({ error: "Slug manquant" }, { status: 400 });

  try {
    await connectDB();
    const entreprise = await Entreprise.findOne({ slug: slug.toLowerCase(), active: true })
      .select("-userId -__v")
      .lean();

    if (!entreprise) {
      return NextResponse.json({ error: "Entreprise introuvable" }, { status: 404 });
    }

    // Track scan (fire-and-forget)
    Entreprise.updateOne({ _id: entreprise._id }, { $inc: { totalScans: 1 } }).catch(() => {});

    return NextResponse.json({ entreprise });
  } catch (err) {
    console.error("Fetch entreprise error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
