'use client';

import { useEffect, useState } from 'react';
import { fetchUserStats } from '@/lib/fetcher';
import { toast } from 'sonner';
import { UserStatsChart } from '@/components/userStatsChart';

export default function UserStatsPage() {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await fetchUserStats();
        toast.success('User stats loaded');
        setData(stats);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Loading user stats...</p>;

  return (
    <div className="space-y-4">
      <UserStatsChart data={data} />
    </div>
  );
}
