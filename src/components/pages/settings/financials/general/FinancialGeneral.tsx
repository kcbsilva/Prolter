// src/components/pages/settings/financials/general/FinancialGeneral.tsx
"use client";

import * as React from "react";

export default function FinancialGeneral() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Financial General Configurations</h1>
      <div className="rounded-lg border p-6 bg-muted/20">
        <p className="text-muted-foreground">
          Manage general financial settings, tax rates, and accounting
          preferences here.
        </p>
      </div>
    </div>
  );
}
