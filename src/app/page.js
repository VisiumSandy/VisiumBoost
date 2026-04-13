import Link from "next/link";

const FEATURES = [
  {
    icon: "🎡",
    title: "Roue de la fortune",
    desc: "Gamifiez l'expérience client avec une roue personnalisée aux couleurs de votre marque. Vos clients adorent jouer.",
  },
  {
    icon: "🔐",
    title: "Codes anti-fraude",
    desc: "Chaque code est unique et à usage unique. Seuls les vrais clients qui ont laissé un avis peuvent jouer.",
  },
  {
    icon: "📊",
    title: "Analytics temps réel",
    desc: "Suivez vos scans, clics et conversions en temps réel. Voyez exactement ce qui fonctionne pour vous.",
  },
  {
    icon: "🔗",
    title: "URL personnalisée",
    desc: "Chaque établissement a sa propre URL dynamique : restaurant.zreview.fr — sans aucune configuration.",
  },
  {
    icon: "📱",
    title: "QR Code intégré",
    desc: "Générez un QR code imprimable en un clic. Affichez-le en caisse, sur les tables ou dans vos menus.",
  },
  {
    icon: "🏆",
    title: "Multi-établissements",
    desc: "Gérez plusieurs restaurants ou boutiques depuis un seul dashboard. Parfait pour les chaînes.",
  },
];

