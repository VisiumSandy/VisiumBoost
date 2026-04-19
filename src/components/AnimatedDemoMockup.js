"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Design tokens (matching tailwind.config.js + globals.css) ─────────────────
const T = {
  sidebar:      "#0F172A",
  sidebarHover: "rgba(255,255,255,0.05)",
  activeText:   "#93C5FD",
  activeBg:     "rgba(59,130,246,0.15)",
  mutedText:    "#94A3B8",
  dimText:      "#475569",
  white:        "#F1F5F9",
  bg:           "#F8FAFC",
  bg2:          "#EFF6FF",
  card:         "#FFFFFF",
  border:       "#E2E8F0",
  brand:        "#2563EB",
  brandLight:   "#3B82F6",
  success:      "#10B981",
  warning:      "#F59E0B",
  info:         "#0EA5E9",
  text:         "#0F172A",
  text2:        "#475569",
  text3:        "#94A3B8",
};

// ── Mini inline SVG icons ─────────────────────────────────────────────────────
const Ic = {
  dashboard:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  clients:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  wheel:       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/></svg>,
  print:       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  check:       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  star:        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  chart:       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  link:        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  zap:         <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  trendUp:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

const NAV_ITEMS = [
  { id: "dashboard",   icon: "dashboard", label: "Tableau de bord" },
  { id: "clients",     icon: "clients",   label: "Mes entreprises" },
  { id: "wheel",       icon: "wheel",     label: "Ma Roue" },
  { id: "affiches",    icon: "print",     label: "Affiches" },
  { id: "codes",       icon: "check",     label: "Validations",  badge: 3 },
  { id: "avis",        icon: "star",      label: "Avis Google" },
  { id: "stats",       icon: "chart",     label: "Statistiques" },
  { id: "affiliation", icon: "link",      label: "Affiliation" },
];

// Pages to cycle through and cursor stop indices in NAV_ITEMS
const CYCLE = [
  { page: "dashboard",   navIdx: 0 },
  { page: "clients",     navIdx: 1 },
  { page: "wheel",       navIdx: 2 },
  { page: "stats",       navIdx: 6 },
];

// ── Animated number ───────────────────────────────────────────────────────────
function AnimNum({ value, suffix = "" }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const start = displayed;
    const end = value;
    const duration = 900;
    const step = 16;
    const steps = duration / step;
    const inc = (end - start) / steps;
    let cur = start;
    clearInterval(ref.current);
    ref.current = setInterval(() => {
      cur += inc;
      if ((inc > 0 && cur >= end) || (inc < 0 && cur <= end)) {
        setDisplayed(end);
        clearInterval(ref.current);
      } else {
        setDisplayed(Math.round(cur));
      }
    }, step);
    return () => clearInterval(ref.current);
  }, [value]); // eslint-disable-line

  return <>{displayed.toLocaleString("fr-FR")}{suffix}</>;
}

