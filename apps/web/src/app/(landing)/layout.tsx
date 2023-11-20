import LandingHeader from '@components/navigation/LandingHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <LandingHeader />
      {children}
    </div>
  );
}
