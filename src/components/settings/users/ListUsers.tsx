// /components/settings/users/ListUsers.tsx
'use client'

import * as React from 'react'
import { ProUser, UserStatus } from '@/types/prousers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { UserBar } from './UserBar'
import { cn } from '@/lib/utils'
import { UpdatePasswordModal } from './UpdatePasswordModal'
import { AddUserModal } from './AddUserModal'
import { toast } from '@/hooks/use-toast'

interface ListUsersProps {
  tab: 'active' | 'archived'
}

export function ListUsers({ tab }: ListUsersProps) {
  const [users, setUsers] = React.useState<ProUser[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingUserId, setEditingUserId] = React.useState<string | null>(null)
  const [editedData, setEditedData] = React.useState<Partial<ProUser>>({})
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
  const [showPasswordModal, setShowPasswordModal] = React.useState(false)
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)

  const USERS_PER_PAGE = 10
  const isArchivedTab = tab === 'archived'

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/settings/users?archived=${isArchivedTab}`)
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error('[FETCH_USERS_ERROR]', err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [tab])

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE)

  const paginatedUsers = users
    .filter(user =>
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
    )
    .slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE)

  const handleEdit = (user: ProUser) => {
    setEditingUserId(user.id)
    setEditedData(user)
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/settings/users/update/${editingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      })
      if (!res.ok) throw new Error('Update failed')
      setEditingUserId(null)
      setEditedData({})
      fetchUsers()
    } catch (error) {
      console.error('[INLINE_EDIT_ERROR]', error)
    }
  }

  const toggleStatus = async (user: ProUser) => {
    const newStatus: UserStatus = user.status === 'active' ? 'inactive' : 'active'
    try {
      await fetch(`/api/settings/users/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, status: newStatus })
      })
      fetchUsers()
    } catch (err) {
      console.error('[TOGGLE_STATUS_ERROR]', err)
    }
  }

  const archiveUser = async (user: ProUser) => {
    if (user.status === 'active') {
      toast({
        title: 'Cannot archive active user',
        description: 'Disable the user before archiving.',
        variant: 'destructive',
      })
      return
    }

    try {
      await fetch(`/api/settings/users/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, is_archived: true })
      })
      fetchUsers()
    } catch (err) {
      console.error('[ARCHIVE_USER_ERROR]', err)
    }
  }

  const unarchiveUser = async (user: ProUser) => {
    try {
      await fetch(`/api/users/unarchive/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
      fetchUsers()
    } catch (err) {
      console.error('[UNARCHIVE_USER_ERROR]', err)
    }
  }

  return (
    <div className="space-y-4">
      <UserBar
        total={users.length}
        search={search}
        setSearch={setSearch}
        onAddUser={() => setShowAddModal(true)}
        selectedUserId={selectedUserId}
        onChangePassword={() => setShowPasswordModal(true)}
        showArchived={isArchivedTab}
        setShowArchived={() => {}}
      />

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 w-10">
                <input type="checkbox" disabled className="opacity-50" />
              </th>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center">Loading users...</td></tr>
            ) : paginatedUsers.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No users found.</td></tr>
            ) : (
              paginatedUsers.map(user => (
                <tr
                  key={user.id}
                  className={cn(
                    "border-t hover:bg-accent cursor-pointer",
                    selectedUserId === user.id && "bg-accent"
                  )}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <td className="p-3 w-10">
                    <input
                      type="checkbox"
                      className="accent-primary h-4 w-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="p-3">
                    {editingUserId === user.id ? (
                      <Input
                        value={editedData.full_name || ''}
                        onChange={e => setEditedData(prev => ({ ...prev, full_name: e.target.value }))}
                      />
                    ) : user.full_name}
                  </td>
                  <td className="p-3">
                    {editingUserId === user.id ? (
                      <Input
                        value={editedData.username || ''}
                        onChange={e => setEditedData(prev => ({ ...prev, username: e.target.value }))}
                      />
                    ) : user.username}
                  </td>
                  <td className="p-3">
                    {editingUserId === user.id ? (
                      <Input
                        value={editedData.role_id || ''}
                        onChange={e => setEditedData(prev => ({ ...prev, role_id: e.target.value }))}
                      />
                    ) : user.role_id}
                  </td>
                  <td className="p-3">
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-3 space-x-2">
                    {editingUserId === user.id ? (
                      <Button size="sm" onClick={handleSave}>Save</Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => toggleStatus(user)}>
                        {user.status === 'active' ? 'Disable' : 'Enable'}
                      </Button>
                    )}
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(user)}>Edit</Button>
                    {isArchivedTab ? (
                      <Button size="sm" variant="outline" onClick={() => unarchiveUser(user)}>Unarchive</Button>
                    ) : (
                      <Button size="sm" variant="destructive" onClick={() => archiveUser(user)}>Archive</Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 pt-4">
          <Button size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      )}

      {showPasswordModal && selectedUserId && (
        <UpdatePasswordModal
          userId={selectedUserId}
          onClose={() => setShowPasswordModal(false)}
        />
      )}

      {showAddModal && (
        <AddUserModal
          onClose={() => {
            setShowAddModal(false)
            fetchUsers()
          }}
        />
      )}
    </div>
  )
}
