import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "VisiumBoost <noreply@visium-boost.fr>";

/**
 * Generic send helper — wraps Resend, never throws (logs on failure).
 */
export async function sendEmail({ to, subject, html }) {
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) console.error("[email] Resend error:", error);
  } catch (err) {
    console.error("[email] Failed to send email:", err);
  }
}

// ── Templates ─────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail({ to, name }) {
  const html = `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#0F172A;padding:32px 40px;text-align:center;">
        <h1 style="color:#F1F5F9;font-size:26px;margin:0;font-weight:800;letter-spacing:-0.5px;">VisiumBoost</h1>
        <p style="color:#60A5FA;margin:8px 0 0;font-size:14px;">Boostez vos avis Google</p>
      </div>
      <div style="padding:40px;">
        <h2 style="color:#0F172A;font-size:20px;font-weight:700;margin:0 0 12px;">Bienvenue, ${name} !</h2>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Votre compte VisiumBoost est prêt. Vous bénéficiez d'un essai gratuit de <strong>14 jours</strong> sur le plan Pro.
        </p>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
          Commencez par configurer votre roue de la fortune, ajoutez vos récompenses, et partagez votre lien avec vos clients.
        </p>
        <a href="https://visium-boost.fr/dashboard" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;">
          Accéder à mon tableau de bord →
        </a>
        <p style="color:#94A3B8;font-size:12px;margin:32px 0 0;line-height:1.6;">
          Une question ? Contactez-nous à <a href="mailto:contact@visium-boost.fr" style="color:#2563EB;">contact@visium-boost.fr</a>
        </p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: "Bienvenue sur VisiumBoost 🎉", html });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const html = `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#0F172A;padding:32px 40px;text-align:center;">
        <h1 style="color:#F1F5F9;font-size:26px;margin:0;font-weight:800;letter-spacing:-0.5px;">VisiumBoost</h1>
        <p style="color:#60A5FA;margin:8px 0 0;font-size:14px;">Réinitialisation du mot de passe</p>
      </div>
      <div style="padding:40px;">
        <h2 style="color:#0F172A;font-size:20px;font-weight:700;margin:0 0 12px;">Réinitialisez votre mot de passe</h2>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Bonjour ${name},<br/>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en définir un nouveau.
        </p>
        <p style="color:#94A3B8;font-size:13px;margin:0 0 24px;">
          Ce lien expirera dans <strong style="color:#475569;">1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez cet email.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;">
          Réinitialiser mon mot de passe →
        </a>
        <p style="color:#94A3B8;font-size:12px;margin:32px 0 0;line-height:1.6;">
          Ou copiez ce lien dans votre navigateur :<br/>
          <span style="color:#2563EB;word-break:break-all;">${resetUrl}</span>
        </p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: "Réinitialisation de votre mot de passe VisiumBoost", html });
}

