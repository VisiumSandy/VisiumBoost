"use client";

import { useId } from "react";
import { patternStyle, shade } from "@/lib/pageBackgrounds";

// Affiche assortie à un thème de roue (couleurs, polices, motif de fond, ampoules…).
// Rendu 100 % DOM/SVG pour rester fidèle à l'export PDF/PNG (html2canvas).

function lum(hex) {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length < 6) return 0;
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return [r, g, b].some(Number.isNaN) ? 0 : (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
const textOn = (bg) => (lum(bg) > 0.62 ? "#111827" : "#FFFFFF");

function pageBackground(look) {
  if (look.bgType === "pattern" && look.bg) return patternStyle(look.bg, look.bgPattern);
  if (look.bgType === "gradient" && look.bgGradient) return { background: look.bgGradient };
  return { background: look.bg || "#FFFFFF" };
}

// Roue statique en SVG : segments dégradés, anneau métal, ampoules, flèche gemme
function PosterWheel({ size, look }) {
  const gid = useId().replace(/:/g, "");
  const palette = look.palette?.length ? look.palette : ["#6C5CE7", "#00B894", "#FDCB6E", "#E17055"];
  const N = 8;
  const arc = (Math.PI * 2) / N;
  const ringW = Math.max(3, (look.ringWidth ?? 14) * 0.3);
  const Ro = 48;
  const Rs = Ro - ringW;
  const ring = look.wheelBorderColor || "#FFFFFF";
  const hub = look.wheelCenterColor || "#FFFFFF";
  const pointer = look.pointerColor || look.primaryColor || "#2563EB";
  const divider = look.dividerColor || "#FFFFFF";
  const lights = look.bulbColor || "#FFE9A8";
  const start = -Math.PI / 2 - arc / 2;

  const pt = (r, a) => [50 + Math.cos(a) * r, 50 + Math.sin(a) * r];
  const segs = Array.from({ length: N }, (_, i) => {
    const a0 = start + i * arc, a1 = a0 + arc, mid = a0 + arc / 2;
    const [x0, y0] = pt(Rs, a0), [x1, y1] = pt(Rs, a1);
    const [gx0, gy0] = pt(9, mid), [gx1, gy1] = pt(Rs, mid);
    const [tx, ty] = pt(Rs * 0.66, mid);
    const col = palette[i % palette.length];
    return { i, d: `M50 50 L${x0} ${y0} A${Rs} ${Rs} 0 0 1 ${x1} ${y1} Z`, gx0, gy0, gx1, gy1, tx, ty, mid, col };
  });
  const bulbN = 20;
  const bulbR = Math.max(0.9, ringW * 0.26);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* ombre posée */}
      <div style={{
        position: "absolute", left: "4%", right: "4%", bottom: "-3%", height: "10%", borderRadius: "50%",
        background: "rgba(0,0,0,0.38)", filter: "blur(10px)",
      }} />
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "relative", display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id={`ring-${gid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={shade(ring, 0.42)} />
            <stop offset="0.5" stopColor={ring} />
            <stop offset="1" stopColor={shade(ring, -0.32)} />
          </linearGradient>
          <radialGradient id={`edge-${gid}`} cx="50" cy="50" r={Rs} gradientUnits="userSpaceOnUse">
            <stop offset="0.72" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id={`gloss-${gid}`} cx="36" cy="30" r="62" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0.36" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`hub-${gid}`} cx="0.38" cy="0.35" r="0.8">
            <stop offset="0" stopColor={shade(hub, 0.5)} />
            <stop offset="0.6" stopColor={hub} />
            <stop offset="1" stopColor={shade(hub, -0.22)} />
          </radialGradient>
          <radialGradient id={`gem-${gid}`} cx="0.38" cy="0.35" r="0.8">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.55" stopColor={shade(pointer, 0.7)} />
            <stop offset="1" stopColor={shade(pointer, -0.1)} />
          </radialGradient>
          <linearGradient id={`pt-${gid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={shade(pointer, 0.38)} />
            <stop offset="0.5" stopColor={pointer} />
            <stop offset="1" stopColor={shade(pointer, -0.32)} />
          </linearGradient>
          {segs.map((s) => (
            <linearGradient key={s.i} id={`seg${s.i}-${gid}`} gradientUnits="userSpaceOnUse" x1={s.gx0} y1={s.gy0} x2={s.gx1} y2={s.gy1}>
              <stop offset="0" stopColor={shade(s.col, 0.3)} />
              <stop offset="0.55" stopColor={s.col} />
              <stop offset="1" stopColor={shade(s.col, -0.22)} />
            </linearGradient>
          ))}
          <clipPath id={`clip-${gid}`}><circle cx="50" cy="50" r={Rs} /></clipPath>
        </defs>

        {/* anneau */}
        <circle cx="50" cy="50" r={Ro} fill={`url(#ring-${gid})`} stroke="rgba(0,0,0,0.25)" strokeWidth="0.35" />
        <circle cx="50" cy="50" r={Ro - 0.9} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4" />

        {/* segments */}
        {segs.map((s) => (
          <path key={s.i} d={s.d} fill={`url(#seg${s.i}-${gid})`} stroke={divider} strokeWidth="0.7" strokeLinejoin="round" />
        ))}
        {segs.map((s) => (
          <text
            key={`t${s.i}`} x={s.tx} y={s.ty} textAnchor="middle" dominantBaseline="central"
            fontSize="7.5" fill={textOn(s.col)} fillOpacity="0.92"
            transform={`rotate(${(s.mid * 180) / Math.PI + 90} ${s.tx} ${s.ty})`}
          >★</text>
        ))}

        {/* relief */}
        <g clipPath={`url(#clip-${gid})`}>
          <rect width="100" height="100" fill={`url(#edge-${gid})`} />
          <rect width="100" height="100" fill={`url(#gloss-${gid})`} />
        </g>
        <circle cx="50" cy="50" r={Rs} fill="none" stroke="rgba(0,0,0,0.32)" strokeWidth="0.5" />

        {/* ampoules */}
        {look.bulbs && Array.from({ length: bulbN }, (_, j) => {
          const a = (j / bulbN) * Math.PI * 2 - Math.PI / 2;
          const [bx, by] = pt(Ro - ringW / 2, a);
          const lit = j % 2 === 0;
          return (
            <g key={j}>
              {lit && <circle cx={bx} cy={by} r={bulbR * 2.1} fill={lights} fillOpacity="0.35" />}
              <circle cx={bx} cy={by} r={bulbR} fill={lit ? "#FFFFFF" : shade(lights, -0.45)} stroke="rgba(0,0,0,0.3)" strokeWidth="0.2" />
            </g>
          );
        })}

        {/* centre */}
        <circle cx="50" cy="50" r="9" fill={`url(#hub-${gid})`} stroke={ring} strokeWidth="1" />
        <circle cx="50" cy="50" r="3.6" fill={`url(#gem-${gid})`} />

        {/* flèche */}
        <g transform="translate(43.4 -9.5) scale(0.33)">
          <path d="M20 51 C19 49 5 32 5 19 A15 15 0 1 1 35 19 C35 32 21 49 20 51 Z" fill={`url(#pt-${gid})`} stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
          <circle cx="20" cy="19" r="7.2" fill={`url(#gem-${gid})`} stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" />
          <ellipse cx="14.5" cy="12" rx="5" ry="3" fill="#fff" fillOpacity="0.4" transform="rotate(-32 14.5 12)" />
        </g>
      </svg>
    </div>
  );
}

function QrCard({ size, qrDataUrl, look, sc }) {
  const border = look.wheelBorderColor || "#FFFFFF";
  const pad = Math.round(size * 0.1);
  return (
    <div style={{
      width: size + pad * 2, height: size + pad * 2, boxSizing: "border-box", background: "#FFFFFF",
      borderRadius: 18 * sc, padding: pad, border: `${Math.max(3, 4 * sc)}px solid ${border}`,
      boxShadow: "0 10px 28px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      {qrDataUrl
        ? <img src={qrDataUrl} alt="" style={{ width: size, height: size, display: "block" }} />
        : <div style={{ width: size, height: size, background: "repeating-conic-gradient(#CBD5E1 0% 25%, #fff 0% 50%) 50% / 20% 20%" }} />}
    </div>
  );
}

export default function ThemedPoster({ W, H, look, nom, logo, qrDataUrl, headline, subheadline, customText, hideBranding }) {
  const sc = Math.min(1, W / 595, H / 842);
  const wide = W / H > 0.9;
  const tc = look.textColor || "#FFFFFF";
  const accent = look.btnColor || look.pointerColor || look.primaryColor || "#2563EB";
  const font = `'${look.wheelFont || "DM Sans"}', 'DM Sans', system-ui, sans-serif`;
  const lines = String(headline || "").split("\n");
  const longest = Math.max(...lines.map((l) => l.length), 6);
  const hSize = Math.round(Math.min(wide ? 50 : 66, (wide ? 270 : 500) / (longest * 0.62)) * sc * (wide ? 1.05 : 1));
  const btnRadius = Math.min(look.btnRadius ?? 12, 999);
  const wheelSize = Math.round(wide ? W * 0.44 : Math.min(W * 0.66, H * 0.335));
  const qrSize = Math.round(wide ? W * 0.17 : Math.min(W * 0.22, H * 0.14));

  const brand = (
    <div style={{ display: "flex", alignItems: "center", gap: 10 * sc }}>
      <div style={{
        width: 40 * sc, height: 40 * sc, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
        background: "rgba(255,255,255,0.14)", border: `${2 * sc}px solid ${accent}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {logo
          ? <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          : <span style={{ fontSize: 18 * sc, fontWeight: 900, color: tc, fontFamily: font }}>{(nom || "?").charAt(0).toUpperCase()}</span>}
      </div>
      <span style={{ fontSize: 15 * sc, fontWeight: 800, letterSpacing: 2.5 * sc, textTransform: "uppercase", color: tc, fontFamily: font }}>{nom || "Mon établissement"}</span>
    </div>
  );

  const title = (
    <div style={{ textAlign: wide ? "left" : "center" }}>
      {lines.map((l, i) => (
        <div key={i} style={{
          fontFamily: font, fontWeight: 900, fontSize: hSize, lineHeight: 1.02, letterSpacing: "-0.01em",
          textTransform: "uppercase", color: i === lines.length - 1 && lines.length > 1 ? accent : tc,
          textShadow: "0 3px 14px rgba(0,0,0,0.3)",
        }}>{l}</div>
      ))}
      {subheadline && (
        <div style={{ fontFamily: font, fontSize: 17 * sc * (wide ? 0.95 : 1), fontWeight: 600, marginTop: 10 * sc, color: tc, opacity: 0.85 }}>{subheadline}</div>
      )}
    </div>
  );

  const scan = (
    <div style={{ display: "flex", alignItems: "center", gap: 16 * sc, flexDirection: "row" }}>
      <QrCard size={qrSize} qrDataUrl={qrDataUrl} look={look} sc={sc} />
      <div style={{ display: "flex", flexDirection: "column", gap: 9 * sc, alignItems: "flex-start" }}>
        <div style={{
          background: accent, color: textOn(accent), fontFamily: font, fontWeight: 800, fontSize: 14 * sc,
          letterSpacing: 1.5 * sc, textTransform: "uppercase", padding: `${10 * sc}px ${18 * sc}px`, borderRadius: btnRadius > 30 ? 999 : btnRadius * sc,
          boxShadow: `0 ${5 * sc}px 0 ${shade(accent, -0.28)}, 0 ${10 * sc}px ${20 * sc}px rgba(0,0,0,0.3)`,
        }}>{customText || "Scannez pour jouer"}</div>
        <div style={{ fontFamily: font, fontSize: 12 * sc, color: tc, opacity: 0.8, lineHeight: 1.4, maxWidth: 190 * sc }}>
          Ouvrez l&apos;appareil photo de votre téléphone et visez le code.
        </div>
      </div>
    </div>
  );

  const legal = (
    <div style={{ textAlign: "center", fontFamily: font, fontSize: 9.5 * sc, color: tc, opacity: 0.6, lineHeight: 1.5 }}>
      Jeu gratuit sans obligation d&apos;achat. Aucun avis n&apos;est demandé ni récompensé pour participer.
      {!hideBranding && <> · Propulsé par VisiumBoost</>}
    </div>
  );

  return (
    <div style={{
      width: W, height: H, boxSizing: "border-box", position: "relative", overflow: "hidden",
      ...pageBackground(look), fontFamily: font,
      padding: `${34 * sc}px ${34 * sc}px ${24 * sc}px`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* liseré de cadre */}
      <div style={{ position: "absolute", inset: 14 * sc, border: `${1.5 * sc}px solid ${tc}`, opacity: 0.18, borderRadius: 14 * sc, pointerEvents: "none" }} />

      {wide ? (
        <>
          {brand}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26 * sc, width: "100%" }}>
            <PosterWheel size={wheelSize} look={look} />
            <div style={{ display: "flex", flexDirection: "column", gap: 22 * sc, alignItems: "flex-start", flex: 1 }}>
              {title}
              <div style={{ display: "flex", alignItems: "center", gap: 12 * sc }}>
                <QrCard size={qrSize} qrDataUrl={qrDataUrl} look={look} sc={sc} />
                <div style={{
                  background: accent, color: textOn(accent), fontFamily: font, fontWeight: 800, fontSize: 12 * sc, letterSpacing: 1.2 * sc,
                  textTransform: "uppercase", padding: `${9 * sc}px ${14 * sc}px`, borderRadius: btnRadius > 30 ? 999 : btnRadius * sc,
                  boxShadow: `0 ${4 * sc}px 0 ${shade(accent, -0.28)}`, maxWidth: 130 * sc, textAlign: "center",
                }}>{customText || "Scannez pour jouer"}</div>
              </div>
            </div>
          </div>
          {legal}
        </>
      ) : (
        <>
          {brand}
          {title}
          <PosterWheel size={wheelSize} look={look} />
          {scan}
          {legal}
        </>
      )}
    </div>
  );
}
