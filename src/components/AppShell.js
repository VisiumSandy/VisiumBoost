"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { isAccessAllowed, trialDaysLeft } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Icon from "@/components/Icon";
import PageDashboard   from "@/components/pages/PageDashboard";
import PageClients     from "@/components/pages/PageClients";
import PageCodes       from "@/components/pages/PageCodes";
import PageWheel       from "@/components/pages/PageWheel";
import PageAffiliation from "@/components/pages/PageAffiliation";
import PageSubscription from "@/components/pages/PageSubscription";
import PageAccount     from "@/components/pages/PageAccount";
import PageAffiches    from "@/components/pages/PageAffiches";
import PageStats       from "@/components/pages/PageStats";
import PageAvis        from "@/components/pages/PageAvis";

const PAGES = {
  dashboard:    PageDashboard,
  clients:      PageClients,
  codes:        PageCodes,
  wheel:        PageWheel,
  affiches:     PageAffiches,
  avis:         PageAvis,
  stats:        PageStats,
  affiliation:  PageAffiliation,
  subscription: PageSubscription,
  account:      PageAccount,
};

const FREE_PAGES = ["subscription", "account"];

// Isolated component to read ?stripe= param without blocking SSR
function StripeReturnHandler({ onToast }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setCurrentPage } = useApp();

  useEffect(() => {
    const stripe = searchParams.get("stripe");
    if (!stripe) return;

    if (stripe === "success") {
      onToast({ ok: true, msg: "Paiement confirmé — votre abonnement est actif !" });
      setCurrentPage("dashboard");
    } else if (stripe === "cancel") {
      onToast({ ok: false, msg: "Paiement annulé. Vous pouvez réessayer à tout moment." });
    }
    router.replace("/dashboard", { scroll: false });
  }, [searchParams, router, setCurrentPage, onToast]);

  return null;
}

const PAGE_TITLES = {
  dashboard:    "Tableau de bord",
  clients:      "Mes entreprises",
  wheel:        "Ma Roue",
  affiches:     "Affiches QR",
  codes:        "Validations",
  avis:         "Avis Google",
  stats:        "Statistiques",
  affiliation:  "Affiliation",
  subscription: "Abonnement",
  account:      "Mon compte",
};

export default function AppShell({ user }) {
  const { currentPage, setCurrentPage, sidebarCollapsed, pendingValidations } = useApp();
  const [toast, setToast] = useState(null);

  const hasAccess = isAccessAllowed(user);
  const daysLeft  = trialDaysLeft(user);
  const isAdmin   = user?.role === "admin";

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const effectivePage = (!hasAccess && !isAdmin && !FREE_PAGES.includes(currentPage))
    ? "subscription"
    : currentPage;

  const PageComponent = PAGES[effectivePage] || PageDashboard;

  return (
    <>
      <Suspense fallback={null}>
        <StripeReturnHandler onToast={setToast} />
      </Suspense>

      <Sidebar user={user} hasAccess={hasAccess} daysLeft={daysLeft} />

      {/* Stripe toast */}
      {toast && (
        <div className="toast-notification" style={{
          position: "fixed", top: 20, right: 20, zIndex: 200,
          background: toast.ok ? "#F0FDF4" : "#FEF2F2",
          border: `1.5px solid ${toast.ok ? "#BBF7D0" : "#FECACA"}`,
          borderRadius: 14, padding: "14px 18px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", gap: 10,
          fontSize: 14, fontWeight: 600,
          color: toast.ok ? "#166534" : "#DC2626",
          maxWidth: 380, animation: "slideIn 0.3s ease",
        }}>
          <span style={{ fontSize: 18 }}>{toast.ok ? "✓" : "✗"}</span>
          {toast.msg}
          <button onClick={() => setToast(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: 16, opacity: 0.6 }}>×</button>
        </div>
      )}

      <main
        className="min-h-screen transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
        style={{ marginLeft: "var(--sidebar-w)", padding: "36px 40px" }}
      >
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between mb-5" style={{ marginTop: -4 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.3px" }}>
              {PAGE_TITLES[currentPage] || "Dashboard"}
            </h1>
          </div>
          <button
            onClick={() => setCurrentPage("account")}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, #3B82F6, #0EA5E9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: "pointer", flexShrink: 0,
              color: "#fff", fontWeight: 800, fontSize: 15,
              position: "relative",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
            {pendingValidations > 0 && (
              <span style={{
                position: "absolute", top: -2, right: -2,
                background: "#EF4444", width: 10, height: 10,
                borderRadius: "50%", border: "2px solid #F8FAFC",
              }} />
            )}
          </button>
        </div>

        {/* Trial expiry warning banner (last 3 days) */}
        {!isAdmin && hasAccess && daysLeft > 0 && daysLeft <= 3 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#FFF7ED", border: "1.5px solid #FED7AA",
            borderRadius: 12, padding: "11px 16px", marginBottom: 20,
            fontSize: 13, color: "#92400E",
          }}>
            <Icon name="zap" size={16} color="#F59E0B" />
            <span>
              <strong>Essai gratuit :</strong> il vous reste <strong>{daysLeft} jour{daysLeft > 1 ? "s" : ""}</strong> — abonnez-vous pour conserver votre accès.
            </span>
            <button
              onClick={() => setCurrentPage("subscription")}
              style={{ marginLeft: "auto", background: "#F59E0B", color: "#fff", border: "none", borderRadius: 8, padding: "5px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
            >
              Voir les plans
            </button>
          </div>
        )}

        <div className="max-w-[1080px]">
          <PageComponent user={user} />
        </div>
      </main>

      <MobileNav hasAccess={hasAccess} />

      <style>{`
        :root { --sidebar-w: ${sidebarCollapsed ? "68px" : "256px"}; }
        @media (max-width: 767px) {
          :root { --sidebar-w: 0px; }
          main { padding: 20px 16px 88px !important; }
        }
        @keyframes slideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 767px) {
          .toast-notification { top: auto !important; bottom: 96px !important; left: 16px !important; right: 16px !important; max-width: none !important; }
        }
      `}</style>
    </>
  );
}
