"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import Icon from "@/components/Icon";

export default function PageAffiliation() {
  const refLink = "https://riwil.app/ref/MON-CODE-123";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold text-dark-900 tracking-tight">
          Programme d&apos;affiliation
        </h1>
        <p className="text-gray-400 text-sm mt-1.5">
          Parrainez des entreprises et gagnez des commissions
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-7">
        <StatCard icon="users" label="Filleuls actifs" value="3" color="#6C5CE7" />
        <StatCard icon="creditCard" label="Revenus gagnés" value="145 €" trend="+20%" color="#00B894" />
        <StatCard icon="trendUp" label="Taux conversion" value="18%" color="#E17055" />
      </div>

      <div className="card p-7">
        <h3 className="text-base font-bold text-dark-900 mb-3">
          Votre lien de parrainage
        </h3>
        <div className="flex gap-2.5">
          <input
            value={refLink}
            readOnly
            className="flex-1 px-4 py-3 rounded-[10px] border border-gray-200 text-sm font-mono outline-none bg-gray-50 text-brand-500"
          />
          <button
            onClick={copy}
            className="px-6 py-3 rounded-[10px] border-none font-bold text-sm text-white whitespace-nowrap transition-colors"
            style={{
              background: copied ? "#00B894" : "#6C5CE7",
              cursor: "pointer",
            }}
          >
            {copied ? "✓ Copié !" : "Copier"}
          </button>
        </div>
      </div>

      {/* Referral table */}
      <div className="card mt-6 overflow-hidden">
        <div className="px-7 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-dark-900">Vos filleuls</h3>
        </div>
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
          <div>Entreprise</div>
          <div>Date</div>
          <div>Statut</div>
          <div>Commission</div>
        </div>
        {[
          { name: "Pizzeria Roma", date: "2025-03-12", status: "Actif", commission: "58 €" },
          { name: "Boulangerie Martin", date: "2025-02-28", status: "Actif", commission: "45 €" },
          { name: "Garage Auto Plus", date: "2025-01-15", status: "Essai", commission: "42 €" },
        ].map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr] px-6 py-3.5 border-b border-gray-50 items-center text-sm gap-1 sm:gap-0"
          >
            <div className="font-semibold text-dark-900">{r.name}</div>
            <div className="text-gray-400 text-[13px]">{r.date}</div>
            <div>
              <span className={r.status === "Actif" ? "badge-success" : "badge-danger"}>
                {r.status}
              </span>
            </div>
            <div className="font-semibold text-dark-900">{r.commission}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
