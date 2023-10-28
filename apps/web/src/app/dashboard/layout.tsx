import DashboardSidebar from "@components/navigation/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardSidebar>{children}</DashboardSidebar>;
}
