"use client";

import { useState, useEffect } from "react";
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

// ── Icons ─────────────────────────────────────────────────────────────────────
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
  download:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  gift:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  users2:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

// ── Nav items (order MUST match CYCLE) ────────────────────────────────────────
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

// All 8 tabs — cursor visits every one
const CYCLE = ["dashboard", "clients", "wheel", "affiches", "codes", "avis", "stats", "affiliation"];

// ── Cursor hardcoded Y positions ──────────────────────────────────────────────
// Coordinates are relative to the app-body top-left (below the 30px chrome bar).
// Sidebar layout: logo(43) + user(52) + section-label(16) + nav-pad-top(2) = 113px before first item.
// Each item: padding 6+6 + content 14px + gap 1px = 27px. Center = +13.
const NAV_CURSOR_X = 58;
function navCursorY(idx) { return 113 + idx * 27 + 13; }

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimNum({ value, suffix = "" }) {
  const [cur, setCur] = useState(value);
  const raf  = { current: null };
  const prev = { current: value };

  useEffect(() => {
    const from = prev.current, to = value;
    prev.current = to;
    if (from === to) return;
    const dur = 750, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCur(Math.round(from + (to - from) * e));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]); // eslint-disable-line

  return <>{cur.toLocaleString("fr-FR")}{suffix}</>;
}

