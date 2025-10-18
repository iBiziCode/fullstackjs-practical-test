'use client';

import { useEffect, useState } from 'react';
import { listUsers, updateUser, deleteUser } from '@/lib/fetcher';
import { toast } from 'sonner';
import { Spinner } from "@/components/ui/spinner"
import { PencilIcon, TrashIcon } from 'lucide-react';
import { EditUserDialog } from '@/components/userEditDialog';
import { Button } from '@/components/ui/button';
import { DeleteUserDialog } from '@/components/userDeleteDialog';

export default function UsersList() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function loadUsers() {
            try {
                const allUsers = await listUsers();


                setUsers(allUsers);
                toast.success(`${allUsers.length} users loaded`);
            } catch (err: any) {
                toast.error(err.message || 'Failed to load users');
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    if (loading)
        return <p className="p-4"><Spinner />Loading users</p>;

    if (users.length === 0)
        return <p className="p-4">No users found.</p>;

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setEditOpen(true);
    };

    const handleSave = async (data: any) => {
        setSaving(true);
        try {
            await updateUser(selectedUser.id, data);
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...data } : u));
        } catch (err) {
            toast.error('Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (user: any) => {
        setSelectedUser(user);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async (id: string) => {
        setDeleting(true);
        try {
            await deleteUser(id);
            setUsers(users.filter((u) => u.id !== id));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="py-4 px-2 md:p-4">
            <h1 className="text-lg font-semibold mb-4">All Users</h1>

            <div className="">
                <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left text-xs md:text-sm font-medium">Email</th>
                            <th className="p-3 text-left text-xs md:text-sm font-medium">Role</th>
                            <th className="p-3 text-left text-xs md:text-sm font-medium">Status</th>
                            <th className="p-3 text-left text-xs md:text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t hover:bg-gray-50">
                                <td className="p-3 text-xs md:text-sm">{user.email}  </td>
                                <td className="p-3 text-xs md:text-sm">{user.role}</td>
                                <td className="p-3 text-xs md:text-sm capitalize">{user.status}</td>

                                <td>

                                    <Button
                                    
                                        onClick={() => handleEdit(user)}
                                        variant="outline"
                                        className= "my-1 mx-auto sm:mr-2"
                                        size="sm"
                                    >
                                        <PencilIcon/>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(user.id)}
                                        size="sm"
                                        className='my-1 mx-auto'
                                    >
                                        <TrashIcon/>
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <EditUserDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                user={selectedUser}
                onSave={handleSave}
                loading={saving}
            />
            <DeleteUserDialog
  open={deleteOpen}
  onOpenChange={setDeleteOpen}
  user={selectedUser}
  onConfirm={handleConfirmDelete}
  loading={deleting}
/>

        </div>
    );
}