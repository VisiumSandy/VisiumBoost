import { AppProvider } from "@/lib/context";

export const metadata = {
  title: "Dashboard — VisiumBoost",
};

export default function DashboardLayout({ children }) {
  return <AppProvider>{children}</AppProvider>;
}
