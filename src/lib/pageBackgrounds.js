// Fonds de page (couleur, dégradé, motif) et univers métier prêts à l'emploi.
// Partagé entre l'éditeur du dashboard et la page publique /s/[slug].

function lum(hex) {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length < 6) return 0;
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return 0;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

// Motifs : tuiles SVG teintées automatiquement (clair sur fond sombre, sombre sur fond clair)
export const PATTERNS = [
  { id: "dots", label: "Points", size: 24, alpha: 0.09, svg: (c) => svg(24, 24, `<circle cx="12" cy="12" r="1.7" fill="${c}"/>`) },
  { id: "grid", label: "Grille", size: 32, alpha: 0.07, svg: (c) => svg(32, 32, `<path d="M32 0H0V32" fill="none" stroke="${c}" stroke-width="1"/>`) },
  { id: "diagonal", label: "Rayures", size: 16, alpha: 0.07, svg: (c) => svg(16, 16, `<path d="M-2 2l4-4M0 16L16 0M14 18l4-4" stroke="${c}" stroke-width="1.6"/>`) },
  { id: "waves", label: "Vagues", size: 48, alpha: 0.09, svg: (c) => svg(48, 16, `<path d="M0 8Q12 0 24 8T48 8" fill="none" stroke="${c}" stroke-width="1.4"/>`) },
  { id: "checker", label: "Damier", size: 48, alpha: 0.05, svg: (c) => svg(48, 48, `<rect width="24" height="24" fill="${c}"/><rect x="24" y="24" width="24" height="24" fill="${c}"/>`) },
  { id: "stars", label: "Étoiles", size: 56, alpha: 0.1, svg: (c) => svg(56, 56, `<path d="M14 7l1.7 4.6L20.5 13.3l-4.8 1.7L14 19.6l-1.7-4.6L7.5 13.3l4.8-1.7z" fill="${c}"/><circle cx="42" cy="42" r="1.6" fill="${c}"/>`) },
  { id: "rings", label: "Anneaux", size: 40, alpha: 0.08, svg: (c) => svg(40, 40, `<circle cx="20" cy="20" r="9" fill="none" stroke="${c}" stroke-width="1.2"/>`) },
  { id: "chevron", label: "Chevrons", size: 40, alpha: 0.07, svg: (c) => svg(40, 20, `<path d="M0 15L20 5l20 10" fill="none" stroke="${c}" stroke-width="1.6"/>`) },
];

export const DARK_BASES = ["#0F0F1A", "#111827", "#0B1F1A", "#1A0A0C", "#1C1410", "#0B1A2E", "#1E1033", "#161616"];

