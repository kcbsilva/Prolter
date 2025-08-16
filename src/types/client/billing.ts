// src/types/billing.ts
export interface Billing {
    id: string;
    status: 'paid' | 'unpaid' | 'overdue';
    amount: number;
    dueDate: string;
    issuedDate: string;
    services: string[];
    paymentMethod: string;
  }
  