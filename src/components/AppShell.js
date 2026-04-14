"use client";

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

const PAGES = {
  dashboard:    PageDashboard,
  clients:      PageClients,
  codes:        PageCodes,
  wheel:        PageWheel,
  affiliation:  PageAffiliation,
  subscription: PageSubscription,
  account:      PageAccount,
};

// Pages accessible even when trial expired
const FREE_PAGES = ["subscription", "account"];

export default function AppShell({ user }) {
  const { currentPage, setCurrentPage, sidebarCollapsed } = useApp();

  const hasAccess = isAccessAllowed(user);
  const daysLeft  = trialDaysLeft(user);
  const isAdmin   = user?.role === "admin";

  // Redirect to subscription if locked page is requested
  const effectivePage = (!hasAccess && !isAdmin && !FREE_PAGES.includes(currentPage))
    ? "subscription"
    : currentPage;

  const PageComponent = PAGES[effectivePage] || PageDashboard;

  return (
    <>
      <Sidebar user={user} hasAccess={hasAccess} daysLeft={daysLeft} />

      <main
        className="min-h-screen transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
        style={{ marginLeft: "var(--sidebar-w)", padding: "36px 40px" }}
      >
        {/* Mobile header */}
        <div className="md:hidden flex items-center mb-6">
          <img src="/images/logo_main2.png" alt="VisiumBoost" style={{ height: 48, objectFit: "contain" }} />
        </div>

        {/* Trial expiry banner */}
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
          main { padding: 20px 16px 96px !important; }
        }
      `}</style>
    </>
  );
}
