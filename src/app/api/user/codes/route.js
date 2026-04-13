import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Code from "@/lib/models/Code";
import { generateCode } from "@/lib/utils";

// GET — list user's codes
export async function GET() {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  await connectDB();
  const codes = await Code.find({ userId: session.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ codes });
}

// POST — generate codes
export async function POST(req) {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { count = 10 } = await req.json().catch(() => ({}));
  const n = Math.min(Math.max(1, parseInt(count)), 100);

  await connectDB();

  const newCodes = [];
  for (let i = 0; i < n; i++) {
    let code, tries = 0;
    do {
      code = generateCode();
      tries++;
    } while (tries < 10 && (await Code.exists({ code })));

    newCodes.push({ userId: session.id, code });
  }

  const created = await Code.insertMany(newCodes);
  return NextResponse.json({ codes: created });
}
