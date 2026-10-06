// Plans d'abonnement : prix, limites et permissions.
// Source unique de vérité, utilisée côté client (UI) ET côté serveur (API, pages publiques).
//
// Les identifiants restent "free" / "starter" / "pro" pour rester compatibles avec la base :
// "free" correspond à l'offre Essentiel (ou à la période d'essai tant qu'il n'y a pas d'abonnement).

export const PLAN_ORDER = ["free", "starter", "pro"];

export const PLANS = {
  free: {
    id: "free",
    name: "Essentiel",
    price: 19.9,
    priceLabel: "19,90 €",
    desc: "Une roue simple, prête en 5 minutes",
    establishments: 1,
    caps: {
      customization: "basic", // couleurs uniquement
      stats: false,
      avis: false,
      affiches: false,
      googleLink: false,
      collect: false,
      whiteLabel: false,
      syncDesign: false,
    },
    features: [
      "1 établissement, 1 roue",
      "Couleurs de la roue personnalisables",
      "Récompenses et probabilités",
      "Codes anti-fraude et validation",
      "Support email",
    ],
    missing: ["Statistiques", "Lien d'avis Google", "Affiches QR", "Thèmes et personnalisation avancée"],
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 29.99,
    priceLabel: "29,99 €",
    desc: "Tout pour faire grandir vos avis",
    establishments: 3,
    caps: {
      customization: "full",
      stats: true,
      avis: true,
      affiches: true,
      googleLink: true,
      collect: true,
      whiteLabel: false,
      syncDesign: false,
    },
    features: [
      "3 établissements",
      "Personnalisation complète : thèmes, fonds, logo, 3D",
      "Statistiques détaillées",
      "Lien d'avis Google et suivi des avis",
      "Affiches QR prêtes à imprimer",
      "Collecte des coordonnées clients",
      "Support prioritaire",
    ],
    recommended: true,
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 69.99,
    priceLabel: "69,99 €",
    desc: "Pour les franchises et les réseaux",
    establishments: Infinity,
    caps: {
      customization: "full",
      stats: true,
      avis: true,
      affiches: true,
      googleLink: true,
      collect: true,
      whiteLabel: true,
      syncDesign: true,
    },
    features: [
      "Tout Starter, sans limite d'établissements",
      "Un seul design appliqué à tous vos sites en un clic",
      "Marque blanche : aucune mention VisiumBoost",
      "Statistiques consolidées de tous les sites",
      "Support dédié",
    ],
  },
};

// Plan minimum requis pour chaque fonctionnalité
export const FEATURE_MIN_PLAN = {
  customization: "starter",
  stats: "starter",
  avis: "starter",
  affiches: "starter",
  googleLink: "starter",
  collect: "starter",
  whiteLabel: "pro",
  syncDesign: "pro",
};

export const FEATURE_LABELS = {
  customization: "La personnalisation avancée",
  stats: "Les statistiques",
  avis: "Le suivi des avis Google",
  affiches: "Les affiches QR",
  googleLink: "Le lien d'avis Google",
  collect: "La collecte des coordonnées",
  whiteLabel: "La marque blanche",
  syncDesign: "L'application du design à tous les sites",
};

// Plan réellement appliqué : l'admin et l'essai gratuit donnent accès à tout
export function effectivePlan(user) {
  if (!user) return "free";
  if (user.role === "admin") return "pro";
  if (user.plan === "starter" || user.plan === "pro") return user.plan;
  const subscribed = !!user.stripeSubscriptionId;
  const inTrial = user.trialEndsAt && new Date(user.trialEndsAt) > new Date();
  if (!subscribed && inTrial) return "pro";
  return "free";
}

export function planFor(user) {
  return PLANS[effectivePlan(user)];
}

export function capsFor(user) {
  return planFor(user).caps;
}

export function establishmentLimit(user) {
  return planFor(user).establishments;
}

// Champs de personnalisation réservés aux plans "full"
const CUSTOM_FIELDS = [
  "theme", "logo",
  "wheel_segment_colors", "wheel_border_color", "wheel_center_color",
  "wheel_center_logo", "wheel_font", "wheel_size",
  "page_bg", "page_bg_type", "page_bg_gradient", "page_banner",
  "page_title", "page_welcome", "page_btn_color", "page_btn_text",
  "page_thanks", "page_text_color",
];

// Retire d'une mise à jour tout ce que le plan n'autorise pas (côté API)
export function stripLockedFields(updates, caps) {
  const out = { ...updates };
  if (caps.customization !== "full") CUSTOM_FIELDS.forEach((f) => delete out[f]);
  if (!caps.googleLink) delete out.lien_avis;
  return out;
}

// Neutralise ce que le plan n'autorise pas avant d'afficher la page publique
export function gateEntreprise(data, caps) {
  const out = { ...data, hideBranding: !!caps.whiteLabel };
  if (caps.customization !== "full") {
    out.theme = {};
    out.logo = "";
    for (const f of CUSTOM_FIELDS) {
      if (f === "theme" || f === "logo") continue;
      out[f] = f === "wheel_segment_colors" ? [] : f === "wheel_size" ? 0 : "";
    }
  } else if (out.theme && !caps.collect) {
    out.theme = { ...out.theme, collectFields: { prenom: false, email: false, telephone: false } };
  }
  if (!caps.googleLink) {
    out.lien_avis = "";
    if (out.theme) out.theme = { ...out.theme, requireReview: false };
  }
  return out;
}
