"use client";

import { useState, useEffect, useRef } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://visium-boost.fr";

const PAPER = {
  a4p: { W: 595, H: 842, label: "A4 Portrait",  pdfFmt: "a4", pdfOri: "portrait"  },
  a5:  { W: 420, H: 595, label: "A5 Portrait",  pdfFmt: "a5", pdfOri: "portrait"  },
  sq:  { W: 600, H: 600, label: "Carré 20×20 cm", pdfFmt: [200, 200], pdfOri: "portrait" },
};

const TEMPLATES = [
  { id: "bold",      name: "Bold",        desc: "Grand titre noir, impact maximal",     thumb: "#0F172A" },
  { id: "luxe",      name: "Luxe",        desc: "Fond noir, typographie dorée",          thumb: "#080808" },
  { id: "gradient",  name: "Gradient",    desc: "Dégradé bleu-violet, design SaaS",     thumb: "linear-gradient(135deg,#2563EB,#7C3AED)" },
  { id: "classique", name: "Classique",   desc: "Fond blanc, cadre élégant, serif",      thumb: "#FFFFFF" },
  { id: "neon",      name: "Neon",        desc: "Fond sombre, texte lumineux néon",      thumb: "#0A0A1E" },
  { id: "ardoise",   name: "Ardoise",     desc: "Tableau noir, ambiance bistrot",        thumb: "#1E2D3D" },
];

// ── Shared QR placeholder ──────────────────────────────────────────
function QrPlaceholder({ size, color = "#CBD5E1" }) {
  const cells = [0,1,5,6,10,14,15,19,20,21,23,24];
  return (
    <div style={{
      width: size, height: size,
      display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2,
      padding: 6, boxSizing: "border-box",
    }}>
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} style={{ background: cells.includes(i) ? color : "transparent", borderRadius: 1 }} />
      ))}
    </div>
  );
}

// ── Decorative Fortune Wheel ─────────────────────────────────────
function WheelDecor({ size, primaryColor }) {
  const pc = primaryColor || "#2563EB";
  const N = 8;
  const deg = 360 / N;

  // Alternating: full color / semi-transparent white
  const seg = Array.from({ length: N }, (_, i) =>
    `${i % 2 === 0 ? pc : "rgba(255,255,255,0.85)"} ${i * deg}deg ${(i + 1) * deg}deg`
  ).join(", ");

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Outer shadow ring */}
      <div style={{
        position: "absolute", inset: -3, borderRadius: "50%",
        boxShadow: `0 0 0 3px ${pc}40, 0 6px 28px rgba(0,0,0,0.28)`,
        pointerEvents: "none",
      }} />

      {/* Wheel disc */}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `conic-gradient(${seg})`,
        position: "relative", overflow: "hidden",
      }}>
        {/* Segment dividers */}
        {Array.from({ length: N }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: "50%", height: 2,
            background: "rgba(255,255,255,0.7)",
            transformOrigin: "0 50%",
            transform: `rotate(${i * deg}deg)`,
            marginTop: -1,
          }} />
        ))}

        {/* Stars in colored segments */}
        {Array.from({ length: N / 2 }).map((_, i) => {
          const angleDeg = i * deg * 2 + deg / 2;
          const angleRad = (angleDeg - 90) * (Math.PI / 180);
          const r = size * 0.33;
          const x = size / 2 + r * Math.cos(angleRad);
          const y = size / 2 + r * Math.sin(angleRad);
          return (
            <div key={i} style={{
              position: "absolute",
              left: x, top: y,
              transform: "translate(-50%,-50%)",
              fontSize: size * 0.09,
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1,
              pointerEvents: "none",
            }}>★</div>
          );
        })}
      </div>

      {/* Outer border ring */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: `${size * 0.03}px solid rgba(255,255,255,0.5)`,
        pointerEvents: "none",
      }} />

      {/* Center hub */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: size * 0.22, height: size * 0.22,
        borderRadius: "50%", background: "#fff",
        transform: "translate(-50%,-50%)",
        boxShadow: `0 2px 10px rgba(0,0,0,0.25), 0 0 0 2px ${pc}50`,
        zIndex: 2,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: size * 0.09, height: size * 0.09, borderRadius: "50%", background: pc }} />
      </div>

      {/* Pointer triangle (top) */}
      <div style={{
        position: "absolute", top: -size * 0.06, left: "50%",
        transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: `${size * 0.06}px solid transparent`,
        borderRight: `${size * 0.06}px solid transparent`,
        borderTop: `${size * 0.1}px solid #fff`,
        filter: `drop-shadow(0 2px 3px rgba(0,0,0,0.3))`,
        zIndex: 3,
      }} />
    </div>
  );
}

