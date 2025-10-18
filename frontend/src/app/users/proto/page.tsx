import ExportedUsersPage from "@/components/layout/UserList";

export const metadata = {
  title: "Verified Users",
  description: "List of all verified users got from protobuf.",
};

export default function DashboardPage() {
  return <ExportedUsersPage />;
}