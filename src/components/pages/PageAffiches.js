"use client";

import { useState, useEffect, useRef } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://visium-boost.fr";

// ── Paper dimensions (px at screen res, ratio matches real paper) ──────────
const PAPER = {
  a4p: { W: 595, H: 842, label: "A4 Portrait", pdfFmt: "a4", pdfOri: "portrait"  },
  a4l: { W: 842, H: 595, label: "A4 Paysage",  pdfFmt: "a4", pdfOri: "landscape" },
  a5:  { W: 420, H: 595, label: "A5 Portrait", pdfFmt: "a5", pdfOri: "portrait"  },
};

const CANVA_LINKS = {
  classique:   "https://www.canva.com/fr_fr/modeles/recherche/?query=affiche+restaurant+classique+elegant",
  festif:      "https://www.canva.com/fr_fr/modeles/recherche/?query=affiche+fete+festif+confettis",
  luxe:        "https://www.canva.com/fr_fr/modeles/recherche/?query=affiche+luxe+noir+or+premium",
  kawaii:      "https://www.canva.com/fr_fr/modeles/recherche/?query=affiche+kawaii+coloree+fun",
  minimaliste: "https://www.canva.com/fr_fr/modeles/recherche/?query=affiche+minimaliste+moderne",
  ardoise:     "https://www.canva.com/fr_fr/modeles/recherche/?query=affiche+tableau+noir+craie+bistrot",
};

const TEMPLATES = [
  { id: "classique",   name: "Classique",   emoji: "🏛️", desc: "Fond blanc, cadre élégant",      previewBg: "#FFFFFF", previewAccent: "#B8966E" },
  { id: "festif",      name: "Festif",       emoji: "🎉", desc: "Fond coloré, style fête",         previewBg: "linear-gradient(135deg,#7C3AED,#EC4899)", previewAccent: "#FFD93D" },
  { id: "luxe",        name: "Luxe",         emoji: "✨", desc: "Fond noir, texte doré, premium",  previewBg: "#0A0A0A", previewAccent: "#C9A84C" },
  { id: "kawaii",      name: "Kawaii",       emoji: "🌸", desc: "Style fun, coloré, jeune",        previewBg: "linear-gradient(135deg,#FFE4F3,#E8F4FF)", previewAccent: "#FF7EBB" },
  { id: "minimaliste", name: "Minimaliste",  emoji: "◻️", desc: "Typographie moderne, épuré",     previewBg: "#F8F9FA", previewAccent: "#0F172A" },
  { id: "ardoise",     name: "Ardoise",      emoji: "🍫", desc: "Tableau noir, ambiance bistrot",  previewBg: "#253341", previewAccent: "#EAE4D9" },
];

// ═══════════════════════════════════════════════════════════════════
// POSTER TEMPLATE COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// Shared placeholder QR grid (when no qrDataUrl)
function QrPlaceholder({ size, borderColor = "#CBD5E1" }) {
  return (
    <div style={{
      width: size, height: size, border: `2px solid ${borderColor}`,
      display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2,
      padding: 6, background: "transparent", boxSizing: "border-box",
    }}>
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} style={{
          background: [0,1,5,6,10,14,15,19,20,21,23,24].includes(i) ? borderColor : "transparent",
          borderRadius: 1,
        }} />
      ))}
    </div>
  );
}

