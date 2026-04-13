// ─── Generate unique anti-fraud code ────────────────────────────────
export function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code.slice(0, 4) + "-" + code.slice(4);
}

// ─── Generate unique ID ─────────────────────────────────────────────
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── Format number with separators ──────────────────────────────────
export function formatNum(n) {
  return new Intl.NumberFormat("fr-FR").format(n);
}

// ─── Chart mock data ────────────────────────────────────────────────
export const CHART_DATA_WEEK = [
  { name: "Lun", scans: 45, avis: 32, codes: 12 },
  { name: "Mar", scans: 62, avis: 45, codes: 18 },
  { name: "Mer", scans: 38, avis: 28, codes: 10 },
  { name: "Jeu", scans: 75, avis: 55, codes: 22 },
  { name: "Ven", scans: 90, avis: 68, codes: 30 },
  { name: "Sam", scans: 110, avis: 82, codes: 38 },
  { name: "Dim", scans: 85, avis: 60, codes: 25 },
];

export const CHART_DATA_MONTH = [
  { name: "S1", scans: 320, avis: 240, codes: 85 },
  { name: "S2", scans: 410, avis: 305, codes: 110 },
  { name: "S3", scans: 380, avis: 290, codes: 95 },
  { name: "S4", scans: 505, avis: 370, codes: 155 },
];

// ─── Default wheel config ───────────────────────────────────────────
export const DEFAULT_WHEEL_CONFIG = {
  googleLink: "",
  socials: [],
  primaryColor: "#6C5CE7",
  secondaryColor: "#00B894",
  ctaText: "Laissez-nous un avis et tentez votre chance !",
  logoUrl: "",
  rewards: [
    { id: "r1", name: "10% de réduction", prob: 40 },
    { id: "r2", name: "Dessert offert", prob: 25 },
    { id: "r3", name: "Café gratuit", prob: 20 },
    { id: "r4", name: "1 mois gratuit", prob: 5 },
    { id: "r5", name: "Tentez encore", prob: 10 },
  ],
};

// ─── Default clients ────────────────────────────────────────────────
export const DEFAULT_CLIENTS = [
  { id: "c1", name: "Restaurant Le Gourmet", link: "https://g.page/r/legourmet", scans: 234, avis: 187, createdAt: "2025-01-15" },
  { id: "c2", name: "Café de la Paix", link: "https://g.page/r/cafedelapaix", scans: 156, avis: 102, createdAt: "2025-02-20" },
  { id: "c3", name: "Salon Beauté Divine", link: "https://g.page/r/beautedivine", scans: 89, avis: 67, createdAt: "2025-03-10" },
];

// ─── Generate initial codes ─────────────────────────────────────────
export function generateInitialCodes(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    id: uid(),
    code: generateCode(),
    used: i < 8,
    createdAt: "2025-04-01",
    usedAt: i < 8 ? "2025-04-05" : null,
  }));
}
