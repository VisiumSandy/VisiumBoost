"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/Icon";

const CUSTOM_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";

function getPublicUrl(slug) {
  const base = APP_URL || (typeof window !== "undefined" ? window.location.origin : "https://visium-boost.fr");
  return `${base}/roue/${slug}`;
}

const emptyForm = {
  nom: "", slug: "", lien_avis: "",
  couleur_principale: "#3B82F6",
  couleur_secondaire: "#0EA5E9",
  cta_text: "Laissez-nous un avis et tentez votre chance !",
};

const slugify = (str) =>
  str.toLowerCase().trim()
    .replace(/[àâä]/g, "a").replace(/[éèêë]/g, "e").replace(/[ïî]/g, "i")
    .replace(/[ôö]/g, "o").replace(/[ùûü]/g, "u").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function PageClients() {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);

  const fetchEntreprises = async () => {
    const r = await fetch("/api/entreprises");
    const d = await r.json();
    setEntreprises(d.entreprises || []);
    setLoading(false);
  };

  useEffect(() => { fetchEntreprises(); }, []);

  const handleNomChange = (nom) => setForm(p => ({ ...p, nom, slug: p.slug || slugify(nom) }));

  const handleSave = async () => {
    setError(""); setSaving(true);
    const r = await fetch("/api/entreprises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    if (!r.ok) { setError(d.error || "Erreur"); setSaving(false); return; }
    await fetchEntreprises();
    setForm(emptyForm); setShowForm(false); setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet établissement ?")) return;
    await fetch("/api/entreprises", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchEntreprises();
  };

  const copyUrl = (slug) => {
    navigator.clipboard.writeText(getPublicUrl(slug));
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  const inp = {
    width: "100%", padding: "10px 13px", borderRadius: 10,
    border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none",
    background: "#fff", boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mes entreprises</h1>
          <p className="text-slate-400 text-sm mt-1">
            {entreprises.length} établissement{entreprises.length > 1 ? "s" : ""}
            {" "}— URL publique :{" "}
            <code style={{ fontSize: 11, background: "#EFF6FF", color: "#2563EB", padding: "2px 7px", borderRadius: 5 }}>
              {APP_URL || "https://visium-boost.fr"}/roue/slug
            </code>
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Icon name="plus" size={16} color="#fff" />
          Ajouter un établissement
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 mb-6 animate-slide-up">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: "#0F172A" }}>
            Nouvel établissement
          </h3>

          {error && (
            <div style={{
              background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 10,
              padding: "10px 14px", fontSize: 13, color: "#EF4444", fontWeight: 600, marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
                Nom <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                value={form.nom}
                onChange={e => handleNomChange(e.target.value)}
                placeholder="Restaurant Le Gourmet"
                style={inp}
                onFocus={e => e.target.style.borderColor = "#3B82F6"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
                Slug URL <span style={{ color: "#EF4444" }}>*</span>{" "}
                <span style={{ color: "#3B82F6", fontSize: 11 }}>
                  {form.slug ? getPublicUrl(form.slug) : "…"}
                </span>
              </label>
              <input
                value={form.slug}
                onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                placeholder="restaurant-le-gourmet"
                style={inp}
                onFocus={e => e.target.style.borderColor = "#3B82F6"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
              <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>
                Lettres minuscules, chiffres et tirets uniquement
              </p>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
                Lien avis Google
              </label>
              <input
                value={form.lien_avis}
                onChange={e => setForm(p => ({ ...p, lien_avis: e.target.value }))}
                placeholder="https://g.page/r/..."
                style={inp}
                onFocus={e => e.target.style.borderColor = "#3B82F6"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
                Message CTA
              </label>
              <input
                value={form.cta_text}
                onChange={e => setForm(p => ({ ...p, cta_text: e.target.value }))}
                style={inp}
                onFocus={e => e.target.style.borderColor = "#3B82F6"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {[
                ["Couleur principale", "couleur_principale"],
                ["Couleur secondaire", "couleur_secondaire"],
              ].map(([label, field]) => (
                <div key={field} style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
                    {label}
                  </label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="color"
                      value={form[field]}
                      onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                      style={{ width: 38, height: 34, borderRadius: 8, border: "1.5px solid #E2E8F0", cursor: "pointer", padding: 2 }}
                    />
                    <input
                      value={form[field]}
                      onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                      style={{ ...inp, flex: 1, padding: "7px 10px" }}
                      onFocus={e => e.target.style.borderColor = "#3B82F6"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={handleSave}
              disabled={saving || !form.nom || !form.slug}
              className="btn-primary"
              style={{ opacity: saving || !form.nom || !form.slug ? 0.5 : 1, cursor: saving || !form.nom || !form.slug ? "not-allowed" : "pointer" }}
            >
              {saving ? "Enregistrement…" : "Créer l'établissement"}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(emptyForm); setError(""); }}
              className="btn-secondary"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="card p-12 text-center text-slate-300 text-sm">Chargement…</div>
      ) : entreprises.length === 0 ? (
        <div className="card p-14 text-center">
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="users" size={26} color="#3B82F6" />
          </div>
          <p style={{ color: "#64748B", fontWeight: 600, marginBottom: 6 }}>Aucun établissement configuré</p>
          <p style={{ color: "#94A3B8", fontSize: 13 }}>
            Ajoutez votre premier établissement pour commencer.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 2fr 80px 80px 110px",
            padding: "11px 20px", borderBottom: "1.5px solid #F1F5F9",
            fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8,
            background: "#FAFAFA",
          }}>
            <div>Établissement</div>
            <div>URL publique</div>
            <div>Scans</div>
            <div>Avis</div>
            <div />
          </div>

          {entreprises.map((e) => {
            const pubUrl = getPublicUrl(e.slug);
            return (
              <div
                key={e._id}
                style={{
                  display: "grid", gridTemplateColumns: "2fr 2fr 80px 80px 110px",
                  padding: "13px 20px", borderBottom: "1px solid #F8FAFC",
                  alignItems: "center", fontSize: 13, transition: "background 0.12s",
                }}
                onMouseEnter={ev => ev.currentTarget.style.background = "#F8FAFC"}
                onMouseLeave={ev => ev.currentTarget.style.background = "#fff"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: `linear-gradient(135deg, ${e.couleur_principale}, ${e.couleur_secondaire})`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
                      {e.nom.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#0F172A" }}>{e.nom}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>
                      {new Date(e.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <a
                    href={pubUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      color: "#2563EB", fontWeight: 500, fontSize: 12, textDecoration: "none",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}
                  >
                    {pubUrl}
                  </a>
                  <button
                    onClick={() => copyUrl(e.slug)}
                    style={{
                      flexShrink: 0, width: 26, height: 26, borderRadius: 7,
                      border: "1.5px solid #E2E8F0", background: "#fff",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, transition: "all 0.15s", color: copied === e.slug ? "#10B981" : "#64748B",
                    }}
                    title="Copier l'URL"
                  >
                    {copied === e.slug ? "✓" : "⧉"}
                  </button>
                </div>

                <div style={{ color: "#475569", fontWeight: 600 }}>{e.totalScans || 0}</div>
                <div style={{ color: "#475569", fontWeight: 600 }}>{e.totalReviews || 0}</div>

                <div style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
                  <a
                    href={pubUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      padding: "5px 11px", borderRadius: 8, background: "#EFF6FF",
                      color: "#2563EB", fontWeight: 600, fontSize: 12, textDecoration: "none",
                    }}
                  >
                    Voir
                  </a>
                  <button
                    onClick={() => handleDelete(e._id)}
                    style={{
                      width: 28, height: 28, borderRadius: 8, border: "none",
                      background: "#FEF2F2", color: "#EF4444", cursor: "pointer", fontSize: 14,
                    }}
                    title="Supprimer"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