export function patternStyle(base, patternId) {
  const p = PATTERNS.find((x) => x.id === patternId) || PATTERNS[0];
  const ink = lum(base) > 0.5 ? "0,0,0" : "255,255,255";
  const tile = encodeURIComponent(p.svg(`rgba(${ink},${p.alpha})`));
  return {
    backgroundColor: base,
    backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(${ink},0.08), transparent 65%), url("data:image/svg+xml,${tile}")`,
    backgroundSize: `auto, ${p.size}px ${p.size / (p.id === "waves" ? 3 : p.id === "chevron" ? 2 : 1)}px`,
  };
}

// Style CSS du fond de page selon le thème de l'entreprise
export function buildPageBg(th, pc, sc) {
  if (th.bgType === "pattern" && th.bg) return patternStyle(th.bg, th.bgPattern);
  if (th.bgType === "gradient" && th.bgGradient) return { background: th.bgGradient };
  if (th.bg && th.bg !== "#ffffff") return { background: th.bg };
  return { background: `linear-gradient(160deg, ${pc}12 0%, ${sc}08 50%, #F8FAFC 100%)` };
}

function look(o) {
  return {
    wheelSize: 360, ringWidth: 14, btnText: "", btnRadius: 12, bgType: "pattern", bgGradient: "",
    bulbs: false, bulbColor: "#FFF1C1", ...o,
  };
}

// Univers métier : fond + roue + couleurs + textes harmonisés
export const SECTOR_LOOKS = [
  look({
    id: "restaurant", name: "Restaurant", desc: "Bistrot chaleureux, bois et or",
    palette: ["#B5472F", "#E8B04B", "#6B8E4E", "#8C2F1B", "#D9822B", "#4F6B3A", "#C65D3B", "#F0C987"],
    primaryColor: "#B5472F", secondaryColor: "#E8B04B",
    wheelBorderColor: "#C99A4B", wheelCenterColor: "#FFF4DC", dividerColor: "#F3E3C3", pointerColor: "#E8B04B",
    ringWidth: 16, bulbs: true, wheelFont: "Playfair Display",
    bg: "#1E1511", bgPattern: "dots", textColor: "#F8EBD7", btnColor: "#E8B04B", btnRadius: 10,
    title: "Un petit cadeau pour la table ?", welcome: "Tournez la roue et régalez-vous d'une attention de la maison.",
    thanks: "Bon appétit ! Votre cadeau vous attend.", cardColor: "rgba(255,255,255,0.07)",
  }),
  look({
    id: "pizzeria", name: "Pizzeria", desc: "Rouge, vert & crème à l'italienne",
    palette: ["#D62828", "#2D6A4F", "#F7E7C6", "#B71C1C", "#40916C", "#E9C46A", "#9D0208", "#1B4332"],
    primaryColor: "#D62828", secondaryColor: "#2D6A4F",
    wheelBorderColor: "#F7E7C6", wheelCenterColor: "#FFF8E7", dividerColor: "#FFF8E7", pointerColor: "#D62828",
    ringWidth: 18, bulbs: true, bulbColor: "#FFF3B0", wheelFont: "Nunito",
    bg: "#2A0E0C", bgPattern: "checker", textColor: "#FFF4DD", btnColor: "#F4C430", btnRadius: 999,
    title: "Mamma mia, tentez votre chance !", welcome: "Tournez la roue et gagnez un petit plus pour votre prochaine pizza.",
    thanks: "Buon appetito ! Votre cadeau vous attend.", cardColor: "rgba(255,255,255,0.08)",
  }),
  look({
    id: "garage", name: "Garage auto", desc: "Acier, orange et chevrons",
    palette: ["#FF6B00", "#2B2F36", "#FFB100", "#454B54", "#E85D04", "#1F2328", "#FF8C1A", "#6B7280"],
    primaryColor: "#FF6B00", secondaryColor: "#2B2F36",
    wheelBorderColor: "#9CA3AF", wheelCenterColor: "#F3F4F6", dividerColor: "#111827", pointerColor: "#FF6B00",
    ringWidth: 16, wheelFont: "Space Grotesk",
    bg: "#121417", bgPattern: "chevron", textColor: "#F3F4F6", btnColor: "#FF6B00", btnRadius: 6,
    title: "Un coup de pouce pour votre auto", welcome: "Tournez la roue et profitez d'un avantage sur votre prochaine visite.",
    thanks: "Parfait ! Présentez ce code à l'atelier.", cardColor: "rgba(255,255,255,0.06)",
  }),
  look({
    id: "boulangerie", name: "Boulangerie", desc: "Crème, blé et croûte dorée",
    palette: ["#C98B4B", "#F2C78B", "#8B5A2B", "#E9A857", "#A9703A", "#F6DDB4", "#7A4B1E", "#DDA15E"],
    primaryColor: "#8B5A2B", secondaryColor: "#E9A857",
    wheelBorderColor: "#8B5A2B", wheelCenterColor: "#FFF8EB", dividerColor: "#FFF4E0", pointerColor: "#8B5A2B",
    ringWidth: 14, wheelFont: "Playfair Display",
    bg: "#FFF4E0", bgPattern: "dots", textColor: "#4A2C12", btnColor: "#8B5A2B", btnRadius: 14,
    title: "Une petite gourmandise ?", welcome: "Tournez la roue, c'est tout chaud, tout frais et offert.",
    thanks: "Miam ! Votre cadeau vous attend au comptoir.", cardColor: "rgba(139,90,43,0.08)",
  }),
  look({
    id: "barbier", name: "Coiffeur / Barbier", desc: "Noir, or et rayures de barbier",
    palette: ["#C9A24A", "#1F1F1F", "#E6E6E6", "#8A1C2B", "#2E3A59", "#B9B9B9", "#3A3A3A", "#D4AF37"],
    primaryColor: "#C9A24A", secondaryColor: "#8A1C2B",
    wheelBorderColor: "#C9A24A", wheelCenterColor: "#FAFAFA", dividerColor: "#0F0F0F", pointerColor: "#C9A24A",
    ringWidth: 16, bulbs: true, wheelFont: "Playfair Display",
    bg: "#141414", bgPattern: "diagonal", textColor: "#F5F5F5", btnColor: "#C9A24A", btnRadius: 6,
    title: "Un style, un cadeau", welcome: "Tournez la roue et gagnez un avantage pour votre prochaine coupe.",
    thanks: "Classe ! Présentez ce code au salon.", cardColor: "rgba(255,255,255,0.07)",
  }),
  look({
    id: "cafe", name: "Café / Bar", desc: "Tons café, anneaux de tasse",
    palette: ["#6F4E37", "#C8A27A", "#3E2A1D", "#A47551", "#D9B99B", "#4B3221", "#8B5E3C", "#E6CCB2"],
    primaryColor: "#A47551", secondaryColor: "#C8A27A",
    wheelBorderColor: "#C8A27A", wheelCenterColor: "#FBF3E8", dividerColor: "#F3E4D0", pointerColor: "#E6CCB2",
    ringWidth: 14, wheelFont: "DM Sans",
    bg: "#17110D", bgPattern: "rings", textColor: "#F3E4D0", btnColor: "#C8A27A", btnRadius: 12,
    title: "La tournée est pour nous !", welcome: "Tournez la roue et gagnez une attention de la maison.",
    thanks: "Santé ! Votre cadeau vous attend au bar.", cardColor: "rgba(255,255,255,0.07)",
  }),
  look({
    id: "fastfood", name: "Kebab / Fast-food", desc: "Rouge et jaune, énergie maximale",
    palette: ["#FFC107", "#E53935", "#FF7043", "#FFB300", "#C62828", "#FFA000", "#EF5350", "#FFD54F"],
    primaryColor: "#E53935", secondaryColor: "#FFC107",
    wheelBorderColor: "#FFC107", wheelCenterColor: "#FFFFFF", dividerColor: "#FFFFFF", pointerColor: "#E53935",
    ringWidth: 16, bulbs: true, bulbColor: "#FFFFFF", wheelFont: "Nunito",
    bg: "#B91C1C", bgPattern: "stars", textColor: "#FFFFFF", btnColor: "#FFC107", btnRadius: 999,
    title: "Un petit bonus pour vous !", welcome: "Tournez la roue et gagnez un extra pour votre prochaine commande.",
    thanks: "Bien joué ! Votre cadeau vous attend.", cardColor: "rgba(0,0,0,0.18)",
  }),
  look({
    id: "spa", name: "Spa / Beauté", desc: "Nude, doux et apaisant",
    palette: ["#C9A9A6", "#E8D5C4", "#A68A64", "#D8B4A0", "#8E7F6A", "#F1E3D3", "#B08968", "#DDBEA9"],
    primaryColor: "#A68A64", secondaryColor: "#C9A9A6",
    wheelBorderColor: "#B08968", wheelCenterColor: "#FFFFFF", dividerColor: "#FBF5EF", pointerColor: "#A68A64",
    ringWidth: 14, wheelFont: "Playfair Display",
    bg: "#F6EFEA", bgPattern: "waves", textColor: "#4A3B35", btnColor: "#A68A64", btnRadius: 999,
    title: "Un moment rien que pour vous", welcome: "Tournez la roue et offrez-vous une attention bien-être.",
    thanks: "Merci ! Votre attention vous attend à l'accueil.", cardColor: "rgba(166,138,100,0.1)",
  }),
  look({
    id: "sport", name: "Salle de sport", desc: "Noir et vert flash, grille tech",
    palette: ["#C6FF00", "#1F2937", "#00E5FF", "#374151", "#76FF03", "#111827", "#18FFFF", "#4B5563"],
    primaryColor: "#C6FF00", secondaryColor: "#00E5FF",
    wheelBorderColor: "#1F2937", wheelCenterColor: "#0B0F14", dividerColor: "#0B0F14", pointerColor: "#C6FF00",
    ringWidth: 16, bulbs: true, bulbColor: "#C6FF00", wheelFont: "Space Grotesk",
    bg: "#0B0F14", bgPattern: "grid", textColor: "#FFFFFF", btnColor: "#C6FF00", btnRadius: 8,
    title: "Un bonus pour vos objectifs", welcome: "Tournez la roue et gagnez un avantage fitness.",
    thanks: "Bravo champion ! Votre cadeau vous attend.", cardColor: "rgba(255,255,255,0.06)",
  }),
  look({
    id: "fleuriste", name: "Fleuriste", desc: "Rose poudré et vert tendre",
    palette: ["#F4A6C0", "#8FBF9F", "#F7D6E0", "#6A994E", "#E56B9B", "#B7E4C7", "#D88AA8", "#A7C957"],
    primaryColor: "#E56B9B", secondaryColor: "#6A994E",
    wheelBorderColor: "#FFFFFF", wheelCenterColor: "#FFFFFF", dividerColor: "#FFFFFF", pointerColor: "#E56B9B",
    ringWidth: 16, bulbs: true, bulbColor: "#FFFFFF", wheelFont: "Nunito",
    bg: "#FDF2F8", bgPattern: "stars", textColor: "#5A2A3E", btnColor: "#E56B9B", btnRadius: 999,
    title: "Une jolie surprise vous attend", welcome: "Tournez la roue et repartez avec une attention fleurie.",
    thanks: "Merci ! Votre cadeau vous attend en boutique.", cardColor: "#FFFFFF",
  }),
];
