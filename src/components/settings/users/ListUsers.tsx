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
  onRefresh?: () => void;
}

export function ListUsers({
  userProfiles,
  isLoading,
  error,
  onEditClick,
  onRefresh,
}: ListUsersProps) {
  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'role', label: 'Role' },
    { key: 'actions', label: 'Actions', className: 'text-right' },
  ];

  const [page, setPage] = React.useState(1);
  const entriesPerPage = 10;
  const totalPages = Math.ceil(userProfiles.length / entriesPerPage);

  const renderBadge = (role: string) => {
    const variant = role === 'admin' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{role}</Badge>;
  };

  const currentData = userProfiles.slice(
    (page - 1) * entriesPerPage,
    page * entriesPerPage
  );

  const renderRows = () =>
    currentData.map((user) => (
      <tr key={user.id} className="border-b">
        <td className="px-4 py-2">{user.email}</td>
        <td className="px-4 py-2">{user.full_name}</td>
        <td className="px-4 py-2">{renderBadge(String(user.role?.name || user.role))}</td>
        <td className="px-4 py-2 text-right">
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => onEditClick(user)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <RemoveUserDialog user={user} onSuccess={onRefresh || (() => {})} />
          </div>
        </td>
      </tr>
    ));

  return (
    <>
      {error && (
        <div className="text-sm text-red-500 px-4 py-2">
          Error loading users: {error}
        </div>
      )}
      <PaginatedSkeletonTable
        columns={columns}
        page={page}
        totalPages={totalPages}
        entriesCount={userProfiles.length}
        onPageChange={setPage}
        onRefresh={onRefresh || (() => {})}
      >
        {!isLoading && currentData.length > 0 ? renderRows() : null}
      </PaginatedSkeletonTable>
    </>
  );
}
