// src/config/sidebarNav.ts
import {
  LayoutDashboard, ShieldCheck, Settings, Users, MapPin, TowerControl, Cable, Power, Box, Puzzle, Warehouse, Globe, GitFork,
  Split,
  Code,
  Router as RouterIcon,
  Share2,
  Server as ServerIcon,
  DollarSign,
  BarChart3,
  Plug,
  MessageSquare,
  Text,
  Settings2,
  ListChecks,
  Wifi,
  Tv,
  Smartphone,
  PhoneCall,
  Combine,
  ListFilter,
  Archive,
  Factory,
  LayoutGrid,
  Package as PackageIcon,
  Truck,
  FileText as FileTextIcon,
  GitBranch,
  Network as NetworkIcon,
  Database,
  Users2,
  Bus,
  BriefcaseBusiness,
  FileCode,
  Wrench,
  BookOpen,
  SlidersHorizontal,
  Briefcase,
  Building,
  Cog,
  Dot,
  TrendingUp,
  Target,
  ShoppingCart,
  MessageCircle,
  Workflow,
  Radio, 
  GitMerge, 
  Webhook,
  KeyRound, 
  Table2, // Added for Tables
  Terminal, // Added for SQL CLI
} from 'lucide-react';
import { TbRouteScan } from "react-icons/tb";
import type { LucideIcon } from 'lucide-react';
import type { IconType } from 'react-icons';
import { GrSystem } from "react-icons/gr";
import { MdOutlineVpnKey } from "react-icons/md";

export interface SidebarNavItem {
  title: string;
  href?: string;
  icon?: LucideIcon | IconType;
  tooltip?: string;
  isSeparator?: boolean;
  children?: SidebarNavItem[];
}

