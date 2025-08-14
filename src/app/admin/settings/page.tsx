// src/app/settings/page.tsx
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  Settings,
  Globe,
  Plug,
  Key,
  Network,
  Server,
  Shield,
  Monitor,
  User,
  Database,
  Terminal,
  Table,
  Wifi,
  Phone,
  Tv,
  Smartphone,
  Wallet,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// -----------------------------
// Helpers
// -----------------------------
const ICON_SIZE_SM = "w-3 h-3";
const ICON_SIZE_MD = "w-4 h-4";

function LoadingPlaceholder({ label }: { label: string }) {
  return (
    <div className="p-4 text-sm text-muted-foreground">
      Loading {label}...
    </div>
  );
}

// -----------------------------
// Dynamic imports (original style)
// -----------------------------
const GlobalSettings = dynamic(
  () =>
    import("@/components/pages/settings/global/GlobalSettings").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="Global Settings" /> }
);
const LicenseSettings = dynamic(
  () =>
    import("@/components/pages/settings/license/LicenseSettings").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="License" /> }
);

const NetworkCGNAT = dynamic(
  () =>
    import("@/components/pages/settings/network/cgnat/NetworkCGNAT").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="CGNAT Settings" /> }
);
const NetworkIPs = dynamic(
  () =>
    import("@/components/pages/settings/network/ip/NetworkIPs").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="IP Settings" /> }
);
const NetworkRADIUS = dynamic(
  () =>
    import("@/components/pages/settings/network/radius/NetworkRadius").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="RADIUS Settings" /> }
);
const NetworkVLAN = dynamic(
  () =>
    import("@/components/pages/settings/network/vlan/NetworkVLAN").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="VLAN Settings" /> }
);
const NetworkVPN = dynamic(
  () =>
    import("@/components/pages/settings/network/vpn/NetworkVPN").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="VPN Settings" /> }
);

const PlansCombos = dynamic(
  () =>
    import("@/components/pages/settings/plans/combos/PlansCombos").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="Combo Plans" /> }
);
const PlansInternet = dynamic(
  () =>
    import("@/components/pages/settings/plans/internet/PlansInternet").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="Internet Plans" /> }
);
const PlansLandline = dynamic(
  () =>
    import("@/components/pages/settings/plans/landline/PlansLandline").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="Landline Plans" /> }
);
const PlansMobile = dynamic(
  () =>
    import("@/components/pages/settings/plans/mobile/PlansMobile").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="Mobile Plans" /> }
);
const PlansTV = dynamic(
  () =>
    import("@/components/pages/settings/plans/tv/PlansTV").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="TV Plans" /> }
);

const PostgresDatabases = dynamic(
  () =>
    import(
      "@/components/pages/settings/postgres/databases/PostgresDatabases"
    ).then((m) => m.default),
  { loading: () => <LoadingPlaceholder label="Databases" /> }
);
const PostgresTables = dynamic(
  () =>
    import("@/components/pages/settings/postgres/tables/PostgresTables").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="Tables" /> }
);
const PostgresCLI = dynamic(
  () =>
    import(
      "@/components/pages/settings/postgres/sql-cli/PostgresCLI"
    ).then((m) => m.default),
  { loading: () => <LoadingPlaceholder label="SQL CLI" /> }
);

const POPPage = dynamic(
  () =>
    import("@/components/pages/settings/pops/PoPPage").then((m) => m.default),
  { loading: () => <LoadingPlaceholder label="POPs" /> }
);
const SettingsSecurity = dynamic(
  () =>
    import("@/components/pages/settings/security/SettingsSecurity").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="Security Settings" /> }
);
const SystemMonitor = dynamic(
  () =>
    import(
      "@/components/pages/settings/system-monitor/SystemMonitor"
    ).then((m) => m.default),
  { loading: () => <LoadingPlaceholder label="System Monitor" /> }
);
const SystemUsers = dynamic(
  () =>
    import("@/components/pages/settings/users/SystemUsers").then(
      (m) => m.default
    ),
  { loading: () => <LoadingPlaceholder label="User Management" /> }
);

// Financials
const FinancialWallet = dynamic(
  () =>
    import(
      "@/components/pages/settings/financials/wallets/FinancialWallet"
    ).then((m) => m.default),
  { loading: () => <LoadingPlaceholder label="Wallets" /> }
);
const FinancialGateways = dynamic(
  () =>
    import(
      "@/components/pages/settings/financials/gateways/FinancialGateways"
    ).then((m) => m.default),
  { loading: () => <LoadingPlaceholder label="Gateways" /> }
);
const FinancialGeneral = dynamic(
  () =>
    import(
      "@/components/pages/settings/financials/general/FinancialGeneral"
    ).then((m) => m.default),
  { loading: () => <LoadingPlaceholder label="General Configurations" /> }
);

