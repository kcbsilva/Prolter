// src/components/client/contracts/charts/ContractStatusChart.tsx
'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Contract } from '@/types/contracts';

const COLORS = ['#22c55e', '#ef4444']; // green, red

export default function ContractStatusChart({ data }: { data: Contract[] }) {
  const chartData = [
    { name: 'Active', value: data.filter(c => c.status === 'Active').length },
    { name: 'Inactive', value: data.filter(c => c.status === 'Inactive').length },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Contract Status</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80} label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
