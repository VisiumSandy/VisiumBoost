import Link from "next/link";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: "Roue de la fortune",
    desc: "Gamifiez l'expérience client avec une roue personnalisée aux couleurs de votre marque.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "Codes anti-fraude",
    desc: "Chaque code est unique et à usage unique. Seuls les vrais clients qui ont laissé un avis peuvent jouer.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Analytics en temps réel",
    desc: "Suivez vos scans, clics et conversions. Voyez exactement ce qui fonctionne pour vous.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: "URL personnalisée",
    desc: "Chaque établissement a sa propre URL : restaurant.zreview.fr — sans aucune configuration.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7z"/><rect x="14" y="14" width="3" height="3"/>
      </svg>
    ),
    title: "QR Code intégré",
    desc: "Générez un QR code imprimable en un clic. Affichez-le en caisse, sur les tables ou dans vos menus.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Multi-établissements",
    desc: "Gérez plusieurs restaurants ou boutiques depuis un seul dashboard. Parfait pour les chaînes.",
  },
];

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    price: "0€",
    period: "/mois",
    desc: "Pour tester la plateforme",
    features: ["1 établissement", "50 scans / mois", "Dashboard analytics", "Support email"],
    cta: "Commencer gratuitement",
    href: "/register",
  },
  {
    id: "starter",
    name: "Starter",
    price: "29€",
    period: "/mois",
    desc: "Pour les indépendants",
    features: ["3 établissements", "500 scans / mois", "Analytics avancés", "URL personnalisée", "Support prioritaire"],
    cta: "Essai 14 jours gratuit",
    href: "/register",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "79€",
    period: "/mois",
    desc: "Pour les chaînes et agences",
    features: ["Établissements illimités", "Scans illimités", "API access", "White label", "Account manager dédié"],
    cta: "Contacter l'équipe",
    href: "/register",
  },
];

