"use client";

import { useState, useEffect } from "react";

// ── Shared styles ─────────────────────────────────────────────────────────────
const inp = {
  width: "100%", padding: "10px 13px", borderRadius: 10,
  border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none",
  background: "#fff", boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
};

function Alert({ type, children }) {
  const styles = {
    success: { bg: "#F0FDF4", border: "#BBF7D0", color: "#16A34A" },
    error:   { bg: "#FEF2F2", border: "#FECACA", color: "#EF4444" },
    info:    { bg: "#EFF6FF", border: "#BFDBFE", color: "#1D4ED8" },
  };
  const s = styles[type];
  return (
    <div style={{
      background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 10,
      padding: "10px 14px", fontSize: 13, color: s.color, fontWeight: 600, marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

function CodeInput({ value, onChange }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={6}
      placeholder="000000"
      value={value}
      onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      style={{
        ...inp, textAlign: "center", fontSize: 28, fontWeight: 900,
        letterSpacing: 10, fontFamily: "'JetBrains Mono', monospace",
        color: "#1D4ED8", borderColor: "#BFDBFE", background: "#EFF6FF",
      }}
      onFocus={e => (e.target.style.borderColor = "#3B82F6")}
      onBlur={e => (e.target.style.borderColor = "#BFDBFE")}
    />
  );
}

// ── Section: Profile (name, phone, businessName) ──────────────────────────────
function SectionProfile({ user, onUserUpdated }) {
  const [form, setForm]     = useState({ name: "", phone: "", businessName: "" });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");

  useEffect(() => {
    if (user) setForm({ name: user.name || "", phone: user.phone || "", businessName: user.businessName || "" });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true); setSaved(false);
    const r = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, phone: form.phone, businessName: form.businessName }),
    });
    const d = await r.json();
    setSaving(false);
    if (!r.ok) { setError(d.error || "Erreur"); return; }
    setSaved(true);
    onUserUpdated(d.user);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave}>
      {error && <Alert type="error">{error}</Alert>}
      {saved  && <Alert type="success">Modifications enregistrées</Alert>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {[
          ["Nom complet", "name", "text"],
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
              disabled={!user}
              style={{ ...inp, opacity: !user ? 0.5 : 1 }}
              onFocus={e => (e.target.style.borderColor = "#3B82F6")}
              onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        disabled={saving || !user}
        className="btn-primary"
        style={{ marginTop: 18, opacity: saving || !user ? 0.5 : 1, cursor: saving || !user ? "not-allowed" : "pointer" }}
      >
        {saving ? "Enregistrement…" : "Sauvegarder"}
      </button>
    </form>
  );
}

// ── Section: Change email ─────────────────────────────────────────────────────
function SectionEmail({ user, onUserUpdated }) {
  // step: "idle" → "enter_email" → "enter_code" → "success"
  const [step,     setStep]     = useState("idle");
  const [newEmail, setNewEmail] = useState("");
  const [code,     setCode]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const sendCode = async () => {
    setError(""); setLoading(true);
    const r = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_email", newEmail }),
    });
    const d = await r.json();
    setLoading(false);
    if (!r.ok) { setError(d.error || "Erreur"); return; }
    setStep("enter_code");
  };

  const verifyCode = async () => {
    setError(""); setLoading(true);
    const r = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_email", code }),
    });
    const d = await r.json();
    setLoading(false);
    if (!r.ok) { setError(d.error || "Erreur"); return; }
    setSuccess(`Email mis à jour : ${d.newEmail}`);
    setStep("success");
    onUserUpdated({ ...user, email: d.newEmail });
  };

  const reset = () => { setStep("idle"); setNewEmail(""); setCode(""); setError(""); setSuccess(""); };

  if (step === "idle") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 3 }}>Email actuel</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{user?.email || "—"}</div>
      </div>
      <button
        onClick={() => setStep("enter_email")}
        disabled={!user}
        className="btn-secondary"
        style={{ fontSize: 13 }}
      >
        Modifier l&apos;email
      </button>
    </div>
  );

  if (step === "success") return (
    <div>
      <Alert type="success">{success}</Alert>
      <button onClick={reset} className="btn-secondary" style={{ fontSize: 13 }}>Fermer</button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error && <Alert type="error">{error}</Alert>}

      {step === "enter_email" && (
        <>
          <Alert type="info">
            Un code de vérification sera envoyé à votre email actuel (<strong>{user?.email}</strong>).
          </Alert>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
              Nouvel email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="nouveau@email.com"
              style={inp}
              onFocus={e => (e.target.style.borderColor = "#3B82F6")}
              onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={sendCode}
              disabled={loading || !newEmail}
              className="btn-primary"
              style={{ fontSize: 13, opacity: loading || !newEmail ? 0.5 : 1 }}
            >
              {loading ? "Envoi…" : "Envoyer le code"}
            </button>
            <button onClick={reset} className="btn-secondary" style={{ fontSize: 13 }}>Annuler</button>
          </div>
        </>
      )}

      {step === "enter_code" && (
        <>
          <Alert type="info">
            Code envoyé à <strong>{user?.email}</strong>. Valable 10 minutes.
          </Alert>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
              Code de vérification (6 chiffres)
            </label>
            <CodeInput value={code} onChange={setCode} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={verifyCode}
              disabled={loading || code.length !== 6}
              className="btn-primary"
              style={{ fontSize: 13, opacity: loading || code.length !== 6 ? 0.5 : 1 }}
            >
              {loading ? "Vérification…" : "Confirmer le changement"}
            </button>
            <button
              onClick={() => { setStep("enter_email"); setCode(""); setError(""); }}
              className="btn-secondary"
              style={{ fontSize: 13 }}
            >
              Renvoyer le code
            </button>
            <button onClick={reset} className="btn-secondary" style={{ fontSize: 13 }}>Annuler</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Section: Change password ──────────────────────────────────────────────────
function SectionPassword({ user }) {
  // step: "idle" → "enter_code" → "success"
  const [step,        setStep]        = useState("idle");
  const [currentPw,   setCurrentPw]   = useState("");
  const [newPw,       setNewPw]       = useState("");
  const [confirmPw,   setConfirmPw]   = useState("");
  const [code,        setCode]        = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);

  const sendCode = async (e) => {
    e.preventDefault();
    setError("");
    if (newPw !== confirmPw) { setError("Les mots de passe ne correspondent pas"); return; }
    if (newPw.length < 8) { setError("Le nouveau mot de passe doit faire au moins 8 caractères"); return; }
    setLoading(true);
    const r = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_password", currentPassword: currentPw, newPassword: newPw }),
    });
    const d = await r.json();
    setLoading(false);
    if (!r.ok) { setError(d.error || "Erreur"); return; }
    setStep("enter_code");
  };

  const verifyCode = async () => {
    setError(""); setLoading(true);
    const r = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_password", code }),
    });
    const d = await r.json();
    setLoading(false);
    if (!r.ok) { setError(d.error || "Erreur"); return; }
    setStep("success");
  };

  const reset = () => { setStep("idle"); setCurrentPw(""); setNewPw(""); setConfirmPw(""); setCode(""); setError(""); };

  if (step === "success") return (
    <div>
      <Alert type="success">Mot de passe mis à jour avec succès.</Alert>
      <button onClick={reset} className="btn-secondary" style={{ fontSize: 13 }}>Fermer</button>
    </div>
  );

  const pwField = (label, value, setter, show, setShow) => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => setter(e.target.value)}
          style={{ ...inp, paddingRight: 40 }}
          onFocus={e => (e.target.style.borderColor = "#3B82F6")}
          onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
          disabled={step !== "idle" || loading}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 13, fontWeight: 600, padding: 0 }}
        >
          {show ? "Masquer" : "Voir"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error && <Alert type="error">{error}</Alert>}

      {step === "idle" && (
        <form onSubmit={sendCode} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pwField("Mot de passe actuel", currentPw, setCurrentPw, showCurrent, setShowCurrent)}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {pwField("Nouveau mot de passe", newPw, setNewPw, showNew, setShowNew)}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
                Confirmer le nouveau mot de passe
              </label>
              <input
                type={showNew ? "text" : "password"}
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                style={{ ...inp, borderColor: confirmPw && confirmPw !== newPw ? "#FECACA" : "#E2E8F0" }}
                onFocus={e => (e.target.style.borderColor = confirmPw !== newPw ? "#FECACA" : "#3B82F6")}
                onBlur={e => (e.target.style.borderColor = confirmPw && confirmPw !== newPw ? "#FECACA" : "#E2E8F0")}
              />
            </div>
          </div>
          {newPw && (
            <div style={{ fontSize: 12, color: newPw.length >= 8 ? "#16A34A" : "#F59E0B", fontWeight: 600 }}>
              {newPw.length >= 8 ? "Mot de passe suffisamment long" : `Encore ${8 - newPw.length} caractère${8 - newPw.length > 1 ? "s" : ""} requis`}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={loading || !currentPw || !newPw || !confirmPw}
              className="btn-primary"
              style={{ fontSize: 13, opacity: loading || !currentPw || !newPw || !confirmPw ? 0.5 : 1 }}
            >
              {loading ? "Envoi…" : "Envoyer le code de vérification"}
            </button>
          </div>
        </form>
      )}

      {step === "enter_code" && (
        <>
          <Alert type="info">
            Code envoyé à <strong>{user?.email}</strong>. Valable 10 minutes.
          </Alert>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 5 }}>
              Code de vérification (6 chiffres)
            </label>
            <CodeInput value={code} onChange={setCode} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={verifyCode}
              disabled={loading || code.length !== 6}
              className="btn-primary"
              style={{ fontSize: 13, opacity: loading || code.length !== 6 ? 0.5 : 1 }}
            >
              {loading ? "Vérification…" : "Confirmer le changement"}
            </button>
            <button onClick={reset} className="btn-secondary" style={{ fontSize: 13 }}>Annuler</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PageAccount() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); });
  }, []);

  const PLAN_LABELS = { free: "Gratuit", starter: "Starter", pro: "Pro" };
  const PLAN_COLORS = { free: "#64748B", starter: "#10B981", pro: "#3B82F6" };
  const planColor = PLAN_COLORS[user?.plan] || "#64748B";
  const planLabel = PLAN_LABELS[user?.plan] || "Gratuit";

  const cardStyle = { marginBottom: 16 };
  const sectionTitle = { fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 4px" };
  const sectionSub   = { fontSize: 13, color: "#64748B", margin: "0 0 18px" };

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mon compte</h1>
        <p className="text-slate-400 text-sm mt-1">Gérez vos informations et la sécurité de votre compte</p>
      </div>

      {/* Avatar + plan banner */}
      <div className="card p-6" style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #3B82F6, #0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, color: "#fff", fontSize: 22, flexShrink: 0,
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 16 }}>
              {user?.name || "Chargement…"}
            </div>
            <div style={{ fontSize: 13, color: "#64748B" }}>{user?.email || ""}</div>
            <span style={{
              display: "inline-flex", alignItems: "center", padding: "2px 9px",
              borderRadius: 20, fontSize: 12, fontWeight: 700, marginTop: 4,
              background: `${planColor}15`, color: planColor,
            }}>
              Plan {planLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="card p-6" style={cardStyle}>
        <p style={sectionTitle}>Informations personnelles</p>
        <p style={sectionSub}>Nom, téléphone et établissement</p>
        <SectionProfile user={user} onUserUpdated={u => setUser(u)} />
      </div>

      {/* Changer l'email */}
      <div className="card p-6" style={cardStyle}>
        <p style={sectionTitle}>Adresse email</p>
        <p style={sectionSub}>Un code de vérification sera envoyé à votre email actuel</p>
        <SectionEmail user={user} onUserUpdated={u => setUser(prev => ({ ...prev, ...u }))} />
      </div>

      {/* Changer le mot de passe */}
      <div className="card p-6" style={cardStyle}>
        <p style={sectionTitle}>Mot de passe</p>
        <p style={sectionSub}>Un code de vérification sera envoyé à votre email pour confirmer</p>
        <SectionPassword user={user} />
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
