"use client";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import type { IPBlockStatus } from "@/components/pages/settings/network/ip/_lib/types";

export function StatusBadge({ status }: { status: IPBlockStatus }) {
  const map: Record<
    IPBlockStatus,
    { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" }
  > = {
    active: { label: "Active", icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />, variant: "default" },
    reserved: { label: "Reserved", icon: <Info className="h-3.5 w-3.5 mr-1" />, variant: "secondary" },
    deprecated: { label: "Deprecated", icon: <XCircle className="h-3.5 w-3.5 mr-1" />, variant: "destructive" },
  };
  const meta = map[status];
  return (
    <Badge variant={meta.variant} className="capitalize">
      {meta.icon}
      {meta.label}
    </Badge>
  );
}
