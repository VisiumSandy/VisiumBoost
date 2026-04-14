"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

export default function PageAffiliation() {
  const [copied, setCopied] = useState(false);

  // The referral code would come from the user's profile in a real implementation
  const refCode = "MON-CODE";
  const refLink = typeof window !== "undefined"
    ? `${window.location.origin}/ref/${refCode}`
    : `/ref/${refCode}`;

  const copy = () => {
    navigator.clipboard?.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Programme d&apos;affiliation</h1>
        <p className="text-slate-400 text-sm mt-1">Parrainez des entreprises et gagnez des commissions</p>
      </div>

      {/* Coming soon banner */}
      <div style={{
        background: "linear-gradient(135deg, #EFF6FF, #F0F9FF)",
        border: "1.5px solid #BFDBFE",
        borderRadius: 16, padding: "20px 24px", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "linear-gradient(135deg, #3B82F6, #0EA5E9)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name="link" size={22} color="#fff" />
        </div>
        <div>
          <p style={{ fontWeight: 700, color: "#1E40AF", margin: "0 0 3px", fontSize: 15 }}>
            Programme d&apos;affiliation — Bientôt disponible
          </p>
          <p style={{ color: "#3B82F6", fontSize: 13, margin: 0 }}>
            Le système de parrainage est en cours de déploiement. Votre lien de parrainage est prêt à être partagé.
          </p>
        </div>
      </div>

      {/* Referral link */}
      <div className="card p-6 mb-5">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 5 }}>
          Votre lien de parrainage
        </h3>
        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>
          Partagez ce lien avec d&apos;autres établissements pour gagner une commission sur chaque abonnement souscrit.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={refLink}
            readOnly
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 10,
              border: "1.5px solid #E2E8F0", fontSize: 13,
              fontFamily: "'DM Mono', monospace", background: "#F8FAFC",
              color: "#2563EB", outline: "none",
            }}
          />
          <button
            onClick={copy}
            className="btn-primary"
            style={{ whiteSpace: "nowrap" }}
          >
            {copied ? "✓ Copié !" : "Copier"}
          </button>
        </div>
      </div>

      {/* Commission table */}
      <div className="card p-6">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
          Barème des commissions
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { plan: "Starter", price: "29 €/mois", commission: "20%", amount: "~5,80 €/mois" },
            { plan: "Pro", price: "79 €/mois", commission: "20%", amount: "~15,80 €/mois" },
          ].map(item => (
            <div key={item.plan} style={{
              padding: "16px", borderRadius: 12, border: "1.5px solid #E2E8F0",
              background: "#FAFAFA",
            }}>
              <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{item.plan}</div>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>{item.price}</div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: "#2563EB",
                background: "#EFF6FF", padding: "4px 10px", borderRadius: 6, display: "inline-block",
              }}>
                {item.commission} → {item.amount}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 16 }}>
          * Les commissions sont versées mensuellement par virement bancaire. Minimum de versement : 50 €.
        </p>
      </div>
    </div>
  );
}