// -----------------------------
// Tab groups
// -----------------------------
const tabGroups = [
  {
    label: "General",
    icon: Settings,
    items: [
      { value: "global", label: "Global", icon: Globe },
      { value: "license", label: "License", icon: Key },
    ],
  },
  {
    label: "Network",
    icon: Network,
    items: [
      { value: "cgnat", label: "CGNAT", icon: Network },
      { value: "ip", label: "IPv4/IPv6", icon: Plug },
      { value: "radius", label: "RADIUS", icon: Server },
      { value: "vlan", label: "VLAN", icon: Network },
      { value: "vpn", label: "VPN", icon: Shield },
    ],
  },
  {
    label: "Plans",
    icon: Wifi,
    items: [
      { value: "combos", label: "Combos", icon: Wifi },
      { value: "internet", label: "Internet", icon: Wifi },
      { value: "landline", label: "Landline", icon: Phone },
      { value: "mobile", label: "Mobile", icon: Smartphone },
      { value: "tv", label: "TV", icon: Tv },
    ],
  },
  {
    label: "Database",
    icon: Database,
    items: [
      { value: "databases", label: "Databases", icon: Database },
      { value: "sql-cli", label: "SQL CLI", icon: Terminal },
      { value: "tables", label: "Tables", icon: Table },
    ],
  },
  {
    label: "Financials",
    icon: Wallet,
    items: [
      { value: "wallet", label: "Wallet", icon: Wallet },
      { value: "gateways", label: "Gateways", icon: CreditCard },
      {
        value: "financial-general",
        label: "General Configurations",
        icon: Settings,
      },
    ],
  },
  {
    label: "System",
    icon: Server,
    items: [
      { value: "security", label: "Security", icon: Shield },
      { value: "pops", label: "POPs", icon: Server },
      { value: "monitor", label: "System Monitor", icon: Monitor },
    ],
  },
  {
    label: "Users",
    icon: User,
    items: [{ value: "users", label: "User Management", icon: User }],
  },
] as const;

// -----------------------------
// Tab value -> Component map
// -----------------------------
const tabComponents = {
  global: GlobalSettings,
  license: LicenseSettings,
  cgnat: NetworkCGNAT,
  ip: NetworkIPs,
  radius: NetworkRADIUS,
  vlan: NetworkVLAN,
  vpn: NetworkVPN,
  combos: PlansCombos,
  internet: PlansInternet,
  landline: PlansLandline,
  mobile: PlansMobile,
  tv: PlansTV,
  databases: PostgresDatabases,
  tables: PostgresTables,
  "sql-cli": PostgresCLI,
  wallet: FinancialWallet,
  gateways: FinancialGateways,
  "financial-general": FinancialGeneral,
  pops: POPPage,
  security: SettingsSecurity,
  monitor: SystemMonitor,
  users: SystemUsers,
} as const;

// -----------------------------
// Default settings content
// -----------------------------
function DefaultSettings({ selectedTab }: { selectedTab: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold capitalize">
        {selectedTab.replace("-", " ")} Settings
      </h1>
      <div className="rounded-lg border p-8 text-center bg-muted/20">
        <p className="text-muted-foreground">
          {selectedTab.replace("-", " ")} settings will be configured here
        </p>
      </div>
    </div>
  );
}

// -----------------------------
// Main Page
// -----------------------------
export default function SettingsPage() {
  const [selectedTab, setSelectedTab] =
    React.useState<keyof typeof tabComponents>("global");
  const Component = tabComponents[selectedTab];

  return (
    <div className="h-screen w-screen overflow-hidden bg-muted">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] h-full overflow-y-auto p-4 border-r bg-muted/40 space-y-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold flex items-center">
              <Settings className={`${ICON_SIZE_MD} mr-2`} />
              Settings
            </h2>
          </div>

          {tabGroups.map((group) => {
            const isGroupActive = group.items.some(
              (item) => item.value === selectedTab
            );
            return (
              <fieldset
                key={group.label}
                className={cn(
                  "rounded-md p-3 space-y-2 shadow-sm border border-muted-foreground/10",
                  isGroupActive && "bg-primary/5"
                )}
              >
                <legend className="px-2 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center">
                    {group.icon && (
                      <group.icon className={`${ICON_SIZE_SM} mr-2`} />
                    )}
                    {group.label}
                  </div>
                </legend>
                <div className="space-y-1 pt-1">
                  {group.items.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = selectedTab === tab.value;
                    return (
                      <Button
                        key={tab.value}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start font-normal text-xs rounded-lg pl-5",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-primary"
                        )}
                        onClick={() => setSelectedTab(tab.value)}
                      >
                        <Icon className={`${ICON_SIZE_SM} mr-2`} />
                        {tab.label}
                      </Button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-6 bg-background">
          {Component ? (
            <Component />
          ) : (
            <DefaultSettings selectedTab={selectedTab} />
          )}
        </main>
      </div>
    </div>
  );
}
