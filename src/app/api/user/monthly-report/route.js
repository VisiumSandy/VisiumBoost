import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Entreprise from "@/lib/models/Entreprise";
import Spin from "@/lib/models/Spin";
import User from "@/lib/models/User";
import { sendMonthlyReportEmail } from "@/lib/email";

export async function POST() {
  const session = getCurrentUser();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    await connectDB();

    const user = await User.findById(session.id).select("email name").lean();
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    const entreprises = await Entreprise.find({ userId: session.id }).lean();
    const ids = entreprises.map(e => e._id);

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [spins, validated] = await Promise.all([
      Spin.countDocuments({ entrepriseId: { $in: ids }, createdAt: { $gte: since } }),
      Spin.countDocuments({ entrepriseId: { $in: ids }, validated: true, createdAt: { $gte: since } }),
    ]);

    const totalScans = entreprises.reduce((s, e) => s + (e.totalScans || 0), 0);
    const conversionRate = spins > 0 ? Math.round((validated / spins) * 100) : 0;

    const month = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

    await sendMonthlyReportEmail({
      to: user.email,
      name: user.name?.split(" ")[0] || user.name,
      month,
      spins,
      validated,
      scans: totalScans,
      conversionRate,
    });

    return NextResponse.json({ success: true, email: user.email });
  } catch (err) {
    console.error("Monthly report error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