export const sidebarNav: SidebarNavItem[] = [
  {
    title: 'sidebar.dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    tooltip: 'sidebar.dashboard',
  },
  {
    title: 'sidebar.subscribers',
    href: '/admin/subscribers/',
    icon: Users,
    tooltip: 'sidebar.subscribers',
  },
  {
    title: 'sidebar.infrastructure',
    icon: TbRouteScan,
    tooltip: 'sidebar.infrastructure',
    children: [
      {
        title: 'sidebar.infrastructure_projects',
        href: '/admin/infrastructure/projects',
        icon: FileCode,
        tooltip: 'sidebar.infrastructure_projects',
      },
      {
        title: 'sidebar.infrastructure_map',
        href: '/admin/infrastructure/map',
        icon: Globe,
        tooltip: 'sidebar.infrastructure__map',
      },
      {
        title: 'sidebar.infrastructure_elements',
        icon: GitFork,
        tooltip: 'sidebar.infrastructure_elements',
        children: [
          {
            title: 'sidebar.infrastructure_elements_polls',
            href: '/admin/infrastructure/elements/polls',
            icon: Power,
            tooltip: 'sidebar.infrastructure_elements_polls',
          },
          {
            title: 'sidebar.infrastructure_elements_fdhs',
            href: '/admin/infrastructure/elements/fdhs',
            icon: Box,
            tooltip: 'sidebar.infrastructure_elements_fdhs',
          },
          {
            title: 'sidebar.infrastructure_elements_foscs',
            href: '/admin/infrastructure/elements/foscs',
            icon: Warehouse,
            tooltip: 'sidebar.infrastructure_elements_foscs',
          },
          {
            title: 'sidebar.infrastructure_elements_peds',
            href: '/admin/infrastructure/elements/peds',
            icon: Box,
            tooltip: 'sidebar.infrastructure_elements_peds',
          },
          {
            title: 'sidebar.infrastructure_elements_sites',
            href: '/admin/infrastructure/elements/sites',
            icon: Building,
            tooltip: 'sidebar.infrastructure_elements_sites',
          },
          {
            title: 'sidebar.infrastructure_elements_vaults',
            href: '/admin/infrastructure/elements/vaults',
            icon: Archive,
            tooltip: 'sidebar.infrastructure_elements_vaults',
          },
          {
            title: 'sidebar.infrastructure_elements_ducts',
            href: '/admin/infrastructure/elements/ducts',
            icon: GitBranch,
            tooltip: 'sidebar.infrastructure_elements_ducts',
          },
          {
            title: 'sidebar.infrastructure_elements_accessories',
            href: '/admin/infrastructure/elements/accessories',
            icon: Puzzle,
            tooltip: 'sidebar.infrastructure_elements_accessories',
          },
          {
            title: 'sidebar.infrastructure_elements_splitters',
            href: '/admin/infrastructure/elements/splitters',
            icon: Split,
            tooltip: 'sidebar.infrastructure_elements_splitters',
          },
          {
            title: 'sidebar.infrastructure_elements_towers',
            href: '/admin/infrastructure/elements/towers',
            icon: TowerControl,
            tooltip: 'sidebar.infrastructure_elements_towers',
          },
          {
            title: 'sidebar.infrastructure_elements_cables',
            href: '/admin/infrastructure/elements/cables',
            icon: Cable,
            tooltip: 'sidebar.infrastructure_elements_cables',
          },
        ],
      },
    ],
  },
  {
    title: 'sidebar.finances',
    icon: DollarSign,
    tooltip: 'sidebar.finances',
    children: [
      {
        title: 'sidebar.finances_dashboard',
        href: '/admin/finances/dashboard',
        icon: LayoutDashboard,
        tooltip: 'sidebar.finances_dashboard',
      },
      {
        title: 'sidebar.finances_cash_book',
        href: '/admin/finances/cash-book',
        icon: BookOpen,
        tooltip: 'sidebar.finances_cash_book',
      },
      {
        title: 'sidebar.finances_entry_categories',
        href: '/admin/finances/entry-categories',
        icon: ListFilter,
        tooltip: 'sidebar.finances_entry_categories',
      },
      {
        title: 'sidebar.finances_config',
        href: '/admin/settings/finances/configurations',
        icon: SlidersHorizontal,
        tooltip: 'sidebar.finances_config',
      },
    ],
  },
  {
    title: 'sidebar.noc',
    icon: NetworkIcon,
    tooltip: 'sidebar.noc',
    children: [
      {
        title: 'sidebar.noc_overview',
        href: '/admin/noc/dashboard',
        icon: LayoutDashboard,
        tooltip: 'sidebar.noc_overview',
      },
      {
        title: 'sidebar.fttx',
        icon: GitBranch,
        tooltip: 'sidebar.fttx',
        children: [
          {
            title: 'sidebar.fttx_dashboard',
            href: '/admin/noc/fttx/dashboard',
            icon: LayoutDashboard,
            tooltip: 'sidebar.fttx_dashboard',
          },
          {
            title: 'sidebar.fttx_olts',
            href: '/admin/noc/fttx/olts',
            icon: NetworkIcon,
            tooltip: 'sidebar.fttx_olts',
          },
          {
            title: 'sidebar.fttx_onx_templates',
            href: '/admin/noc/fttx/onx-templates',
            icon: FileTextIcon,
            tooltip: 'sidebar.fttx_onx_templates',
          },
        ],
      },
      {
        title: 'sidebar.noc_wireless',
        icon: Wifi,
        tooltip: 'sidebar.noc_wireless',
        children: [
          {
            title: 'sidebar.noc_wireless_dashboard',
            href: '/admin/noc/wireless/dashboard',
            icon: LayoutDashboard,
            tooltip: 'sidebar.noc_wireless_dashboard',
          },
          {
            title: 'sidebar.noc_wireless_aps',
            href: '/admin/noc/wireless/access-points',
            icon: RouterIcon,
            tooltip: 'sidebar.noc_wireless_aps',
          },
          {
            title: 'sidebar.noc_wireless_clients',
            href: '/admin/noc/wireless/clients',
            icon: Users2,
            tooltip: 'sidebar.noc_wireless_clients',
          },
        ],
      },
    ],
  },
  {
    title: 'sidebar.hub',
    icon: Webhook,
    tooltip: 'sidebar.hub',
    children: [
      {
        title: 'sidebar.hub_dashboard',
        href: '/admin/hub/dashboard',
        icon: LayoutDashboard,
        tooltip: 'sidebar.hub_dashboard_tooltip',
      },
      {
        title: 'sidebar.hub_connections',
        href: '/admin/hub/connections',
        icon: GitMerge,
        tooltip: 'sidebar.hub_connections_tooltip',
      },
      {
        title: 'sidebar.hub_participants',
        href: '/admin/hub/participants',
        icon: Users2,
        tooltip: 'sidebar.hub_participants_tooltip',
      },
      {
        title: 'sidebar.hub_configurations',
        href: '/admin/hub/configurations',
        icon: Settings2,
        tooltip: 'sidebar.hub_configurations_tooltip',
      },
    ],
  },
  {
    title: 'sidebar.inventory',
    icon: Archive,
    tooltip: 'sidebar.inventory',
    children: [
      {
        title: 'sidebar.inventory_dashboard',
        href: '/admin/inventory/dashboard',
        icon: LayoutGrid,
        tooltip: 'sidebar.inventory_dashboard',
      },
      {
        title: 'sidebar.inventory_categories',
        href: '/admin/inventory/categories',
        icon: ListFilter,
        tooltip: 'sidebar.inventory_categories',
      },
      {
        title: 'sidebar.inventory_manufacturers',
        href: '/admin/inventory/manufacturers',
        icon: Factory,
        tooltip: 'sidebar.inventory_manufacturers',
      },
      {
        title: 'sidebar.inventory_suppliers',
        href: '/admin/inventory/suppliers',
        icon: Truck,
        tooltip: 'sidebar.inventory_suppliers',
      },
      {
        title: 'sidebar.inventory_products',
        href: '/admin/inventory/products',
        icon: PackageIcon,
        tooltip: 'sidebar.inventory_products',
      },
       {
        title: 'sidebar.inventory_warehouses',
        href: '/admin/inventory/warehouses',
        icon: Warehouse,
        tooltip: 'sidebar.inventory_warehouses',
      },
      {
        title: 'sidebar.inventory_vehicles',
        href: '/admin/inventory/vehicles',
        icon: Bus,
        tooltip: 'sidebar.inventory_vehicles',
      },
    ],
  },
   {
    title: 'sidebar.service_calls',
    icon: Wrench,
    tooltip: 'sidebar.service_calls',
    children: [
      {
        title: 'sidebar.service_calls_dashboard',
        href: '/admin/service-calls/dashboard',
        icon: LayoutDashboard,
        tooltip: 'sidebar.service_calls_dashboard',
      },
      {
        title: 'sidebar.service_calls_service_types',
        href: '/admin/service-calls/service-types',
        icon: ListChecks,
        tooltip: 'sidebar.service_calls_service_types',
      },
    ],
  },
  {
    title: 'sidebar.sales',
    icon: TrendingUp,
    tooltip: 'sidebar.sales',
    children: [
      {
        title: 'sidebar.sales_dashboard',
        href: '/admin/sales/dashboard',
        icon: LayoutDashboard,
        tooltip: 'sidebar.sales_dashboard',
      },
      {
        title: 'sidebar.sales_leads',
        href: '/admin/sales/leads',
        icon: Users,
        tooltip: 'sidebar.sales_leads',
      },
      {
        title: 'sidebar.sales_opportunities',
        href: '/admin/sales/opportunities',
        icon: Target,
        tooltip: 'sidebar.sales_opportunities',
      },
      {
        title: 'sidebar.sales_proposals',
        href: '/admin/sales/proposals',
        icon: FileTextIcon,
        tooltip: 'sidebar.sales_proposals',
      },
      {
        title: 'sidebar.sales_sales_orders',
        href: '/admin/sales/orders',
        icon: ShoppingCart,
        tooltip: 'sidebar.sales_sales_orders',
      },
    ],
  },
  {
    title: 'sidebar.messenger',
    icon: MessageSquare,
    tooltip: 'sidebar.messenger',
    children: [
      {
        title: 'sidebar.messenger_chat',
        href: '/admin/messenger/chat',
        icon: MessageCircle,
        tooltip: 'sidebar.messenger_chat',
      },
      {
        title: 'sidebar.messenger_departments',
        href: '/admin/messenger/departments',
        icon: Users,
        tooltip: 'sidebar.messenger_departments',
      },
      {
        title: 'sidebar.messenger_channels',
        href: '/admin/messenger/channels',
        icon: Radio,
        tooltip: 'sidebar.messenger_channels',
      },
      {
        title: 'sidebar.messenger_flow',
        href: '/admin/messenger/flow',
        icon: Workflow,
        tooltip: 'sidebar.messenger_flow',
      },
      {
        title: 'sidebar.messenger_configure',
        href: '/admin/messenger/configure',
        icon: Settings2,
        tooltip: 'sidebar.messenger_configure',
      },
    ],
  },
  {
    title: 'sidebar.reports',
    href: '/admin/reports',
    icon: BarChart3,
    tooltip: 'sidebar.reports',
  },
  {
    title: 'sidebar.hr',
    icon: BriefcaseBusiness,
    tooltip: 'sidebar.hr',
    children: [
      {
        title: 'sidebar.hr_dashboard',
        href: '/admin/hr/dashboard',
        icon: LayoutDashboard,
        tooltip: 'sidebar.hr_dashboard',
      },
      {
        title: 'sidebar.hr_employees',
        href: '/admin/hr/employees',
        icon: Users,
        tooltip: 'sidebar.hr_employees',
      },
    ],
  },
  {
    title: 'sidebar.settings',
    icon: Settings,
    tooltip: 'sidebar.settings',
    children: [
      {
        title: 'sidebar.settings_global',
        href: '/admin/settings/global',
        icon: Cog,
        tooltip: 'sidebar.settings_global',
      },
      {
        title: 'sidebar.settings_system',
        icon: GrSystem,
        tooltip: 'sidebar.settings_system',
        children: [
          {
            title: 'sidebar.settings_system_pops',
            href: '/admin/settings/system/pops',
            icon: Building,
            tooltip: 'sidebar.settings_system_pops',
          },
        ],
      },
      {
        title: 'sidebar.settings_plans',
        icon: ListChecks,
        tooltip: 'sidebar.settings_plans',
        children: [
          {
            title: 'sidebar.settings_plans_internet',
            href: '/admin/settings/plans/internet',
            icon: Wifi,
            tooltip: 'sidebar.settings_plans_internet',
          },
          {
            title: 'sidebar.settings_plans_tv',
            href: '/admin/settings/plans/tv',
            icon: Tv,
            tooltip: 'sidebar.settings_plans_tv',
          },
          {
            title: 'sidebar.settings_plans_mobile',
            href: '/admin/settings/plans/mobile',
            icon: Smartphone,
            tooltip: 'sidebar.settings_plans_mobile',
          },
          {
            title: 'sidebar.settings_plans_landline',
            href: '/admin/settings/plans/landline',
            icon: PhoneCall,
            tooltip: 'sidebar.settings_plans_landline',
          },
          {
            title: 'sidebar.settings_plans_combos',
            href: '/admin/settings/plans/combos',
            icon: Combine,
            tooltip: 'sidebar.settings_plans_combos',
          },
        ],
      },
      {
        title: 'sidebar.settings_network',
        icon: NetworkIcon,
        tooltip: 'sidebar.settings_network',
        children: [
          {
            title: 'sidebar.settings_network_ip',
            href: '/admin/settings/network/ip',
            icon: Code,
            tooltip: 'sidebar.settings_network_ip',
          },
          {
            title: 'sidebar.settings_network_devices',
            href: '/admin/settings/network/devices',
            icon: RouterIcon,
            tooltip: 'sidebar.settings_network_devices',
          },
          {
            title: 'sidebar.settings_network_cgnat',
            href: '/admin/settings/network/cgnat',
            icon: Share2,
            tooltip: 'sidebar.settings_network_cgnat',
          },
          {
            title: 'sidebar.settings_network_radius',
            href: '/admin/settings/network/radius',
            icon: ServerIcon,
            tooltip: 'sidebar.settings_network_radius',
          },
          {
            title: 'sidebar.settings_network_vlan',
            href: '/admin/settings/network/vlan',
            icon: Split,
            tooltip: 'sidebar.settings_network_vlan',
          },
          {
            title: 'sidebar.settings_network_vpn',
            href: '/admin/settings/network/vpn',
            icon: MdOutlineVpnKey,
            tooltip: 'sidebar.settings_network_vpn',
          },
        ],
      },
      {
        title: 'sidebar.settings_postgres',
        icon: Database,
        tooltip: 'sidebar.settings_postgres',
        children: [
          {
            title: 'sidebar.settings_postgres_databases',
            href: '/admin/settings/postgres/databases',
            icon: Database, // Or List
            tooltip: 'sidebar.settings_postgres_databases',
          },
          {
            title: 'sidebar.settings_postgres_tables',
            href: '/admin/settings/postgres/tables',
            icon: Table2,
            tooltip: 'sidebar.settings_postgres_tables',
          },
          {
            title: 'sidebar.settings_postgres_sql_cli',
            href: '/admin/settings/postgres/sql-cli',
            icon: Terminal,
            tooltip: 'sidebar.settings_postgres_sql_cli',
          },
        ],
      },
      {
        title: 'sidebar.settings_security',
        href: '/admin/settings/security',
        icon: ShieldCheck,
        tooltip: 'sidebar.settings_security',
      },
      {
        title: 'sidebar.settings_license',
        href: '/admin/settings/license',
        icon: KeyRound,
        tooltip: 'sidebar.settings_license',
      },
      {
        title: 'sidebar.settings_system_monitor',
        href: '/admin/settings/system-monitor',
        icon: RouterIcon,
        tooltip: 'sidebar.settings_system_monitor',
      },
      {
        title: 'sidebar.settings_integrations',
        icon: Plug,
        tooltip: 'sidebar.settings_integrations',
        children: [
          {
            title: 'sidebar.settings_integrations_whatsapp',
            href: '/admin/settings/integrations/whatsapp',
            icon: MessageSquare,
            tooltip: 'sidebar.settings_integrations_whatsapp',
          },
          {
            title: 'sidebar.settings_integrations_telegram',
            href: '/admin/settings/integrations/telegram',
            icon: MessageSquare,
            tooltip: 'sidebar.settings_integrations_telegram',
          },
          {
            title: 'sidebar.settings_integrations_meta',
            href: '/admin/settings/integrations/meta',
            icon: MessageSquare,
            tooltip: 'sidebar.settings_integrations_meta',
          },
          {
            title: 'sidebar.settings_integrations_sms',
            href: '/admin/settings/integrations/sms',
            icon: Text,
            tooltip: 'sidebar.settings_integrations_sms',
          },
        ],
      },
      {
        title: 'sidebar.settings_users',
        href: '/admin/settings/users',
        icon: Users,
        tooltip: 'sidebar.settings_users',
      },
    ],
  },
];