export async function sendCodeValidatedEmail({ to, businessName, code }) {
  const html = `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#0F172A;padding:32px 40px;text-align:center;">
        <h1 style="color:#F1F5F9;font-size:26px;margin:0;font-weight:800;letter-spacing:-0.5px;">VisiumBoost</h1>
        <p style="color:#10B981;margin:8px 0 0;font-size:14px;">Code validé ✓</p>
      </div>
      <div style="padding:40px;">
        <h2 style="color:#0F172A;font-size:20px;font-weight:700;margin:0 0 12px;">Un client vient de valider un code !</h2>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Un nouveau code a été validé pour <strong>${businessName}</strong>.
        </p>
        <div style="background:#F0FDF4;border:1.5px solid #BBF7D0;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
          <p style="margin:0;font-size:13px;color:#166534;font-weight:600;">Code validé</p>
          <p style="margin:6px 0 0;font-size:22px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#15803D;letter-spacing:2px;">${code}</p>
        </div>
        <a href="https://visium-boost.fr/dashboard" style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;">
          Voir mon tableau de bord →
        </a>
        <p style="color:#94A3B8;font-size:12px;margin:32px 0 0;line-height:1.6;">
          Gérez vos codes dans la section <strong>Codes</strong> de votre tableau de bord.
        </p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: `Code validé — ${businessName}`, html });
}

export async function sendVerificationCodeEmail({ to, name, code, action }) {
  const isEmail = action === "change_email";
  const subject = isEmail ? "Code de vérification — changement d'email" : "Code de vérification — changement de mot de passe";
  const title   = isEmail ? "Confirmez votre nouvel email" : "Confirmez le changement de mot de passe";
  const desc    = isEmail
    ? "Vous avez demandé à changer l'adresse email de votre compte VisiumBoost."
    : "Vous avez demandé à modifier le mot de passe de votre compte VisiumBoost.";

  const html = `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#0F172A;padding:32px 40px;text-align:center;">
        <h1 style="color:#F1F5F9;font-size:26px;margin:0;font-weight:800;letter-spacing:-0.5px;">VisiumBoost</h1>
        <p style="color:#60A5FA;margin:8px 0 0;font-size:14px;">Vérification du compte</p>
      </div>
      <div style="padding:40px;">
        <h2 style="color:#0F172A;font-size:20px;font-weight:700;margin:0 0 12px;">${title}</h2>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 8px;">
          Bonjour ${name},
        </p>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
          ${desc}<br/>Entrez le code ci-dessous pour confirmer.
        </p>
        <div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:14px;padding:24px;text-align:center;margin:0 0 24px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:1px;">Votre code de vérification</p>
          <p style="margin:0;font-size:38px;font-weight:900;color:#1D4ED8;letter-spacing:10px;font-family:'JetBrains Mono',monospace;">${code}</p>
          <p style="margin:10px 0 0;font-size:12px;color:#94A3B8;">Valable 10 minutes</p>
        </div>
        <p style="color:#94A3B8;font-size:13px;line-height:1.6;margin:0;">
          Si vous n'avez pas fait cette demande, ignorez cet email — votre compte est en sécurité.
        </p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject, html });
}

export async function sendMonthlyReportEmail({ to, name, month, spins, validated, scans, conversionRate }) {
  const encouragement = spins >= 20
    ? "Continuez comme ça, vous êtes sur la bonne lancée !"
    : "Le mois prochain sera encore meilleur — pensez à afficher l'affiche QR bien en vue !";

  const kpis = [
    { label: "Roues tournées", value: spins,           color: "#3B82F6" },
    { label: "Codes validés",  value: validated,        color: "#10B981" },
    { label: "Scans de page",  value: scans,            color: "#0EA5E9" },
    { label: "Taux de retrait", value: `${conversionRate}%`, color: "#F59E0B" },
  ];

  const kpiHtml = kpis.map(k => `
    <div style="flex:1;min-width:120px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;text-align:center;">
      <div style="font-size:24px;font-weight:800;color:${k.color};margin-bottom:4px;">${k.value}</div>
      <div style="font-size:12px;color:#64748B;font-weight:500;">${k.label}</div>
    </div>
  `).join("");

  const html = `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:linear-gradient(135deg,#0F172A,#1E3A5F);padding:36px 40px;text-align:center;">
        <h1 style="color:#F1F5F9;font-size:22px;margin:0 0 6px;font-weight:800;letter-spacing:-0.5px;">VisiumBoost</h1>
        <p style="color:#60A5FA;margin:0;font-size:14px;font-weight:600;">Rapport mensuel — ${month}</p>
      </div>
      <div style="padding:36px 40px;">
        <h2 style="color:#0F172A;font-size:18px;font-weight:700;margin:0 0 6px;">Bonjour ${name} 👋</h2>
        <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px;">
          Voici le bilan de votre activité sur VisiumBoost pour le mois de <strong>${month}</strong>.
        </p>

        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:28px;">
          ${kpiHtml}
        </div>

        <div style="background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
          <p style="margin:0;font-size:14px;color:#1E40AF;font-weight:600;">💡 ${encouragement}</p>
        </div>

        <a href="https://visium-boost.fr/dashboard" style="display:inline-block;background:linear-gradient(135deg,#2563EB,#0EA5E9);color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;">
          Voir mon tableau de bord →
        </a>
        <p style="color:#94A3B8;font-size:12px;margin:28px 0 0;line-height:1.6;">
          Vous recevez cet email car vous avez demandé votre rapport mensuel.<br/>
          Contact : <a href="mailto:contact@visium-boost.fr" style="color:#2563EB;">contact@visium-boost.fr</a>
        </p>
      </div>
    </div>
  `;
  return sendEmail({ to, subject: `Votre rapport mensuel VisiumBoost — ${month}`, html });
}
