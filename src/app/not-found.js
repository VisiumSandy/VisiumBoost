import Link from "next/link";

export const metadata = {
  title: "Page introuvable — VisiumBoost",
};

const FONT_TITLE = "'Special Gothic Expanded One','DM Sans',system-ui,sans-serif";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "#F8FAFC", padding: "40px 24px", textAlign: "center",
    }}>
      {/* Logo */}
      <Link href="/" style={{ marginBottom: 48, display: "block" }}>
        <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 44, objectFit: "contain" }} />
      </Link>

      {/* 404 big */}
      <div style={{
        fontFamily: FONT_TITLE,
        fontSize: "clamp(80px,15vw,160px)",
        fontWeight: 400,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 24,
        userSelect: "none",
      }}>
        404
      </div>

      <h1 style={{
        fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#0F172A",
        letterSpacing: "-0.3px", margin: "0 0 12px",
      }}>
        Page introuvable
      </h1>
      <p style={{
        fontSize: 15, color: "#64748B", lineHeight: 1.7,
        maxWidth: 400, margin: "0 0 40px",
      }}>
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
        Vérifiez l&apos;URL ou retournez à l&apos;accueil.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
          color: "#fff", textDecoration: "none",
          padding: "12px 24px", borderRadius: 12,
          fontWeight: 700, fontSize: 14,
          boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour à l&apos;accueil
        </Link>
        <Link href="/dashboard" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#fff", color: "#374151", textDecoration: "none",
          padding: "12px 24px", borderRadius: 12,
          fontWeight: 600, fontSize: 14,
          border: "1.5px solid #E2E8F0",
        }}>
          Mon tableau de bord
        </Link>
      </div>
    </div>
  );
}
