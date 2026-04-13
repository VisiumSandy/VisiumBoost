import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Code from "@/lib/models/Code";

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
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } },
      ];
    }
    if (plan) filter.plan = plan;

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
    const { userId, plan, active } = await req.json();
    const update = {};
    if (plan !== undefined) update.plan = plan;
    if (active !== undefined) update.active = active;

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password");
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
    await User.findByIdAndDelete(userId);
    await Code.deleteMany({ userId });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
