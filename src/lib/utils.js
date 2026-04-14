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

// ─── Default wheel config (empty — no fake rewards) ─────────────────
export const DEFAULT_WHEEL_CONFIG = {
  googleLink: "",
  primaryColor: "#3B82F6",
  secondaryColor: "#0EA5E9",
  ctaText: "Laissez-nous un avis et tentez votre chance !",
  rewards: [],
};
