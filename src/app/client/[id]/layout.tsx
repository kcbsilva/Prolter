// src/app/client/[id]/layout.tsx
'use client';

import { ReactNode } from 'react';
import Header from '@/components/client/layout/Header';
import { useParams } from 'next/navigation';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { id } = useParams();

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
