"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";

const DEFAULT_PALETTE = [
  "#6C5CE7", "#00B894", "#FDCB6E", "#E17055",
  "#0984E3", "#E84393", "#74B9FF", "#55EFC4",
];

// Luminance relative d'une couleur hex (#rgb ou #rrggbb), 0 = noir, 1 = blanc
function lum(hex) {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length < 6) return 0;
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return 0;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
const textOn = (bg) => (lum(bg) > 0.62 ? "#111827" : "#FFFFFF");
const isWhite = (c) => !c || c.toLowerCase() === "#fff" || c.toLowerCase() === "#ffffff";

// Coupe un texte avec "…" pour qu'il tienne dans maxW
function ellipsize(ctx, text, maxW) {
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > maxW) t = t.slice(0, -1);
  return t + "…";
}

// Découpe un libellé en 1 ou 2 lignes qui tiennent dans maxW
function fitLines(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return { lines: [text], fits: true };
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    let best = null;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(" ");
      const b = words.slice(i).join(" ");
      const w = Math.max(ctx.measureText(a).width, ctx.measureText(b).width);
      if (!best || w < best.w) best = { a, b, w };
    }
    if (best && best.w <= maxW) return { lines: [best.a, best.b], fits: true };
    if (best) {
      const a = ctx.measureText(best.a).width > maxW ? ellipsize(ctx, best.a, maxW) : best.a;
      const b = ctx.measureText(best.b).width > maxW ? ellipsize(ctx, best.b, maxW) : best.b;
      return { lines: [a, b], fits: false };
    }
  }
  return { lines: [ellipsize(ctx, text, maxW)], fits: false };
}

/**
 * SpinWheel — composant partagé (aperçu dashboard + page publique).
 *
 * Props :
 *   rewards[]          { name, probability|prob }
 *   primaryColor / secondaryColor   couleurs de base
 *   segmentColors[]    couleur par segment (optionnelle)
 *   borderColor        couleur de l'anneau extérieur
 *   ringWidth          épaisseur de l'anneau (px sur une roue de 360, défaut 12)
 *   dividerColor       couleur des séparateurs entre segments (défaut blanc)
 *   dividerWidth       épaisseur des séparateurs (défaut 2)
 *   labelColor         couleur des textes (défaut : contraste automatique)
 *   labelSize          taille des textes en px (0 = automatique)
 *   centerColor        couleur du centre
 *   centerLogoUrl      logo affiché au centre
 *   pointerColor       couleur de la flèche (défaut : anneau ou couleur principale)
 *   shadow             ombre portée douce autour de la roue (défaut true)
 *   fontFamily         police des textes
 *   size               taille en px (défaut 360)
 *   buttonColor / buttonRadius / buttonText   bouton "Tourner la roue"
 *   disabled           roue grisée et non cliquable
 *   onResult(rw, idx)  appelé à la fin du tour
 */
