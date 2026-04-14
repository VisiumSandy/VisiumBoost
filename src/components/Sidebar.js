"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
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

const PLAN_BADGE = {
  pro:     { label: "Pro",     color: "#60A5FA" },
  starter: { label: "Starter", color: "#34D399" },
  free:    { label: "Gratuit", color: "#94A3B8" },
};

export default function Sidebar({ user }) {
  const router = useRouter();
  const { currentPage, setCurrentPage, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const plan = PLAN_BADGE[user?.plan] || PLAN_BADGE.free;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
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
            <div style={{ fontSize: 11, fontWeight: 600, color: plan.color, letterSpacing: 0.3 }}>
              {plan.label}
            </div>
          </div>
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
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`sidebar-item ${active ? "sidebar-item-active" : "sidebar-item-inactive"}`}
              title={sidebarCollapsed ? item.label : ""}
              style={{ justifyContent: sidebarCollapsed ? "center" : undefined }}
            >
              <Icon name={item.icon} size={18} color={active ? "#60A5FA" : "#475569"} />
              {!sidebarCollapsed && (
                <span style={{ color: active ? "#93C5FD" : "#94A3B8" }}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 flex flex-col gap-1.5">
        {user?.plan !== "pro" && !sidebarCollapsed && (
          <button
            onClick={() => setCurrentPage("subscription")}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-white font-semibold text-[13px] w-full hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #2563EB, #0EA5E9)" }}
          >
            <Icon name="zap" size={16} color="#fff" />
            Passer en Pro
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
