// src/app/settings/users/page.tsx
'use client';

import * as React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getUserProfiles } from '@/services/postgres/users';
import type { UserProfile } from '@/types/users';

import { ListUsers } from '@/components/settings/users/ListUsers';
import { AddUserModal } from '@/components/settings/users/AddUserModal';
import { UpdateUserModal } from '@/components/settings/users/UpdateUserModal';
import { RemoveUserDialog } from '@/components/settings/users/RemoveUserDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

export default function UsersPage() {
  const { t } = useLocale();
  const { toast } = useToast();

  const [isEditUserModalOpen, setIsEditUserModalOpen] = React.useState(false);
  const [editingUserProfile, setEditingUserProfile] = React.useState<UserProfile | null>(null);

  const {
    data: userProfiles = [],
    isLoading: isLoadingUserProfiles,
    error: userProfilesError,
    refetch: refetchUserProfiles,
  } = useQuery<UserProfile[], Error>({
    queryKey: ['userProfiles'],
    queryFn: getUserProfiles,
  });

  const handleOpenEditUserModal = (user: UserProfile) => {
    setEditingUserProfile(user);
    setIsEditUserModalOpen(true);
  };

  if (userProfilesError) return <p>Error loading users: {getErrorMessage(userProfilesError)}</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold">
        {t('sidebar.settings_users', 'Users')}
      </h1>

      <div className="flex justify-end items-center gap-2">
        <AddUserModal onSuccess={refetchUserProfiles} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {t('settings_users.manage_users_title', 'Manage Users')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t(
              'settings_users.manage_users_desc',
              'View, add, and manage system users and their permissions.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ListUsers
            userProfiles={userProfiles}
            isLoading={isLoadingUserProfiles}
            error={getErrorMessage(userProfilesError)}
            onEditClick={handleOpenEditUserModal}
          />
        </CardContent>
      </Card>

      <UpdateUserModal
        userProfile={editingUserProfile}
        open={isEditUserModalOpen}
        onOpenChange={(open) => {
          setIsEditUserModalOpen(open);
          if (!open) setEditingUserProfile(null);
        }}
        onSuccess={refetchUserProfiles}
      />

      <RemoveUserDialog onSuccess={refetchUserProfiles} />
    </div>
  );
}
