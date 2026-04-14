"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Tiny helpers ──────────────────────────────────────────────────────
function KPICard({ icon, label, value, sub, color = "#6C5CE7", trend }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 18, padding: "24px 28px",
      border: "1.5px solid #F0F0F5",
      boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
      display: "flex", flexDirection: "column", gap: 12, flex: "1 1 200px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `${color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: 12, fontWeight: 700, color: trend.startsWith("+") ? "#00B894" : "#E17055",
            background: trend.startsWith("+") ? "#00B89415" : "#E1705515",
            padding: "3px 8px", borderRadius: 8,
          }}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#0F0F1A", lineHeight: 1, fontFamily: "'Calistoga', serif" }}>
          {value}
        </div>
        <div style={{ fontSize: 13, color: "#636e72", marginTop: 4, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "#b2bec3", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

const PLAN_LABELS = { free: "Gratuit", starter: "Starter", pro: "Pro" };
const PLAN_COLORS = { free: "#636e72", starter: "#00B894", pro: "#6C5CE7" };

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Auth check
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (!data.user || data.user.role !== "admin") { router.replace("/login"); return; }
        setUser(data.user);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const fetchStats = useCallback(async () => {
    const r = await fetch("/api/admin/stats");
    const d = await r.json();
    setStats(d);
  }, []);

  const fetchClients = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (planFilter) params.set("plan", planFilter);
    const r = await fetch(`/api/admin/clients?${params}`);
    const d = await r.json();
    setClients(d.clients || []);
  }, [search, planFilter]);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchStats(), fetchClients()]).finally(() => setLoading(false));
  }, [user, fetchStats, fetchClients]);

  const handlePlanChange = async (userId, plan) => {
    await fetch("/api/admin/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan }),
    });
    fetchClients();
  };

  const handleToggleActive = async (userId, active) => {
    await fetch("/api/admin/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, active }),
    });
    fetchClients();
  };

  const handleDelete = async (userId) => {
    if (!confirm("Supprimer définitivement ce client ?")) return;
    await fetch("/api/admin/clients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    fetchClients();
    fetchStats();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  if (loading || !user) {
    return (
      <div style={{
        minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#F8FAFC", fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
          <img src="/images/logo_second.png" alt="VisiumBoost" style={{ height: 64, objectFit: "contain", margin: "0 auto 16px", display: "block", animation: "pulse 1.6s ease-in-out infinite" }} />
          <p style={{ color: "#718096", fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Chargement du panel admin…</p>
        </div>
      </div>
    );
  }

  const s = stats || {};

  return (
    <div style={{
      minHeight: "100dvh", background: "#F8FAFC",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* ─── TOP NAV ──────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#0F0F1A",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 62,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 34, objectFit: "contain" }} />
          <img src="/images/logo_main1.png" alt="VisiumBoost" style={{ height: 20, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          <span style={{
            marginLeft: 8, padding: "3px 10px", borderRadius: 8,
            background: "rgba(108,92,231,0.25)", border: "1px solid rgba(108,92,231,0.4)",
            color: "#a29bfe", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase",
          }}>
            Admin
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#718096", fontSize: 13 }}>
            {user.name}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "7px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "#718096", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* ─── PAGE TITLE ────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 6px", color: "#0F0F1A", fontFamily: "'Calistoga', serif" }}>
            Panel d&apos;administration
          </h1>
          <p style={{ color: "#636e72", fontSize: 14, margin: 0 }}>
            Vue d&apos;ensemble de votre plateforme VisiumBoost
          </p>
        </div>

        {/* ─── TABS ──────────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 32,
          background: "#fff", borderRadius: 14, padding: 4,
          border: "1.5px solid #F0F0F5",
          width: "fit-content",
        }}>
          {[["overview", "Vue d'ensemble"], ["clients", "Clients"]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              padding: "8px 20px", borderRadius: 10, border: "none",
              background: activeTab === id ? "#0F0F1A" : "transparent",
              color: activeTab === id ? "#fff" : "#636e72",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW TAB ──────────────────────────────────── */}
        {activeTab === "overview" && (
          <>
            {/* KPI Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 28 }}>
              <KPICard icon="👥" label="Total clients" value={s.totalClients ?? "—"} color="#6C5CE7" sub={`${s.activeClients ?? 0} actifs`} />
              <KPICard icon="💰" label="Revenu mensuel" value={`${s.monthlyRevenue ?? 0}€`} color="#00B894" trend="+12%" />
              <KPICard icon="🔐" label="Codes générés" value={s.totalCodes ?? "—"} color="#0984E3" sub={`${s.usedCodes ?? 0} utilisés`} />
              <KPICard icon="📊" label="Taux conversion" value={`${s.conversionRate ?? 0}%`} color="#E17055" trend={`${s.conversionRate >= 50 ? "+" : ""}${s.conversionRate ?? 0}%`} />
            </div>

            {/* Plans breakdown */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 28 }}>
              {Object.entries(PLAN_LABELS).map(([key, label]) => (
                <div key={key} style={{
                  flex: "1 1 140px", background: "#fff", borderRadius: 16,
                  padding: "20px 24px", border: "1.5px solid #F0F0F5",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: PLAN_COLORS[key], marginBottom: 10,
                  }} />
                  <div style={{ fontFamily: "'Calistoga', serif", fontSize: 28, color: "#0F0F1A", lineHeight: 1 }}>
                    {s.plans?.[key] ?? 0}
                  </div>
                  <div style={{ fontSize: 13, color: "#636e72", marginTop: 4, fontWeight: 600 }}>Plan {label}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
              {/* Signups chart */}
              <div style={{
                background: "#fff", borderRadius: 20, padding: "28px 24px",
                border: "1.5px solid #F0F0F5", boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 20px", color: "#0F0F1A" }}>
                  Nouvelles inscriptions (30 derniers jours)
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={s.signupChart || []}>
                    <defs>
                      <linearGradient id="gSignup" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false}
                      tick={{ fontSize: 10, fill: "#b2bec3" }}
                      interval={Math.ceil((s.signupChart?.length || 30) / 7)}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#b2bec3" }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #F0F0F5", fontSize: 12, fontFamily: "'Inter', sans-serif" }}
                      formatter={(v) => [v, "Inscriptions"]}
                    />
                    <Area type="monotone" dataKey="count" stroke="#6C5CE7" strokeWidth={2.5} fill="url(#gSignup)" name="Inscriptions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Plan distribution bar */}
              <div style={{
                background: "#fff", borderRadius: 20, padding: "28px 24px",
                border: "1.5px solid #F0F0F5", boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 20px", color: "#0F0F1A" }}>
                  Distribution par plan
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={Object.entries(PLAN_LABELS).map(([key, label]) => ({
                      name: label, count: s.plans?.[key] || 0, fill: PLAN_COLORS[key],
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8b8da0" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#b2bec3" }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #F0F0F5", fontSize: 12, fontFamily: "'Inter', sans-serif" }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Clients">
                      {Object.entries(PLAN_LABELS).map(([key]) => (
                        <rect key={key} fill={PLAN_COLORS[key]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ─── CLIENTS TAB ───────────────────────────────────── */}
        {activeTab === "clients" && (
          <div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un client…"
                style={{
                  flex: "1 1 220px", padding: "10px 16px", borderRadius: 12,
                  border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none",
                  fontFamily: "'Inter', sans-serif", background: "#fff",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#6C5CE7"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
              <select
                value={planFilter}
                onChange={e => setPlanFilter(e.target.value)}
                style={{
                  padding: "10px 16px", borderRadius: 12,
                  border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none",
                  fontFamily: "'Inter', sans-serif", background: "#fff", cursor: "pointer",
                }}
              >
                <option value="">Tous les plans</option>
                <option value="free">Gratuit</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
              </select>
            </div>

            {/* Clients table */}
            <div style={{
              background: "#fff", borderRadius: 20, overflow: "hidden",
              border: "1.5px solid #F0F0F5", boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}>
              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 100px",
                padding: "14px 24px",
                borderBottom: "1.5px solid #F0F0F5",
                fontSize: 11, fontWeight: 800, color: "#b2bec3",
                textTransform: "uppercase", letterSpacing: 1,
                background: "#FAFAFA",
              }}>
                <div>Client</div>
                <div>Email</div>
                <div>Plan</div>
                <div>Inscrit</div>
                <div>Statut</div>
                <div style={{ textAlign: "center" }}>Actions</div>
              </div>

              {clients.length === 0 && (
                <div style={{ padding: "48px 24px", textAlign: "center", color: "#b2bec3", fontSize: 14 }}>
                  Aucun client trouvé
                </div>
              )}

              {clients.map((c) => (
                <div key={c._id} style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 100px",
                  padding: "14px 24px",
                  borderBottom: "1px solid #F8F8FC",
                  alignItems: "center",
                  fontSize: 13,
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFE"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "#0F0F1A" }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#b2bec3" }}>{c.businessName || "—"}</div>
                  </div>
                  <div style={{ color: "#636e72", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.email}
                  </div>
                  <div>
                    <select
                      value={c.plan}
                      onChange={e => handlePlanChange(c._id, e.target.value)}
                      style={{
                        padding: "5px 10px", borderRadius: 8,
                        border: `1.5px solid ${PLAN_COLORS[c.plan]}40`,
                        background: `${PLAN_COLORS[c.plan]}12`,
                        color: PLAN_COLORS[c.plan],
                        fontWeight: 700, fontSize: 12, cursor: "pointer",
                        fontFamily: "'Inter', sans-serif", outline: "none",
                      }}
                    >
                      {Object.entries(PLAN_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ color: "#8b8da0", fontSize: 12 }}>
                    {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                  <div>
                    <button
                      onClick={() => handleToggleActive(c._id, !c.active)}
                      style={{
                        padding: "4px 12px", borderRadius: 8, border: "none",
                        background: c.active ? "#00B89415" : "#E1705515",
                        color: c.active ? "#00B894" : "#E17055",
                        fontWeight: 700, fontSize: 12, cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {c.active ? "Actif" : "Inactif"}
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                    <button
                      onClick={() => handleDelete(c._id)}
                      style={{
                        width: 32, height: 32, borderRadius: 9, border: "none",
                        background: "#FFF5F5", color: "#E53E3E", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, transition: "background 0.15s",
                      }}
                      title="Supprimer"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: "#b2bec3", textAlign: "right" }}>
              {clients.length} client{clients.length !== 1 ? "s" : ""} affiché{clients.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
