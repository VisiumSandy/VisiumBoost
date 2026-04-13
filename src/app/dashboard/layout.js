import { AppProvider } from "@/lib/context";

export const metadata = {
  title: "Dashboard — zReview",
};

export default function DashboardLayout({ children }) {
  return <AppProvider>{children}</AppProvider>;
}
