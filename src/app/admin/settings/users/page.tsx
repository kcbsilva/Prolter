// src/app/settings/users/page.tsx
'use client';

import * as React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfiles, updateUser, deleteUsers } from '@/services/postgres/users';
import type { UserProfile } from '@/types/users';

import { ListUsers } from '@/components/settings/users/ListUsers';
import { AddUserModal } from '@/components/settings/users/AddUserModal';
import { UpdateUserModal } from '@/components/settings/users/UpdateUserModal';
import { RemoveUserDialog } from '@/components/settings/users/RemoveUserDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  AlertCircle,
  Search,
  Download,
  Users,
  Trash2,
  X
} from 'lucide-react';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

type ModalState = {
  type: 'add' | 'edit' | 'delete' | null;
  user?: UserProfile;
};

export default function UsersPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search and filter state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  // Modal state
  const [modalState, setModalState] = React.useState<ModalState>({ type: null });

  // Selection state
  const [selectedUsers, setSelectedUsers] = React.useState<Set<string>>(new Set());

  // Data fetching
  const {
    data: userProfiles = [],
    isLoading: isLoadingUserProfiles,
    error: userProfilesError,
    refetch: refetchUserProfiles,
  } = useQuery<UserProfile[], Error>({
    queryKey: ['userProfiles'],
    queryFn: getUserProfiles,
  });

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: ['userProfiles'] });
      const previousUsers = queryClient.getQueryData(['userProfiles']);

      queryClient.setQueryData(['userProfiles'], (old: UserProfile[]) =>
        old?.map(user => user.id === updatedUser.id ? { ...user, ...updatedUser } : user) || []
      );

      return { previousUsers };
    },
    onError: (err, updatedUser, context) => {
      queryClient.setQueryData(['userProfiles'], context?.previousUsers);
      toast({
        title: t('errors.update_failed', 'Update failed'),
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: t('success.user_updated', 'User updated successfully'),
      });
      closeModal();
    },
  });

  const deleteUsersMutation = useMutation({
    mutationFn: deleteUsers,
    onMutate: async (userIds) => {
      await queryClient.cancelQueries({ queryKey: ['userProfiles'] });
      const previousUsers = queryClient.getQueryData(['userProfiles']);

      queryClient.setQueryData(['userProfiles'], (old: UserProfile[]) =>
        old?.filter(user => !userIds.includes(user.id)) || []
      );

      return { previousUsers };
    },
    onError: (err, userIds, context) => {
      queryClient.setQueryData(['userProfiles'], context?.previousUsers);
      toast({
        title: t('errors.delete_failed', 'Delete failed'),
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    },
    onSuccess: (_, userIds) => {
      toast({
        title: t('success.users_deleted', 'Users deleted successfully'),
        description: `${userIds.length} users have been deleted`,
      });
      setSelectedUsers(new Set());
    },
  });

  // Memoized computations
  const filteredUsers = React.useMemo(() => {
    return userProfiles.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || (user.role?.name === roleFilter || user.role_id === roleFilter);
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [userProfiles, searchQuery, roleFilter, statusFilter]);

  const sortedAndFilteredUsers = React.useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      // Sort by name alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [filteredUsers]);

  // Modal handlers
  const openModal = React.useCallback((type: ModalState['type'], user?: UserProfile) => {
    setModalState({ type, user });
  }, []);

  const closeModal = React.useCallback(() => {
    setModalState({ type: null });
  }, []);

  const handleOpenEditUserModal = React.useCallback((user: UserProfile) => {
    openModal('edit', user);
  }, [openModal]);

  // Selection handlers
  const handleSelectAll = React.useCallback((checked: boolean) => {
    setSelectedUsers(checked ? new Set(sortedAndFilteredUsers.map(u => u.id)) : new Set());
  }, [sortedAndFilteredUsers]);

  const handleSelectUser = React.useCallback((userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  }, [selectedUsers]);

  const clearSelection = React.useCallback(() => {
    setSelectedUsers(new Set());
  }, []);

  // Export functionality
  const exportUsers = React.useCallback(() => {
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Created'],
      ...sortedAndFilteredUsers.map(user => [
        user.name,
        user.email,
        user.role?.name || 'No role',
        user.status,
        new Date(user.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: t('success.export_complete', 'Export complete'),
      description: t('success.export_complete_desc', 'Users data has been exported to CSV'),
    });
  }, [sortedAndFilteredUsers, t, toast]);

  // Bulk delete handler
  const handleBulkDelete = React.useCallback(() => {
    if (selectedUsers.size === 0) return;

    deleteUsersMutation.mutate(Array.from(selectedUsers));
  }, [selectedUsers, deleteUsersMutation]);

  // Success callback
  const handleSuccess = React.useCallback(() => {
    refetchUserProfiles();
    closeModal();
  }, [refetchUserProfiles, closeModal]);

  // Clear search
  const clearSearch = React.useCallback(() => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
  }, []);

  // Loading state
  if (isLoadingUserProfiles) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-base font-semibold">
          {t('sidebar.settings_users', 'Users')}
        </h1>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-muted-foreground">
                {t('common.loading_users', 'Loading users...')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (userProfilesError) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-base font-semibold">
          {t('sidebar.settings_users', 'Users')}
        </h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <p className="text-sm font-medium mb-1">
                {t('errors.loading_failed', 'Failed to load users')}
              </p>
              <p className="text-xs text-muted-foreground">
                {getErrorMessage(userProfilesError)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchUserProfiles()}
              className="gap-2"
            >
              <Loader2 className="h-4 w-4" />
              {t('common.retry', 'Try Again')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasFilters = searchQuery || roleFilter !== 'all' || statusFilter !== 'all';
  const isAllSelected = selectedUsers.size === sortedAndFilteredUsers.length && sortedAndFilteredUsers.length > 0;
  const isIndeterminate = selectedUsers.size > 0 && selectedUsers.size < sortedAndFilteredUsers.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">
          {t('sidebar.settings_users', 'Users')}
        </h1>
        {userProfiles.length > 0 && (
          <div className="text-xs text-muted-foreground">
            `${userProfiles.length} total users`
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.search_users', 'Search users...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('common.all_roles', 'All roles')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all_roles', 'All roles')}</SelectItem>
              <SelectItem value="admin">{t('roles.admin', 'Admin')}</SelectItem>
              <SelectItem value="user">{t('roles.user', 'User')}</SelectItem>
              <SelectItem value="manager">{t('roles.manager', 'Manager')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('common.all_status', 'All status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all_status', 'All status')}</SelectItem>
              <SelectItem value="active">{t('status.active', 'Active')}</SelectItem>
              <SelectItem value="inactive">{t('status.inactive', 'Inactive')}</SelectItem>
              <SelectItem value="pending">{t('status.pending', 'Pending')}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={clearSearch}>
                <X className="h-4 w-4 mr-1" />
                {t('common.clear_filters', 'Clear')}
              </Button>
            )}

            {sortedAndFilteredUsers.length > 0 && (
              <Button variant="outline" size="sm" onClick={exportUsers}>
                <Download className="h-4 w-4 mr-2" />
                {t('actions.export', 'Export')}
              </Button>
            )}

            <AddUserModal onSuccess={handleSuccess} />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.size > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
            <CardContent className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  ref={(el) => {
                    if (el) {
                      (el as HTMLInputElement).indeterminate = isIndeterminate;
                    }
                  }}
                />
                <span className="text-sm font-medium">
                  `${selectedUsers.size} users selected`
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  {t('common.clear_selection', 'Clear')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={deleteUsersMutation.isPending}
                  className="gap-2"
                >
                  {deleteUsersMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {t('actions.delete_selected', 'Delete Selected')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">
                {t('settings_users.manage_users_title', 'Manage Users')}
              </CardTitle>
              <CardDescription className="text-xs">
                {t(
                  'settings_users.manage_users_desc',
                  'View, add, and manage system users and their permissions.'
                )}
              </CardDescription>
            </div>
            {sortedAndFilteredUsers.length > 0 && hasFilters && (
              <div className="text-xs text-muted-foreground">
                `Showing ${sortedAndFilteredUsers.length} of ${userProfiles.length}`
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {sortedAndFilteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {hasFilters
                  ? t('empty.no_users_found', 'No users found')
                  : t('empty.no_users', 'No users yet')}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 max-w-sm">
                {hasFilters
                  ? t('empty.try_different_search', 'Try adjusting your search criteria or filters')
                  : t('empty.add_first_user', 'Add your first user to get started with user management')}
              </p>
              {hasFilters ? (
                <Button variant="outline" onClick={clearSearch}>
                  {t('common.clear_filters', 'Clear Filters')}
                </Button>
              ) : (
                <AddUserModal onSuccess={handleSuccess} />
              )}
            </div>
          ) : (
            <ListUsers
              userProfiles={sortedAndFilteredUsers}
              isLoading={isLoadingUserProfiles}
              error={getErrorMessage(userProfilesError)}
              onEditClick={handleOpenEditUserModal}
              selectedUsers={selectedUsers}
              onSelectUser={handleSelectUser}
              onSelectAll={handleSelectAll}
              showSelection={true}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <UpdateUserModal
        userProfile={modalState.user ?? null}
        open={modalState.type === 'edit'}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        onSuccess={handleSuccess}
      />

      <RemoveUserDialog onSuccess={handleSuccess} />
    </div>
)}