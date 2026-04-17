"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (data.user) setUser(data.user);
        else router.replace("/login");
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#F8FAFC", fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
          <img src="/images/logo_second.png" alt="VisiumBoost" style={{ height: 64, objectFit: "contain", margin: "0 auto 16px", display: "block", animation: "pulse 1.6s ease-in-out infinite" }} />
          <p style={{ color: "#64748B", fontSize: 14 }}>Chargement…</p>
        </div>
      </div>
    );
  }

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }} />
  );

  return <AppShell user={user} />;
}
