"use client";

import { useState } from "react";
import SpinWheel from "@/components/SpinWheel";
import Confetti  from "@/components/Confetti";

// Determine contrast-safe text color for a hex button
function btnTextColor(hex) {
  if (!hex) return "#fff";
  const h = hex.replace("#", "");
  if (h.length < 6) return "#fff";
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  return (0.299*r + 0.587*g + 0.114*b) / 255 > 0.55 ? "#000" : "#fff";
}

export default function PlayClient({ entreprise }) {
  const [step,          setStep]          = useState(1);
  const [reviewClicked, setReviewClicked] = useState(false);
  const [result,        setResult]        = useState(null);
  const [winCode,       setWinCode]       = useState(null);
  const [generating,    setGenerating]    = useState(false);
  const [confetti,      setConfetti]      = useState(false);
  const [copied,        setCopied]        = useState(false);

  // ── Resolved style values ──────────────────────────────────────────
  const pc  = entreprise.couleur_principale  || "#3B82F6";
  const sc  = entreprise.couleur_secondaire  || "#0EA5E9";
  const tc  = entreprise.page_text_color     || "#0F0F1A";
  const ff  = entreprise.wheel_font          || "DM Sans";

  const pageBg = (entreprise.page_bg_type === "gradient" && entreprise.page_bg_gradient)
    ? entreprise.page_bg_gradient
    : (entreprise.page_bg && entreprise.page_bg !== "#ffffff")
    ? entreprise.page_bg
    : `linear-gradient(160deg, ${pc}12 0%, ${sc}08 50%, #F8FAFC 100%)`;

  const btnBgRaw   = entreprise.page_btn_color || pc;
  const btnTc      = btnTextColor(btnBgRaw);
  const btnText    = entreprise.page_btn_text  || "⭐ Laisser mon avis Google";
  const pageTitle  = entreprise.page_title     || entreprise.cta_text || "Tournez et gagnez !";
  const welcomeMsg = entreprise.page_welcome   || "Laissez-nous un avis Google, puis revenez ici pour tourner la roue et gagner un cadeau !";
  const thanksMsg  = entreprise.page_thanks    || "";

  const isTextLight = (() => {
    const hex = tc.replace("#","");
    if (hex.length < 6) return false;
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    return (0.299*r + 0.587*g + 0.114*b) / 255 > 0.55;
  })();

  // ── Handlers ──────────────────────────────────────────────────────
  const handleReviewClick = () => {
    setReviewClicked(true);
    if (entreprise.lien_avis) window.open(entreprise.lien_avis, "_blank", "noopener,noreferrer");
  };

  const handleSpinResult = async (reward, rewardIndex) => {
    setResult({ rewardName: reward.name, rewardIndex });
    setGenerating(true);
    try {
      const res  = await fetch("/api/play/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: entreprise.slug, rewardName: reward.name, rewardIndex }),
      });
      const data = await res.json();
      if (res.ok) { setWinCode(data.winCode); setStep(3); setConfetti(true); setTimeout(() => setConfetti(false), 5500); }
      else        { setWinCode("ERREUR"); setStep(3); }
    } catch {
      setWinCode("ERREUR"); setStep(3);
    }
    setGenerating(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(winCode);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const subtleColor   = `${tc}99`;
  const cardBg        = isTextLight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
  const cardBorder    = isTextLight ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.09)";

  return (
    <div style={{ minHeight: "100dvh", background: pageBg, fontFamily: `'${ff}', 'DM Sans', system-ui, sans-serif` }}>
      <Confetti active={confetti} />

      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{transform:scale(1)}50%{transform:scale(1.04)} }
        @keyframes spin360 { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        borderBottom: `1px solid ${cardBorder}`,
        background: isTextLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.82)",
        backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10,
      }}>
        {entreprise.logo ? (
          <img src={entreprise.logo} alt={entreprise.nom} style={{ height: 36, borderRadius: 8, objectFit: "contain" }} />
        ) : (
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: `linear-gradient(135deg, ${pc}, ${sc})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>{entreprise.nom.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <span style={{ fontWeight: 800, fontSize: 18, color: tc }}>{entreprise.nom}</span>
      </header>

      {/* ── BANNER IMAGE ── */}
      {entreprise.page_banner && (
        <div style={{ width: "100%", maxHeight: 200, overflow: "hidden" }}>
          <img src={entreprise.page_banner} alt="bannière" style={{ width: "100%", height: 200, objectFit: "cover" }} />
        </div>
      )}

      <main style={{ maxWidth: 480, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* ── STEPS 1 & 2 ── */}
        {step !== 3 && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            {/* Step indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
              {[{ n:1, label:"Avis Google" }, { n:2, label:"Roue" }, { n:3, label:"Cadeau" }].map(({ n, label }) => {
                const active = step === n || (n === 2 && reviewClicked);
                const done   = (n === 1 && reviewClicked) || n < step;
                return (
                  <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: done ? "#00B894" : active ? pc : cardBg,
                      color: done || active ? "#fff" : subtleColor,
                      border: `2px solid ${done ? "#00B894" : active ? pc : cardBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 800, transition: "all 0.3s",
                    }}>
                      {done ? "✓" : n}
                    </div>
                    <span style={{ fontSize: 11, color: active ? pc : subtleColor, fontWeight: 600 }}>{label}</span>
                  </div>
                );
              })}
            </div>

            {/* Content */}
            {!reviewClicked ? (
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 52, marginBottom: 12, lineHeight: 1 }}>⭐</div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: tc, margin: "0 0 10px", lineHeight: 1.3, fontFamily: `'${ff}', sans-serif` }}>
                  {pageTitle}
                </h1>
                <p style={{ color: subtleColor, fontSize: 14, lineHeight: 1.7, margin: "0 auto 24px", maxWidth: 340 }}>
                  {welcomeMsg}
                </p>
                <a
                  onClick={handleReviewClick}
                  href={entreprise.lien_avis || "#"}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    padding: "17px 36px", borderRadius: 16, textDecoration: "none",
                    background: btnBgRaw,
                    color: btnTc, fontWeight: 800, fontSize: 16,
                    fontFamily: `'${ff}', sans-serif`,
                    boxShadow: `0 8px 32px ${btnBgRaw}55`,
                    animation: "pulse 2s infinite", cursor: "pointer",
                  }}
                >
                  {btnText}
                </a>
                <p style={{ color: subtleColor, fontSize: 12, marginTop: 16 }}>
                  Vous serez redirigé vers Google Maps
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#00B89418", border: "1.5px solid #00B89430",
                  borderRadius: 12, padding: "10px 20px", marginBottom: 16,
                }}>
                  <span style={{ color: "#00B894", fontWeight: 800, fontSize: 14 }}>✓ Merci pour votre avis !</span>
                </div>
                <p style={{ color: subtleColor, fontSize: 14, margin: "0 0 20px" }}>
                  Tournez maintenant la roue pour découvrir votre cadeau.
                </p>
              </div>
            )}

            {/* Wheel */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SpinWheel
                rewards={entreprise.rewards || []}
                primaryColor={pc}
                secondaryColor={sc}
                segmentColors={entreprise.wheel_segment_colors}
                borderColor={entreprise.wheel_border_color}
                centerColor={entreprise.wheel_center_color}
                centerLogoUrl={entreprise.wheel_center_logo || entreprise.logo}
                fontFamily={ff}
                size={Math.min(entreprise.wheel_size || 360, typeof window !== "undefined" ? Math.min(window.innerWidth - 40, 460) : 360)}
                disabled={!reviewClicked}
                onResult={handleSpinResult}
              />
            </div>
          </div>
        )}

        {/* ── STEP 3 : Result ── */}
        {step === 3 && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
            <div style={{ fontSize: 72, marginBottom: 8, lineHeight: 1 }}>🎉</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: tc, margin: "0 0 8px", fontFamily: `'${ff}', sans-serif` }}>
              Félicitations !
            </h2>
            <p style={{ color: subtleColor, fontSize: 16, margin: "0 0 28px" }}>Vous avez gagné :</p>

            {/* Prize */}
            <div style={{
              background: `linear-gradient(135deg, ${pc}18, ${sc}12)`,
              border: `2px solid ${pc}30`,
              borderRadius: 20, padding: "20px 28px", marginBottom: 28,
            }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: pc, fontFamily: `'${ff}', sans-serif` }}>
                {result?.rewardName}
              </div>
            </div>

            {/* Win code */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 13, color: subtleColor, marginBottom: 12, fontWeight: 600 }}>
                Votre code unique — montrez-le au personnel
              </p>
              <div onClick={copyCode} style={{
                background: isTextLight ? "rgba(255,255,255,0.12)" : "#0F0F1A",
                border: `1.5px solid ${cardBorder}`,
                borderRadius: 16, padding: "20px 24px", cursor: "pointer", position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: 4 }}>
                  {generating ? "…" : winCode}
                </span>
                <span style={{ position: "absolute", top: 8, right: 12, fontSize: 11, color: "#718096", fontWeight: 600 }}>
                  {copied ? "✓ Copié !" : "Appuyer pour copier"}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div style={{ background: cardBg, border: `1.5px solid ${cardBorder}`, borderRadius: 16, padding: "20px 24px", textAlign: "left" }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: tc, margin: "0 0 12px", fontFamily: `'${ff}', sans-serif` }}>
                {thanksMsg || "Comment récupérer votre cadeau ?"}
              </p>
              {[
                "Prenez une capture d'écran ou notez votre code",
                `Présentez-vous à ${entreprise.nom}`,
                "Montrez ce code au personnel",
                "Récupérez votre récompense !",
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", background: pc, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, flexShrink: 0, marginTop: 1,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 14, color: subtleColor }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: "16px", fontSize: 12, color: subtleColor, borderTop: `1px solid ${cardBorder}` }}>
        Propulsé par{" "}
        <a href="/" style={{ color: pc, fontWeight: 700, textDecoration: "none" }}>VisiumBoost</a>
      </footer>
    </div>
  );
}
