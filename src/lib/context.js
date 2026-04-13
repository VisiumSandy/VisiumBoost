"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  DEFAULT_WHEEL_CONFIG,
  DEFAULT_CLIENTS,
  generateInitialCodes,
} from "@/lib/utils";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [clients, setClients] = useState(DEFAULT_CLIENTS);
  const [codes, setCodes] = useState(() => generateInitialCodes(20));
  const [wheelConfig, setWheelConfig] = useState(DEFAULT_WHEEL_CONFIG);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("zreview-state");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.clients) setClients(data.clients);
        if (data.codes) setCodes(data.codes);
        if (data.wheelConfig) setWheelConfig(data.wheelConfig);
      }
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(
          "zreview-state",
          JSON.stringify({ clients, codes, wheelConfig })
        );
      } catch {}
    }, 500);
    return () => clearTimeout(timeout);
  }, [clients, codes, wheelConfig]);

  return (
    <AppContext.Provider
      value={{
        clients,
        setClients,
        codes,
        setCodes,
        wheelConfig,
        setWheelConfig,
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