// ── 1. CLASSIQUE ──────────────────────────────────────────────────
function PosterClassique({ W, H, nom, logo, qrDataUrl, primaryColor, customText, landscape }) {
  const accent = primaryColor || "#B8966E";
  const qSize = landscape ? Math.round(H * 0.44) : Math.round(W * 0.48);
  return (
    <div style={{
      width: W, height: H, background: "#FFFFFF",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      position: "relative", overflow: "hidden", boxSizing: "border-box",
    }}>
      {/* Outer margin frame */}
      <div style={{
        position: "absolute", inset: 20,
        border: `1px solid ${accent}60`,
        pointerEvents: "none",
      }} />
      {/* Corner ornaments */}
      {[[0,0],[1,0],[0,1],[1,1]].map(([rx,ry], i) => (
        <div key={i} style={{
          position: "absolute",
          top: ry ? undefined : 14, bottom: ry ? 14 : undefined,
          left: rx ? undefined : 14, right: rx ? 14 : undefined,
          width: 22, height: 22,
          borderTop: !ry ? `2px solid ${accent}` : "none",
          borderBottom: ry ? `2px solid ${accent}` : "none",
          borderLeft: !rx ? `2px solid ${accent}` : "none",
          borderRight: rx ? `2px solid ${accent}` : "none",
        }} />
      ))}

      <div style={{
        flex: 1, display: "flex", flexDirection: landscape ? "row" : "column",
        alignItems: "center", justifyContent: "center",
        gap: landscape ? 48 : 0, padding: landscape ? "36px 48px" : "32px 40px",
        width: "100%", boxSizing: "border-box",
      }}>
        {/* Left/Top — Header */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          flex: landscape ? "0 0 45%" : undefined,
        }}>
          {/* Logo */}
          <div style={{
            width: landscape ? 80 : 70, height: landscape ? 80 : 70, borderRadius: "50%",
            border: `2.5px solid ${accent}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", marginBottom: 14, background: `${accent}10`,
          }}>
            {logo
              ? <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              : <span style={{ fontSize: landscape ? 34 : 28, color: accent }}>{nom?.charAt(0)?.toUpperCase()}</span>
            }
          </div>
          {/* Nom */}
          <div style={{ fontSize: landscape ? 24 : 20, fontWeight: 700, color: "#1E293B", letterSpacing: 1, textAlign: "center", marginBottom: 6 }}>
            {nom || "Mon Établissement"}
          </div>
          {/* Divider ornament */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: landscape ? 0 : 28 }}>
            <div style={{ width: 28, height: 1, background: `${accent}80` }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent }} />
            <div style={{ width: 28, height: 1, background: `${accent}80` }} />
          </div>
          {landscape && (
            <div style={{ marginTop: 24, textAlign: "center", maxWidth: 240 }}>
              <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.65, fontStyle: "italic" }}>
                {customText || "Scannez et tentez votre chance !"}
              </div>
            </div>
          )}
        </div>

        {/* Right/Bottom — QR + text */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: landscape ? 1 : undefined }}>
          {/* QR code */}
          <div style={{
            padding: 16, background: "#FFFFFF",
            boxShadow: `0 4px 24px ${accent}25, 0 1px 8px rgba(0,0,0,0.08)`,
            borderRadius: 12, border: `1px solid ${accent}30`,
            marginBottom: landscape ? 0 : 24,
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block" }} />
              : <QrPlaceholder size={qSize} borderColor={accent} />
            }
          </div>
          {!landscape && (
            <>
              <div style={{ fontSize: 15, color: "#374151", textAlign: "center", lineHeight: 1.7, maxWidth: W - 80, fontStyle: "italic", marginBottom: 8 }}>
                {customText || "Scannez et tentez votre chance !"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <div style={{ width: 20, height: 1, background: `${accent}50` }} />
                <div style={{ fontSize: 11, color: "#94A3B8", letterSpacing: 0.5 }}>Propulsé par VisiumBoost</div>
                <div style={{ width: 20, height: 1, background: `${accent}50` }} />
              </div>
            </>
          )}
        </div>
      </div>
      {landscape && (
        <div style={{ position: "absolute", bottom: 28, left: 0, right: 0, textAlign: "center", fontSize: 10, color: "#94A3B8" }}>
          Propulsé par VisiumBoost
        </div>
      )}
    </div>
  );
}

// ── 2. FESTIF ──────────────────────────────────────────────────────
function PosterFestif({ W, H, nom, logo, qrDataUrl, primaryColor, customText, landscape }) {
  const pc = primaryColor || "#7C3AED";
  const qSize = landscape ? Math.round(H * 0.44) : Math.round(W * 0.46);
  const confetti = [
    { x: 8, y: 6, c: "#FFD93D", r: 6 }, { x: 88, y: 4, c: "#FF6B6B", r: 8 },
    { x: 15, y: 22, c: "#00B894", r: 5 }, { x: 82, y: 18, c: "#74B9FF", r: 7 },
    { x: 5, y: 55, c: "#FF7EBB", r: 5 }, { x: 93, y: 48, c: "#FFD93D", r: 6 },
    { x: 10, y: 78, c: "#00B894", r: 7 }, { x: 87, y: 72, c: "#FF6B6B", r: 5 },
    { x: 3, y: 90, c: "#74B9FF", r: 8 }, { x: 94, y: 88, c: "#FF7EBB", r: 6 },
    { x: 50, y: 2, c: "#FFD93D", r: 5 }, { x: 45, y: 96, c: "#00B894", r: 7 },
  ];
  return (
    <div style={{
      width: W, height: H, position: "relative", overflow: "hidden",
      background: `linear-gradient(145deg, ${pc} 0%, ${pc}CC 60%, #1A1A2E 100%)`,
      fontFamily: "'Nunito', 'DM Sans', system-ui, sans-serif",
      display: "flex", flexDirection: "column", boxSizing: "border-box",
    }}>
      {/* Confetti dots */}
      {confetti.map((d, i) => (
        <div key={i} style={{
          position: "absolute", left: `${d.x}%`, top: `${d.y}%`,
          width: d.r * 2, height: d.r * 2, borderRadius: "50%",
          background: d.c, opacity: 0.85,
        }} />
      ))}
      {/* Star decorations */}
      {["22%","78%"].map((x, i) => (
        <div key={i} style={{ position: "absolute", left: x, top: "12%", color: "#FFD93D", fontSize: 22, opacity: 0.9 }}>★</div>
      ))}

      <div style={{
        flex: 1, display: "flex", flexDirection: landscape ? "row" : "column",
        alignItems: "center", justifyContent: "center",
        gap: landscape ? 40 : 0, padding: landscape ? "28px 44px" : "28px 36px",
        position: "relative", zIndex: 1,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          flex: landscape ? "0 0 45%" : undefined, marginBottom: landscape ? 0 : 20,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", marginBottom: 12, backdropFilter: "blur(4px)",
          }}>
            {logo
              ? <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              : <span style={{ fontSize: 30, color: "#fff", fontWeight: 900 }}>{nom?.charAt(0)?.toUpperCase()}</span>
            }
          </div>
          <div style={{ fontSize: landscape ? 22 : 20, fontWeight: 900, color: "#fff", textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            {nom || "Mon Établissement"}
          </div>
          <div style={{ fontSize: 24, marginTop: 6 }}>🎊</div>
          {landscape && (
            <div style={{ marginTop: 20, textAlign: "center", maxWidth: 240 }}>
              <div style={{ fontSize: 16, color: "#FFD93D", fontWeight: 800, lineHeight: 1.5, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                {customText || "Scannez et tentez votre chance !"}
              </div>
            </div>
          )}
        </div>

        {/* QR */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: landscape ? 1 : undefined }}>
          <div style={{
            padding: 14, background: "#fff", borderRadius: 20,
            boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
            border: "3px solid rgba(255,255,255,0.9)",
            marginBottom: landscape ? 0 : 18,
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block", borderRadius: 8 }} />
              : <QrPlaceholder size={qSize} borderColor={pc} />
            }
          </div>
          {!landscape && (
            <div style={{ fontSize: 15, fontWeight: 800, color: "#FFD93D", textAlign: "center", lineHeight: 1.55, maxWidth: W - 60, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              {customText || "Scannez et tentez votre chance !"}
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "8px 0 14px", fontSize: 9, color: "rgba(255,255,255,0.55)", position: "relative", zIndex: 1 }}>
        Propulsé par VisiumBoost
      </div>
    </div>
  );
}

// ── 3. LUXE ───────────────────────────────────────────────────────
function PosterLuxe({ W, H, nom, logo, qrDataUrl, primaryColor, customText, landscape }) {
  const gold = "#C9A84C";
  const qSize = landscape ? Math.round(H * 0.42) : Math.round(W * 0.42);
  return (
    <div style={{
      width: W, height: H, background: "#080808",
      fontFamily: "'Georgia', 'Playfair Display', serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      {/* Outer gold frame */}
      <div style={{ position: "absolute", inset: 16, border: `1px solid ${gold}40`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 20, border: `1px solid ${gold}20`, pointerEvents: "none" }} />

      {/* Diamond ornament top */}
      <div style={{
        marginTop: 36, width: 32, height: 32, border: `1.5px solid ${gold}`,
        transform: "rotate(45deg)", background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <div style={{ width: 10, height: 10, background: gold, borderRadius: "50%", transform: "rotate(-45deg)" }} />
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: landscape ? "row" : "column",
        alignItems: "center", justifyContent: "center",
        gap: landscape ? 48 : 0,
        padding: landscape ? "20px 52px" : "20px 44px",
        width: "100%", boxSizing: "border-box",
      }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: landscape ? "0 0 42%" : undefined }}>
          {/* Logo circle */}
          <div style={{
            width: landscape ? 84 : 76, height: landscape ? 84 : 76, borderRadius: "50%",
            border: `2px solid ${gold}`,
            background: "#111", display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", marginBottom: 16, boxShadow: `0 0 20px ${gold}30`,
          }}>
            {logo
              ? <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              : <span style={{ fontSize: 32, color: gold, fontWeight: 700 }}>{nom?.charAt(0)?.toUpperCase()}</span>
            }
          </div>
          {/* Nom */}
          <div style={{ fontSize: landscape ? 17 : 15, color: gold, letterSpacing: 5, textTransform: "uppercase", textAlign: "center", marginBottom: 12 }}>
            {nom || "MON ÉTABLISSEMENT"}
          </div>
          {/* Gold divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: landscape ? 0 : 24 }}>
            <div style={{ width: 30, height: 1, background: `${gold}70` }} />
            <div style={{ width: 4, height: 4, background: gold, transform: "rotate(45deg)" }} />
            <div style={{ width: 30, height: 1, background: `${gold}70` }} />
          </div>
          {landscape && (
            <div style={{ marginTop: 20, textAlign: "center", maxWidth: 220 }}>
              <div style={{ fontSize: 13, color: `${gold}CC`, fontStyle: "italic", lineHeight: 1.7, letterSpacing: 1 }}>
                {customText || "Scannez et tentez votre chance"}
              </div>
            </div>
          )}
        </div>

        {/* QR */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: landscape ? 1 : undefined }}>
          <div style={{
            padding: 16, background: "#111",
            border: `1.5px solid ${gold}60`,
            boxShadow: `0 0 30px ${gold}20`,
            marginBottom: landscape ? 0 : 20,
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block", filter: "invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(0.8)" }} />
              : <QrPlaceholder size={qSize} borderColor={gold} />
            }
          </div>
          {!landscape && (
            <div style={{ fontSize: 13, color: `${gold}CC`, textAlign: "center", fontStyle: "italic", letterSpacing: 1.5, lineHeight: 1.7, maxWidth: W - 80 }}>
              {customText || "Scannez et tentez votre chance"}
            </div>
          )}
        </div>
      </div>

      {/* Diamond ornament bottom */}
      <div style={{ width: 20, height: 20, border: `1px solid ${gold}60`, transform: "rotate(45deg)", marginBottom: 10 }} />
      <div style={{ fontSize: 9, color: `${gold}60`, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>
        Propulsé par VisiumBoost
      </div>
    </div>
  );
}

// ── 4. KAWAII ─────────────────────────────────────────────────────
function PosterKawaii({ W, H, nom, logo, qrDataUrl, primaryColor, customText, landscape }) {
  const pc = primaryColor || "#FF7EBB";
  const qSize = landscape ? Math.round(H * 0.44) : Math.round(W * 0.46);
  const stars = [
    { x: 6, y: 8, s: 16 }, { x: 90, y: 6, s: 14 }, { x: 4, y: 44, s: 12 },
    { x: 93, y: 40, s: 14 }, { x: 8, y: 80, s: 13 }, { x: 88, y: 78, s: 11 },
    { x: 48, y: 3, s: 10 },
  ];
  return (
    <div style={{
      width: W, height: H,
      background: "linear-gradient(160deg, #FFF0F8 0%, #F0F4FF 60%, #FFF9E6 100%)",
      fontFamily: "'Nunito', 'DM Sans', system-ui, sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      {/* Stars decoration */}
      {stars.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, fontSize: s.s, opacity: 0.5, color: pc }}>
          ✦
        </div>
      ))}
      {/* Top wave gradient header */}
      <div style={{
        width: "100%", height: landscape ? 120 : 100,
        background: `linear-gradient(135deg, ${pc}30, ${pc}15, transparent)`,
        flexShrink: 0,
      }} />

      <div style={{
        flex: 1, display: "flex", flexDirection: landscape ? "row" : "column",
        alignItems: "center", justifyContent: "center",
        gap: landscape ? 36 : 0,
        padding: landscape ? "0 44px 20px" : "0 36px 20px",
        marginTop: landscape ? -60 : -50,
        width: "100%", boxSizing: "border-box",
        position: "relative", zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: landscape ? "0 0 44%" : undefined }}>
          {/* Logo */}
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg, ${pc}, ${pc}88)`,
            border: `4px solid white`,
            boxShadow: `0 4px 16px ${pc}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", marginBottom: 12,
          }}>
            {logo
              ? <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              : <span style={{ fontSize: 34, color: "#fff", fontWeight: 900 }}>{nom?.charAt(0)?.toUpperCase()}</span>
            }
          </div>
          <div style={{ fontSize: landscape ? 22 : 20, fontWeight: 900, color: "#2D1B45", textAlign: "center", marginBottom: 4 }}>
            {nom || "Mon Établissement"}
          </div>
          <div style={{ fontSize: 18, marginBottom: landscape ? 0 : 20 }}>🌸✨🎁</div>
          {landscape && (
            <div style={{ marginTop: 16, textAlign: "center", maxWidth: 230 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: pc, lineHeight: 1.6 }}>
                {customText || "Scannez et tentez votre chance !"}
              </div>
            </div>
          )}
        </div>

        {/* QR */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: landscape ? 1 : undefined }}>
          <div style={{ fontSize: 18, marginBottom: 8 }}>⬇️</div>
          <div style={{
            padding: 14, background: "#fff",
            border: `3px solid ${pc}`,
            borderRadius: 24,
            boxShadow: `0 6px 28px ${pc}30`,
            marginBottom: landscape ? 0 : 16,
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block", borderRadius: 10 }} />
              : <QrPlaceholder size={qSize} borderColor={pc} />
            }
          </div>
          {!landscape && (
            <div style={{ fontSize: 15, fontWeight: 800, color: pc, textAlign: "center", lineHeight: 1.6, maxWidth: W - 60 }}>
              {customText || "Scannez et tentez votre chance !"}
            </div>
          )}
        </div>
      </div>

      <div style={{ fontSize: 10, color: `${pc}90`, marginBottom: 18, fontWeight: 700 }}>
        ♡ Propulsé par VisiumBoost ♡
      </div>
    </div>
  );
}

// ── 5. MINIMALISTE ────────────────────────────────────────────────
function PosterMinimaliste({ W, H, nom, logo, qrDataUrl, primaryColor, customText, landscape }) {
  const pc = primaryColor || "#0F172A";
  const qSize = landscape ? Math.round(H * 0.52) : Math.round(W * 0.5);
  return (
    <div style={{
      width: W, height: H, background: "#F8F9FA",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      {/* Top accent bar */}
      <div style={{ width: "100%", height: 6, background: pc, flexShrink: 0 }} />

      <div style={{
        flex: 1, display: "flex", flexDirection: landscape ? "row" : "column",
        alignItems: "center", justifyContent: "center",
        gap: landscape ? 64 : 0,
        padding: landscape ? "32px 64px" : "36px 52px",
        boxSizing: "border-box",
      }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: landscape ? "flex-start" : "center", flex: landscape ? "0 0 40%" : undefined }}>
          {logo ? (
            <img src={logo} alt="" style={{ height: landscape ? 52 : 44, marginBottom: 16, objectFit: "contain", maxWidth: "100%" }} />
          ) : (
            <div style={{ fontSize: landscape ? 36 : 32, fontWeight: 900, color: pc, marginBottom: 4, letterSpacing: -2 }}>
              {nom?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div style={{ fontSize: landscape ? 26 : 22, fontWeight: 800, color: "#0F172A", letterSpacing: -0.5, textAlign: landscape ? "left" : "center", lineHeight: 1.2, marginBottom: 12 }}>
            {nom || "Mon Établissement"}
          </div>
          <div style={{ width: landscape ? 48 : 36, height: 3, background: pc, marginBottom: landscape ? 0 : 32 }} />
          {landscape && (
            <div style={{ marginTop: 20, maxWidth: 250 }}>
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
                {customText || "Scannez et tentez votre chance !"}
              </div>
            </div>
          )}
        </div>

        {/* QR */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: landscape ? 1 : undefined }}>
          <div style={{ marginBottom: landscape ? 0 : 24 }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block" }} />
              : <QrPlaceholder size={qSize} borderColor="#CBD5E1" />
            }
          </div>
          {!landscape && (
            <div style={{ fontSize: 14, color: "#374151", textAlign: "center", lineHeight: 1.8, maxWidth: W - 80 }}>
              {customText || "Scannez et tentez votre chance !"}
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 52px", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ width: 36, height: 1, background: "#CBD5E1" }} />
        <div style={{ fontSize: 10, color: "#9CA3AF", letterSpacing: 1 }}>Propulsé par VisiumBoost</div>
        <div style={{ width: 36, height: 1, background: "#CBD5E1" }} />
      </div>
    </div>
  );
}

// ── 6. ARDOISE ────────────────────────────────────────────────────
function PosterArdoise({ W, H, nom, logo, qrDataUrl, primaryColor, customText, landscape }) {
  const chalk = "#EAE4D9";
  const bg = "#1E2D3D";
  const qSize = landscape ? Math.round(H * 0.44) : Math.round(W * 0.44);
  return (
    <div style={{
      width: W, height: H, background: bg,
      fontFamily: "'Courier New', 'DM Mono', monospace",
      display: "flex", flexDirection: "column", alignItems: "center",
      boxSizing: "border-box", overflow: "hidden", position: "relative",
    }}>
      {/* Chalk dashed frame */}
      <div style={{
        position: "absolute", inset: 18,
        border: `2px dashed ${chalk}50`,
        pointerEvents: "none",
      }} />
      {/* Corner dots */}
      {[[0,0],[1,0],[0,1],[1,1]].map(([rx,ry], i) => (
        <div key={i} style={{
          position: "absolute",
          top: ry ? undefined : 12, bottom: ry ? 12 : undefined,
          left: rx ? undefined : 12, right: rx ? 12 : undefined,
          width: 8, height: 8, borderRadius: "50%",
          background: `${chalk}60`,
        }} />
      ))}

      {/* Chalk star decorations */}
      {[["8%","10%"],["88%","8%"],["5%","50%"],["91%","50%"],["8%","86%"],["88%","84%"]].map(([x,y], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y, color: `${chalk}40`, fontSize: 14 }}>✦</div>
      ))}

      <div style={{
        flex: 1, display: "flex", flexDirection: landscape ? "row" : "column",
        alignItems: "center", justifyContent: "center",
        gap: landscape ? 44 : 0,
        padding: landscape ? "32px 52px" : "32px 40px",
        position: "relative", zIndex: 1, width: "100%", boxSizing: "border-box",
      }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: landscape ? "0 0 44%" : undefined }}>
          {/* Logo circle */}
          <div style={{
            width: 76, height: 76, borderRadius: "50%",
            border: `2px dashed ${chalk}80`,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", marginBottom: 14, background: `${chalk}08`,
          }}>
            {logo
              ? <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "brightness(0) invert(1) opacity(0.85)" }} />
              : <span style={{ fontSize: 30, color: chalk, fontWeight: 700, opacity: 0.9 }}>{nom?.charAt(0)?.toUpperCase()}</span>
            }
          </div>
          <div style={{ fontSize: landscape ? 20 : 18, fontWeight: 700, color: chalk, textAlign: "center", letterSpacing: 2, marginBottom: 10, textShadow: `0 0 12px ${chalk}40` }}>
            {nom || "Mon Établissement"}
          </div>
          {/* Chalk divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: landscape ? 0 : 22 }}>
            <div style={{ width: 24, height: 1, background: `${chalk}50`, borderRadius: 1 }} />
            <div style={{ fontSize: 12, color: `${chalk}70` }}>✦</div>
            <div style={{ width: 24, height: 1, background: `${chalk}50`, borderRadius: 1 }} />
          </div>
          {landscape && (
            <div style={{ marginTop: 16, textAlign: "center", maxWidth: 220 }}>
              <div style={{ fontSize: 13, color: chalk, lineHeight: 1.7, opacity: 0.85 }}>
                {customText || "Scannez et tentez votre chance !"}
              </div>
            </div>
          )}
        </div>

        {/* QR */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: landscape ? 1 : undefined }}>
          <div style={{
            padding: 14,
            border: `2px dashed ${chalk}70`,
            background: `${chalk}06`,
            marginBottom: landscape ? 0 : 20,
          }}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR" style={{ width: qSize, height: qSize, display: "block", filter: "invert(1) opacity(0.9)" }} />
              : <QrPlaceholder size={qSize} borderColor={chalk} />
            }
          </div>
          {!landscape && (
            <div style={{ fontSize: 13, color: chalk, textAlign: "center", lineHeight: 1.7, opacity: 0.85, maxWidth: W - 80 }}>
              {customText || "Scannez et tentez votre chance !"}
            </div>
          )}
        </div>
      </div>

      <div style={{ fontSize: 9, color: `${chalk}45`, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24, position: "relative", zIndex: 1 }}>
        Propulsé par VisiumBoost
      </div>
    </div>
  );
}

// ── Poster router ──────────────────────────────────────────────────
function Poster({ tplId, ...props }) {
  const map = {
    classique:   PosterClassique,
    festif:      PosterFestif,
    luxe:        PosterLuxe,
    kawaii:      PosterKawaii,
    minimaliste: PosterMinimaliste,
    ardoise:     PosterArdoise,
  };
  const C = map[tplId] || PosterClassique;
  return <C {...props} />;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
export default function PageAffiches() {
  const [entreprises,   setEntreprises]   = useState([]);
  const [selectedEnt,   setSelectedEnt]   = useState(null);
  const [selectedTpl,   setSelectedTpl]   = useState(null);
  const [format,        setFormat]        = useState("a4p");
  const [primaryColor,  setPrimaryColor]  = useState("#3B82F6");
  const [customText,    setCustomText]    = useState("Laissez un avis Google et tentez de gagner un cadeau !");
  const [qrDataUrl,     setQrDataUrl]     = useState("");
  const [qrThumb,       setQrThumb]       = useState(""); // small QR for thumbnails
  const [downloading,   setDownloading]   = useState(false);
  const [loading,       setLoading]       = useState(true);

  const posterRef = useRef(null);

  // ── Load entreprises ─────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/entreprises")
      .then(r => r.json())
      .then(d => {
        const list = d.entreprises || [];
        setEntreprises(list);
        if (list.length > 0) {
          setSelectedEnt(list[0]);
          setPrimaryColor(list[0].couleur_principale || "#3B82F6");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Generate QR code when entreprise changes ─────────────────────
  useEffect(() => {
    if (!selectedEnt?.slug) return;
    const url = `${APP_URL}/roue/${selectedEnt.slug}`;
    import("qrcode").then(QR => {
      QR.toDataURL(url, { width: 480, margin: 1, errorCorrectionLevel: "H" }).then(setQrDataUrl);
      QR.toDataURL(url, { width: 160, margin: 1 }).then(setQrThumb);
    });
  }, [selectedEnt]);

  // ── Download PDF ─────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    if (!posterRef.current) return;
    setDownloading("pdf");
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(posterRef.current, {
        scale: 2, useCORS: true, allowTaint: true, backgroundColor: null,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.96);
      const paper = PAPER[format];
      const pdf = new jsPDF({ orientation: paper.pdfOri, unit: "mm", format: paper.pdfFmt });
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

  // ── Download PNG (Canva) ─────────────────────────────────────────
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

  // ── Paper size for current format ────────────────────────────────
  const paper = PAPER[format];
  const landscape = format === "a4l";

  // ── Modal preview scale ──────────────────────────────────────────
  const PREVIEW_H = 500;
  const previewScale = PREVIEW_H / paper.H;
  const previewW = Math.round(paper.W * previewScale);

  const inp = {
    width: "100%", padding: "8px 11px", borderRadius: 9, border: "1.5px solid #E2E8F0",
    fontSize: 13, outline: "none", background: "#fff", color: "#0F172A",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };

  if (loading) return (
    <div className="animate-fade-in">
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900 tracking-tight">Affiches à imprimer</h1></div>
      <div className="card p-12 text-center text-slate-300 text-sm">Chargement…</div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Affiches à imprimer</h1>
          <p className="text-slate-400 text-sm mt-1">Choisissez un template, personnalisez, téléchargez en PDF ou PNG pour Canva.</p>
        </div>
        {/* Etablissement selector */}
        {entreprises.length > 1 && (
          <select
            value={selectedEnt?._id || ""}
            onChange={e => {
              const ent = entreprises.find(x => x._id === e.target.value);
              if (ent) { setSelectedEnt(ent); setPrimaryColor(ent.couleur_principale || "#3B82F6"); }
            }}
            style={{ ...inp, width: "auto", minWidth: 200, cursor: "pointer" }}
          >
            {entreprises.map(e => <option key={e._id} value={e._id}>{e.nom}</option>)}
          </select>
        )}
      </div>

      {/* ── Template grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 20 }}>
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
            {/* Thumbnail */}
            <div style={{
              height: 196, overflow: "hidden", position: "relative",
              background: typeof tpl.previewBg === "string" && tpl.previewBg.startsWith("linear") ? tpl.previewBg : tpl.previewBg,
            }}>
              <div style={{
                width: PAPER.a4p.W, height: PAPER.a4p.H,
                transform: `scale(${230 / PAPER.a4p.W})`,
                transformOrigin: "top left",
                pointerEvents: "none",
              }}>
                <Poster
                  tplId={tpl.id}
                  W={PAPER.a4p.W} H={PAPER.a4p.H}
                  nom={selectedEnt?.nom || "Mon Établissement"}
                  logo={selectedEnt?.logo || ""}
                  qrDataUrl={qrThumb}
                  primaryColor={selectedEnt?.couleur_principale || "#3B82F6"}
                  customText={customText}
                  landscape={false}
                />
              </div>
            </div>
            {/* Card footer */}
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{tpl.emoji} {tpl.name}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{tpl.desc}</div>
              </div>
              <button style={{
                padding: "6px 14px", borderRadius: 9, border: "none",
                background: "#2563EB", color: "#fff", fontSize: 12, fontWeight: 700,
                cursor: "pointer",
              }}>
                Ouvrir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ════ MODAL ════ */}
      {selectedTpl && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20,
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#fff", borderRadius: 24, maxWidth: 1100, width: "100%",
            maxHeight: "95vh", display: "flex", flexDirection: "column",
            overflow: "hidden", boxShadow: "0 32px 96px rgba(0,0,0,0.28)",
          }}>
            {/* Modal header */}
            <div style={{
              padding: "16px 24px", borderBottom: "1.5px solid #F0F0F5",
              display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                  {TEMPLATES.find(t => t.id === selectedTpl)?.emoji} Affiche — {TEMPLATES.find(t => t.id === selectedTpl)?.name}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                  {selectedEnt?.nom || "Établissement"} · {paper.label}
                </div>
              </div>
              <button
                onClick={() => setSelectedTpl(null)}
                style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#F1F5F9", cursor: "pointer", fontSize: 18, color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}
              >×</button>
            </div>

            <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
              {/* ── LEFT: Preview ── */}
              <div style={{
                flex: 1, overflowY: "auto", background: "#F1F5F9",
                display: "flex", alignItems: "flex-start", justifyContent: "center",
                padding: 32, gap: 16, flexDirection: "column", alignItems: "center",
              }}>
                {/* Hidden full-size poster for capture */}
                <div style={{ position: "fixed", left: -9999, top: -9999, zIndex: -1 }}>
                  <div ref={posterRef}>
                    <Poster
                      tplId={selectedTpl}
                      W={paper.W} H={paper.H}
                      nom={selectedEnt?.nom || ""}
                      logo={selectedEnt?.logo || ""}
                      qrDataUrl={qrDataUrl}
                      primaryColor={primaryColor}
                      customText={customText}
                      landscape={landscape}
                    />
                  </div>
                </div>

                {/* Visible scaled preview */}
                <div style={{ fontSize: 11, fontWeight: 600, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7, alignSelf: "flex-start" }}>
                  Aperçu — {paper.label}
                </div>
                <div style={{
                  boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
                  transformOrigin: "top center",
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: paper.W, height: paper.H,
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top left",
                    display: "block",
                  }}>
                    <Poster
                      tplId={selectedTpl}
                      W={paper.W} H={paper.H}
                      nom={selectedEnt?.nom || ""}
                      logo={selectedEnt?.logo || ""}
                      qrDataUrl={qrDataUrl}
                      primaryColor={primaryColor}
                      customText={customText}
                      landscape={landscape}
                    />
                  </div>
                </div>
                {/* Spacer to account for transform */}
                <div style={{ height: Math.round(paper.H * previewScale), width: previewW }} />
              </div>

              {/* ── RIGHT: Controls ── */}
              <div style={{
                width: 300, flexShrink: 0, borderLeft: "1.5px solid #F0F0F5",
                overflowY: "auto", padding: "24px 20px",
                display: "flex", flexDirection: "column", gap: 20,
              }}>

                {/* Format */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10 }}>Format</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {Object.entries(PAPER).map(([key, p]) => (
                      <label key={key} style={{
                        display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                        padding: "9px 12px", borderRadius: 10,
                        border: `1.5px solid ${format === key ? "#2563EB" : "#E2E8F0"}`,
                        background: format === key ? "#EFF6FF" : "#F8FAFC",
                        transition: "all 0.12s",
                      }}>
                        <input type="radio" name="format" value={key} checked={format === key}
                          onChange={() => setFormat(key)}
                          style={{ accentColor: "#2563EB", cursor: "pointer" }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: format === key ? 700 : 500, color: format === key ? "#1D4ED8" : "#374151" }}>{p.label}</div>
                          <div style={{ fontSize: 10, color: "#94A3B8" }}>{key === "a4p" ? "210 × 297 mm" : key === "a4l" ? "297 × 210 mm" : "148 × 210 mm"}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8 }}>Couleur principale</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                      style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2 }} />
                    <input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                      style={{ ...inp, flex: 1, fontFamily: "'DM Mono',monospace", fontSize: 12 }} />
                  </div>
                  {/* Quick palette from entreprise */}
                  {selectedEnt && (
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      {[selectedEnt.couleur_principale, selectedEnt.couleur_secondaire].filter(Boolean).map((c, i) => (
                        <button key={i} onClick={() => setPrimaryColor(c)} title={c} style={{
                          width: 24, height: 24, borderRadius: 6, border: primaryColor === c ? "2px solid #2563EB" : "2px solid #E2E8F0",
                          background: c, cursor: "pointer",
                        }} />
                      ))}
                      <span style={{ fontSize: 10, color: "#94A3B8", alignSelf: "center", marginLeft: 4 }}>Couleurs de la roue</span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8 }}>Texte accrocheur</div>
                  <textarea
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    rows={3}
                    style={{ ...inp, resize: "vertical", lineHeight: 1.55 }}
                  />
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 7 }}>
                    {[
                      "Scannez et tentez votre chance !",
                      "Avis Google → Cadeau garanti 🎁",
                      "Scannez le QR code et gagnez !",
                    ].map((s, i) => (
                      <button key={i} onClick={() => setCustomText(s)} style={{
                        padding: "4px 9px", borderRadius: 6, border: "1.5px solid #E2E8F0",
                        background: "#F8FAFC", fontSize: 10, color: "#64748B", cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {s.length > 28 ? s.slice(0,28) + "…" : s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={!!downloading}
                    style={{
                      width: "100%", padding: "13px", borderRadius: 12, border: "none",
                      background: downloading === "pdf" ? "#93C5FD" : "#2563EB",
                      color: "#fff", fontWeight: 700, fontSize: 14, cursor: downloading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                    }}
                  >
                    {downloading === "pdf" ? (
                      <>
                        <span style={{ animation: "spin360 1s linear infinite", display: "inline-block" }}>⟳</span>
                        Génération…
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Télécharger PDF
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadPNG}
                    disabled={!!downloading}
                    style={{
                      width: "100%", padding: "12px", borderRadius: 12, border: "1.5px solid #E2E8F0",
                      background: downloading === "png" ? "#F1F5F9" : "#fff",
                      color: "#374151", fontWeight: 700, fontSize: 13, cursor: downloading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                    }}
                  >
                    {downloading === "png" ? "Génération PNG…" : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Télécharger PNG (Canva)
                      </>
                    )}
                  </button>

                  <a
                    href={CANVA_LINKS[selectedTpl] || "https://www.canva.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "100%", padding: "11px", borderRadius: 12,
                      border: "1.5px solid #7C3AED30", background: "#F5F3FF",
                      color: "#7C3AED", fontWeight: 700, fontSize: 13,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s", boxSizing: "border-box",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Ouvrir dans Canva
                  </a>
                </div>

                {/* QR info */}
                <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 14px", border: "1.5px solid #E2E8F0" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 6 }}>QR Code généré pour</div>
                  <div style={{ fontSize: 11, color: "#3B82F6", fontFamily: "'DM Mono',monospace", wordBreak: "break-all" }}>
                    {selectedEnt ? `${APP_URL}/roue/${selectedEnt.slug}` : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin360 { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
