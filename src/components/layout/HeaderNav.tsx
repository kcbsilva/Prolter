// src/components/layouts/AdminNavTree.tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SidebarNavItem } from '@/config/sidebarNav'
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useLocale } from '@/contexts/LocaleContext'

interface AdminNavTreeProps {
  items: SidebarNavItem[]
  layout?: 'horizontal' | 'vertical' | 'dropdown'
  level?: number
}

export function AdminNavTree({ items, layout = 'horizontal', level = 0 }: AdminNavTreeProps) {
  const pathname = usePathname()
  const { t } = useLocale()

  return (
    <>
      {items.map((item, index) => {
        if (!item.title) return null
        const key = `${item.title}-${index}`
        const label = t(item.title)
        const tooltip = t(item.tooltip || item.title)

        const Icon = item.icon ? (item.icon as React.ElementType) : null
        const iconElement = Icon ? <Icon className="w-4 h-4 shrink-0" /> : null

        // Handle nested items
        if (item.children && item.children.length > 0) {
          if (layout === 'dropdown') {
            return (
              <DropdownMenuSub key={key}>
                <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-1.5 text-sm whitespace-nowrap">
                  {iconElement}
                  <span className="truncate">{label}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="ml-2">
                  <AdminNavTree items={item.children} layout="dropdown" level={level + 1} />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )
          }

          return (
            <div
              key={key}
              className={cn('flex flex-col', layout === 'horizontal' && 'relative group')}
            >
              <span
                title={tooltip}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                {iconElement}
                <span className="truncate">{label}</span>
              </span>
              <div
                className={cn(
                  layout === 'horizontal'
                    ? 'absolute hidden group-hover:flex flex-col top-full left-0 bg-white dark:bg-[#081124] shadow-md z-50'
                    : 'ml-4'
                )}
              >
                <AdminNavTree items={item.children} layout={layout} level={level + 1} />
              </div>
            </div>
          )
        }

        if (!item.href) return null

        const isActive = pathname === item.href

        return layout === 'dropdown' ? (
          <DropdownMenuItem asChild key={key}>
            <Link
              href={item.href}
              title={tooltip}
              className="flex items-center gap-2 text-sm whitespace-nowrap w-full"
            >
              {iconElement}
              <span className="truncate">{label}</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <Link
            key={key}
            href={item.href}
            title={tooltip}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap',
              isActive && 'text-[#fca311] font-semibold'
            )}
          >
            {iconElement}
            <span className="truncate">{label}</span>
          </Link>
        )
      })}
    </>
  )
}
