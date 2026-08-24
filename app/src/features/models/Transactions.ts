export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: string;
  reference: string;
  payment_method?: string;
  payment_date?: string;
  notes?: string;
  category?: string;
  due_date?: string;
  semester_id?: number;
  schoolYear?: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: '2025-01-15',
    description: 'Tuition Fee - 1st Semester 2025-2026',
    amount: -28000,
    status: 'pending',
    reference: 'INV-2025-001',
    category: 'Tuition',
    due_date: '2025-02-15',
    semester_id: 3,
    schoolYear: '2025-2026',
  },
  {
    id: 2,
    date: '2025-01-15',
    description: 'Miscellaneous Fee - 1st Semester 2025-2026',
    amount: -5500,
    status: 'pending',
    reference: 'INV-2025-002',
    category: 'Miscellaneous',
    due_date: '2025-02-15',
    semester_id: 3,
    schoolYear: '2025-2026',
  },
  {
    id: 3,
    date: '2025-01-15',
    description: 'Other Fees - 1st Semester 2025-2026',
    amount: -2000,
    status: 'pending',
    reference: 'INV-2025-003',
    category: 'Other',
    due_date: '2025-02-15',
    semester_id: 3,
    schoolYear: '2025-2026',
  },
  {
    id: 4,
    date: '2025-01-20',
    description: 'Payment - Partial Tuition 1st Sem 2025-2026',
    amount: 15000,
    status: 'completed',
    reference: 'PAY-2025-001',
    payment_method: 'Cash',
    payment_date: '2025-01-20',
    category: 'Payment',
    semester_id: 3,
    schoolYear: '2025-2026',
  },
  {
    id: 5,
    date: '2024-08-15',
    description: 'Tuition Fee - 1st Semester 2024-2025',
    amount: -25000,
    status: 'paid',
    reference: 'INV-2024-001',
    payment_method: 'Cash',
    payment_date: '2024-08-20',
    category: 'Tuition',
    due_date: '2024-09-15',
    semester_id: 1,
    schoolYear: '2024-2025',
  },
  {
    id: 6,
    date: '2024-08-15',
    description: 'Miscellaneous Fee - 1st Semester 2024-2025',
    amount: -5000,
    status: 'paid',
    reference: 'INV-2024-002',
    payment_method: 'GCash',
    payment_date: '2024-08-25',
    category: 'Miscellaneous',
    due_date: '2024-09-15',
    semester_id: 1,
    schoolYear: '2024-2025',
  },
  {
    id: 7,
    date: '2024-08-20',
    description: 'Payment - Full Tuition 1st Sem 2024-2025',
    amount: 30000,
    status: 'completed',
    reference: 'PAY-2024-001',
    payment_method: 'Cash',
    payment_date: '2024-08-20',
    category: 'Payment',
    semester_id: 1,
    schoolYear: '2024-2025',
  },
  {
    id: 8,
    date: '2025-01-15',
    description: 'Tuition Fee - 2nd Semester 2024-2025',
    amount: -25000,
    status: 'paid',
    reference: 'INV-2024-003',
    payment_method: 'Bank Transfer',
    payment_date: '2025-01-25',
    category: 'Tuition',
    due_date: '2025-02-15',
    semester_id: 2,
    schoolYear: '2024-2025',
  },
];
