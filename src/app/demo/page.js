"use client";

import { useState } from "react";
import Link from "next/link";

const SEGMENTS = [
  { color: "#3B82F6", label: "Café offert" },
  { color: "#0EA5E9", label: "10% off" },
  { color: "#10B981", label: "Dessert" },
  { color: "#F59E0B", label: "Boisson" },
  { color: "#EF4444", label: "5% off" },
  { color: "#8B5CF6", label: "Surprise" },
];

const FEATURES = [
  {
    icon: "🎰",
    title: "Roue de la fortune",
    desc: "Vos clients tournent la roue et gagnent une récompense. Un mécanisme simple et addictif qui booste l'engagement.",
  },
  {
    icon: "⭐",
    title: "Plus d'avis Google",
    desc: "Conditionnez la roue à un avis Google. Vos clients laissent un avis, puis découvrent leur cadeau.",
  },
  {
    icon: "📊",
    title: "Tableau de bord",
    desc: "Suivez les scans, les roues tournées et les codes validés en temps réel depuis votre dashboard.",
  },
];

function WheelSVG({ rotation }) {
  const cx = 150, cy = 150, r = 130;
  const n = SEGMENTS.length;
  const angle = (2 * Math.PI) / n;

  const paths = SEGMENTS.map((seg, i) => {
    const startAngle = i * angle - Math.PI / 2;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const midAngle = startAngle + angle / 2;
    const lx = cx + (r * 0.65) * Math.cos(midAngle);
    const ly = cy + (r * 0.65) * Math.sin(midAngle);
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
    return { d, color: seg.color, label: seg.label, lx, ly, midAngle };
  });

  return (
    <svg
      width="300" height="300" viewBox="0 0 300 300"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: rotation > 0 ? "transform 2s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
        filter: "drop-shadow(0 8px 32px rgba(37,99,235,0.18))",
      }}
    >
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill={p.color} stroke="#fff" strokeWidth="2" />
          <text
            x={p.lx} y={p.ly}
            textAnchor="middle" dominantBaseline="middle"
            fill="#fff" fontSize="11" fontWeight="700"
            fontFamily="'DM Sans',system-ui,sans-serif"
            style={{ pointerEvents: "none" }}
          >
            {p.label}
          </text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r={20} fill="#fff" stroke="#E2E8F0" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={10} fill="#2563EB" />
      {/* Pointer */}
      <polygon
        points={`${cx},${cy - r - 8} ${cx - 10},${cy - r + 12} ${cx + 10},${cy - r + 12}`}
        fill="#0F172A"
        style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: `${cx}px ${cy}px` }}
      />
    </svg>
  );
}

export default function DemoPage() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);
    const spins = 5 + Math.random() * 5;
    const extra = Math.random() * 360;
    const newRot = rotation + spins * 360 + extra;
    setRotation(newRot);
    setTimeout(() => {
      const normalized = ((newRot % 360) + 360) % 360;
      const segAngle = 360 / SEGMENTS.length;
      const idx = Math.floor(((360 - normalized) % 360) / segAngle) % SEGMENTS.length;
      setWinner(SEGMENTS[idx]);
      setSpinning(false);
    }, 2100);
  };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", background: "#fff", borderBottom: "1px solid #E2E8F0",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
            Visium<span style={{ color: "#2563EB" }}>Boost</span>
          </span>
        </Link>
        <Link href="/register" style={{
          padding: "9px 20px", borderRadius: 10,
          background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
          color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14,
        }}>
          Créer mon compte
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ padding: "64px 24px 48px", textAlign: "center" }}>
        <span style={{
          display: "inline-block", background: "#EFF6FF", color: "#2563EB",
          padding: "5px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700,
          marginBottom: 20, border: "1px solid #BFDBFE",
        }}>
          Démo interactive
        </span>
        <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, color: "#0F172A", margin: "0 0 16px", letterSpacing: "-1px", lineHeight: 1.1 }}>
          Voyez l&apos;expérience<br />
          <span style={{ color: "#2563EB" }}>VisiumBoost</span> en direct
        </h1>
        <p style={{ fontSize: 16, color: "#64748B", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          Voici ce que vivent vos clients après avoir laissé un avis Google. Tournez la roue !
        </p>
      </section>

      {/* Demo section */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48,
          alignItems: "center",
          background: "#fff", borderRadius: 24, padding: "48px",
          border: "1.5px solid #E2E8F0",
          boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
        }}
          className="demo-grid"
        >
          {/* Left: description */}
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
              Une expérience<br />mémorable pour vos clients
            </h2>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, margin: "0 0 24px" }}>
              Après avoir laissé un avis Google, votre client reçoit un code unique.
              Il tourne la roue et découvre instantanément sa récompense.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              {["Roue personnalisée à vos couleurs", "Codes anti-fraude uniques", "Récompenses configurables", "Statistiques en temps réel"].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 24px", borderRadius: 12,
              background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
              color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 15,
              boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
            }}>
              Créer ma roue gratuitement →
            </Link>
          </div>

          {/* Right: wheel */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <WheelSVG rotation={rotation} />
            <button
              onClick={handleSpin}
              disabled={spinning}
              style={{
                padding: "14px 40px", borderRadius: 14, border: "none",
                background: spinning ? "#CBD5E1" : "linear-gradient(135deg, #2563EB, #0EA5E9)",
                color: spinning ? "#94A3B8" : "#fff",
                fontWeight: 800, fontSize: 18, cursor: spinning ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans',system-ui,sans-serif",
                boxShadow: spinning ? "none" : "0 6px 20px rgba(37,99,235,0.35)",
                transition: "all 0.2s", letterSpacing: "0.5px",
              }}
            >
              {spinning ? "En cours…" : "Tourner"}
            </button>
            {winner && (
              <div style={{
                padding: "16px 24px", borderRadius: 14,
                background: "#F0FDF4", border: "2px solid #BBF7D0",
                textAlign: "center",
              }}>
                <p style={{ margin: "0 0 4px", fontWeight: 800, color: "#166534", fontSize: 16 }}>
                  Félicitations !
                </p>
                <p style={{ margin: 0, color: "#15803D", fontSize: 14, fontWeight: 600 }}>
                  Vous avez gagné : <strong>{winner.label}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .demo-grid { grid-template-columns: 1fr !important; padding: 28px !important; }
          }
        `}</style>
      </section>

      {/* Features */}
      <section style={{ background: "#fff", borderTop: "1px solid #E2E8F0", padding: "64px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Tout ce qu&apos;il vous faut
          </h2>
          <p style={{ textAlign: "center", color: "#64748B", fontSize: 15, marginBottom: 40 }}>
            Une solution complète pour transformer vos clients en ambassadeurs
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                padding: "28px 24px", borderRadius: 18,
                border: "1.5px solid #E2E8F0", background: "#F8FAFC",
              }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "64px 24px", textAlign: "center", background: "#0F172A" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
          Prêt à booster vos avis ?
        </h2>
        <p style={{ fontSize: 16, color: "#94A3B8", marginBottom: 32 }}>
          14 jours d&apos;essai gratuit — aucune carte bancaire requise
        </p>
        <Link href="/register" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "16px 36px", borderRadius: 14,
          background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
          color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 16,
          boxShadow: "0 8px 28px rgba(37,99,235,0.4)",
        }}>
          Démarrer mon essai gratuit →
        </Link>
      </section>
    </div>
  );
}
