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
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onSave: (data: any) => Promise<void>;
  loading?: boolean;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSave,
  loading = false,
}: EditUserDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: user?.email || '',
      role: user?.role || '',
      status: user?.status || '',
    },
  });

   useEffect(() => {
    if (user) {
      reset({
        email: user.email || '',
        role: user.role || '',
        status: user.status || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: any) => {
    try {
      await onSave(data);
      toast.success('User updated successfully');
      onOpenChange(false);
    } catch (error:any) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <Card className="w-full p-2 shadow-none border-none">

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */} 
              <div className="py-3">
                <Label className='py-2' htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>

              {/* Role */}
              <div className="py-3">
                <Label className="py-2" htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="user, admin, etc."
                  {...register('role', { required: 'Role is required' })}
                />
                {errors.role && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.role.message as string}
                  </p>
                )}
              </div>

              {/* Status Select */}
              <div className="py-3">
                <Label className="py-2" htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: 'Status is required' }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.status.message as string}
                  </p>
                )}
              </div>

              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? <Spinner /> : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
