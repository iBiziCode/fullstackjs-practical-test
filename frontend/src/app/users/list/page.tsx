

export const metadata = {
  title: "User List",
  description: "List of all users.",
};

export default function UserListPage() {
  return <ExportedUsersPage />;
}
import ExportedUsersPage from "@/components/layout/UserList";