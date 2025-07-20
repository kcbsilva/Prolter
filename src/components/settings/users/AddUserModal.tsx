// /components/settings/users/AddUserModal.tsx
'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddUserModalProps {
  onClose: () => void
}

const formSchema = z.object({
  full_name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(6)
})

type FormData = z.infer<typeof formSchema>

export function AddUserModal({ onClose }: AddUserModalProps) {
  const [loading, setLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      username: '',
      password: ''
    }
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) throw new Error('Failed to create user')

      reset()
      onClose()
    } catch (error) {
      console.error('[ADD_USER_ERROR]', error)
      alert('Error adding user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input {...register('full_name')} />
            {errors.full_name && <p className="text-sm text-red-500">Full name is required</p>}
          </div>

          <div>
            <Label>Username</Label>
            <Input {...register('username')} />
            {errors.username && <p className="text-sm text-red-500">Username is required</p>}
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">Password must be at least 6 characters</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
