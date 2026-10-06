"use client";

import { useRef, useState, useEffect, useCallback, useMemo, useId } from "react";

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

function parseHex(hex) {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length < 6) return null;
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return [r, g, b].some(Number.isNaN) ? null : [r, g, b];
}
// amt > 0 éclaircit (vers le blanc), amt < 0 assombrit (vers le noir)
function shade(hex, amt) {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const target = amt > 0 ? 255 : 0, t = Math.abs(amt);
  return `rgb(${rgb.map((v) => Math.round(v + (target - v) * t)).join(",")})`;
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

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
 *   effect3d           relief 3D (reflets, biseaux, profondeur) — défaut true
 *   gradient           dégradé sur chaque gain — défaut true
 *   bulbs              ampoules qui clignotent sur le contour — défaut false
 *   bulbColor          couleur des ampoules
 *   shadow             ombre portée douce autour de la roue (défaut true)
 *   fontFamily         police des textes
 *   size               taille maximale en px (la roue s'adapte à la largeur disponible)
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
  effect3d = true,
  gradient = true,
  bulbs = false,
  bulbColor,
  shadow = true,
  fontFamily,
  size = 360,
  buttonColor,
  buttonRadius = 14,
  buttonText,
  disabled = false,
}) {
  const gid = useId().replace(/:/g, "");
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const pointerRef = useRef(null);
  const angleRef = useRef(0);
  const rafRef = useRef(0);
  const spinningRef = useRef(false);
  const hlRef = useRef({ idx: -1, dim: 0, glow: 0 });
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);
  const [avail, setAvail] = useState(0);

  // Largeur réellement disponible : la roue ne déborde jamais et reste nette sur mobile
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setAvail(Math.floor(el.getBoundingClientRect().width));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const eff = Math.max(180, Math.round(Math.min(size, avail || size)));

  const resolvedColors = useMemo(() => {
    const base = [primaryColor, secondaryColor, ...DEFAULT_PALETTE];
    return rewards.map((_, i) =>
      segmentColors?.[i] && segmentColors[i] !== "" ? segmentColors[i] : base[i % base.length]
    );
  }, [rewards, segmentColors, primaryColor, secondaryColor]);

  const ringColor = borderColor || "#FFFFFF";
  const arrowColor = pointerColor || (!isWhite(borderColor) ? borderColor : primaryColor);
  const hubFill = centerColor || "#FFFFFF";
  const lights = bulbColor || "#FFE9A8";

  // ── Dessin ─────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const S = eff;
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
    const hubR = centerLogoUrl ? S * 0.12 : Math.max(S * 0.085, 22 * k);
    const n = rewards.length;
    const arc = (Math.PI * 2) / n;
    const ff = fontFamily ? `'${fontFamily}', sans-serif` : "'DM Sans', sans-serif";
    const A = angleRef.current;
    const hl = hlRef.current;

    // ── Anneau extérieur ──
    ctx.beginPath();
    ctx.arc(c, c, outerR, 0, Math.PI * 2);
    if (effect3d) {
      const g = ctx.createLinearGradient(c - outerR, c - outerR, c + outerR, c + outerR);
      g.addColorStop(0, shade(ringColor, 0.4));
      g.addColorStop(0.5, ringColor);
      g.addColorStop(1, shade(ringColor, -0.3));
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = ringColor;
    }
    ctx.fill();
    ctx.lineWidth = Math.max(1, k);
    ctx.strokeStyle = effect3d ? "rgba(0,0,0,0.22)" : "rgba(15,23,42,0.10)";
    ctx.stroke();
    if (effect3d && ringPx > 5 * k) {
      ctx.beginPath();
      ctx.arc(c, c, outerR - 2.2 * k, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1, 1.2 * k);
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.stroke();
    }

    // ── Segments ──
    for (let i = 0; i < n; i++) {
      const a0 = A + i * arc;
      const col = resolvedColors[i];
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.arc(c, c, R, a0, a0 + arc);
      ctx.closePath();
      if (gradient) {
        const mid = a0 + arc / 2;
        const g = ctx.createLinearGradient(
          c + Math.cos(mid) * hubR, c + Math.sin(mid) * hubR,
          c + Math.cos(mid) * R, c + Math.sin(mid) * R
        );
        g.addColorStop(0, shade(col, 0.3));
        g.addColorStop(0.55, col);
        g.addColorStop(1, shade(col, -0.22));
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = col;
      }
      ctx.fill();
    }

    // Séparateurs
    if (dividerWidth > 0) {
      ctx.lineCap = "butt";
      for (let i = 0; i < n; i++) {
        const a0 = A + i * arc;
        const x = c + Math.cos(a0) * R, y = c + Math.sin(a0) * R;
        if (effect3d) {
          ctx.strokeStyle = "rgba(0,0,0,0.16)";
          ctx.lineWidth = dividerWidth * k + 1.6 * k;
          ctx.beginPath(); ctx.moveTo(c, c); ctx.lineTo(x, y); ctx.stroke();
        }
        ctx.strokeStyle = dividerColor || "#FFFFFF";
        ctx.lineWidth = dividerWidth * k;
        ctx.beginPath(); ctx.moveTo(c, c); ctx.lineTo(x, y); ctx.stroke();
      }
    }

    // Relief 3D fixe : ombre intérieure au bord + reflet de lumière en haut à gauche
    if (effect3d) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.clip();
      const edge = ctx.createRadialGradient(c, c, R * 0.74, c, c, R);
      edge.addColorStop(0, "rgba(0,0,0,0)");
      edge.addColorStop(1, "rgba(0,0,0,0.30)");
      ctx.fillStyle = edge;
      ctx.fillRect(0, 0, S, S);
      const gloss = ctx.createRadialGradient(c - R * 0.38, c - R * 0.5, 0, c - R * 0.38, c - R * 0.5, R * 1.15);
      gloss.addColorStop(0, "rgba(255,255,255,0.34)");
      gloss.addColorStop(0.45, "rgba(255,255,255,0.08)");
      gloss.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gloss;
      ctx.fillRect(0, 0, S, S);
      ctx.restore();
    }

    // Mise en avant du gain à la fin du tour
    if (hl.idx >= 0 && (hl.dim > 0 || hl.glow > 0)) {
      for (let i = 0; i < n; i++) {
        const a0 = A + i * arc;
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.arc(c, c, R, a0, a0 + arc);
        ctx.closePath();
        if (i === hl.idx) {
          ctx.fillStyle = `rgba(255,255,255,${(hl.glow * 0.32).toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(0,0,0,${(hl.dim * 0.34).toFixed(3)})`;
        }
        ctx.fill();
      }
    }

    // Rainure intérieure de l'anneau
    ctx.beginPath();
    ctx.arc(c, c, R, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1, (effect3d ? 1.6 : 1) * k);
    ctx.strokeStyle = effect3d ? "rgba(0,0,0,0.32)" : "rgba(15,23,42,0.12)";
    ctx.stroke();

    // ── Textes ──
    const maxW = R - hubR - 40 * k;
    const baseSize = labelSize > 0 ? labelSize * k : Math.min(Math.max(S * 0.042, 11), 18);
    const fs = Math.min(baseSize, arc * R * 0.4);
    for (let i = 0; i < n; i++) {
      const a0 = A + i * arc;
      const name = (rewards[i].name || "").trim();
      if (!name) continue;
      ctx.save();
      ctx.translate(c, c);
      ctx.rotate(a0 + arc / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const fill = labelColor || textOn(resolvedColors[i]);
      ctx.fillStyle = fill;
      if (effect3d) {
        const light = lum(fill) > 0.6;
        ctx.shadowColor = light ? "rgba(0,0,0,0.38)" : "rgba(255,255,255,0.35)";
        ctx.shadowBlur = 3 * k;
        ctx.shadowOffsetY = 1 * k;
      }
      // On réduit la police (jusqu'à 70 %) avant de couper le texte avec "…"
      let fsz = fs;
      let res = null;
      for (const f of [1, 0.9, 0.8, 0.7]) {
        fsz = fs * f;
        ctx.font = `700 ${fsz}px ${ff}`;
        res = fitLines(ctx, name, maxW);
        if (res.fits) break;
      }
      const lines = res.lines;
      const lh = fsz * 1.1;
      const x = R - 24 * k;
      lines.forEach((line, li) => {
        const y = (li - (lines.length - 1) / 2) * lh;
        ctx.fillText(line, x, y);
      });
      ctx.restore();
    }

    // ── Ampoules du contour ──
    if (bulbs && ringPx >= 7 * k) {
      const N = S < 300 ? 16 : 20;
      const rb = outerR - ringPx / 2;
      const br = clamp(ringPx * 0.27, 1.8, 6 * k);
      const phase = Math.floor(performance.now() / (spinningRef.current ? 90 : 650));
      for (let j = 0; j < N; j++) {
        const a = (j / N) * Math.PI * 2 - Math.PI / 2;
        const bx = c + Math.cos(a) * rb, by = c + Math.sin(a) * rb;
        const lit = (j + phase) % 2 === 0;
        if (lit) {
          const glow = ctx.createRadialGradient(bx, by, 0, bx, by, br * 2.3);
          glow.addColorStop(0, lights);
          glow.addColorStop(0.4, lights);
          glow.addColorStop(1, "rgba(255,255,255,0)");
          ctx.globalAlpha = 0.55;
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(bx, by, br * 2.3, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        }
        const g = ctx.createRadialGradient(bx - br * 0.3, by - br * 0.3, 0, bx, by, br);
        g.addColorStop(0, lit ? "#FFFFFF" : shade(lights, -0.1));
        g.addColorStop(1, lit ? lights : shade(lights, -0.55));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = Math.max(0.6, 0.8 * k);
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.stroke();
      }
    }

    // ── Centre ──
    ctx.save();
    if (effect3d) {
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 10 * k;
      ctx.shadowOffsetY = 3 * k;
    }
    ctx.beginPath();
    ctx.arc(c, c, hubR, 0, Math.PI * 2);
    if (effect3d) {
      const g = ctx.createRadialGradient(c - hubR * 0.35, c - hubR * 0.4, hubR * 0.1, c, c, hubR);
      g.addColorStop(0, shade(hubFill, 0.5));
      g.addColorStop(0.6, hubFill);
      g.addColorStop(1, shade(hubFill, -0.22));
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = hubFill;
    }
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(c, c, hubR, 0, Math.PI * 2);
    ctx.lineWidth = 3 * k;
    ctx.strokeStyle = isWhite(borderColor) ? "rgba(15,23,42,0.10)" : borderColor;
    ctx.stroke();
    if (!centerLogoUrl) {
      // Petit bijou central quand il n'y a pas de logo
      const jr = hubR * 0.4;
      const g = ctx.createRadialGradient(c - jr * 0.35, c - jr * 0.4, 0, c, c, jr);
      g.addColorStop(0, shade(arrowColor, 0.55));
      g.addColorStop(1, shade(arrowColor, -0.15));
      ctx.beginPath();
      ctx.arc(c, c, jr, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }, [rewards, resolvedColors, eff, ringWidth, ringColor, borderColor, dividerColor, dividerWidth, labelColor, labelSize, hubFill, fontFamily, centerLogoUrl, effect3d, gradient, bulbs, lights, arrowColor]);

  useEffect(() => { draw(); }, [draw]);

  // Redessine quand la police est chargée
  useEffect(() => {
    if (!fontFamily || typeof document === "undefined" || !document.fonts?.load) return;
    let alive = true;
    document.fonts.load(`700 16px '${fontFamily}'`).then(() => { if (alive) draw(); }).catch(() => {});
    return () => { alive = false; };
  }, [fontFamily, draw]);

  // Clignotement lent des ampoules quand la roue est au repos
  useEffect(() => {
    if (!bulbs || spinning) return;
    const id = setInterval(() => { if (!document.hidden) draw(); }, 650);
    return () => clearInterval(id);
  }, [bulbs, spinning, draw]);

  // Stoppe l'animation si le composant est démonté
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const tiltPointer = (deg) => {
    if (pointerRef.current) pointerRef.current.style.transform = `rotate(${deg.toFixed(2)}deg)`;
  };

  // ── Tour de roue ───────────────────────────────────────────────────
  const spin = () => {
    if (spinning || done || disabled || rewards.length === 0) return;
    setSpinning(true);
    spinningRef.current = true;

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

    const TAU = Math.PI * 2;
    const arc = TAU / rewards.length;
    // La flèche est en haut (-π/2) : on amène le milieu du segment gagnant dessous, avec un léger décalage naturel
    const jitter = (Math.random() - 0.5) * arc * 0.5;
    const target = -Math.PI / 2 - (winIdx * arc + arc / 2) + jitter;

    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const WIND = 420;                         // petit recul avant le départ
    const windBack = 0.16;
    const startA = angleRef.current;
    const from = startA - windBack;
    const currentMod = from % TAU;
    const delta = (((target - currentMod) % TAU) + TAU) % TAU;
    const totalAngle = fullSpins * TAU + delta;
    const dur = 5800;
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    // Tic de la flèche à chaque passage de séparateur
    let prevSeg = Math.floor(((-Math.PI / 2 - startA) / arc));
    let flick = 0, lastT = t0, lastBuzz = 0;

    const anim = (now) => {
      const el = now - t0;
      const dt = Math.min(now - lastT, 50);
      lastT = now;
      let a, done_ = false;
      if (el < WIND) {
        a = startA - windBack * easeIO(el / WIND);
      } else {
        const t = Math.min((el - WIND) / dur, 1);
        a = from + totalAngle * ease(t);
        done_ = t >= 1;
      }
      angleRef.current = a;

      const seg = Math.floor((-Math.PI / 2 - a) / arc);
      if (seg !== prevSeg) {
        const speed = Math.min(Math.abs(seg - prevSeg), 3);
        prevSeg = seg;
        flick = Math.min(1, 0.55 + 0.15 * speed);
        if (now - lastBuzz > 90 && typeof navigator !== "undefined" && navigator.vibrate) {
          lastBuzz = now;
          try { navigator.vibrate(6); } catch {}
        }
      }
      flick *= Math.exp(-dt / 70);
      tiltPointer(-flick * 22);

      draw();
      if (!done_) {
        rafRef.current = requestAnimationFrame(anim);
      } else {
        tiltPointer(0);
        spinningRef.current = false;
        setSpinning(false);
        setDone(true);
        celebrate(winIdx);
        onResult?.(rewards[winIdx], winIdx);
      }
    };
    rafRef.current = requestAnimationFrame(anim);
  };

  // Le gain brille, les autres s'estompent
  const celebrate = (idx) => {
    const s0 = performance.now();
    const loop = (now) => {
      const el = now - s0;
      hlRef.current = {
        idx,
        dim: Math.min(1, el / 400),
        glow: el < 2400 ? 0.5 + 0.5 * Math.sin(el / 130) : 0,
      };
      draw();
      if (el < 2400) rafRef.current = requestAnimationFrame(loop);
      else { hlRef.current = { idx, dim: 1, glow: 0 }; draw(); }
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const btnBase = buttonColor || primaryColor;
  const ffCss = fontFamily ? `'${fontFamily}', sans-serif` : "'DM Sans', sans-serif";
  const k = eff / 360;
  const pointerW = Math.round(eff * 0.12);
  const pointerH = Math.round(pointerW * 1.32);
  const overlap = Math.max(0, ringWidth) * k + 8 * k;           // la pointe s'arrête juste dans l'anneau
  const padTop = Math.max(6, Math.round(pointerH - overlap));
  const inactive = spinning || disabled;
  const btnTop = effect3d ? shade(btnBase, 0.14) : btnBase;
  const btnEdge = shade(btnBase, -0.28);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: size }}>
      <style>{`
        @keyframes sw-pulse { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-1px) scale(1.025); } }
        .sw-cta:active:not(:disabled) { animation: none !important; transform: translateY(4px) !important; box-shadow: 0 1px 0 var(--sw-edge), 0 4px 10px var(--sw-base) !important; }
        @media (prefers-reduced-motion: reduce) { .sw-cta { animation: none !important; } }
      `}</style>
      <div ref={wrapRef} style={{ position: "relative", width: "100%", maxWidth: size, paddingTop: padTop, paddingBottom: 4 }}>
        {/* Roue */}
        <div style={{
          position: "relative", width: eff, maxWidth: "100%", margin: "0 auto",
          opacity: disabled && !spinning ? 0.5 : 1, transition: "opacity 0.3s",
        }}>
          {shadow && (
            <div aria-hidden="true" style={{
              position: "absolute", inset: 1, borderRadius: "50%", pointerEvents: "none",
              boxShadow: effect3d
                ? "0 22px 32px -10px rgba(15,23,42,0.45), 0 8px 14px -4px rgba(15,23,42,0.25)"
                : "0 12px 24px rgba(15,23,42,0.16), 0 2px 4px rgba(15,23,42,0.10)",
            }} />
          )}
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Roue de la fortune"
            style={{
              position: "relative", display: "block", width: "100%", height: "auto", aspectRatio: "1 / 1",
              cursor: disabled || done ? "default" : spinning ? "wait" : "pointer",
              touchAction: "manipulation", WebkitTapHighlightColor: "transparent",
            }}
            onClick={spin}
          />
          {centerLogoUrl && (
            // Logo rond : le logo est contenu (jamais rogné) dans un disque aux dimensions du centre
            <div
              aria-hidden="true"
              style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: `${((eff * 0.12 * 2 * 0.94) / eff) * 100}%`, aspectRatio: "1 / 1", borderRadius: "50%",
                background: hubFill, overflow: "hidden", pointerEvents: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <img
                src={centerLogoUrl}
                alt=""
                style={{ width: "70%", height: "70%", objectFit: "contain" }}
              />
            </div>
          )}
        </div>

        {/* Flèche : goutte biseautée avec gemme, posée sur l'anneau (jamais coupée) */}
        <div
          ref={pointerRef}
          aria-hidden="true"
          style={{
            position: "absolute", top: 0, left: "50%", marginLeft: -pointerW / 2,
            width: pointerW, height: pointerH, transformOrigin: "50% 24%", pointerEvents: "none",
            filter: "drop-shadow(0 3px 3px rgba(15,23,42,0.35))", willChange: "transform",
          }}
        >
          <svg width={pointerW} height={pointerH} viewBox="0 0 40 53" style={{ display: "block", overflow: "visible" }}>
            <defs>
              <linearGradient id={`sw-pt-body-${gid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={shade(arrowColor, 0.38)} />
                <stop offset="0.5" stopColor={arrowColor} />
                <stop offset="1" stopColor={shade(arrowColor, -0.32)} />
              </linearGradient>
              <radialGradient id={`sw-pt-gem-${gid}`} cx="0.38" cy="0.35" r="0.8">
                <stop offset="0" stopColor="#FFFFFF" />
                <stop offset="0.55" stopColor={shade(arrowColor, 0.7)} />
                <stop offset="1" stopColor={shade(arrowColor, -0.1)} />
              </radialGradient>
            </defs>
            <path
              d="M20 51 C19 49 5 32 5 19 A15 15 0 1 1 35 19 C35 32 21 49 20 51 Z"
              fill={`url(#sw-pt-body-${gid})`} stroke="#FFFFFF" strokeWidth="2.6" strokeLinejoin="round"
            />
            <path
              d="M20 51 C19 49 5 32 5 19 A15 15 0 1 1 35 19 C35 32 21 49 20 51 Z"
              fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="0.8"
            />
            <circle cx="20" cy="19" r="7.2" fill={`url(#sw-pt-gem-${gid})`} stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" />
            <ellipse cx="14.5" cy="12" rx="5" ry="3" fill="#FFFFFF" fillOpacity="0.4" transform="rotate(-32 14.5 12)" />
          </svg>
        </div>
      </div>

      {!done && (
        <button
          className="sw-cta"
          onClick={spin}
          disabled={inactive}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", maxWidth: 340, minHeight: 54, padding: "14px 28px", borderRadius: buttonRadius, border: "none",
            cursor: inactive ? "not-allowed" : "pointer",
            background: inactive ? "#CBD5E1" : `linear-gradient(180deg, ${btnTop}, ${btnBase})`,
            color: inactive ? "#64748B" : textOn(btnBase),
            fontWeight: 700, fontSize: 16, letterSpacing: "0.01em", fontFamily: ffCss,
            touchAction: "manipulation", WebkitTapHighlightColor: "transparent",
            boxShadow: inactive
              ? "none"
              : effect3d
                ? `0 5px 0 ${btnEdge}, 0 12px 22px ${btnBase}55`
                : `0 8px 20px ${btnBase}40`,
            animation: inactive ? "none" : "sw-pulse 2.4s ease-in-out infinite",
            transition: "transform 0.12s, box-shadow 0.12s, background 0.2s",
            "--sw-edge": btnEdge, "--sw-base": btnBase,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></svg>
          {spinning ? "La roue tourne…" : (buttonText || "Tourner la roue")}
        </button>
      )}
    </div>
  );
}
