import Link from "next/link";

export const metadata = {
  title: "Comparatif outils avis Google : VisiumBoost face aux solutions du marché",
  description:
    "Comparez VisiumBoost aux autres outils d'avis Google : prix, gamification, facilité d'utilisation. Pourquoi les commerçants locaux choisissent une solution simple et abordable.",
  alternates: {
    canonical: "https://visium-boost.fr/vs-partoo",
  },
  openGraph: {
    title: "Comparatif outils avis Google : VisiumBoost face aux solutions du marché",
    description:
      "Prix, engagement, gamification, setup : comparez les outils d'avis Google et trouvez la solution adaptée à votre commerce.",
    url: "https://visium-boost.fr/vs-partoo",
  },
};

const FONT_TITLE = "'Special Gothic Expanded One','DM Sans',system-ui,sans-serif";
const FONT_BODY  = "'DM Sans',system-ui,sans-serif";

const ROWS = [
  { label: "Prix mensuel",          vb: "Dès 9,99 €/mois",       partoo: "Plusieurs centaines €/mois", vbWin: true  },
  { label: "Engagement",            vb: "Sans engagement ✓",       partoo: "Contrat annuel",        vbWin: true  },
  { label: "Gamification (roue)",   vb: "Roue de la fortune ✓",   partoo: "Aucune ✗",              vbWin: true  },
  { label: "Setup",                 vb: "5 minutes",               partoo: "Plusieurs semaines",    vbWin: true  },
  { label: "Codes anti-fraude",     vb: "Inclus ✓",                partoo: "Non ✗",                vbWin: true  },
  { label: "Multi-établissements",  vb: "Inclus dès Starter ✓",   partoo: "Sur devis",             vbWin: true  },
  { label: "Cible",                 vb: "PME locales, indépendants", partoo: "Grandes chaînes",    vbWin: true  },
  { label: "Support",               vb: "Email réactif",           partoo: "Account manager dédié", vbWin: false },
];

const TESTIMONIALS = [
  {
    name: "Karim B.",
    role: "Gérant, Kebab Express (Lyon)",
    text: "J'avais regardé d'autres solutions mais les prix étaient impossibles pour moi. VisiumBoost m'a permis de passer de 24 à 87 avis en 2 mois pour moins de 10 euros par mois. Mes clients adorent la roue.",
    stars: 5,
  },
  {
    name: "Marie-Claire T.",
    role: "Propriétaire, Boulangerie du Marché (Bordeaux)",
    text: "En 5 minutes j'avais mon QR code affiché en caisse. Le premier week-end, 12 nouveaux avis. D'autres outils m'avaient parlé de 3 semaines d'intégration.",
    stars: 5,
  },
  {
    name: "Sofiane A.",
    role: "Directeur, Salon NOVA (Marseille)",
    text: "La roue c'est ce qui fait la différence. Mes clients jouent, gagnent un soin offert, et laissent un avis. C'est gagnant des deux côtés. Les autres outils ne proposent rien de tel.",
    stars: 5,
  },
];

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

