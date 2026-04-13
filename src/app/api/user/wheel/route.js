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

  const config = await WheelConfig.findOneAndUpdate(
    { userId: session.id },
    { ...body, userId: session.id },
    { new: true, upsert: true }
  );
  return NextResponse.json({ config });
}
