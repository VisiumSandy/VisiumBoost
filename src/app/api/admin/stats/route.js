import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Code from "@/lib/models/Code";
import Entreprise from "@/lib/models/Entreprise";

const PLAN_PRICES = { free: 9.99, starter: 29, pro: 79 };

export async function GET() {
  const session = getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    await connectDB();

    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const ago30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalClients,
      activeClients,
      planStats,
      totalCodes,
      usedCodes,
      totalEntreprises,
      activeEntreprises,
      recentSignups,
      paidCount,
      trialingCount,
      expiringSoon,
    ] = await Promise.all([
      User.countDocuments({ role: "client" }),
      User.countDocuments({ role: "client", active: true }),
      User.aggregate([
        { $match: { role: "client" } },
        { $group: { _id: "$plan", count: { $sum: 1 } } },
      ]),
      Code.countDocuments(),
      Code.countDocuments({ used: true }),
      Entreprise.countDocuments(),
      Entreprise.countDocuments({ active: true }),
      // Signups per day — 30 days
      User.aggregate([
        { $match: { role: "client", createdAt: { $gte: ago30 } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      // Paid subscribers (has active stripe subscription)
      User.countDocuments({ role: "client", stripeSubscriptionId: { $ne: null } }),
      // Active trials
      User.countDocuments({ role: "client", plan: "free", trialEndsAt: { $gt: now } }),
      // Trial expiring in 3 days
      User.find({
        role: "client",
        trialEndsAt: { $gt: now, $lte: in3Days },
      }).select("name email trialEndsAt").lean(),
    ]);

    const planMap = {};
    planStats.forEach(p => (planMap[p._id] = p.count));

    const monthlyRevenue = Object.entries(PLAN_PRICES).reduce(
      (sum, [plan, price]) => sum + (planMap[plan] || 0) * price,
      0
    );

    // Fill 30-day chart
    const signupChart = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      const found = recentSignups.find(r => r._id === key);
      signupChart.push({
        date: key,
        label: d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
        count: found?.count || 0,
      });
    }

    return NextResponse.json({
      totalClients,
      activeClients,
      inactiveClients: totalClients - activeClients,
      paidCount,
      trialingCount,
      totalEntreprises,
      activeEntreprises,
      plans: planMap,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      totalCodes,
      usedCodes,
      conversionRate: totalCodes > 0 ? Math.round((usedCodes / totalCodes) * 100) : 0,
      signupChart,
      expiringSoon,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
