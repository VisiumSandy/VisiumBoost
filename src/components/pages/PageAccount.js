"use client";

import Icon from "@/components/Icon";

export default function PageAccount() {
  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold text-dark-900 tracking-tight">
          Mon compte
        </h1>
        <p className="text-gray-400 text-sm mt-1.5">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="card p-7">
        {/* Avatar + name */}
        <div className="flex gap-5 items-center mb-7 flex-wrap">
          <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-400 shrink-0">
            <span className="text-white font-black text-[28px]">JD</span>
          </div>
          <div>
            <div className="text-xl font-extrabold text-dark-900">
              Jean Dupont
            </div>
            <div className="text-sm text-gray-400">jean.dupont@email.com</div>
            <div className="badge-success mt-2">Plan Starter</div>
          </div>
        </div>

        {/* Form fields */}
        {[
          ["Nom complet", "Jean Dupont", "text"],
          ["Email", "jean.dupont@email.com", "email"],
          ["Téléphone", "+33 6 12 34 56 78", "tel"],
          ["Entreprise", "Restaurant Le Gourmet", "text"],
        ].map(([label, val, type]) => (
          <div key={label} className="mb-4">
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">
              {label}
            </label>
            <input
              type={type}
              defaultValue={val}
              className="input-field"
            />
          </div>
        ))}

        <button className="btn-primary mt-2">
          Sauvegarder les modifications
        </button>
      </div>

      {/* Danger zone */}
      <div className="card p-7 mt-6 border-danger/20">
        <h3 className="text-base font-bold text-danger mb-2">Zone de danger</h3>
        <p className="text-[13px] text-gray-400 mb-4">
          Ces actions sont irréversibles. Procédez avec prudence.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] border border-gray-200 bg-white text-gray-500 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors">
            Exporter mes données
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] border border-danger/30 bg-white text-danger text-sm font-semibold cursor-pointer hover:bg-danger/5 transition-colors">
            <Icon name="trash" size={16} color="#E17055" />
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}
