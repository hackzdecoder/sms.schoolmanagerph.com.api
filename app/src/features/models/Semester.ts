export interface Subject {
  id: number;
  code: string;
  name: string;
  units: number;
  grade?: string;
  status: 'enrolled' | 'completed' | 'failed' | 'dropped';
}

export interface Semester {
  id: number;
  name: string;
  schoolYear: string;
  term: '1st' | '2nd' | 'Summer';
  subjects: Subject[];
  totalUnits: number;
  tuitionFee: number;
  miscellaneousFee: number;
  otherFees: number;
  totalFee: number;
  amountPaid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
}

// ============ MOCK DATA ============
export const mockSemesters: Semester[] = [
  {
    id: 1,
    name: '1st Semester',
    schoolYear: '2024-2025',
    term: '1st',
    subjects: [
      {
        id: 1,
        code: 'IT 101',
        name: 'Introduction to Computing',
        units: 3,
        status: 'completed',
        grade: '1.25',
      },
      {
        id: 2,
        code: 'MATH 101',
        name: 'College Algebra',
        units: 3,
        status: 'completed',
        grade: '1.75',
      },
      {
        id: 3,
        code: 'ENGL 101',
        name: 'Purposive Communication',
        units: 3,
        status: 'completed',
        grade: '1.50',
      },
      {
        id: 4,
        code: 'FIL 101',
        name: 'Komunikasyon sa Akademikong Filipino',
        units: 3,
        status: 'completed',
        grade: '1.25',
      },
      {
        id: 5,
        code: 'PE 101',
        name: 'Physical Education 1',
        units: 2,
        status: 'completed',
        grade: '1.00',
      },
      {
        id: 6,
        code: 'NSTP 1',
        name: 'National Service Training Program 1',
        units: 3,
        status: 'completed',
        grade: '1.50',
      },
    ],
    totalUnits: 17,
    tuitionFee: 25000,
    miscellaneousFee: 5000,
    otherFees: 2000,
    totalFee: 32000,
    amountPaid: 32000,
    balance: 0,
    status: 'paid',
  },
  {
    id: 2,
    name: '2nd Semester',
    schoolYear: '2024-2025',
    term: '2nd',
    subjects: [
      {
        id: 7,
        code: 'IT 102',
        name: 'Programming Logic and Design',
        units: 3,
        status: 'completed',
        grade: '1.50',
      },
      {
        id: 8,
        code: 'MATH 102',
        name: 'Trigonometry',
        units: 3,
        status: 'completed',
        grade: '2.00',
      },
      {
        id: 9,
        code: 'ENGL 102',
        name: 'Academic Writing',
        units: 3,
        status: 'completed',
        grade: '1.75',
      },
      {
        id: 10,
        code: 'FIL 102',
        name: 'Panitikang Filipino',
        units: 3,
        status: 'completed',
        grade: '1.25',
      },
      {
        id: 11,
        code: 'PE 102',
        name: 'Physical Education 2',
        units: 2,
        status: 'completed',
        grade: '1.00',
      },
      {
        id: 12,
        code: 'NSTP 2',
        name: 'National Service Training Program 2',
        units: 3,
        status: 'completed',
        grade: '1.50',
      },
    ],
    totalUnits: 17,
    tuitionFee: 25000,
    miscellaneousFee: 5000,
    otherFees: 1500,
    totalFee: 31500,
    amountPaid: 31500,
    balance: 0,
    status: 'paid',
  },
  {
    id: 3,
    name: '1st Semester',
    schoolYear: '2025-2026',
    term: '1st',
    subjects: [
      {
        id: 13,
        code: 'IT 201',
        name: 'Data Structures and Algorithms',
        units: 3,
        status: 'enrolled',
      },
      { id: 14, code: 'IT 202', name: 'Object-Oriented Programming', units: 3, status: 'enrolled' },
      { id: 15, code: 'IT 203', name: 'Database Management Systems', units: 3, status: 'enrolled' },
      { id: 16, code: 'MATH 201', name: 'Discrete Mathematics', units: 3, status: 'enrolled' },
      { id: 17, code: 'ENGL 201', name: 'Technical Writing', units: 3, status: 'enrolled' },
      { id: 18, code: 'PE 201', name: 'Physical Education 3', units: 2, status: 'enrolled' },
    ],
    totalUnits: 17,
    tuitionFee: 28000,
    miscellaneousFee: 5500,
    otherFees: 2000,
    totalFee: 35500,
    amountPaid: 15000,
    balance: 20500,
    status: 'partial',
  },
];
