export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif",
      background: "#F8FAFC",
      padding: "24px",
      textAlign: "center",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: "linear-gradient(135deg, #6C5CE7, #00B894)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24,
      }}>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: 28 }}>z</span>
      </div>
      <h1 style={{ fontSize: 48, fontWeight: 900, color: "#0F0F1A", margin: "0 0 12px" }}>404</h1>
      <p style={{ fontSize: 18, color: "#636e72", margin: "0 0 8px", fontWeight: 600 }}>
        Page introuvable
      </p>
      <p style={{ fontSize: 14, color: "#b2bec3", maxWidth: 320 }}>
        Cette page n&apos;existe pas ou a été désactivée. Vérifiez l&apos;URL et réessayez.
      </p>
      <a
        href="/"
        style={{
          marginTop: 32, padding: "12px 28px", borderRadius: 12,
          background: "#6C5CE7", color: "#fff", textDecoration: "none",
          fontWeight: 700, fontSize: 14,
        }}
      >
        Retour à zReview
      </a>
    </div>
  );
}
