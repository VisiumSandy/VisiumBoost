"use client";

import { useState, useEffect, useRef } from "react";
import { uid } from "@/lib/utils";
import Icon from "@/components/Icon";
import SpinWheel from "@/components/SpinWheel";
import Confetti from "@/components/Confetti";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://visium-boost.fr";

const DEFAULT_CONFIG = {
  googleLink: "",
  primaryColor: "#3B82F6",
  secondaryColor: "#0EA5E9",
  ctaText: "Laissez-nous un avis et tentez votre chance !",
  rewards: [],
};

// Charge les champs d'une Entreprise dans le format interne de PageWheel
function entrepriseToConfig(e) {
  return {
    googleLink:     e.lien_avis            || "",
    primaryColor:   e.couleur_principale   || "#3B82F6",
    secondaryColor: e.couleur_secondaire   || "#0EA5E9",
    ctaText:        e.cta_text             || DEFAULT_CONFIG.ctaText,
    // Entreprise stocke "probability", PageWheel utilise "prob" en interne
    rewards: (e.rewards || []).map(r => ({
      id:   r.id || r._id?.toString() || uid(),
      name: r.name || "",
      prob: r.probability ?? 0,
    })),
  };
}

export default function PageWheel() {
  const [entreprises, setEntreprises]   = useState([]);
  const [selectedId, setSelectedId]     = useState(null);
  const [config, setConfig]             = useState(DEFAULT_CONFIG);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [step, setStep]                 = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [previewOpen, setPreviewOpen]   = useState(false);
  const [copiedSlug, setCopiedSlug]     = useState(null);
  const qrCanvasRefs = useRef({});

  // ─── Chargement initial ─────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/entreprises")
      .then(r => r.json())
      .then(d => {
        const list = d.entreprises || [];
        setEntreprises(list);
        if (list.length > 0) {
          setSelectedId(list[0]._id);
          setConfig(entrepriseToConfig(list[0]));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ─── Changement d'entreprise sélectionnée ───────────────────────────
  const handleSelectEntreprise = (id) => {
    setSelectedId(id);
    const e = entreprises.find(x => x._id === id);
    if (e) setConfig(entrepriseToConfig(e));
    setSaved(false);
  };

  // ─── Helpers état config ────────────────────────────────────────────
  const update = (field, val) => setConfig(prev => ({ ...prev, [field]: val }));

  const addReward = () =>
    update("rewards", [...config.rewards, { id: uid(), name: "", prob: 0 }]);

  const removeReward = (i) =>
    update("rewards", config.rewards.filter((_, idx) => idx !== i));

  const updateReward = (i, field, val) => {
    const next = [...config.rewards];
    next[i] = {
      ...next[i],
      [field]: field === "prob" ? Math.max(0, Math.min(100, +val || 0)) : val,
    };
    update("rewards", next);
  };

  // ─── Sauvegarde → PATCH /api/entreprises (modèle Entreprise) ────────
  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true); setSaved(false);
    try {
      const r = await fetch("/api/entreprises", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedId,
          lien_avis:           config.googleLink,
          couleur_principale:  config.primaryColor,
          couleur_secondaire:  config.secondaryColor,
          cta_text:            config.ctaText,
          // Remap "prob" → "probability" pour le modèle Entreprise
          rewards: config.rewards.map(r => ({
            id:          r.id,
            name:        r.name,
            probability: r.prob,
          })),
        }),
      });
      if (r.ok) {
        // Mettre à jour la liste locale pour refléter les nouvelles valeurs
        const { entreprise: updated } = await r.json();
        setEntreprises(prev => prev.map(e => e._id === updated._id ? updated : e));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    setSaving(false);
  };

  // ─── QR Code ────────────────────────────────────────────────────────
  const getPublicUrl = (slug) => `${APP_URL}/roue/${slug}`;

  const copyLink = async (slug) => {
    await navigator.clipboard.writeText(getPublicUrl(slug));
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const downloadQR = (slug) => {
    const canvas = qrCanvasRefs.current[slug];
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-${slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const QRCanvas = ({ slug }) => {
    const ref = useRef(null);
    useEffect(() => {
      if (!ref.current) return;
      qrCanvasRefs.current[slug] = ref.current;
      import("qrcode").then(QRCode => {
        QRCode.toCanvas(ref.current, getPublicUrl(slug), {
          width: 160, margin: 2,
          color: { dark: "#0F172A", light: "#ffffff" },
        }).catch(() => {});
      });
    }, [slug]);
    return <canvas ref={ref} style={{ borderRadius: 10 }} />;
  };

  const totalProb = config.rewards.reduce((s, r) => s + (r.prob || 0), 0);

  const STEPS = [
    { n: 1, label: "Lien d'avis" },
    { n: 2, label: "Personnalisation" },
    { n: 3, label: "Récompenses" },
  ];

  const inp = {
    width: "100%", padding: "10px 13px", borderRadius: 10,
    border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none",
    background: "#fff", boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
  };

  // ─── Loading ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ma Roue</h1>
        </div>
        <div className="card p-12 text-center text-slate-300 text-sm">Chargement…</div>
      </div>
    );
  }

  // ─── Aucune entreprise ───────────────────────────────────────────────
  if (entreprises.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ma Roue</h1>
        </div>
        <div className="card p-12 text-center">
          <div style={{ fontSize: 40, marginBottom: 14 }}>🏪</div>
          <p style={{ fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
            Aucun établissement trouvé
          </p>
          <p style={{ color: "#94A3B8", fontSize: 13 }}>
            Créez d&apos;abord un établissement dans{" "}
            <strong>Mes entreprises</strong> pour configurer votre roue.
          </p>
        </div>
      </div>
    );
  }

  const selectedEntreprise = entreprises.find(e => e._id === selectedId);

  return (
    <div className="animate-fade-in">
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ma Roue</h1>
          <p className="text-slate-400 text-sm mt-1">Configurez votre roue de la fortune en 3 étapes</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {saved && (
            <span style={{
              padding: "8px 14px", borderRadius: 10, background: "#F0FDF4",
              border: "1.5px solid #BBF7D0", color: "#16A34A", fontSize: 13, fontWeight: 600,
            }}>
              ✓ Sauvegardé
            </span>
          )}
          <button
            onClick={() => setPreviewOpen(!previewOpen)}
            className={previewOpen ? "btn-primary" : "btn-secondary"}
          >
            <Icon name="eye" size={16} color={previewOpen ? "#fff" : undefined} />
            Aperçu
          </button>
        </div>
      </div>

      {/* Sélecteur d'établissement */}
      {entreprises.length > 1 && (
        <div className="card p-4 mb-5">
          <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 7 }}>
            Établissement à configurer
          </label>
          <select
            value={selectedId || ""}
            onChange={e => handleSelectEntreprise(e.target.value)}
            style={{
              ...inp, width: "auto", minWidth: 260, padding: "9px 13px",
              cursor: "pointer",
            }}
            onFocus={e => e.target.style.borderColor = "#3B82F6"}
            onBlur={e => e.target.style.borderColor = "#E2E8F0"}
          >
            {entreprises.map(e => (
              <option key={e._id} value={e._id}>{e.nom}</option>
            ))}
          </select>
        </div>
      )}

      {/* Step indicators */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
        {STEPS.map((s, idx) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setStep(s.n)}
              style={{
                width: 32, height: 32, borderRadius: "50%", border: "none",
                background: step >= s.n ? "#2563EB" : "#E2E8F0",
                color: step >= s.n ? "#fff" : "#94A3B8",
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {s.n}
            </button>
            <span style={{
              fontSize: 13, fontWeight: step === s.n ? 700 : 500,
              color: step === s.n ? "#0F172A" : "#94A3B8",
            }}>
              {s.label}
            </span>
            {idx < 2 && (
              <div style={{
                width: 32, height: 2, borderRadius: 9999, marginLeft: 2,
                background: step > s.n ? "#2563EB" : "#E2E8F0",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* STEP 1 — Lien Google */}
      {step === 1 && (
        <div className="card p-6">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="link" size={18} color="#2563EB" />
            Lien d&apos;avis Google
          </h3>
          <input
            value={config.googleLink}
            onChange={e => update("googleLink", e.target.value)}
            placeholder="https://g.page/r/votre-lien-avis"
            style={inp}
            onFocus={e => e.target.style.borderColor = "#3B82F6"}
            onBlur={e => e.target.style.borderColor = "#E2E8F0"}
          />
          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>
            Récupérez ce lien depuis votre fiche Google Business → Obtenir plus d&apos;avis
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button onClick={() => setStep(2)} className="btn-primary">
              Suivant
              <Icon name="chevronRight" size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — Personnalisation */}
      {step === 2 && (
        <div className="card p-6">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>
            Personnalisation
          </h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
            {[
              ["Couleur principale", "primaryColor"],
              ["Couleur secondaire", "secondaryColor"],
            ].map(([label, field]) => (
              <div key={field} style={{ flex: "1 1 200px" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>
                  {label}
                </label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="color"
                    value={config[field]}
                    onChange={e => update(field, e.target.value)}
                    style={{ width: 38, height: 34, borderRadius: 8, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2 }}
                  />
                  <input
                    value={config[field]}
                    onChange={e => update(field, e.target.value)}
                    style={{ ...inp, flex: 1, padding: "7px 10px", fontFamily: "'DM Mono', monospace" }}
                    onFocus={e => e.target.style.borderColor = "#3B82F6"}
                    onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>
              Texte d&apos;invitation (call-to-action)
            </label>
            <input
              value={config.ctaText}
              onChange={e => update("ctaText", e.target.value)}
              placeholder="Laissez-nous un avis et tentez votre chance !"
              style={inp}
              onFocus={e => e.target.style.borderColor = "#3B82F6"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button onClick={() => setStep(1)} className="btn-secondary">Retour</button>
            <button onClick={() => setStep(3)} className="btn-primary">
              Suivant
              <Icon name="chevronRight" size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Récompenses */}
      {step === 3 && (
        <div className="card p-6">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="gift" size={18} color="#2563EB" />
              Récompenses
            </h3>
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: totalProb === 100 ? "#10B981" : totalProb > 100 ? "#EF4444" : "#F59E0B",
            }}>
              Total : {totalProb}%
              {totalProb !== 100 && (
                <span style={{ fontSize: 12, fontWeight: 500, marginLeft: 6 }}>— doit être = 100%</span>
              )}
            </span>
          </div>

          {config.rewards.length === 0 && (
            <div style={{
              padding: "24px", borderRadius: 12, background: "#F8FAFC",
              border: "1.5px dashed #E2E8F0", textAlign: "center", marginBottom: 14,
              color: "#94A3B8", fontSize: 13,
            }}>
              Aucune récompense ajoutée. Cliquez sur &quot;Ajouter une récompense&quot;.
            </div>
          )}

          {config.rewards.map((r, i) => (
            <div key={r.id || i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input
                value={r.name}
                onChange={e => updateReward(i, "name", e.target.value)}
                placeholder="Nom de la récompense"
                style={{ ...inp, flex: "2 1 180px" }}
                onFocus={e => e.target.style.borderColor = "#3B82F6"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="number"
                  value={r.prob}
                  onChange={e => updateReward(i, "prob", e.target.value)}
                  min={0} max={100}
                  style={{ ...inp, width: 72, textAlign: "center", padding: "10px 8px" }}
                  onFocus={e => e.target.style.borderColor = "#3B82F6"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                />
                <span style={{ color: "#64748B", fontWeight: 700, fontSize: 13 }}>%</span>
              </div>
              <button
                onClick={() => removeReward(i)}
                style={{
                  width: 34, height: 34, borderRadius: 8, border: "none",
                  background: "#FEF2F2", color: "#EF4444", cursor: "pointer", fontSize: 16,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}

          <button
            onClick={addReward}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 16px", borderRadius: 10, marginTop: 4,
              border: "1.5px dashed #CBD5E1", background: "transparent",
              color: "#3B82F6", fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "border-color 0.2s",
            }}
          >
            <Icon name="plus" size={15} color="#3B82F6" />
            Ajouter une récompense
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <button onClick={() => setStep(2)} className="btn-secondary">Retour</button>
            <button
              onClick={handleSave}
              disabled={saving || totalProb !== 100 || !selectedId}
              className="btn-primary"
              style={{
                opacity: saving || totalProb !== 100 || !selectedId ? 0.5 : 1,
                cursor: saving || totalProb !== 100 || !selectedId ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Sauvegarde…" : "Enregistrer la configuration"}
            </button>
          </div>
        </div>
      )}

      {/* Section Publier */}
      {selectedEntreprise && (
        <div className="card p-6 mt-5">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Icon name="qr" size={20} color="#2563EB" />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                Lien public &amp; QR Code
              </h3>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
                Partagez ce lien ou imprimez le QR code pour vos clients.
              </p>
            </div>
          </div>

          <div style={{
            border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "16px 18px",
            display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap",
          }}>
            <div style={{ flexShrink: 0 }}>
              <QRCanvas slug={selectedEntreprise.slug} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 14, margin: "0 0 6px" }}>
                {selectedEntreprise.nom}
              </p>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#F8FAFC", borderRadius: 8, padding: "8px 12px",
                border: "1.5px solid #E2E8F0", marginBottom: 12,
              }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#475569",
                  flex: 1, wordBreak: "break-all",
                }}>
                  {getPublicUrl(selectedEntreprise.slug)}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => copyLink(selectedEntreprise.slug)}
                  className="btn-primary"
                  style={{ padding: "8px 16px", fontSize: 13, borderRadius: 9, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Icon name="copy" size={14} color="#fff" />
                  {copiedSlug === selectedEntreprise.slug ? "✓ Copié !" : "Copier le lien"}
                </button>
                <button
                  onClick={() => downloadQR(selectedEntreprise.slug)}
                  className="btn-secondary"
                  style={{ padding: "8px 16px", fontSize: 13, borderRadius: 9, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Icon name="download" size={14} />
                  Télécharger QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewOpen && config.rewards.length > 0 && config.rewards.some(r => r.name) && (
        <div className="card p-7 mt-5 text-center animate-slide-up">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Aperçu de la roue</h3>
          <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>{config.ctaText}</p>
          <SpinWheel
            rewards={config.rewards
              .filter(r => r.name)
              .map(r => ({ ...r, probability: r.prob }))}
            primaryColor={config.primaryColor}
            secondaryColor={config.secondaryColor}
            onResult={() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000); }}
          />
        </div>
      )}
    </div>
  );
}
