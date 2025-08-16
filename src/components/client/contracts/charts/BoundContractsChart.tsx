// src/components/client/contracts/charts/BoundContractsChart.tsx
'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Contract } from '@/types/contracts';

const COLORS = ['#0ea5e9', '#a3a3a3']; // sky-blue, gray

export default function BoundContractsChart({ data }: { data: Contract[] }) {
  const chartData = [
    { name: 'Bound', value: data.filter(c => c.bound).length },
    { name: 'Not Bound', value: data.filter(c => !c.bound).length },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Bound vs Not Bound</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} label>
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
