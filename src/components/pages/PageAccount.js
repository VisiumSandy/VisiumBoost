"use client";

import { useState, useEffect } from "react";

export default function PageAccount() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", businessName: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setUser(d.user);
          setForm({
            name: d.user.name || "",
            email: d.user.email || "",
            phone: d.user.phone || "",
            businessName: d.user.businessName || "",
          });
        }
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true); setSaved(false);
    try {
      const r = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Erreur"); setSaving(false); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erreur réseau.");
    }
    setSaving(false);
  };

  const PLAN_LABELS = { free: "Gratuit", starter: "Starter", pro: "Pro" };
  const PLAN_COLORS = { free: "#64748B", starter: "#10B981", pro: "#3B82F6" };
  const planLabel = PLAN_LABELS[user?.plan] || "Gratuit";
  const planColor = PLAN_COLORS[user?.plan] || "#64748B";

  const inp = {
    width: "100%", padding: "10px 13px", borderRadius: 10,
    border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none",
    background: "#fff", boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mon compte</h1>
        <p className="text-slate-400 text-sm mt-1">Gérez vos informations personnelles</p>
      </div>

      {/* Profile card */}
      <div className="card p-6 mb-5">
        {/* Avatar + plan */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, #3B82F6, #0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, color: "#fff", fontSize: 24, flexShrink: 0,
          }}>
            {form.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 17, lineHeight: 1.3 }}>
              {form.name || "—"}
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 6 }}>{form.email}</div>
            <span style={{
              display: "inline-flex", alignItems: "center", padding: "3px 10px",
              borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: `${planColor}15`, color: planColor,
            }}>
              Plan {planLabel}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave}>
          {error && (
            <div style={{
              background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 10,
              padding: "10px 14px", fontSize: 13, color: "#EF4444", fontWeight: 600, marginBottom: 16,
            }}>
              {error}
            </div>
          )}
          {saved && (
            <div style={{
              background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 10,
              padding: "10px 14px", fontSize: 13, color: "#16A34A", fontWeight: 600, marginBottom: 16,
            }}>
              ✓ Modifications enregistrées
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              ["Nom complet", "name", "text"],
              ["Email", "email", "email"],
              ["Téléphone", "phone", "tel"],
              ["Nom de l'établissement", "businessName", "text"],
            ].map(([label, field, type]) => (
              <div key={field}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[field]}
                  onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={user ? "" : "Chargement…"}
                  disabled={!user}
                  style={{ ...inp, opacity: !user ? 0.5 : 1 }}
                  onFocus={e => e.target.style.borderColor = "#3B82F6"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving || !user}
            className="btn-primary"
            style={{ marginTop: 20, opacity: saving || !user ? 0.5 : 1, cursor: saving || !user ? "not-allowed" : "pointer" }}
          >
            {saving ? "Enregistrement…" : "Sauvegarder les modifications"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="card p-6" style={{ borderColor: "#FECACA" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#EF4444", margin: "0 0 6px" }}>Zone de danger</h3>
        <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 16px" }}>
          Ces actions sont irréversibles. Procédez avec prudence.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-secondary" style={{ fontSize: 13 }}>
            Exporter mes données
          </button>
          <button className="btn-danger" style={{ fontSize: 13 }}>
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}
