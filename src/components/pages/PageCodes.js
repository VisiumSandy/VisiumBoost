"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { generateCode, uid } from "@/lib/utils";
import Icon from "@/components/Icon";

export default function PageCodes() {
  const { codes, setCodes } = useApp();
  const [genCount, setGenCount] = useState(10);

  const generate = () => {
    const newCodes = Array.from({ length: genCount }, () => ({
      id: uid(),
      code: generateCode(),
      used: false,
      createdAt: new Date().toISOString().split("T")[0],
      usedAt: null,
    }));
    setCodes((prev) => [...prev, ...newCodes]);
  };

  const markUsed = (id) => {
    setCodes((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, used: true, usedAt: new Date().toISOString().split("T")[0] }
          : c
      )
    );
  };

  const exportCSV = () => {
    const header = "Code,Statut,Date création,Date utilisation\n";
    const rows = codes
      .map((c) =>
        `${c.code},${c.used ? "Utilisé" : "Disponible"},${c.createdAt},${c.usedAt || ""}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codes-riwil-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const usedCount = codes.filter((c) => c.used).length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold text-dark-900 tracking-tight">
            Codes anti-fraude
          </h1>
          <p className="text-gray-400 text-sm mt-1.5">
            {codes.length} codes · {usedCount} utilisés
          </p>
        </div>
        <div className="flex gap-2.5 items-center flex-wrap">
          <select
            value={genCount}
            onChange={(e) => setGenCount(+e.target.value)}
            className="input-field w-auto"
          >
            {[5, 10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} codes
              </option>
            ))}
          </select>
          <button onClick={generate} className="btn-primary">
            <Icon name="plus" size={18} color="#fff" />
            Générer
          </button>
          <button onClick={exportCSV} className="btn-secondary">
            <Icon name="download" size={18} />
            CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-6 py-3.5 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
          <div>Code</div>
          <div>Statut</div>
          <div>Créé le</div>
          <div>Utilisé le</div>
          <div></div>
        </div>

        {codes.length === 0 && (
          <div className="py-10 text-center text-gray-300 text-sm">
            Aucun code généré
          </div>
        )}

        {codes
          .slice(-50)
          .reverse()
          .map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_80px] px-6 py-3 border-b border-gray-50 items-center text-sm gap-1 sm:gap-0"
            >
              <div className="font-mono font-semibold text-dark-900 tracking-wider">
                {c.code}
              </div>
              <div>
                <span className={c.used ? "badge-danger" : "badge-success"}>
                  {c.used ? "Utilisé" : "Disponible"}
                </span>
              </div>
              <div className="text-gray-400 text-[13px]">{c.createdAt}</div>
              <div className="text-gray-400 text-[13px]">{c.usedAt || "—"}</div>
              <div>
                {!c.used && (
                  <button
                    onClick={() => markUsed(c.id)}
                    className="border-none bg-transparent cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                    title="Marquer comme utilisé"
                  >
                    <Icon name="check" size={16} color="#00B894" />
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
