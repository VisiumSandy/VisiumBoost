"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Spin Wheel Canvas ──────────────────────────────────────────────────
function SpinWheel({ rewards, primaryColor, secondaryColor, onResult }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const angleRef = useRef(0);

  const COLORS = [primaryColor, secondaryColor, "#FDCB6E", "#E17055", "#0984E3", "#E84393", "#74B9FF", "#55EFC4"];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, cx = W / 2, R = cx - 14;
    ctx.clearRect(0, 0, W, W);

    // Shadow ring
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.beginPath(); ctx.arc(cx, cx, R + 4, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.restore();

    const n = rewards.length || 1;
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

    // Center hub
    ctx.beginPath(); ctx.arc(cx, cx, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.strokeStyle = primaryColor; ctx.lineWidth = 3; ctx.stroke();

    // Arrow pointer
    ctx.save(); ctx.translate(cx + R + 2, cx);
    ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-6, -12); ctx.lineTo(-6, 12); ctx.closePath();
    ctx.fillStyle = "#E17055"; ctx.fill(); ctx.restore();
  }, [rewards, primaryColor, secondaryColor]);

  useEffect(() => { draw(); }, [draw]);

  const spin = () => {
    if (spinning || result || rewards.length === 0) return;
    setSpinning(true);

    // Weighted random pick
    const rand = Math.random() * 100;
    let acc = 0, winIdx = 0;
    for (let i = 0; i < rewards.length; i++) {
      acc += rewards[i].probability;
      if (rand <= acc) { winIdx = i; break; }
    }

    const n = rewards.length;
    const arc = (Math.PI * 2) / n;
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
        setResult(rewards[winIdx]);
        onResult?.(rewards[winIdx]);
      }
    };
    requestAnimationFrame(anim);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <canvas
        ref={canvasRef}
        width={340}
        height={340}
        style={{ maxWidth: "100%", cursor: spinning || result ? "default" : "pointer" }}
        onClick={spin}
      />
      {!result ? (
        <button
          onClick={spin}
          disabled={spinning}
          style={{
            padding: "16px 40px", borderRadius: 14, border: "none",
            cursor: spinning ? "wait" : "pointer",
            background: spinning ? "#b2bec3" : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            color: "#fff", fontWeight: 800, fontSize: 17,
            fontFamily: "'Inter', sans-serif",
            boxShadow: spinning ? "none" : `0 6px 28px ${primaryColor}55`,
            transition: "all 0.2s",
            transform: spinning ? "scale(0.97)" : "scale(1)",
          }}
        >
          {spinning ? "La roue tourne…" : "Tourner la roue !"}
        </button>
      ) : (
        <div style={{
          textAlign: "center", padding: "24px 28px", borderRadius: 20,
          background: `${primaryColor}12`, border: `1px solid ${primaryColor}25`,
          animation: "fadeInUp 0.4s ease",
        }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: primaryColor }}>Félicitations !</div>
          <div style={{ fontSize: 16, color: "#2d3436", marginTop: 6, fontWeight: 600 }}>
            Vous avez gagné&nbsp;: <span style={{ color: primaryColor }}>{result.name}</span>
          </div>
          <div style={{ fontSize: 13, color: "#8b8da0", marginTop: 10, lineHeight: 1.6 }}>
            Montrez cet écran au personnel pour récupérer votre récompense.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Confetti ──────────────────────────────────────────────────────────
function Confetti({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const cols = ["#6C5CE7", "#00B894", "#FDCB6E", "#E17055", "#0984E3", "#FD79A8"];
    const ps = Array.from({ length: 130 }, () => ({
      x: Math.random() * c.width, y: -20,
      w: Math.random() * 10 + 5, h: Math.random() * 7 + 3,
      color: cols[Math.floor(Math.random() * cols.length)],
      vx: (Math.random() - 0.5) * 4, vy: Math.random() * 4 + 2,
      rot: Math.random() * 360, vr: (Math.random() - 0.5) * 8,
    }));
    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      ps.forEach((p) => {
        if (p.y < c.height + 20) alive = true;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.06;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
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

// ─── Main Play Client Component ────────────────────────────────────────
export default function PlayClient({ entreprise }) {
  const [step, setStep] = useState(1); // 1=CTA, 2=Code, 3=Wheel
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const pc = entreprise.couleur_principale;
  const sc = entreprise.couleur_secondaire;

  const validateCode = async () => {
    if (!code.trim()) { setCodeError("Veuillez entrer votre code"); return; }
    setLoading(true); setCodeError("");
    try {
      const res = await fetch("/api/codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (data.valid) setStep(3);
      else setCodeError(data.error || "Code invalide");
    } catch {
      setCodeError("Erreur de connexion. Réessayez.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: `linear-gradient(160deg, ${pc}10 0%, ${sc}08 50%, #F8FAFC 100%)`,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <Confetti active={confetti} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <header style={{
        padding: "18px 24px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        {entreprise.logo ? (
          <img src={entreprise.logo} alt={entreprise.nom} style={{ height: 36, borderRadius: 8, objectFit: "contain" }} />
        ) : (
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: `linear-gradient(135deg, ${pc}, ${sc})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>
              {entreprise.nom.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span style={{ fontWeight: 800, fontSize: 18, color: "#0F0F1A" }}>{entreprise.nom}</span>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 460, margin: "0 auto", padding: "32px 20px 64px", animation: "fadeInUp 0.5s ease" }}>

        {/* STEP 1 — Leave a review */}
        {step === 1 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 20, lineHeight: 1 }}>⭐</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F0F1A", margin: "0 0 12px", lineHeight: 1.3 }}>
              {entreprise.cta_text}
            </h1>
            <p style={{ color: "#636e72", fontSize: 15, marginBottom: 36, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 36px" }}>
              Partagez votre expérience et recevez un code exclusif pour tenter votre chance à la <strong>roue de la fortune</strong> !
            </p>

            <a
              href={entreprise.lien_avis || "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "18px 36px", borderRadius: 16, textDecoration: "none",
                background: `linear-gradient(135deg, ${pc}, ${sc})`,
                color: "#fff", fontWeight: 800, fontSize: 16,
                boxShadow: `0 8px 32px ${pc}44`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 14px 40px ${pc}55`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 32px ${pc}44`;
              }}
            >
              ⭐ Laisser un avis Google
            </a>

            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: "13px 28px", borderRadius: 12,
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  color: "#636e72", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = pc; e.currentTarget.style.color = pc; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#636e72"; }}
              >
                J&apos;ai déjà laissé mon avis →
              </button>
            </div>

            {/* Steps indicator */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
              {["Avis Google", "Code", "Roue"].map((label, i) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: i === 0 ? pc : "#e2e8f0",
                    color: i === 0 ? "#fff" : "#b2bec3",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 11, color: i === 0 ? pc : "#b2bec3", fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Enter code */}
        {step === 2 && (
          <div style={{ textAlign: "center", animation: "fadeInUp 0.4s ease" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎟️</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0F0F1A", margin: "0 0 10px" }}>
              Entrez votre code
            </h2>
            <p style={{ color: "#636e72", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Saisissez le code unique remis par le personnel.
            </p>

            <input
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError(""); }}
              onKeyDown={e => e.key === "Enter" && validateCode()}
              placeholder="XXXX-XXXX"
              maxLength={9}
              style={{
                width: "100%", padding: "18px 20px",
                borderRadius: 14, textAlign: "center",
                border: `2.5px solid ${codeError ? "#E17055" : "#e2e8f0"}`,
                fontSize: 28, fontWeight: 800, letterSpacing: 6,
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none", transition: "border-color 0.2s",
                background: "#fff",
              }}
              onFocus={e => { if (!codeError) e.target.style.borderColor = pc; }}
              onBlur={e => { if (!codeError) e.target.style.borderColor = "#e2e8f0"; }}
            />

            {codeError && (
              <p style={{ color: "#E17055", fontSize: 13, fontWeight: 700, marginTop: 10 }}>
                {codeError}
              </p>
            )}

            <button
              onClick={validateCode}
              disabled={loading}
              style={{
                width: "100%", padding: "17px", borderRadius: 14, border: "none",
                marginTop: 18,
                background: loading ? "#b2bec3" : `linear-gradient(135deg, ${pc}, ${sc})`,
                color: "#fff", fontWeight: 800, fontSize: 16,
                cursor: loading ? "wait" : "pointer",
                fontFamily: "'Inter', sans-serif",
                boxShadow: loading ? "none" : `0 6px 24px ${pc}44`,
                transition: "all 0.2s",
              }}
            >
              {loading ? "Vérification…" : "Valider le code"}
            </button>

            <button
              onClick={() => setStep(1)}
              style={{
                display: "block", margin: "16px auto 0", background: "none", border: "none",
                color: "#8b8da0", fontSize: 13, cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontWeight: 500,
              }}
            >
              ← Retour
            </button>
          </div>
        )}

        {/* STEP 3 — Spin wheel */}
        {step === 3 && (
          <div style={{ textAlign: "center", animation: "fadeInUp 0.4s ease" }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0F0F1A", margin: "0 0 6px" }}>
              Tentez votre chance !
            </h2>
            <p style={{ color: "#636e72", fontSize: 14, marginBottom: 28 }}>
              Cliquez sur la roue ou sur le bouton pour la faire tourner.
            </p>
            <SpinWheel
              rewards={entreprise.rewards}
              primaryColor={pc}
              secondaryColor={sc}
              onResult={() => {
                setConfetti(true);
                setTimeout(() => setConfetti(false), 5000);
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
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
