"use client";

import { useState } from "react";
import { isAccessAllowed, trialDaysLeft } from "@/lib/utils";
import Icon from "@/components/Icon";

const PLANS = [
  {
    id: "free",
    name: "Essentiel",
    price: "9,99 €",
    period: "/mois",
    desc: "Pour démarrer après l'essai gratuit",
    features: [
      "1 établissement",
      "100 scans/mois",
      "Roue personnalisée",
      "Codes anti-fraude",
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
    q: "Comment fonctionne l'essai gratuit ?",
    a: "À l'inscription, vous bénéficiez de 14 jours d'accès complet et gratuit, sans carte bancaire. À l'issue de cette période, choisissez un plan pour continuer.",
  },
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement est effectif immédiatement.",
  },
  {
    q: "Y a-t-il un engagement ?",
    a: "Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.",
  },
  {
    q: "Que se passe-t-il si mon essai expire ?",
    a: "Votre accès au tableau de bord est restreint et la roue de vos établissements est mise en pause. Vos données sont conservées — souscrivez un plan pour tout récupérer instantanément.",
  },
];

export default function PageSubscription({ user }) {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const currentPlan = user?.plan || "free";
  const hasAccess   = isAccessAllowed(user);
  const daysLeft    = trialDaysLeft(user);
  const isAdmin     = user?.role === "admin";
  const hasPaid     = user?.stripeSubscriptionId;

  const handleSubscribe = async (planId) => {
    setLoadingPlan(planId);
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
      else alert(d.error || "Erreur lors de la redirection vers le paiement");
    } catch {
      alert("Erreur réseau. Réessayez.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const r = await fetch("/api/stripe/portal", { method: "POST" });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
      else alert(d.error || "Erreur portail");
    } catch {
      alert("Erreur réseau. Réessayez.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Choisissez votre plan</h1>
        <p className="text-slate-400 text-sm mt-1.5">
          14 jours offerts · Sans engagement · Sans carte bancaire
        </p>
      </div>

      {/* Expired trial alert */}
      {!isAdmin && !hasAccess && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 14,
          background: "#FEF2F2", border: "1.5px solid #FECACA",
          borderRadius: 14, padding: "16px 20px", marginBottom: 28,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#DC2626", fontSize: 14, marginBottom: 3 }}>Votre essai gratuit est terminé</div>
            <div style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.6 }}>
              Votre accès au tableau de bord est restreint et votre roue est hors ligne. Choisissez un plan ci-dessous pour rétablir l&apos;accès immédiatement.
            </div>
          </div>
        </div>
      )}

      {/* Active trial info */}
      {!isAdmin && hasAccess && daysLeft > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "#FFFBEB", border: "1.5px solid #FDE68A",
          borderRadius: 12, padding: "12px 18px", marginBottom: 24,
          fontSize: 13, color: "#92400E",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Essai gratuit en cours — <strong>{daysLeft} jour{daysLeft > 1 ? "s" : ""} restant{daysLeft > 1 ? "s" : ""}</strong>. Souscrivez un plan avant expiration pour ne pas interrompre le service.</span>
        </div>
      )}

      <div className="flex flex-wrap gap-5 justify-center mb-10">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id && (hasAccess || isAdmin);
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
                disabled={isCurrent || loadingPlan === plan.id}
                onClick={() => !isCurrent && handleSubscribe(plan.id)}
                style={{
                  width: "100%", padding: "12px", borderRadius: 12,
                  border: isCurrent ? "1.5px solid #E2E8F0" : "none",
                  background: isCurrent
                    ? "#F8FAFC"
                    : loadingPlan === plan.id
                    ? "#94A3B8"
                    : plan.recommended
                    ? "#2563EB"
                    : "#0F172A",
                  color: isCurrent ? "#94A3B8" : "#fff",
                  fontWeight: 700, fontSize: 14,
                  cursor: isCurrent || loadingPlan === plan.id ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {isCurrent
                  ? "Plan actuel"
                  : loadingPlan === plan.id
                  ? "Redirection…"
                  : `Choisir ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Manage subscription */}
      {hasPaid && (
        <div className="card p-5 max-w-2xl mx-auto mb-6" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontWeight:700, color:"#0F172A", fontSize:14, marginBottom:3 }}>Gérer mon abonnement</div>
            <div style={{ fontSize:13, color:"#64748B" }}>Modifier votre plan, mettre à jour votre moyen de paiement ou annuler votre abonnement.</div>
          </div>
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            style={{
              padding:"10px 20px", borderRadius:10, border:"1.5px solid #E2E8F0",
              background: portalLoading ? "#F8FAFC" : "#fff", fontWeight:700, fontSize:13,
              color: portalLoading ? "#94A3B8" : "#0F172A", cursor: portalLoading ? "default" : "pointer",
              flexShrink:0, transition:"all 0.2s",
            }}
          >
            {portalLoading ? "Chargement…" : "Portail de facturation →"}
          </button>
        </div>
      )}

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
