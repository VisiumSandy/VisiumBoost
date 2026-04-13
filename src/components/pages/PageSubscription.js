"use client";

import Icon from "@/components/Icon";

const PLANS = [
  {
    name: "Starter",
    price: "0 €",
    period: "/mois",
    features: ["1 roue", "100 codes/mois", "Stats basiques", "Support email"],
    current: true,
  },
  {
    name: "Pro",
    price: "29 €",
    period: "/mois",
    features: [
      "Roues illimitées",
      "Codes illimités",
      "Stats avancées",
      "Support prioritaire",
      "Export CSV",
      "Personnalisation complète",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "99 €",
    period: "/mois",
    features: [
      "Tout Pro +",
      "API access",
      "White label",
      "Account manager",
      "SLA garanti",
      "Intégrations custom",
    ],
  },
];

export default function PageSubscription() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-[28px] font-extrabold text-dark-900 tracking-tight">
          Abonnement
        </h1>
        <p className="text-gray-400 text-sm mt-1.5">
          Choisissez le plan adapté à vos besoins
        </p>
      </div>

      <div className="flex flex-wrap gap-5 justify-center">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-[20px] p-8 flex-1 min-w-[260px] max-w-[320px] relative"
            style={{
              border: plan.recommended
                ? "2px solid #6C5CE7"
                : "1px solid #f0f0f5",
              boxShadow: plan.recommended
                ? "0 8px 30px rgba(108,92,231,0.12)"
                : "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
                Recommandé
              </div>
            )}

            <h3 className="text-xl font-extrabold text-dark-900 mb-1">
              {plan.name}
            </h3>

            <div className="mb-5">
              <span className="text-4xl font-black text-dark-900">
                {plan.price}
              </span>
              <span className="text-sm text-gray-400">{plan.period}</span>
            </div>

            {plan.features.map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 mb-2.5 text-sm text-gray-500"
              >
                <Icon name="check" size={16} color="#00B894" />
                {feat}
              </div>
            ))}

            <button
              className="w-full py-3 rounded-[10px] mt-4 font-bold text-sm transition-colors"
              style={{
                border: plan.current ? "1px solid #e8e8f0" : "none",
                background: plan.current
                  ? "#fff"
                  : plan.recommended
                  ? "#6C5CE7"
                  : "#f0f0f5",
                color: plan.current
                  ? "#8b8da0"
                  : plan.recommended
                  ? "#fff"
                  : "#0F0F1A",
                cursor: plan.current ? "default" : "pointer",
              }}
            >
              {plan.current ? "Plan actuel" : "Choisir ce plan"}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="card p-7 mt-8 max-w-2xl mx-auto">
        <h3 className="text-base font-bold text-dark-900 mb-4">
          Questions fréquentes
        </h3>
        {[
          {
            q: "Puis-je changer de plan à tout moment ?",
            a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement est effectif immédiatement.",
          },
          {
            q: "Y a-t-il un engagement ?",
            a: "Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.",
          },
          {
            q: "Comment fonctionne l'essai gratuit ?",
            a: "Le plan Starter est gratuit et illimité dans le temps. Vous pouvez tester Riwil sans carte bancaire.",
          },
        ].map((faq, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="text-sm font-bold text-dark-900 mb-1">{faq.q}</div>
            <div className="text-[13px] text-gray-400 leading-relaxed">
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