const TESTIMONIALS = [
  {
    quote: "En 3 semaines j'ai doublé mes avis Google. Mes clients adorent tourner la roue après leur repas.",
    name: "Marie D.",
    role: "Restauratrice, Lyon",
  },
  {
    quote: "La mise en place a pris 10 minutes. Maintenant j'ai 15 nouveaux avis chaque semaine sans rien faire.",
    name: "Karim B.",
    role: "Gérant café, Paris",
  },
  {
    quote: "Mes clients reviennent plus souvent depuis qu'on a la roue. C'est un vrai boost pour la fidélité.",
    name: "Sophie M.",
    role: "Salon de coiffure, Bordeaux",
  },
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#fff", color: "#0F172A" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 64,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E2E8F0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #3B82F6, #0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-1px" }}>z</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.4px", color: "#0F172A" }}>zReview</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/login" style={{
            padding: "8px 18px", borderRadius: 10, textDecoration: "none",
            color: "#64748B", fontWeight: 600, fontSize: 14,
          }}>
            Connexion
          </Link>
          <Link href="/register" style={{
            padding: "9px 20px", borderRadius: 10, textDecoration: "none",
            background: "#2563EB", color: "#fff", fontWeight: 700, fontSize: 14,
            boxShadow: "0 2px 12px rgba(37,99,235,0.3)",
          }}>
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        background: "#0F172A",
        padding: "96px 24px 112px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Background blobs */}
        <div style={{
          position: "absolute", top: "10%", left: "10%", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "20%", right: "5%", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: 100, padding: "5px 14px", marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B82F6", display: "inline-block" }} />
            <span style={{ color: "#93C5FD", fontWeight: 600, fontSize: 13 }}>
              Sous-domaines personnalisés disponibles
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 6vw, 66px)",
            fontWeight: 800,
            color: "#F1F5F9",
            margin: "0 auto 20px",
            lineHeight: 1.15,
            maxWidth: 780,
            letterSpacing: "-1.5px",
          }}>
            Transformez chaque client en{" "}
            <span style={{
              background: "linear-gradient(135deg, #60A5FA, #0EA5E9)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              ambassadeur Google
            </span>
          </h1>

          <p style={{
            color: "#64748B", fontSize: 18, maxWidth: 520, margin: "0 auto 44px",
            lineHeight: 1.75, fontWeight: 400,
          }}>
            La roue de la fortune gamifiée qui booste vos avis Google automatiquement.
            Configurez en <strong style={{ color: "#94A3B8" }}>5 minutes</strong>, récoltez des avis à vie.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{
              padding: "15px 32px", borderRadius: 12, textDecoration: "none",
              background: "#2563EB", color: "#fff", fontWeight: 700, fontSize: 16,
              boxShadow: "0 8px 28px rgba(37,99,235,0.4)",
            }}>
              Commencer gratuitement
            </Link>
            <Link href="/login" style={{
              padding: "15px 32px", borderRadius: 12, textDecoration: "none",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#94A3B8", fontWeight: 600, fontSize: 16,
            }}>
              Se connecter →
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap",
            marginTop: 72, paddingTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            {[["500+", "Établissements"], ["98%", "Satisfaction"], ["4.8★", "Note Google"], ["<5min", "Setup moyen"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.5px" }}>{val}</div>
                <div style={{ fontSize: 13, color: "#475569", marginTop: 4, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "96px 24px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ color: "#2563EB", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Comment ça marche
            </p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
              Simple comme bonjour
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { n: "01", title: "Créez votre compte", desc: "Inscrivez-vous en 30 secondes. Configurez vos couleurs, vos récompenses et votre lien Google." },
              { n: "02", title: "Partagez votre QR code", desc: "Imprimez le QR code généré automatiquement. Affichez-le en caisse ou sur les tables." },
              { n: "03", title: "Regardez les avis arriver", desc: "Vos clients laissent un avis, reçoivent un code, jouent à la roue. Vous collectez des avis en continu." },
            ].map((item) => (
              <div key={item.n} style={{
                background: "#fff", borderRadius: 18, padding: "28px 28px",
                border: "1.5px solid #E2E8F0",
              }}>
                <div style={{
                  fontSize: 40, fontWeight: 800, color: "#EFF6FF",
                  lineHeight: 1, marginBottom: 18,
                }}>
                  {item.n}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px", color: "#0F172A" }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ color: "#2563EB", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Fonctionnalités
            </p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
              Tout ce dont vous avez besoin
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                padding: "24px 28px", borderRadius: 16,
                border: "1.5px solid #E2E8F0",
                background: "#FAFAFA",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "#EFF6FF",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#0F172A" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "96px 24px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ color: "#2563EB", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Tarifs
            </p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
              Simple et transparent
            </h2>
            <p style={{ color: "#64748B", fontSize: 16, marginTop: 12 }}>Sans engagement. Annulez quand vous voulez.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20 }}>
            {PLANS.map((plan) => (
              <div key={plan.id} style={{
                background: plan.highlight ? "#0F172A" : "#fff",
                borderRadius: 20, padding: "32px 28px",
                border: plan.highlight ? "none" : "1.5px solid #E2E8F0",
                boxShadow: plan.highlight ? "0 16px 48px rgba(15,23,42,0.3)" : "none",
                position: "relative",
                transform: plan.highlight ? "scale(1.03)" : "scale(1)",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                    background: "#2563EB", color: "#fff", fontWeight: 700, fontSize: 11,
                    padding: "4px 16px", borderRadius: 100, letterSpacing: 0.8,
                    textTransform: "uppercase", whiteSpace: "nowrap",
                  }}>
                    Le plus populaire
                  </div>
                )}

                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: plan.highlight ? "#60A5FA" : "#2563EB" }}>
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, marginBottom: 5 }}>
                  <span style={{ fontSize: 44, fontWeight: 800, color: plan.highlight ? "#F1F5F9" : "#0F172A", letterSpacing: "-1px", lineHeight: 1 }}>
                    {plan.price}
                  </span>
                  <span style={{ color: plan.highlight ? "#475569" : "#94A3B8", fontSize: 14, marginBottom: 7 }}>{plan.period}</span>
                </div>
                <p style={{ color: plan.highlight ? "#475569" : "#94A3B8", fontSize: 13, margin: "0 0 24px" }}>{plan.desc}</p>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 9 }}>
                  {plan.features.map((feat) => (
                    <li key={feat} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: plan.highlight ? "#CBD5E1" : "#475569" }}>
                      <span style={{ color: plan.highlight ? "#3B82F6" : "#10B981", fontWeight: 900, flexShrink: 0, fontSize: 14 }}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} style={{
                  display: "block", textAlign: "center", padding: "13px",
                  borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 14,
                  background: plan.highlight ? "#2563EB" : "transparent",
                  color: plan.highlight ? "#fff" : "#2563EB",
                  border: plan.highlight ? "none" : "2px solid #2563EB",
                  boxShadow: plan.highlight ? "0 4px 16px rgba(37,99,235,0.4)" : "none",
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ color: "#2563EB", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Témoignages
            </p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
              Ils nous font confiance
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{
                background: "#F8FAFC", borderRadius: 18, padding: "26px 28px",
                border: "1.5px solid #E2E8F0",
              }}>
                <div style={{ color: "#F59E0B", fontSize: 16, marginBottom: 14, letterSpacing: 1 }}>★★★★★</div>
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: "0 0 18px", fontStyle: "italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{
        background: "#0F172A",
        padding: "80px 24px", textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "clamp(26px, 5vw, 48px)",
          fontWeight: 800, color: "#F1F5F9", margin: "0 auto 14px",
          maxWidth: 640, lineHeight: 1.2, letterSpacing: "-0.5px",
        }}>
          Prêt à booster vos avis Google ?
        </h2>
        <p style={{ color: "#64748B", fontSize: 16, marginBottom: 32 }}>
          Rejoignez 500+ établissements qui utilisent zReview chaque jour.
        </p>
        <Link href="/register" style={{
          display: "inline-block", padding: "16px 36px", borderRadius: 12,
          background: "#2563EB", color: "#fff", textDecoration: "none",
          fontWeight: 700, fontSize: 16,
          boxShadow: "0 8px 28px rgba(37,99,235,0.4)",
        }}>
          Commencer gratuitement — Aucune CB requise
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#020617", padding: "36px 40px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: "linear-gradient(135deg, #3B82F6, #0EA5E9)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "-1px" }}>z</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, color: "#F1F5F9", letterSpacing: "-0.3px" }}>zReview</span>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[["Connexion", "/login"], ["Créer un compte", "/register"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
              <Link key={label} href={href} style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                {label}
              </Link>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "#334155" }}>© 2026 zReview</div>
        </div>
      </footer>
    </div>
  );
}
