import { AppProvider } from "@/lib/context";

export const metadata = {
  title: "Tableau de bord | VisiumBoost",
};

export default function DashboardLayout({ children }) {
  return <AppProvider>{children}</AppProvider>;
}
