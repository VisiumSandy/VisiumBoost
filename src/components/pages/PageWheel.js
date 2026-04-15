"use client";

import { useState, useEffect, useRef } from "react";
import { uid } from "@/lib/utils";
import Icon from "@/components/Icon";
import SpinWheel from "@/components/SpinWheel";
import Confetti from "@/components/Confetti";
import ImageUpload from "@/components/ImageUpload";

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://visium-boost.fr";

const DEFAULT_PALETTE = ["#6C5CE7","#00B894","#FDCB6E","#E17055","#0984E3","#E84393","#74B9FF","#55EFC4"];

const FONTS = [
  { id: "DM Sans",          label: "DM Sans",       style: "sans-serif" },
  { id: "Inter",            label: "Inter",          style: "sans-serif" },
  { id: "Playfair Display", label: "Playfair",       style: "serif" },
  { id: "Nunito",           label: "Nunito",         style: "rounded" },
  { id: "Space Grotesk",    label: "Space Grotesk",  style: "modern" },
];

const TEMPLATES = [
  {
    id: "elegant", name: "Élégant", emoji: "🏛️",
    desc: "Fond blanc, noir & or, sobre et luxueux",
    palette: ["#1D1D1F","#C9A84C","#F5F0E8","#2C2C2E","#D4AF37","#8C7B5A","#4A4035","#A68B4A"],
    primaryColor: "#1D1D1F",    secondaryColor: "#C9A84C",
    wheelBorderColor: "#C9A84C", wheelCenterColor: "#FAFAFA",
    wheelFont: "Playfair Display", wheelSize: 360,
    pageBg: "#FAFAFA",    pageBgType: "color", pageBgGradient: "",
    pageTextColor: "#1D1D1F",  pageBtnColor: "#1D1D1F",
    pageBtnText: "⭐ Laisser mon avis Google",
    pageTitle: "Tournez et gagnez !",
    pageWelcome: "Laissez-nous un avis et découvrez votre récompense exclusive.",
    pageThanks: "Merci ! Votre cadeau vous attend en caisse.",
  },
  {
    id: "festif", name: "Festif", emoji: "🎉",
    desc: "Fond coloré, couleurs vives, festif",
    palette: ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF6FC8","#845EC2","#FF9A3C","#00C2CB"],
    primaryColor: "#FF6B6B",    secondaryColor: "#FFD93D",
    wheelBorderColor: "#FF6B6B", wheelCenterColor: "#fff",
    wheelFont: "Nunito", wheelSize: 360,
    pageBg: "#7C3AED",    pageBgType: "gradient",
    pageBgGradient: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
    pageTextColor: "#FFFFFF",  pageBtnColor: "#FFD93D",
    pageBtnText: "🎊 Laisser mon avis Google",
    pageTitle: "Tentez votre chance !",
    pageWelcome: "Laissez-nous un avis et tournez la roue des cadeaux !",
    pageThanks: "🎊 Incroyable ! Votre cadeau vous attend !",
  },
  {
    id: "minimaliste", name: "Minimaliste", emoji: "◻️",
    desc: "Épuré, typographie moderne, gris clair",
    palette: ["#18181B","#52525B","#A1A1AA","#3F3F46","#71717A","#D4D4D8","#27272A","#E4E4E7"],
    primaryColor: "#18181B",    secondaryColor: "#71717A",
    wheelBorderColor: "#18181B", wheelCenterColor: "#F4F4F5",
    wheelFont: "Inter", wheelSize: 340,
    pageBg: "#F4F4F5",    pageBgType: "color", pageBgGradient: "",
    pageTextColor: "#18181B",  pageBtnColor: "#18181B",
    pageBtnText: "Laisser un avis Google",
    pageTitle: "Votre avis, votre cadeau.",
    pageWelcome: "Partagez votre expérience et découvrez votre récompense.",
    pageThanks: "Merci. Présentez ce code en caisse.",
  },
  {
    id: "sombre", name: "Sombre", emoji: "🌙",
    desc: "Fond noir, accents néon, style moderne",
    palette: ["#00FF87","#00D4FF","#FF00FF","#FF6B00","#7B2FFF","#00FFB2","#FFE600","#FF0055"],
    primaryColor: "#00FF87",    secondaryColor: "#00D4FF",
    wheelBorderColor: "#00FF87", wheelCenterColor: "#0F0F1A",
    wheelFont: "Space Grotesk", wheelSize: 380,
    pageBg: "#0F0F1A",    pageBgType: "color", pageBgGradient: "",
    pageTextColor: "#FFFFFF",  pageBtnColor: "#00FF87",
    pageBtnText: "⭐ Laisser mon avis",
    pageTitle: "Tournez. Gagnez.",
    pageWelcome: "Laissez votre avis et découvrez votre récompense.",
    pageThanks: "✨ Votre cadeau vous attend !",
  },
  {
    id: "nature", name: "Nature", emoji: "🌿",
    desc: "Tons naturels, fond vert doux, chaleureux",
    palette: ["#16A34A","#65A30D","#CA8A04","#92400E","#6B7280","#4ADE80","#A3E635","#FCD34D"],
    primaryColor: "#16A34A",    secondaryColor: "#65A30D",
    wheelBorderColor: "#16A34A", wheelCenterColor: "#F0FDF4",
    wheelFont: "DM Sans", wheelSize: 360,
    pageBg: "#F0FDF4",    pageBgType: "color", pageBgGradient: "",
    pageTextColor: "#14532D",  pageBtnColor: "#16A34A",
    pageBtnText: "🌿 Laisser mon avis Google",
    pageTitle: "Tournez et gagnez chez nous !",
    pageWelcome: "Merci de nous soutenir. Tournez la roue et gagnez un cadeau !",
    pageThanks: "Merci ! Votre récompense vous attend avec le sourire.",
  },
];

