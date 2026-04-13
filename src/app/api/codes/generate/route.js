import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Code from "@/lib/models/Code";
import { generateCode } from "@/lib/utils";

export async function POST(req) {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const n = Math.min(Math.max(1, parseInt(body.count || 10)), 100);

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
  return NextResponse.json({ success: true, codes: created, count: created.length });
}
