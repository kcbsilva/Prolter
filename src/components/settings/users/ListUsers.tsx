// src/components/settings/users/ListUsers.tsx
'use client';

import * as React from 'react';
import { PaginatedSkeletonTable } from '@/components/ui/paginated-skeleton-table';
import type { UserProfile } from '@/types/users';
import { RemoveUserDialog } from './RemoveUserDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil } from 'lucide-react';

interface ListUsersProps {
  userProfiles: UserProfile[];
  isLoading: boolean;
  error?: string;
  onEditClick: (user: UserProfile) => void;
  onRefresh?: () => void;
  selectedUsers?: Set<string>;
  onSelectUser?: (userId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  showSelection?: boolean;
}

export function ListUsers({
  userProfiles,
  isLoading,
  error,
  onEditClick,
  onRefresh,
  selectedUsers = new Set(),
  onSelectUser,
  onSelectAll,
  showSelection = false,
}: ListUsersProps) {
  const [page, setPage] = React.useState(1);
  const entriesPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(userProfiles.length / entriesPerPage));
  const currentData = userProfiles.slice(
    (page - 1) * entriesPerPage,
    page * entriesPerPage
  );

  const renderBadge = (role: string) => {
    const variant = role === 'admin' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{role}</Badge>;
  };

  const renderRows = () =>
    currentData.map((user) => {
      const isChecked = selectedUsers.has(user.id);
      return (
        <tr key={user.id} className="border-b">
          {showSelection && (
            <td className="px-4 py-2">
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) => onSelectUser?.(user.id, Boolean(checked))}
              />
            </td>
          )}
          <td className="px-4 py-2">{user.email}</td>
          <td className="px-4 py-2">{user.full_name}</td>
          <td className="px-4 py-2">{renderBadge(user.role?.name || 'Unassigned')}</td>
          <td className="px-4 py-2 text-right">
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => onEditClick(user)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <RemoveUserDialog user={user} onSuccess={onRefresh || (() => {})} />
            </div>
          </td>
        </tr>
      );
    });

  const columns = [
    ...(showSelection ? [{ key: 'select', label: '' }] : []),
    { key: 'email', label: 'Email' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'role', label: 'Role' },
    { key: 'actions', label: 'Actions', className: 'text-right' },
  ];

  if (error) {
    return <p className="text-sm text-red-500 px-4 py-2">Error loading users: {error}</p>;
  }

  if (!isLoading && userProfiles.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No users found.</p>;
  }

  return (
    <PaginatedSkeletonTable
      columns={columns}
      page={page}
      totalPages={totalPages}
      entriesCount={userProfiles.length}
      onPageChange={setPage}
      onRefresh={onRefresh || (() => {})}
    >
      {isLoading ? null : renderRows()}
    </PaginatedSkeletonTable>
  );
}
