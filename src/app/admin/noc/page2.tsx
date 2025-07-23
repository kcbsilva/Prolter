// src/app/noc/page.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NocOverview } from "@/components/noc/overview";
import { FTTxDashboard } from "@/components/noc/fttx/FttxDashboard";
import { OLTsONXs } from "@/components/noc/fttx/FttxOltsOnxs";
import { OnxTemplates } from "@/components/noc/fttx/FttxOnxTemplates";
import { WirelessDashboard } from "@/components/noc/wireless/WirelessDashboard";
import { AccessPoints } from "@/components/noc/wireless/WirelessAccessPoint";
import { CPEsPage } from "@/components/noc/wireless/WirelessCPEs";

export default function NOCPage() {
  return (
    <Tabs
      defaultValue="fttx-dashboard"
      className="flex min-h-[calc(100vh-4rem)] p-4 gap-4 bg-muted rounded-xl"
    >
      {/* Sidebar navigation */}
      <TabsList className="flex flex-col space-y-1 bg-card rounded-xl p-4 shadow w-64">
        <div className="text-xs uppercase text-muted-foreground px-2 pt-4 pb-1">
          Overview
        </div>
        <TabsTrigger value="noc-overview" className="justify-start">
          Overview
        </TabsTrigger>

        <div className="text-xs uppercase text-muted-foreground px-2 pb-1">
          FTTx
        </div>
        <TabsTrigger value="fttx-dashboard" className="justify-start">
          📊 FTTx Dashboard
        </TabsTrigger>
        <TabsTrigger value="olts-onxs" className="justify-start">
          🛰️ OLTs / ONXs
        </TabsTrigger>

        <div className="text-xs uppercase text-muted-foreground px-2 pt-4 pb-1">
          Wireless
        </div>
        <TabsTrigger value="wireless-dashboard" className="justify-start">
          📡 Wireless Dashboard
        </TabsTrigger>
        <TabsTrigger value="access-points" className="justify-start">
          📶 Access Points
        </TabsTrigger>
        <TabsTrigger value="cpes" className="justify-start">
          👤 Client Devices (CPEs)
        </TabsTrigger>
      </TabsList>

      {/* Main content area */}
      <div className="flex-1 bg-card rounded-xl p-6 shadow">
        <TabsContent value="noc-overview">
          <NocOverview />
        </TabsContent>
        <TabsContent value="fttx-dashboard">
          <FTTxDashboard />
        </TabsContent>
        <TabsContent value="olts-onxs">
          <OLTsONXs />
        </TabsContent>
        <TabsContent value="oltx-templates">
          <OnxTemplates />
        </TabsContent>
        <TabsContent value="wireless-dashboard">
          <WirelessDashboard />
        </TabsContent>
        <TabsContent value="access-points">
          <AccessPoints />
        </TabsContent>
        <TabsContent value="cpes">
          <CPEsPage />
        </TabsContent>
      </div>
    </Tabs>
  );
}
