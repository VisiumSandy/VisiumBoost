"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Inline mini wheel for the public page ──────────────────────────
function MiniWheel({ rewards, primaryColor, secondaryColor, onResult }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const angleRef = useRef(0);

  const segColors = [
    primaryColor || "#6C5CE7",
    secondaryColor || "#00B894",
    "#FDCB6E", "#E17055", "#0984E3", "#E84393", "#74B9FF", "#55EFC4",
  ];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;
    const R = Math.min(cx, cy) - 12;
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;
    ctx.beginPath(); ctx.arc(cx, cy, R + 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.restore();

    const n = rewards.length || 1;
    const arc = (Math.PI * 2) / n;
    rewards.forEach((rw, i) => {
      const a0 = angleRef.current + i * arc;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a0 + arc); ctx.closePath();
      ctx.fillStyle = segColors[i % segColors.length]; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(a0 + arc / 2);
      ctx.textAlign = "right"; ctx.fillStyle = "#fff"; ctx.font = "bold 12px 'DM Sans', sans-serif";
      ctx.fillText(rw.name.length > 12 ? rw.name.slice(0, 12) + "…" : rw.name, R - 14, 4);
      ctx.restore();
    });

    ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.strokeStyle = primaryColor || "#6C5CE7"; ctx.lineWidth = 2.5; ctx.stroke();

    ctx.save(); ctx.translate(cx + R - 4, cy);
    ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-5, -10); ctx.lineTo(-5, 10); ctx.closePath();
    ctx.fillStyle = "#E17055"; ctx.fill(); ctx.restore();
  }, [rewards, primaryColor, secondaryColor, segColors]);

  useEffect(() => { draw(); }, [draw]);

  const spin = () => {
    if (spinning || rewards.length === 0) return;
    setSpinning(true); setResult(null);
    const rand = Math.random() * 100;
    let acc = 0, winIdx = 0;
    for (let i = 0; i < rewards.length; i++) { acc += rewards[i].prob; if (rand <= acc) { winIdx = i; break; } }
    const n = rewards.length, arc = (Math.PI * 2) / n;
    const target = -(winIdx * arc + arc / 2);
    const total = Math.PI * 2 * (6 + Math.random() * 3) + (target - (angleRef.current % (Math.PI * 2)));
    const dur = 4500, start = Date.now(), startA = angleRef.current;
    const anim = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      angleRef.current = startA + total * (1 - Math.pow(1 - t, 4));
      draw();
      if (t < 1) requestAnimationFrame(anim);
      else { setSpinning(false); setResult(rewards[winIdx]); onResult?.(rewards[winIdx]); }
    };
    requestAnimationFrame(anim);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <canvas ref={canvasRef} width={320} height={320} style={{ maxWidth: "100%" }} />
      {!result ? (
        <button onClick={spin} disabled={spinning} style={{
          padding: "14px 36px", borderRadius: 12, border: "none", cursor: spinning ? "wait" : "pointer",
          background: spinning ? "#b2bec3" : (primaryColor || "#6C5CE7"), color: "#fff",
          fontWeight: 700, fontSize: 16, fontFamily: "'DM Sans', sans-serif",
          boxShadow: spinning ? "none" : `0 4px 20px ${primaryColor || "#6C5CE7"}44`,
        }}>
          {spinning ? "La roue tourne…" : "🎰 Tourner la roue !"}
        </button>
      ) : (
        <div style={{ textAlign: "center", padding: 20, borderRadius: 16, background: `${primaryColor || "#6C5CE7"}12` }}>
          <div style={{ fontSize: 36 }}>🎉</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: primaryColor || "#6C5CE7", marginTop: 4 }}>Félicitations !</div>
          <div style={{ fontSize: 15, color: "#636e72", marginTop: 4 }}>Vous avez gagné : <strong>{result.name}</strong></div>
          <div style={{ fontSize: 13, color: "#b2bec3", marginTop: 8 }}>Montrez cet écran au personnel pour récupérer votre récompense.</div>
        </div>
      )}
    </div>
  );
}

// ─── Confetti for public page ───────────────────────────────────────
function ConfettiCanvas({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    c.width = window.innerWidth; c.height = window.innerHeight;
    const cols = ["#6C5CE7","#00B894","#FDCB6E","#E17055","#0984E3","#E84393"];
    const ps = Array.from({length:120}, () => ({
      x: Math.random()*c.width, y: Math.random()*c.height-c.height,
      w: Math.random()*10+4, h: Math.random()*6+2,
      color: cols[Math.floor(Math.random()*cols.length)],
      vx: (Math.random()-0.5)*3, vy: Math.random()*3+2, rot: Math.random()*360, vr: (Math.random()-0.5)*8,
    }));
    let f;
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      let alive = false;
      ps.forEach(p => {
        if (p.y < c.height+20) alive = true;
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.vy+=0.04;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
      });
      if (alive) f = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(f);
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }} />;
}

