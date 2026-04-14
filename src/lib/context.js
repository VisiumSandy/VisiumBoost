"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Restore sidebar state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("zreview-ui");
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
      localStorage.setItem("zreview-ui", JSON.stringify({ sidebarCollapsed }));
    } catch {}
  }, [sidebarCollapsed]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        sidebarCollapsed,
        setSidebarCollapsed,
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
