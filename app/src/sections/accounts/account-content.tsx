import { useState, useCallback, useMemo } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { alpha } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';

// Types
interface Subject {
  id: number;
  code: string;
  name: string;
  units: number;
  grade?: string;
  status: 'enrolled' | 'completed' | 'failed' | 'dropped';
}

interface Semester {
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

interface Transaction {
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

interface AccountSummary {
  totalBalance: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalDue: number;
  totalUnits: number;
  totalSubjects: number;
}

interface AccountDetails {
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

interface PaymentHistory {
  id: number;
  date: string;
  amount: number;
  method: string;
  reference: string;
  status: string;
  semester_id?: number;
}

// Mock Data - Subjects per semester
const mockSemesters: Semester[] = [
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

const mockTransactions: Transaction[] = [
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

const mockPaymentHistory: PaymentHistory[] = [
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

const mockAccountDetails: AccountDetails = {
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

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 700 },
  maxHeight: '90vh',
  overflowY: 'auto' as const,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export function AccountContent() {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSchoolYear, setFilterSchoolYear] = useState<string>('all');
  const [semesters] = useState<Semester[]>(mockSemesters);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [paymentHistory] = useState<PaymentHistory[]>(mockPaymentHistory);
  const [accountDetails] = useState<AccountDetails>(mockAccountDetails);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [semesterModalOpen, setSemesterModalOpen] = useState<boolean>(false);

  // Get unique school years from semesters
  const schoolYears = useMemo(() => {
    const years = semesters.map((s) => s.schoolYear);
    return ['all', ...new Set(years)];
  }, [semesters]);

  // Filter semesters by school year
  const filteredSemesters = useMemo(() => {
    if (filterSchoolYear === 'all') return semesters;
    return semesters.filter((s) => s.schoolYear === filterSchoolYear);
  }, [semesters, filterSchoolYear]);

  // Get current semester (first active/partial semester)
  const currentSemester = useMemo(
    () =>
      semesters.find(
        (s) => s.status === 'partial' || s.status === 'unpaid' || s.status === 'overdue'
      ),
    [semesters]
  );

  // Calculate summary
  const summary: AccountSummary = useMemo(() => {
    const totals = transactions.reduce(
      (acc: AccountSummary, curr: Transaction) => {
        acc.totalBalance += curr.amount;
        if (curr.status === 'completed' || curr.status === 'paid') {
          acc.totalPaid += Math.abs(curr.amount);
        } else if (curr.status === 'pending') {
          acc.totalPending += Math.abs(curr.amount);
        } else if (curr.status === 'overdue') {
          acc.totalOverdue += Math.abs(curr.amount);
        }
        return acc;
      },
      {
        totalBalance: 0,
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        totalDue: 0,
        totalUnits: 0,
        totalSubjects: 0,
      }
    );

    // Calculate total units and subjects
    semesters.forEach((sem) => {
      totals.totalUnits += sem.totalUnits;
      totals.totalSubjects += sem.subjects.length;
    });

    totals.totalDue = totals.totalPending + totals.totalOverdue;
    return totals;
  }, [transactions, semesters]);

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesSchoolYear =
      filterSchoolYear === 'all' || transaction.schoolYear === filterSchoolYear;
    return matchesSearch && matchesStatus && matchesSchoolYear;
  });

  // Pagination
  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleFilterStatusChange = useCallback((event: SelectChangeEvent) => {
    setFilterStatus(event.target.value);
    setPage(0);
  }, []);

  const handleFilterSchoolYearChange = useCallback((event: SelectChangeEvent) => {
    setFilterSchoolYear(event.target.value);
    setPage(0);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  }, []);

  const handleModalOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleViewDetails = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsModalOpen(true);
  }, []);