const PLANS = [
  {
    name: "Gratuit",
    price: "0€",
    period: "/mois",
    desc: "Pour tester la plateforme",
    features: ["1 établissement", "50 scans / mois", "5 codes / mois", "Dashboard analytics", "Support email"],
    cta: "Commencer gratuitement",
    href: "/register",
    highlight: false,
  },
  {
    name: "Starter",
    price: "29€",
    period: "/mois",
    desc: "Pour les indépendants",
    features: ["3 établissements", "500 scans / mois", "200 codes / mois", "Analytics avancés", "URL personnalisée", "Support prioritaire"],
    cta: "Essai 14 jours gratuit",
    href: "/register",
    highlight: true,
  },
  {
    name: "Pro",
    price: "79€",
    period: "/mois",
    desc: "Pour les chaînes et agences",
    features: ["Illimité", "Scans illimités", "Codes illimités", "API access", "Compte manager dédié", "Onboarding personnalisé"],
    cta: "Contacter l'équipe",
    href: "/register",
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    quote: "En 3 semaines j'ai doublé mes avis Google. Mes clients adorent tourner la roue après leur repas.",
    name: "Marie D.",
    role: "Restauratrice, Lyon",
    stars: 5,
  },
  {
    quote: "La mise en place a pris 10 minutes. Maintenant j'ai 15 nouveaux avis chaque semaine sans rien faire.",
    name: "Karim B.",
    role: "Gérant café, Paris",
    stars: 5,
  },
  {
    quote: "Mes clients reviennent plus souvent depuis qu'on a la roue. C'est un vrai boost pour la fidélité.",
    name: "Sophie M.",
    role: "Salon de coiffure, Bordeaux",
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#fff", color: "#0F0F1A" }}>

      {/* ─── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 68,
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6C5CE7, #00B894)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 18, fontFamily: "'Calistoga', serif" }}>z</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px", fontFamily: "'Calistoga', serif" }}>
            zReview
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/login" style={{
            padding: "9px 20px", borderRadius: 10, textDecoration: "none",
            color: "#636e72", fontWeight: 600, fontSize: 14,
            transition: "color 0.2s",
          }}>
            Connexion
          </Link>
          <Link href="/register" style={{
            padding: "9px 22px", borderRadius: 10, textDecoration: "none",
            background: "linear-gradient(135deg, #6C5CE7, #7B6CF0)",
            color: "#fff", fontWeight: 700, fontSize: 14,
            boxShadow: "0 4px 14px #6C5CE740",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}>
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(160deg, #0F0F1A 0%, #1a1040 50%, #0F1A20 100%)",
        padding: "100px 24px 120px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow blobs */}
        <div style={{
          position: "absolute", top: "20%", left: "15%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, #6C5CE720 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "10%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, #00B89420 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 32,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00B894", display: "inline-block" }} />
            <span style={{ color: "#a29bfe", fontWeight: 600, fontSize: 13 }}>
              Nouveau · Sous-domaines personnalisés disponibles
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Calistoga', serif",
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 400,
            color: "#fff",
            margin: "0 auto 24px",
            lineHeight: 1.15,
            maxWidth: 820,
            letterSpacing: "-1px",
          }}>
            Transformez chaque client en{" "}
            <span style={{
              background: "linear-gradient(135deg, #a29bfe, #00B894)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              ambassadeur Google
            </span>
          </h1>

          <p style={{
            color: "#a0aec0", fontSize: 18, maxWidth: 560, margin: "0 auto 44px",
            lineHeight: 1.75, fontWeight: 400,
          }}>
            La roue de la fortune gamifiée qui booste vos avis Google automatiquement.
            Configurez en <strong style={{ color: "#fff" }}>5 minutes</strong>, récoltez des avis à vie.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{
              padding: "17px 36px", borderRadius: 14, textDecoration: "none",
              background: "linear-gradient(135deg, #6C5CE7, #00B894)",
              color: "#fff", fontWeight: 800, fontSize: 16,
              boxShadow: "0 8px 32px #6C5CE755",
              transition: "transform 0.2s",
            }}>
              Commencer gratuitement
            </Link>
            <Link href="/login" style={{
              padding: "17px 36px", borderRadius: 14, textDecoration: "none",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff", fontWeight: 700, fontSize: 16,
              backdropFilter: "blur(8px)",
            }}>
              Voir la démo →
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap",
            marginTop: 72, paddingTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}>
            {[["500+", "Établissements"], ["98%", "Satisfaction"], ["4.8★", "Note Google"], ["2min", "Setup moyen"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Calistoga', serif", fontSize: 32, color: "#fff", lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 13, color: "#718096", marginTop: 4, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#6C5CE7", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Comment ça marche
            </p>
            <h2 style={{ fontFamily: "'Calistoga', serif", fontSize: "clamp(28px, 4vw, 44px)", margin: 0, lineHeight: 1.2 }}>
              Simple comme bonjour
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
            {[
              { step: "01", title: "Créez votre compte", desc: "Inscrivez-vous en 30 secondes. Configurez vos couleurs, vos récompenses et votre lien Google." },
              { step: "02", title: "Partagez votre QR code", desc: "Imprimez le QR code généré automatiquement. Affichez-le en caisse, sur les tables ou dans votre vitrine." },
              { step: "03", title: "Regardez les avis arriver", desc: "Vos clients laissent un avis, reçoivent un code, jouent à la roue. Vous collectez des avis en continu." },
            ].map((item) => (
              <div key={item.step} style={{
                background: "#fff", borderRadius: 20, padding: 32,
                boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                border: "1px solid #F0F0F5",
              }}>
                <div style={{
                  fontFamily: "'Calistoga', serif", fontSize: 48, color: "#6C5CE715",
                  lineHeight: 1, marginBottom: 20, fontWeight: 400,
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 10px", color: "#0F0F1A" }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#636e72", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#6C5CE7", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Fonctionnalités
            </p>
            <h2 style={{ fontFamily: "'Calistoga', serif", fontSize: "clamp(28px, 4vw, 44px)", margin: 0, lineHeight: 1.2 }}>
              Tout ce dont vous avez besoin
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                padding: "28px 32px", borderRadius: 18,
                border: "1.5px solid #F0F0F5",
                background: "#FAFAFA",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px", color: "#0F0F1A" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#636e72", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ──────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#6C5CE7", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Tarifs
            </p>
            <h2 style={{ fontFamily: "'Calistoga', serif", fontSize: "clamp(28px, 4vw, 44px)", margin: 0, lineHeight: 1.2 }}>
              Simple et transparent
            </h2>
            <p style={{ color: "#636e72", fontSize: 16, marginTop: 16 }}>Sans engagement. Annulez quand vous voulez.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {PLANS.map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? "linear-gradient(160deg, #0F0F1A 0%, #1a1040 100%)" : "#fff",
                borderRadius: 24,
                padding: "36px 32px",
                border: plan.highlight ? "none" : "1.5px solid #E8E8F0",
                boxShadow: plan.highlight ? "0 20px 60px rgba(108,92,231,0.3)" : "0 2px 20px rgba(0,0,0,0.04)",
                position: "relative",
                transform: plan.highlight ? "scale(1.04)" : "scale(1)",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #6C5CE7, #00B894)",
                    color: "#fff", fontWeight: 800, fontSize: 12,
                    padding: "5px 18px", borderRadius: 100, letterSpacing: 1,
                    textTransform: "uppercase", whiteSpace: "nowrap",
                  }}>
                    Le plus populaire
                  </div>
                )}

                <div style={{ marginBottom: 8 }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: plan.highlight ? "#a29bfe" : "#6C5CE7",
                    textTransform: "uppercase", letterSpacing: 1,
                  }}>
                    {plan.name}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Calistoga', serif", fontSize: 48, color: plan.highlight ? "#fff" : "#0F0F1A", lineHeight: 1 }}>
                    {plan.price}
                  </span>
                  <span style={{ color: plan.highlight ? "#718096" : "#b2bec3", fontSize: 15, marginBottom: 8 }}>{plan.period}</span>
                </div>
                <p style={{ color: plan.highlight ? "#718096" : "#b2bec3", fontSize: 13, margin: "0 0 28px" }}>{plan.desc}</p>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: plan.highlight ? "#e2e8f0" : "#2d3436" }}>
                      <span style={{ color: "#00B894", fontWeight: 900, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} style={{
                  display: "block", textAlign: "center", padding: "14px",
                  borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 14,
                  background: plan.highlight ? "linear-gradient(135deg, #6C5CE7, #00B894)" : "transparent",
                  color: plan.highlight ? "#fff" : "#6C5CE7",
                  border: plan.highlight ? "none" : "2px solid #6C5CE7",
                  transition: "opacity 0.2s",
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#6C5CE7", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Témoignages
            </p>
            <h2 style={{ fontFamily: "'Calistoga', serif", fontSize: "clamp(28px, 4vw, 44px)", margin: 0, lineHeight: 1.2 }}>
              Ils nous font confiance
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{
                background: "#F8FAFC", borderRadius: 20, padding: "28px 28px",
                border: "1.5px solid #F0F0F5",
              }}>
                <div style={{ color: "#FDCB6E", fontSize: 18, marginBottom: 16 }}>
                  {"★".repeat(t.stars)}
                </div>
                <p style={{ fontSize: 15, color: "#2d3436", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#0F0F1A" }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "#636e72" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #0F0F1A 0%, #1a1040 100%)",
        padding: "80px 24px", textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "'Calistoga', serif",
          fontSize: "clamp(28px, 5vw, 52px)",
          color: "#fff", margin: "0 auto 16px", maxWidth: 700, lineHeight: 1.2,
        }}>
          Prêt à booster vos avis Google ?
        </h2>
        <p style={{ color: "#718096", fontSize: 16, marginBottom: 36 }}>
          Rejoignez 500+ établissements qui utilisent zReview chaque jour.
        </p>
        <Link href="/register" style={{
          display: "inline-block", padding: "18px 40px", borderRadius: 14,
          background: "linear-gradient(135deg, #6C5CE7, #00B894)",
          color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 17,
          boxShadow: "0 8px 32px #6C5CE755",
        }}>
          Commencer gratuitement — Aucune CB requise
        </Link>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{
        background: "#0F0F1A", padding: "40px 40px 32px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "linear-gradient(135deg, #6C5CE7, #00B894)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 16, fontFamily: "'Calistoga', serif" }}>z</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#fff", fontFamily: "'Calistoga', serif" }}>zReview</span>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              ["Connexion", "/login"],
              ["Créer un compte", "/register"],
              ["Dashboard", "/dashboard"],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{ color: "#718096", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}>
                {label}
              </Link>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "#4a5568" }}>
            © 2026 zReview — Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}
