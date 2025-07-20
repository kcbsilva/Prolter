// src/components/settings/users/UserBar.tsx
'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UserBarProps {
    total: number
    search: string
    setSearch: (value: string) => void
    onAddUser: () => void
    onChangePassword: (userId: string) => void
    selectedUserId: string | null
    showArchived: boolean
    setShowArchived: (value: boolean) => void
  }

  export function UserBar({
    total,
    search,
    setSearch,
    onAddUser,
    onChangePassword,
    selectedUserId,
    showArchived,
    setShowArchived,
  }: UserBarProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div className="text-sm text-muted-foreground">
            {total} user{total !== 1 && 's'}
          </div>
      
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                id="show-archived"
                className="accent-primary h-4 w-4"
              />
              <label htmlFor="show-archived" className="text-sm text-muted-foreground">
                Show Archived
              </label>
            </div>
      
            <div className="flex flex-1 items-center max-w-md gap-2">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="pl-8"
                />
              </div>
              <Button onClick={onAddUser}>Add User</Button>
            </div>
          </div>
        </div>
      )
}
