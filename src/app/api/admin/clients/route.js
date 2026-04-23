import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Code from "@/lib/models/Code";
import Entreprise from "@/lib/models/Entreprise";
import { logAdminAction } from "@/lib/discord";

function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

// GET /api/admin/clients — list all clients
export async function GET(req) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") || "";
    const plan = searchParams.get("plan") || "";

    const filter = { role: "client" };
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 100);
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
        { businessName: { $regex: escaped, $options: "i" } },
      ];
    }
    const VALID_PLANS = ["free", "starter", "pro"];
    if (plan && VALID_PLANS.includes(plan)) filter.plan = plan;

    const clients = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ clients });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/admin/clients — update client plan/status
export async function PATCH(req) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    await connectDB();
    const { userId, plan, active, name, email, businessName, phone, googleLink, trialEndsAt, renewTrial } = await req.json();

    if (!userId || typeof userId !== "string" || userId.length > 100) {
      return NextResponse.json({ error: "userId invalide" }, { status: 400 });
    }

    const VALID_PLANS = ["free", "starter", "pro"];
    const update = {};
    if (plan         !== undefined) {
      if (!VALID_PLANS.includes(plan)) return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
      update.plan = plan;
    }
    if (active       !== undefined) update.active       = Boolean(active);
    if (name         !== undefined) update.name         = String(name).slice(0, 100);
    if (email        !== undefined) update.email        = String(email).toLowerCase().trim().slice(0, 200);
    if (businessName !== undefined) update.businessName = String(businessName).slice(0, 100);
    if (phone        !== undefined) update.phone        = String(phone).slice(0, 30);
    if (googleLink   !== undefined) update.googleLink   = String(googleLink).slice(0, 500);
    if (trialEndsAt  !== undefined) update.trialEndsAt  = trialEndsAt ? new Date(trialEndsAt) : null;
    if (renewTrial) update.trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password");
    logAdminAction({ admin: admin.email, action: `Mise à jour : ${Object.keys(update).join(", ")}`, target: user?.email || userId });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/admin/clients — delete a client
export async function DELETE(req) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  try {
    await connectDB();
    const { userId } = await req.json();
    const target = await User.findById(userId).select("email name").lean();
    await User.findByIdAndDelete(userId);
    await Code.deleteMany({ userId });
    await Entreprise.deleteMany({ userId });
    logAdminAction({ admin: admin.email, action: "Suppression compte", target: target?.email || userId });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
