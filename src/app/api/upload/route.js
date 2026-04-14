import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";

const VALID_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_BYTES   = 2 * 1024 * 1024; // 2 Mo

// POST /api/upload
// Body: multipart/form-data — champ "file"
// Retourne: { url }
export async function POST(req) {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  let file;
  try {
    const formData = await req.formData();
    file = formData.get("file");
  } catch {
    return NextResponse.json({ error: "Impossible de lire le formulaire" }, { status: 400 });
  }

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  if (!VALID_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG, WebP, GIF ou SVG." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Fichier trop lourd (max 2 Mo)" }, { status: 400 });
  }

  try {
    const blob = await put(`logos/${Date.now()}-${file.name}`, file, {
      access: "public",
      token:  process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Vercel Blob upload error:", err);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
