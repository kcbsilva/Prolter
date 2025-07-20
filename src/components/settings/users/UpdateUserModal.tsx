// /components/settings/users/UpdateUserModal.tsx
'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProUser, UserStatus } from '@/types/prousers'

const updateSchema = z.object({
  full_name: z.string().min(1),
  username: z.string().min(1),
  role_id: z.string().min(1),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof updateSchema>

interface UpdateUserModalProps {
  user: ProUser
  onClose: () => void
}

export function UpdateUserModal({ user, onClose }: UpdateUserModalProps) {
  const [loading, setLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      full_name: user.full_name,
      username: user.username,
      role_id: user.role_id,
      status: user.status,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      const res = await fetch(`/app/api/users/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to update user')

      reset()
      onClose()
    } catch (err) {
      console.error('[UPDATE_USER_ERROR]', err)
      alert('Error updating user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input {...register('full_name')} />
          </div>

          <div>
            <Label>Username</Label>
            <Input {...register('username')} />
          </div>

          <div>
            <Label>Role ID</Label>
            <Input {...register('role_id')} />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(val) => setValue('status', val as UserStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
