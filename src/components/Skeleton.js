"use client";

export function Skeleton({ w = "100%", h = 16, radius = 8, mb = 0 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      marginBottom: mb,
      flexShrink: 0,
    }} />
  );
}

export function SkeletonCard({ children }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: "1px solid #F1F5F9",
      padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {children}
    </div>
  );
}

export function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 mb-6">
      {[0, 1, 2, 3].map(i => (
        <SkeletonCard key={i}>
          <Skeleton w={36} h={36} radius={10} mb={12} />
          <Skeleton w="55%" h={28} radius={6} mb={6} />
          <Skeleton w="75%" h={13} radius={4} />
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <SkeletonCard>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Skeleton w="40%" h={18} radius={6} mb={4} />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderTop: "1px solid #F8FAFC" }}>
            <Skeleton w={36} h={36} radius={8} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <Skeleton w="60%" h={13} radius={4} />
              <Skeleton w="40%" h={11} radius={4} />
            </div>
            <Skeleton w={60} h={26} radius={20} />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

// Global style — inject once
export function SkeletonStyles() {
  return (
    <style>{`
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  );
}
