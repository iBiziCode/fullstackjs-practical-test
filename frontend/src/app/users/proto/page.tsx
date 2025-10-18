'use client';

import { useEffect, useState } from 'react';
import { decodeUsers } from '@/lib/protobuf';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { fetchUsersProto } from '@/lib/fetcher';
import { verifyUser } from '@/lib/verify';
import { Badge } from '@/components/ui/badge';
import { BadgeCheckIcon } from 'lucide-react';


export default function ExportedUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsersProto() {
      try {
        const response = await fetchUsersProto();
        const decoded = await decodeUsers(response);
        const usersArray = Array.isArray(decoded.users) ? decoded.users : decoded.users ? [decoded.users] : [];
        const verified = [];
        for (const user of usersArray) {
          const valid = await verifyUser(user);
          if (valid) verified.push(user);
        }
        setUsers(verified);
        toast.success(`Loaded ${verified.length} verified users from protobuf`);
      } catch (error:any) {
        toast.error(error.message || 'Failed to load protobuf data');
      } finally {
        setLoading(false);
      }
    }

    loadUsersProto();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (users.length === 0) return <p>No users found.</p>;



  return (
    <div className="p-4">
                <h1 className="text-lg font-semibold mb-4">Verified Users</h1>
    
                <div className=" overflow-x-auto">
                    <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left text-sm font-medium">Email</th>
                                <th className="p-3 text-left text-sm font-medium">Role</th>
                                <th className="p-3 text-left text-sm font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 text-sm">{user.email}         <Badge
                                        variant="secondary"
                                        className="bg-black text-white dark:bg-blue-600 text text-xs"
                                    >
                                        <BadgeCheckIcon className='text-sm' />
                                        Verified
                                    </Badge></td>
                                    <td className="p-3 text-sm">{user.role}</td>
                                    <td className="p-3 text-sm capitalize">{user.status}</td>

    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
    
            </div>
        );
    }
    