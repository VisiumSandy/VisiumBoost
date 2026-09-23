import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Entreprise from "@/lib/models/Entreprise";

export async function GET(req) {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const placeId = (searchParams.get("placeId") || "").trim();
  if (!placeId) return NextResponse.json({ error: "placeId requis" }, { status: 400 });

  // Verify the place_id belongs to one of the user's entreprises
  await connectDB();
  const entreprises = await Entreprise.find({ userId: session.id }).select("lien_avis nom").lean();
  const owns = entreprises.some((e) => {
    try {
      return new URL(e.lien_avis || "").searchParams.get("placeid") === placeId;
    } catch { return false; }
  });
  if (!owns) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GOOGLE_PLACES_API_KEY non configurée." }, { status: 500 });

  try {
    // API Legacy : seule version qui propose reviews_sort=newest (vrai tri chronologique,
    // pas le tri "pertinence" de la New API).
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=name,rating,user_ratings_total,reviews` +
      `&reviews_sort=newest` +
      `&language=fr` +
      `&key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, { next: { revalidate: 0 } });
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: data.error_message || `Erreur API Google (${data.status}).`, detail: data.status },
        { status: 502 }
      );
    }

    const result = data.result || {};

    // Les champs legacy (author_name, author_url, profile_photo_url, rating, text, time,
    // relative_time_description) correspondent déjà 1:1 à ce qu'attend PageAvis.js.
    const reviews = (result.reviews || [])
      .slice()
      .sort((a, b) => (b.time || 0) - (a.time || 0));

    return NextResponse.json({
      name: result.name || "",
      rating: result.rating || null,
      totalRatings: result.user_ratings_total || 0,
      reviews,
    });
  } catch {
    return NextResponse.json({ error: "Erreur réseau." }, { status: 500 });
  }
}