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
      if (!res.ok) { setError(data.error || "Erreur de connexion"); setLoading(false); return; }
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Erreur réseau. Réessayez."); setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100dvh", display: "flex",
      fontFamily: "'Inter', system-ui, sans-serif",
      background: "#F8FAFC",
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: "none", flexDirection: "column", justifyContent: "center", padding: "60px",
        background: "linear-gradient(160deg, #0F0F1A 0%, #1a1040 100%)",
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

        <h2 style={{ fontFamily: "'Calistoga', serif", fontSize: 42, color: "#fff", lineHeight: 1.2, margin: "0 0 20px" }}>
          Boostez vos avis Google{" "}
          <span style={{ background: "linear-gradient(135deg, #a29bfe, #00B894)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            automatiquement
          </span>
        </h2>
        <p style={{ color: "#718096", fontSize: 16, lineHeight: 1.8, maxWidth: 380 }}>
          La roue de la fortune gamifiée qui transforme chaque client en ambassadeur Google.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 48 }}>
          {["500+ établissements actifs", "Configuration en 5 minutes", "Codes anti-fraude inclus"].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#00B894", fontWeight: 900 }}>✓</span>
              <span style={{ color: "#a0aec0", fontSize: 14 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 40 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #6C5CE7, #00B894)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 17, fontFamily: "'Calistoga', serif" }}>z</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Calistoga', serif", color: "#0F0F1A" }}>zReview</span>
          </Link>

          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 8px", color: "#0F0F1A" }}>Connexion</h1>
          <p style={{ color: "#636e72", fontSize: 14, margin: "0 0 32px" }}>
            Pas encore de compte ?{" "}
            <Link href="/register" style={{ color: "#6C5CE7", fontWeight: 700, textDecoration: "none" }}>Créer un compte</Link>
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

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="vous@exemple.fr"
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 12,
                  border: "1.5px solid #E2E8F0", fontSize: 15, outline: "none",
                  background: "#fff", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = "#6C5CE7"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 6 }}>
                Mot de passe
              </label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 12,
                  border: "1.5px solid #E2E8F0", fontSize: 15, outline: "none",
                  background: "#fff", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = "#6C5CE7"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "15px", borderRadius: 12, border: "none",
                background: loading ? "#b2bec3" : "linear-gradient(135deg, #6C5CE7, #7B6CF0)",
                color: "#fff", fontWeight: 800, fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Inter', sans-serif",
                boxShadow: loading ? "none" : "0 4px 20px #6C5CE740",
                transition: "all 0.2s",
                marginTop: 4,
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
