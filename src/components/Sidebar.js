"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { trialDaysLeft } from "@/lib/utils";
import Icon from "@/components/Icon";

const NAV_ITEMS = [
  { id: "dashboard",    icon: "dashboard",   label: "Tableau de bord" },
  { id: "clients",      icon: "users",       label: "Mes entreprises" },
  { id: "wheel",        icon: "wheel",       label: "Ma Roue" },
  { id: "codes",        icon: "check",       label: "Validations" },
  { id: "affiliation",  icon: "link",        label: "Affiliation" },
  { id: "subscription", icon: "creditCard",  label: "Abonnement" },
  { id: "account",      icon: "user",        label: "Mon compte" },
];

// Always accessible, even when trial expired
const FREE_PAGES = ["subscription", "account"];

const PLAN_BADGE = {
  pro:     { label: "Pro",        color: "#60A5FA" },
  starter: { label: "Starter",    color: "#34D399" },
  free:    { label: "Essai gratuit", color: "#F59E0B" },
};

export default function Sidebar({ user, hasAccess, daysLeft }) {
  const router = useRouter();
  const { currentPage, setCurrentPage, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const isAdmin = user?.role === "admin";
  const plan = PLAN_BADGE[user?.plan] || PLAN_BADGE.free;
  const trialLeft = daysLeft ?? trialDaysLeft(user);

  // Override badge for expired trial
  const planLabel = (!hasAccess && !isAdmin)
    ? { label: "Essai expiré", color: "#EF4444" }
    : (user?.plan === "free" && trialLeft > 0)
    ? { label: `Essai — ${trialLeft}j`, color: "#F59E0B" }
    : plan;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const handleNavClick = (itemId) => {
    if (!isAdmin && !hasAccess && !FREE_PAGES.includes(itemId)) return;
    setCurrentPage(itemId);
  };

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
      style={{ width: sidebarCollapsed ? 68 : 256, background: "#0F172A" }}
    >
      {/* Logo row */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <img
          src="/images/logo_main2.png"
          alt="VisiumBoost"
          style={{ height: sidebarCollapsed ? 36 : 48, objectFit: "contain", flexShrink: 0, transition: "height 0.3s" }}
        />
        {!sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="ml-auto p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Réduire la sidebar"
          >
            <Icon name="chevronLeft" size={15} />
          </button>
        )}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="w-full flex justify-center p-1 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Agrandir la sidebar"
          >
            <Icon name="chevronRight" size={15} />
          </button>
        )}
      </div>

      {/* User card */}
      {!sidebarCollapsed && user && (
        <div style={{
          margin: "4px 12px 8px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
          padding: "10px 12px",
          border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #3B82F6, #0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, color: "#fff", fontSize: 13, flexShrink: 0,
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              color: "#F1F5F9", fontWeight: 600, fontSize: 13,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: planLabel.color, letterSpacing: 0.3 }}>
              {planLabel.label}
            </div>
          </div>
        </div>
      )}

      {/* Trial expiry warning in sidebar */}
      {!sidebarCollapsed && !isAdmin && !hasAccess && (
        <div style={{
          margin: "0 12px 8px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 10, padding: "9px 11px",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#FCA5A5", marginBottom: 3 }}>
            Essai gratuit expiré
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>
            Abonnez-vous pour accéder au tableau de bord.
          </div>
          <button
            onClick={() => setCurrentPage("subscription")}
            style={{
              marginTop: 7, width: "100%", padding: "6px 0", borderRadius: 7,
              background: "#EF4444", border: "none", color: "#fff",
              fontWeight: 700, fontSize: 11, cursor: "pointer",
            }}
          >
            Voir les plans
          </button>
        </div>
      )}

      {/* Nav section label */}
      {!sidebarCollapsed && (
        <div style={{ padding: "8px 16px 4px", fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: 1, textTransform: "uppercase" }}>
          Menu
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-1 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.id;
          const locked = !isAdmin && !hasAccess && !FREE_PAGES.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`sidebar-item ${active ? "sidebar-item-active" : "sidebar-item-inactive"}`}
              title={sidebarCollapsed ? item.label : locked ? "Abonnement requis" : ""}
              style={{
                justifyContent: sidebarCollapsed ? "center" : undefined,
                opacity: locked ? 0.35 : 1,
                filter: locked ? "blur(0.4px)" : "none",
                cursor: locked ? "not-allowed" : "pointer",
                pointerEvents: locked ? "none" : undefined,
              }}
            >
              <Icon name={item.icon} size={18} color={active ? "#60A5FA" : "#475569"} />
              {!sidebarCollapsed && (
                <span style={{ color: active ? "#93C5FD" : "#94A3B8", flex: 1 }}>{item.label}</span>
              )}
              {!sidebarCollapsed && locked && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 flex flex-col gap-1.5">
        {!isAdmin && (hasAccess ? user?.plan !== "pro" : true) && !sidebarCollapsed && (
          <button
            onClick={() => setCurrentPage("subscription")}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-white font-semibold text-[13px] w-full hover:opacity-90 transition-opacity"
            style={{ background: !hasAccess ? "linear-gradient(135deg,#EF4444,#DC2626)" : "linear-gradient(135deg, #2563EB, #0EA5E9)" }}
          >
            <Icon name="zap" size={16} color="#fff" />
            {!hasAccess ? "Activer un abonnement" : "Passer en Pro"}
          </button>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 font-medium text-[13px] w-full hover:bg-white/[0.05] hover:text-slate-300 transition-colors"
          style={{ justifyContent: sidebarCollapsed ? "center" : undefined }}
          title={sidebarCollapsed ? "Déconnexion" : ""}
        >
          <Icon name="logout" size={17} />
          {!sidebarCollapsed && "Déconnexion"}
        </button>
      </div>
    </aside>
  );
}