// ─── FLOW STEPS ─────────────────────────────────────────────────────
// Step 1: Landing → CTA to leave review
// Step 2: Come back → enter code
// Step 3: Spin the wheel

export default function PlayPage() {
  const [flowStep, setFlowStep] = useState(1);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Demo config (in production, fetched from DB based on client ID)
  const config = {
    primaryColor: "#6C5CE7",
    secondaryColor: "#00B894",
    ctaText: "Laissez-nous un avis Google et gagnez un cadeau !",
    googleLink: "https://g.page/r/demo",
    businessName: "Restaurant Le Gourmet",
    rewards: [
      { name: "10% de réduction", prob: 40 },
      { name: "Dessert offert", prob: 25 },
      { name: "Café gratuit", prob: 20 },
      { name: "1 mois gratuit", prob: 5 },
      { name: "Tentez encore", prob: 10 },
    ],
  };

  const validateCode = async () => {
    if (!code.trim()) { setCodeError("Veuillez entrer votre code"); return; }
    setCodeLoading(true); setCodeError("");
    try {
      const res = await fetch("/api/codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        setFlowStep(3);
      } else {
        setCodeError(data.error || "Code invalide");
      }
    } catch {
      setCodeError("Erreur de connexion");
    }
    setCodeLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${config.primaryColor}08 0%, ${config.secondaryColor}08 100%)`,
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <ConfettiCanvas active={showConfetti} />

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <header style={{
        padding: "20px 24px", display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
        }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>R</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: 18, color: "#0F0F1A" }}>{config.businessName}</span>
      </header>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "20px 20px 60px" }}>

        {/* ═══════ STEP 1: Leave a review ═══════ */}
        {flowStep === 1 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>⭐</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F0F1A", margin: "0 0 8px", lineHeight: 1.3 }}>
              {config.ctaText}
            </h1>
            <p style={{ color: "#8b8da0", fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
              Partagez votre expérience et recevez un code pour tenter votre chance à la roue de la fortune !
            </p>

            <a
              href={config.googleLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "16px 32px", borderRadius: 14, textDecoration: "none",
                background: config.primaryColor, color: "#fff",
                fontWeight: 700, fontSize: 16, boxShadow: `0 6px 24px ${config.primaryColor}44`,
                transition: "transform .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              ⭐ Laisser un avis Google
            </a>

            <button
              onClick={() => setFlowStep(2)}
              style={{
                display: "block", margin: "24px auto 0", padding: "12px 24px",
                borderRadius: 10, border: "1px solid #e8e8f0", background: "#fff",
                color: "#636e72", fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              J&apos;ai déjà laissé mon avis →
            </button>
          </div>
        )}

        {/* ═══════ STEP 2: Enter code ═══════ */}
        {flowStep === 2 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎟️</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F0F1A", margin: "0 0 8px" }}>
              Entrez votre code
            </h2>
            <p style={{ color: "#8b8da0", fontSize: 14, marginBottom: 28 }}>
              Saisissez le code unique qui vous a été remis pour accéder à la roue.
            </p>

            <input
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError(""); }}
              placeholder="XXXX-XXXX"
              maxLength={9}
              style={{
                width: "100%", padding: "16px 20px", borderRadius: 14, textAlign: "center",
                border: codeError ? "2px solid #E17055" : "2px solid #e8e8f0",
                fontSize: 24, fontWeight: 800, letterSpacing: 4, fontFamily: "'DM Mono', monospace",
                outline: "none", boxSizing: "border-box", transition: "border .2s",
              }}
            />

            {codeError && (
              <div style={{ color: "#E17055", fontSize: 13, fontWeight: 600, marginTop: 10 }}>
                {codeError}
              </div>
            )}

            <button
              onClick={validateCode}
              disabled={codeLoading}
              style={{
                width: "100%", padding: "16px", borderRadius: 14, border: "none", marginTop: 20,
                background: config.primaryColor, color: "#fff", fontWeight: 700, fontSize: 16,
                cursor: codeLoading ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif",
                boxShadow: `0 4px 20px ${config.primaryColor}44`, opacity: codeLoading ? 0.7 : 1,
              }}
            >
              {codeLoading ? "Vérification…" : "Valider le code"}
            </button>

            <button
              onClick={() => setFlowStep(1)}
              style={{
                display: "block", margin: "16px auto 0", background: "none", border: "none",
                color: "#8b8da0", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ← Retour
            </button>
          </div>
        )}

        {/* ═══════ STEP 3: Spin the wheel ═══════ */}
        {flowStep === 3 && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F0F1A", margin: "0 0 4px" }}>
              Tentez votre chance !
            </h2>
            <p style={{ color: "#8b8da0", fontSize: 14, marginBottom: 24 }}>
              Tournez la roue pour découvrir votre récompense
            </p>

            <MiniWheel
              rewards={config.rewards}
              primaryColor={config.primaryColor}
              secondaryColor={config.secondaryColor}
              onResult={() => {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 4500);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
