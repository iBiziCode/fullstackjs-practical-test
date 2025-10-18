'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onConfirm: (id: string) => Promise<void>;
  loading?: boolean;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  loading = false,
}: DeleteUserDialogProps) {

    const [userLoaded, setUserLoaded] = useState(false);  
  const handleConfirm = async () => {
    try {
      await onConfirm(user);
      toast.success('User deleted successfully');
      onOpenChange(false);
    } catch {
      toast.error('Failed to delete user');
    }
  };

  useEffect(() => {
    if (user) {
      setUserLoaded(true);
    }
  }, [user]);

  return userLoaded && (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>

        <Card className="w-full p-2 shadow-none border-none">

          <CardContent className="space-y-3">
            <p className="text-gray-700 text-sm">
              Are you sure you want to delete{' '}
              <strong>{user?.email}</strong>? This action cannot be undone.
            </p>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? <Spinner /> : 'Delete'}
              </Button>
            </DialogFooter>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  ) 
}
