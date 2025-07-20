// /components/settings/users/RemoveUserDialog.tsx
'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProUser } from '@/types/prousers'

interface RemoveUserDialogProps {
  user: ProUser
  onClose: () => void
}

export function RemoveUserDialog({ user, onClose }: RemoveUserDialogProps) {
  const [loading, setLoading] = React.useState(false)

  const handleArchive = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, is_archived: true })
      })

      if (!res.ok) throw new Error('Failed to archive user')

      onClose()
    } catch (error) {
      console.error('[ARCHIVE_USER_ERROR]', error)
      alert('Error archiving user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Archive User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <p>
            Are you sure you want to archive <strong>{user.full_name}</strong>?
            They will be disabled and hidden from the user list.
          </p>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleArchive} disabled={loading}>
              {loading ? 'Archiving...' : 'Archive'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