const DEFAULT_CONFIG = {
  googleLink: "", primaryColor: "#3B82F6", secondaryColor: "#0EA5E9",
  ctaText: "Laissez-nous un avis et tentez votre chance !",
  logoUrl: "", rewards: [],
  // wheel
  segmentColors: [], wheelBorderColor: "#ffffff", wheelCenterColor: "#ffffff",
  wheelCenterLogo: "", wheelFont: "DM Sans", wheelSize: 360,
  // page
  pageBg: "#ffffff", pageBgType: "color", pageBgGradient: "",
  pageBanner: "", pageTitle: "", pageWelcome: "",
  pageBtnColor: "", pageBtnText: "⭐ Laisser mon avis Google",
  pageThanks: "", pageTextColor: "#0F0F1A",
};

function entrepriseToConfig(e) {
  return {
    googleLink:     e.lien_avis          || "",
    primaryColor:   e.couleur_principale || "#3B82F6",
    secondaryColor: e.couleur_secondaire || "#0EA5E9",
    ctaText:        e.cta_text           || DEFAULT_CONFIG.ctaText,
    logoUrl:        e.logo               || "",
    rewards: (e.rewards || []).map(r => ({
      id:   r.id || r._id?.toString() || uid(),
      name: r.name  || "",
      prob: r.probability ?? 0,
    })),
    segmentColors:    e.wheel_segment_colors || [],
    wheelBorderColor: e.wheel_border_color   || "#ffffff",
    wheelCenterColor: e.wheel_center_color   || "#ffffff",
    wheelCenterLogo:  e.wheel_center_logo    || "",
    wheelFont:        e.wheel_font           || "DM Sans",
    wheelSize:        e.wheel_size           || 360,
    pageBg:           e.page_bg             || "#ffffff",
    pageBgType:       e.page_bg_type        || "color",
    pageBgGradient:   e.page_bg_gradient    || "",
    pageBanner:       e.page_banner         || "",
    pageTitle:        e.page_title          || "",
    pageWelcome:      e.page_welcome        || "",
    pageBtnColor:     e.page_btn_color      || "",
    pageBtnText:      e.page_btn_text       || "⭐ Laisser mon avis Google",
    pageThanks:       e.page_thanks         || "",
    pageTextColor:    e.page_text_color     || "#0F0F1A",
  };
}

