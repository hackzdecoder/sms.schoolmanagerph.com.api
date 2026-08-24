export interface AccountSummary {
  totalBalance: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalDue: number;
  totalUnits: number;
  totalSubjects: number;
}

export interface AccountDetails {
  name: string;
  studentId: string;
  course: string;
  yearLevel: string;
  email: string;
  contact: string;
  address: string;
  status: string;
  currentSchoolYear: string;
  currentSemester: string;
  program: string;
  college: string;
}

export const mockAccountDetails: AccountDetails = {
  name: 'Laserna, Dianne',
  studentId: '2024-001',
  course: 'Bachelor of Science in Information Technology',
  yearLevel: '2nd Year',
  email: 'dianne.laserna@email.com',
  contact: '0917-521-1118',
  address: '123 Main Street, Manila, Philippines',
  status: 'Active',
  currentSchoolYear: '2025-2026',
  currentSemester: '1st Semester',
  program: 'BS Information Technology',
  college: 'College of Computer Studies',
};
