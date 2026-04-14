"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ─── Wheel Canvas ───────────────────────────────────────────────────────
function SpinWheel({ rewards, primaryColor, secondaryColor, onResult }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);
  const angleRef = useRef(0);

  const COLORS = [primaryColor, secondaryColor, "#FDCB6E", "#E17055", "#0984E3", "#FD79A8", "#74B9FF", "#55EFC4"];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, cx = W / 2, R = cx - 14;
    ctx.clearRect(0, 0, W, W);

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.18)"; ctx.shadowBlur = 28; ctx.shadowOffsetY = 8;
    ctx.beginPath(); ctx.arc(cx, cx, R + 4, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.restore();

    const n = rewards.length;
    const arc = (Math.PI * 2) / n;
    rewards.forEach((rw, i) => {
      const a0 = angleRef.current + i * arc;
      ctx.beginPath(); ctx.moveTo(cx, cx); ctx.arc(cx, cx, R, a0, a0 + arc); ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.save(); ctx.translate(cx, cx); ctx.rotate(a0 + arc / 2);
      ctx.textAlign = "right"; ctx.fillStyle = "#fff";
      ctx.font = `bold 13px 'Inter', sans-serif`;
      const label = rw.name.length > 14 ? rw.name.slice(0, 14) + "…" : rw.name;
      ctx.fillText(label, R - 16, 5);
      ctx.restore();
    });

    ctx.beginPath(); ctx.arc(cx, cx, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.strokeStyle = primaryColor; ctx.lineWidth = 3; ctx.stroke();

    ctx.save(); ctx.translate(cx + R + 2, cx);
    ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-6, -12); ctx.lineTo(-6, 12); ctx.closePath();
    ctx.fillStyle = "#E17055"; ctx.fill(); ctx.restore();
  }, [rewards, primaryColor, secondaryColor]);

  useEffect(() => { draw(); }, [draw]);

  const spin = () => {
    if (spinning || done || rewards.length === 0) return;
    setSpinning(true);

    const rand = Math.random() * 100;
    let acc = 0, winIdx = 0;
    for (let i = 0; i < rewards.length; i++) {
      acc += rewards[i].probability;
      if (rand <= acc) { winIdx = i; break; }
    }

    const arc = (Math.PI * 2) / rewards.length;
    const target = -(winIdx * arc + arc / 2);
    const spins = 6 + Math.random() * 4;
    const total = Math.PI * 2 * spins + (target - (angleRef.current % (Math.PI * 2)));
    const dur = 5000, start = Date.now(), startA = angleRef.current;
    const ease = (t) => 1 - Math.pow(1 - t, 4);

    const anim = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      angleRef.current = startA + total * ease(t);
      draw();
      if (t < 1) requestAnimationFrame(anim);
      else {
        setSpinning(false);
        setDone(true);
        onResult?.(rewards[winIdx], winIdx);
      }
    };
    requestAnimationFrame(anim);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <canvas
        ref={canvasRef} width={320} height={320}
        style={{ maxWidth: "100%", cursor: done ? "default" : spinning ? "wait" : "pointer" }}
        onClick={spin}
      />
      {!done && (
        <button
          onClick={spin} disabled={spinning}
          style={{
            padding: "16px 40px", borderRadius: 14, border: "none",
            cursor: spinning ? "not-allowed" : "pointer",
            background: spinning ? "#b2bec3" : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            color: "#fff", fontWeight: 800, fontSize: 17,
            fontFamily: "'Inter', sans-serif",
            boxShadow: spinning ? "none" : `0 6px 28px ${primaryColor}55`,
            transition: "all 0.2s",
          }}
        >
          {spinning ? "La roue tourne…" : "🎡 Tourner la roue !"}
        </button>
      )}
    </div>
  );
}