export default function VsPartooPage() {
  return (
    <div style={{ fontFamily: FONT_BODY, background: "#FAFAFA", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250,250,250,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 clamp(20px,5vw,80px)", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 32, objectFit: "contain" }} />
        </Link>
        <Link href="/register" style={{
          background: "#2563EB", color: "#fff", textDecoration: "none",
          padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
        }}>
          Essai gratuit 14 jours →
        </Link>
      </nav>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%)",
        padding: "72px clamp(20px,6vw,80px) 64px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(37,99,235,0.2)", border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: 20, padding: "5px 16px", marginBottom: 24,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#60A5FA", letterSpacing: "1px", textTransform: "uppercase" }}>
              Comparatif 2026
            </span>
          </div>
          <h1 style={{
            fontFamily: FONT_TITLE,
            fontSize: "clamp(28px,5vw,56px)",
            fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1,
            color: "#F8FAFC", margin: "0 0 20px",
          }}>
            Comparatif outils avis Google
          </h1>
          <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "#94A3B8", lineHeight: 1.7, margin: "0 0 36px" }}>
            Certaines solutions coûtent plusieurs centaines d&apos;euros par mois et ciblent les grandes chaînes. VisiumBoost est conçu pour les commerçants locaux : roue gamifiée, setup en 5 minutes, sans engagement.
          </p>
          <Link href="/register" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
            color: "#fff", textDecoration: "none",
            padding: "14px 32px", borderRadius: 14,
            fontWeight: 700, fontSize: 15,
            boxShadow: "0 8px 32px rgba(37,99,235,0.4)",
          }}>
            Commencer gratuitement, sans CB
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "64px clamp(20px,5vw,40px) 0" }}>
        <h2 style={{
          fontFamily: FONT_TITLE, fontSize: "clamp(22px,3vw,32px)",
          fontWeight: 400, letterSpacing: "-0.02em", color: "#0F172A",
          textAlign: "center", margin: "0 0 8px",
        }}>
          Comparatif détaillé
        </h2>
        <p style={{ textAlign: "center", color: "#64748B", fontSize: 15, margin: "0 0 40px" }}>
          Une comparaison objective, fonctionnalité par fonctionnalité.
        </p>

        <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #E5E7EB", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr",
            background: "#F8FAFC", borderBottom: "2px solid #E5E7EB",
          }}>
            <div style={{ padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>
              Critère
            </div>
            <div style={{
              padding: "14px 20px", textAlign: "center", fontSize: 14, fontWeight: 800,
              background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
              color: "#2563EB", borderLeft: "2px solid #BFDBFE",
            }}>
              VisiumBoost ✓
            </div>
            <div style={{ padding: "14px 20px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#64748B" }}>
              Partoo
            </div>
          </div>

          {ROWS.map((row, i) => (
            <div key={row.label} style={{
              display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr",
              borderBottom: i < ROWS.length - 1 ? "1px solid #F1F5F9" : "none",
            }}>
              <div style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#374151" }}>
                {row.label}
              </div>
              <div style={{
                padding: "14px 20px", textAlign: "center", fontSize: 13, fontWeight: 700,
                color: "#15803D", background: row.vbWin ? "#F0FDF4" : "#fff",
                borderLeft: "2px solid #BBF7D0",
              }}>
                {row.vb}
              </div>
              <div style={{ padding: "14px 20px", textAlign: "center", fontSize: 13, color: "#6B7280" }}>
                {row.partoo}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "64px clamp(20px,5vw,40px) 0" }}>
        <h2 style={{
          fontFamily: FONT_TITLE, fontSize: "clamp(20px,3vw,30px)",
          fontWeight: 400, letterSpacing: "-0.02em", color: "#0F172A",
          textAlign: "center", margin: "0 0 36px",
        }}>
          Ils ont fait le choix VisiumBoost
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{
              background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 16,
              padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {Array.from({ length: t.stars }).map((_, i) => <Star key={i} />)}
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 16px", fontStyle: "italic" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <p style={{ fontWeight: 700, color: "#0F172A", margin: 0, fontSize: 14 }}>{t.name}</p>
                <p style={{ color: "#94A3B8", fontSize: 12, margin: "2px 0 0" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        maxWidth: 860, margin: "0 auto",
        padding: "64px clamp(20px,5vw,40px) 80px", textAlign: "center",
      }}>
        <div style={{
          background: "linear-gradient(135deg,#0F172A,#1E3A5F)",
          borderRadius: 24, padding: "52px 40px",
        }}>
          <h2 style={{
            fontFamily: FONT_TITLE, fontSize: "clamp(22px,3.5vw,36px)",
            fontWeight: 400, color: "#F8FAFC", margin: "0 0 12px", letterSpacing: "-0.02em",
          }}>
            Prêt à passer à la vitesse supérieure ?
          </h2>
          <p style={{ color: "#94A3B8", fontSize: 15, margin: "0 0 32px", lineHeight: 1.7 }}>
            14 jours d&apos;essai gratuit, sans carte bancaire, sans engagement.
            Setup en 5 minutes.
          </p>
          <Link href="/register" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
            color: "#fff", textDecoration: "none",
            padding: "16px 36px", borderRadius: 14,
            fontWeight: 700, fontSize: 16,
            boxShadow: "0 8px 32px rgba(37,99,235,0.4)",
          }}>
            Essayer gratuitement, 14 jours sans CB
          </Link>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 16 }}>
            Déjà un compte ?{" "}
            <Link href="/login" style={{ color: "#60A5FA", fontWeight: 600, textDecoration: "none" }}>
              Se connecter →
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "24px clamp(20px,5vw,80px)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 28, objectFit: "contain" }} />
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link href="/mentions-legales" style={{ fontSize: 13, color: "#52525B", textDecoration: "none" }}>Mentions légales</Link>
          <Link href="/cgu" style={{ fontSize: 13, color: "#52525B", textDecoration: "none" }}>CGU</Link>
          <Link href="/politique-de-confidentialite" style={{ fontSize: 13, color: "#52525B", textDecoration: "none" }}>Confidentialité</Link>
        </div>
        <div style={{ fontSize: 13, color: "#374151" }}>© 2026 VisiumBoost</div>
      </footer>
    </div>
  );
}
