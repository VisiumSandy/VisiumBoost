"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  sidebar:    "#0F172A",
  activeText: "#93C5FD",
  activeBg:   "rgba(59,130,246,0.15)",
  mutedText:  "#94A3B8",
  dimText:    "#475569",
  bg:         "#F8FAFC",
  bg2:        "#EFF6FF",
  card:       "#FFFFFF",
  border:     "#E2E8F0",
  brand:      "#2563EB",
  brandLight: "#3B82F6",
  success:    "#10B981",
  warning:    "#F59E0B",
  info:       "#0EA5E9",
  text:       "#0F172A",
  text2:      "#475569",
  text3:      "#94A3B8",
};

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const Ic = {
  dashboard: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  clients:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  wheel:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/></svg>,
  print:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  check:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  star:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  chart:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  link:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  zap:       <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  trendUp:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  qr:        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>,
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

// Pages to cycle through — id must match a NAV_ITEMS id
const CYCLE = ["dashboard", "clients", "wheel", "stats"];

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimNum({ value, suffix = "" }) {
  const [cur, setCur] = useState(value);
  const raf = useRef(null);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to   = value;
    prev.current = to;
    if (from === to) return;
    const dur = 800, start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCur(Math.round(from + (to - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return <>{cur.toLocaleString("fr-FR")}{suffix}</>;
}

// ── Mini bar chart ────────────────────────────────────────────────────────────
function MiniChart({ data, color, height = 44 }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {data.map((v, i) => (
        <motion.div key={i}
          initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.55, delay: i * 0.04, ease: [0.22,1,0.36,1] }}
          style={{
            flex: 1, borderRadius: 3,
            background: i === data.length - 1
              ? `linear-gradient(180deg,${color},${color}bb)`
              : `${color}3a`,
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
      background: T.card, borderRadius: 12, padding: "11px 12px",
      border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      display: "flex", flexDirection: "column", gap: 7, minWidth: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 9.5, fontWeight: 600, color: T.text3, letterSpacing: 0.2, lineHeight: 1.3 }}>{label}</span>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: `${color}1a`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 19, fontWeight: 800, color: T.text, lineHeight: 1 }}>
        <AnimNum value={value} suffix={suffix} />
      </div>
      <div style={{ fontSize: 9, color: T.success, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

// ── Page contents ─────────────────────────────────────────────────────────────
function PageDashboard({ tick }) {
  const cards = [
    { label: "Scans de page",   value: 247 + tick * 17, suffix: "",   sub: "+12 aujourd'hui", color: T.brandLight, icon: Ic.qr },
    { label: "Roues tournées",  value: 184 + tick * 11, suffix: "",   sub: "+8 aujourd'hui",  color: T.info,       icon: Ic.wheel },
    { label: "Codes validés",   value: 127 + tick * 7,  suffix: "",   sub: "+5 aujourd'hui",  color: T.success,    icon: Ic.check },
    { label: "Taux de retrait", value: Math.min(68 + tick, 89), suffix: "%", sub: "Objectif 70%", color: T.warning, icon: Ic.trendUp },
  ];
  const chart = [12, 18, 9, 24, 31, 20, 28 + (tick % 5)];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.text }}>Activité 7 jours</div>
            <div style={{ fontSize: 9, color: T.text3, marginTop: 1 }}>Roues tournées / jour</div>
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: T.brand, background: T.bg2, padding: "3px 8px", borderRadius: 20 }}>
            Total : <AnimNum value={184 + tick * 11} />
          </span>
        </div>
        <MiniChart data={chart} color={T.brandLight} height={40} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {["lun","mar","mer","jeu","ven","sam","dim"].map(d => (
            <span key={d} style={{ fontSize: 7.5, color: T.text3 }}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageClients() {
  const rows = [
    { name: "Le Gourmet", slug: "le-gourmet", scans: 147, reviews: 89, grad: "#3B82F6,#0EA5E9" },
    { name: "Salon NOVA",  slug: "salon-nova",  scans: 100, reviews: 38, grad: "#8B5CF6,#6366F1" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>Mes établissements</span>
          <div style={{ background: T.brand, color: "#fff", fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 7 }}>+ Ajouter</div>
        </div>
        {rows.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 9, background: T.bg, border: `1px solid ${T.border}`, marginBottom: i === 0 ? 7 : 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: `linear-gradient(135deg,${b.grad})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{b.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text }}>{b.name}</div>
              <div style={{ fontSize: 9, color: T.text3, marginTop: 1 }}>/{b.slug}</div>
            </div>
            <div style={{ textAlign: "right", marginRight: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.text }}>{b.scans} scans</div>
              <div style={{ fontSize: 9, color: T.success, fontWeight: 600 }}>{b.reviews} avis</div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 20, background: "#DCFCE7", color: "#15803D" }}>actif</div>
          </div>
        ))}
      </div>
      <div style={{ background: `${T.brand}10`, border: `1px solid ${T.brand}22`, borderRadius: 12, padding: "11px 13px", display: "flex", gap: 9, alignItems: "center" }}>
        <div style={{ fontSize: 16 }}>💡</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.brand }}>Conseil</div>
          <div style={{ fontSize: 9.5, color: T.text2, marginTop: 1, lineHeight: 1.5 }}>Affichez le QR code bien en vue pour maximiser les scans.</div>
        </div>
      </div>
    </div>
  );
}

function PageWheel() {
  const rewards = [
    { name: "Café offert",      prob: 35, color: "#3B82F6" },
    { name: "10% de réduction", prob: 25, color: "#8B5CF6" },
    { name: "Dessert offert",   prob: 20, color: "#10B981" },
    { name: "Boisson offerte",  prob: 15, color: "#F59E0B" },
    { name: "Surprise",         prob: 5,  color: "#EF4444" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 10 }}>Configuration de la roue</div>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <svg width="78" height="78" viewBox="0 0 78 78" style={{ flexShrink: 0 }}>
            {(() => {
              let acc = 0;
              return rewards.map((r, i) => {
                const start = acc / 100 * 360 - 90;
                acc += r.prob;
                const end = acc / 100 * 360 - 90;
                const sweep = end - start;
                const toR = (d) => d * Math.PI / 180;
                const x1 = 39 + 33 * Math.cos(toR(start)), y1 = 39 + 33 * Math.sin(toR(start));
                const x2 = 39 + 33 * Math.cos(toR(end)),   y2 = 39 + 33 * Math.sin(toR(end));
                return (
                  <path key={i}
                    d={`M 39 39 L ${x1} ${y1} A 33 33 0 ${sweep > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
                    fill={r.color} stroke="#fff" strokeWidth="1.5"
                  />
                );
              });
            })()}
            <circle cx="39" cy="39" r="8" fill="#fff" stroke={T.border} strokeWidth="1.5" />
            <circle cx="39" cy="39" r="3.5" fill={T.brand} />
          </svg>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
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
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.text, marginBottom: 7 }}>URL publique</div>
        <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 9, color: T.text3, fontFamily: "monospace" }}>
          visium-boost.fr/s/<span style={{ color: T.brand, fontWeight: 700 }}>le-gourmet</span>
        </div>
      </div>
    </div>
  );
}

