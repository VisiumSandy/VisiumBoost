"use client";

import { useApp } from "@/lib/context";
import Icon from "@/components/Icon";

const MOBILE_ITEMS = [
  { id: "dashboard", icon: "dashboard", label: "Accueil" },
  { id: "clients", icon: "users", label: "Clients" },
  { id: "wheel", icon: "wheel", label: "Roue" },
  { id: "codes", icon: "code", label: "Codes" },
  { id: "account", icon: "user", label: "Compte" },
];

export default function MobileNav() {
  const { currentPage, setCurrentPage } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      {MOBILE_ITEMS.map((item) => {
        const active = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className="flex-1 flex flex-col items-center gap-1 py-2 border-none bg-transparent cursor-pointer"
          >
            <Icon
              name={item.icon}
              size={20}
              color={active ? "#2563EB" : "#94A3B8"}
            />
            <span
              className="text-[10px]"
              style={{
                color: active ? "#2563EB" : "#94A3B8",
                fontWeight: active ? 700 : 500,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
