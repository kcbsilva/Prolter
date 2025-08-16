// src/types/contracts.ts
export interface Contract {
    id: string;
    status: string;
    services: string[];
    paymentDueDate?: string;
    address: string;
    bound: boolean;
    startDate: string;
    endDate?: string;
    signedForm: 'office' | 'telephone' | 'im' | 'unknown'; 
  }
  