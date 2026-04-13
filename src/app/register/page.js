"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", businessName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur d'inscription"); setLoading(false); return; }
      router.push("/dashboard");
    } catch {
      setError("Erreur réseau. Réessayez."); setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 12,
    border: "1.5px solid #E2E8F0", fontSize: 15, outline: "none",
    background: "#fff", boxSizing: "border-box",
    transition: "border-color 0.2s", fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{
      minHeight: "100dvh", display: "flex",
      fontFamily: "'Inter', system-ui, sans-serif",
      background: "#F8FAFC",
    }}>
      {/* Left panel */}
      <div
        style={{
          flex: 1, display: "none", flexDirection: "column", justifyContent: "center", padding: "60px",
          background: "linear-gradient(160deg, #0F0F1A 0%, #0d2818 100%)",
        }}
        className="auth-left"
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 60 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #6C5CE7, #00B894)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 20, fontFamily: "'Calistoga', serif" }}>z</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "'Calistoga', serif" }}>zReview</span>
        </Link>

        <h2 style={{ fontFamily: "'Calistoga', serif", fontSize: 38, color: "#fff", lineHeight: 1.2, margin: "0 0 20px" }}>
          Rejoignez 500+ établissements{" "}
          <span style={{ background: "linear-gradient(135deg, #a29bfe, #00B894)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            qui grandissent avec zReview
          </span>
        </h2>
        <p style={{ color: "#718096", fontSize: 15, lineHeight: 1.8, maxWidth: 380 }}>
          Créez votre compte gratuitement. Aucune carte de crédit requise.
        </p>

        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            ["🎡", "Roue personnalisée en 5 min"],
            ["🔐", "Codes anti-fraude automatiques"],
            ["📊", "Analytics temps réel"],
            ["🔗", "URL de sous-domaine incluse"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <span style={{ color: "#a0aec0", fontSize: 14 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "40px 24px",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 36 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #6C5CE7, #00B894)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 17, fontFamily: "'Calistoga', serif" }}>z</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Calistoga', serif", color: "#0F0F1A" }}>zReview</span>
          </Link>

          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 8px", color: "#0F0F1A" }}>Créer un compte</h1>
          <p style={{ color: "#636e72", fontSize: 14, margin: "0 0 32px" }}>
            Déjà un compte ?{" "}
            <Link href="/login" style={{ color: "#6C5CE7", fontWeight: 700, textDecoration: "none" }}>Se connecter</Link>
          </p>

          {error && (
            <div style={{
              background: "#FFF5F5", border: "1.5px solid #FED7D7", borderRadius: 12,
              padding: "12px 16px", fontSize: 13, color: "#E53E3E", fontWeight: 600,
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 6 }}>
                Votre nom <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <input
                required value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Jean Dupont"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#6C5CE7"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 6 }}>
                Nom de l&apos;établissement
              </label>
              <input
                value={form.businessName}
                onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))}
                placeholder="Restaurant Le Gourmet"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#6C5CE7"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 6 }}>
                Email <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <input
                type="email" required value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="vous@exemple.fr"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#6C5CE7"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 6 }}>
                Mot de passe <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <input
                type="password" required minLength={6} value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Minimum 6 caractères"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#6C5CE7"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                padding: "15px", borderRadius: 12, border: "none", marginTop: 8,
                background: loading ? "#b2bec3" : "linear-gradient(135deg, #6C5CE7, #00B894)",
                color: "#fff", fontWeight: 800, fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Inter', sans-serif",
                boxShadow: loading ? "none" : "0 4px 20px #6C5CE740",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Création du compte…" : "Créer mon compte gratuitement"}
            </button>

            <p style={{ fontSize: 12, color: "#b2bec3", textAlign: "center", lineHeight: 1.6, marginTop: 4 }}>
              En créant un compte, vous acceptez nos{" "}
              <span style={{ color: "#6C5CE7", cursor: "pointer" }}>Conditions d&apos;utilisation</span>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .auth-left { display: flex !important; } }
      `}</style>
    </div>
  );
}
