"use client";

import { useState, useEffect, useRef } from "react";
import { uid } from "@/lib/utils";
import Icon from "@/components/Icon";
import SpinWheel from "@/components/SpinWheel";
import Confetti from "@/components/Confetti";
import ImageUpload from "@/components/ImageUpload";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://visium-boost.fr";

const FONTS = [
  { id: "DM Sans",          label: "DM Sans" },
  { id: "Inter",            label: "Inter" },
  { id: "Playfair Display", label: "Playfair" },
  { id: "Nunito",           label: "Nunito" },
  { id: "Space Grotesk",    label: "Space" },
];

const DEFAULT_PALETTE = ["#6C5CE7","#00B894","#FDCB6E","#E17055","#0984E3","#E84393","#74B9FF","#55EFC4"];

const TEMPLATES = [
  {
    id: "elegant", name: "Élégant", emoji: "🏛️",
    desc: "Noir & or, sobre et luxueux",
    palette: ["#1D1D1F","#C9A84C","#F5F0E8","#2C2C2E","#D4AF37","#8C7B5A","#4A4035","#A68B4A"],
    primaryColor: "#1D1D1F", secondaryColor: "#C9A84C",
    wheelBorderColor: "#C9A84C", wheelCenterColor: "#FAFAFA",
    wheelFont: "Playfair Display", wheelSize: 360,
    bg: "#FAFAFA", bgType: "color", bgGradient: "",
    textColor: "#1D1D1F", btnColor: "#1D1D1F", btnRadius: 6,
    btnText: "⭐ Laisser mon avis Google",
    title: "Tournez et gagnez !",
    welcome: "Laissez-nous un avis et découvrez votre récompense exclusive.",
    thanks: "Merci ! Votre cadeau vous attend en caisse.",
    cardColor: "#F5F0E8",
  },
  {
    id: "festif", name: "Festif", emoji: "🎉",
    desc: "Couleurs vives, festif",
    palette: ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF6FC8","#845EC2","#FF9A3C","#00C2CB"],
    primaryColor: "#FF6B6B", secondaryColor: "#FFD93D",
    wheelBorderColor: "#FF6B6B", wheelCenterColor: "#fff",
    wheelFont: "Nunito", wheelSize: 360,
    bg: "#7C3AED", bgType: "gradient",
    bgGradient: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
    textColor: "#FFFFFF", btnColor: "#FFD93D", btnRadius: 999,
    btnText: "🎊 Laisser mon avis Google",
    title: "Tentez votre chance !",
    welcome: "Laissez-nous un avis et tournez la roue des cadeaux !",
    thanks: "🎊 Incroyable ! Votre cadeau vous attend !",
    cardColor: "rgba(255,255,255,0.12)",
  },
  {
    id: "minimaliste", name: "Minimal", emoji: "◻️",
    desc: "Épuré, typographie moderne",
    palette: ["#18181B","#52525B","#A1A1AA","#3F3F46","#71717A","#D4D4D8","#27272A","#E4E4E7"],
    primaryColor: "#18181B", secondaryColor: "#71717A",
    wheelBorderColor: "#18181B", wheelCenterColor: "#F4F4F5",
    wheelFont: "Inter", wheelSize: 340,
    bg: "#F4F4F5", bgType: "color", bgGradient: "",
    textColor: "#18181B", btnColor: "#18181B", btnRadius: 4,
    btnText: "Laisser un avis Google",
    title: "Votre avis, votre cadeau.",
    welcome: "Partagez votre expérience et découvrez votre récompense.",
    thanks: "Merci. Présentez ce code en caisse.",
    cardColor: "#EBEBEB",
  },
  {
    id: "sombre", name: "Sombre", emoji: "🌙",
    desc: "Fond noir, accents néon",
    palette: ["#00FF87","#00D4FF","#FF00FF","#FF6B00","#7B2FFF","#00FFB2","#FFE600","#FF0055"],
    primaryColor: "#00FF87", secondaryColor: "#00D4FF",
    wheelBorderColor: "#00FF87", wheelCenterColor: "#0F0F1A",
    wheelFont: "Space Grotesk", wheelSize: 380,
    bg: "#0F0F1A", bgType: "color", bgGradient: "",
    textColor: "#FFFFFF", btnColor: "#00FF87", btnRadius: 10,
    btnText: "⭐ Laisser mon avis",
    title: "Tournez. Gagnez.",
    welcome: "Laissez votre avis et découvrez votre récompense.",
    thanks: "✨ Votre cadeau vous attend !",
    cardColor: "rgba(255,255,255,0.07)",
  },
  {
    id: "nature", name: "Nature", emoji: "🌿",
    desc: "Tons naturels, chaleureux",
    palette: ["#16A34A","#65A30D","#CA8A04","#92400E","#6B7280","#4ADE80","#A3E635","#FCD34D"],
    primaryColor: "#16A34A", secondaryColor: "#65A30D",
    wheelBorderColor: "#16A34A", wheelCenterColor: "#F0FDF4",
    wheelFont: "DM Sans", wheelSize: 360,
    bg: "#F0FDF4", bgType: "color", bgGradient: "",
    textColor: "#14532D", btnColor: "#16A34A", btnRadius: 14,
    btnText: "🌿 Laisser mon avis Google",
    title: "Tournez et gagnez chez nous !",
    welcome: "Merci de nous soutenir. Tournez la roue et gagnez un cadeau !",
    thanks: "Merci ! Votre récompense vous attend avec le sourire.",
    cardColor: "#DCFCE7",
  },
];

const DEFAULT_THEME = {
  segmentColors: [],
  borderColor: "#ffffff", centerColor: "#ffffff", centerLogo: "",
  font: "DM Sans", wheelSize: 360,
  bg: "#ffffff", bgType: "color", bgGradient: "",
  banner: "",
  title: "", welcome: "", btnColor: "", btnText: "⭐ Laisser mon avis Google",
  btnRadius: 14, thanks: "", textColor: "#0F0F1A", cardColor: "",
  collectFields: { prenom: false, email: false, telephone: false },
};

