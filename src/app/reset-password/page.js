"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!token) {
      setError("Lien invalide ou manquant.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue");
        setLoading(false);
        return;
      }
      router.push("/login?reset=1");
    } catch {
      setError("Erreur réseau. Réessayez.");
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{
          background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 14,
          padding: "20px 24px", marginBottom: 24,
        }}>
          <p style={{ fontWeight: 700, color: "#EF4444", margin: "0 0 6px", fontSize: 16 }}>
            Lien invalide
          </p>
          <p style={{ color: "#EF4444", fontSize: 14, margin: 0 }}>
            Ce lien de réinitialisation est invalide ou manquant.
          </p>
        </div>
        <Link href="/forgot-password" style={{
          display: "block", textAlign: "center", padding: "13px",
          borderRadius: 12, background: "#2563EB", color: "#fff", fontWeight: 700,
          fontSize: 15, textDecoration: "none",
        }}>
          Faire une nouvelle demande
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <Link href="/" style={{ textDecoration: "none", display: "block", marginBottom: 40 }}>
        <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 56, objectFit: "contain" }} />
      </Link>

      <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px", color: "#0F172A", letterSpacing: "-0.3px" }}>
        Nouveau mot de passe
      </h1>
      <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 28px" }}>
        Choisissez un mot de passe sécurisé d&apos;au moins 6 caractères.
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
          { label: "Nouveau mot de passe", value: password, setter: setPassword, placeholder: "••••••••" },
          { label: "Confirmer le mot de passe", value: confirm, setter: setConfirm, placeholder: "••••••••" },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              {label}
            </label>
            <input
              type="password"
              required
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                border: "1.5px solid #E2E8F0", fontSize: 15, outline: "none",
                background: "#fff", boxSizing: "border-box",
                fontFamily: "'DM Sans', sans-serif", color: "#0F172A",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
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
          }}
        >
          {loading ? "Mise à jour…" : "Mettre à jour le mot de passe"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#64748B" }}>
        <Link href="/login" style={{ color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>
          ← Retour à la connexion
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
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
        <Link href="/" style={{ textDecoration: "none", marginBottom: 64, display: "block" }}>
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 56, objectFit: "contain" }} />
        </Link>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#F1F5F9", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
          Sécurisez{" "}
          <span style={{ background: "linear-gradient(135deg, #60A5FA, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            votre compte
          </span>
        </h2>
        <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.8, maxWidth: 360, margin: 0 }}>
          Choisissez un nouveau mot de passe fort pour protéger votre compte.
        </p>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
      }}>
        <Suspense fallback={<div style={{ color: "#64748B" }}>Chargement…</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>

      <style>{`
        @media (min-width: 768px) { .auth-left { display: flex !important; } }
      `}</style>
    </div>
  );
}
