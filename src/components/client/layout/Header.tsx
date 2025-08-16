// src/components/client/Header.tsx
'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { id } = useParams();

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4">
      <h1 className="font-semibold">Welcome, Client #{id}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Account ID: {id}</span>
        <Button size="sm" variant="outline">Help</Button>
      </div>
    </header>
  );
}
