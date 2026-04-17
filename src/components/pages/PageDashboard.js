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
      {/* Header — hidden on mobile (AppShell shows the page title there) */}
      <div className="hidden md:block mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Bonjour, {firstName} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Voici l&apos;activité de vos établissements
        </p>
      </div>

      {/* Empty state onboarding — shown when user has never spun the wheel */}
      {!loading && (s.totalSpins ?? 0) === 0 && (
        <div style={{
          background: "#fff",
          border: "1.5px solid #E2E8F0",
          borderRadius: 20,
          padding: "32px 28px 28px",
          marginBottom: 28,
          boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
              border: "1px solid #BFDBFE", borderRadius: 20,
              padding: "4px 14px", marginBottom: 14,
            }}>
              <span style={{ fontSize: 14 }}>👋</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", letterSpacing: "0.5px" }}>
                Bienvenue, {firstName} !
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: "0 0 6px", letterSpacing: "-0.3px" }}>
              3 étapes pour récupérer vos premiers avis
            </h2>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, lineHeight: 1.6 }}>
              Suivez ce guide pour mettre en place votre roue en moins de 5 minutes.
            </p>
          </div>

          {/* Steps */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
            marginBottom: 24,
          }}>
            {[
              {
                step: "1",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                ),
                color: "#EFF6FF",
                borderColor: "#BFDBFE",
                iconBg: "#DBEAFE",
                title: "Créez votre roue",
                desc: "Ajoutez votre établissement et configurez les récompenses.",
                action: "clients",
                cta: "Ajouter un établissement →",
              },
              {
                step: "2",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <rect x="14" y="14" width="3" height="3"/>
                  </svg>
                ),
                color: "#F0F9FF",
                borderColor: "#BAE6FD",
                iconBg: "#E0F2FE",
                title: "Imprimez l'affiche QR",
                desc: "Générez votre QR code et affichez-le en caisse.",
                action: "wheel",
                cta: "Configurer la roue →",
              },
              {
                step: "3",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ),
                color: "#F0FDF4",
                borderColor: "#BBF7D0",
                iconBg: "#DCFCE7",
                title: "Récoltez vos avis",
                desc: "Vos clients scannent, tournent et laissent un avis Google.",
                action: null,
                cta: null,
              },
            ].map(({ step, icon, color, borderColor, iconBg, title, desc, action, cta }) => (
              <div key={step} style={{
                background: color,
                border: `1.5px solid ${borderColor}`,
                borderRadius: 14,
                padding: "18px 16px",
                position: "relative",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, color: "#94A3B8",
                        letterSpacing: "1px", textTransform: "uppercase",
                      }}>
                        Étape {step}
                      </span>
                    </div>
                    <p style={{ fontWeight: 700, color: "#0F172A", margin: "0 0 4px", fontSize: 14 }}>
                      {title}
                    </p>
                    <p style={{ color: "#64748B", fontSize: 12, margin: "0 0 10px", lineHeight: 1.5 }}>
                      {desc}
                    </p>
                    {cta && action && (
                      <button
                        onClick={() => setCurrentPage(action)}
                        style={{
                          background: "none", border: "none", padding: 0,
                          color: "#2563EB", fontWeight: 700, fontSize: 12,
                          cursor: "pointer", textDecoration: "none",
                          fontFamily: "inherit",
                        }}
                      >
                        {cta}
                      </button>
                    )}
                    {!cta && (
                      <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>
                        Automatique ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => setCurrentPage("wheel")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
              color: "#fff", border: "none",
              padding: "12px 24px", borderRadius: 12,
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
            }}
          >
            Commencer
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
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
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 mb-6">
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
      <div className="card p-4 md:p-6">
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
        <ResponsiveContainer width="100%" height={200}>
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
