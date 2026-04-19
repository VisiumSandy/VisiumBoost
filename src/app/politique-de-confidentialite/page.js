import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité et RGPD | VisiumBoost",
  description: "Politique de confidentialité et protection des données personnelles de VisiumBoost, conforme au RGPD.",
};

const FONT_TITLE = "'Special Gothic Expanded One','DM Sans',system-ui,sans-serif";
const FONT_BODY  = "'DM Sans',system-ui,sans-serif";

function Section({ num, title, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{
        fontFamily: FONT_TITLE,
        fontSize: "clamp(18px,2.5vw,24px)",
        fontWeight: 400,
        letterSpacing: "-0.02em",
        color: "#0F172A",
        margin: "0 0 20px",
        paddingBottom: 12,
        borderBottom: "1.5px solid #E5E7EB",
      }}>
        {num}. {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function Para({ children }) {
  return <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.8, margin: 0 }}>{children}</p>;
}

function Li({ children }) {
  return <li style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.8 }}>{children}</li>;
}

function InfoBox({ color = "#EFF6FF", border = "#BFDBFE", title, titleColor = "#1E40AF", textColor = "#3B82F6", children }) {
  return (
    <div style={{ background: color, border: `1.5px solid ${border}`, borderRadius: 12, padding: "16px 20px" }}>
      {title && <p style={{ fontWeight: 700, color: titleColor, margin: "0 0 6px", fontSize: 14 }}>{title}</p>}
      <div style={{ fontSize: 13, color: textColor, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div style={{ fontFamily: FONT_BODY, background: "#FAFAFA", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250,250,250,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 clamp(20px,5vw,80px)", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 32, objectFit: "contain" }} />
        </Link>
        <Link href="/" style={{
          fontSize: 14, fontWeight: 600, color: "#6B7280",
          textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour
        </Link>
      </nav>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#0F172A 0%,#1A2E4A 100%)",
        padding: "64px clamp(20px,6vw,80px) 56px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#34D399", fontWeight: 800,
            letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 16 }}>
            RGPD · DONNÉES PERSONNELLES
          </div>
          <h1 style={{
            fontFamily: FONT_TITLE,
            fontSize: "clamp(28px,4.5vw,52px)",
            fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1,
            color: "#F8FAFC", margin: "0 0 16px",
          }}>
            Politique de confidentialité
          </h1>
          <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7, margin: 0 }}>
            Comment VisiumBoost collecte, utilise et protège vos données personnelles,
            conformément au Règlement Général sur la Protection des Données (RGPD).
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px clamp(20px,5vw,40px) 80px" }}>

        <Section num="1" title="Responsable du traitement">
          <Para>
            Le responsable du traitement des données personnelles collectées via le service
            VisiumBoost est la société <strong style={{ color: "#374151" }}>VisiumBoost</strong>,
            accessible à l&apos;adresse{" "}
            <a href="https://visium-boost.fr" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
              visium-boost.fr
            </a>.
          </Para>
          <Para>
            Pour toute question relative à la protection de vos données, vous pouvez nous contacter à{" "}
            <a href="mailto:contact@visium-boost.fr" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
              contact@visium-boost.fr
            </a>.
          </Para>
        </Section>

        <Section num="2" title="Données collectées">
          <Para>Dans le cadre de l&apos;utilisation du service, nous collectons les données suivantes :</Para>

          <div style={{ background: "#F8FAFC", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F1F5F9" }}>
                  {["Catégorie", "Données collectées", "Finalité"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#374151", fontWeight: 700, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Compte", "Nom, email, mot de passe (hashé)", "Authentification, communication"],
                  ["Établissement", "Nom du commerce, logo, lien Google", "Configuration du service"],
                  ["Facturation", "Données Stripe (via Stripe, non stockées chez nous)", "Traitement des paiements"],
                  ["Usage", "Nombre de scans, de roues tournées, codes générés", "Statistiques, amélioration du service"],
                  ["Technique", "Adresse IP (logs), navigateur", "Sécurité, détection de fraude"],
                  ["Clients finaux", "Aucune donnée personnelle collectée sur les clients des établissements", "—"],
                ].map(([cat, data, fin], i) => (
                  <tr key={cat} style={{ borderTop: "1px solid #F3F4F6", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ padding: "10px 14px", color: "#374151", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>{cat}</td>
                    <td style={{ padding: "10px 14px", color: "#6B7280", fontSize: 13 }}>{data}</td>
                    <td style={{ padding: "10px 14px", color: "#6B7280", fontSize: 13 }}>{fin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <InfoBox title="Concernant les clients de vos établissements" color="#F0FDF4" border="#BBF7D0" titleColor="#166534" textColor="#15803D">
            VisiumBoost ne collecte <strong>aucune donnée personnelle</strong> sur les clients finaux qui
            utilisent la roue. Aucun email, numéro de téléphone ou compte n&apos;est créé. Seul un code
            anonyme est généré lors du tour de roue.
          </InfoBox>
        </Section>

        <Section num="3" title="Base légale du traitement">
          <Para>Nos traitements reposent sur les bases légales suivantes :</Para>
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <Li><strong style={{ color: "#374151" }}>Exécution du contrat</strong> — traitement des données nécessaires à la fourniture du service (compte, facturation, configuration).</Li>
            <Li><strong style={{ color: "#374151" }}>Intérêt légitime</strong> — analyses statistiques agrégées, sécurité, détection des abus.</Li>
            <Li><strong style={{ color: "#374151" }}>Obligation légale</strong> — conservation des données de facturation (10 ans, conformément au Code du commerce).</Li>
            <Li><strong style={{ color: "#374151" }}>Consentement</strong> — cookies non essentiels (analytics), si activés.</Li>
          </ul>
        </Section>

        <Section num="4" title="Durée de conservation">
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <Li><strong style={{ color: "#374151" }}>Données de compte actif</strong> — conservées pendant toute la durée de l&apos;abonnement.</Li>
            <Li><strong style={{ color: "#374151" }}>Après résiliation</strong> — les données sont supprimées au bout de <strong style={{ color: "#374151" }}>12 mois</strong> (délai permettant une réactivation du compte).</Li>
            <Li><strong style={{ color: "#374151" }}>Données de facturation</strong> — conservées <strong style={{ color: "#374151" }}>10 ans</strong> conformément aux obligations comptables légales.</Li>
            <Li><strong style={{ color: "#374151" }}>Logs de sécurité</strong> — conservés <strong style={{ color: "#374151" }}>90 jours</strong>.</Li>
            <Li><strong style={{ color: "#374151" }}>Codes roue</strong> — supprimés <strong style={{ color: "#374151" }}>6 mois</strong> après leur création.</Li>
          </ul>
        </Section>

        <Section num="5" title="Vos droits (RGPD)">
          <Para>
            Conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés
            modifiée, vous disposez des droits suivants sur vos données :
          </Para>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {[
              { icon: "👁", title: "Droit d'accès", desc: "Obtenir une copie de vos données personnelles." },
              { icon: "✏️", title: "Droit de rectification", desc: "Corriger des données inexactes ou incomplètes." },
              { icon: "🗑️", title: "Droit à l'effacement", desc: "Demander la suppression de vos données." },
              { icon: "⏸️", title: "Droit à la limitation", desc: "Restreindre le traitement dans certains cas." },
              { icon: "📦", title: "Droit à la portabilité", desc: "Recevoir vos données dans un format structuré." },
              { icon: "🚫", title: "Droit d'opposition", desc: "S'opposer à certains traitements (ex: marketing)." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 12, padding: "14px 16px",
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 4px" }}>{title}</p>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <Para>
            Pour exercer ces droits, envoyez votre demande à{" "}
            <a href="mailto:contact@visium-boost.fr" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
              contact@visium-boost.fr
            </a>{" "}
            en précisant votre identité. Nous répondons sous <strong style={{ color: "#374151" }}>30 jours</strong>.
            En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
              CNIL
            </a>.
          </Para>
        </Section>

        <Section num="6" title="Cookies et traceurs">
          <Para>
            VisiumBoost utilise un nombre limité de cookies nécessaires au bon fonctionnement du service.
          </Para>
          <div style={{ background: "#F8FAFC", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F1F5F9" }}>
                  {["Cookie", "Type", "Durée", "Finalité"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#374151", fontWeight: 700, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["visiumboost_token", "Essentiel (httpOnly)", "30 jours", "Authentification — session utilisateur"],
                  ["Préférences UI", "Fonctionnel (localStorage)", "Indéfini", "État de la sidebar, préférences d'affichage"],
                ].map(([name, type, duration, purpose], i) => (
                  <tr key={name} style={{ borderTop: "1px solid #F3F4F6", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#374151", fontSize: 12 }}>{name}</td>
                    <td style={{ padding: "10px 14px", color: "#6B7280", fontSize: 12 }}>{type}</td>
                    <td style={{ padding: "10px 14px", color: "#6B7280", fontSize: 12, whiteSpace: "nowrap" }}>{duration}</td>
                    <td style={{ padding: "10px 14px", color: "#6B7280", fontSize: 12 }}>{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Para>
            VisiumBoost n&apos;utilise <strong style={{ color: "#374151" }}>aucun cookie publicitaire ni de tracking tiers</strong>.
            Aucune donnée n&apos;est transmise à des régies publicitaires.
            Le cookie d&apos;authentification est strictement nécessaire au fonctionnement du service et
            ne nécessite pas de consentement au titre de l&apos;article 82 de la loi Informatique et Libertés.
          </Para>
        </Section>

        <Section num="7" title="Sous-traitants et transferts de données">
          <Para>
            VisiumBoost fait appel aux prestataires suivants pour assurer le service. Ces sous-traitants
            ont été sélectionnés pour leur conformité au RGPD :
          </Para>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { name: "Vercel Inc.", role: "Hébergement de l'application", country: "🇺🇸 USA (SCCs)", link: "https://vercel.com/legal/privacy-policy" },
              { name: "MongoDB Atlas (AWS)", role: "Base de données — hébergement Europe (eu-west-1)", country: "🇪🇺 Europe", link: "https://www.mongodb.com/legal/privacy-policy" },
              { name: "Stripe Inc.", role: "Traitement des paiements", country: "🇺🇸 USA (SCCs + adequacy)", link: "https://stripe.com/fr/privacy" },
              { name: "Resend", role: "Envoi d'emails transactionnels", country: "🇺🇸 USA (SCCs)", link: "https://resend.com/legal/privacy-policy" },
            ].map(({ name, role, country, link }) => (
              <div key={name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
                background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 16px",
              }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#374151", margin: "0 0 2px", fontSize: 14 }}>{name}</p>
                  <p style={{ color: "#6B7280", margin: 0, fontSize: 13 }}>{role} · {country}</p>
                </div>
                <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>
                  Politique de confidentialité →
                </a>
              </div>
            ))}
          </div>
          <InfoBox color="#FFFBEB" border="#FDE68A" titleColor="#92400E" textColor="#92400E" title="Transferts hors UE">
            Vercel, Stripe et Resend sont basés aux États-Unis. Les transferts sont encadrés par des{" "}
            <strong>Clauses Contractuelles Types (CCT)</strong> approuvées par la Commission européenne,
            conformément à l&apos;article 46 du RGPD.
          </InfoBox>
        </Section>

        <Section num="8" title="Sécurité des données">
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <Li>Mots de passe hashés avec <strong style={{ color: "#374151" }}>bcrypt</strong> (facteur 12) — jamais stockés en clair</Li>
            <Li>Connexions sécurisées via <strong style={{ color: "#374151" }}>HTTPS/TLS</strong> sur l&apos;ensemble de la plateforme</Li>
            <Li>Sessions via <strong style={{ color: "#374151" }}>JWT signés</strong> dans des cookies httpOnly (inaccessibles depuis JavaScript)</Li>
            <Li>Protection contre le brute-force : limitation à <strong style={{ color: "#374151" }}>5 tentatives de connexion</strong> par 15 minutes par adresse IP</Li>
            <Li>Aucune donnée bancaire stockée chez VisiumBoost — traitement délégué à Stripe (certifié PCI DSS)</Li>
            <Li>Accès à la base de données restreint à l&apos;application via authentification MongoDB Atlas</Li>
          </ul>
        </Section>

        <Section num="9" title="Mineurs">
          <Para>
            Le service VisiumBoost est exclusivement destiné aux professionnels (entreprises, commerces,
            prestataires de services). Il n&apos;est pas conçu pour des personnes de moins de 16 ans.
            Nous ne collectons pas sciemment des données concernant des mineurs.
          </Para>
        </Section>

        <Section num="10" title="Modifications de cette politique">
          <Para>
            Nous pouvons mettre à jour cette politique de confidentialité en cas d&apos;évolution réglementaire
            ou de modification du service. Toute mise à jour substantielle sera notifiée par email aux
            utilisateurs inscrits avec un préavis de 15 jours.
          </Para>
        </Section>

        {/* Contact DPO */}
        <div style={{
          background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: 14,
          padding: "20px 24px", marginBottom: 32,
        }}>
          <p style={{ fontWeight: 700, color: "#1E40AF", margin: "0 0 6px", fontSize: 15 }}>
            Questions sur vos données personnelles ?
          </p>
          <p style={{ color: "#3B82F6", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            Contactez-nous à{" "}
            <a href="mailto:contact@visium-boost.fr" style={{ color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>
              contact@visium-boost.fr
            </a>
            {" "}— nous répondons sous <strong>30 jours</strong> conformément au RGPD.
            Vous pouvez aussi saisir la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>CNIL</a> en cas de litige.
          </p>
        </div>

        {/* Last updated */}
        <div style={{
          background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 14,
          padding: "16px 22px", display: "flex", alignItems: "center", gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>
            Dernière mise à jour : 17 avril 2026
          </span>
        </div>
      </div>

      {/* Footer minimal */}
      <footer style={{
        background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "24px clamp(20px,5vw,80px)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 28, objectFit: "contain" }} />
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/mentions-legales" style={{ fontSize: 13, color: "#52525B", textDecoration: "none" }}>Mentions légales</Link>
          <Link href="/cgu" style={{ fontSize: 13, color: "#52525B", textDecoration: "none" }}>CGU</Link>
          <Link href="/politique-de-confidentialite" style={{ fontSize: 13, color: "#94A3B8", textDecoration: "none" }}>Confidentialité</Link>
        </div>
        <div style={{ fontSize: 13, color: "#374151" }}>© 2026 VisiumBoost. Tous droits réservés.</div>
      </footer>
    </div>
  );
}
