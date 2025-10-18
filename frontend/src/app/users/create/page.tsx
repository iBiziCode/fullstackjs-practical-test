'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from '@/lib/fetcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const CreateUserSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  role: z.string().min(2, 'Role is required').max(20, 'Role too long'),
  status: z.enum(['active', 'inactive'] as const, { message: 'Status is required' }),
});

type CreateUserForm = z.infer<typeof CreateUserSchema>;

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(CreateUserSchema),
    mode: 'onBlur',
  });

  async function onSubmit(data: CreateUserForm) {
    setLoading(true);
    try {
      await createUser(data);
      toast.success('User created successfully!');
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-start m-10">
      <Card className="w-full max-w-md p-4 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Create User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
            <div className='py-2'>
              <Label className="py-3" htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Role */}
            <div className='py-2'>
              <Label className="py-3" htmlFor="role">Role</Label>
              <Input
                id="role"
                placeholder="user, admin, etc."
                {...register('role')}
              />
              {errors.role && (
                <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
              )}
            </div>

     {/* Status Select */}
            <div className='py-2'>
              <Label className="py-3" htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
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
                <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? <Spinner /> : 'Create User'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
