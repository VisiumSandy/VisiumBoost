"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const FONT = "'DM Sans', system-ui, sans-serif";

function KPI({ icon, label, value, sub, color, big }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1.5px solid #F1F5F9",
      padding: big ? "20px 22px" : "18px 20px",
      display: "flex", flexDirection: "column", gap: 10,
      flex: 1, minWidth: 180,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={icon} size={18} color={color} />
      </div>
      <div>
        <div style={{ fontSize: big ? 28 : 24, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "#CBD5E1", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: "1px solid #E2E8F0",
  fontSize: 13,
  fontFamily: FONT,
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

export default function PageStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("30d"); // "7d" | "30d"

  useEffect(() => {
    fetch("/api/user/stats")
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {};
  const chart = view === "7d" ? (s.weekChart || []) : (s.monthChart || []);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ flex: 1, minWidth: 180, height: 116, background: "#F8FAFC", borderRadius: 16, border: "1.5px solid #F1F5F9" }} />
          ))}
        </div>
        <div style={{ height: 300, background: "#F8FAFC", borderRadius: 16 }} />
      </div>
    );
  }

  const totalSpins    = s.totalSpins ?? 0;
  const validatedSpins = s.validatedSpins ?? 0;
  const totalScans    = s.totalScans ?? 0;
  const convRate      = s.conversionRate ?? 0;
  const bestDay       = s.bestDay ?? null;
  const perEntreprise = s.perEntreprise ?? [];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Statistiques</h1>
        <p className="text-slate-400 text-sm mt-1">Vue globale de vos performances</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
        <KPI icon="qr"       label="Scans de page (total)"    value={totalScans.toLocaleString("fr-FR")}   color="#3B82F6" />
        <KPI icon="wheel"    label="Roues tournées (total)"   value={totalSpins.toLocaleString("fr-FR")}   color="#8B5CF6" />
        <KPI icon="check"    label="Avis générés (validés)"   value={validatedSpins.toLocaleString("fr-FR")} color="#10B981" />
        <KPI icon="trendUp"  label="Taux de conversion"       value={`${convRate}%`}                        color="#F59E0B" />
      </div>

      {/* Best day callout */}
      {bestDay && (
        <div style={{
          background: "linear-gradient(135deg, #EFF6FF, #F0F9FF)",
          border: "1.5px solid #BFDBFE",
          borderRadius: 14, padding: "14px 20px",
          display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: "linear-gradient(135deg,#3B82F6,#0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon name="star" size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: 1 }}>
              Meilleure journée
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1E3A5F", marginTop: 2 }}>
              {bestDay.label} — <span style={{ color: "#2563EB" }}>{bestDay.count} roue{bestDay.count > 1 ? "s" : ""} tournée{bestDay.count > 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="card p-6 mb-6">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Activité — roues tournées</h3>
            <p className="text-slate-400 text-[13px] mt-0.5">Évolution sur la période sélectionnée</p>
          </div>
          <div style={{ display: "flex", gap: 0, borderRadius: 9, overflow: "hidden", border: "1.5px solid #E2E8F0" }}>
            {[["7d", "7 jours"], ["30d", "30 jours"]].map(([k, lbl]) => (
              <button
                key={k}
                onClick={() => setView(k)}
                style={{
                  padding: "6px 14px", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                  background: view === k ? "#2563EB" : "#fff",
                  color: view === k ? "#fff" : "#64748B",
                  transition: "all 0.15s",
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          {view === "30d" ? (
            <BarChart data={chart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false} tickLine={false}
                style={{ fontSize: 11, fill: "#94A3B8" }}
                interval={4}
              />
              <YAxis axisLine={false} tickLine={false} style={{ fontSize: 11, fill: "#94A3B8" }} allowDecimals={false} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v) => [v, "Roues"]}
                labelStyle={{ color: "#475569", fontWeight: 600 }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={chart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gBlue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: "#94A3B8" }} />
              <YAxis axisLine={false} tickLine={false} style={{ fontSize: 11, fill: "#94A3B8" }} allowDecimals={false} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v) => [v, "Roues tournées"]}
                labelStyle={{ color: "#475569", fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} fill="url(#gBlue2)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Per-établissement */}
      {perEntreprise.length > 0 && (
        <div className="card overflow-hidden">
          <div style={{ padding: "14px 20px", borderBottom: "1.5px solid #F1F5F9" }}>
            <h3 className="text-sm font-semibold text-slate-700">Par établissement</h3>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr repeat(3, 100px)",
            padding: "9px 20px",
            borderBottom: "1.5px solid #F1F5F9",
            fontSize: 11, fontWeight: 700, color: "#94A3B8",
            textTransform: "uppercase", letterSpacing: 0.8,
            background: "#FAFAFA",
          }}>
            <div>Établissement</div>
            <div style={{ textAlign: "center" }}>Scans</div>
            <div style={{ textAlign: "center" }}>Avis validés</div>
            <div style={{ textAlign: "center" }}>Conversion</div>
          </div>
          {perEntreprise.map((e) => {
            const conv = e.totalScans > 0
              ? Math.round((e.totalReviews / e.totalScans) * 100)
              : 0;
            return (
              <div
                key={e.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr repeat(3, 100px)",
                  padding: "12px 20px",
                  borderBottom: "1px solid #F8FAFC",
                  alignItems: "center", fontSize: 13,
                }}
                onMouseEnter={ev => ev.currentTarget.style.background = "#F8FAFC"}
                onMouseLeave={ev => ev.currentTarget.style.background = "#fff"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: `${e.couleur_principale || "#3B82F6"}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: e.couleur_principale || "#3B82F6",
                  }}>
                    {(e.nom || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#0F172A" }}>{e.nom}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{e.slug}</div>
                  </div>
                </div>
                <div style={{ textAlign: "center", fontWeight: 600, color: "#475569" }}>
                  {e.totalScans.toLocaleString("fr-FR")}
                </div>
                <div style={{ textAlign: "center", fontWeight: 600, color: "#10B981" }}>
                  {e.totalReviews.toLocaleString("fr-FR")}
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    padding: "2px 9px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                    background: conv >= 50 ? "#DCFCE7" : conv >= 20 ? "#FEF9C3" : "#FEE2E2",
                    color: conv >= 50 ? "#16A34A" : conv >= 20 ? "#A16207" : "#DC2626",
                  }}>
                    {conv}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
