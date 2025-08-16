// src/components/layout/Navigation.ts
import {
  LayoutDashboard,
  Settings,
  Users,
  DollarSign,
  BarChart3,
  MessageSquare,
  Archive,
  Wrench,
  TrendingUp,
  BriefcaseBusiness,
  Network as NetworkIcon,
  Webhook,
} from 'lucide-react';
import { TbRouteScan } from "react-icons/tb";
import type { LucideIcon } from 'lucide-react';
import type { IconType } from 'react-icons';

export interface SidebarNavItem {
  title: string;
  href?: string;
  icon?: LucideIcon | IconType;
  tooltip?: string;
  isSeparator?: boolean;
  children?: SidebarNavItem[];
}

export const NavigationTree: SidebarNavItem[] = [
  {
    title: 'sidebar.dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    tooltip: 'sidebar.dashboard',
  },
  {
    title: 'sidebar.subscribers',
    href: '/admin/subscribers/dashboard',
    icon: Users,
    tooltip: 'sidebar.subscribers',
  },
  {
    title: 'sidebar.infrastructure',
    href: '/admin/infrastructure/',
    icon: TbRouteScan,
    tooltip: 'sidebar.infrastructure',
  },
  {
    title: 'sidebar.finances',
    href: '/admin/finances/',
    icon: DollarSign,
    tooltip: 'sidebar.finances',
  },
  
  {
    title: 'sidebar.noc',
    href: '/admin/noc/',
    icon: NetworkIcon,
    tooltip: 'sidebar.noc',
  },
  {
    title: 'sidebar.hub',
    href: '/admin/hub/',
    icon: Webhook,
    tooltip: 'sidebar.hub',
  },
  {
    title: 'sidebar.inventory',
    href: '/admin/inventory/',
    icon: Archive,
    tooltip: 'sidebar.inventory',
  },
  {
    title: 'sidebar.service_calls',
    href: '/admin/service-calls/',
    icon: Wrench,
    tooltip: 'sidebar.service_calls',
  },
  {
    title: 'sidebar.sales',
    href: '/admin/sales/',
    icon: TrendingUp,
    tooltip: 'sidebar.sales',
  },
  {
    title: 'sidebar.messenger',
    href: '/admin/messenger/',
    icon: MessageSquare,
    tooltip: 'sidebar.messenger',
  },
  {
    title: 'sidebar.reports',
    href: '/admin/reports',
    icon: BarChart3,
    tooltip: 'sidebar.reports',
  },
  {
    title: 'sidebar.hr',
    href: '/admin/hr',
    icon: BriefcaseBusiness,
    tooltip: 'sidebar.hr',
  },
  {
    title: 'sidebar.settings',
    href: '/admin/settings',
    icon: Settings,
    tooltip: 'sidebar.settings',
  },
];