"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";

const DEFAULT_PALETTE = [
  "#6C5CE7", "#00B894", "#FDCB6E", "#E17055",
  "#0984E3", "#E84393", "#74B9FF", "#55EFC4",
];

/**
 * SpinWheel — shared component for dashboard preview + public page.
 *
 * Props:
 *   rewards[]          { name, probability|prob }
 *   primaryColor       base color 1
 *   secondaryColor     base color 2
 *   onResult(rw, idx)  callback when spin ends
 *   segmentColors[]    per-segment color overrides (index-aligned with rewards)
 *   borderColor        outer ring + pointer color
 *   centerColor        hub fill
 *   centerLogoUrl      image overlaid at center
 *   fontFamily         CSS font for segment labels
 *   size               canvas px (default 360)
 *   disabled           grayed overlay + block spin
 */
export default function SpinWheel({
  rewards = [],
  primaryColor  = "#6C5CE7",
  secondaryColor = "#00B894",
  onResult,
  segmentColors,
  borderColor,
  centerColor,
  centerLogoUrl,
  fontFamily,
  size = 360,
  disabled = false,
}) {
  const canvasRef  = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [done,     setDone]     = useState(false);
  const angleRef   = useRef(0);

  // ── Resolved per-segment colors ──────────────────────────────────────
  const resolvedColors = useMemo(() => {
    const base = [primaryColor, secondaryColor, ...DEFAULT_PALETTE];
    return rewards.map((_, i) =>
      (segmentColors?.[i] && segmentColors[i] !== "") ? segmentColors[i] : base[i % base.length]
    );
  }, [rewards, segmentColors, primaryColor, secondaryColor]);

  // ── Canvas draw ──────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W   = canvas.width;
    const cx  = W / 2;
    const R   = cx - 20;

    ctx.clearRect(0, 0, W, W);
    if (rewards.length === 0) return;

    const n   = rewards.length;
    const arc = (Math.PI * 2) / n;
    const ff  = fontFamily ? `'${fontFamily}', sans-serif` : "'DM Sans', sans-serif";

    // Shadow ring
    ctx.save();
    ctx.shadowColor   = "rgba(0,0,0,0.14)";
    ctx.shadowBlur    = 28;
    ctx.shadowOffsetY = 8;
    ctx.beginPath(); ctx.arc(cx, cx, R + 7, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.restore();

    // Outer border ring
    const bc = (borderColor && borderColor !== "#ffffff") ? borderColor : null;
    if (bc) {
      ctx.beginPath(); ctx.arc(cx, cx, R + 7, 0, Math.PI * 2);
      ctx.fillStyle = bc; ctx.fill();
    }

    // Segments
    rewards.forEach((rw, i) => {
      const a0 = angleRef.current + i * arc;
      ctx.beginPath(); ctx.moveTo(cx, cx); ctx.arc(cx, cx, R, a0, a0 + arc); ctx.closePath();
      ctx.fillStyle = resolvedColors[i]; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2; ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cx); ctx.rotate(a0 + arc / 2);
      ctx.textAlign = "right"; ctx.fillStyle = "#fff";
      ctx.font = `bold 13px ${ff}`;
      ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 4;
      const label = (rw.name || "").length > 14 ? rw.name.slice(0, 14) + "…" : (rw.name || "");
      ctx.fillText(label, R - 16, 5);
      ctx.restore();
    });

    // Center hub
    ctx.beginPath(); ctx.arc(cx, cx, 28, 0, Math.PI * 2);
    ctx.fillStyle = (centerColor && centerColor !== "#ffffff") ? centerColor : "#fff";
    ctx.fill();
    ctx.strokeStyle = bc || primaryColor || "#6C5CE7"; ctx.lineWidth = 3; ctx.stroke();

    // Pointer
    const pointerColor = bc || "#E17055";
    ctx.save();
    ctx.translate(cx + R + 5, cx);
    ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-6, -13); ctx.lineTo(-6, 13); ctx.closePath();
    ctx.fillStyle = pointerColor;
    ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();

    // Disabled overlay
    if (disabled && !spinning) {
      ctx.save(); ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#000";
      ctx.beginPath(); ctx.arc(cx, cx, R + 7, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }, [rewards, resolvedColors, primaryColor, borderColor, centerColor, fontFamily, disabled, spinning]);

  useEffect(() => { draw(); }, [draw]);

  // Sync canvas size
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width  = size;
    c.height = size;
    draw();
  }, [size, draw]);

  // ── Spin logic ───────────────────────────────────────────────────────
  const spin = () => {
    if (spinning || done || disabled || rewards.length === 0) return;
    setSpinning(true);

    const rand = Math.random() * 100;
    let acc = 0, winIdx = 0;
    for (let i = 0; i < rewards.length; i++) {
      acc += (rewards[i].probability ?? rewards[i].prob ?? 0);
      if (rand <= acc) { winIdx = i; break; }
    }

    const arc    = (Math.PI * 2) / rewards.length;
    const target = -(winIdx * arc + arc / 2);

    // Integer spins only — fractional spins shift the landing segment
    const fullSpins  = 6 + Math.floor(Math.random() * 4); // 6, 7, 8 or 9
    const currentMod = angleRef.current % (Math.PI * 2);
    // Always-positive delta in [0, 2π) to reach target from current position
    const delta = (target - currentMod + Math.PI * 4) % (Math.PI * 2);
    const total = fullSpins * Math.PI * 2 + delta;
    const dur    = 5000;
    const start  = Date.now();
    const startA = angleRef.current;
    const ease   = t => 1 - Math.pow(1 - t, 4);

    const anim = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      angleRef.current = startA + total * ease(t);
      draw();
      if (t < 1) requestAnimationFrame(anim);
      else { setSpinning(false); setDone(true); onResult?.(rewards[winIdx], winIdx); }
    };
    requestAnimationFrame(anim);
  };

  const btnBg = disabled || spinning
    ? "#b2bec3"
    : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{
            maxWidth: "100%", display: "block",
            cursor: disabled || done ? "default" : (spinning ? "wait" : "pointer"),
            transition: "opacity 0.3s",
          }}
          onClick={spin}
        />
        {/* Center logo overlay */}
        {centerLogoUrl && (
          <img
            src={centerLogoUrl}
            alt=""
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              width:  Math.round(size * 0.135),
              height: Math.round(size * 0.135),
              borderRadius: "50%",
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {!done && (
        <button
          onClick={spin}
          disabled={spinning || disabled}
          style={{
            padding: "15px 38px", borderRadius: 14, border: "none",
            cursor: spinning || disabled ? "not-allowed" : "pointer",
            background: btnBg,
            color: "#fff", fontWeight: 800, fontSize: 16,
            fontFamily: fontFamily ? `'${fontFamily}', sans-serif` : "'DM Sans', sans-serif",
            boxShadow: disabled || spinning ? "none" : `0 6px 24px ${primaryColor}55`,
            transition: "all 0.2s",
          }}
        >
          {spinning ? "La roue tourne…" : disabled ? "Laissez d'abord un avis →" : "🎡 Tourner la roue !"}
        </button>
      )}
    </div>
  );
}
