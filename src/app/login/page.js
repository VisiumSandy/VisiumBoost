"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Identifiants incorrects"); setLoading(false); return; }
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Erreur réseau. Réessayez."); setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100dvh", display: "flex",
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
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 64 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: "linear-gradient(135deg, #3B82F6, #0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: "-1px" }}>z</span>
          </div>
          <span style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 20, letterSpacing: "-0.4px" }}>zReview</span>
        </Link>

        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#F1F5F9", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
          Boostez vos avis Google{" "}
          <span style={{ background: "linear-gradient(135deg, #60A5FA, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            automatiquement
          </span>
        </h2>
        <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.8, maxWidth: 360, margin: "0 0 48px" }}>
          La roue de la fortune qui transforme chaque client en ambassadeur Google.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            "500+ établissements actifs",
            "Configuration en 5 minutes",
            "Codes anti-fraude inclus",
            "Sans engagement",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "#1E3A8A",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ color: "#60A5FA", fontWeight: 900, fontSize: 11 }}>✓</span>
              </div>
              <span style={{ color: "#94A3B8", fontSize: 14 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Mobile logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 40 }} className="md:hidden">
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #3B82F6, #0EA5E9)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-1px" }}>z</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#0F172A", letterSpacing: "-0.4px" }}>zReview</span>
          </Link>

          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px", color: "#0F172A", letterSpacing: "-0.3px" }}>
            Connexion
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 28px" }}>
            Pas encore de compte ?{" "}
            <Link href="/register" style={{ color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>
              Créer un compte
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

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Email", field: "email", type: "email", placeholder: "vous@exemple.fr" },
              { label: "Mot de passe", field: "password", type: "password", placeholder: "••••••••" },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  {label}
                </label>
                <input
                  type={type}
                  required
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
                padding: "14px", borderRadius: 12, border: "none", marginTop: 4,
                background: loading ? "#94A3B8" : "#2563EB",
                color: "#fff", fontWeight: 700, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: loading ? "none" : "0 4px 16px rgba(37,99,235,0.3)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .auth-left { display: flex !important; } }
      `}</style>
    </div>
  );
}
