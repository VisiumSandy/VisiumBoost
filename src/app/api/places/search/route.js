import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_PLACES_API_KEY non configurée dans les variables d'environnement." }, { status: 500 });
  }

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/textsearch/json` +
      `?query=${encodeURIComponent(q)}&key=${apiKey}&language=fr`;

    const res = await fetch(url, { next: { revalidate: 0 } });
    const data = await res.json();

    if (data.status === "REQUEST_DENIED") {
      return NextResponse.json({ error: "Clé API Google invalide ou non autorisée." }, { status: 400 });
    }

    const results = (data.results || []).slice(0, 6).map((p) => ({
      placeId: p.place_id,
      name: p.name,
      address: p.formatted_address,
      rating: p.rating,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la recherche." }, { status: 500 });
  }
}
