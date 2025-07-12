// src/components/settings/users/ListUsers.tsx
'use client';

import * as React from 'react';
import { PaginatedSkeletonTable } from '@/components/ui/paginated-skeleton-table';
import type { UserProfile } from '@/types/users';
import { RemoveUserDialog } from './RemoveUserDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil } from 'lucide-react';

interface ListUsersProps {
  userProfiles: UserProfile[];
  isLoading: boolean;
  error?: string;
  onEditClick: (user: UserProfile) => void;
}

export function ListUsers({ userProfiles, isLoading, error, onEditClick }: ListUsersProps) {
  const columns: { key: string; label: string; className?: string }[] = [
    { key: 'email', label: 'Email' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'role', label: 'Role' },
    { key: 'actions', label: 'Actions', className: 'text-right' },
  ];

  const renderBadge = (role: string) => {
    const variant = role === 'admin' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{role}</Badge>;
  };

  const renderRows = () =>
    userProfiles.map((user) => (
      <tr key={user.id} className="border-b">
        <td className="px-4 py-2">{user.email}</td>
        <td className="px-4 py-2">{user.full_name}</td>
        <td className="px-4 py-2">{renderBadge(String(user.role))}</td>
        <td className="px-4 py-2 text-right">
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => onEditClick(user)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <RemoveUserDialog user={user} onSuccess={() => location.reload()} />
          </div>
        </td>
      </tr>
    ));

  return (
    <PaginatedSkeletonTable
      columns={columns}
      page={1}
      totalPages={1}
      entriesCount={userProfiles.length}
      onPageChange={() => {}}
      onRefresh={() => location.reload()}
    >
      {isLoading ? null : renderRows()}
    </PaginatedSkeletonTable>
  );
}
