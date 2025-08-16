// src/app/client/[id]/tickets/page.tsx
'use client';

import { Button } from '@/components/ui/button';

export default function TicketsPage() {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Support Tickets</h2>
        <Button>New Ticket</Button>
      </div>
      <ul className="space-y-3">
        <li className="p-4 bg-card rounded border">#1234 - Internet slow - Open</li>
        <li className="p-4 bg-card rounded border">#1235 - Billing issue - Closed</li>
      </ul>
    </div>
  );
}
