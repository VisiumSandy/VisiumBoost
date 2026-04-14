export default function Loading() {
  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "#F8FAFC", fontFamily: "'Inter', system-ui, sans-serif", gap: 24,
    }}>
      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
      <img
        src="/images/logo_second.png"
        alt="VisiumBoost"
        style={{ height: 72, objectFit: "contain", animation: "pulse 1.6s ease-in-out infinite" }}
      />
      <p style={{ color: "#94A3B8", fontSize: 14, fontWeight: 600, margin: 0 }}>
        Chargement de la roue…
      </p>
    </div>
  );
}
