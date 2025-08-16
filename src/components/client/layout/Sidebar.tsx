// src/components/client/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { LayoutDashboard, FileText, CreditCard, MessageSquare, User } from 'lucide-react';

export default function Sidebar({ clientId }: { clientId: string }) {
  return (
    <aside className="w-64 bg-card border-r p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold mb-6">Client Portal</h2>
        <nav className="flex flex-col gap-2">
          <Link href={`/client/${clientId}/home`} className="flex items-center gap-2 p-2 rounded hover:bg-accent">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href={`/client/${clientId}/contracts`} className="flex items-center gap-2 p-2 rounded hover:bg-accent">
            <FileText className="w-5 h-5" /> Contracts
          </Link>
          <Link href={`/client/${clientId}/invoices`} className="flex items-center gap-2 p-2 rounded hover:bg-accent">
            <CreditCard className="w-5 h-5" /> Invoices
          </Link>
          <Link href={`/client/${clientId}/tickets`} className="flex items-center gap-2 p-2 rounded hover:bg-accent">
            <MessageSquare className="w-5 h-5" /> Support Tickets
          </Link>
          <Link href={`/client/${clientId}/profile`} className="flex items-center gap-2 p-2 rounded hover:bg-accent">
            <User className="w-5 h-5" /> Profile
          </Link>
        </nav>
      </div>
      <button className="w-full p-2 bg-destructive text-destructive-foreground rounded">
        Logout
      </button>
    </aside>
  );
}
