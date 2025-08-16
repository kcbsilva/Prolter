// src/components/client/contracts/charts/ServicesDistributionChart.tsx
'use client';

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Contract } from '@/types/contracts';

export default function ServicesDistributionChart({ data }: { data: Contract[] }) {
  const serviceCounts: Record<string, number> = {};
  data.forEach(contract => {
    contract.services.forEach(service => {
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });
  });

  const chartData = Object.entries(serviceCounts).map(([service, count]) => ({
    service,
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Services Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="service" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" /> {/* blue */}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
