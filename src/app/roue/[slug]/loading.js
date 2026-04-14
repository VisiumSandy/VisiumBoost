export default function Loading() {
  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "#F8FAFC", fontFamily: "'Inter', system-ui, sans-serif", gap: 20,
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        border: "4px solid #E2E8F0",
        borderTopColor: "#6C5CE7",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ color: "#94A3B8", fontSize: 14, fontWeight: 600, margin: 0 }}>
        Chargement de la roue…
      </p>
    </div>
  );
}
