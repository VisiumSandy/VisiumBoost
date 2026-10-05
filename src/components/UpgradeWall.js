"use client";

import { useApp } from "@/lib/context";
import { PLANS, FEATURE_MIN_PLAN, FEATURE_LABELS } from "@/lib/plans";

// Carte affichée à la place d'une fonctionnalité que l'abonnement actuel n'inclut pas.
// `compact` : version réduite pour s'insérer dans une page (ex. éditeur de roue).
export default function UpgradeWall({ feature, compact = false }) {
  const { setCurrentPage } = useApp();
  const minPlan = PLANS[FEATURE_MIN_PLAN[feature] || "starter"];
  const label = FEATURE_LABELS[feature] || "Cette fonctionnalité";

  return (
    <div className="animate-fade-in" style={{
      textAlign: "center", background: "#fff", border: "1.5px dashed #CBD5E1", borderRadius: 18,
      padding: compact ? "22px 18px" : "56px 24px", maxWidth: compact ? "none" : 520, margin: compact ? 0 : "40px auto",
    }}>
      <div style={{
        width: compact ? 40 : 56, height: compact ? 40 : 56, borderRadius: "50%", background: "#EFF6FF",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
      }}>
        <svg width={compact ? 18 : 24} height={compact ? 18 : 24} viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </div>
      <h3 style={{ fontSize: compact ? 14 : 18, fontWeight: 800, color: "#0F172A", margin: "0 0 6px" }}>
        {label} : offre {minPlan.name}
      </h3>
      <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, margin: "0 auto 18px", maxWidth: 380 }}>
        Disponible à partir de l&apos;offre {minPlan.name} ({minPlan.priceLabel}/mois). Passez à l&apos;offre supérieure à tout moment, sans engagement.
      </p>
      <button onClick={() => setCurrentPage("subscription")} className="btn-primary" style={{ margin: "0 auto" }}>
        Voir les offres
      </button>
    </div>
  );
}