export default function SpinWheel({
  rewards = [],
  primaryColor = "#6C5CE7",
  secondaryColor = "#00B894",
  onResult,
  segmentColors,
  borderColor,
  ringWidth = 12,
  dividerColor,
  dividerWidth = 2,
  labelColor,
  labelSize = 0,
  centerColor,
  centerLogoUrl,
  pointerColor,
  shadow = true,
  fontFamily,
  size = 360,
  buttonColor,
  buttonRadius = 14,
  buttonText,
  disabled = false,
}) {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const rafRef = useRef(0);
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);

  const resolvedColors = useMemo(() => {
    const base = [primaryColor, secondaryColor, ...DEFAULT_PALETTE];
    return rewards.map((_, i) =>
      segmentColors?.[i] && segmentColors[i] !== "" ? segmentColors[i] : base[i % base.length]
    );
  }, [rewards, segmentColors, primaryColor, secondaryColor]);

  const ringColor = borderColor || "#FFFFFF";
  const arrowColor = pointerColor || (!isWhite(borderColor) ? borderColor : primaryColor);
  const hubFill = centerColor || "#FFFFFF";

  // ── Dessin ─────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const S = size;
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 3);
    const px = Math.round(S * dpr);
    if (canvas.width !== px || canvas.height !== px) {
      canvas.width = px;
      canvas.height = px;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, S, S);
    if (rewards.length === 0) return;

    const k = S / 360;                       // facteur d'échelle
    const c = S / 2;
    const outerR = c - 1;
    const ringPx = Math.max(0, ringWidth) * k;
    const R = outerR - ringPx;               // rayon des segments
    const hubR = Math.max(S * 0.085, 22 * k);
    const n = rewards.length;
    const arc = (Math.PI * 2) / n;
    const ff = fontFamily ? `'${fontFamily}', sans-serif` : "'DM Sans', sans-serif";

    // Anneau extérieur
    ctx.beginPath();
    ctx.arc(c, c, outerR, 0, Math.PI * 2);
    ctx.fillStyle = ringColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(15,23,42,0.10)";
    ctx.stroke();

    // Segments
    for (let i = 0; i < n; i++) {
      const a0 = angleRef.current + i * arc;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.arc(c, c, R, a0, a0 + arc);
      ctx.closePath();
      ctx.fillStyle = resolvedColors[i];
      ctx.fill();
    }

    // Séparateurs
    if (dividerWidth > 0) {
      ctx.strokeStyle = dividerColor || "#FFFFFF";
      ctx.lineWidth = dividerWidth * k;
      ctx.lineCap = "butt";
      for (let i = 0; i < n; i++) {
        const a0 = angleRef.current + i * arc;
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.lineTo(c + Math.cos(a0) * R, c + Math.sin(a0) * R);
        ctx.stroke();
      }
    }

    // Filet intérieur de l'anneau
    ctx.beginPath();
    ctx.arc(c, c, R, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(15,23,42,0.12)";
    ctx.stroke();

    // Textes
    const maxW = R - hubR - 26 * k;
    const baseSize = labelSize > 0 ? labelSize * k : Math.min(Math.max(S * 0.042, 11), 18);
    const fs = Math.min(baseSize, arc * R * 0.4);
    for (let i = 0; i < n; i++) {
      const a0 = angleRef.current + i * arc;
      const name = (rewards[i].name || "").trim();
      if (!name) continue;
      ctx.save();
      ctx.translate(c, c);
      ctx.rotate(a0 + arc / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = labelColor || textOn(resolvedColors[i]);
      // On réduit la police (jusqu'à 70 %) avant de couper le texte avec "…"
      let size = fs;
      let res = null;
      for (const f of [1, 0.9, 0.8, 0.7]) {
        size = fs * f;
        ctx.font = `700 ${size}px ${ff}`;
        res = fitLines(ctx, name, maxW);
        if (res.fits) break;
      }
      const lines = res.lines;
      const lh = size * 1.1;
      const x = R - 16 * k;
      lines.forEach((line, li) => {
        const y = (li - (lines.length - 1) / 2) * lh;
        ctx.fillText(line, x, y);
      });
      ctx.restore();
    }

    // Centre
    ctx.beginPath();
    ctx.arc(c, c, hubR, 0, Math.PI * 2);
    ctx.fillStyle = hubFill;
    ctx.fill();
    ctx.lineWidth = 3 * k;
    ctx.strokeStyle = isWhite(borderColor) ? "rgba(15,23,42,0.10)" : borderColor;
    ctx.stroke();
  }, [rewards, resolvedColors, size, ringWidth, ringColor, borderColor, dividerColor, dividerWidth, labelColor, labelSize, hubFill, fontFamily]);

  useEffect(() => { draw(); }, [draw]);

  // Redessine quand la police est chargée
  useEffect(() => {
    if (!fontFamily || typeof document === "undefined" || !document.fonts?.load) return;
    let alive = true;
    document.fonts.load(`700 16px '${fontFamily}'`).then(() => { if (alive) draw(); }).catch(() => {});
    return () => { alive = false; };
  }, [fontFamily, draw]);

  // Stoppe l'animation si le composant est démonté
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ── Tour de roue ───────────────────────────────────────────────────
  const spin = () => {
    if (spinning || done || disabled || rewards.length === 0) return;
    setSpinning(true);

    const probs = rewards.map((r) => Number(r.probability ?? r.prob ?? 0) || 0);
    const total = probs.reduce((a, b) => a + b, 0);
    let winIdx = 0;
    if (total > 0) {
      const rand = Math.random() * total;
      let acc = 0;
      for (let i = 0; i < probs.length; i++) {
        acc += probs[i];
        if (rand <= acc) { winIdx = i; break; }
      }
    } else {
      winIdx = Math.floor(Math.random() * rewards.length);
    }

    const arc = (Math.PI * 2) / rewards.length;
    // La flèche est en haut (-π/2) : on amène le milieu du segment gagnant dessous, avec un léger décalage naturel
    const jitter = (Math.random() - 0.5) * arc * 0.5;
    const target = -Math.PI / 2 - (winIdx * arc + arc / 2) + jitter;

    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const currentMod = angleRef.current % (Math.PI * 2);
    const delta = (((target - currentMod) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const totalAngle = fullSpins * Math.PI * 2 + delta;
    const dur = 5200;
    const t0 = performance.now();
    const startA = angleRef.current;
    const ease = (t) => 1 - Math.pow(1 - t, 4);

    const anim = (now) => {
      const t = Math.min((now - t0) / dur, 1);
      angleRef.current = startA + totalAngle * ease(t);
      draw();
      if (t < 1) {
        rafRef.current = requestAnimationFrame(anim);
      } else {
        setSpinning(false);
        setDone(true);
        onResult?.(rewards[winIdx], winIdx);
      }
    };
    rafRef.current = requestAnimationFrame(anim);
  };

  const btnBase = buttonColor || primaryColor;
  const ffCss = fontFamily ? `'${fontFamily}', sans-serif` : "'DM Sans', sans-serif";
  const pointerW = Math.max(22, Math.round(size * 0.075));
  const pointerH = Math.round(pointerW * 1.28);
  const logoSize = Math.round(Math.max(size * 0.085, 22 * (size / 360)) * 2 * 0.78);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, maxWidth: "100%" }}>
      <div style={{ position: "relative", width: size, maxWidth: "100%", padding: `${Math.round(pointerH * 0.45)}px 0 6px` }}>
        {/* Roue */}
        <div style={{
          position: "relative", width: "100%",
          filter: shadow ? "drop-shadow(0 12px 24px rgba(15,23,42,0.16)) drop-shadow(0 2px 4px rgba(15,23,42,0.10))" : "none",
          opacity: disabled && !spinning ? 0.5 : 1, transition: "opacity 0.3s",
        }}>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Roue de la fortune"
            style={{
              display: "block", width: "100%", height: "auto", aspectRatio: "1 / 1",
              cursor: disabled || done ? "default" : spinning ? "wait" : "pointer",
            }}
            onClick={spin}
          />
          {centerLogoUrl && (
            <img
              src={centerLogoUrl}
              alt=""
              style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: `${(logoSize / size) * 100}%`, aspectRatio: "1 / 1",
                borderRadius: "50%", objectFit: "contain", pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* Flèche (SVG net, jamais coupée) */}
        <svg
          width={pointerW} height={pointerH} viewBox="0 0 28 36" aria-hidden="true"
          style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", filter: shadow ? "drop-shadow(0 2px 3px rgba(15,23,42,0.25))" : "none" }}
        >
          <path d="M14 35 L3 13 A12.5 12.5 0 1 1 25 13 Z" fill={arrowColor} stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="14" cy="11.5" r="4" fill="#FFFFFF" fillOpacity="0.92" />
        </svg>
      </div>

      {!done && (
        <button
          onClick={spin}
          disabled={spinning || disabled}
          style={{
            minWidth: 220, padding: "16px 36px", borderRadius: buttonRadius, border: "none",
            cursor: spinning || disabled ? "not-allowed" : "pointer",
            background: spinning || disabled ? "#CBD5E1" : btnBase,
            color: spinning || disabled ? "#64748B" : textOn(btnBase),
            fontWeight: 700, fontSize: 16, letterSpacing: "0.01em", fontFamily: ffCss,
            boxShadow: spinning || disabled ? "none" : `0 8px 20px ${btnBase}40`,
            transition: "transform 0.15s, box-shadow 0.15s, background 0.2s",
          }}
          onMouseDown={(e) => { if (!spinning && !disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "none"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
        >
          {spinning ? "La roue tourne…" : (buttonText || "Tourner la roue")}
        </button>
      )}
    </div>
  );
}
