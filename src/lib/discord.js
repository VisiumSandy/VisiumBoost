/**
 * Discord webhook logger for VisiumBoost.
 * Set DISCORD_WEBHOOK_URL in your environment variables.
 * Never throws — all errors are silently logged to console.
 */

// Read at call time — not at module load — so Vercel env vars are always fresh
function getWebhookUrl() {
  return process.env.DISCORD_WEBHOOK_URL || null;
}

// ── Colour palette (Discord embed colours) ────────────────────────────────────
export const Colors = {
  green:  0x10B981, // success / new user / payment
  blue:   0x3B82F6, // info / spin / code validated
  yellow: 0xF59E0B, // warning / trial ending / rate limit hit
  red:    0xEF4444, // error / payment failed / security
  purple: 0x8B5CF6, // admin action
  gray:   0x64748B, // misc
};

/**
 * Send a raw embed to Discord.
 * @param {{ title, description, color, fields, footer }} embed
 */
export async function discordLog(embed) {
  const url = getWebhookUrl();
  if (!url) {
    console.warn("[discord] DISCORD_WEBHOOK_URL not set — skipping log");
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "VisiumBoost",
        avatar_url: "https://visium-boost.fr/favicon.ico",
        embeds: [
          {
            ...embed,
            timestamp: new Date().toISOString(),
            footer: embed.footer || { text: "VisiumBoost · visium-boost.fr" },
          },
        ],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[discord] Webhook error ${res.status}:`, text);
    }
  } catch (err) {
    console.error("[discord] Failed to send log:", err);
  }
}

// ── Pre-built log helpers ─────────────────────────────────────────────────────

/** New user registered */
export function logNewUser({ name, email, plan = "free" }) {
  return discordLog({
    title: "Nouvel utilisateur",
    color: Colors.green,
    fields: [
      { name: "Nom",   value: name,  inline: true },
      { name: "Email", value: email, inline: true },
      { name: "Plan",  value: plan,  inline: true },
    ],
  });
}

/** User logged in */
export function logLogin({ name, email, role }) {
  return discordLog({
    title: role === "admin" ? "Connexion admin" : "Connexion utilisateur",
    color: role === "admin" ? Colors.purple : Colors.gray,
    fields: [
      { name: "Nom",   value: name,  inline: true },
      { name: "Email", value: email, inline: true },
      { name: "Rôle",  value: role,  inline: true },
    ],
  });
}

/** Stripe subscription / payment */
export function logPayment({ event, email, plan, amount }) {
  const titles = {
    new:     "Nouveau paiement",
    updated: "Abonnement mis à jour",
    deleted: "Abonnement annulé",
    failed:  "Paiement échoué",
  };
  const colors = {
    new:     Colors.green,
    updated: Colors.blue,
    deleted: Colors.yellow,
    failed:  Colors.red,
  };
  const fields = [
    { name: "Email", value: email || "—", inline: true },
    { name: "Plan",  value: plan  || "—", inline: true },
  ];
  if (amount) fields.push({ name: "Montant", value: `${(amount / 100).toFixed(2)} €`, inline: true });

  return discordLog({
    title: titles[event] || "Événement Stripe",
    color: colors[event] || Colors.gray,
    fields,
  });
}

/** New spin on a wheel */
export function logSpin({ nom, slug, rewardName, winCode, clientName, clientEmail, clientPhone }) {
  const clientParts = [clientName, clientEmail, clientPhone].filter(Boolean);
  const clientValue = clientParts.length > 0 ? clientParts.join(" · ") : "Anonyme";
  return discordLog({
    title: "Roue tournée",
    color: Colors.blue,
    fields: [
      { name: "Établissement", value: `${nom} \`/${slug}\``, inline: false },
      { name: "Récompense gagnée", value: rewardName, inline: true },
      { name: "Code généré",   value: `\`${winCode}\``,     inline: true },
      { name: "Client",        value: clientValue,           inline: false },
    ],
  });
}

/** Code validated by merchant */
export function logCodeValidated({ code, businessName }) {
  return discordLog({
    title: "Code validé",
    color: Colors.green,
    fields: [
      { name: "Code",          value: `\`${code}\``, inline: true },
      { name: "Établissement", value: businessName,  inline: true },
    ],
  });
}

/** Rate limit hit */
export function logRateLimit({ route, ip }) {
  return discordLog({
    title: "Rate limit déclenché",
    color: Colors.yellow,
    fields: [
      { name: "Route", value: route, inline: true },
      { name: "IP",    value: ip,    inline: true },
    ],
  });
}

/** Security event (e.g. failed login, invalid code attempts) */
export function logSecurityEvent({ event, detail, ip }) {
  return discordLog({
    title: `Alerte sécurité — ${event}`,
    color: Colors.red,
    fields: [
      { name: "Détail", value: detail, inline: false },
      { name: "IP",     value: ip || "—", inline: true },
    ],
  });
}

/** Server error (500) */
export function logServerError({ route, message }) {
  return discordLog({
    title: "Erreur serveur",
    color: Colors.red,
    description: `**Route :** \`${route}\`\n\`\`\`${String(message).slice(0, 500)}\`\`\``,
  });
}

/** Admin action */
export function logAdminAction({ admin, action, target }) {
  return discordLog({
    title: "Action admin",
    color: Colors.purple,
    fields: [
      { name: "Admin",  value: admin,  inline: true },
      { name: "Action", value: action, inline: true },
      { name: "Cible",  value: target, inline: true },
    ],
  });
}