// ── Mini bar chart ────────────────────────────────────────────────────────────
function MiniChart({ data, color }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 44 }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          style={{
            flex: 1, borderRadius: 3,
            background: i === data.length - 1
              ? `linear-gradient(180deg,${color},${color}99)`
              : `${color}33`,
          }}
        />
      ))}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, suffix, sub, color, icon }) {
  return (
    <div style={{
      background: T.card, borderRadius: 12, padding: "12px 14px",
      border: `1px solid ${T.border}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      display: "flex", flexDirection: "column", gap: 8, minWidth: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: T.text3, letterSpacing: 0.3 }}>{label}</span>
        <div style={{
          width: 24, height: 24, borderRadius: 7,
          background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color,
        }}>{icon}</div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, lineHeight: 1 }}>
        <AnimNum value={value} suffix={suffix} />
      </div>
      <div style={{ fontSize: 9.5, color: T.success, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

// ── Page: Dashboard ───────────────────────────────────────────────────────────
function PageDashboard({ tick }) {
  const vals = [
    { label: "Scans de page",    value: 247 + tick * 17, suffix: "",   sub: "+12 aujourd'hui",  color: T.brandLight, icon: Ic.print },
    { label: "Roues tournées",   value: 184 + tick * 11, suffix: "",   sub: "+8 aujourd'hui",   color: T.info,       icon: Ic.wheel },
    { label: "Codes validés",    value: 127 + tick * 7,  suffix: "",   sub: "+5 aujourd'hui",   color: T.success,    icon: Ic.check },
    { label: "Taux de retrait",  value: Math.min(68 + tick, 89),   suffix: "%", sub: "Objectif 70%",    color: T.warning,    icon: Ic.trendUp },
  ];
  const chartData = [12, 18, 9, 24, 31, 20, 28 + (tick % 5)];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {vals.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      {/* Chart card */}
      <div style={{
        background: T.card, borderRadius: 12, padding: "12px 14px",
        border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.text }}>Activité — 7 jours</div>
            <div style={{ fontSize: 9.5, color: T.text3, marginTop: 1 }}>Roues tournées par jour</div>
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: T.brand, background: T.bg2, padding: "3px 8px", borderRadius: 20 }}>
            Total : {184 + tick * 11}
          </span>
        </div>
        <MiniChart data={chartData} color={T.brandLight} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          {["lun","mar","mer","jeu","ven","sam","dim"].map(d => (
            <span key={d} style={{ fontSize: 8, color: T.text3 }}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page: Mes entreprises ─────────────────────────────────────────────────────
function PageClients() {
  const businesses = [
    { name: "Le Gourmet", slug: "le-gourmet", scans: 147, reviews: 89, status: "actif" },
    { name: "Salon NOVA",  slug: "salon-nova", scans: 100, reviews: 38, status: "actif" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{
        background: T.card, borderRadius: 12, padding: "12px 14px",
        border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Mes établissements</span>
          <div style={{
            background: T.brand, color: "#fff", fontSize: 9, fontWeight: 700,
            padding: "4px 10px", borderRadius: 8, cursor: "pointer",
          }}>+ Ajouter</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {businesses.map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              background: T.bg, border: `1px solid ${T.border}`,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                background: `linear-gradient(135deg, ${i === 0 ? "#3B82F6,#0EA5E9" : "#8B5CF6,#6366F1"})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: "#fff",
              }}>{b.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 1 }}>{b.name}</div>
                <div style={{ fontSize: 9.5, color: T.text3 }}>visium-boost.fr/s/{b.slug}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.text }}>{b.scans} scans</div>
                <div style={{ fontSize: 9, color: T.success, fontWeight: 600, marginTop: 1 }}>{b.reviews} avis</div>
              </div>
              <div style={{
                fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                background: "#DCFCE7", color: "#15803D",
              }}>{b.status}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        background: `linear-gradient(135deg, ${T.brand}15, ${T.info}10)`,
        border: `1px solid ${T.brand}25`, borderRadius: 12,
        padding: "12px 14px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ fontSize: 18 }}>💡</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.brand }}>Conseil</div>
          <div style={{ fontSize: 9.5, color: T.text2, marginTop: 1 }}>Affichez le QR code bien en vue pour maximiser les scans.</div>
        </div>
      </div>
    </div>
  );
}

