'use client';
import { useEffect, useState } from 'react';
import { listUsers, deleteUser } from '@/lib/fetcher';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDelete(id: string) {
    await deleteUser(id);
    toast.success('User removed successfully');
    loadUsers();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid gap-3">
      {users.map((u) => (
        <Card key={u.id} className="p-4 flex justify-between items-center">
          <div>
            <p className="font-medium">{u.email}</p>
            <p className="text-sm text-gray-500">{u.role}</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(u.id)}>
            Delete
          </Button>
        </Card>
      ))}
    </div>
  );
}
