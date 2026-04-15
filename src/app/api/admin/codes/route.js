import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Code from "@/lib/models/Code";
import User from "@/lib/models/User";

function requireAdmin() {
  const s = getCurrentUser();
  return s?.role === "admin" ? s : null;
}

// GET /api/admin/codes?userId=&used=true|false&page=1
export async function GET(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const used   = searchParams.get("used");
    const page   = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit  = 50;

    const filter = {};
    if (userId) filter.userId = userId;
    if (used === "true")  filter.used = true;
    if (used === "false") filter.used = false;

    const [codes, total] = await Promise.all([
      Code.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Code.countDocuments(filter),
    ]);

    const userIds = [...new Set(codes.map(c => c.userId?.toString()).filter(Boolean))];
    const users   = await User.find({ _id: { $in: userIds } }).select("name email").lean();
    const userMap = {};
    users.forEach(u => (userMap[u._id.toString()] = u));

    const enriched = codes.map(c => ({
      ...c,
      owner: userMap[c.userId?.toString()] || null,
    }));

    return NextResponse.json({ codes: enriched, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/admin/codes — { codeId } or { userId, deleteAll:true }
export async function DELETE(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    await connectDB();
    const { codeId, userId, deleteAll } = await req.json();

    if (deleteAll && userId) {
      const r = await Code.deleteMany({ userId });
      return NextResponse.json({ success: true, deleted: r.deletedCount });
    }
    if (codeId) {
      await Code.findByIdAndDelete(codeId);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
