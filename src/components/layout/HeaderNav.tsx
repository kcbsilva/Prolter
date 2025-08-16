// src/components/layouts/HeaderNav.tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/shared/ui/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/shared/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { FaWhatsapp, FaTelegram, FaLinkedin, FaFacebook } from 'react-icons/fa'
import { MdAlternateEmail } from 'react-icons/md'
import { AdminNavTree } from './AdminNavTree'
import { sidebarNav } from '@/config/sidebarNav'

export function HeaderNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="w-full">
      {/* Top Info Bar */}
      <div className="h-8 flex items-center justify-between px-4 text-xs bg-[#233B6E] text-white dark:bg-[#081124]">
        <div className="font-semibold text-sm">Prolter</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <MdAlternateEmail className="w-3.5 h-3.5" />
            <span>support@prolter.io</span>
          </div>
          <Link href="https://t.me/prolter" target="_blank" className="hover:text-[#fca311]">
            <FaTelegram className="w-3.5 h-3.5" />
          </Link>
          <Link href="https://wa.me/123456789" target="_blank" className="hover:text-[#fca311]">
            <FaWhatsapp className="w-3.5 h-3.5" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" className="hover:text-[#fca311]">
            <FaLinkedin className="w-3.5 h-3.5" />
          </Link>
          <Link href="https://facebook.com" target="_blank" className="hover:text-[#fca311]">
            <FaFacebook className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-12 flex items-center justify-between px-4 sm:px-6 border-b-2 bg-white text-black dark:bg-[#14213D] dark:text-white border-b-[#233B6E] dark:border-b-[#FCA311]">
        {/* Centered Navigation */}
        <nav className="flex items-center gap-4 text-xs sm:text-sm">
          <AdminNavTree items={sidebarNav} layout="horizontal" />
        </nav>

        {/* Right-aligned actions */}
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer h-7 w-7">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
