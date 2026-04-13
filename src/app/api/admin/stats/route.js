import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Code from "@/lib/models/Code";

export async function GET() {
  const session = getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    await connectDB();

    const [
      totalClients,
      activeClients,
      planStats,
      totalCodes,
      usedCodes,
      recentSignups,
    ] = await Promise.all([
      User.countDocuments({ role: "client" }),
      User.countDocuments({ role: "client", active: true }),
      User.aggregate([
        { $match: { role: "client" } },
        { $group: { _id: "$plan", count: { $sum: 1 } } },
      ]),
      Code.countDocuments(),
      Code.countDocuments({ used: true }),
      // Signups per day for last 30 days
      User.aggregate([
        {
          $match: {
            role: "client",
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Revenue calculation (mock pricing)
    const PLAN_PRICES = { free: 0, starter: 29, pro: 79 };
    const planMap = {};
    planStats.forEach((p) => (planMap[p._id] = p.count));
    const monthlyRevenue = Object.entries(PLAN_PRICES).reduce(
      (sum, [plan, price]) => sum + (planMap[plan] || 0) * price,
      0
    );

    // Fill in missing days for chart
    const signupChart = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      const found = recentSignups.find((r) => r._id === key);
      const label = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      signupChart.push({ date: key, label, count: found ? found.count : 0 });
    }

    return NextResponse.json({
      totalClients,
      activeClients,
      inactiveClients: totalClients - activeClients,
      plans: planMap,
      monthlyRevenue,
      totalCodes,
      usedCodes,
      conversionRate: totalCodes > 0 ? Math.round((usedCodes / totalCodes) * 100) : 0,
      signupChart,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