// ── Logo badge ────────────────────────────────────────────────────
function LogoBadge({ logo, nom, size, color, bg, border }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg || "rgba(255,255,255,0.1)",
      border: border || "2px solid rgba(255,255,255,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", flexShrink: 0,
    }}>
      {logo
        ? <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        : <span style={{ fontSize: size * 0.4, fontWeight: 900, color: color || "#fff" }}>
            {(nom || "?").charAt(0).toUpperCase()}
          </span>
      }
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 1. BOLD — Noir + blanc, typographie énorme
// ══════════════════════════════════════════════════════════════════
function PosterBold({ W, H, nom, logo, qrDataUrl, primaryColor, headline, subheadline, customText, showWheel }) {
  const pc = primaryColor || "#2563EB";
  const qSize = Math.round(W * 0.5);
  const headLines = (headline || "LAISSEZ UN AVIS GOOGLE").split("\n");

  return (
    <div style={{
      width: W, height: H, background: "#0F172A",
      fontFamily: "'Inter','DM Sans',system-ui,sans-serif",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      {/* Color accent bar top */}
      <div style={{ width: "100%", height: 8, background: pc, flexShrink: 0 }} />

      {/* Top section — establishment + headline */}
      <div style={{ padding: "28px 44px 0", flexShrink: 0 }}>
        {/* Logo + name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <LogoBadge logo={logo} nom={nom} size={44} color={pc} bg={`${pc}20`} border={`2px solid ${pc}60`} />
          <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: 1, textTransform: "uppercase" }}>
            {nom || "Mon Établissement"}
          </div>
        </div>

        {/* BIG HEADLINE */}
        {headLines.map((line, i) => (
          <div key={i} style={{
            fontSize: line.length > 16 ? 52 : 62,
            fontWeight: 900,
            color: i === headLines.length - 1 ? pc : "#FFFFFF",
            lineHeight: 1.0,
            letterSpacing: -1,
            marginBottom: 6,
          }}>
            {line || "\u00A0"}
          </div>
        ))}

        {/* Sub-headline */}
        <div style={{ fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.55)", marginTop: 14, lineHeight: 1.3 }}>
          {subheadline || "et tentez de gagner un cadeau !"}
        </div>

        {/* Accent divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
          <div style={{ width: 44, height: 3, background: pc, borderRadius: 2 }} />
          <div style={{ width: 8, height: 8, background: pc, borderRadius: "50%", opacity: 0.5 }} />
        </div>
      </div>

      {/* QR section — centered */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 32px", gap: showWheel ? 24 : 0 }}>
        {showWheel && <WheelDecor size={Math.round(qSize * 0.82)} primaryColor={pc} />}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            background: "#fff", padding: 18, borderRadius: 16,
            boxShadow: `0 0 0 4px ${pc}30, 0 8px 40px rgba(0,0,0,0.5)`,
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block" }} />
              : <QrPlaceholder size={qSize} color="#0F172A" />
            }
          </div>
          <div style={{ marginTop: 20, fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.75)", textAlign: "center" }}>
            {customText || "Scannez pour participer →"}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "14px 44px", borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
      }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase" }}>
          Propulsé par VisiumBoost
        </div>
        <div style={{ width: 28, height: 3, background: pc, borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. LUXE — Noir + or
// ══════════════════════════════════════════════════════════════════
function PosterLuxe({ W, H, nom, logo, qrDataUrl, primaryColor, headline, subheadline, customText, showWheel }) {
  const gold = "#C9A84C";
  const qSize = Math.round(W * 0.46);
  const headLines = (headline || "OFFREZ-VOUS\nUN CADEAU").split("\n");

  return (
    <div style={{
      width: W, height: H, background: "#080808",
      fontFamily: "'Georgia','Times New Roman',serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      {/* Double gold frame */}
      <div style={{ position: "absolute", inset: 14, border: `1px solid ${gold}35`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 20, border: `1px solid ${gold}18`, pointerEvents: "none" }} />

      {/* Corner ornaments */}
      {[[0,0],[1,0],[0,1],[1,1]].map(([rx,ry], i) => (
        <div key={i} style={{
          position: "absolute",
          top: ry ? undefined : 10, bottom: ry ? 10 : undefined,
          left: rx ? undefined : 10, right: rx ? 10 : undefined,
          width: 24, height: 24,
          borderTop: !ry ? `1.5px solid ${gold}` : "none",
          borderBottom: ry ? `1.5px solid ${gold}` : "none",
          borderLeft: !rx ? `1.5px solid ${gold}` : "none",
          borderRight: rx ? `1.5px solid ${gold}` : "none",
        }} />
      ))}

      {/* Diamond top ornament */}
      <div style={{ marginTop: 44, width: 22, height: 22, border: `1px solid ${gold}`, transform: "rotate(45deg)", flexShrink: 0 }} />

      {/* Logo + name */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20, marginBottom: 20, padding: "0 52px", flexShrink: 0 }}>
        <LogoBadge logo={logo} nom={nom} size={56} color={gold} bg="#111" border={`1.5px solid ${gold}80`} />
        <div style={{ marginTop: 12, fontSize: 12, color: gold, letterSpacing: 5, textTransform: "uppercase", textAlign: "center" }}>
          {nom || "MON ÉTABLISSEMENT"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <div style={{ width: 32, height: 1, background: `${gold}60` }} />
          <div style={{ width: 4, height: 4, background: gold, transform: "rotate(45deg)" }} />
          <div style={{ width: 32, height: 1, background: `${gold}60` }} />
        </div>
      </div>

      {/* BIG HEADLINE */}
      <div style={{ padding: "0 48px", textAlign: "center", flexShrink: 0 }}>
        {headLines.map((line, i) => (
          <div key={i} style={{
            fontSize: line.length > 14 ? 48 : 56,
            fontWeight: 700,
            color: gold,
            lineHeight: 1.08,
            letterSpacing: 3,
            textTransform: "uppercase",
            textShadow: `0 0 30px ${gold}40`,
          }}>
            {line || "\u00A0"}
          </div>
        ))}
        <div style={{ fontSize: 16, color: `${gold}99`, fontStyle: "italic", marginTop: 12, letterSpacing: 1.5 }}>
          {subheadline || "laissez un avis Google pour participer"}
        </div>
      </div>

      {/* QR */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: showWheel ? 24 : 0 }}>
        {showWheel && <WheelDecor size={Math.round(qSize * 0.82)} primaryColor={gold} />}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            padding: 16, background: "#111",
            border: `1.5px solid ${gold}50`,
            boxShadow: `0 0 40px ${gold}18`,
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block", filter: "invert(1) sepia(1) saturate(1.5) hue-rotate(5deg) brightness(0.75)" }} />
              : <QrPlaceholder size={qSize} color={gold} />
            }
          </div>
          <div style={{ fontSize: 13, color: `${gold}AA`, fontStyle: "italic", letterSpacing: 2, marginTop: 14, textAlign: "center" }}>
            {customText || "Scannez le QR code pour participer"}
          </div>
        </div>
      </div>

      {/* Diamond bottom ornament */}
      <div style={{ width: 16, height: 16, border: `1px solid ${gold}50`, transform: "rotate(45deg)", marginBottom: 10, flexShrink: 0 }} />
      <div style={{ fontSize: 9, color: `${gold}40`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28, flexShrink: 0 }}>
        Propulsé par VisiumBoost
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. GRADIENT — Dégradé bleu-violet moderne
// ══════════════════════════════════════════════════════════════════
function PosterGradient({ W, H, nom, logo, qrDataUrl, primaryColor, headline, subheadline, customText, showWheel }) {
  const pc = primaryColor || "#2563EB";
  const qSize = Math.round(W * 0.48);
  const headLines = (headline || "GAGNEZ\nUN CADEAU !").split("\n");

  return (
    <div style={{
      width: W, height: H,
      background: `linear-gradient(150deg, ${pc} 0%, #7C3AED 60%, #0EA5E9 100%)`,
      fontFamily: "'Inter','DM Sans',system-ui,sans-serif",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      {/* Glow blobs */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(0,0,0,0.15)", pointerEvents: "none" }} />

      {/* Top section */}
      <div style={{ padding: "36px 44px 0", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
          <LogoBadge logo={logo} nom={nom} size={46} color="#fff" bg="rgba(255,255,255,0.15)" border="2px solid rgba(255,255,255,0.4)" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: 0.5 }}>
              {nom || "Mon Établissement"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>Expérience client</div>
          </div>
        </div>

        {/* BIG HEADLINE */}
        {headLines.map((line, i) => (
          <div key={i} style={{
            fontSize: line.length > 12 ? 60 : 72,
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 0.95,
            letterSpacing: -1.5,
            textShadow: "0 4px 20px rgba(0,0,0,0.25)",
          }}>
            {line || "\u00A0"}
          </div>
        ))}

        <div style={{
          marginTop: 18, fontSize: 20, fontWeight: 600,
          color: "rgba(255,255,255,0.80)", lineHeight: 1.4,
        }}>
          {subheadline || "Laissez un avis Google et tentez votre chance"}
        </div>

        {/* Tag */}
        <div style={{
          marginTop: 18, display: "inline-flex", alignItems: "center",
          background: "rgba(255,255,255,0.15)", borderRadius: 99,
          padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "#fff",
          backdropFilter: "blur(4px)",
        }}>
          🎁 Cadeau à gagner
        </div>
      </div>

      {/* QR */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, gap: showWheel ? 24 : 0 }}>
        {showWheel && <WheelDecor size={Math.round(qSize * 0.82)} primaryColor={pc} />}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            background: "#fff", padding: 16, borderRadius: 20,
            boxShadow: "0 12px 60px rgba(0,0,0,0.4), 0 0 0 6px rgba(255,255,255,0.2)",
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block", borderRadius: 6 }} />
              : <QrPlaceholder size={qSize} color="#7C3AED" />
            }
          </div>
          <div style={{ marginTop: 18, fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", textAlign: "center" }}>
            {customText || "Scannez pour participer →"}
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 44px", textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.35)", flexShrink: 0, position: "relative", zIndex: 1 }}>
        Propulsé par VisiumBoost
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. CLASSIQUE — Blanc, serif, élégant
// ══════════════════════════════════════════════════════════════════
function PosterClassique({ W, H, nom, logo, qrDataUrl, primaryColor, headline, subheadline, customText, showWheel }) {
  const accent = primaryColor || "#B8966E";
  const qSize = Math.round(W * 0.48);
  const headLines = (headline || "LAISSEZ UN\nAVIS GOOGLE").split("\n");

  return (
    <div style={{
      width: W, height: H, background: "#FFFFFF",
      fontFamily: "'Georgia','Times New Roman',serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      {/* Frame */}
      <div style={{ position: "absolute", inset: 18, border: `1px solid ${accent}40`, pointerEvents: "none" }} />
      {[[0,0],[1,0],[0,1],[1,1]].map(([rx,ry], i) => (
        <div key={i} style={{
          position: "absolute",
          top: ry ? undefined : 14, bottom: ry ? 14 : undefined,
          left: rx ? undefined : 14, right: rx ? 14 : undefined,
          width: 20, height: 20,
          borderTop: !ry ? `2px solid ${accent}` : "none",
          borderBottom: ry ? `2px solid ${accent}` : "none",
          borderLeft: !rx ? `2px solid ${accent}` : "none",
          borderRight: rx ? `2px solid ${accent}` : "none",
        }} />
      ))}

      {/* Logo + name */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "42px 48px 0", flexShrink: 0 }}>
        <LogoBadge logo={logo} nom={nom} size={60} color={accent} bg={`${accent}10`} border={`2px solid ${accent}50`} />
        <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: "#374151", letterSpacing: 3, textTransform: "uppercase", textAlign: "center" }}>
          {nom || "Mon Établissement"}
        </div>
        {/* Ornament */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
          <div style={{ width: 40, height: 1, background: `${accent}60` }} />
          <div style={{ fontSize: 12, color: accent }}>✦</div>
          <div style={{ width: 40, height: 1, background: `${accent}60` }} />
        </div>
      </div>

      {/* BIG HEADLINE */}
      <div style={{ padding: "24px 52px 0", textAlign: "center", flexShrink: 0 }}>
        {headLines.map((line, i) => (
          <div key={i} style={{
            fontSize: line.length > 14 ? 46 : 54,
            fontWeight: 700,
            color: "#1E293B",
            lineHeight: 1.1,
            letterSpacing: 1,
          }}>
            {line || "\u00A0"}
          </div>
        ))}
        <div style={{ fontSize: 18, fontStyle: "italic", color: accent, marginTop: 12, lineHeight: 1.4 }}>
          {subheadline || "et tentez de gagner un cadeau"}
        </div>
      </div>

      {/* QR */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: showWheel ? 24 : 0 }}>
        {showWheel && <WheelDecor size={Math.round(qSize * 0.82)} primaryColor={accent} />}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            padding: 16, background: "#fff",
            boxShadow: `0 4px 24px ${accent}20, 0 1px 8px rgba(0,0,0,0.08)`,
            border: `1px solid ${accent}25`,
            borderRadius: 10,
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block" }} />
              : <QrPlaceholder size={qSize} color={accent} />
            }
          </div>
          <div style={{ marginTop: 16, fontSize: 14, fontStyle: "italic", color: "#374151", textAlign: "center", maxWidth: W - 80 }}>
            {customText || "Scannez le QR code pour participer"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0 20px", flexShrink: 0 }}>
        <div style={{ width: 28, height: 1, background: `${accent}40` }} />
        <div style={{ fontSize: 9, color: "#94A3B8", letterSpacing: 1, textTransform: "uppercase" }}>Propulsé par VisiumBoost</div>
        <div style={{ width: 28, height: 1, background: `${accent}40` }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 5. NEON — Fond sombre, texte lumineux
// ══════════════════════════════════════════════════════════════════
function PosterNeon({ W, H, nom, logo, qrDataUrl, primaryColor, headline, subheadline, customText, showWheel }) {
  const pc = primaryColor || "#00F5A0";
  const qSize = Math.round(W * 0.48);
  const headLines = (headline || "TOURNEZ\nLA ROUE !").split("\n");

  return (
    <div style={{
      width: W, height: H, background: "#0A0A1E",
      fontFamily: "'Inter','DM Sans',system-ui,sans-serif",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      {/* Grid lines background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${pc}08 1px, transparent 1px), linear-gradient(90deg, ${pc}08 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", background: `${pc}08`, filter: "blur(60px)", pointerEvents: "none" }} />

      {/* Top */}
      <div style={{ padding: "32px 44px 0", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
          <LogoBadge logo={logo} nom={nom} size={42} color={pc} bg={`${pc}15`} border={`2px solid ${pc}50`} />
          <div style={{ fontSize: 13, fontWeight: 700, color: `${pc}CC`, letterSpacing: 2, textTransform: "uppercase" }}>
            {nom || "Mon Établissement"}
          </div>
        </div>

        {/* BIG HEADLINE */}
        {headLines.map((line, i) => (
          <div key={i} style={{
            fontSize: line.length > 10 ? 64 : 76,
            fontWeight: 900,
            color: pc,
            lineHeight: 0.95,
            letterSpacing: -1,
            textShadow: `0 0 20px ${pc}60, 0 0 60px ${pc}30`,
          }}>
            {line || "\u00A0"}
          </div>
        ))}

        <div style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.55)", marginTop: 16, lineHeight: 1.4 }}>
          {subheadline || "Laissez un avis Google et tentez votre chance"}
        </div>

        {/* Neon divider */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${pc}, transparent)`, marginTop: 22, width: "60%" }} />
      </div>

      {/* QR */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, gap: showWheel ? 24 : 0 }}>
        {showWheel && <WheelDecor size={Math.round(qSize * 0.82)} primaryColor={pc} />}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            background: "#fff", padding: 14, borderRadius: 12,
            boxShadow: `0 0 0 3px ${pc}40, 0 0 40px ${pc}25`,
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block" }} />
              : <QrPlaceholder size={qSize} color="#0A0A1E" />
            }
          </div>
          <div style={{
            marginTop: 18, fontSize: 14, fontWeight: 700,
            color: pc, textAlign: "center",
            textShadow: `0 0 12px ${pc}60`,
          }}>
            {customText || "Scannez pour participer →"}
          </div>
        </div>
      </div>

      <div style={{ padding: "10px 44px 22px", fontSize: 10, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: 2, flexShrink: 0, position: "relative", zIndex: 1 }}>
        Propulsé par VisiumBoost
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 6. ARDOISE — Tableau noir, craie
// ══════════════════════════════════════════════════════════════════
function PosterArdoise({ W, H, nom, logo, qrDataUrl, primaryColor, headline, subheadline, customText, showWheel }) {
  const chalk = "#EAE4D9";
  const bg = "#1B2B38";
  const qSize = Math.round(W * 0.46);
  const headLines = (headline || "LAISSEZ\nUN AVIS !").split("\n");

  return (
    <div style={{
      width: W, height: H, background: bg,
      fontFamily: "'Courier New','DM Mono',monospace",
      display: "flex", flexDirection: "column", alignItems: "center",
      boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      {/* Chalk border */}
      <div style={{ position: "absolute", inset: 16, border: `2px dashed ${chalk}35`, pointerEvents: "none" }} />

      {/* Chalk stars */}
      {[["7%","8%"],["89%","7%"],["4%","50%"],["92%","50%"],["7%","87%"],["89%","85%"]].map(([x,y],i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y, color: `${chalk}35`, fontSize: 13, pointerEvents: "none" }}>✦</div>
      ))}

      {/* Logo + name */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "42px 48px 0", flexShrink: 0 }}>
        <LogoBadge logo={logo} nom={nom} size={58} color={chalk} bg={`${chalk}08`} border={`2px dashed ${chalk}60`} />
        <div style={{ marginTop: 12, fontSize: 13, color: chalk, letterSpacing: 4, textTransform: "uppercase", opacity: 0.85, textAlign: "center" }}>
          {nom || "Mon Établissement"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
          <div style={{ width: 26, height: 1, background: `${chalk}45` }} />
          <div style={{ fontSize: 11, color: `${chalk}60` }}>✦</div>
          <div style={{ width: 26, height: 1, background: `${chalk}45` }} />
        </div>
      </div>

      {/* BIG HEADLINE */}
      <div style={{ padding: "24px 52px 0", textAlign: "center", flexShrink: 0 }}>
        {headLines.map((line, i) => (
          <div key={i} style={{
            fontSize: line.length > 10 ? 58 : 70,
            fontWeight: 700,
            color: chalk,
            lineHeight: 1.0,
            letterSpacing: 2,
            textShadow: `0 0 16px ${chalk}25`,
            opacity: 0.95,
          }}>
            {line || "\u00A0"}
          </div>
        ))}
        <div style={{ fontSize: 17, color: chalk, opacity: 0.65, fontStyle: "italic", marginTop: 12, lineHeight: 1.4 }}>
          {subheadline || "et tentez de gagner un cadeau"}
        </div>
      </div>

      {/* QR */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: showWheel ? 24 : 0 }}>
        {showWheel && <WheelDecor size={Math.round(qSize * 0.82)} primaryColor={chalk} />}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            padding: 14, border: `2px dashed ${chalk}60`,
            background: `${chalk}05`,
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block", filter: "invert(1) opacity(0.9)" }} />
              : <QrPlaceholder size={qSize} color={chalk} />
            }
          </div>
          <div style={{ marginTop: 16, fontSize: 14, color: chalk, opacity: 0.75, textAlign: "center", lineHeight: 1.5 }}>
            {customText || "Scannez le QR code pour participer"}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 9, color: `${chalk}35`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 26, flexShrink: 0 }}>
        Propulsé par VisiumBoost
      </div>
    </div>
  );
}

// ── Poster router ──────────────────────────────────────────────────
const POSTER_MAP = {
  bold:      PosterBold,
  luxe:      PosterLuxe,
  gradient:  PosterGradient,
  classique: PosterClassique,
  neon:      PosterNeon,
  ardoise:   PosterArdoise,
};

function Poster({ tplId, ...props }) {
  const C = POSTER_MAP[tplId] || PosterBold;
  return <C {...props} />;
}

// ════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════
export default function PageAffiches() {
  const [entreprises,  setEntreprises]  = useState([]);
  const [selectedEnt,  setSelectedEnt]  = useState(null);
  const [selectedTpl,  setSelectedTpl]  = useState(null);
  const [format,       setFormat]       = useState("a4p");
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [headline,     setHeadline]     = useState("LAISSEZ UN\nAVIS GOOGLE");
  const [subheadline,  setSubheadline]  = useState("et tentez de gagner un cadeau !");
  const [customText,   setCustomText]   = useState("Scannez le QR code pour participer");
  const [qrDataUrl,    setQrDataUrl]    = useState("");
  const [qrThumb,      setQrThumb]      = useState("");
  const [showWheel,    setShowWheel]    = useState(false);
  const [downloading,  setDownloading]  = useState(false);
  const [loading,      setLoading]      = useState(true);

  const posterRef = useRef(null);

  useEffect(() => {
    fetch("/api/entreprises")
      .then(r => r.json())
      .then(d => {
        const list = d.entreprises || [];
        setEntreprises(list);
        if (list.length > 0) {
          setSelectedEnt(list[0]);
          setPrimaryColor(list[0].couleur_principale || "#2563EB");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedEnt?.slug) return;
    const url = `${APP_URL}/roue/${selectedEnt.slug}`;
    import("qrcode").then(QR => {
      QR.toDataURL(url, { width: 480, margin: 1, errorCorrectionLevel: "H" }).then(setQrDataUrl);
      QR.toDataURL(url, { width: 160, margin: 1 }).then(setQrThumb);
    });
  }, [selectedEnt]);

  const handleDownloadPDF = async () => {
    if (!posterRef.current) return;
    setDownloading("pdf");
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(posterRef.current, {
        scale: 2, useCORS: true, allowTaint: true, backgroundColor: null, logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.96);
      const paper = PAPER[format];
      const isCustom = Array.isArray(paper.pdfFmt);
      const pdf = isCustom
        ? new jsPDF({ orientation: "portrait", unit: "mm", format: paper.pdfFmt })
        : new jsPDF({ orientation: paper.pdfOri, unit: "mm", format: paper.pdfFmt });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, pw, ph);
      pdf.save(`affiche-${selectedTpl}-${format}.pdf`);
    } catch(e) {
      console.error("PDF error:", e);
      alert("Erreur lors de la génération du PDF. Réessayez.");
    }
    setDownloading(false);
  };

  const handleDownloadPNG = async () => {
    if (!posterRef.current) return;
    setDownloading("png");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(posterRef.current, {
        scale: 3, useCORS: true, allowTaint: true, logging: false,
      });
      const link = document.createElement("a");
      link.download = `affiche-${selectedTpl}-${format}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch(e) {
      console.error("PNG error:", e);
    }
    setDownloading(false);
  };

  const paper = PAPER[format];
  const PREVIEW_H = 520;
  const previewScale = PREVIEW_H / paper.H;

  const inp = {
    width: "100%", padding: "9px 12px", borderRadius: 9, border: "1.5px solid #E2E8F0",
    fontSize: 13, outline: "none", background: "#fff", color: "#0F172A",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  const POSTER_PROPS = {
    W: paper.W, H: paper.H,
    nom: selectedEnt?.nom || "",
    logo: selectedEnt?.logo || "",
    qrDataUrl,
    primaryColor,
    headline,
    subheadline,
    customText,
    showWheel,
  };

  if (loading) return (
    <div className="animate-fade-in">
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900 tracking-tight">Affiches à imprimer</h1></div>
      <div className="card p-12 text-center text-slate-300 text-sm">Chargement…</div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Affiches à imprimer</h1>
          <p className="text-slate-400 text-sm mt-1">Choisissez un template, personnalisez les textes, téléchargez en PDF ou PNG.</p>
        </div>
        {entreprises.length > 1 && (
          <select
            value={selectedEnt?._id || ""}
            onChange={e => {
              const ent = entreprises.find(x => x._id === e.target.value);
              if (ent) { setSelectedEnt(ent); setPrimaryColor(ent.couleur_principale || "#2563EB"); }
            }}
            style={{ ...inp, width: "auto", minWidth: 200, cursor: "pointer" }}
          >
            {entreprises.map(e => <option key={e._id} value={e._id}>{e.nom}</option>)}
          </select>
        )}
      </div>

      {/* Template grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
        {TEMPLATES.map(tpl => (
          <div
            key={tpl.id}
            onClick={() => setSelectedTpl(tpl.id)}
            style={{
              background: "#fff", borderRadius: 18, overflow: "hidden",
              border: "1.5px solid #E8ECF0", cursor: "pointer",
              transition: "all 0.18s", boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)"; }}
          >
            {/* Live mini preview */}
            <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
              <div style={{
                width: PAPER.a4p.W, height: PAPER.a4p.H,
                transform: `scale(${244 / PAPER.a4p.W})`,
                transformOrigin: "top left",
                pointerEvents: "none",
              }}>
                <Poster
                  tplId={tpl.id}
                  W={PAPER.a4p.W} H={PAPER.a4p.H}
                  nom={selectedEnt?.nom || "Mon Établissement"}
                  logo={selectedEnt?.logo || ""}
                  qrDataUrl={qrThumb}
                  primaryColor={selectedEnt?.couleur_principale || "#2563EB"}
                  headline={headline}
                  subheadline={subheadline}
                  customText={customText}
                />
              </div>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{tpl.name}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{tpl.desc}</div>
              </div>
              <button style={{
                padding: "6px 14px", borderRadius: 9, border: "none",
                background: "#2563EB", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>
                Ouvrir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ════ EDITOR MODAL ════ */}
      {selectedTpl && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 16, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#fff", borderRadius: 22, maxWidth: 1120, width: "100%",
            maxHeight: "96vh", display: "flex", flexDirection: "column",
            overflow: "hidden", boxShadow: "0 32px 96px rgba(0,0,0,0.28)",
          }}>
            {/* Modal header */}
            <div style={{ padding: "15px 22px", borderBottom: "1.5px solid #F0F0F5", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                  Affiche — {TEMPLATES.find(t => t.id === selectedTpl)?.name}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                  {selectedEnt?.nom || "Établissement"} · {paper.label}
                </div>
              </div>
              {/* Template switcher */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTpl(t.id)}
                    style={{
                      padding: "4px 12px", borderRadius: 8, border: `1.5px solid ${selectedTpl === t.id ? "#2563EB" : "#E2E8F0"}`,
                      background: selectedTpl === t.id ? "#EFF6FF" : "#fff",
                      color: selectedTpl === t.id ? "#1D4ED8" : "#64748B",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
              <button onClick={() => setSelectedTpl(null)} style={{ width: 34, height: 34, borderRadius: 9, border: "none", background: "#F1F5F9", cursor: "pointer", fontSize: 18, color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>

            <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
              {/* LEFT: Preview */}
              <div style={{
                flex: 1, overflowY: "auto", background: "#E8ECF0",
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "28px 28px 28px",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 14, alignSelf: "flex-start" }}>
                  Aperçu — {paper.label}
                </div>

                {/* Hidden full-size for capture */}
                <div style={{ position: "fixed", left: -9999, top: -9999, zIndex: -1 }}>
                  <div ref={posterRef}>
                    <Poster tplId={selectedTpl} {...POSTER_PROPS} />
                  </div>
                </div>

                {/* Scaled preview */}
                <div style={{
                  width: Math.round(paper.W * previewScale),
                  height: PREVIEW_H,
                  overflow: "hidden",
                  boxShadow: "0 12px 48px rgba(0,0,0,0.25)",
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: paper.W, height: paper.H,
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top left",
                  }}>
                    <Poster tplId={selectedTpl} {...POSTER_PROPS} />
                  </div>
                </div>
              </div>

              {/* RIGHT: Controls */}
              <div style={{
                width: 310, flexShrink: 0, borderLeft: "1.5px solid #F0F0F5",
                overflowY: "auto", padding: "22px 18px",
                display: "flex", flexDirection: "column", gap: 22,
              }}>

                {/* === TEXTES === */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 12 }}>
                    ✏️ Textes de l&apos;affiche
                  </div>

                  {/* Headline */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                      Titre principal <span style={{ color: "#94A3B8", fontWeight: 400 }}>— grand texte</span>
                    </label>
                    <textarea
                      value={headline}
                      onChange={e => setHeadline(e.target.value)}
                      rows={2}
                      placeholder="LAISSEZ UN&#10;AVIS GOOGLE"
                      style={{ ...inp, resize: "vertical", lineHeight: 1.5, fontWeight: 700, fontSize: 14 }}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                    <p style={{ fontSize: 10, color: "#94A3B8", margin: "3px 0 0" }}>↵ Entrée pour couper en 2 lignes</p>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                      {["LAISSEZ UN\nAVIS GOOGLE","GAGNEZ\nUN CADEAU !","TOURNEZ\nLA ROUE !","SCANNEZ &\nGAGNEZ !"].map(s => (
                        <button key={s} onClick={() => setHeadline(s)} style={{
                          padding: "3px 9px", borderRadius: 6, border: "1.5px solid #E2E8F0",
                          background: headline === s ? "#EFF6FF" : "#F8FAFC",
                          color: headline === s ? "#2563EB" : "#64748B",
                          fontSize: 10, fontWeight: 600, cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                        }}>
                          {s.replace("\n", " / ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subheadline */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                      Sous-titre <span style={{ color: "#94A3B8", fontWeight: 400 }}>— texte secondaire</span>
                    </label>
                    <input
                      value={subheadline}
                      onChange={e => setSubheadline(e.target.value)}
                      placeholder="et tentez de gagner un cadeau !"
                      style={inp}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>

                  {/* CTA */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                      CTA sous le QR
                    </label>
                    <input
                      value={customText}
                      onChange={e => setCustomText(e.target.value)}
                      placeholder="Scannez le QR code pour participer"
                      style={inp}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                      {["Scannez pour participer →","Scannez le QR code 👆","Avis Google = cadeau garanti 🎁"].map(s => (
                        <button key={s} onClick={() => setCustomText(s)} style={{
                          padding: "3px 9px", borderRadius: 6, border: "1.5px solid #E2E8F0",
                          background: "#F8FAFC", fontSize: 10, color: "#64748B", cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                        }}>
                          {s.length > 26 ? s.slice(0,26) + "…" : s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "#F1F5F9" }} />

                {/* === ROUE === */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10 }}>
                    🎡 Roue de la fortune
                  </div>
                  <button
                    onClick={() => setShowWheel(v => !v)}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 12,
                      border: `1.5px solid ${showWheel ? "#2563EB" : "#E2E8F0"}`,
                      background: showWheel ? "#EFF6FF" : "#F8FAFC",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {/* Mini wheel preview */}
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                        background: `conic-gradient(${primaryColor} 0deg 45deg, rgba(255,255,255,0.85) 45deg 90deg, ${primaryColor} 90deg 135deg, rgba(255,255,255,0.85) 135deg 180deg, ${primaryColor} 180deg 225deg, rgba(255,255,255,0.85) 225deg 270deg, ${primaryColor} 270deg 315deg, rgba(255,255,255,0.85) 315deg 360deg)`,
                        border: "2px solid #E2E8F0",
                        position: "relative",
                      }}>
                        <div style={{ position: "absolute", top: "50%", left: "50%", width: 8, height: 8, borderRadius: "50%", background: "#fff", transform: "translate(-50%,-50%)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: showWheel ? "#1D4ED8" : "#374151" }}>
                          Afficher la roue
                        </div>
                        <div style={{ fontSize: 10, color: "#94A3B8" }}>À côté du QR code</div>
                      </div>
                    </div>
                    {/* Toggle pill */}
                    <div style={{
                      width: 38, height: 22, borderRadius: 11,
                      background: showWheel ? "#2563EB" : "#E2E8F0",
                      position: "relative", transition: "background 0.2s", flexShrink: 0,
                    }}>
                      <div style={{
                        position: "absolute", top: 3,
                        left: showWheel ? 19 : 3,
                        width: 16, height: 16, borderRadius: "50%",
                        background: "#fff", transition: "left 0.2s",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      }} />
                    </div>
                  </button>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "#F1F5F9" }} />

                {/* === FORMAT === */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10 }}>Format</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {Object.entries(PAPER).map(([key, p]) => (
                      <label key={key} style={{
                        display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                        padding: "8px 12px", borderRadius: 10,
                        border: `1.5px solid ${format === key ? "#2563EB" : "#E2E8F0"}`,
                        background: format === key ? "#EFF6FF" : "#F8FAFC",
                        transition: "all 0.12s",
                      }}>
                        <input type="radio" name="format" value={key} checked={format === key}
                          onChange={() => setFormat(key)}
                          style={{ accentColor: "#2563EB", cursor: "pointer" }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: format === key ? 700 : 500, color: format === key ? "#1D4ED8" : "#374151" }}>{p.label}</div>
                          <div style={{ fontSize: 10, color: "#94A3B8" }}>
                            {key === "a4p" ? "210 × 297 mm" : key === "a5" ? "148 × 210 mm" : "200 × 200 mm"}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* === COULEUR === */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8 }}>Couleur principale</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                      style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2 }} />
                    <input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                      style={{ ...inp, flex: 1, fontFamily: "'DM Mono',monospace", fontSize: 12 }}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                  </div>
                  {/* Quick palette */}
                  <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                    {["#2563EB","#7C3AED","#EF4444","#F59E0B","#10B981","#EC4899","#C9A84C","#0F172A","#00F5A0"].map(c => (
                      <button key={c} onClick={() => setPrimaryColor(c)} style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: c, cursor: "pointer",
                        border: primaryColor === c ? "2.5px solid #2563EB" : "2px solid #E2E8F0",
                      }} />
                    ))}
                    {selectedEnt?.couleur_principale && selectedEnt.couleur_principale !== primaryColor && (
                      <button onClick={() => setPrimaryColor(selectedEnt.couleur_principale)} title="Couleur de la roue" style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: selectedEnt.couleur_principale, cursor: "pointer",
                        border: "2px solid #10B981",
                      }} />
                    )}
                  </div>
                </div>

                <div style={{ height: 1, background: "#F1F5F9" }} />

                {/* === DOWNLOAD === */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={!!downloading}
                    style={{
                      width: "100%", padding: "13px", borderRadius: 12, border: "none",
                      background: downloading === "pdf" ? "#93C5FD" : "#2563EB",
                      color: "#fff", fontWeight: 700, fontSize: 14,
                      cursor: downloading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s",
                    }}
                  >
                    {downloading === "pdf" ? (
                      <><span style={{ animation: "spin360 1s linear infinite", display: "inline-block" }}>⟳</span> Génération…</>
                    ) : (
                      <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Télécharger PDF</>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadPNG}
                    disabled={!!downloading}
                    style={{
                      width: "100%", padding: "11px", borderRadius: 12,
                      border: "1.5px solid #E2E8F0", background: downloading === "png" ? "#F1F5F9" : "#fff",
                      color: "#374151", fontWeight: 700, fontSize: 13,
                      cursor: downloading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s",
                    }}
                  >
                    {downloading === "png" ? "Génération PNG…" : (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Télécharger PNG haute résolution</>
                    )}
                  </button>
                </div>

                {/* QR info */}
                <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "11px 13px", border: "1.5px solid #E2E8F0" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>QR code → lien</div>
                  <div style={{ fontSize: 11, color: "#3B82F6", fontFamily: "'DM Mono',monospace", wordBreak: "break-all" }}>
                    {selectedEnt ? `${APP_URL}/roue/${selectedEnt.slug}` : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin360 { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
