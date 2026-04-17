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