// ── Page: Ma Roue ─────────────────────────────────────────────────────────────
function PageWheel() {
  const rewards = [
    { name: "Café offert",      prob: 35, color: "#3B82F6" },
    { name: "10% de réduction", prob: 25, color: "#8B5CF6" },
    { name: "Dessert offert",   prob: 20, color: "#10B981" },
    { name: "Boisson offerte",  prob: 15, color: "#F59E0B" },
    { name: "Surprise",         prob: 5,  color: "#EF4444" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{
        background: T.card, borderRadius: 12, padding: "12px 14px",
        border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 10 }}>Configuration de la roue</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {/* Mini wheel */}
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
            {rewards.map((r, i) => {
              const total = rewards.reduce((s, x) => s + x.prob, 0);
              let start = rewards.slice(0, i).reduce((s, x) => s + x.prob, 0) / total * 360;
              const sweep = r.prob / total * 360;
              const end = start + sweep;
              const toRad = (deg) => (deg - 90) * Math.PI / 180;
              const x1 = 40 + 35 * Math.cos(toRad(start));
              const y1 = 40 + 35 * Math.sin(toRad(start));
              const x2 = 40 + 35 * Math.cos(toRad(end));
              const y2 = 40 + 35 * Math.sin(toRad(end));
              return (
                <path key={i}
                  d={`M 40 40 L ${x1} ${y1} A 35 35 0 ${sweep > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
                  fill={r.color} stroke="#fff" strokeWidth="1.5"
                />
              );
            })}
            <circle cx="40" cy="40" r="8" fill="#fff" stroke={T.border} strokeWidth="1.5" />
            <circle cx="40" cy="40" r="3.5" fill={T.brand} />
          </svg>
          {/* Rewards list */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
            {rewards.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: r.color, flexShrink: 0 }} />
                <span style={{ fontSize: 9.5, color: T.text2, flex: 1 }}>{r.name}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.text3 }}>{r.prob}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{
        background: T.card, borderRadius: 12, padding: "12px 14px",
        border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 8 }}>Lien public</div>
        <div style={{
          background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "7px 10px", fontSize: 9.5, color: T.text3,
          fontFamily: "monospace",
        }}>
          visium-boost.fr/s/<span style={{ color: T.brand }}>le-gourmet</span>
        </div>
      </div>
    </div>
  );
}

// ── Page: Statistiques ────────────────────────────────────────────────────────
function PageStats({ tick }) {
  const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul"];
  const data1 = [28, 41, 35, 57, 63, 71, 84 + (tick % 8)];
  const data2 = [19, 28, 22, 38, 44, 53, 61 + (tick % 6)];
  const max = Math.max(...data1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{
        background: T.card, borderRadius: 12, padding: "12px 14px",
        border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.text }}>Croissance des avis</div>
            <div style={{ fontSize: 9.5, color: T.text3, marginTop: 1 }}>7 derniers mois</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ label: "Roues", color: T.brandLight }, { label: "Validés", color: T.success }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 8.5, color: T.text3 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 64 }}>
          {data1.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, height: "100%" }}>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", gap: 1.5 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / max) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22,1,0.36,1] }}
                  style={{ flex: 1, borderRadius: "3px 3px 0 0", background: `${T.brandLight}55` }}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data2[i] / max) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 + 0.05, ease: [0.22,1,0.36,1] }}
                  style={{ flex: 1, borderRadius: "3px 3px 0 0", background: `${T.success}55` }}
                />
              </div>
              <span style={{ fontSize: 7.5, color: T.text3 }}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: "Total avis générés",  value: 312 + tick * 9,  color: T.brandLight },
          { label: "Taux de conversion",  value: 68,              color: T.success, suffix: "%" },
        ].map(s => (
          <div key={s.label} style={{
            background: T.card, borderRadius: 12, padding: "12px 14px",
            border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: 9.5, color: T.text3, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>
              <AnimNum value={s.value} suffix={s.suffix || ""} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Cursor component ──────────────────────────────────────────────────────────
function Cursor({ x, y }) {
  return (
    <motion.div
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
      style={{
        position: "absolute", pointerEvents: "none", zIndex: 100,
        display: "flex", alignItems: "flex-start",
      }}
    >
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
        <path d="M0 0L0 14L4 10L7 17L9 16L6 9L11 9Z" fill="#0F172A" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AnimatedDemoMockup({ scale = 1 }) {
  const [cycleIdx, setCycleIdx] = useState(0);
  const [tick, setTick]         = useState(0);
  const [clicking, setClicking] = useState(false);

  // Each nav item row height in the sidebar (px, at 1x scale)
  // Sidebar starts rendering nav at y≈170, each row≈34px
  const NAV_Y_START = 170;
  const NAV_ROW_H   = 34;

  const { page, navIdx } = CYCLE[cycleIdx];
  const nextIdx = (cycleIdx + 1) % CYCLE.length;
  const nextNavIdx = CYCLE[nextIdx].navIdx;

  // Cursor position: aim for next item (before click), then settle
  const cursorX = 14;
  const cursorY = NAV_Y_START + nextNavIdx * NAV_ROW_H + 10;

  useEffect(() => {
    // 1. wait 2s on page, then animate cursor to next item and click
    const clickTimer = setTimeout(() => {
      setClicking(true);
      setTimeout(() => {
        setClicking(false);
        setCycleIdx(i => (i + 1) % CYCLE.length);
        setTick(t => t + 1);
      }, 320);
    }, 2400);

    return () => clearTimeout(clickTimer);
  }, [cycleIdx]);

  // Page content
  const pageTitle = {
    dashboard: "Tableau de bord",
    clients:   "Mes entreprises",
    wheel:     "Ma Roue",
    stats:     "Statistiques",
  }[page];

  const W = 580, H = 390;

  return (
    // Outer wrapper collapses to the visual (scaled) dimensions so the hero layout isn't pushed
    <div style={{
      width:  W * scale,
      height: H * scale,
      position: "relative",
      flexShrink: 0,
    }}>
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: W,
      height: H,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      WebkitFontSmoothing: "antialiased",
      position: "absolute",
      top: 0, left: 0,
    }}>
      {/* Browser chrome */}
      <div style={{
        width: "100%", height: "100%",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Top bar */}
        <div style={{
          background: "#1E293B", height: 32, flexShrink: 0,
          display: "flex", alignItems: "center", padding: "0 12px", gap: 6,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          {["#EF4444","#F59E0B","#10B981"].map(c => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
          ))}
          <div style={{
            flex: 1, margin: "0 12px",
            background: "rgba(255,255,255,0.06)", borderRadius: 6,
            height: 18, display: "flex", alignItems: "center",
            padding: "0 10px",
          }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 0.2 }}>
              visium-boost.fr/dashboard
            </span>
          </div>
        </div>

        {/* App body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

          {/* ── Sidebar ── */}
          <aside style={{
            width: 170, background: T.sidebar, flexShrink: 0,
            display: "flex", flexDirection: "column",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}>
            {/* Logo */}
            <div style={{ padding: "12px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{
                fontSize: 13, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.3px",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 7,
                  background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 900, color: "#fff",
                }}>V</div>
                VisiumBoost
              </div>
            </div>

            {/* User card */}
            <div style={{
              margin: "8px 8px 4px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 9, padding: "8px 10px",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "linear-gradient(135deg,#3B82F6,#0EA5E9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, color: "#fff", fontSize: 11, flexShrink: 0,
              }}>S</div>
              <div>
                <div style={{ color: "#F1F5F9", fontWeight: 600, fontSize: 11 }}>Sandy</div>
                <div style={{ fontSize: 9.5, fontWeight: 600, color: T.warning, letterSpacing: 0.2 }}>Essai · 14j</div>
              </div>
            </div>

            {/* Section label */}
            <div style={{ padding: "4px 12px 2px", fontSize: 8, fontWeight: 700, color: "#475569", letterSpacing: 1, textTransform: "uppercase" }}>
              Menu
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "2px 6px", display: "flex", flexDirection: "column", gap: 1 }}>
              {NAV_ITEMS.map((item) => {
                const active = item.id === page;
                return (
                  <motion.div
                    key={item.id}
                    animate={clicking && item.id === CYCLE[nextIdx].page
                      ? { scale: [1, 0.96, 1] }
                      : { scale: 1 }
                    }
                    transition={{ duration: 0.25 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "6px 8px", borderRadius: 8,
                      background: active ? T.activeBg : "transparent",
                      cursor: "default",
                      color: active ? T.activeText : T.mutedText,
                      fontSize: 11, fontWeight: active ? 600 : 500,
                      position: "relative",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    <span style={{ color: active ? "#60A5FA" : T.dimText, flexShrink: 0, display: "flex" }}>
                      {Ic[item.icon]}
                    </span>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span style={{
                        background: "#EF4444", color: "#fff", fontSize: 8, fontWeight: 700,
                        borderRadius: 99, minWidth: 14, height: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "0 3px", lineHeight: 1,
                      }}>{item.badge}</span>
                    )}
                  </motion.div>
                );
              })}
            </nav>

            {/* Upgrade button */}
            <div style={{ padding: "6px 8px 10px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 10px", borderRadius: 9,
                background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
                color: "#fff", fontSize: 10, fontWeight: 700,
                cursor: "default",
              }}>
                <span style={{ display: "flex", color: "#fff" }}>{Ic.zap}</span>
                Passer en Pro
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div style={{ flex: 1, background: T.bg, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header */}
            <div style={{
              padding: "12px 16px 10px",
              borderBottom: `1px solid ${T.border}`,
              background: T.card,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.text, letterSpacing: "-0.3px" }}>
                  {pageTitle}
                </div>
                <div style={{ fontSize: 9.5, color: T.text3, marginTop: 1 }}>
                  {page === "dashboard" && "Résumé de votre activité"}
                  {page === "clients"   && "Gérez vos établissements"}
                  {page === "wheel"     && "Configurez votre roue"}
                  {page === "stats"     && "Analysez votre performance"}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  fontSize: 9, fontWeight: 600, color: T.success,
                  background: "#DCFCE7", padding: "3px 8px", borderRadius: 20,
                  display: "flex", alignItems: "center", gap: 3,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.success }} />
                  En ligne
                </div>
              </div>
            </div>

            {/* Page body */}
            <div style={{ flex: 1, overflow: "hidden", padding: "12px 14px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", overflow: "hidden" }}
                >
                  {page === "dashboard" && <PageDashboard tick={tick} />}
                  {page === "clients"   && <PageClients />}
                  {page === "wheel"     && <PageWheel />}
                  {page === "stats"     && <PageStats tick={tick} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Animated cursor ── */}
          <Cursor x={cursorX} y={cursorY} />

          {/* Click ripple */}
          <AnimatePresence>
            {clicking && (
              <motion.div
                key="ripple"
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  left: cursorX + 2, top: cursorY + 2,
                  width: 18, height: 18,
                  borderRadius: "50%",
                  background: "rgba(37,99,235,0.35)",
                  pointerEvents: "none",
                  zIndex: 99,
                  transformOrigin: "center",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </div>
  );
}
