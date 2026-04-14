"use client";

import Icon from "@/components/Icon";

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    price: "0 €",
    period: "/mois",
    desc: "Pour démarrer et tester",
    features: [
      "1 établissement",
      "50 scans/mois",
      "Roue personnalisée",
      "Support email",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "29 €",
    period: "/mois",
    desc: "Pour les petits établissements",
    features: [
      "3 établissements",
      "500 scans/mois",
      "Analytics avancés",
      "Support prioritaire",
      "Export des données",
    ],
    recommended: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "79 €",
    period: "/mois",
    desc: "Pour les établissements en croissance",
    features: [
      "Établissements illimités",
      "Scans illimités",
      "Analytics en temps réel",
      "Support dédié",
      "White label",
      "API access",
    ],
  },
];

const FAQ = [
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement est effectif immédiatement.",
  },
  {
    q: "Y a-t-il un engagement ?",
    a: "Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.",
  },
  {
    q: "Comment fonctionne le plan gratuit ?",
    a: "Le plan gratuit est illimité dans le temps. Vous pouvez tester zReview sans carte bancaire.",
  },
];

export default function PageSubscription({ user }) {
  const currentPlan = user?.plan || "free";

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Choisissez votre plan</h1>
        <p className="text-slate-400 text-sm mt-1.5">
          Sans engagement · Changez de plan à tout moment
        </p>
      </div>

      <div className="flex flex-wrap gap-5 justify-center mb-10">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              style={{
                flex: "1 1 250px", maxWidth: 320,
                background: "#fff",
                borderRadius: 20,
                padding: "28px 24px",
                position: "relative",
                border: plan.recommended
                  ? "2px solid #2563EB"
                  : "1.5px solid #E2E8F0",
                boxShadow: plan.recommended
                  ? "0 8px 32px rgba(37,99,235,0.12)"
                  : "0 1px 4px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.2s",
              }}
            >
              {plan.recommended && (
                <div style={{
                  position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                  background: "#2563EB", color: "#fff",
                  padding: "4px 16px", borderRadius: 9999,
                  fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8,
                  whiteSpace: "nowrap",
                }}>
                  Recommandé
                </div>
              )}

              <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600, color: plan.recommended ? "#2563EB" : "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {plan.name}
              </div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: "#0F172A", letterSpacing: "-1px" }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: 14, color: "#94A3B8", marginLeft: 2 }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 20px" }}>{plan.desc}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {plan.features.map((feat, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", background: "#EFF6FF",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon name="check" size={11} color="#2563EB" />
                    </div>
                    <span style={{ fontSize: 13, color: "#475569" }}>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={isCurrent}
                style={{
                  width: "100%", padding: "12px", borderRadius: 12,
                  border: isCurrent ? "1.5px solid #E2E8F0" : "none",
                  background: isCurrent
                    ? "#F8FAFC"
                    : plan.recommended
                    ? "#2563EB"
                    : "#0F172A",
                  color: isCurrent ? "#94A3B8" : "#fff",
                  fontWeight: 700, fontSize: 14,
                  cursor: isCurrent ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {isCurrent ? "Plan actuel" : `Choisir ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="card p-6 max-w-2xl mx-auto">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 18 }}>
          Questions fréquentes
        </h3>
        {FAQ.map((faq, i) => (
          <div
            key={i}
            style={{
              paddingBottom: i < FAQ.length - 1 ? 14 : 0,
              marginBottom: i < FAQ.length - 1 ? 14 : 0,
              borderBottom: i < FAQ.length - 1 ? "1px solid #F1F5F9" : "none",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 5 }}>{faq.q}</div>
            <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{faq.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
