'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '@/components/ui/card';

export interface UserStats {
  date: string;
  count: number;
}

interface UserStatsChartProps {
  data: UserStats[];
  title?: string;
  height?: number;
}

export function UserStatsChart({
  data,
  title = 'User Creation (Last 7 Days)',
  height = 260,
}: UserStatsChartProps) {
  return (
    <Card className="p-2 md:p-4 w-full">
      <h2 className="text-base font-semibold mb-3">{title}</h2>

      {data.length === 0 ? (
        <p className="text-gray-500">No user data available.</p>
      ) : (
        <div className="w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} className='w-full'>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
                tickMargin={6}
                stroke="#9ca3af"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip
                labelStyle={{ color: '#000' }}
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                }}
                formatter={(value) => [`${value} users`, 'Count']}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
