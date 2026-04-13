"use client";

import { useApp } from "@/lib/context";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import PageDashboard from "@/components/pages/PageDashboard";
import PageClients from "@/components/pages/PageClients";
import PageCodes from "@/components/pages/PageCodes";
import PageWheel from "@/components/pages/PageWheel";
import PageAffiliation from "@/components/pages/PageAffiliation";
import PageSubscription from "@/components/pages/PageSubscription";
import PageAccount from "@/components/pages/PageAccount";

const PAGES = {
  dashboard: PageDashboard,
  clients: PageClients,
  codes: PageCodes,
  wheel: PageWheel,
  affiliation: PageAffiliation,
  subscription: PageSubscription,
  account: PageAccount,
};

export default function AppShell({ user }) {
  const { currentPage, sidebarCollapsed } = useApp();
  const PageComponent = PAGES[currentPage] || PageDashboard;

  return (
    <>
      <Sidebar user={user} />

      <main
        className="min-h-screen transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
        style={{ marginLeft: "var(--sidebar-w)", padding: "32px 40px" }}
      >
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-400">
            <span className="text-white font-black text-base" style={{ fontFamily: "'Calistoga', serif" }}>z</span>
          </div>
          <span className="font-extrabold text-xl text-dark-900 tracking-tight" style={{ fontFamily: "'Calistoga', serif" }}>
            zReview
          </span>
        </div>

        <div className="max-w-[1100px]">
          <PageComponent user={user} />
        </div>
      </main>

      <MobileNav />

      <style>{`
        :root { --sidebar-w: ${sidebarCollapsed ? "72px" : "260px"}; }
        @media (max-width: 767px) {
          :root { --sidebar-w: 0px; }
          main { padding: 24px 16px 100px !important; }
        }
      `}</style>
    </>
  );
}
