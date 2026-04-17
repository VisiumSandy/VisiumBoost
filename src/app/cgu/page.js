import Link from "next/link";

export const metadata = {
  title: "CGU — Conditions Générales d'Utilisation — VisiumBoost",
  description: "Conditions Générales d'Utilisation et de Vente du service SaaS VisiumBoost.",
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
  return (
    <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.8, margin: 0 }}>{children}</p>
  );
}

function Li({ children }) {
  return (
    <li style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.8 }}>{children}</li>
  );
}

export default function CGUPage() {
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
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
            Conditions Générales
          </h1>
          <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7, margin: 0 }}>
            Conditions Générales d&apos;Utilisation (CGU) et de Vente (CGV) du service VisiumBoost.
            En utilisant notre service, vous acceptez ces conditions.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px clamp(20px,5vw,40px) 80px" }}>

        <Section num="1" title="Objet et acceptation">
          <Para>
            Les présentes Conditions Générales d&apos;Utilisation et de Vente (ci-après &quot;CGU/CGV&quot;)
            régissent l&apos;accès et l&apos;utilisation du service SaaS VisiumBoost (ci-après &quot;le Service&quot;),
            accessible à l&apos;adresse <a href="https://visium-boost.fr" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>visium-boost.fr</a>.
          </Para>
          <Para>
            En s&apos;inscrivant sur la plateforme ou en utilisant le Service, l&apos;utilisateur accepte
            sans réserve les présentes CGU/CGV. Si vous n&apos;acceptez pas ces conditions, veuillez ne
            pas utiliser le Service.
          </Para>
        </Section>

        <Section num="2" title="Description du service">
          <Para>
            VisiumBoost est une plateforme SaaS permettant aux professionnels (restaurants, commerces,
            services, etc.) de mettre en place un système de gamification pour collecter des avis Google.
            Le service comprend notamment :
          </Para>
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <Li>Une roue de la fortune personnalisable avec des récompenses définies par l&apos;établissement</Li>
            <Li>Un système de codes anti-fraude à usage unique</Li>
            <Li>Un tableau de bord de gestion et de suivi des statistiques</Li>
            <Li>Des pages publiques accessibles via sous-domaine ou URL dédiée</Li>
            <Li>Des outils de génération et d&apos;impression d&apos;affiches QR code</Li>
          </ul>
        </Section>

        <Section num="3" title="Inscription et compte utilisateur">
          <Para>
            Pour accéder au Service, l&apos;utilisateur doit créer un compte en fournissant une adresse
            email valide, un mot de passe et les informations de son établissement. L&apos;utilisateur
            s&apos;engage à fournir des informations exactes, complètes et à jour.
          </Para>
          <Para>
            L&apos;utilisateur est seul responsable de la confidentialité de ses identifiants de connexion.
            VisiumBoost ne pourra être tenu responsable de tout accès non autorisé résultant d&apos;une
            négligence de l&apos;utilisateur dans la protection de ses accès.
          </Para>
        </Section>

        <Section num="4" title="Période d'essai gratuite">
          <Para>
            Tout nouvel utilisateur bénéficie d&apos;un essai gratuit de <strong style={{ color: "#374151" }}>14 jours</strong> donnant
            accès à l&apos;ensemble des fonctionnalités du plan Pro. Aucune carte bancaire n&apos;est
            requise pour démarrer l&apos;essai.
          </Para>
          <Para>
            À l&apos;issue de la période d&apos;essai, si l&apos;utilisateur n&apos;a pas souscrit à un plan payant,
            son compte sera automatiquement rétrogradé vers le plan Gratuit avec les limitations associées.
          </Para>
        </Section>

        <Section num="5" title="Tarifs et abonnements">
          <Para>
            VisiumBoost propose les plans tarifaires suivants (prix HT, facturés mensuellement) :
          </Para>
          <div style={{ overflowX: "auto", marginTop: 4 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                  {["Plan", "Prix/mois", "Établissements", "Scans/mois"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#374151", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Gratuit", "0 €", "1", "50"],
                  ["Starter", "29 €", "3", "500"],
                  ["Pro", "79 €", "Illimité", "Illimité"],
                ].map(([plan, prix, etab, scans]) => (
                  <tr key={plan} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    {[plan, prix, etab, scans].map((cell, i) => (
                      <td key={i} style={{ padding: "10px 12px", color: "#6B7280" }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Para>
            Les prix sont susceptibles d&apos;être modifiés. Toute modification tarifaire sera notifiée
            aux utilisateurs actifs 30 jours avant son entrée en vigueur.
          </Para>
        </Section>

        <Section num="6" title="Facturation et paiement">
          <Para>
            Les abonnements payants sont facturés mensuellement via la plateforme de paiement
            sécurisée Stripe. En cas d&apos;échec de paiement, l&apos;accès aux fonctionnalités premium
            pourra être suspendu après une période de grâce de 7 jours.
          </Para>
          <Para>
            Les paiements sont sécurisés par Stripe et conformes aux standards PCI-DSS. VisiumBoost
            ne stocke aucune donnée bancaire.
          </Para>
        </Section>

        <Section num="7" title="Politique de remboursement">
          <Para>
            Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de rétractation
            ne s&apos;applique pas aux abonnements SaaS dont l&apos;exécution a commencé avant l&apos;expiration
            du délai de rétractation, avec l&apos;accord exprès de l&apos;utilisateur.
          </Para>
          <Para>
            Toutefois, VisiumBoost offre un remboursement complet dans les <strong style={{ color: "#374151" }}>14 jours suivant
            le premier achat</strong>, si l&apos;utilisateur n&apos;est pas satisfait du service, sous réserve
            que le compte n&apos;ait pas généré plus de 100 scans sur la période. Pour toute demande de
            remboursement, contactez{" "}
            <a href="mailto:contact@visium-boost.fr" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
              contact@visium-boost.fr
            </a>.
          </Para>
          <Para>
            Après cette période de 14 jours, aucun remboursement ne sera accordé pour le mois en cours.
            L&apos;utilisateur peut à tout moment résilier son abonnement, qui restera actif jusqu&apos;à
            la fin de la période payée.
          </Para>
        </Section>

        <Section num="8" title="Résiliation">
          <Para>
            L&apos;utilisateur peut résilier son abonnement à tout moment depuis son tableau de bord,
            rubrique &quot;Abonnement&quot;. La résiliation prend effet à la fin de la période de facturation
            en cours. Aucune somme ne sera remboursée pour la période restante.
          </Para>
          <Para>
            VisiumBoost se réserve le droit de suspendre ou de résilier un compte en cas de violation
            des présentes CGU, d&apos;utilisation abusive du service, ou de non-paiement.
          </Para>
        </Section>

        <Section num="9" title="Disponibilité du service">
          <Para>
            VisiumBoost s&apos;engage à assurer la disponibilité du service 24h/24 et 7j/7, sauf en cas
            de maintenance planifiée (annoncée à l&apos;avance) ou d&apos;événements indépendants de notre
            volonté (force majeure, panne des infrastructures d&apos;hébergement tierces, etc.).
          </Para>
          <Para>
            VisiumBoost ne peut être tenu responsable des interruptions de service dues à des
            défaillances des services tiers (Vercel, MongoDB Atlas, Stripe, etc.).
          </Para>
        </Section>

        <Section num="10" title="Limitation de responsabilité">
          <Para>
            VisiumBoost ne garantit pas que l&apos;utilisation du service conduira à une augmentation
            du nombre d&apos;avis Google. Les résultats dépendent de nombreux facteurs extérieurs à
            notre contrôle (qualité du service de l&apos;établissement, comportement des clients, etc.).
          </Para>
          <Para>
            La responsabilité de VisiumBoost est limitée au montant des sommes versées par
            l&apos;utilisateur au cours des 12 derniers mois précédant le sinistre.
          </Para>
        </Section>

        <Section num="11" title="Propriété intellectuelle">
          <Para>
            L&apos;ensemble de la plateforme VisiumBoost (code, design, marque, algorithmes) est la
            propriété exclusive de VisiumBoost. L&apos;utilisateur bénéficie d&apos;une licence d&apos;utilisation
            non exclusive, non transférable, limitée à l&apos;usage du service conformément aux présentes CGU.
          </Para>
          <Para>
            L&apos;utilisateur conserve la propriété des données qu&apos;il renseigne dans le service
            (nom d&apos;établissement, récompenses, etc.).
          </Para>
        </Section>

        <Section num="12" title="Droit applicable et litiges">
          <Para>
            Les présentes CGU sont soumises au droit français. En cas de litige, les parties
            s&apos;engagent à tenter de résoudre le différend à l&apos;amiable avant tout recours judiciaire.
            À défaut, le litige sera soumis aux tribunaux compétents du ressort du siège social
            de VisiumBoost.
          </Para>
          <Para>
            Conformément à l&apos;article L.616-1 du Code de la consommation, VisiumBoost propose un
            dispositif de médiation de la consommation. Pour tout litige non résolu, vous pouvez
            également consulter la plateforme européenne de règlement des litiges en ligne :
            {" "}<a href="https://ec.europa.eu/consumers/odr" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
              ec.europa.eu/consumers/odr
            </a>.
          </Para>
        </Section>

        <Section num="13" title="Modifications des CGU">
          <Para>
            VisiumBoost se réserve le droit de modifier les présentes CGU à tout moment. Les
            utilisateurs seront informés de toute modification substantielle par email avec un
            préavis de 15 jours. La poursuite de l&apos;utilisation du service après ce délai vaut
            acceptation des nouvelles conditions.
          </Para>
        </Section>

        {/* Contact */}
        <div style={{
          background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: 14,
          padding: "20px 24px", marginBottom: 32,
        }}>
          <p style={{ fontWeight: 700, color: "#1E40AF", margin: "0 0 6px", fontSize: 15 }}>
            Questions sur nos CGU ?
          </p>
          <p style={{ color: "#3B82F6", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            Contactez-nous à{" "}
            <a href="mailto:contact@visium-boost.fr" style={{ color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>
              contact@visium-boost.fr
            </a>
            {" "}— nous répondons sous 48h ouvrées.
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
        </div>
        <div style={{ fontSize: 13, color: "#374151" }}>© 2026 VisiumBoost — Tous droits réservés</div>
      </footer>
    </div>
  );
}