// ═══════════════════════════════════════════════════════════
// SMALL HELPERS
// ═══════════════════════════════════════════════════════════
function ColorField({ label, value, onChange, small }) {
  return (
    <div>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>{label}</label>}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="color" value={value || "#ffffff"} onChange={e => onChange(e.target.value)}
          style={{ width: 36, height: 34, borderRadius: 8, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2, flexShrink: 0 }} />
        <input value={value || ""} onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, padding: small ? "7px 10px" : "10px 12px", borderRadius: 10,
            border: "1.5px solid #E2E8F0", fontSize: 13, outline: "none",
            fontFamily: "'DM Mono', monospace", background: "#fff",
            color: "#0F172A", boxSizing: "border-box",
          }} />
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896A5", textTransform: "uppercase",
      letterSpacing: 0.8, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #F1F5F9" }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function PageWheel() {
  const [entreprises, setEntreprises] = useState([]);
  const [selectedId,  setSelectedId]  = useState(null);
  const [config,      setConfig]      = useState(DEFAULT_CONFIG);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [step,        setStep]        = useState(1);
  const [subTab,      setSubTab]      = useState("templates"); // templates | roue | page
  const [showConfetti,setShowConfetti]= useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copiedSlug,  setCopiedSlug]  = useState(null);
  const qrCanvasRefs = useRef({});

  // ── Load ─────────────────────────────────────────────────
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
    setSaved(false);
  };

  const update = (field, val) => setConfig(prev => ({ ...prev, [field]: val }));

  // ── Rewards helpers ───────────────────────────────────────
  const addReward = () => update("rewards", [...config.rewards, { id: uid(), name: "", prob: 0 }]);
  const removeReward = (i) => update("rewards", config.rewards.filter((_, idx) => idx !== i));
  const updateReward = (i, field, val) => {
    const next = [...config.rewards];
    next[i] = { ...next[i], [field]: field === "prob" ? Math.max(0, Math.min(100, +val || 0)) : val };
    update("rewards", next);
  };

  // ── Segment colors ────────────────────────────────────────
  const updateSegmentColor = (i, val) => {
    const next = [...(config.segmentColors || [])];
    while (next.length <= i) next.push("");
    next[i] = val;
    update("segmentColors", next);
  };

  const getSegmentColor = (i) => {
    if (config.segmentColors?.[i] && config.segmentColors[i] !== "") return config.segmentColors[i];
    const base = [config.primaryColor, config.secondaryColor, ...DEFAULT_PALETTE];
    return base[i % base.length];
  };

  // ── Apply template ────────────────────────────────────────
  const applyTemplate = (tpl) => {
    const newSegColors = config.rewards.map((_, i) => tpl.palette[i % tpl.palette.length]);
    setConfig(prev => ({
      ...prev,
      primaryColor:     tpl.primaryColor,
      secondaryColor:   tpl.secondaryColor,
      wheelBorderColor: tpl.wheelBorderColor,
      wheelCenterColor: tpl.wheelCenterColor,
      wheelFont:        tpl.wheelFont,
      wheelSize:        tpl.wheelSize,
      segmentColors:    newSegColors,
      pageBg:           tpl.pageBg,
      pageBgType:       tpl.pageBgType,
      pageBgGradient:   tpl.pageBgGradient || "",
      pageTextColor:    tpl.pageTextColor,
      pageBtnColor:     tpl.pageBtnColor,
      pageBtnText:      tpl.pageBtnText,
      pageTitle:        tpl.pageTitle,
      pageWelcome:      tpl.pageWelcome,
      pageThanks:       tpl.pageThanks,
    }));
    setSubTab("roue");
  };

  // ── Save ──────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true); setSaved(false);
    try {
      const r = await fetch("/api/entreprises", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:                  selectedId,
          lien_avis:           config.googleLink,
          couleur_principale:  config.primaryColor,
          couleur_secondaire:  config.secondaryColor,
          cta_text:            config.ctaText,
          logo:                config.logoUrl,
          rewards: config.rewards.map(r => ({ id: r.id, name: r.name, probability: r.prob })),
          // wheel
          wheel_segment_colors: config.segmentColors,
          wheel_border_color:   config.wheelBorderColor,
          wheel_center_color:   config.wheelCenterColor,
          wheel_center_logo:    config.wheelCenterLogo,
          wheel_font:           config.wheelFont,
          wheel_size:           config.wheelSize,
          // page
          page_bg:          config.pageBg,
          page_bg_type:     config.pageBgType,
          page_bg_gradient: config.pageBgGradient,
          page_banner:      config.pageBanner,
          page_title:       config.pageTitle,
          page_welcome:     config.pageWelcome,
          page_btn_color:   config.pageBtnColor,
          page_btn_text:    config.pageBtnText,
          page_thanks:      config.pageThanks,
          page_text_color:  config.pageTextColor,
        }),
      });
      if (r.ok) {
        const { entreprise: updated } = await r.json();
        setEntreprises(prev => prev.map(e => e._id === updated._id ? updated : e));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    setSaving(false);
  };

  // ── QR code ───────────────────────────────────────────────
  const getPublicUrl = (slug) => `${APP_URL}/roue/${slug}`;
  const copyLink = async (slug) => {
    await navigator.clipboard.writeText(getPublicUrl(slug));
    setCopiedSlug(slug); setTimeout(() => setCopiedSlug(null), 2000);
  };
  const downloadQR = (slug) => {
    const canvas = qrCanvasRefs.current[slug];
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `qr-${slug}.png`; a.href = canvas.toDataURL("image/png"); a.click();
  };

  const QRCanvas = ({ slug }) => {
    const ref = useRef(null);
    useEffect(() => {
      if (!ref.current) return;
      qrCanvasRefs.current[slug] = ref.current;
      import("qrcode").then(QRCode => {
        QRCode.toCanvas(ref.current, getPublicUrl(slug), {
          width: 160, margin: 2, color: { dark: "#0F172A", light: "#ffffff" },
        }).catch(() => {});
      });
    }, [slug]);
    return <canvas ref={ref} style={{ borderRadius: 10 }} />;
  };

  const totalProb = config.rewards.reduce((s, r) => s + (r.prob || 0), 0);

  const inp = {
    width: "100%", padding: "10px 13px", borderRadius: 10,
    border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none",
    background: "#fff", boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
  };

  const STEPS = [
    { n: 1, label: "Lien d'avis" },
    { n: 2, label: "Personnalisation" },
    { n: 3, label: "Récompenses" },
  ];

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
        <p style={{ fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Aucun établissement trouvé</p>
        <p style={{ color: "#94A3B8", fontSize: 13 }}>
          Créez d&apos;abord un établissement dans <strong>Mes entreprises</strong>.
        </p>
      </div>
    </div>
  );

  const selectedEntreprise = entreprises.find(e => e._id === selectedId);

  return (
    <div className="animate-fade-in">
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ma Roue</h1>
          <p className="text-slate-400 text-sm mt-1">Configurez votre roue de la fortune en 3 étapes</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {saved && (
            <span style={{ padding: "8px 14px", borderRadius: 10, background: "#F0FDF4",
              border: "1.5px solid #BBF7D0", color: "#16A34A", fontSize: 13, fontWeight: 600 }}>
              ✓ Sauvegardé
            </span>
          )}
          <button onClick={() => setPreviewOpen(!previewOpen)} className={previewOpen ? "btn-primary" : "btn-secondary"}>
            <Icon name="eye" size={16} color={previewOpen ? "#fff" : undefined} />
            Aperçu
          </button>
        </div>
      </div>

      {/* Sélecteur d'établissement */}
      {entreprises.length > 1 && (
        <div className="card p-4 mb-5">
          <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 7 }}>
            Établissement à configurer
          </label>
          <select value={selectedId || ""} onChange={e => handleSelectEntreprise(e.target.value)}
            style={{ ...inp, width: "auto", minWidth: 260, padding: "9px 13px", cursor: "pointer" }}
            onFocus={e => e.target.style.borderColor = "#3B82F6"}
            onBlur={e => e.target.style.borderColor = "#E2E8F0"}>
            {entreprises.map(e => <option key={e._id} value={e._id}>{e.nom}</option>)}
          </select>
        </div>
      )}

      {/* Steps */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
        {STEPS.map((s, idx) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setStep(s.n)} style={{
              width: 32, height: 32, borderRadius: "50%", border: "none",
              background: step >= s.n ? "#2563EB" : "#E2E8F0",
              color: step >= s.n ? "#fff" : "#94A3B8",
              fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
            }}>{s.n}</button>
            <span style={{ fontSize: 13, fontWeight: step === s.n ? 700 : 500, color: step === s.n ? "#0F172A" : "#94A3B8" }}>
              {s.label}
            </span>
            {idx < 2 && <div style={{ width: 32, height: 2, borderRadius: 9999, marginLeft: 2, background: step > s.n ? "#2563EB" : "#E2E8F0" }} />}
          </div>
        ))}
      </div>

      {/* ════ STEP 1 — Google link ════ */}
      {step === 1 && (
        <div className="card p-6">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="link" size={18} color="#2563EB" />Lien d&apos;avis Google
          </h3>
          <input value={config.googleLink} onChange={e => update("googleLink", e.target.value)}
            placeholder="https://g.page/r/votre-lien-avis" style={inp}
            onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
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

      {/* ════ STEP 2 — Personnalisation ════ */}
      {step === 2 && (
        <div className="card p-6">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>Personnalisation</h3>

          {/* Sub-tabs */}
          <div style={{ display: "flex", gap: 3, marginBottom: 24, background: "#F8FAFC", borderRadius: 12, padding: 4, width: "fit-content" }}>
            {[
              { id: "templates", label: "🎨 Templates" },
              { id: "roue",      label: "🎡 Roue" },
              { id: "page",      label: "📄 Page publique" },
            ].map(t => (
              <button key={t.id} onClick={() => setSubTab(t.id)} style={{
                padding: "8px 16px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 700,
                background: subTab === t.id ? "#0F172A" : "transparent",
                color: subTab === t.id ? "#fff" : "#64748B",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
              }}>{t.label}</button>
            ))}
          </div>

          {/* ── TEMPLATES ── */}
          {subTab === "templates" && (
            <div>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20, lineHeight: 1.6 }}>
                Choisissez un template pour préremplir automatiquement tous les paramètres de la roue et de la page. Vous pourrez tout modifier ensuite.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {TEMPLATES.map(tpl => (
                  <button key={tpl.id} onClick={() => applyTemplate(tpl)} style={{
                    padding: "18px 16px", borderRadius: 16, border: "2px solid #E2E8F0",
                    background: "#fff", cursor: "pointer", textAlign: "left",
                    transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {/* Preview strip */}
                    <div style={{
                      height: 44, borderRadius: 10, marginBottom: 12,
                      background: tpl.pageBgType === "gradient" ? tpl.pageBgGradient : tpl.pageBg,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                    }}>
                      {tpl.palette.slice(0, 5).map((c, i) => (
                        <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, flexShrink: 0 }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 20, marginBottom: 5 }}>{tpl.emoji}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 3 }}>{tpl.name}</div>
                    <div style={{ fontSize: 12, color: "#8896A5", lineHeight: 1.4 }}>{tpl.desc}</div>
                    <div style={{
                      marginTop: 12, padding: "6px 12px", borderRadius: 8, textAlign: "center",
                      background: "#2563EB12", color: "#2563EB", fontSize: 12, fontWeight: 700,
                    }}>Appliquer ce template</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── ROUE ── */}
          {subTab === "roue" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Couleurs globales */}
              <div>
                <SectionLabel>Couleurs de base</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <ColorField label="Couleur principale" value={config.primaryColor} onChange={v => update("primaryColor", v)} />
                  </div>
                  <div style={{ flex: "1 1 200px" }}>
                    <ColorField label="Couleur secondaire" value={config.secondaryColor} onChange={v => update("secondaryColor", v)} />
                  </div>
                </div>
              </div>

              {/* Contour + Centre */}
              <div>
                <SectionLabel>Contour & Centre</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <ColorField label="Couleur contour / flèche" value={config.wheelBorderColor} onChange={v => update("wheelBorderColor", v)} />
                  </div>
                  <div style={{ flex: "1 1 200px" }}>
                    <ColorField label="Couleur centre (hub)" value={config.wheelCenterColor} onChange={v => update("wheelCenterColor", v)} />
                  </div>
                </div>
              </div>

              {/* Logo centre */}
              <div>
                <SectionLabel>Logo au centre de la roue</SectionLabel>
                <ImageUpload label="Logo centre (remplace le logo principal si renseigné)" value={config.wheelCenterLogo} onChange={url => update("wheelCenterLogo", url)} />
              </div>

              {/* Couleurs par segment */}
              {config.rewards.length > 0 ? (
                <div>
                  <SectionLabel>Couleur de chaque segment</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                    {config.rewards.map((r, i) => (
                      <div key={r.id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                        background: "#F8FAFC", borderRadius: 10, border: "1.5px solid #E2E8F0" }}>
                        <input type="color" value={getSegmentColor(i)}
                          onChange={e => updateSegmentColor(i, e.target.value)}
                          style={{ width: 32, height: 32, borderRadius: 7, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.name || `Segment ${i + 1}`}
                        </span>
                        {config.segmentColors?.[i] && (
                          <button onClick={() => updateSegmentColor(i, "")} style={{ background: "none", border: "none", cursor: "pointer", color: "#b2bec3", fontSize: 14 }} title="Réinitialiser">↺</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: 12, padding: "18px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
                  Ajoutez des récompenses à l&apos;étape 3 pour personnaliser chaque segment individuellement.
                </div>
              )}

              {/* Police */}
              <div>
                <SectionLabel>Police des segments</SectionLabel>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {FONTS.map(f => (
                    <button key={f.id} onClick={() => update("wheelFont", f.id)} style={{
                      padding: "10px 18px", borderRadius: 10, border: "none",
                      background: config.wheelFont === f.id ? "#2563EB" : "#F8FAFC",
                      color: config.wheelFont === f.id ? "#fff" : "#475569",
                      border: `2px solid ${config.wheelFont === f.id ? "#2563EB" : "#E2E8F0"}`,
                      fontFamily: `'${f.id}', sans-serif`,
                      fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.15s",
                    }}>
                      Aa — {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Taille */}
              <div>
                <SectionLabel>Taille de la roue</SectionLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <input type="range" min={280} max={520} step={10} value={config.wheelSize}
                    onChange={e => update("wheelSize", Number(e.target.value))}
                    style={{ flex: 1, accentColor: "#2563EB" }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", minWidth: 60 }}>
                    {config.wheelSize}px
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>280 px (compact) → 520 px (grand écran)</p>
              </div>

              {/* CTA text */}
              <div>
                <SectionLabel>Texte d'invitation</SectionLabel>
                <input value={config.ctaText} onChange={e => update("ctaText", e.target.value)}
                  placeholder="Laissez-nous un avis et tentez votre chance !" style={inp}
                  onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              </div>
            </div>
          )}

          {/* ── PAGE PUBLIQUE ── */}
          {subTab === "page" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Fond */}
              <div>
                <SectionLabel>Fond de la page</SectionLabel>
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  {[["color","Couleur unie"],["gradient","Dégradé"]].map(([val, label]) => (
                    <button key={val} onClick={() => update("pageBgType", val)} style={{
                      padding: "7px 16px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 700,
                      background: config.pageBgType === val ? "#2563EB" : "#F8FAFC",
                      color: config.pageBgType === val ? "#fff" : "#64748B",
                      border: `2px solid ${config.pageBgType === val ? "#2563EB" : "#E2E8F0"}`,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}>{label}</button>
                  ))}
                </div>
                {config.pageBgType === "color" ? (
                  <ColorField label="Couleur de fond" value={config.pageBg} onChange={v => update("pageBg", v)} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <ColorField label="Couleur début" value={config.pageBg} onChange={v => {
                          update("pageBg", v);
                          const end = config.pageBgGradient.match(/#[0-9a-fA-F]{6}/g)?.[1] || "#ffffff";
                          update("pageBgGradient", `linear-gradient(135deg, ${v} 0%, ${end} 100%)`);
                        }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <ColorField label="Couleur fin" value={config.pageBgGradient.match(/#[0-9a-fA-F]{6}/g)?.[1] || "#ffffff"}
                          onChange={v => update("pageBgGradient", `linear-gradient(135deg, ${config.pageBg} 0%, ${v} 100%)`)} />
                      </div>
                    </div>
                    <div style={{
                      height: 44, borderRadius: 10, border: "1.5px solid #E2E8F0",
                      background: config.pageBgGradient || `linear-gradient(135deg, ${config.pageBg}, #ffffff)`,
                    }} />
                  </div>
                )}
              </div>

              {/* Bannière */}
              <div>
                <SectionLabel>Image de bannière (haut de page)</SectionLabel>
                <ImageUpload label="Bannière" value={config.pageBanner} onChange={url => update("pageBanner", url)} />
              </div>

              {/* Logo */}
              <div>
                <SectionLabel>Logo du commerçant</SectionLabel>
                <ImageUpload label="Logo affiché dans le header" value={config.logoUrl} onChange={url => update("logoUrl", url)} />
              </div>

              {/* Textes */}
              <div>
                <SectionLabel>Textes</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>
                      Titre principal (ex: &quot;Tournez et gagnez chez Rmess !&quot;)
                    </label>
                    <input value={config.pageTitle} onChange={e => update("pageTitle", e.target.value)}
                      placeholder="Tournez et gagnez !" style={inp}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>
                      Message de bienvenue / description
                    </label>
                    <textarea value={config.pageWelcome} onChange={e => update("pageWelcome", e.target.value)}
                      placeholder="Laissez-nous un avis Google, puis revenez ici pour tourner la roue et gagner un cadeau !"
                      rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>
                      Message après le spin (remerciement)
                    </label>
                    <input value={config.pageThanks} onChange={e => update("pageThanks", e.target.value)}
                      placeholder="Merci ! Votre cadeau vous attend en caisse." style={inp}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                  </div>
                </div>
              </div>

              {/* Bouton */}
              <div>
                <SectionLabel>Bouton principal</SectionLabel>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <ColorField label="Couleur du bouton" value={config.pageBtnColor || config.primaryColor} onChange={v => update("pageBtnColor", v)} />
                  </div>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>Texte du bouton</label>
                    <input value={config.pageBtnText} onChange={e => update("pageBtnText", e.target.value)}
                      placeholder="⭐ Laisser mon avis Google" style={inp}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                  </div>
                </div>
                {/* Preview button */}
                <div style={{ marginTop: 10 }}>
                  <span style={{
                    display: "inline-block", padding: "12px 28px", borderRadius: 14,
                    background: config.pageBtnColor || config.primaryColor,
                    color: "#fff", fontWeight: 800, fontSize: 15,
                    fontFamily: `'${config.wheelFont}', sans-serif`,
                  }}>
                    {config.pageBtnText || "⭐ Laisser mon avis Google"}
                  </span>
                </div>
              </div>

              {/* Couleur du texte */}
              <div>
                <SectionLabel>Couleur du texte global</SectionLabel>
                <div style={{ maxWidth: 260 }}>
                  <ColorField label="" value={config.pageTextColor} onChange={v => update("pageTextColor", v)} />
                </div>
              </div>

              {/* Preview miniature */}
              <div style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#8896A5", marginBottom: 10 }}>APERÇU DE LA PAGE</div>
                <div style={{
                  borderRadius: 12, overflow: "hidden", border: "1.5px solid #E2E8F0",
                  background: config.pageBgType === "gradient" && config.pageBgGradient ? config.pageBgGradient : config.pageBg,
                  padding: "20px 16px", textAlign: "center",
                }}>
                  {config.pageBanner && (
                    <img src={config.pageBanner} alt="bannière" style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, marginBottom: 12 }} />
                  )}
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: config.pageTextColor, margin: "0 0 6px",
                    fontFamily: `'${config.wheelFont}', sans-serif` }}>
                    {config.pageTitle || "Tournez et gagnez !"}
                  </h3>
                  <p style={{ fontSize: 12, color: config.pageTextColor, opacity: 0.7, margin: "0 0 14px" }}>
                    {config.pageWelcome || "Laissez un avis et tentez votre chance…"}
                  </p>
                  <div style={{
                    display: "inline-block", padding: "8px 20px", borderRadius: 10,
                    background: config.pageBtnColor || config.primaryColor, color: "#fff",
                    fontWeight: 700, fontSize: 13,
                    fontFamily: `'${config.wheelFont}', sans-serif`,
                  }}>
                    {config.pageBtnText || "⭐ Laisser mon avis"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
            <button onClick={() => setStep(1)} className="btn-secondary">Retour</button>
            <button onClick={() => setStep(3)} className="btn-primary">
              Suivant <Icon name="chevronRight" size={16} color="#fff" />
            </button>
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
            <div style={{ padding: "24px", borderRadius: 12, background: "#F8FAFC",
              border: "1.5px dashed #E2E8F0", textAlign: "center", marginBottom: 14, color: "#94A3B8", fontSize: 13 }}>
              Aucune récompense. Cliquez sur &quot;Ajouter une récompense&quot;.
            </div>
          )}

          {config.rewards.map((r, i) => (
            <div key={r.id || i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
              {/* Segment color dot */}
              <input type="color" value={getSegmentColor(i)} onChange={e => updateSegmentColor(i, e.target.value)}
                style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2, flexShrink: 0 }}
                title="Couleur du segment" />
              <input value={r.name} onChange={e => updateReward(i, "name", e.target.value)}
                placeholder="Nom de la récompense"
                style={{ ...inp, flex: "2 1 160px" }}
                onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input type="number" value={r.prob} onChange={e => updateReward(i, "prob", e.target.value)}
                  min={0} max={100}
                  style={{ ...inp, width: 72, textAlign: "center", padding: "10px 8px" }}
                  onFocus={e => e.target.style.borderColor = "#3B82F6"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
                <span style={{ color: "#64748B", fontWeight: 700, fontSize: 13 }}>%</span>
              </div>
              <button onClick={() => removeReward(i)} style={{
                width: 34, height: 34, borderRadius: 8, border: "none", background: "#FEF2F2",
                color: "#EF4444", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>×</button>
            </div>
          ))}

          <button onClick={addReward} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, marginTop: 4,
            border: "1.5px dashed #CBD5E1", background: "transparent",
            color: "#3B82F6", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            <Icon name="plus" size={15} color="#3B82F6" />Ajouter une récompense
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

      {/* ── QR code section ── */}
      {selectedEntreprise && (
        <div className="card p-6 mt-5">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Icon name="qr" size={20} color="#2563EB" />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Lien public &amp; QR Code</h3>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Partagez ce lien ou imprimez le QR code pour vos clients.</p>
            </div>
          </div>
          <div style={{ border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "16px 18px", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flexShrink: 0 }}><QRCanvas slug={selectedEntreprise.slug} /></div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 14, margin: "0 0 6px" }}>{selectedEntreprise.nom}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F8FAFC", borderRadius: 8, padding: "8px 12px", border: "1.5px solid #E2E8F0", marginBottom: 12 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#475569", flex: 1, wordBreak: "break-all" }}>
                  {getPublicUrl(selectedEntreprise.slug)}
                </span>
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

      {/* ── Preview ── */}
      {previewOpen && config.rewards.length > 0 && config.rewards.some(r => r.name) && (
        <div className="card p-7 mt-5 text-center animate-slide-up">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Aperçu de la roue</h3>
          <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>{config.ctaText}</p>
          <SpinWheel
            rewards={config.rewards.filter(r => r.name).map(r => ({ ...r, probability: r.prob }))}
            primaryColor={config.primaryColor}
            secondaryColor={config.secondaryColor}
            segmentColors={config.segmentColors}
            borderColor={config.wheelBorderColor}
            centerColor={config.wheelCenterColor}
            centerLogoUrl={config.wheelCenterLogo || config.logoUrl}
            fontFamily={config.wheelFont}
            size={Math.min(config.wheelSize, 420)}
            onResult={() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000); }}
          />
        </div>
      )}
    </div>
  );
}
