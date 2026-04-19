import Link from "next/link";

export const metadata = {
  title: "Mentions légales de VisiumBoost",
  description: "Mentions légales, éditeur, hébergeur et politique de confidentialité de VisiumBoost.",
};

const FONT_TITLE = "'Special Gothic Expanded One','DM Sans',system-ui,sans-serif";
const FONT_BODY  = "'DM Sans',system-ui,sans-serif";

function Section({ title, children }) {
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
      }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#374151", minWidth: 200, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: "#6B7280", flex: 1 }}>{value}</span>
    </div>
  );
}

function Para({ children }) {
  return (
    <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.8, margin: 0 }}>{children}</p>
  );
}

export default function MentionsLegales() {
  return (
    <div style={{ fontFamily: FONT_BODY, background: "#FAFAFA", minHeight: "100vh" }}>

      {/* NAV minimal */}
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Retour
        </Link>
      </nav>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%)",
        padding: "64px clamp(20px,6vw,80px) 56px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#38BDF8", fontWeight: 800,
            letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 16 }}>
            LÉGAL
          </div>
          <h1 style={{
            fontFamily: FONT_TITLE,
            fontSize: "clamp(32px,5vw,56px)",
            fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.08,
            color: "#F8FAFC", margin: "0 0 16px",
          }}>
            Mentions légales
          </h1>
          <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7, margin: 0 }}>
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance
            en l&apos;économie numérique (LCEN).
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px clamp(20px,5vw,40px) 80px" }}>

        <Section title="1. Éditeur du site">
          <Row label="Raison sociale / Nom" value="[VOTRE NOM OU RAISON SOCIALE]" />
          <Row label="Forme juridique"      value="[EX : Auto-entrepreneur / SAS / SARL]" />
          <Row label="Adresse"              value="[VOTRE ADRESSE COMPLÈTE]" />
          <Row label="SIRET"                value="[NUMÉRO SIRET]" />
          <Row label="N° TVA intracommunautaire" value="[FR XX XXXXXXXXX]" />
          <Row label="Email de contact"     value="contact@visium-boost.fr" />
          <Row label="Site web"             value="https://visium-boost.fr" />
          <Para>
            Le directeur de la publication est{" "}
            <strong style={{ color: "#374151" }}>[VOTRE NOM COMPLET]</strong>.
          </Para>
        </Section>

        <Section title="2. Hébergeur">
          <Row label="Société"    value="Vercel Inc." />
          <Row label="Adresse"    value="340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis" />
          <Row label="Site web"   value="https://vercel.com" />
          <Row label="Contact"    value="https://vercel.com/support" />
          <Para>
            Les serveurs de VisiumBoost sont hébergés sur l&apos;infrastructure cloud de Vercel,
            avec une distribution mondiale via leur réseau Edge. Les données de base de données
            sont hébergées sur MongoDB Atlas (clusters AWS eu-west-1).
          </Para>
        </Section>

        <Section title="3. Propriété intellectuelle">
          <Para>
            L&apos;ensemble du contenu présent sur le site visium-boost.fr (textes, images, logos,
            graphismes, logiciels, structure) est protégé par le droit d&apos;auteur et appartient
            à l&apos;éditeur ou à ses partenaires. Toute reproduction, représentation, modification
            ou exploitation, même partielle, est strictement interdite sans autorisation préalable
            écrite de l&apos;éditeur.
          </Para>
        </Section>

        <Section title="4. Données personnelles (RGPD)">
          <Para>
            VisiumBoost collecte et traite des données personnelles dans le cadre de la fourniture
            de ses services. Conformément au Règlement Général sur la Protection des Données (RGPD —
            UE 2016/679), vous disposez des droits suivants :
          </Para>
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Droit d'accès à vos données",
              "Droit de rectification",
              "Droit à l'effacement (« droit à l'oubli »)",
              "Droit à la portabilité",
              "Droit d'opposition et de limitation du traitement",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{item}</li>
            ))}
          </ul>
          <Para>
            Pour exercer ces droits, contactez-nous à l&apos;adresse :{" "}
            <a href="mailto:contact@visium-boost.fr" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
              contact@visium-boost.fr
            </a>
          </Para>
          <Para>
            Les données collectées (email, nom, informations de connexion) sont conservées pendant
            la durée de la relation contractuelle, puis 3 ans à compter de la fin du contrat.
            Aucune donnée n&apos;est revendue à des tiers.
          </Para>
        </Section>

        <Section title="5. Cookies">
          <Para>
            Le site utilise des cookies techniques strictement nécessaires au fonctionnement
            du service (authentification via cookie httpOnly <code style={{ background: "#F3F4F6",
            padding: "1px 6px", borderRadius: 4, fontSize: 13 }}>zreview_token</code>).
            Aucun cookie publicitaire ou de traçage tiers n&apos;est déposé sans votre consentement.
          </Para>
        </Section>

        <Section title="6. Responsabilité">
          <Para>
            VisiumBoost s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des
            informations diffusées sur ce site. Toutefois, l&apos;éditeur ne peut garantir
            l&apos;exactitude, la complétude ou l&apos;actualité des informations diffusées.
            En conséquence, l&apos;utilisateur reconnaît utiliser ces informations sous sa
            responsabilité exclusive.
          </Para>
        </Section>

        <Section title="7. Droit applicable">
          <Para>
            Les présentes mentions légales sont soumises au droit français. En cas de litige,
            les tribunaux français seront seuls compétents. Toute contestation sera portée devant
            les juridictions compétentes du ressort du siège social de l&apos;éditeur.
          </Para>
        </Section>

        {/* Last updated */}
        <div style={{
          background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 14,
          padding: "16px 22px", display: "flex", alignItems: "center", gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>
            Dernière mise à jour : 16 avril 2026
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
        <div style={{ fontSize: 13, color: "#374151" }}>© 2026 VisiumBoost. Tous droits réservés.</div>
      </footer>
    </div>
  );
}
