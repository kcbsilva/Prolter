// /components/settings/users/UsersCards.tsx
'use client'

import { useEffect, useState } from 'react'
import { ProUser } from '@/types/prousers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export function UsersCards() {
  const [users, setUsers] = useState<ProUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users')
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        console.error('[USER_STATS_ERROR]', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return null

  const total = users.length
  const active = users.filter(u => u.status === 'active').length
  const inactive = users.filter(u => u.status === 'inactive').length
  const admins = users.filter(u => u.role_id === 'admin').length

  const cards = [
    { title: 'Total Users', value: total, icon: '👥' },
    { title: 'Active Users', value: active, icon: '✅' },
    { title: 'Inactive Users', value: inactive, icon: '❌' },
    { title: 'Admins', value: admins, icon: '🛡️' },
  ]

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="text-center">
            <CardHeader className="text-muted-foreground text-sm">{card.title}</CardHeader>
            <CardContent className="text-3xl font-semibold flex items-center justify-center gap-2">
              <span>{card.icon}</span> <span>{card.value}</span>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
