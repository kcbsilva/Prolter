// src/app/client/[id]/profile/page.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <Input defaultValue="John Doe" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input defaultValue="client@example.com" />
        </div>
        <Button>Save Changes</Button>
      </form>
    </div>
  );
}