// ── Mini bar chart ────────────────────────────────────────────────────────────
function MiniChart({ data, color, h = 44 }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: h }}>
      {data.map((v, i) => (
        <motion.div key={i}
          initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.55, delay: i * 0.04, ease: [0.22,1,0.36,1] }}
          style={{ flex: 1, borderRadius: 3, background: i === data.length - 1 ? color : `${color}38` }}
        />
      ))}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, suffix = "", sub, color, icon }) {
  return (
    <div style={{ background: T.card, borderRadius: 12, padding: "11px 12px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 9.5, fontWeight: 600, color: T.text3, lineHeight: 1.3 }}>{label}</span>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: `${color}1a`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 19, fontWeight: 800, color: T.text, lineHeight: 1 }}>
        <AnimNum value={value} suffix={suffix} />
      </div>
      <div style={{ fontSize: 9, color: T.success, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

// ── Page: Tableau de bord ─────────────────────────────────────────────────────
function PageDashboard({ tick }) {
  const cards = [
    { label: "Scans de page",   value: 247 + tick * 17, sub: "+12 aujourd'hui",  color: T.brandLight, icon: Ic.qr },
    { label: "Roues tournées",  value: 184 + tick * 11, sub: "+8 aujourd'hui",   color: T.info,       icon: Ic.wheel },
    { label: "Codes validés",   value: 127 + tick * 7,  sub: "+5 aujourd'hui",   color: T.success,    icon: Ic.check },
    { label: "Taux de retrait", value: Math.min(68 + tick, 89), suffix: "%", sub: "Objectif 70%", color: T.warning, icon: Ic.trendUp },
  ];
  const chart = [12, 18, 9, 24, 31, 20, 28 + (tick % 5)];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
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
        <MiniChart data={chart} color={T.brandLight} h={38} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {["lun","mar","mer","jeu","ven","sam","dim"].map(d => (
            <span key={d} style={{ fontSize: 7.5, color: T.text3 }}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page: Mes entreprises ─────────────────────────────────────────────────────
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
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 9, background: T.bg, border: `1px solid ${T.border}`, marginBottom: i === 0 ? 7 : 0 }}>
            <div style={{ width: 29, height: 29, borderRadius: 8, flexShrink: 0, background: `linear-gradient(135deg,${b.grad})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{b.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text }}>{b.name}</div>
              <div style={{ fontSize: 9, color: T.text3, marginTop: 1 }}>/{b.slug}</div>
            </div>
            <div style={{ textAlign: "right", marginRight: 7 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.text }}>{b.scans} scans</div>
              <div style={{ fontSize: 9, color: T.success, fontWeight: 600 }}>{b.reviews} avis</div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 20, background: "#DCFCE7", color: "#15803D" }}>actif</div>
          </div>
        ))}
      </div>
      <div style={{ background: `${T.brand}0f`, border: `1px solid ${T.brand}20`, borderRadius: 12, padding: "10px 13px", display: "flex", gap: 9, alignItems: "center" }}>
        <div style={{ fontSize: 16 }}>💡</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.brand }}>Conseil</div>
          <div style={{ fontSize: 9.5, color: T.text2, marginTop: 1, lineHeight: 1.5 }}>Affichez le QR code en caisse pour maximiser les scans.</div>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 10 }}>Configuration de la roue</div>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ flexShrink: 0 }}>
            {(() => {
              let acc = 0;
              return rewards.map((r, i) => {
                const s = acc / 100 * 360 - 90; acc += r.prob;
                const e = acc / 100 * 360 - 90;
                const sw = e - s;
                const toR = d => d * Math.PI / 180;
                const x1 = 38 + 32 * Math.cos(toR(s)), y1 = 38 + 32 * Math.sin(toR(s));
                const x2 = 38 + 32 * Math.cos(toR(e)), y2 = 38 + 32 * Math.sin(toR(e));
                return <path key={i} d={`M38 38 L${x1} ${y1} A32 32 0 ${sw > 180 ? 1 : 0} 1 ${x2} ${y2}Z`} fill={r.color} stroke="#fff" strokeWidth="1.5"/>;
              });
            })()}
            <circle cx="38" cy="38" r="8" fill="#fff" stroke={T.border} strokeWidth="1.5"/>
            <circle cx="38" cy="38" r="3.5" fill={T.brand}/>
          </svg>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            {rewards.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: r.color, flexShrink: 0 }}/>
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

// ── Page: Affiches ────────────────────────────────────────────────────────────
function PageAffiches() {
  const posters = [
    { name: "Le Gourmet", size: "A4", format: "PDF", date: "18 avr. 2026" },
    { name: "Salon NOVA", size: "A5", format: "PNG", date: "15 avr. 2026" },
  ];
  const QRMini = ({ color = T.brand }) => (
    <svg width="38" height="38" viewBox="0 0 38 38" style={{ flexShrink: 0 }}>
      <rect width="38" height="38" rx="5" fill="#F8FAFC"/>
      <rect x="3" y="3" width="14" height="14" rx="2" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="6" y="6" width="8" height="8" rx="1" fill={color}/>
      <rect x="21" y="3" width="14" height="14" rx="2" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="24" y="6" width="8" height="8" rx="1" fill={color}/>
      <rect x="3" y="21" width="14" height="14" rx="2" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="6" y="24" width="8" height="8" rx="1" fill={color}/>
      <rect x="21" y="21" width="4" height="4" rx="1" fill={color}/>
      <rect x="27" y="21" width="4" height="4" rx="1" fill={color}/>
      <rect x="21" y="27" width="4" height="4" rx="1" fill={color}/>
      <rect x="27" y="27" width="7" height="4" rx="1" fill={color}/>
      <rect x="33" y="21" width="2" height="6" rx="1" fill={color}/>
    </svg>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>Mes affiches QR</span>
          <div style={{ background: T.brand, color: "#fff", fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 7, display: "flex", alignItems: "center", gap: 4 }}>
            {Ic.download} Générer
          </div>
        </div>
        {posters.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, background: T.bg, border: `1px solid ${T.border}`, marginBottom: i === 0 ? 7 : 0 }}>
            <QRMini color={i === 0 ? T.brand : "#8B5CF6"} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text }}>{p.name}</div>
              <div style={{ fontSize: 9, color: T.text3, marginTop: 2 }}>{p.size} · {p.format} · {p.date}</div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color: T.brand, display: "flex", alignItems: "center", gap: 3 }}>
              {Ic.download} PDF
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.text, marginBottom: 8 }}>Aperçu de l&apos;affiche</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 48, height: 64, background: "linear-gradient(135deg,#0F172A,#1E3A5F)", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}>
            <div style={{ width: 26, height: 26, background: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 18, height: 18, background: T.brand, borderRadius: 2 }}/>
            </div>
            <div style={{ fontSize: 5.5, color: "#94A3B8", textAlign: "center", lineHeight: 1.3 }}>Scannez et tournez</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.text, lineHeight: 1.4 }}>Affiche personnalisée<br/>à vos couleurs</div>
            <div style={{ fontSize: 9, color: T.text3, marginTop: 3 }}>Prête à imprimer en A4/A5</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page: Validations ─────────────────────────────────────────────────────────
function PageCodes() {
  const codes = [
    { code: "VB-4829", business: "Le Gourmet",  reward: "Café offert",    time: "Il y a 3 min",  status: "pending" },
    { code: "VB-7341", business: "Salon NOVA",  reward: "10% réduction",  time: "Il y a 11 min", status: "pending" },
    { code: "VB-2056", business: "Le Gourmet",  reward: "Dessert offert", time: "Il y a 28 min", status: "validated" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 12, padding: "9px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>⏳</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#92400E" }}>
          <strong>2 codes</strong> en attente de validation
        </span>
      </div>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 10 }}>Codes récents</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {codes.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 9, background: c.status === "pending" ? "#FFFBEB" : "#F0FDF4", border: `1px solid ${c.status === "pending" ? "#FDE68A" : "#BBF7D0"}` }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 800, color: c.status === "pending" ? "#92400E" : "#166534", letterSpacing: 0.5, flexShrink: 0 }}>{c.code}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9.5, fontWeight: 600, color: T.text }}>{c.reward}</div>
                <div style={{ fontSize: 8.5, color: T.text3, marginTop: 1 }}>{c.business} · {c.time}</div>
              </div>
              {c.status === "pending" ? (
                <div style={{ fontSize: 8.5, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "#FEF3C7", color: "#92400E", flexShrink: 0 }}>À valider</div>
              ) : (
                <div style={{ fontSize: 8.5, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "#DCFCE7", color: "#15803D", flexShrink: 0 }}>Validé</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page: Avis Google ─────────────────────────────────────────────────────────
function PageAvis() {
  const reviews = [
    { init: "M", name: "Marie L.",   stars: 5, text: "Super expérience ! La roue est amusante et le cadeau parfait.", time: "il y a 2h",   grad: "#3B82F6,#0EA5E9" },
    { init: "T", name: "Thomas B.",  stars: 5, text: "Concept génial. Je reviendrai rien que pour ça !",             time: "il y a 1j",   grad: "#8B5CF6,#6366F1" },
    { init: "S", name: "Sophie M.",  stars: 4, text: "Très bonne idée, le café offert était délicieux.",             time: "il y a 2j",   grad: "#10B981,#0EA5E9" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: T.card, borderRadius: 12, padding: "10px 12px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 9, color: T.text3, marginBottom: 3 }}>Note moyenne</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: T.text }}>4.8</span>
            <span style={{ color: T.warning, fontSize: 14, lineHeight: 1 }}>★★★★★</span>
          </div>
          <div style={{ fontSize: 9, color: T.text3, marginTop: 2 }}>127 avis Google</div>
        </div>
        <div style={{ background: T.card, borderRadius: 12, padding: "10px 12px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 9, color: T.text3, marginBottom: 3 }}>Ce mois-ci</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.brand }}>+34</div>
          <div style={{ fontSize: 9, color: T.success, fontWeight: 600, marginTop: 2 }}>+18% vs mois dernier</div>
        </div>
      </div>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 9 }}>Derniers avis</div>
        {reviews.map((r, i) => (
          <div key={i} style={{ paddingBottom: i < reviews.length - 1 ? 9 : 0, marginBottom: i < reviews.length - 1 ? 9 : 0, borderBottom: i < reviews.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg,${r.grad})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 10, flexShrink: 0 }}>{r.init}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.text }}>{r.name}</div>
                <div style={{ display: "flex", gap: 1, marginTop: 1 }}>
                  {[...Array(r.stars)].map((_, j) => <span key={j} style={{ color: T.warning, fontSize: 9 }}>★</span>)}
                </div>
              </div>
              <span style={{ fontSize: 8.5, color: T.text3 }}>{r.time}</span>
            </div>
            <div style={{ fontSize: 9.5, color: T.text2, lineHeight: 1.5, paddingLeft: 31 }}>{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page: Statistiques ────────────────────────────────────────────────────────
function PageStats({ tick }) {
  const weekly = [45, 72, 58, 89, 103, 76, 94 + (tick % 10)];
  const funnel = [
    { label: "Scans",      val: 247, pct: 100, color: T.brandLight },
    { label: "Roues",      val: 184, pct: 74,  color: T.info },
    { label: "Validations", val: 127, pct: 51,  color: T.success },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: T.card, borderRadius: 12, padding: "10px 12px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 9, color: T.text3, marginBottom: 3 }}>Taux de conversion</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: T.text }}><AnimNum value={68 + (tick % 3)} suffix="%" /></div>
          <div style={{ fontSize: 9, color: T.success, fontWeight: 600, marginTop: 2 }}>+3% vs mois dernier</div>
        </div>
        <div style={{ background: T.card, borderRadius: 12, padding: "10px 12px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 9, color: T.text3, marginBottom: 3 }}>Récompenses distribuées</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: T.text }}><AnimNum value={127 + tick * 3} /></div>
          <div style={{ fontSize: 9, color: T.success, fontWeight: 600, marginTop: 2 }}>Ce mois-ci</div>
        </div>
      </div>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginBottom: 4 }}>Entonnoir de conversion</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          {funnel.map(f => (
            <div key={f.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 9.5, color: T.text2 }}>{f.label}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.text }}>{f.val}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: T.bg, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${f.pct}%` }} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }} style={{ height: "100%", borderRadius: 3, background: f.color }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.text, marginBottom: 6 }}>Tendance 7 jours</div>
        <MiniChart data={weekly} color={T.brand} h={36} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {["L","M","M","J","V","S","D"].map((d, i) => (
            <span key={i} style={{ fontSize: 7.5, color: T.text3 }}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page: Affiliation ─────────────────────────────────────────────────────────
function PageAffiliation() {
  const referred = [
    { name: "Bistro Central", plan: "Starter", gain: "2.9€/mois", grad: "#3B82F6,#0EA5E9" },
    { name: "Nail Studio",    plan: "Pro",     gain: "7.9€/mois", grad: "#8B5CF6,#6366F1" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
        {[
          { label: "Filleuls", value: "3", color: T.brand },
          { label: "Actifs",   value: "2", color: T.success },
          { label: "Gains",    value: "21€", color: T.warning },
        ].map(s => (
          <div key={s.label} style={{ background: T.card, borderRadius: 12, padding: "10px 10px", border: `1px solid ${T.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 8.5, color: T.text3, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: T.card, borderRadius: 12, padding: "11px 13px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.text, marginBottom: 7 }}>Votre lien de parrainage</div>
        <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 10px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 9.5, color: T.brand, fontFamily: "monospace", fontWeight: 600 }}>visium-boost.fr/ref/sandy42</div>
          <div style={{ fontSize: 8.5, fontWeight: 700, color: T.brand, background: T.bg2, padding: "2px 7px", borderRadius: 5 }}>Copier</div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.text, marginBottom: 7 }}>Établissements parrainés</div>
        {referred.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg,${r.grad})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 11, flexShrink: 0 }}>{r.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.text }}>{r.name}</div>
              <div style={{ fontSize: 8.5, color: T.text3 }}>Plan {r.plan}</div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.success }}>{r.gain}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Cursor ────────────────────────────────────────────────────────────────────
function Cursor({ x, y }) {
  return (
    <motion.div
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9 }}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 200 }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M1.5 1L1.5 15L5.5 10.5L9 18L11 17L7.5 9.5L13.5 9.5Z"
          fill="#1E293B" stroke="white" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    </motion.div>
  );
}

// ── Ripple ────────────────────────────────────────────────────────────────────
function Ripple({ x, y, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div key="rip"
          initial={{ scale: 0, opacity: 0.55 }}
          animate={{ scale: 3.5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ position: "absolute", left: x, top: y, width: 14, height: 14, borderRadius: "50%", background: "rgba(37,99,235,0.42)", pointerEvents: "none", zIndex: 199, transform: "translate(-50%,-50%)" }}
        />
      )}
    </AnimatePresence>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const W = 680, H = 470;

export default function AnimatedDemoMockup({ scale = 1 }) {
  const [pageIdx,  setPageIdx]  = useState(0);
  const [tick,     setTick]     = useState(0);
  const [clicking, setClicking] = useState(false);
  // Cursor starts on tab 0 (Tableau de bord)
  const [cursor, setCursor] = useState({ x: NAV_CURSOR_X, y: navCursorY(0) });

  const page     = CYCLE[pageIdx];
  const nextIdx  = (pageIdx + 1) % CYCLE.length;
  const nextId   = CYCLE[nextIdx];

  useEffect(() => {
    // Move cursor toward next tab
    const t0 = setTimeout(() => {
      setCursor({ x: NAV_CURSOR_X, y: navCursorY(nextIdx) });
    }, 500);

    // Click effect
    const t1 = setTimeout(() => setClicking(true), 2500);

    // Page advance
    const t2 = setTimeout(() => {
      setClicking(false);
      setPageIdx(nextIdx);
      setTick(t => t + 1);
    }, 2850);

    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [pageIdx, nextIdx]);

  const META = {
    dashboard:   { title: "Tableau de bord",   sub: "Résumé de votre activité" },
    clients:     { title: "Mes entreprises",   sub: "Gérez vos établissements" },
    wheel:       { title: "Ma Roue",           sub: "Configurez votre roue" },
    affiches:    { title: "Affiches QR",       sub: "Téléchargez vos affiches" },
    codes:       { title: "Validations",       sub: "Codes en attente" },
    avis:        { title: "Avis Google",       sub: "Vos retours clients" },
    stats:       { title: "Statistiques",      sub: "Performances détaillées" },
    affiliation: { title: "Affiliation",       sub: "Parrainez des établissements" },
  };
  const { title, sub } = META[page];

  return (
    <div style={{ width: W * scale, height: H * scale, position: "relative", flexShrink: 0 }}>
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left", position: "absolute", top: 0, left: 0, fontFamily: "'DM Sans',system-ui,sans-serif", WebkitFontSmoothing: "antialiased" }}>

        {/* Frame */}
        <div style={{ width: "100%", height: "100%", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,0.26), 0 0 0 1px rgba(0,0,0,0.09)" }}>

          {/* Chrome bar — 30px */}
          <div style={{ background: "#1E293B", height: 30, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 12px", gap: 6, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["#EF4444","#F59E0B","#10B981"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }}/>)}
            <div style={{ flex: 1, margin: "0 10px", background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 17, display: "flex", alignItems: "center", padding: "0 10px" }}>
              <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)" }}>visium-boost.fr/dashboard</span>
            </div>
          </div>

          {/* App body — cursor coordinates are relative to this div's top-left */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

            {/* Sidebar */}
            <aside style={{ width: 168, background: T.sidebar, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

              {/* Logo — ~43px */}
              <div style={{ padding: "11px 12px 9px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.3px" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg,#2563EB,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff" }}>V</div>
                  VisiumBoost
                </div>
              </div>

              {/* User — ~52px */}
              <div style={{ margin: "8px 8px 4px", background: "rgba(255,255,255,0.05)", borderRadius: 9, padding: "7px 9px", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 11, flexShrink: 0 }}>S</div>
                <div>
                  <div style={{ color: "#F1F5F9", fontWeight: 600, fontSize: 11 }}>Sandy</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: T.warning }}>Essai · 14j</div>
                </div>
              </div>

              {/* Section label — ~16px */}
              <div style={{ padding: "4px 13px 2px", fontSize: 8, fontWeight: 700, color: "#475569", letterSpacing: 1, textTransform: "uppercase" }}>Menu</div>

              {/* Nav — starts at y≈113 from app body top, each item 27px */}
              <nav style={{ flex: 1, padding: "2px 6px", display: "flex", flexDirection: "column", gap: 1, overflow: "hidden" }}>
                {NAV_ITEMS.map((item) => {
                  const active         = item.id === page;
                  const isNextTarget   = item.id === nextId;
                  const isBeingClicked = clicking && isNextTarget;
                  return (
                    <motion.div key={item.id}
                      animate={isBeingClicked ? { scale: [1, 0.92, 1] } : { scale: 1 }}
                      transition={{ duration: 0.28 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "6px 7px", borderRadius: 8,
                        background: active ? T.activeBg : isNextTarget ? "rgba(255,255,255,0.05)" : "transparent",
                        color: active ? T.activeText : T.mutedText,
                        fontSize: 10.5, fontWeight: active ? 600 : 500,
                        transition: "background 0.18s, color 0.18s",
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
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 9px", borderRadius: 9, background: "linear-gradient(135deg,#2563EB,#0EA5E9)", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "default" }}>
                  <span style={{ display: "flex" }}>{Ic.zap}</span> Passer en Pro
                </div>
              </div>
            </aside>

            {/* Main */}
            <div style={{ flex: 1, background: T.bg, display: "flex", flexDirection: "column", overflow: "hidden" }}>

              {/* Header */}
              <div style={{ padding: "11px 15px 9px", borderBottom: `1px solid ${T.border}`, background: T.card, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T.text, letterSpacing: "-0.3px" }}>{title}</div>
                  <div style={{ fontSize: 9.5, color: T.text3, marginTop: 1 }}>{sub}</div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 600, color: T.success, background: "#DCFCE7", padding: "3px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.success }}/> En ligne
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
                    {page === "dashboard"   && <PageDashboard tick={tick} />}
                    {page === "clients"     && <PageClients />}
                    {page === "wheel"       && <PageWheel />}
                    {page === "affiches"    && <PageAffiches />}
                    {page === "codes"       && <PageCodes />}
                    {page === "avis"        && <PageAvis />}
                    {page === "stats"       && <PageStats tick={tick} />}
                    {page === "affiliation" && <PageAffiliation />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Cursor + ripple — positioned relative to app body */}
            <Cursor x={cursor.x} y={cursor.y} />
            <Ripple x={cursor.x + 8} y={cursor.y + 10} show={clicking} />
          </div>
        </div>
      </div>
    </div>
  );
}
