"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { useApp } from "@/lib/context";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

export default function PageDashboard({ user }) {
  const { setCurrentPage } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/stats")
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {};
  const weekChart = s.weekChart || Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return { label: d.toLocaleDateString("fr-FR", { weekday: "short" }), count: 0 };
  });

  const firstName = user?.name?.split(" ")[0] || "là";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Bonjour, {firstName} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Voici l&apos;activité de vos établissements
        </p>
      </div>

      {/* Empty onboarding */}
      {!loading && (s.totalSpins ?? 0) === 0 && (
        <div style={{
          background: "linear-gradient(135deg, #EFF6FF, #F0F9FF)",
          border: "1.5px solid #BFDBFE",
          borderRadius: 16, padding: "20px 24px", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg, #3B82F6, #0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: 22 }}>🚀</span>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: "#1E40AF", margin: "0 0 3px", fontSize: 15 }}>
              Commencez par configurer votre roue
            </p>
            <p style={{ color: "#3B82F6", fontSize: 13, margin: 0 }}>
              Ajoutez un établissement, configurez la roue et partagez votre lien avec vos clients.{" "}
              <button
                onClick={() => setCurrentPage("clients")}
                style={{ color: "#2563EB", fontWeight: 700, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13 }}
              >
                Ajouter un établissement →
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Pending codes alert */}
      {!loading && (s.pendingSpins ?? 0) > 0 && (
        <div style={{
          background: "#FFFBEB", border: "1.5px solid #FDE68A",
          borderRadius: 16, padding: "14px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>⏳</div>
          <p style={{ fontWeight: 600, color: "#92400E", fontSize: 14, margin: 0 }}>
            <strong>{s.pendingSpins}</strong> code{s.pendingSpins > 1 ? "s" : ""} en attente de validation —{" "}
            <button
              onClick={() => setCurrentPage("codes")}
              style={{ color: "#B45309", fontWeight: 700, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 14 }}
            >
              Voir les validations →
            </button>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-7">
        <StatCard
          icon="qr"
          label="Scans de page"
          value={loading ? "—" : String(s.totalScans ?? 0)}
          color="#3B82F6"
        />
        <StatCard
          icon="wheel"
          label="Roues tournées"
          value={loading ? "—" : String(s.totalSpins ?? 0)}
          color="#0EA5E9"
        />
        <StatCard
          icon="check"
          label="Codes validés"
          value={loading ? "—" : String(s.validatedSpins ?? 0)}
          color="#10B981"
        />
        <StatCard
          icon="trendUp"
          label="Taux de retrait"
          value={loading ? "—" : `${s.conversionRate ?? 0}%`}
          color="#F59E0B"
        />
      </div>

      {/* Chart */}
      <div className="card p-6">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Activité — 7 derniers jours</h3>
            <p className="text-slate-400 text-[13px] mt-0.5">Nombre de roues tournées par jour</p>
          </div>
          <span style={{
            fontSize: 12, fontWeight: 600, color: "#2563EB",
            background: "#EFF6FF", padding: "4px 12px", borderRadius: 20,
          }}>
            Total : {s.totalSpins ?? 0}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={weekChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: "#94A3B8" }} />
            <YAxis axisLine={false} tickLine={false} style={{ fontSize: 11, fill: "#94A3B8" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 10, border: "1px solid #E2E8F0",
                fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
              formatter={(v) => [v, "Roues tournées"]}
              labelStyle={{ color: "#475569", fontWeight: 600 }}
            />
            <Area
              type="monotone" dataKey="count"
              stroke="#3B82F6" strokeWidth={2}
              fill="url(#gBlue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