// ─── Confetti ──────────────────────────────────────────────────────────
function Confetti({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    c.width = window.innerWidth; c.height = window.innerHeight;
    const cols = ["#6C5CE7","#00B894","#FDCB6E","#E17055","#0984E3","#FD79A8"];
    const ps = Array.from({ length: 140 }, () => ({
      x: Math.random() * c.width, y: -20,
      w: Math.random() * 10 + 5, h: Math.random() * 6 + 3,
      color: cols[Math.floor(Math.random() * cols.length)],
      vx: (Math.random() - 0.5) * 4, vy: Math.random() * 4 + 2,
      rot: Math.random() * 360, vr: (Math.random() - 0.5) * 8,
    }));
    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      ps.forEach(p => {
        if (p.y < c.height + 20) alive = true;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.06;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      if (alive) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }} />;
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function RoueClient({ entreprise }) {
  const [step, setStep] = useState(1);
  const [pendingReward, setPendingReward] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [winCode, setWinCode] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [copied, setCopied] = useState(false);

  const pc = entreprise.couleur_principale;
  const sc = entreprise.couleur_secondaire;

  const STEPS = [
    { n: 1, label: "Avis Google" },
    { n: 2, label: "Confirmation" },
    { n: 3, label: "Roue" },
    { n: 4, label: "Vos infos" },
    { n: 5, label: "Cadeau" },
  ];

  const handleReviewClick = () => {
    if (entreprise.lien_avis) {
      window.open(entreprise.lien_avis, "_blank", "noopener,noreferrer");
    }
    setStep(2);
  };

  const handleSpinResult = (reward, rewardIndex) => {
    setPendingReward({ name: reward.name, index: rewardIndex });
    // Court délai pour laisser l'animation se terminer visuellement
    setTimeout(() => setStep(4), 800);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Le prénom et l'email sont requis.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError("Adresse email invalide.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/play/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: entreprise.slug,
          rewardName: pendingReward.name,
          rewardIndex: pendingReward.index,
          clientName:  form.name.trim(),
          clientEmail: form.email.trim(),
          clientPhone: form.phone.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setWinCode(data.winCode);
        setStep(5);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 5500);
      } else {
        setFormError(data.error || "Erreur serveur, réessayez.");
      }
    } catch {
      setFormError("Erreur réseau, réessayez.");
    }
    setSubmitting(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(winCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inp = {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: "2px solid #E2E8F0", fontSize: 15, outline: "none",
    background: "#fff", boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif", color: "#0F0F1A",
    transition: "border-color 0.2s", marginBottom: 12,
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: `linear-gradient(160deg, ${pc}10 0%, ${sc}08 50%, #F8FAFC 100%)`,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <Confetti active={confetti} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.04);} }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <header style={{
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        {entreprise.logo ? (
          <img src={entreprise.logo} alt={entreprise.nom}
            style={{ height: 36, borderRadius: 8, objectFit: "contain" }} />
        ) : (
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: `linear-gradient(135deg, ${pc}, ${sc})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>
              {entreprise.nom.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span style={{ fontWeight: 800, fontSize: 18, color: "#0F0F1A" }}>{entreprise.nom}</span>
      </header>

      <main style={{ maxWidth: 460, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
          {STEPS.map(({ n, label }, idx) => {
            const done = n < step;
            const active = n === step;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: done ? "#00B894" : active ? pc : "#E2E8F0",
                    color: done || active ? "#fff" : "#b2bec3",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, transition: "all 0.3s",
                    flexShrink: 0,
                  }}>
                    {done ? "✓" : n}
                  </div>
                  <span style={{ fontSize: 10, color: active ? pc : "#b2bec3", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{
                    width: 20, height: 2, borderRadius: 9999, margin: "0 4px", marginBottom: 18,
                    background: n < step ? "#00B894" : "#E2E8F0", transition: "background 0.3s", flexShrink: 0,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── STEP 1 : Bouton avis ── */}
        {step === 1 && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
            <div style={{ fontSize: 56, marginBottom: 14, lineHeight: 1 }}>⭐</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F0F1A", margin: "0 0 12px", lineHeight: 1.3 }}>
              {entreprise.cta_text}
            </h1>
            <p style={{ color: "#636e72", fontSize: 14, lineHeight: 1.7, margin: "0 auto 28px", maxWidth: 340 }}>
              Laissez-nous un avis Google, puis revenez ici pour tourner la roue et gagner un cadeau !
            </p>
            <a
              onClick={handleReviewClick}
              href={entreprise.lien_avis || "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "17px 36px", borderRadius: 16, textDecoration: "none",
                background: `linear-gradient(135deg, ${pc}, ${sc})`,
                color: "#fff", fontWeight: 800, fontSize: 16,
                boxShadow: `0 8px 32px ${pc}44`,
                animation: "pulse 2s infinite", cursor: "pointer",
              }}
            >
              ⭐ Laisser mon avis Google
            </a>
            <p style={{ color: "#b2bec3", fontSize: 12, marginTop: 16 }}>
              Vous serez redirigé vers Google Maps
            </p>
          </div>
        )}

        {/* ── STEP 2 : Confirmation avis posté ── */}
        {step === 2 && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
            <div style={{ fontSize: 56, marginBottom: 14, lineHeight: 1 }}>✅</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0F0F1A", margin: "0 0 12px" }}>
              Merci pour votre avis !
            </h2>
            <p style={{ color: "#636e72", fontSize: 15, lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 340 }}>
              Votre avis a bien été posté ? Parfait ! Cliquez ci-dessous pour débloquer la roue et découvrir votre cadeau.
            </p>
            <button
              onClick={() => setStep(3)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "17px 36px", borderRadius: 16, border: "none",
                background: `linear-gradient(135deg, ${pc}, ${sc})`,
                color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer",
                boxShadow: `0 8px 32px ${pc}44`,
              }}
            >
              🎡 J&apos;ai posté mon avis — je tourne la roue !
            </button>
            <p style={{ color: "#b2bec3", fontSize: 12, marginTop: 20 }}>
              Vous n&apos;avez pas encore posté ?{" "}
              <a
                onClick={handleReviewClick}
                href={entreprise.lien_avis || "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: pc, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Cliquez ici
              </a>
            </p>
          </div>
        )}

        {/* ── STEP 3 : Roue ── */}
        {step === 3 && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#00B89415", border: "1.5px solid #00B89430",
                borderRadius: 12, padding: "10px 20px", marginBottom: 16,
              }}>
                <span style={{ color: "#00B894", fontWeight: 800, fontSize: 14 }}>✓ Avis confirmé</span>
              </div>
              <p style={{ color: "#636e72", fontSize: 14, margin: 0 }}>
                Cliquez sur la roue ou le bouton pour la faire tourner !
              </p>
            </div>
            <SpinWheel
              rewards={entreprise.rewards}
              primaryColor={pc}
              secondaryColor={sc}
              onResult={handleSpinResult}
            />
          </div>
        )}

        {/* ── STEP 4 : Formulaire contact ── */}
        {step === 4 && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            {/* Bandeau cadeau gagné */}
            <div style={{
              background: `linear-gradient(135deg, ${pc}18, ${sc}12)`,
              border: `2px solid ${pc}35`,
              borderRadius: 20, padding: "20px 24px", marginBottom: 28, textAlign: "center",
            }}>
              <p style={{ fontSize: 13, color: "#718096", margin: "0 0 6px", fontWeight: 600 }}>
                Vous avez gagné
              </p>
              <div style={{ fontSize: 26, fontWeight: 900, color: pc }}>
                {pendingReward?.name}
              </div>
            </div>

            <div style={{
              background: "#fff", borderRadius: 20, padding: "24px",
              border: "1.5px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F0F1A", margin: "0 0 6px" }}>
                Renseignez vos coordonnées
              </h3>
              <p style={{ fontSize: 13, color: "#718096", margin: "0 0 22px" }}>
                Pour recevoir votre code cadeau par email et SMS.
              </p>

              <form onSubmit={handleSubmitForm}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 6 }}>
                  Prénom *
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Votre prénom"
                  required
                  style={inp}
                  onFocus={e => e.target.style.borderColor = pc}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                />

                <label style={{ fontSize: 12, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 6 }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="votre@email.com"
                  required
                  style={inp}
                  onFocus={e => e.target.style.borderColor = pc}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                />

                <label style={{ fontSize: 12, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 6 }}>
                  Téléphone <span style={{ color: "#94A3B8", fontWeight: 500 }}>(optionnel)</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+33 6 00 00 00 00"
                  style={{ ...inp, marginBottom: 20 }}
                  onFocus={e => e.target.style.borderColor = pc}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                />

                {formError && (
                  <div style={{
                    background: "#FEF2F2", border: "1.5px solid #FECACA",
                    borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                    fontSize: 13, color: "#DC2626", fontWeight: 600,
                  }}>
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%", padding: "16px", borderRadius: 14, border: "none",
                    background: submitting ? "#b2bec3" : `linear-gradient(135deg, ${pc}, ${sc})`,
                    color: "#fff", fontWeight: 800, fontSize: 16, cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: submitting ? "none" : `0 6px 24px ${pc}44`,
                    transition: "all 0.2s",
                  }}
                >
                  {submitting ? "Génération du code…" : "🎁 Réclamer mon cadeau"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── STEP 5 : Code unique ── */}
        {step === 5 && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
            <div style={{ fontSize: 72, marginBottom: 8, lineHeight: 1 }}>🎉</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0F0F1A", margin: "0 0 6px" }}>
              Félicitations !
            </h2>
            <p style={{ color: "#636e72", fontSize: 15, margin: "0 0 24px" }}>
              Votre cadeau : <strong style={{ color: pc }}>{pendingReward?.name}</strong>
            </p>

            {/* Code */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#718096", marginBottom: 10, fontWeight: 600 }}>
                Votre code unique — montrez-le au personnel
              </p>
              <div
                onClick={copyCode}
                style={{
                  background: "#0F0F1A", borderRadius: 16, padding: "22px 24px",
                  cursor: "pointer", position: "relative",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                }}
              >
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: 4,
                }}>
                  {winCode}
                </span>
                <span style={{
                  position: "absolute", top: 8, right: 12,
                  fontSize: 11, color: copied ? "#00B894" : "#718096", fontWeight: 600,
                }}>
                  {copied ? "✓ Copié !" : "Appuyer pour copier"}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#b2bec3", marginTop: 10 }}>
                Ce code vous a également été envoyé par email
              </p>
            </div>

            {/* Instructions */}
            <div style={{
              background: "#F8FAFC", borderRadius: 16, padding: "20px 24px",
              border: "1.5px solid #E2E8F0", textAlign: "left",
            }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#0F0F1A", margin: "0 0 14px" }}>
                Comment récupérer votre cadeau ?
              </p>
              {[
                "Prenez une capture d'écran ou notez votre code",
                `Présentez-vous chez ${entreprise.nom}`,
                "Montrez ce code au personnel",
                "Récupérez votre récompense !",
              ].map((txt, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: pc, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, flexShrink: 0, marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 14, color: "#4a5568" }}>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer style={{
        textAlign: "center", padding: "16px", fontSize: 12, color: "#b2bec3",
        borderTop: "1px solid #f0f0f5",
      }}>
        Propulsé par{" "}
        <a href="/" style={{ color: pc, fontWeight: 700, textDecoration: "none" }}>zReview</a>
      </footer>
    </div>
  );
}