  const handleDetailsModalClose = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedTransaction(null);
  }, []);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const handleViewSemester = useCallback((semester: Semester) => {
    setSelectedSemester(semester);
    setSemesterModalOpen(true);
  }, []);

  const handleSemesterModalClose = useCallback(() => {
    setSemesterModalOpen(false);
    setSelectedSemester(null);
  }, []);

  function getStatusColor(status: string): 'success' | 'warning' | 'error' | 'default' {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'success';
      case 'partial':
        return 'warning';
      case 'pending':
        return 'warning';
      case 'unpaid':
        return 'error';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  }

  function getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  const getPaymentProgress = (semester?: Semester) => {
    if (semester) {
      const total = semester.totalFee;
      if (total === 0) return 0;
      return Math.round((semester.amountPaid / total) * 100);
    }
    const total = summary.totalPaid + summary.totalDue;
    if (total === 0) return 0;
    return Math.round((summary.totalPaid / total) * 100);
  };

  const getSemesterStatusChip = (status: string) => {
    const color = getStatusColor(status);
    const label = getStatusLabel(status);
    return <Chip label={label} color={color} size="small" sx={{ fontWeight: 500 }} />;
  };

  return (
    <Box>
      {/* Account Details Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Iconify icon={'eva:person-outline' as any} width={32} sx={{ color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {accountDetails.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {accountDetails.studentId} • {accountDetails.course}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {accountDetails.currentSchoolYear} • {accountDetails.currentSemester}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mt: { xs: 2, sm: 0 } }}
        >
          <Chip
            label={accountDetails.status}
            color="success"
            size="small"
            sx={{ fontWeight: 500 }}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon={'eva:eye-outline' as any} width={18} />}
            onClick={handleModalOpen}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            View Full Details
          </Button>
        </Stack>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
              <Iconify
                icon={'eva:credit-card-outline' as any}
                width={18}
                sx={{ color: 'primary.main' }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Balance
              </Typography>
            </Stack>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              {formatCurrency(summary.totalBalance)}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.04),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
              <Iconify
                icon={'eva:checkmark-circle-2-outline' as any}
                width={18}
                sx={{ color: 'success.main' }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Paid
              </Typography>
            </Stack>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: 'success.main', fontSize: '1rem' }}
            >
              {formatCurrency(summary.totalPaid)}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) => alpha(theme.palette.warning.main, 0.04),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
              <Iconify
                icon={'eva:clock-outline' as any}
                width={18}
                sx={{ color: 'warning.main' }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Pending
              </Typography>
            </Stack>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: 'warning.main', fontSize: '1rem' }}
            >
              {formatCurrency(summary.totalPending)}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.04),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
              <Iconify
                icon={'eva:alert-triangle-outline' as any}
                width={18}
                sx={{ color: 'error.main' }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Overdue
              </Typography>
            </Stack>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: 'error.main', fontSize: '1rem' }}
            >
              {formatCurrency(summary.totalOverdue)}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) => alpha(theme.palette.info.main, 0.04),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
              <Iconify
                icon={'eva:book-open-outline' as any}
                width={18}
                sx={{ color: 'info.main' }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Units
              </Typography>
            </Stack>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main', fontSize: '1rem' }}>
              {summary.totalUnits}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Current Semester Status */}
      {currentSemester && (
        <Alert
          severity={currentSemester.status === 'partial' ? 'warning' : 'error'}
          sx={{ mb: 3, borderRadius: 2 }}
          icon={
            currentSemester.status === 'partial' ? (
              <Iconify icon={'eva:clock-outline' as any} />
            ) : (
              <Iconify icon={'eva:alert-triangle-outline' as any} />
            )
          }
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {currentSemester.name} {currentSemester.schoolYear}
              </Typography>
              <Typography variant="caption">
                Balance: {formatCurrency(currentSemester.balance)} •{' '}
                {currentSemester.subjects.length} subjects • {currentSemester.totalUnits} units
              </Typography>
            </Box>
            <Button
              size="small"
              variant="contained"
              color={currentSemester.status === 'partial' ? 'warning' : 'error'}
              onClick={() => handleViewSemester(currentSemester)}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              View Semester Details
            </Button>
          </Stack>
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="account tabs">
          <Tab label="Semesters" />
          <Tab label="Transactions" />
          <Tab label="Payment History" />
        </Tabs>
      </Box>

      {/* Semesters Tab */}
      {tabValue === 0 && (
        <>
          {/* School Year Filter */}
          <Box sx={{ mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select value={filterSchoolYear} onChange={handleFilterSchoolYearChange} displayEmpty>
                <MenuItem value="all">All School Years</MenuItem>
                {schoolYears
                  .filter((y) => y !== 'all')
                  .map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {filteredSemesters.map((semester) => (
              <Grid key={semester.id} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 2,
                      borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {semester.name} {semester.schoolYear}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {semester.subjects.length} subjects • {semester.totalUnits} units
                        </Typography>
                      </Box>
                      {getSemesterStatusChip(semester.status)}
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Total Fee
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(semester.totalFee)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Amount Paid
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {formatCurrency(semester.amountPaid)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Balance
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: semester.balance > 0 ? 'error.main' : 'success.main',
                          }}
                        >
                          {formatCurrency(semester.balance)}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                      >
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Payment Progress
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: 'primary.main' }}
                        >
                          {getPaymentProgress(semester)}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={getPaymentProgress(semester)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            bgcolor: semester.balance === 0 ? 'success.main' : 'primary.main',
                          },
                        }}
                      />
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewSemester(semester)}
                        startIcon={<Iconify icon={'eva:eye-outline' as any} width={16} />}
                        sx={{ borderRadius: 1.5, textTransform: 'none' }}
                      >
                        View Details
                      </Button>
                      {semester.balance > 0 && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          startIcon={<Iconify icon={'eva:credit-card-outline' as any} width={16} />}
                          sx={{ borderRadius: 1.5, textTransform: 'none' }}
                        >
                          Pay Balance
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Transactions Tab */}
      {tabValue === 1 && (
        <>
          {/* Filters */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              mb: 3,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <TextField
                placeholder="Search by description or reference..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'eva:search-outline' as any} width={20} />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select value={filterStatus} onChange={handleFilterStatusChange} displayEmpty>
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select
                  value={filterSchoolYear}
                  onChange={handleFilterSchoolYearChange}
                  displayEmpty
                >
                  <MenuItem value="all">All School Years</MenuItem>
                  {schoolYears
                    .filter((y) => y !== 'all')
                    .map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* Transactions Table */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04) }}>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>School Year</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                          <Iconify
                            icon={'eva:file-text-outline' as any}
                            width={48}
                            sx={{ color: 'text.disabled', mb: 2 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            No transactions found
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{transaction.description}</Typography>
                          {transaction.category && (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {transaction.category}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{transaction.schoolYear || '-'}</TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 600,
                            color: transaction.amount < 0 ? 'error.main' : 'success.main',
                          }}
                        >
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(transaction.status)}
                            color={getStatusColor(transaction.status)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(transaction)}
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                },
                              }}
                            >
                              <Iconify icon={'eva:eye-outline' as any} width={18} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      )}

      {/* Payment History Tab */}
      {tabValue === 2 && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04) }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Semester</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Iconify
                          icon={'eva:file-text-outline' as any}
                          width={48}
                          sx={{ color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          No payment history found
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paymentHistory.map((payment) => {
                    const semester = semesters.find((s) => s.id === payment.semester_id);
                    return (
                      <TableRow key={payment.id} hover>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {payment.reference}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.method}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          {semester ? `${semester.name} ${semester.schoolYear}` : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(payment.status)}
                            color={getStatusColor(payment.status)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Semester Details Modal */}
      <Modal
        open={semesterModalOpen}
        onClose={handleSemesterModalClose}
        aria-labelledby="semester-details-modal"
      >
        <Box sx={{ ...modalStyle, width: { xs: '95%', sm: 800 } }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {selectedSemester?.name} {selectedSemester?.schoolYear}
            </Typography>
            <IconButton onClick={handleSemesterModalClose} size="small">
              <Iconify icon={'eva:close-outline' as any} width={24} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {selectedSemester && (
            <>
              {/* Semester Summary */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Total Fee
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(selectedSemester.totalFee)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Amount Paid
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {formatCurrency(selectedSemester.amountPaid)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Balance
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: selectedSemester.balance > 0 ? 'error.main' : 'success.main',
                    }}
                  >
                    {formatCurrency(selectedSemester.balance)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>{getSemesterStatusChip(selectedSemester.status)}</Box>
                </Grid>
              </Grid>

              <Divider sx={{ mb: 2 }} />

              {/* Fee Breakdown */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Fee Breakdown
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Tuition Fee
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(selectedSemester.tuitionFee)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: (theme) => alpha(theme.palette.warning.main, 0.04),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Miscellaneous Fee
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(selectedSemester.miscellaneousFee)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.04),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Other Fees
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(selectedSemester.otherFees)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Subjects */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Subjects ({selectedSemester.subjects.length})
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                }}
              >
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04) }}
                      >
                        <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Units</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Grade</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedSemester.subjects.map((subject) => (
                        <TableRow key={subject.id} hover>
                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                            >
                              {subject.code}
                            </Typography>
                          </TableCell>
                          <TableCell>{subject.name}</TableCell>
                          <TableCell align="center">{subject.units}</TableCell>
                          <TableCell align="center">
                            {subject.grade ? (
                              <Chip
                                label={subject.grade}
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                              />
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={getStatusLabel(subject.status)}
                              color={getStatusColor(subject.status)}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleSemesterModalClose}
                  sx={{ borderRadius: 1.5, textTransform: 'none' }}
                >
                  Close
                </Button>
                {selectedSemester.balance > 0 && (
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon={'eva:credit-card-outline' as any} width={18} />}
                    sx={{ borderRadius: 1.5, textTransform: 'none' }}
                  >
                    Pay Balance
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        open={detailsModalOpen}
        onClose={handleDetailsModalClose}
        aria-labelledby="transaction-details-modal"
      >
        <Box sx={modalStyle}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Transaction Details
            </Typography>
            <IconButton onClick={handleDetailsModalClose} size="small">
              <Iconify icon={'eva:close-outline' as any} width={24} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {selectedTransaction && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {selectedTransaction.description}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Reference
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, mt: 0.5, fontFamily: 'monospace' }}
                >
                  {selectedTransaction.reference}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Date
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {selectedTransaction.date}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Amount
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    mt: 0.5,
                    color: selectedTransaction.amount < 0 ? 'error.main' : 'success.main',
                  }}
                >
                  {formatCurrency(selectedTransaction.amount)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={getStatusLabel(selectedTransaction.status)}
                    color={getStatusColor(selectedTransaction.status)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              </Grid>

              {selectedTransaction.category && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Category
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {selectedTransaction.category}
                  </Typography>
                </Grid>
              )}

              {selectedTransaction.schoolYear && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    School Year
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {selectedTransaction.schoolYear}
                  </Typography>
                </Grid>
              )}

              {selectedTransaction.due_date && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Due Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {selectedTransaction.due_date}
                  </Typography>
                </Grid>
              )}

              {selectedTransaction.payment_method && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Payment Method
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {selectedTransaction.payment_method}
                  </Typography>
                </Grid>
              )}

              {selectedTransaction.payment_date && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Payment Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {selectedTransaction.payment_date}
                  </Typography>
                </Grid>
              )}

              {selectedTransaction.notes && (
                <Grid size={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {selectedTransaction.notes}
                  </Typography>
                </Grid>
              )}

              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={handleDetailsModalClose}
                    sx={{ borderRadius: 1.5, textTransform: 'none' }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon={'eva:printer-outline' as any} width={18} />}
                    sx={{ borderRadius: 1.5, textTransform: 'none' }}
                  >
                    Print Receipt
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      {/* Account Details Modal */}
      <Modal open={modalOpen} onClose={handleModalClose} aria-labelledby="account-details-modal">
        <Box sx={{ ...modalStyle, width: { xs: '95%', sm: 600 } }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Account Details
            </Typography>
            <IconButton onClick={handleModalClose} size="small">
              <Iconify icon={'eva:close-outline' as any} width={24} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2.5}>
            <Grid size={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                  p: 2,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify
                    icon={'eva:person-outline' as any}
                    width={36}
                    sx={{ color: 'primary.main' }}
                  />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {accountDetails.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {accountDetails.studentId}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Student ID
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {accountDetails.studentId}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={accountDetails.status}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Program
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {accountDetails.program}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                College
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {accountDetails.college}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Course
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {accountDetails.course}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Year Level
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {accountDetails.yearLevel}
              </Typography>
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Current School Year
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {accountDetails.currentSchoolYear}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Current Semester
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {accountDetails.currentSemester}
              </Typography>
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Email
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {accountDetails.email}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Contact Number
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {accountDetails.contact}
              </Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Address
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                {accountDetails.address}
              </Typography>
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleModalClose}
                  sx={{ borderRadius: 1.5, textTransform: 'none' }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon={'eva:edit-outline' as any} width={18} />}
                  sx={{ borderRadius: 1.5, textTransform: 'none' }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}