const DEFAULT_CONFIG = {
  googleLink: "", primaryColor: "#3B82F6", secondaryColor: "#0EA5E9",
  ctaText: "Laissez-nous un avis et tentez votre chance !",
  logoUrl: "", rewards: [],
  theme: { ...DEFAULT_THEME },
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function lum(hex) {
  const h = (hex || "").replace("#","");
  if (h.length < 6) return 0;
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  return (0.299*r + 0.587*g + 0.114*b) / 255;
}
const autoText = (hex) => lum(hex) > 0.55 ? "#000000" : "#ffffff";

function entrepriseToConfig(e) {
  const t = (e.theme && typeof e.theme === "object") ? e.theme : {};
  const F = (key, legacy, fallback) =>
    (t[key] !== undefined && t[key] !== null && t[key] !== "") ? t[key]
    : (e[legacy] || fallback);
  return {
    googleLink:     e.lien_avis          || "",
    primaryColor:   e.couleur_principale || "#3B82F6",
    secondaryColor: e.couleur_secondaire || "#0EA5E9",
    ctaText:        e.cta_text           || DEFAULT_CONFIG.ctaText,
    logoUrl:        e.logo               || "",
    rewards: (e.rewards || []).map(r => ({
      id: r.id || r._id?.toString() || uid(), name: r.name || "", prob: r.probability ?? 0,
    })),
    theme: {
      segmentColors: t.segmentColors || e.wheel_segment_colors || [],
      borderColor:   F("borderColor",  "wheel_border_color",   "#ffffff"),
      centerColor:   F("centerColor",  "wheel_center_color",   "#ffffff"),
      centerLogo:    F("centerLogo",   "wheel_center_logo",    ""),
      font:          F("font",         "wheel_font",           "DM Sans"),
      wheelSize:     t.wheelSize       || e.wheel_size         || 360,
      bg:            F("bg",           "page_bg",              "#ffffff"),
      bgType:        F("bgType",       "page_bg_type",         "color"),
      bgGradient:    F("bgGradient",   "page_bg_gradient",     ""),
      banner:        F("banner",       "page_banner",          ""),
      title:         F("title",        "page_title",           ""),
      welcome:       F("welcome",      "page_welcome",         ""),
      btnColor:      F("btnColor",     "page_btn_color",       ""),
      btnText:       F("btnText",      "page_btn_text",        "⭐ Laisser mon avis Google"),
      btnRadius:     t.btnRadius       ?? 14,
      thanks:        F("thanks",       "page_thanks",          ""),
      textColor:     F("textColor",    "page_text_color",      "#0F0F1A"),
      cardColor:     t.cardColor       || "",
      collectFields: t.collectFields   || { prenom: false, email: false, telephone: false },
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// LIVE PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════
function LivePreview({ config, entreprise, compact = false }) {
  const [device,      setDevice]      = useState("mobile");
  const [pvStep,      setPvStep]      = useState(1);
  const [spinKey,     setSpinKey]     = useState(0);
  const [winItem,     setWinItem]     = useState(null);
  const [pvFormDone,  setPvFormDone]  = useState(false);

  const resetPv = () => { setPvStep(1); setWinItem(null); setSpinKey(k => k+1); setPvFormDone(false); };

  const { theme = {} }  = config;
  const pc  = config.primaryColor  || "#3B82F6";
  const sc  = config.secondaryColor || "#0EA5E9";
  const tc  = theme.textColor || "#0F0F1A";
  const ff  = theme.font || "DM Sans";
  const btn = theme.btnColor || pc;
  const br  = theme.btnRadius ?? 14;
  const btnTc    = autoText(btn);
  const subtleTc = `${tc}95`;

  const pageBg = (theme.bgType === "gradient" && theme.bgGradient)
    ? theme.bgGradient
    : (theme.bg && theme.bg !== "#ffffff") ? theme.bg
    : `linear-gradient(160deg, ${pc}12 0%, ${sc}08 50%, #F8FAFC 100%)`;

  const isOnDark = lum(tc) > 0.5;
  const cardBg   = theme.cardColor || (isOnDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.04)");
  const cardBrd  = isOnDark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.08)";

  const previewRewards = config.rewards.filter(r => r.name).map(r => ({ ...r, probability: r.prob }));
  const cf = theme.collectFields || {};
  const hasCollect = cf.prenom === true || cf.email === true || cf.telephone === true;

  const pageContent = (
    <div style={{ background: pageBg, fontFamily: `'${ff}', DM Sans, system-ui, sans-serif`, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
        borderBottom: `1px solid ${cardBrd}`,
        background: isOnDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 10,
      }}>
        {config.logoUrl
          ? <img src={config.logoUrl} alt="" style={{ height: 26, borderRadius: 5, objectFit: "contain" }} />
          : <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${pc}, ${sc})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>{(entreprise?.nom || "V")[0].toUpperCase()}</span>
            </div>
        }
        <span style={{ fontWeight: 800, fontSize: 14, color: tc }}>{entreprise?.nom || "Mon établissement"}</span>
      </header>

      {/* Banner */}
      {theme.banner && <img src={theme.banner} alt="" style={{ width: "100%", height: 90, objectFit: "cover" }} />}

      <div style={{ flex: 1, padding: "16px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {/* Step dots */}
        <div style={{ display: "flex", gap: 5 }}>
          {[1,2,3].map(n => (
            <div key={n} style={{
              width: 22, height: 22, borderRadius: "50%",
              background: n < pvStep ? "#00B894" : n === pvStep ? pc : `${tc}15`,
              border: `1.5px solid ${n <= pvStep ? (n < pvStep ? "#00B894" : pc) : `${tc}15`}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 800, color: n <= pvStep ? "#fff" : `${tc}50`,
            }}>{n < pvStep ? "✓" : n}</div>
          ))}
        </div>

        {/* Step 1 — Landing */}
        {pvStep === 1 && (
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: 38, lineHeight: 1, marginBottom: 8 }}>⭐</div>
            <h1 style={{ fontSize: 16, fontWeight: 900, color: tc, margin: "0 0 7px", lineHeight: 1.3, fontFamily: `'${ff}', sans-serif` }}>
              {theme.title || config.ctaText || "Tournez et gagnez !"}
            </h1>
            <p style={{ color: subtleTc, fontSize: 11, lineHeight: 1.6, margin: "0 auto 14px", maxWidth: 280 }}>
              {theme.welcome || "Laissez-nous un avis Google, puis revenez ici pour tourner la roue !"}
            </p>
            <button onClick={() => setPvStep(2)} style={{
              padding: "11px 24px", borderRadius: br, border: "none",
              background: btn, color: btnTc, fontWeight: 800, fontSize: 13,
              cursor: "pointer", fontFamily: `'${ff}', sans-serif`,
              boxShadow: `0 6px 20px ${btn}44`,
            }}>{theme.btnText || "⭐ Laisser mon avis Google"}</button>
            {previewRewards.length > 0 && (
              <div style={{ marginTop: 16, opacity: 0.35, pointerEvents: "none" }}>
                <SpinWheel key={`prev-idle-${spinKey}`}
                  rewards={previewRewards} primaryColor={pc} secondaryColor={sc}
                  segmentColors={theme.segmentColors} borderColor={theme.borderColor}
                  centerColor={theme.centerColor} centerLogoUrl={theme.centerLogo || config.logoUrl}
                  fontFamily={ff} size={180} disabled />
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Wheel */}
        {pvStep === 2 && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#00B89418", border: "1.5px solid #00B89430", borderRadius: 10, padding: "6px 12px" }}>
              <span style={{ color: "#00B894", fontWeight: 800, fontSize: 11 }}>✓ Merci pour votre avis !</span>
            </div>
            {previewRewards.length > 0
              ? <SpinWheel key={`prev-spin-${spinKey}`}
                  rewards={previewRewards} primaryColor={pc} secondaryColor={sc}
                  segmentColors={theme.segmentColors} borderColor={theme.borderColor}
                  centerColor={theme.centerColor} centerLogoUrl={theme.centerLogo || config.logoUrl}
                  fontFamily={ff} size={200} disabled={false}
                  onResult={rw => { setWinItem(rw); setPvStep(3); }}
                />
              : <p style={{ color: subtleTc, fontSize: 11, textAlign: "center", padding: "16px 0" }}>Ajoutez des récompenses (étape 3) pour voir la roue</p>
            }
          </div>
        )}

        {/* Step 3 — Collect form (if needed) or Result */}
        {pvStep === 3 && hasCollect && !pvFormDone && (
          <div style={{ width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 30, lineHeight: 1, marginBottom: 6 }}>📋</div>
              <h2 style={{ fontSize: 15, fontWeight: 900, color: tc, margin: "0 0 4px", fontFamily: `'${ff}', sans-serif` }}>Encore une étape !</h2>
              <p style={{ color: subtleTc, fontSize: 11, margin: 0 }}>Renseignez vos coordonnées pour recevoir votre cadeau.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {cf.prenom && (
                <input disabled placeholder="Prénom" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${pc}40`, fontSize: 12, background: cardBg, color: tc, boxSizing: "border-box", outline: "none" }} />
              )}
              {cf.email && (
                <input disabled placeholder="Adresse email" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${pc}40`, fontSize: 12, background: cardBg, color: tc, boxSizing: "border-box", outline: "none" }} />
              )}
              {cf.telephone && (
                <input disabled placeholder="Numéro de téléphone" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${pc}40`, fontSize: 12, background: cardBg, color: tc, boxSizing: "border-box", outline: "none" }} />
              )}
            </div>
            <button onClick={() => setPvFormDone(true)} style={{
              width: "100%", padding: "10px", borderRadius: br, border: "none",
              background: btn, color: btnTc, fontWeight: 800, fontSize: 12,
              cursor: "pointer", fontFamily: `'${ff}', sans-serif`,
            }}>Découvrir mon cadeau →</button>
          </div>
        )}

        {pvStep === 3 && (!hasCollect || pvFormDone) && (
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 6 }}>🎉</div>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: tc, margin: "0 0 5px", fontFamily: `'${ff}', sans-serif` }}>Félicitations !</h2>
            <p style={{ color: subtleTc, fontSize: 12, margin: "0 0 12px" }}>Vous avez gagné :</p>
            <div style={{ background: `${pc}18`, border: `2px solid ${pc}30`, borderRadius: 12, padding: "12px 18px", marginBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: pc, fontFamily: `'${ff}', sans-serif` }}>{winItem?.name || "Récompense"}</span>
            </div>
            <div style={{ background: "#0F0F1A", borderRadius: 12, padding: "14px 18px", marginBottom: 12 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: 3 }}>DEMO1234</span>
            </div>
            {theme.thanks && (
              <div style={{ background: cardBg, border: `1px solid ${cardBrd}`, borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
                <p style={{ fontSize: 11, color: tc, margin: 0, fontWeight: 600 }}>{theme.thanks}</p>
              </div>
            )}
            <button onClick={resetPv} style={{ background: "none", border: `1.5px solid ${pc}50`, borderRadius: 8, color: pc, padding: "5px 14px", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
              ↺ Recommencer
            </button>
          </div>
        )}
      </div>

      <footer style={{ textAlign: "center", padding: "10px", fontSize: 9, color: subtleTc, borderTop: `1px solid ${cardBrd}` }}>
        Propulsé par <span style={{ color: pc, fontWeight: 700 }}>VisiumBoost</span>
      </footer>
    </div>
  );

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7 }}>
          Aperçu live
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {[["mobile","📱 Mobile"],["desktop","🖥️ Desktop"]].map(([d,label]) => (
            <button key={d} onClick={() => setDevice(d)} style={{
              padding: "4px 11px", borderRadius: 7, border: "none", fontSize: 11, fontWeight: 700,
              background: device === d ? "#0F172A" : "#EEF0F3",
              color: device === d ? "#fff" : "#8896A5",
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Frame */}
      {device === "mobile" ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "#1A1A1A",
            borderRadius: compact ? 36 : 44,
            padding: compact ? "12px 8px 14px" : "14px 10px 16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            position: "relative",
            maxWidth: "100%",
          }}>
            <div style={{
              position: "absolute", top: compact ? 12 : 14, left: "50%",
              transform: "translateX(-50%)",
              width: compact ? 56 : 68, height: 16,
              background: "#1A1A1A", borderRadius: "0 0 10px 10px", zIndex: 10,
            }} />
            <div style={{
              width: compact ? 240 : 300,
              height: compact ? 480 : 580,
              borderRadius: compact ? 26 : 32,
              overflow: "hidden", background: pageBg,
            }}>
              <div style={{ height: "100%", overflowY: "auto", scrollbarWidth: "none" }}>
                {pageContent}
              </div>
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
              <div style={{ width: compact ? 56 : 72, height: 4, borderRadius: 2, background: "#3A3A3A" }} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ background: "#F5F5F7", borderBottom: "1.5px solid #E2E8F0", padding: "7px 10px", display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {["#FF5F57","#FFBD2E","#28C941"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
            </div>
            <div style={{ flex: 1, background: "#E5E7EB", borderRadius: 5, padding: "3px 8px", fontSize: 9, color: "#8896A5", fontFamily: "'DM Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              visium-boost.fr/roue/{entreprise?.slug || "mon-etablissement"}
            </div>
          </div>
          <div style={{ height: compact ? 460 : 560, overflowY: "auto", scrollbarWidth: "none", background: pageBg }}>
            {pageContent}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COLOUR FIELD HELPER
// ═══════════════════════════════════════════════════════════════
function ColorField({ label, value, onChange }) {
  return (
    <div>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5 }}>{label}</div>}
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        <input type="color" value={value || "#ffffff"} onChange={e => onChange(e.target.value)}
          style={{ width: 33, height: 33, borderRadius: 8, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2, flexShrink: 0 }} />
        <input value={value || ""} onChange={e => onChange(e.target.value)}
          style={{ flex: 1, padding: "7px 10px", borderRadius: 9, border: "1.5px solid #E2E8F0", fontSize: 12, outline: "none", fontFamily: "'DM Mono',monospace", background: "#fff", color: "#0F172A", boxSizing: "border-box" }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function PageWheel() {
  const [entreprises,  setEntreprises]  = useState([]);
  const [selectedId,   setSelectedId]   = useState(null);
  const [config,       setConfig]       = useState(DEFAULT_CONFIG);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [step,         setStep]         = useState(1);
  const [ctrlTab,      setCtrlTab]      = useState("roue");
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [confetti,     setConfetti]     = useState(false);
  const [previewOpen,  setPreviewOpen]  = useState(false);
  const [copiedSlug,   setCopiedSlug]   = useState(null);
  const qrCanvasRefs = useRef({});
  const tplScrollRef = useRef(null);

  const scrollTpl = (dir) => {
    tplScrollRef.current?.scrollBy({ left: dir * 104, behavior: "smooth" });
  };

  // ── Load ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/entreprises").then(r => r.json()).then(d => {
      const list = d.entreprises || [];
      setEntreprises(list);
      if (list.length > 0) { setSelectedId(list[0]._id); setConfig(entrepriseToConfig(list[0])); }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSelectEntreprise = (id) => {
    setSelectedId(id);
    const e = entreprises.find(x => x._id === id);
    if (e) setConfig(entrepriseToConfig(e));
    setSaved(false); setActiveTemplate(null);
  };

  // ── Config helpers ────────────────────────────────────────────
  const update  = (k, v)     => setConfig(p => ({ ...p, [k]: v }));
  const updateT = (k, v)     => setConfig(p => ({ ...p, theme: { ...p.theme, [k]: v } }));

  const addReward    = ()     => update("rewards", [...config.rewards, { id: uid(), name: "", prob: 0 }]);
  const removeReward = i      => update("rewards", config.rewards.filter((_,j) => j !== i));
  const updateReward = (i, k, v) => {
    const n = [...config.rewards];
    n[i] = { ...n[i], [k]: k === "prob" ? Math.max(0, Math.min(100, +v || 0)) : v };
    update("rewards", n);
  };

  const updateSegColor = (i, v) => {
    const n = [...(config.theme.segmentColors || [])];
    while (n.length <= i) n.push("");
    n[i] = v;
    updateT("segmentColors", n);
  };

  const getSegColor = (i) => {
    const c = config.theme.segmentColors?.[i];
    if (c && c !== "") return c;
    const base = [config.primaryColor, config.secondaryColor, ...DEFAULT_PALETTE];
    return base[i % base.length];
  };

  // ── Apply template ────────────────────────────────────────────
  const applyTemplate = (tpl) => {
    const newSeg = config.rewards.map((_, i) => tpl.palette[i % tpl.palette.length]);
    setConfig(p => ({
      ...p,
      primaryColor:   tpl.primaryColor,
      secondaryColor: tpl.secondaryColor,
      theme: {
        ...p.theme,
        segmentColors: newSeg,
        borderColor:   tpl.wheelBorderColor,
        centerColor:   tpl.wheelCenterColor,
        font:          tpl.wheelFont,
        wheelSize:     tpl.wheelSize,
        bg:            tpl.bg, bgType: tpl.bgType, bgGradient: tpl.bgGradient || "",
        textColor:     tpl.textColor,
        btnColor:      tpl.btnColor,
        btnText:       tpl.btnText,
        btnRadius:     tpl.btnRadius,
        title:         tpl.title,
        welcome:       tpl.welcome,
        thanks:        tpl.thanks,
        cardColor:     tpl.cardColor || "",
      },
    }));
    setActiveTemplate(tpl.id);
  };

  // ── Save ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true); setSaved(false);
    try {
      const r = await fetch("/api/entreprises", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:                 selectedId,
          lien_avis:          config.googleLink,
          couleur_principale: config.primaryColor,
          couleur_secondaire: config.secondaryColor,
          cta_text:           config.ctaText,
          logo:               config.logoUrl,
          rewards: config.rewards.map(r => ({ id: r.id, name: r.name, probability: r.prob })),
          theme:   config.theme,
        }),
      });
      if (r.ok) {
        const { entreprise: upd } = await r.json();
        setEntreprises(prev => prev.map(e => e._id === upd._id ? upd : e));
        setSaved(true); setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    setSaving(false);
  };

  // ── QR ────────────────────────────────────────────────────────
  const getPublicUrl = (slug) => `${APP_URL}/roue/${slug}`;
  const copyLink = async (slug) => {
    await navigator.clipboard.writeText(getPublicUrl(slug));
    setCopiedSlug(slug); setTimeout(() => setCopiedSlug(null), 2000);
  };
  const downloadQR = (slug) => {
    const c = qrCanvasRefs.current[slug];
    if (!c) return;
    const a = document.createElement("a"); a.download = `qr-${slug}.png`; a.href = c.toDataURL(); a.click();
  };
  const QRCanvas = ({ slug }) => {
    const ref = useRef(null);
    useEffect(() => {
      if (!ref.current) return;
      qrCanvasRefs.current[slug] = ref.current;
      import("qrcode").then(QR => QR.toCanvas(ref.current, getPublicUrl(slug), { width: 160, margin: 2, color: { dark: "#0F172A", light: "#ffffff" } }).catch(() => {}));
    }, [slug]);
    return <canvas ref={ref} style={{ borderRadius: 10 }} />;
  };

  const totalProb = config.rewards.reduce((s, r) => s + (r.prob || 0), 0);
  const selectedEntreprise = entreprises.find(e => e._id === selectedId);

  const inp = {
    width: "100%", padding: "9px 12px", borderRadius: 10,
    border: "1.5px solid #E2E8F0", fontSize: 13, outline: "none",
    background: "#fff", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif",
    color: "#0F172A", transition: "border-color 0.15s",
  };
  const focusBlue  = e => (e.target.style.borderColor = "#3B82F6");
  const blurGray   = e => (e.target.style.borderColor = "#E2E8F0");

  // ── Loading ───────────────────────────────────────────────────
  if (loading) return (
    <div className="animate-fade-in">
      <div className="mb-7"><h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ma Roue</h1></div>
      <div className="card p-12 text-center text-slate-300 text-sm">Chargement…</div>
    </div>
  );
  if (entreprises.length === 0) return (
    <div className="animate-fade-in">
      <div className="mb-7"><h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ma Roue</h1></div>
      <div className="card p-12 text-center">
        <div style={{ fontSize: 40, marginBottom: 14 }}>🏪</div>
        <p style={{ fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Aucun établissement</p>
        <p style={{ color: "#94A3B8", fontSize: 13 }}>Créez d&apos;abord un établissement dans <strong>Mes entreprises</strong>.</p>
      </div>
    </div>
  );

  const STEPS = [{ n:1, label:"Lien d'avis" }, { n:2, label:"Personnalisation" }, { n:3, label:"Récompenses" }];

  return (
    <div className="animate-fade-in">
      <Confetti active={confetti} />

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ma Roue</h1>
          <p className="text-slate-400 text-sm mt-1">Configurez votre roue de la fortune</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {saved && (
            <span style={{ padding: "7px 14px", borderRadius: 10, background: "#F0FDF4", border: "1.5px solid #BBF7D0", color: "#16A34A", fontSize: 13, fontWeight: 600 }}>
              ✓ Sauvegardé
            </span>
          )}
          {step !== 2 && (
            <button onClick={() => setPreviewOpen(!previewOpen)} className={previewOpen ? "btn-primary" : "btn-secondary"}>
              <Icon name="eye" size={16} color={previewOpen ? "#fff" : undefined} />Aperçu
            </button>
          )}
        </div>
      </div>

      {/* ── Entreprise selector ── */}
      {entreprises.length > 1 && (
        <div className="card p-4 mb-5">
          <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 7 }}>Établissement à configurer</label>
          <select value={selectedId || ""} onChange={e => handleSelectEntreprise(e.target.value)}
            style={{ ...inp, width: "auto", minWidth: 260, cursor: "pointer" }}
            onFocus={focusBlue} onBlur={blurGray}>
            {entreprises.map(e => <option key={e._id} value={e._id}>{e.nom}</option>)}
          </select>
        </div>
      )}

      {/* ── Steps indicator ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
        {STEPS.map((s, idx) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setStep(s.n)} style={{
              width: 32, height: 32, borderRadius: "50%", border: "none",
              background: step >= s.n ? "#2563EB" : "#E2E8F0",
              color: step >= s.n ? "#fff" : "#94A3B8",
              fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
            }}>{s.n}</button>
            <span style={{ fontSize: 13, fontWeight: step === s.n ? 700 : 500, color: step === s.n ? "#0F172A" : "#94A3B8" }}>{s.label}</span>
            {idx < 2 && <div style={{ width: 28, height: 2, borderRadius: 9999, background: step > s.n ? "#2563EB" : "#E2E8F0" }} />}
          </div>
        ))}
      </div>

      {/* ════ STEP 1 ════ */}
      {step === 1 && (
        <div className="card p-6">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="link" size={18} color="#2563EB" />Lien d&apos;avis Google
          </h3>
          <input value={config.googleLink} onChange={e => update("googleLink", e.target.value)}
            placeholder="https://g.page/r/votre-lien-avis" style={inp}
            onFocus={focusBlue} onBlur={blurGray} />
          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>
            Récupérez ce lien depuis votre fiche Google Business → Obtenir plus d&apos;avis
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button onClick={() => setStep(2)} className="btn-primary">
              Suivant <Icon name="chevronRight" size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* ════ STEP 2 — SPLIT SCREEN ════ */}
      {step === 2 && (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* ── LEFT PANEL (controls) ─────────────────────── */}
          <div style={{
            flex: "0 0 68%",
            background: "#fff", borderRadius: 20,
            border: "1.5px solid #F0F0F5",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            overflow: "hidden", display: "flex", flexDirection: "column",
          }}>
            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px 4px" }}>

              {/* ─ Templates row ─ */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 11 }}>
                  Templates
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {/* Prev arrow */}
                  <button onClick={() => scrollTpl(-1)} style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                    border: "1.5px solid #E2E8F0", background: "#fff",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: "#64748B", transition: "all 0.15s",
                  }}>‹</button>

                  {/* Scrollable strip */}
                  <div ref={tplScrollRef} style={{
                    display: "flex", gap: 7, overflowX: "auto",
                    paddingBottom: 4, scrollbarWidth: "none", flex: 1,
                    scrollBehavior: "smooth",
                  }}>
                    {/* ── Custom / Personnalisé ── */}
                    {(() => {
                      const isCustom = !activeTemplate;
                      return (
                        <button onClick={() => setActiveTemplate(null)} style={{
                          flexShrink: 0, width: 86, borderRadius: 12,
                          border: `2px solid ${isCustom ? "#2563EB" : "#E2E8F0"}`,
                          background: "#fff", cursor: "pointer", overflow: "hidden",
                          transition: "all 0.15s", padding: 0,
                          boxShadow: isCustom ? "0 2px 12px #2563EB35" : "none",
                        }}>
                          <div style={{
                            height: 36, display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                            background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </div>
                          <div style={{ padding: "5px 4px", textAlign: "center" }}>
                            <div style={{ fontSize: 9, fontWeight: 800, color: "#0F172A" }}>Personnalisé</div>
                            {isCustom && <div style={{ fontSize: 8, color: "#2563EB", fontWeight: 700, marginTop: 1 }}>✓ Actif</div>}
                          </div>
                        </button>
                      );
                    })()}

                    {/* ── Predefined templates ── */}
                    {TEMPLATES.map(tpl => {
                      const sel = activeTemplate === tpl.id;
                      return (
                        <button key={tpl.id} onClick={() => applyTemplate(tpl)} style={{
                          flexShrink: 0, width: 86, borderRadius: 12,
                          border: `2px solid ${sel ? tpl.primaryColor : "#E2E8F0"}`,
                          background: "#fff", cursor: "pointer", overflow: "hidden",
                          transition: "all 0.15s", padding: 0,
                          boxShadow: sel ? `0 2px 12px ${tpl.primaryColor}40` : "none",
                        }}>
                          <div style={{
                            height: 36, display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                            background: tpl.bgType === "gradient" ? tpl.bgGradient : tpl.bg,
                          }}>
                            {tpl.palette.slice(0,4).map((c,i) => (
                              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.5)" }} />
                            ))}
                          </div>
                          <div style={{ padding: "5px 4px", textAlign: "center" }}>
                            <div style={{ fontSize: 9, fontWeight: 800, color: "#0F172A" }}>{tpl.emoji} {tpl.name}</div>
                            {sel && <div style={{ fontSize: 8, color: tpl.primaryColor, fontWeight: 700, marginTop: 1 }}>✓ Actif</div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Next arrow */}
                  <button onClick={() => scrollTpl(1)} style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                    border: "1.5px solid #E2E8F0", background: "#fff",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: "#64748B", transition: "all 0.15s",
                  }}>›</button>
                </div>
              </div>

              {/* ─ Sub-tabs ─ */}
              <div style={{ display: "flex", gap: 2, marginBottom: 18, background: "#F8FAFC", borderRadius: 11, padding: 3 }}>
                {[["roue","🎡 Roue"],["page","📄 Page"]].map(([id, label]) => (
                  <button key={id} onClick={() => setCtrlTab(id)} style={{
                    flex: 1, padding: "7px 10px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700,
                    background: ctrlTab === id ? "#0F172A" : "transparent",
                    color: ctrlTab === id ? "#fff" : "#64748B",
                    cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s",
                  }}>{label}</button>
                ))}
              </div>

              {/* ──── ROUE TAB ──── */}
              {ctrlTab === "roue" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* Couleurs de base */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Couleurs de base</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1 }}><ColorField label="Principale" value={config.primaryColor} onChange={v => update("primaryColor", v)} /></div>
                      <div style={{ flex: 1 }}><ColorField label="Secondaire" value={config.secondaryColor} onChange={v => update("secondaryColor", v)} /></div>
                    </div>
                  </div>

                  {/* Contour & Centre */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Contour & Centre</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1 }}><ColorField label="Contour / flèche" value={config.theme.borderColor} onChange={v => updateT("borderColor", v)} /></div>
                      <div style={{ flex: 1 }}><ColorField label="Centre (hub)" value={config.theme.centerColor} onChange={v => updateT("centerColor", v)} /></div>
                    </div>
                  </div>

                  {/* Logo centre */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Logo au centre</div>
                    <ImageUpload label="" value={config.theme.centerLogo} onChange={v => updateT("centerLogo", v)} />
                  </div>

                  {/* Par segment */}
                  {config.rewards.length > 0 ? (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Couleur par segment</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {config.rewards.map((r, i) => (
                          <div key={r.id || i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", background: "#F8FAFC", borderRadius: 9, border: "1.5px solid #E2E8F0" }}>
                            <input type="color" value={getSegColor(i)} onChange={e => updateSegColor(i, e.target.value)}
                              style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {r.name || `Segment ${i+1}`}
                            </span>
                            {config.theme.segmentColors?.[i] && (
                              <button onClick={() => updateSegColor(i, "")} style={{ background: "none", border: "none", cursor: "pointer", color: "#b2bec3", fontSize: 13, padding: "0 2px" }}>↺</button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: 10, padding: "12px", textAlign: "center", color: "#94A3B8", fontSize: 12 }}>
                      Ajoutez des récompenses (étape 3) pour personnaliser chaque segment.
                    </div>
                  )}

                  {/* Police */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Police des segments</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {FONTS.map(f => {
                        const sel = config.theme.font === f.id;
                        return (
                          <button key={f.id} onClick={() => updateT("font", f.id)} style={{
                            padding: "7px 13px", borderRadius: 9,
                            border: `2px solid ${sel ? "#2563EB" : "#E2E8F0"}`,
                            background: sel ? "#2563EB" : "#fff",
                            color: sel ? "#fff" : "#475569",
                            fontFamily: `'${f.id}', sans-serif`,
                            fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s",
                          }}>Aa — {f.label}</button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Taille */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Taille de la roue</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <input type="range" min={260} max={500} step={10}
                        value={config.theme.wheelSize} onChange={e => updateT("wheelSize", Number(e.target.value))}
                        style={{ flex: 1, accentColor: "#2563EB" }} />
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", minWidth: 52 }}>{config.theme.wheelSize}px</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ──── PAGE TAB ──── */}
              {ctrlTab === "page" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* Fond */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Fond de page</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                      {[["color","Couleur"],["gradient","Dégradé"]].map(([v,l]) => (
                        <button key={v} onClick={() => updateT("bgType", v)} style={{
                          padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                          border: `2px solid ${config.theme.bgType === v ? "#2563EB" : "#E2E8F0"}`,
                          background: config.theme.bgType === v ? "#2563EB" : "#fff",
                          color: config.theme.bgType === v ? "#fff" : "#64748B", cursor: "pointer",
                        }}>{l}</button>
                      ))}
                    </div>
                    {config.theme.bgType === "color" ? (
                      <ColorField label="" value={config.theme.bg} onChange={v => updateT("bg", v)} />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <ColorField label="Début" value={config.theme.bg} onChange={v => {
                              updateT("bg", v);
                              const end = (config.theme.bgGradient.match(/#[0-9a-fA-F]{6}/g) || [])[1] || "#ffffff";
                              updateT("bgGradient", `linear-gradient(135deg, ${v} 0%, ${end} 100%)`);
                            }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <ColorField label="Fin" value={(config.theme.bgGradient.match(/#[0-9a-fA-F]{6}/g) || [])[1] || "#ffffff"}
                              onChange={v => updateT("bgGradient", `linear-gradient(135deg, ${config.theme.bg} 0%, ${v} 100%)`)} />
                          </div>
                        </div>
                        <div style={{ height: 36, borderRadius: 9, background: config.theme.bgGradient || `linear-gradient(135deg, ${config.theme.bg}, #fff)`, border: "1.5px solid #E2E8F0" }} />
                      </div>
                    )}
                  </div>

                  {/* Bannière */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Bannière</div>
                    <ImageUpload label="" value={config.theme.banner} onChange={v => updateT("banner", v)} />
                  </div>

                  {/* Logo */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Logo marchand</div>
                    <ImageUpload label="" value={config.logoUrl} onChange={v => update("logoUrl", v)} />
                  </div>

                  {/* Titre */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Titre principal</div>
                    <input value={config.theme.title} onChange={e => updateT("title", e.target.value)}
                      placeholder="Tournez et gagnez !" style={inp} onFocus={focusBlue} onBlur={blurGray} />
                  </div>

                  {/* Message bienvenue */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Message de bienvenue</div>
                    <textarea value={config.theme.welcome} onChange={e => updateT("welcome", e.target.value)}
                      placeholder="Laissez-nous un avis Google, puis revenez tourner la roue !"
                      rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.5 }}
                      onFocus={focusBlue} onBlur={blurGray} />
                  </div>

                  {/* Bouton */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Bouton principal</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input value={config.theme.btnText} onChange={e => updateT("btnText", e.target.value)}
                        placeholder="⭐ Laisser mon avis Google" style={inp} onFocus={focusBlue} onBlur={blurGray} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <ColorField label="Couleur" value={config.theme.btnColor || config.primaryColor} onChange={v => updateT("btnColor", v)} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5 }}>Border-radius</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input type="range" min={0} max={999} step={1}
                              value={config.theme.btnRadius ?? 14} onChange={e => updateT("btnRadius", Number(e.target.value))}
                              style={{ flex: 1, accentColor: "#2563EB" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#0F172A", minWidth: 32 }}>{config.theme.btnRadius ?? 14}</span>
                          </div>
                        </div>
                      </div>
                      {/* Preview */}
                      <div>
                        <div style={{
                          display: "inline-block", padding: "10px 22px",
                          borderRadius: config.theme.btnRadius ?? 14,
                          background: config.theme.btnColor || config.primaryColor,
                          color: autoText(config.theme.btnColor || config.primaryColor),
                          fontWeight: 800, fontSize: 13,
                          fontFamily: `'${config.theme.font}', sans-serif`,
                        }}>
                          {config.theme.btnText || "⭐ Laisser mon avis Google"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message après spin */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Message après le spin</div>
                    <input value={config.theme.thanks} onChange={e => updateT("thanks", e.target.value)}
                      placeholder="Merci ! Votre cadeau vous attend en caisse." style={inp} onFocus={focusBlue} onBlur={blurGray} />
                  </div>

                  {/* Informations à collecter */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>Informations à collecter</div>
                    <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 10, lineHeight: 1.5 }}>
                      Cochez les champs à afficher avant de montrer le code gagnant.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { key: "prenom",    label: "Prénom" },
                        { key: "email",     label: "Email" },
                        { key: "telephone", label: "Numéro de téléphone" },
                      ].map(({ key, label }) => {
                        const checked = config.theme.collectFields?.[key] === true;
                        return (
                          <label key={key} style={{
                            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                            padding: "9px 12px", borderRadius: 10,
                            border: `1.5px solid ${checked ? "#2563EB" : "#E2E8F0"}`,
                            background: checked ? "#EFF6FF" : "#F8FAFC",
                            transition: "all 0.15s",
                          }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={e => updateT("collectFields", { ...(config.theme.collectFields || {}), [key]: e.target.checked })}
                              style={{ width: 15, height: 15, accentColor: "#2563EB", cursor: "pointer", flexShrink: 0 }}
                            />
                            <span style={{ fontSize: 13, fontWeight: checked ? 700 : 500, color: checked ? "#1D4ED8" : "#475569" }}>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {(config.theme.collectFields?.prenom === true || config.theme.collectFields?.email === true || config.theme.collectFields?.telephone === true) && (
                      <p style={{ fontSize: 11, color: "#3B82F6", marginTop: 8, fontWeight: 600 }}>
                        ✓ Un formulaire apparaîtra avant le code gagnant
                      </p>
                    )}
                  </div>

                  {/* Couleurs texte / cards */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Couleurs globales</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1 }}><ColorField label="Texte global" value={config.theme.textColor} onChange={v => updateT("textColor", v)} /></div>
                      <div style={{ flex: 1 }}><ColorField label="Fond des cards" value={config.theme.cardColor || "#F8FAFC"} onChange={v => updateT("cardColor", v)} /></div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ height: 20 }} />
            </div>

            {/* ── Sticky footer nav ── */}
            <div style={{ padding: "14px 18px", borderTop: "1.5px solid #F0F0F5", display: "flex", justifyContent: "space-between", background: "#fff" }}>
              <button onClick={() => setStep(1)} className="btn-secondary" style={{ fontSize: 13 }}>← Retour</button>
              <button onClick={() => setStep(3)} className="btn-primary" style={{ fontSize: 13 }}>
                Récompenses → <Icon name="chevronRight" size={15} color="#fff" />
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL (live preview) ──────────────────── */}
          <div style={{ flex: 1, position: "sticky", top: 80, minWidth: 0 }}>
            <LivePreview config={config} entreprise={selectedEntreprise} compact />
          </div>
        </div>
      )}

      {/* ════ STEP 3 — Récompenses ════ */}
      {step === 3 && (
        <div className="card p-6">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="gift" size={18} color="#2563EB" />Récompenses
            </h3>
            <span style={{ fontSize: 13, fontWeight: 700, color: totalProb === 100 ? "#10B981" : totalProb > 100 ? "#EF4444" : "#F59E0B" }}>
              Total : {totalProb}%
              {totalProb !== 100 && <span style={{ fontSize: 12, fontWeight: 500, marginLeft: 6 }}>— doit être = 100%</span>}
            </span>
          </div>

          {config.rewards.length === 0 && (
            <div style={{ padding: "20px", borderRadius: 11, background: "#F8FAFC", border: "1.5px dashed #E2E8F0", textAlign: "center", marginBottom: 14, color: "#94A3B8", fontSize: 13 }}>
              Aucune récompense. Cliquez sur &quot;Ajouter une récompense&quot;.
            </div>
          )}

          {config.rewards.map((r, i) => (
            <div key={r.id || i} style={{ display: "flex", gap: 9, marginBottom: 9, alignItems: "center", flexWrap: "wrap" }}>
              <input type="color" value={getSegColor(i)} onChange={e => updateSegColor(i, e.target.value)}
                title="Couleur du segment"
                style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2, flexShrink: 0 }} />
              <input value={r.name} onChange={e => updateReward(i, "name", e.target.value)}
                placeholder="Nom de la récompense" style={{ ...inp, flex: "2 1 150px" }}
                onFocus={focusBlue} onBlur={blurGray} />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <input type="number" value={r.prob} onChange={e => updateReward(i, "prob", e.target.value)}
                  min={0} max={100} style={{ ...inp, width: 65, textAlign: "center", padding: "9px 6px" }}
                  onFocus={focusBlue} onBlur={blurGray} />
                <span style={{ color: "#64748B", fontWeight: 700, fontSize: 13 }}>%</span>
              </div>
              <button onClick={() => removeReward(i)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#FEF2F2", color: "#EF4444", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
            </div>
          ))}

          <button onClick={addReward} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, marginTop: 4, border: "1.5px dashed #CBD5E1", background: "transparent", color: "#3B82F6", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Icon name="plus" size={14} color="#3B82F6" />Ajouter une récompense
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <button onClick={() => setStep(2)} className="btn-secondary">Retour</button>
            <button onClick={handleSave}
              disabled={saving || totalProb !== 100 || !selectedId}
              className="btn-primary"
              style={{ opacity: saving || totalProb !== 100 || !selectedId ? 0.5 : 1, cursor: saving || totalProb !== 100 || !selectedId ? "not-allowed" : "pointer" }}>
              {saving ? "Sauvegarde…" : "Enregistrer la configuration"}
            </button>
          </div>
        </div>
      )}

      {/* ── QR code ── */}
      {selectedEntreprise && (
        <div className="card p-6 mt-5">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Icon name="qr" size={20} color="#2563EB" />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Lien public &amp; QR Code</h3>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Partagez ou imprimez pour vos clients.</p>
            </div>
          </div>
          <div style={{ border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "16px 18px", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flexShrink: 0 }}><QRCanvas slug={selectedEntreprise.slug} /></div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 14, margin: "0 0 6px" }}>{selectedEntreprise.nom}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F8FAFC", borderRadius: 8, padding: "7px 12px", border: "1.5px solid #E2E8F0", marginBottom: 12 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#475569", flex: 1, wordBreak: "break-all" }}>{getPublicUrl(selectedEntreprise.slug)}</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => copyLink(selectedEntreprise.slug)} className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, borderRadius: 9, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="copy" size={14} color="#fff" />
                  {copiedSlug === selectedEntreprise.slug ? "✓ Copié !" : "Copier le lien"}
                </button>
                <button onClick={() => downloadQR(selectedEntreprise.slug)} className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13, borderRadius: 9, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="download" size={14} />Télécharger QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1/3 preview */}
      {previewOpen && step !== 2 && config.rewards.length > 0 && config.rewards.some(r => r.name) && (
        <div className="card p-7 mt-5 text-center animate-slide-up">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Aperçu de la roue</h3>
          <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>{config.ctaText}</p>
          <SpinWheel
            rewards={config.rewards.filter(r => r.name).map(r => ({ ...r, probability: r.prob }))}
            primaryColor={config.primaryColor} secondaryColor={config.secondaryColor}
            segmentColors={config.theme.segmentColors} borderColor={config.theme.borderColor}
            centerColor={config.theme.centerColor} centerLogoUrl={config.theme.centerLogo || config.logoUrl}
            fontFamily={config.theme.font} size={Math.min(config.theme.wheelSize, 420)}
            onResult={() => { setConfetti(true); setTimeout(() => setConfetti(false), 4000); }}
          />
        </div>
      )}
    </div>
  );
}
