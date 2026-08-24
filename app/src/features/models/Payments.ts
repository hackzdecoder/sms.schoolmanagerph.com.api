export interface PaymentHistory {
  id: number;
  date: string;
  amount: number;
  method: string;
  reference: string;
  status: string;
  semester_id?: number;
}

export const mockPaymentHistory: PaymentHistory[] = [
  {
    id: 1,
    date: '2024-08-20',
    amount: 30000,
    method: 'Cash',
    reference: 'PAY-2024-001',
    status: 'completed',
    semester_id: 1,
  },
  {
    id: 2,
    date: '2024-08-25',
    amount: 5000,
    method: 'GCash',
    reference: 'PAY-2024-002',
    status: 'completed',
    semester_id: 1,
  },
  {
    id: 3,
    date: '2025-01-20',
    amount: 15000,
    method: 'Cash',
    reference: 'PAY-2025-001',
    status: 'completed',
    semester_id: 3,
  },
  {
    id: 4,
    date: '2025-01-25',
    amount: 25000,
    method: 'Bank Transfer',
    reference: 'PAY-2024-003',
    status: 'completed',
    semester_id: 2,
  },
];
