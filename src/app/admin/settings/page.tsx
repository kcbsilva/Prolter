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
  Router,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dynamic imports for Global Settings

const GlobalSettings = dynamic(
  () =>
    import("@/components/pages/settings/global/GlobalSettings").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Global Settings...</div> }
);
const LicenseSettings = dynamic(
  () =>
    import("@/components/pages/settings/license/LicenseSettings").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading License...</div> }
);

// Dynamic imports for Network Settings

const NetworkCGNAT = dynamic(
  () =>
    import("@/components/pages/settings/network/cgnat/NetworkCGNAT").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Network Settings...</div> }
);
const NetworkIPs = dynamic(
  () =>
    import("@/components/pages/settings/network/ip/NetworkIPs").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Network Settings...</div> }
);
const NetworkRADIUS = dynamic(
  () =>
    import("@/components/pages/settings/network/radius/NetworkRadius").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Network Settings...</div> }
);
const NetworkVLAN = dynamic(
  () =>
    import("@/components/pages/settings/network/vlan/NetworkVLAN").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Network Settings...</div> }
);
const NetworkVPN = dynamic(
  () =>
    import("@/components/pages/settings/network/vpn/NetworkVPN").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Network Settings...</div> }
);

// Dynamic imports for Plans

const PlansCombos = dynamic(
  () =>
    import("@/components/pages/settings/plans/combos/PlansCombos").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Combo Plans...</div> }
);

const PlansInternet = dynamic(
  () =>
    import("@/components/pages/settings/plans/internet/PlansInternet").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Internet Plans...</div> }
);

const PlansLandline = dynamic(
  () =>
    import("@/components/pages/settings/plans/landline/PlansLandline").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Internet Plans...</div> }
);

const PlansMobile = dynamic(
  () =>
    import("@/components/pages/settings/plans/mobile/PlansMobile").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Internet Plans...</div> }
);

const PlansTV = dynamic(
  () =>
    import("@/components/pages/settings/plans/tv/PlansTV").then(
      (mod) => mod.default
    ),
  { loading: () => <div>Loading Internet Plans...</div> }
);
//const UserSettings = dynamic(() => import('@/components/pages/settings/UserSettings').then(mod => mod.default),
// { loading: () => <div>Loading User Settings...</div> })

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
      { value: "postgres", label: "PostgreSQL", icon: Database },
      { value: "databases", label: "Databases", icon: Database },
      { value: "sql-cli", label: "SQL CLI", icon: Terminal },
      { value: "tables", label: "Tables", icon: Table },
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
];

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = React.useState("global");

  const renderContent = () => {
    switch (selectedTab) {
      case "global":
        return <GlobalSettings />;
      case "license":
        return <LicenseSettings />;
      case "cgnat":
        return <NetworkCGNAT />;
      case "ip":
        return <NetworkIPs />;
      case "radius":
        return <NetworkRADIUS />;
      case "vlan":
        return <NetworkVLAN />;
      case "vpn":
        return <NetworkVPN />;
      case "combos":
        return <PlansCombos />;
      case "internet":
        return <PlansInternet />;
      case "landline":
        return <PlansLandline />;
      case "mobile":
        return <PlansMobile />;
      case "tv":
        return <PlansTV />;

      // Add more cases for other tabs as needed
      // Add other cases as needed
      default:
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
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-muted">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] h-full overflow-y-auto p-4 border-r bg-muted/40 space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </h2>
          </div>

          {tabGroups.map((group) => (
            <div
              key={group.label}
              className="rounded-md p-3 space-y-2 bg-muted/10 shadow-sm"
            >
              <div className="flex items-center text-xs text-muted-foreground font-semibold">
                {group.icon && <group.icon className="w-3 h-3 mr-2" />}
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = selectedTab === tab.value;
                  return (
                    <Button
                      key={tab.value}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start font-normal text-sm rounded-lg pl-6",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground"
                      )}
                      onClick={() => setSelectedTab(tab.value)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-6 bg-white">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
