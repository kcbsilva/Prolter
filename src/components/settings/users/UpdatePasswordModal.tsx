// src/components/settings/users/UpdatePasswordModal.tsx
'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shared/ui/dialog'
import { Button } from '@/components/shared/ui/button'
import { Input } from '@/components/shared/ui/input'
import { Label } from '@/components/shared/ui/label'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { ProUser } from '@/types/prousers'

interface UpdatePasswordModalProps {
    userId: string;
    onClose: () => void;
  }

  export function UpdatePasswordModal({ userId, onClose }: UpdatePasswordModalProps) {
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [strengthScore, setStrengthScore] = React.useState(0)
  const { toast } = useToast()

  React.useEffect(() => {
    setStrengthScore(calculatePasswordStrength(password))
  }, [password])

  const calculatePasswordStrength = (pw: string): number => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[a-z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const getStrengthLabel = (score: number): string => {
    if (score < 2) return 'Weak password'
    if (score < 4) return 'Moderate strength'
    return 'Strong password'
  }

  const onSubmit = async () => {
    if (!password || password.length < 8) {
      toast({ variant: 'destructive', title: 'Password too short (min. 8 characters)' })
      return
    }

    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Passwords do not match' })
      return
    }

    if (strengthScore < 3) {
      toast({ variant: 'destructive', title: 'Please choose a stronger password' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/app/api/users/update-password/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const result = await res.json()

      if (!res.ok) {
        toast({ variant: 'destructive', title: result.error || 'Password update failed' })
        return
      }

      toast({ title: 'Password updated successfully' })
      onClose()
    } catch (error) {
      console.error('[UPDATE_PASSWORD_ERROR]', error)
      toast({ variant: 'destructive', title: 'Unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
            {password && (
              <div className="pt-1">
                <div className="h-2 w-full rounded bg-muted">
                  <div
                    className={cn(
                      'h-2 rounded transition-all',
                      strengthScore < 2 ? 'bg-red-500' :
                      strengthScore < 4 ? 'bg-yellow-500' : 'bg-green-500'
                    )}
                    style={{ width: `${(strengthScore / 5) * 100}%` }}
                  />
                </div>
                <p className="text-xs mt-1 text-muted-foreground">
                  {getStrengthLabel(strengthScore)}
                </p>
              </div>
            )}
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
