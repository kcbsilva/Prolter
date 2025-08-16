// /components/settings/users/UsersCards.tsx
'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card'
import { motion } from 'framer-motion'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function UsersCards() {
  const { data, error, isLoading } = useSWR('/api/settings/users/stats', fetcher)

  if (isLoading) return null
  if (error) {
    console.error('[USER_STATS_ERROR]', error)
    return null
  }

  const cards = [
    { title: 'Total Users', value: data.total, icon: '👥' },
    { title: 'Active Users', value: data.active, icon: '✅' },
    { title: 'Inactive Users', value: data.inactive, icon: '❌' },
    { title: 'Admins', value: data.admins, icon: '🛡️' },
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