function PageStats({ tick }) {
  const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul"];
  const d1 = [28, 41, 35, 57, 63, 71, 84 + (tick % 8)];
  const d2 = [19, 28, 22, 38, 44, 53, 61 + (tick % 6)];
  const max = Math.max(...d1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.text }}>Croissance des avis</div>
            <div style={{ fontSize: 9, color: T.text3, marginTop: 1 }}>7 derniers mois</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["Roues", T.brandLight], ["Validés", T.success]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
                <span style={{ fontSize: 8, color: T.text3 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
          {d1.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, height: "100%" }}>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", gap: 1.5 }}>
                <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22,1,0.36,1] }}
                  style={{ flex: 1, borderRadius: "3px 3px 0 0", background: `${T.brandLight}55` }} />
                <motion.div initial={{ height: 0 }} animate={{ height: `${(d2[i] / max) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 + 0.04, ease: [0.22,1,0.36,1] }}
                  style={{ flex: 1, borderRadius: "3px 3px 0 0", background: `${T.success}55` }} />
              </div>
              <span style={{ fontSize: 7, color: T.text3 }}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: "Total avis générés",   value: 312 + tick * 9, color: T.brandLight },
          { label: "Taux de conversion",   value: 68,             color: T.success, suffix: "%" },
        ].map(s => (
          <div key={s.label} style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 9.5, color: T.text3, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>
              <AnimNum value={s.value} suffix={s.suffix || ""} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Cursor SVG ────────────────────────────────────────────────────────────────
function Cursor({ x, y }) {
  return (
    <motion.div
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.8 }}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 200 }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M1 1L1 15.5L5 11L8.5 18.5L11 17.5L7.5 10.5L13.5 10.5Z"
          fill="#1E293B" stroke="white" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    </motion.div>
  );
}

// ── Click ripple ──────────────────────────────────────────────────────────────
function Ripple({ x, y, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div key="r"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 3, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{
            position: "absolute", left: x, top: y,
            width: 16, height: 16, borderRadius: "50%",
            background: "rgba(37,99,235,0.4)",
            pointerEvents: "none", zIndex: 199,
            transform: "translate(-50%,-50%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const W = 580, H = 400;

export default function AnimatedDemoMockup({ scale = 1 }) {
  const [pageIdx,   setPageIdx]   = useState(0);
  const [tick,      setTick]      = useState(0);
  const [clicking,  setClicking]  = useState(false);
  const [cursor,    setCursor]    = useState({ x: 20, y: 200 });

  // Refs for each nav item — indexed by NAV_ITEMS position
  const navRefs  = useRef([]);
  const rootRef  = useRef(null);

  const page = CYCLE[pageIdx];
  const nextPageIdx = (pageIdx + 1) % CYCLE.length;
  const nextPage    = CYCLE[nextPageIdx];
  const nextNavIdx  = NAV_ITEMS.findIndex(n => n.id === nextPage);

  // Move cursor to center of next nav item
  const moveCursorToNav = useCallback(() => {
    const el   = navRefs.current[nextNavIdx];
    const root = rootRef.current;
    if (!el || !root) return;
    const elRect   = el.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    // Unscale: the root is scaled, so real px = visual px / scale
    const x = (elRect.left - rootRect.left) / scale + (elRect.width  / scale) * 0.35;
    const y = (elRect.top  - rootRect.top)  / scale + (elRect.height / scale) * 0.5;
    setCursor({ x, y });
  }, [nextNavIdx, scale]);

  useEffect(() => {
    // Move cursor 600ms after page load, click after 2.4s
    const moveTimer  = setTimeout(moveCursorToNav, 600);
    const clickTimer = setTimeout(() => {
      setClicking(true);
      setTimeout(() => {
        setClicking(false);
        setPageIdx(i => (i + 1) % CYCLE.length);
        setTick(t => t + 1);
      }, 350);
    }, 2400);

    return () => { clearTimeout(moveTimer); clearTimeout(clickTimer); };
  }, [pageIdx, moveCursorToNav]);

  const pageTitle = { dashboard: "Tableau de bord", clients: "Mes entreprises", wheel: "Ma Roue", stats: "Statistiques" }[page];
  const pageSub   = { dashboard: "Résumé de votre activité", clients: "Gérez vos établissements", wheel: "Configurez votre roue", stats: "Analysez votre performance" }[page];

  return (
    // Wrapper collapses to visual dimensions
    <div ref={rootRef} style={{ width: W * scale, height: H * scale, position: "relative", flexShrink: 0 }}>
      <div style={{
        width: W, height: H,
        transform: `scale(${scale})`, transformOrigin: "top left",
        position: "absolute", top: 0, left: 0,
        fontFamily: "'DM Sans',system-ui,sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}>

        {/* Browser chrome */}
        <div style={{ width: "100%", height: "100%", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,0.24), 0 0 0 1px rgba(0,0,0,0.08)" }}>

          {/* Title bar */}
          <div style={{ background: "#1E293B", height: 30, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 12px", gap: 6, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["#EF4444","#F59E0B","#10B981"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
            <div style={{ flex: 1, margin: "0 10px", background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 17, display: "flex", alignItems: "center", padding: "0 10px" }}>
              <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", letterSpacing: 0.2 }}>visium-boost.fr/dashboard</span>
            </div>
          </div>

          {/* App */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

            {/* ── Sidebar ── */}
            <aside style={{ width: 168, background: T.sidebar, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

              {/* Logo */}
              <div style={{ padding: "11px 12px 9px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.3px" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg,#2563EB,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff" }}>V</div>
                  VisiumBoost
                </div>
              </div>

              {/* User card */}
              <div style={{ margin: "8px 8px 4px", background: "rgba(255,255,255,0.05)", borderRadius: 9, padding: "7px 9px", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 11, flexShrink: 0 }}>S</div>
                <div>
                  <div style={{ color: "#F1F5F9", fontWeight: 600, fontSize: 11 }}>Sandy</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: T.warning, letterSpacing: 0.2 }}>Essai · 14j</div>
                </div>
              </div>

              {/* Nav label */}
              <div style={{ padding: "4px 13px 2px", fontSize: 8, fontWeight: 700, color: "#475569", letterSpacing: 1, textTransform: "uppercase" }}>Menu</div>

              {/* Nav items */}
              <nav style={{ flex: 1, padding: "2px 6px", display: "flex", flexDirection: "column", gap: 1, overflow: "hidden" }}>
                {NAV_ITEMS.map((item, idx) => {
                  const active = item.id === page;
                  // Animate scale on "click"
                  const isBeingClicked = clicking && item.id === nextPage;
                  return (
                    <motion.div
                      key={item.id}
                      ref={el => navRefs.current[idx] = el}
                      animate={isBeingClicked ? { scale: [1, 0.94, 1] } : { scale: 1 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "6px 7px", borderRadius: 8,
                        background: active ? T.activeBg : "transparent",
                        color: active ? T.activeText : T.mutedText,
                        fontSize: 10.5, fontWeight: active ? 600 : 500,
                        transition: "background 0.2s, color 0.2s",
                        cursor: "default",
                      }}
                    >
                      <span style={{ color: active ? "#60A5FA" : "#475569", flexShrink: 0, display: "flex" }}>
                        {Ic[item.icon]}
                      </span>
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span style={{ background: "#EF4444", color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: 99, minWidth: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </nav>

              {/* Upgrade */}
              <div style={{ padding: "5px 7px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 9px", borderRadius: 9, background: "linear-gradient(135deg,#2563EB,#0EA5E9)", color: "#fff", fontSize: 10, fontWeight: 700 }}>
                  <span style={{ display: "flex", color: "#fff" }}>{Ic.zap}</span>
                  Passer en Pro
                </div>
              </div>
            </aside>

            {/* ── Main content ── */}
            <div style={{ flex: 1, background: T.bg, display: "flex", flexDirection: "column", overflow: "hidden" }}>

              {/* Header */}
              <div style={{ padding: "11px 15px 9px", borderBottom: `1px solid ${T.border}`, background: T.card, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T.text, letterSpacing: "-0.3px" }}>{pageTitle}</div>
                  <div style={{ fontSize: 9.5, color: T.text3, marginTop: 1 }}>{pageSub}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: T.success, background: "#DCFCE7", padding: "3px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 3 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.success }} />
                    En ligne
                  </div>
                </div>
              </div>

              {/* Page content */}
              <div style={{ flex: 1, overflow: "hidden", padding: "11px 13px" }}>
                <AnimatePresence mode="wait">
                  <motion.div key={page}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.26, ease: [0.22,1,0.36,1] }}
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

            {/* ── Cursor ── */}
            <Cursor x={cursor.x} y={cursor.y} />
            <Ripple x={cursor.x + 8} y={cursor.y + 10} visible={clicking} />
          </div>
        </div>
      </div>
    </div>
  );
}
