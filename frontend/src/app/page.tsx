
import UserStatsPage from '@/components/layout/UserStatsPage';

export const metadata = {
  title: "User Dashboard",
  description: "Overview of your account, recent activity, and settings.",
};

export default function DashboardPage() {
  return <UserStatsPage />;
}