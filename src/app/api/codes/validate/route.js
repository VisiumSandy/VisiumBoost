import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Code from "@/lib/models/Code";

export async function POST(req) {
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
    if (!record) return NextResponse.json({ valid: false, error: "Code invalide ou inexistant" });
    if (record.used) return NextResponse.json({ valid: false, error: "Code déjà utilisé" });

    await Code.updateOne({ _id: record._id }, { used: true, usedAt: new Date() });
    return NextResponse.json({ valid: true, code: normalized, message: "Code validé avec succès !" });
  } catch {
    return NextResponse.json({ valid: false, error: "Erreur serveur" }, { status: 500 });
  }
}
