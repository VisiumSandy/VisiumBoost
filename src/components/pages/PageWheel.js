"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { uid } from "@/lib/utils";
import Icon from "@/components/Icon";
import SpinWheel from "@/components/SpinWheel";
import Confetti from "@/components/Confetti";

export default function PageWheel() {
  const { wheelConfig, setWheelConfig } = useApp();
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { googleLink, socials, primaryColor, secondaryColor, ctaText, rewards } =
    wheelConfig;

  const update = (field, val) =>
    setWheelConfig((prev) => ({ ...prev, [field]: val }));

  // ─── Rewards helpers ──────────────────────────────
  const addReward = () =>
    update("rewards", [...rewards, { id: uid(), name: "", prob: 0 }]);

  const removeReward = (i) =>
    update("rewards", rewards.filter((_, idx) => idx !== i));

  const updateReward = (i, field, val) => {
    const next = [...rewards];
    next[i] = {
      ...next[i],
      [field]: field === "prob" ? Math.max(0, Math.min(100, +val || 0)) : val,
    };
    update("rewards", next);
  };

  const totalProb = rewards.reduce((s, r) => s + r.prob, 0);

  // ─── Socials helpers ──────────────────────────────
  const addSocial = () => update("socials", [...socials, ""]);
  const removeSocial = (i) =>
    update("socials", socials.filter((_, idx) => idx !== i));
  const updateSocial = (i, val) => {
    const next = [...socials];
    next[i] = val;
    update("socials", next);
  };

  // ─── Step indicator ───────────────────────────────
  const steps = [
    { n: 1, label: "Lien d'avis" },
    { n: 2, label: "Personnalisation" },
    { n: 3, label: "Récompenses" },
  ];

  return (
    <div className="animate-fade-in">
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold text-dark-900 tracking-tight">
            Ma Roue
          </h1>
          <p className="text-gray-400 text-sm mt-1.5">
            Configurez votre roue de la fortune en 3 étapes
          </p>
        </div>
        <button
          onClick={() => setPreviewOpen(!previewOpen)}
          className={previewOpen ? "btn-primary" : "btn-secondary"}
        >
          <Icon name="eye" size={18} color={previewOpen ? "#fff" : undefined} />
          Aperçu
        </button>
      </div>

      {/* Step indicators */}
      <div className="flex gap-3 mb-8 items-center flex-wrap">
        {steps.map((s, idx) => (
          <div key={s.n} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.n)}
              className="w-9 h-9 rounded-full border-none font-extrabold text-sm transition-all duration-200"
              style={{
                background: step >= s.n ? "#6C5CE7" : "#e8e8f0",
                color: step >= s.n ? "#fff" : "#8b8da0",
                cursor: "pointer",
              }}
            >
              {s.n}
            </button>
            <span
              className="text-[13px]"
              style={{
                fontWeight: step === s.n ? 700 : 500,
                color: step === s.n ? "#0F0F1A" : "#8b8da0",
              }}
            >
              {s.label}
            </span>
            {idx < 2 && (
              <div
                className="w-10 h-0.5 rounded-full ml-1"
                style={{ background: step > s.n ? "#6C5CE7" : "#e8e8f0" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ═══════════ STEP 1 ═══════════ */}
      {step === 1 && (
        <div className="card p-7">
          <h3 className="text-[17px] font-bold text-dark-900 mb-5 flex items-center gap-2">
            <Icon name="link" size={20} color="#6C5CE7" />
            Lien d&apos;avis Google
          </h3>

          <div className="flex gap-2.5 mb-6">
            <input
              value={googleLink}
              onChange={(e) => update("googleLink", e.target.value)}
              placeholder="https://g.page/r/votre-lien-avis"
              className="input-field flex-1"
            />
            <button
              className="w-11 h-11 rounded-[10px] border-none flex items-center justify-center shrink-0"
              style={{
                background: googleLink ? "#00B894" : "#e8e8f0",
                cursor: "pointer",
              }}
            >
              <Icon
                name="check"
                size={20}
                color={googleLink ? "#fff" : "#b2bec3"}
              />
            </button>
          </div>

          <h4 className="text-sm font-semibold text-gray-400 mb-3">
            Liens réseaux sociaux (facultatif)
          </h4>

          {socials.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={s}
                onChange={(e) => updateSocial(i, e.target.value)}
                placeholder="https://instagram.com/..."
                className="input-field flex-1"
              />
              <button
                onClick={() => removeSocial(i)}
                className="border-none bg-transparent cursor-pointer"
              >
                <Icon name="trash" size={16} color="#e17055" />
              </button>
            </div>
          ))}

          <button
            onClick={addSocial}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-dashed border-gray-300 bg-transparent text-brand-500 text-[13px] font-semibold cursor-pointer hover:border-brand-500 transition-colors"
          >
            <Icon name="plus" size={16} color="#6C5CE7" />
            Ajouter un réseau
          </button>

          <div className="flex justify-end mt-6">
            <button onClick={() => setStep(2)} className="btn-primary">
              Suivant
              <Icon name="chevronRight" size={18} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ STEP 2 ═══════════ */}
      {step === 2 && (
        <div className="card p-7">
          <h3 className="text-[17px] font-bold text-dark-900 mb-6">
            Personnalisation
          </h3>

          <div className="flex flex-wrap gap-6 mb-6">
            {/* Primary color */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-semibold text-gray-400 block mb-2">
                Couleur principale
              </label>
              <div className="flex gap-2.5 items-center">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  className="w-11 h-11 rounded-[10px] border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  value={primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  className="w-[100px] px-3 py-2.5 rounded-[10px] border border-gray-200 text-[13px] font-mono outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Secondary color */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-semibold text-gray-400 block mb-2">
                Couleur secondaire
              </label>
              <div className="flex gap-2.5 items-center">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => update("secondaryColor", e.target.value)}
                  className="w-11 h-11 rounded-[10px] border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  value={secondaryColor}
                  onChange={(e) => update("secondaryColor", e.target.value)}
                  className="w-[100px] px-3 py-2.5 rounded-[10px] border border-gray-200 text-[13px] font-mono outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* CTA text */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-400 block mb-2">
              Texte d&apos;invitation (call-to-action)
            </label>
            <input
              value={ctaText}
              onChange={(e) => update("ctaText", e.target.value)}
              placeholder="Laissez-nous un avis et tentez votre chance !"
              className="input-field"
            />
          </div>

          {/* Logo upload */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-400 block mb-2">
              Logo de votre entreprise
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-[14px] p-8 text-center cursor-pointer transition-colors hover:border-brand-500"
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="text-[32px] mb-2">📁</div>
              <div className="text-gray-400 text-sm">
                Glissez votre logo ici ou{" "}
                <span className="text-brand-500 font-semibold">parcourir</span>
              </div>
              <div className="text-gray-300 text-xs mt-1">
                PNG, JPG · Max 2 Mo
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="btn-secondary">
              Retour
            </button>
            <button onClick={() => setStep(3)} className="btn-primary">
              Suivant
              <Icon name="chevronRight" size={18} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ STEP 3 ═══════════ */}
      {step === 3 && (
        <div className="card p-7">
          <h3 className="text-[17px] font-bold text-dark-900 mb-1.5 flex items-center gap-2">
            <Icon name="gift" size={20} color="#6C5CE7" />
            Récompenses
          </h3>
          <p className="text-gray-400 text-[13px] mb-5">
            Total des probabilités :{" "}
            <strong style={{ color: totalProb === 100 ? "#00B894" : "#e17055" }}>
              {totalProb}%
            </strong>
            {totalProb !== 100 && (
              <span className="text-danger text-xs ml-2">
                ⚠ Doit être = 100%
              </span>
            )}
          </p>

          {rewards.map((r, i) => (
            <div key={r.id || i} className="flex gap-2.5 mb-2.5 items-center flex-wrap">
              <input
                value={r.name}
                onChange={(e) => updateReward(i, "name", e.target.value)}
                placeholder="Nom de la récompense"
                className="input-field flex-[2_1_180px]"
              />
              <div className="flex items-center gap-1 flex-[0_0_100px]">
                <input
                  type="number"
                  value={r.prob}
                  onChange={(e) => updateReward(i, "prob", e.target.value)}
                  min={0}
                  max={100}
                  className="w-[70px] px-2.5 py-2.5 rounded-[10px] border border-gray-200 text-sm text-center outline-none focus:border-brand-500"
                />
                <span className="text-gray-400 font-bold">%</span>
              </div>
              <button
                onClick={() => removeReward(i)}
                className="border-none bg-transparent cursor-pointer"
              >
                <Icon name="trash" size={16} color="#e17055" />
              </button>
            </div>
          ))}

          <button
            onClick={addReward}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] mt-2 border border-dashed border-gray-300 bg-transparent text-brand-500 text-[13px] font-semibold cursor-pointer hover:border-brand-500 transition-colors"
          >
            <Icon name="plus" size={16} color="#6C5CE7" />
            Ajouter récompense
          </button>

          <div className="flex justify-between mt-7">
            <button onClick={() => setStep(2)} className="btn-secondary">
              Retour
            </button>
            <button
              onClick={() => setPreviewOpen(true)}
              disabled={totalProb !== 100}
              className="flex items-center gap-2 px-7 py-[11px] rounded-[10px] border-none font-bold text-sm text-white"
              style={{
                background: totalProb === 100 ? "#00B894" : "#b2bec3",
                cursor: totalProb === 100 ? "pointer" : "not-allowed",
              }}
            >
              Enregistrer & Aperçu
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ WHEEL PREVIEW ═══════════ */}
      {previewOpen && rewards.length > 0 && rewards.some((r) => r.name) && (
        <div className="card p-7 mt-6 text-center">
          <h3 className="text-[17px] font-bold text-dark-900 mb-1.5">
            Aperçu de la roue
          </h3>
          <p className="text-gray-400 text-[13px] mb-6">{ctaText}</p>
          <SpinWheel
            rewards={rewards.filter((r) => r.name)}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onResult={() => {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 4000);
            }}
          />
        </div>
      )}
    </div>
  );
}
