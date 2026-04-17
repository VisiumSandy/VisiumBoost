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

  const FEATURES = [
    "Roue de la fortune personnalisée",
    "Codes anti-fraude automatiques",
    "Analytics en temps réel",
    "URL de sous-domaine incluse",
    "Sans engagement, sans CB",
  ];

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "#F8FAFC",
    }}>
      {/* Left panel */}
      <div
        className="auth-left"
        style={{
          flex: 1, display: "none", flexDirection: "column", justifyContent: "center",
          padding: "64px 60px",
          background: "#0F172A",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 64 }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 38, objectFit: "contain" }} />
          <img src="/images/logo_main1.png" alt="VisiumBoost" style={{ height: 24, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
        </Link>

        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#F1F5F9", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
          Rejoignez les établissements{" "}
          <span style={{ background: "linear-gradient(135deg, #60A5FA, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            qui grandissent avec VisiumBoost
          </span>
        </h2>
        <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.8, maxWidth: 360, margin: "0 0 48px" }}>
          Créez votre compte gratuitement. Aucune carte de crédit requise.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FEATURES.map((text) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "#1E3A8A",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ color: "#60A5FA", fontWeight: 900, fontSize: 11 }}>✓</span>
              </div>
              <span style={{ color: "#94A3B8", fontSize: 14 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px", overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 36 }} className="md:hidden">
            <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 34, objectFit: "contain" }} />
            <img src="/images/logo_main1.png" alt="VisiumBoost" style={{ height: 22, objectFit: "contain" }} />
          </Link>

          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px", color: "#0F172A", letterSpacing: "-0.3px" }}>
            Créer un compte
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 28px" }}>
            Déjà un compte ?{" "}
            <Link href="/login" style={{ color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>
              Se connecter
            </Link>
          </p>

          {error && (
            <div style={{
              background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 12,
              padding: "12px 16px", fontSize: 13, color: "#EF4444", fontWeight: 600,
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {[
              { label: "Votre nom", field: "name", type: "text", placeholder: "Marie Dubois", required: true },
              { label: "Nom de l'établissement", field: "businessName", type: "text", placeholder: "Restaurant Le Gourmet", required: false },
              { label: "Email", field: "email", type: "email", placeholder: "vous@exemple.fr", required: true },
              { label: "Mot de passe", field: "password", type: "password", placeholder: "Minimum 6 caractères", required: true, minLength: 6 },
            ].map(({ label, field, type, placeholder, required: req, minLength }) => (
              <div key={field}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  {label} {req && <span style={{ color: "#EF4444" }}>*</span>}
                </label>
                <input
                  type={type}
                  required={req}
                  minLength={minLength}
                  value={form[field]}
                  onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={placeholder}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 12,
                    border: "1.5px solid #E2E8F0", fontSize: 15, outline: "none",
                    background: "#fff", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
                  }}
                  onFocus={e => e.target.style.borderColor = "#3B82F6"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px", borderRadius: 12, border: "none", marginTop: 6,
                background: loading ? "#94A3B8" : "#2563EB",
                color: "#fff", fontWeight: 700, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: loading ? "none" : "0 4px 16px rgba(37,99,235,0.3)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Création du compte…" : "Créer mon compte gratuitement"}
            </button>

            <p style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", lineHeight: 1.6 }}>
              En créant un compte, vous acceptez nos{" "}
              <a href="/cgu" target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>CGU</a>
              {" "}et notre{" "}
              <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>politique de confidentialité</a>
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
