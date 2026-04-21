import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import WheelConfig from "@/lib/models/WheelConfig";

// GET — get wheel config
export async function GET() {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  await connectDB();
  let config = await WheelConfig.findOne({ userId: session.id });
  if (!config) {
    config = await WheelConfig.create({ userId: session.id });
  }
  return NextResponse.json({ config });
}

// PUT — update wheel config
export async function PUT(req) {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  await connectDB();

  // Whitelist allowed fields — never allow userId to be overwritten
  const { googleLink, primaryColor, secondaryColor, ctaText, logoUrl, rewards } = body;
  const safeUpdate = { userId: session.id };
  if (googleLink    !== undefined) safeUpdate.googleLink    = String(googleLink).slice(0, 500);
  if (primaryColor  !== undefined) safeUpdate.primaryColor  = String(primaryColor).slice(0, 20);
  if (secondaryColor !== undefined) safeUpdate.secondaryColor = String(secondaryColor).slice(0, 20);
  if (ctaText       !== undefined) safeUpdate.ctaText       = String(ctaText).slice(0, 300);
  if (logoUrl       !== undefined) safeUpdate.logoUrl       = String(logoUrl).slice(0, 500);
  if (rewards       !== undefined) safeUpdate.rewards       = rewards;

  const config = await WheelConfig.findOneAndUpdate(
    { userId: session.id },
    safeUpdate,
    { new: true, upsert: true }
  );
  return NextResponse.json({ config });
}
