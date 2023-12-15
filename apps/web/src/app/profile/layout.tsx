import DashboardHeader from '@components/navigation/DashboardHeader';
import DashboardSidebar from '@components/navigation/DashboardSidebar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardSidebar>
      {children}
    </DashboardSidebar>
  );
}
