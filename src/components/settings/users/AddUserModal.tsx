// /components/settings/users/AddUserModal.tsx
'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

interface AddUserModalProps {
  onClose: () => void
}

const ROLE_USER_ID = '9bffa346-ad38-4da9-ad06-ff4d4ef0439d'
const ROLE_ADMIN_ID = 'e1a0890c-b8b6-4b25-9fa1-699da338b0f3'

const formSchema = z.object({
  full_name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(6),
  role_id: z.string().uuid()
})

type FormData = z.infer<typeof formSchema>

export function AddUserModal({ onClose }: AddUserModalProps) {
  const [loading, setLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      username: '',
      password: '',
      role_id: ''
    }
  })

  const checkUsernameAvailable = async (username: string) => {
    const res = await fetch(`/app/api/users/check-username?username=${username}`)
    const data = await res.json()
    return data.available
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      // check username availability first
      const available = await checkUsernameAvailable(data.username)
      if (!available) {
        toast({
          title: 'Username Unavailable',
          description: 'This username is already taken. Please choose another.',
          variant: 'destructive'
        })
        setLoading(false)
        return
      }

      const res = await fetch('/api/settings/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      console.log('[ADD_USER_RESPONSE]', result)

      if (!res.ok) throw new Error(result.error || 'Failed to create user')

      reset()
      onClose()
    } catch (error) {
      console.error('[ADD_USER_ERROR]', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      toast({
        title: 'Error adding user',
        description: errorMessage,
        variant: 'destructive'
      })
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
            {errors.full_name && (
              <p className="text-sm text-red-500">Full name is required</p>
            )}
          </div>

          <div>
            <Label>Username</Label>
            <Input {...register('username')} />
            {errors.username && (
              <p className="text-sm text-red-500">Username is required</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" {...register('password')} />
            {errors.password && (
              <p className="text-sm text-red-500">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <div>
            <Label>Role</Label>
            <Select
              value={watch('role_id')}
              onValueChange={(val) => setValue('role_id', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ROLE_USER_ID}>User</SelectItem>
                <SelectItem value={ROLE_ADMIN_ID}>Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role_id && (
              <p className="text-sm text-red-500">Role is required</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
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
