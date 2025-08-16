// src/app/client/[id]/home/page.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, FileText, CreditCard, MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ClientHome() {
  const { id } = useParams(); // later you can fetch the real customer name by id
  const customerName = "John Doe"; // mock data for now

  const links = [
    { href: `/client/${id}#contracts`, label: "Contracts", icon: FileText },
    { href: `/client/${id}#billing`, label: "Billing", icon: CreditCard },
    { href: `/client/${id}#tickets`, label: "Support", icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 space-y-10">
      {/* Welcome message */}
      <h1 className="text-2xl font-semibold text-center">
        Welcome, <span className="text-primary">{customerName}</span>
      </h1>

      {/* Button grid */}
      <div className="grid gap-6 w-full max-w-md sm:max-w-lg md:max-w-2xl md:grid-cols-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <div className="w-full h-32 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-between py-4 cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Icon className="w-7 h-7 text-primary" />
                <span className="text-lg font-medium">{label}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
