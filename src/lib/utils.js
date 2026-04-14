// ─── Trial / access helpers ──────────────────────────────────────────

/**
 * Returns true if the user has active access (trial or paid plan).
 * Admins always have access.
 */
export function isAccessAllowed(user) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.plan === "starter" || user.plan === "pro") return true;
  // free plan: check trial
  if (user.trialEndsAt && new Date(user.trialEndsAt) > new Date()) return true;
  return false;
}

/**
 * Returns days remaining in trial (0 if expired or no trial).
 */
export function trialDaysLeft(user) {
  if (!user?.trialEndsAt) return 0;
  const diff = new Date(user.trialEndsAt) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

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
