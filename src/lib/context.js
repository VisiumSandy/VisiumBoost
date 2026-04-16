"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingValidations, setPendingValidations] = useState(0);

  // Restore sidebar state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("visiumboost-ui");
      if (saved) {
        const data = JSON.parse(saved);
        if (typeof data.sidebarCollapsed === "boolean") {
          setSidebarCollapsed(data.sidebarCollapsed);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("visiumboost-ui", JSON.stringify({ sidebarCollapsed }));
    } catch {}
  }, [sidebarCollapsed]);

  // Poll pending validations every 60s
  const refreshPending = useCallback(async () => {
    try {
      const r = await fetch("/api/user/stats");
      if (!r.ok) return;
      const d = await r.json();
      setPendingValidations(d.pendingSpins || 0);
    } catch {}
  }, []);

  useEffect(() => {
    refreshPending();
    const id = setInterval(refreshPending, 60000);
    return () => clearInterval(id);
  }, [refreshPending]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        sidebarCollapsed,
        setSidebarCollapsed,
        pendingValidations,
        refreshPending,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
