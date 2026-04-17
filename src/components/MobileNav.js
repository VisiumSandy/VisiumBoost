"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import Icon from "@/components/Icon";

const MAIN_ITEMS = [
  { id: "dashboard", icon: "dashboard", label: "Accueil" },
  { id: "clients",   icon: "users",     label: "Clients" },
  { id: "wheel",     icon: "wheel",     label: "Roue" },
  { id: "codes",     icon: "check",     label: "Codes" },
];

const MORE_ITEMS = [
  { id: "affiches",     icon: "print",         label: "Affiches" },
  { id: "avis",         icon: "messageCircle", label: "Avis Google" },
  { id: "stats",        icon: "barChart",      label: "Statistiques" },
  { id: "affiliation",  icon: "link",          label: "Affiliation" },
  { id: "subscription", icon: "creditCard",    label: "Abonnement" },
  { id: "account",      icon: "user",          label: "Mon compte" },
];

const FREE_PAGES = ["subscription", "account"];

export default function MobileNav({ hasAccess }) {
  const { currentPage, setCurrentPage, pendingValidations } = useApp();
  const [sheetOpen, setSheetOpen] = useState(false);

  const moreActive = MORE_ITEMS.some(i => i.id === currentPage);

  const handleNav = (id) => {
    const locked = !hasAccess && !FREE_PAGES.includes(id);
    if (locked) return;
    setCurrentPage(id);
    setSheetOpen(false);
  };

  return (
    <>
      {/* Bottom nav bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "#fff",
          borderTop: "1px solid #F1F5F9",
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex" }}>
          {MAIN_ITEMS.map((item) => {
            const active = currentPage === item.id;
            const locked = !hasAccess && !FREE_PAGES.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 3, padding: "10px 0",
                  background: "none", border: "none", cursor: locked ? "not-allowed" : "pointer",
                  opacity: locked ? 0.35 : 1, position: "relative",
                }}
              >
                {active && (
                  <span style={{
                    position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                    width: 28, height: 3, borderRadius: 99,
                    background: "#2563EB",
                  }} />
                )}
                <div style={{ position: "relative" }}>
                  <Icon name={item.icon} size={22} color={active ? "#2563EB" : "#94A3B8"} />
                  {item.id === "codes" && pendingValidations > 0 && (
                    <span style={{
                      position: "absolute", top: -4, right: -6,
                      background: "#EF4444", color: "#fff",
                      fontSize: 9, fontWeight: 800, borderRadius: 99,
                      minWidth: 14, height: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 3px", lineHeight: 1,
                    }}>
                      {pendingValidations > 9 ? "9+" : pendingValidations}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: active ? 700 : 500,
                  color: active ? "#2563EB" : "#94A3B8",
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, padding: "10px 0",
              background: "none", border: "none", cursor: "pointer",
              position: "relative",
            }}
          >
            {moreActive && (
              <span style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: 28, height: 3, borderRadius: 99, background: "#2563EB",
              }} />
            )}
            <div style={{
              width: 22, height: 22, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 3.5,
            }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 16, height: 2, borderRadius: 2,
                  background: moreActive ? "#2563EB" : "#94A3B8",
                  display: "block",
                }} />
              ))}
            </div>
            <span style={{
              fontSize: 10, fontWeight: moreActive ? 700 : 500,
              color: moreActive ? "#2563EB" : "#94A3B8",
            }}>
              Plus
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom sheet overlay */}
      {sheetOpen && (
        <>
          <div
            onClick={() => setSheetOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 60,
              background: "rgba(0,0,0,0.4)",
              animation: "fadeInBg 0.2s ease",
            }}
          />
          <div
            className="md:hidden"
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 70,
              background: "#fff",
              borderRadius: "20px 20px 0 0",
              paddingBottom: "env(safe-area-inset-bottom, 20px)",
              animation: "slideUpSheet 0.28s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
            }}
          >
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 8 }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: "#E2E8F0" }} />
            </div>

            <div style={{ padding: "4px 16px 12px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                Plus de pages
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {MORE_ITEMS.map((item) => {
                  const active = currentPage === item.id;
                  const locked = !hasAccess && !FREE_PAGES.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 14px", borderRadius: 14,
                        background: active ? "#EFF6FF" : "#F8FAFC",
                        border: `1.5px solid ${active ? "#BFDBFE" : "#F1F5F9"}`,
                        cursor: locked ? "not-allowed" : "pointer",
                        opacity: locked ? 0.4 : 1,
                        textAlign: "left",
                      }}
                    >
                      <Icon name={item.icon} size={18} color={active ? "#2563EB" : "#64748B"} />
                      <span style={{
                        fontSize: 13, fontWeight: active ? 700 : 500,
                        color: active ? "#2563EB" : "#334155",
                      }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeInBg { from{opacity:0} to{opacity:1} }
        @keyframes slideUpSheet { from{transform:translateY(100%)} to{transform:translateY(0)} }
      `}</style>
    </>
  );
}
