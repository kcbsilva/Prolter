// src/components/client/Header.tsx
'use client';

import Link from 'next/link';
import { Home, User } from 'lucide-react';
import { Button } from '@/components/shared/ui/button';
import { ThemeToggle } from '@/components/shared/ui/theme-toggle';
import { Separator } from '@/components/shared/ui/separator';

export default function Header() {
  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4">
      {/* Left: Home */}
      <div className="flex items-center">
        <Link href="/client">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Center: Logo */}
      <div className="flex items-center justify-center flex-1">
        <span className="text-lg font-bold">Prolter</span>
      </div>

      {/* Right: Theme toggle + Separator + User */}
      <div className="flex items-center gap-2">
        <ThemeToggle mounted={false} theme={undefined} setTheme={function (theme: string): void {
          throw new Error('Function not implemented.');
        } } />
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
