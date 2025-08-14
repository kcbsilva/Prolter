// src/components/pages/settings/financials/wallets/FinancialWallet.tsx
"use client";

import * as React from "react";

export default function FinancialWallet() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Wallet</h1>
      <div className="rounded-lg border p-6 bg-muted/20">
        <p className="text-muted-foreground">
          Manage your account wallet, balances, and transactions here.
        </p>
      </div>
    </div>
  );
}
