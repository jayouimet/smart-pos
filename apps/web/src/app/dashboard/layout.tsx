import DashboardHeader from '@components/navigation/DashboardHeader';
import DashboardSidebar from '@components/navigation/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardSidebar>
      <DashboardHeader />
      {children}
    </DashboardSidebar>
  );
}
