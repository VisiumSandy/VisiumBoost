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
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr`;

    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
      },
      next: { revalidate: 0 },
    });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Erreur API Google.", detail: data?.error?.status || "" },
        { status: res.status }
      );
    }

    // L'API New ne propose plus reviews_sort=newest : on trie nous-mêmes
    // parmi les (au plus 5) avis renvoyés par Google.
    const reviews = (data.reviews || [])
      .slice()
      .sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
      .map((r) => ({
        author_name: r.authorAttribution?.displayName || "Anonyme",
        author_url: r.authorAttribution?.uri || "",
        profile_photo_url: r.authorAttribution?.photoUri || "",
        rating: r.rating,
        text: r.text?.text || r.originalText?.text || "",
        time: r.publishTime ? Math.floor(new Date(r.publishTime).getTime() / 1000) : null,
        relative_time_description: r.relativePublishTimeDescription || "",
      }));

    return NextResponse.json({
      name: data.displayName?.text || "",
      rating: data.rating || null,
      totalRatings: data.userRatingCount || 0,
      reviews,
    });
  } catch {
    return NextResponse.json({ error: "Erreur réseau." }, { status: 500 });
  }
}