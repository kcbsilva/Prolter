'use client'

import dynamic from 'next/dynamic'
import {
  MessageSquare,
  Users,
  Hash,
  GitPullRequest,
  Settings
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { SidebarTabsLayout } from '@/components/layout/SidebarTabsLayout'

const MessengerChat = dynamic(() => import('@/components/pages/messenger/chat/MessengerChat').then(m => m.default))
const MessengerDepartments = dynamic(() => import('@/components/pages/messenger/departments/MessengerDepartments').then(m => m.default))
const MessengerChannels = dynamic(() => import('@/components/pages/messenger/channels/MessengerChannels').then(m => m.default))
const MessengerFlow = dynamic(() => import('@/components/pages/messenger/flow/MessengerFlow').then(m => m.default))
const MessengerConfigure = dynamic(() => import('@/components/pages/messenger/configure/MessengerConfigure').then(m => m.default))

export default function MessengerPage() {
  const tabs = [
    { value: 'chat', label: 'Chat', icon: MessageSquare },
    { value: 'departments', label: 'Departments', icon: Users },
    { value: 'channels', label: 'Channels', icon: Hash },
    { value: 'flow', label: 'Flow', icon: GitPullRequest },
    { value: 'configure', label: 'Configure', icon: Settings }
  ] as { value: string; label: string; icon: LucideIcon }[]
  
  const componentMap = {
    chat: <MessengerChat />,
    departments: <MessengerDepartments />,
    channels: <MessengerChannels />,
    flow: <MessengerFlow />,
    configure: <MessengerConfigure />
  }

  return (
    <SidebarTabsLayout
      title="Messenger"
      titleIcon={MessageSquare}
      tabs={tabs}
      defaultTab="chat"
      componentMap={componentMap}
    />
  )
}
