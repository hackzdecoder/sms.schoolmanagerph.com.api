import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { alpha } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import ModalDialogContent from 'src/features/components/dialogs/ModalDialog';
import {
  getAccountDetails,
  getPaymentHistory,
  getSemesters,
  getTransactions,
} from 'src/features/utilities/hooks/useAccountLedgerApi';
import { useAppDispatch } from 'src/features/utilities/store/useStore';

// ============================================================
//  COMPONENT
// ============================================================

export default function AccountContent() {
  const dispatch = useAppDispatch();

  // ============================================================
  //  REDUX STATE
  // ============================================================

  const accountDetailsState = useSelector((state: any) => state.accountLedger.accountDetails);
  const semestersState = useSelector((state: any) => state.accountLedger.semesters);
  const transactionsState = useSelector((state: any) => state.accountLedger.transactions);
  const paymentHistoryState = useSelector((state: any) => state.accountLedger.paymentHistory);

  const accountDetails = useMemo(
    () => accountDetailsState?.values?.data || null,
    [accountDetailsState?.values?.data],
  );
  const semestersData = useMemo(
    () => semestersState?.values?.data || [],
    [semestersState?.values?.data],
  );
  const transactionsData = useMemo(
    () => transactionsState?.values?.data || [],
    [transactionsState?.values?.data],
  );
  const paymentHistoryData = useMemo(
    () => paymentHistoryState?.values?.data || [],
    [paymentHistoryState?.values?.data],
  );

  const isLoading =
    accountDetailsState?.isLoading ||
    semestersState?.isLoading ||
    transactionsState?.isLoading ||
    paymentHistoryState?.isLoading;

  // ============================================================
  //  LOCAL STATE
  // ============================================================

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSchoolYear, setFilterSchoolYear] = useState<string>('all');
  const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);
  const [semesterModalOpen, setSemesterModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedSemester, setSelectedSemester] = useState<any>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ============================================================
  //  STATISTICAL APPLETS DIALOG STATE
  // ============================================================

  const [appletDialogOpen, setAppletDialogOpen] = useState<boolean>(false);
  const [appletDialogTitle, setAppletDialogTitle] = useState<string>('');
  const [appletDialogData, setAppletDialogData] = useState<any[]>([]);

  // ============================================================
  //  EFFECTS
  // ============================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchError(null);
        await dispatch(getAccountDetails()).unwrap();
        await dispatch(getSemesters()).unwrap();
        await dispatch(getTransactions()).unwrap();
        await dispatch(getPaymentHistory()).unwrap();
      } catch (err: any) {
        console.error('Error fetching account data:', err);
        setFetchError(err?.message || 'Failed to load account data. Please try again.');
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  //  GET CURRENT SCHOOL YEAR
  // ============================================================

  const currentSchoolYear = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    if (month >= 6) {
      return `${year}-${year + 1}`;
    }
    return `${year - 1}-${year}`;
  }, []);

  // ============================================================
  //  UTILITY FUNCTIONS
  // ============================================================

  function formatCurrency(amount: number): string {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₱0.00';
    }
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  }

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

  function getNumber(value: any): number {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  // ============================================================
  //  STATISTICAL APPLETS DATA
  // ============================================================

  // 1. Previous Account Balance
  const previousAccountBalance = useMemo(() => {
    let total = 0;
    const records: any[] = [];

    semestersData.forEach((sem: any) => {
      const balance = getNumber(sem.balance);
      if (sem.school_year !== currentSchoolYear && balance > 0) {
        total += balance;
        records.push({
          'School Year': sem.school_year || 'N/A',
          'Enrollment Number': sem.enrollment_number || 'N/A',
          Level: sem.level || sem.year_level || 'N/A',
          Section: sem.section || sem.section_course || 'N/A',
          'Total Amount': getNumber(sem.total_fee) || getNumber(sem.tuition_fee) || 0,
          'Amount Paid': getNumber(sem.amount_paid) || 0,
          'Remaining Balance': balance,
        });
      }
    });

    return {
      total,
      formatted: formatCurrency(total),
      records,
      count: records.length,
      label: 'Previous Account Balance',
      description: 'Unpaid Account Balance for the Previous School Years.',
    };
  }, [semestersData, currentSchoolYear]);

  // 2. Current Enrollment Fee Balance
  const currentEnrollmentFeeBalance = useMemo(() => {
    let total = 0;
    const records: any[] = [];

    semestersData.forEach((sem: any) => {
      const balance = getNumber(sem.balance);
      if (sem.school_year === currentSchoolYear && balance > 0) {
        total += balance;
        records.push({
          'School Year': sem.school_year || 'N/A',
          'Enrollment Number': sem.enrollment_number || 'N/A',
          Level: sem.level || sem.year_level || 'N/A',
          Section: sem.section || sem.section_course || 'N/A',
          'Total Amount': getNumber(sem.total_fee) || getNumber(sem.tuition_fee) || 0,
          'Amount Paid': getNumber(sem.amount_paid) || 0,
          'Remaining Balance': balance,
        });
      }
    });

    return {
      total,
      formatted: formatCurrency(total),
      records,
      count: records.length,
      label: 'Current Enrollment Fee Balance',
      description: "Unpaid Balance in the Current School Year's Enrollment Fees.",
    };
  }, [semestersData, currentSchoolYear]);

  // 3. Total Current Installment Balance
  const totalCurrentInstallmentBalance = useMemo(() => {
    let total = 0;
    const records: any[] = [];

    transactionsData.forEach((trans: any) => {
      const amount = getNumber(trans.amount);
      if (trans.category === 'Installment' && amount < 0) {
        total += Math.abs(amount);

        let monthName = 'N/A';
        if (trans.due_date) {
          const dueDate = new Date(trans.due_date);
          monthName = dueDate.toLocaleString('default', { month: 'long' });
        }

        const record: any = {
          'School Year': trans.school_year || 'N/A',
          'Enrollment Number': trans.reference || 'N/A',
          Level: trans.level || 'N/A',
          Section: trans.section || 'N/A',
        };

        record[`${monthName} Account`] = trans.due_date
          ? new Date(trans.due_date).toLocaleDateString()
          : 'N/A';
        record[`${monthName} Amount`] = Math.abs(amount);
        record[`${monthName} Paid Amount`] = trans.paid_amount || 0;
        record[`${monthName} Balance`] = Math.abs(amount);
        // Store status as raw value so it can be rendered with badge
        record[`${monthName} Status`] = trans.status || 'N/A';

        records.push(record);
      }
    });

    return {
      total,
      formatted: formatCurrency(total),
      records,
      count: records.length,
      label: 'Total Current Installment Balance',
      description: 'Unpaid Installment Account Balances (per Month) for the Current School Year.',
    };
  }, [transactionsData]);

  // 4. Other Fees Account Balance
  const otherFeesAccountBalance = useMemo(() => {
    let total = 0;
    const records: any[] = [];

    transactionsData.forEach((trans: any) => {
      const amount = getNumber(trans.amount);
      if (trans.category === 'Other' && amount < 0) {
        total += Math.abs(amount);
        records.push({
          'School Year': trans.school_year || 'N/A',
          'Description of Fees': trans.description || trans.fee_name || 'N/A',
          'Total Amount of Fees': Math.abs(amount),
          Discount: trans.discount || 0,
          'Amount Paid': trans.paid_amount || 0,
          'Remaining Balance': Math.abs(amount),
        });
      }
    });

    return {
      total,
      formatted: formatCurrency(total),
      records,
      count: records.length,
      label: 'Other Fees Account Balance',
      description: 'Unpaid Account Balance for Other Fees.',
    };
  }, [transactionsData]);

  // 5. Total Account Balance
  const totalAccountBalance = useMemo(() => {
    const total =
      getNumber(previousAccountBalance.total) +
      getNumber(currentEnrollmentFeeBalance.total) +
      getNumber(totalCurrentInstallmentBalance.total) +
      getNumber(otherFeesAccountBalance.total);

    const records = [
      {
        'Previous School Year Account': formatCurrency(previousAccountBalance.total),
        'Current Enrollment Balance': formatCurrency(currentEnrollmentFeeBalance.total),
        'Total Current SY Installment': formatCurrency(totalCurrentInstallmentBalance.total),
        'Total Balances on Other Fees': formatCurrency(otherFeesAccountBalance.total),
        'Total Outstanding Account Balance': formatCurrency(total),
      },
    ];

    return {
      total,
      formatted: formatCurrency(total),
      records,
      count: records.length,
      label: 'Total Account Balance',
      description:
        "Sum of the Student's Previous Account Balance, Current Enrollment Balance, Total Current Installment Balance, and Total Other Fees Account Balances.",
    };
  }, [
    previousAccountBalance,
    currentEnrollmentFeeBalance,
    totalCurrentInstallmentBalance,
    otherFeesAccountBalance,
  ]);

  // 6. Prepaid Account Available Balance
  const prepaidAccountBalance = useMemo(() => {
    let total = 0;
    const records: any[] = [];

    paymentHistoryData.forEach((payment: any) => {
      const amount = getNumber(payment.amount);
      if (payment.method === 'Prepaid') {
        total += amount;
        records.push({
          'Account Name': accountDetails?.name || 'N/A',
          'Account Number': accountDetails?.studentId || 'N/A',
          'Available Balance': amount,
        });
      }
    });

    if (records.length === 0) {
      const prepaidTotal = getNumber(
        paymentHistoryData.reduce((sum: number, p: any) => {
          if (p.method === 'Prepaid') {
            return sum + getNumber(p.amount);
          }
          return sum;
        }, 0),
      );

      if (prepaidTotal > 0) {
        total = prepaidTotal;
        records.push({
          'Account Name': accountDetails?.name || 'N/A',
          'Account Number': accountDetails?.studentId || 'N/A',
          'Available Balance': prepaidTotal,
        });
      }
    }

    return {
      total,
      formatted: formatCurrency(total),
      records,
      count: records.length,
      label: 'Prepaid Account Available Balance',
      description: "Details of the Available Balance of the Student's Prepaid Account.",
    };
  }, [paymentHistoryData, accountDetails]);

  // 7. Prepaid Account Transaction History
  const prepaidTransactionHistory = useMemo(() => {
    const records: any[] = [];
    let total = 0;

    paymentHistoryData.forEach((payment: any) => {
      const amount = getNumber(payment.amount);
      if (payment.method === 'Prepaid') {
        total += amount;
        records.push({
          Date: payment.date || 'N/A',
          'Transaction Type': payment.method || 'N/A',
          Description: payment.reference || 'N/A',
          Amount: amount,
        });
      }
    });

    records.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

    return {
      total,
      formatted: formatCurrency(total),
      records,
      count: records.length,
      label: 'Prepaid Account Transaction History',
      description:
        "Details of all the Available Transactions related to the Student's Prepaid Account.",
    };
  }, [paymentHistoryData]);

  // 8. Current Installment Account Dues
  const currentInstallmentDues = useMemo(() => {
    const dues: any[] = [];
    const currentDate = new Date();
    let totalDue = 0;

    transactionsData.forEach((trans: any) => {
      const amount = getNumber(trans.amount);
      if (trans.category === 'Installment' && amount < 0 && trans.status !== 'paid') {
        const dueDate = new Date(trans.due_date);
        if (dueDate >= currentDate) {
          dues.push({
            'School Year': trans.school_year || 'N/A',
            Reference: trans.reference || 'N/A',
            'Total Amount': Math.abs(amount),
            'Amount Paid': trans.paid_amount || 0,
            'Remaining Balance': Math.abs(amount),
            'Due Date': trans.due_date ? new Date(trans.due_date).toLocaleDateString() : 'N/A',
            Status: trans.status || 'N/A',
          });
          totalDue += Math.abs(amount);
        }
      }
    });

    dues.sort((a, b) => new Date(a['Due Date']).getTime() - new Date(b['Due Date']).getTime());

    return {
      total: totalDue,
      formatted: formatCurrency(totalDue),
      records: dues,
      count: dues.length,
      label: 'Current Installment Account Dues',
      description: 'Current amount dues and its due date for the current school year.',
    };
  }, [transactionsData]);

  // 9. Current Overdue Installment Accounts
  const currentOverdueInstallments = useMemo(() => {
    const overdue: any[] = [];
    let totalOverdue = 0;

    transactionsData.forEach((trans: any) => {
      const amount = getNumber(trans.amount);
      if (trans.category === 'Installment' && amount < 0 && trans.status === 'overdue') {
        overdue.push({
          'School Year': trans.school_year || 'N/A',
          Reference: trans.reference || 'N/A',
          'Total Amount': Math.abs(amount),
          'Amount Paid': trans.paid_amount || 0,
          'Remaining Balance': Math.abs(amount),
          'Due Date': trans.due_date ? new Date(trans.due_date).toLocaleDateString() : 'N/A',
          Status: trans.status || 'N/A',
        });
        totalOverdue += Math.abs(amount);
      }
    });

    overdue.sort((a, b) => new Date(a['Due Date']).getTime() - new Date(b['Due Date']).getTime());

    return {
      total: totalOverdue,
      formatted: formatCurrency(totalOverdue),
      records: overdue,
      count: overdue.length,
      label: 'Current Overdue Installment Accounts',
      description: 'Amount of overdue monthly installments for the current school year.',
    };
  }, [transactionsData]);

  // 10. Payment Transactions / History
  const paymentTransactions = useMemo(() => {
    const records: any[] = [];
    let total = 0;

    paymentHistoryData.forEach((payment: any) => {
      const amount = getNumber(payment.amount);
      if (amount > 0 && payment.method !== 'Prepaid') {
        total += amount;
        records.push({
          Date: payment.date || 'N/A',
          Reference: payment.reference || 'N/A',
          'Payment Type': payment.method || 'N/A',
          Amount: amount,
        });
      }
    });

    records.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

    return {
      total,
      formatted: formatCurrency(total),
      records,
      count: records.length,
      label: 'Payment Transactions / History',
      description: 'Detailed Payment Transaction Records of the selected student.',
    };
  }, [paymentHistoryData]);

  // ============================================================
  //  COMPUTED VALUES
  // ============================================================

  const schoolYears = useMemo(() => {
    const years = semestersData.map((s: any) => s.school_year);
    return ['all', ...new Set(years)];
  }, [semestersData]);

  const filteredSemesters = useMemo(() => {
    if (filterSchoolYear === 'all') return semestersData;
    return semestersData.filter((s: any) => s.school_year === filterSchoolYear);
  }, [semestersData, filterSchoolYear]);

  const currentSemester = useMemo(
    () =>
      semestersData.find(
        (s: any) => s.status === 'partial' || s.status === 'unpaid' || s.status === 'overdue',
      ),
    [semestersData],
  );

  const filteredTransactions = useMemo(() => {
    if (!transactionsData || transactionsData.length === 0) {
      return [];
    }

    return transactionsData.filter((transaction: any) => {
      const searchLower = searchTerm.toLowerCase();
      const description = transaction.description || '';
      const reference = transaction.reference || '';

      const matchesSearch =
        searchTerm === '' ||
        description.toLowerCase().includes(searchLower) ||
        reference.toLowerCase().includes(searchLower);

      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      const matchesSchoolYear =
        filterSchoolYear === 'all' || transaction.school_year === filterSchoolYear;

      return matchesSearch && matchesStatus && matchesSchoolYear;
    });
  }, [transactionsData, searchTerm, filterStatus, filterSchoolYear]);

  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredTransactions, page, rowsPerPage]);

  // ============================================================
  //  HANDLERS
  // ============================================================

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

  const handleAccountModalOpen = useCallback(() => setAccountModalOpen(true), []);
  const handleAccountModalClose = useCallback(() => setAccountModalOpen(false), []);

  const handleTransactionModalOpen = useCallback((transaction: any) => {
    setSelectedTransaction(transaction);
    setTransactionModalOpen(true);
  }, []);

  const handleTransactionModalClose = useCallback(() => {
    setTransactionModalOpen(false);
    setSelectedTransaction(null);
  }, []);

  const handleSemesterModalOpen = useCallback((semester: any) => {
    setSelectedSemester(semester);
    setSemesterModalOpen(true);
  }, []);

  const handleSemesterModalClose = useCallback(() => {
    setSemesterModalOpen(false);
    setSelectedSemester(null);
  }, []);

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  // ============================================================
  //  APPLET HANDLERS
  // ============================================================

  const handleAppletClick = (title: string, records: any[]) => {
    setAppletDialogTitle(title);
    setAppletDialogData(records);
    setAppletDialogOpen(true);
  };

  const handleAppletDialogClose = () => {
    setAppletDialogOpen(false);
    setAppletDialogData([]);
  };

  // ============================================================
  //  SEMESTER STATUS CHIP
  // ============================================================

  const getSemesterStatusChip = (status: string) => {
    const color = getStatusColor(status);
    const label = getStatusLabel(status);
    return <Chip label={label} color={color} size="small" sx={{ fontWeight: 500 }} />;
  };

  // ============================================================
  //  LOADING STATE
  // ============================================================

  if (isLoading && !accountDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Iconify
            icon={'svg-spinners:8-dots-rotate' as any}
            width={48}
            sx={{ animation: 'spin 1s linear infinite' }}
          />
          <Typography sx={{ mt: 2 }}>Loading account details...</Typography>
        </Box>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Error Loading Data
          </Typography>
          <Typography variant="body2">{fetchError}</Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
            onClick={() => {
              setFetchError(null);
              dispatch(getAccountDetails());
              dispatch(getSemesters());
              dispatch(getTransactions());
              dispatch(getPaymentHistory());
            }}
          >
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  if (!accountDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography color="text.secondary">No account data found</Typography>
      </Box>
    );
  }

  // ============================================================
  //  RENDER
  // ============================================================

  return (
    <Box>
      {/* ============================================================
        ACCOUNT DETAILS CARD
        ============================================================ */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          mb: 4,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Iconify
                icon={'eva:person-outline' as any}
                width={36}
                sx={{ color: 'primary.main' }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {accountDetails.name}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ID: {accountDetails.studentId}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  •
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {accountDetails.course}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  •
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {accountDetails.yearLevel}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  School Year: {accountDetails.currentSchoolYear}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  •
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {accountDetails.college}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ flexShrink: 0 }}
          >
            <Chip
              label={accountDetails.status}
              color={accountDetails.status === 'Active' ? 'success' : 'default'}
              size="small"
              sx={{ fontWeight: 500 }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon={'eva:eye-outline' as any} width={18} />}
              onClick={handleAccountModalOpen}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              View Full Details
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* ============================================================
        STATISTICAL APPLETS
        ============================================================ */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Account Balance Summary
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* 1. Previous Account Balance */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={80} height={32} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={60} height={16} sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() =>
                handleAppletClick(previousAccountBalance.label, previousAccountBalance.records)
              }
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Previous Balance
                  </Typography>
                  <Iconify
                    icon={'eva:arrow-ios-forward-outline' as any}
                    width={16}
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: 'text.primary' }}>
                  {previousAccountBalance.formatted}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  {previousAccountBalance.count} record(s)
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* 2. Current Enrollment Fee Balance */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={80} height={32} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={60} height={16} sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() =>
                handleAppletClick(
                  currentEnrollmentFeeBalance.label,
                  currentEnrollmentFeeBalance.records,
                )
              }
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Enrollment Balance
                  </Typography>
                  <Iconify
                    icon={'eva:arrow-ios-forward-outline' as any}
                    width={16}
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: 'warning.main' }}>
                  {currentEnrollmentFeeBalance.formatted}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  {currentEnrollmentFeeBalance.count} record(s)
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* 3. Total Current Installment Balance */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton variant="text" width={130} height={20} />
                <Skeleton variant="text" width={80} height={32} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={60} height={16} sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() =>
                handleAppletClick(
                  totalCurrentInstallmentBalance.label,
                  totalCurrentInstallmentBalance.records,
                )
              }
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Installment Balance
                  </Typography>
                  <Iconify
                    icon={'eva:arrow-ios-forward-outline' as any}
                    width={16}
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: 'error.main' }}>
                  {totalCurrentInstallmentBalance.formatted}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  {totalCurrentInstallmentBalance.count} record(s)
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* 4. Other Fees Account Balance */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton variant="text" width={90} height={20} />
                <Skeleton variant="text" width={80} height={32} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={60} height={16} sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() =>
                handleAppletClick(otherFeesAccountBalance.label, otherFeesAccountBalance.records)
              }
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Other Fees
                  </Typography>
                  <Iconify
                    icon={'eva:arrow-ios-forward-outline' as any}
                    width={16}
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: 'info.main' }}>
                  {otherFeesAccountBalance.formatted}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  {otherFeesAccountBalance.count} record(s)
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* 5. Total Account Balance */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={90} height={36} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={70} height={16} sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() =>
                handleAppletClick(totalAccountBalance.label, totalAccountBalance.records)
              }
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Total Balance
                  </Typography>
                  <Iconify
                    icon={'eva:arrow-ios-forward-outline' as any}
                    width={16}
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, color: 'primary.main' }}>
                  {totalAccountBalance.formatted}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  Overall total balance
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* 6. Prepaid Account Available Balance */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={80} height={32} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={60} height={16} sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() =>
                handleAppletClick(prepaidAccountBalance.label, prepaidAccountBalance.records)
              }
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Prepaid Balance
                  </Typography>
                  <Iconify
                    icon={'eva:arrow-ios-forward-outline' as any}
                    width={16}
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: 'success.main' }}>
                  {prepaidAccountBalance.formatted}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  {prepaidAccountBalance.count} transaction(s)
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* 7. Prepaid Account Transaction History */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={80} height={32} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={60} height={16} sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() =>
                handleAppletClick(
                  prepaidTransactionHistory.label,
                  prepaidTransactionHistory.records,
                )
              }
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Prepaid History
                  </Typography>
                  <Iconify
                    icon={'eva:arrow-ios-forward-outline' as any}
                    width={16}
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: 'info.main' }}>
                  {prepaidTransactionHistory.formatted}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  {prepaidTransactionHistory.count} transaction(s)
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* 8. Current Installment Account Dues */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton variant="text" width={110} height={20} />
                <Skeleton variant="text" width={80} height={32} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={60} height={16} sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: (theme) => alpha(theme.palette.warning.main, 0.5),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() =>
                handleAppletClick(currentInstallmentDues.label, currentInstallmentDues.records)
              }
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Current Dues
                  </Typography>
                  <Iconify
                    icon={'eva:arrow-ios-forward-outline' as any}
                    width={16}
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: 'warning.main' }}>
                  {currentInstallmentDues.formatted}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  {currentInstallmentDues.count} due(s)
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* 9. Current Overdue Installment Accounts */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton variant="text" width={140} height={20} />
                <Skeleton variant="text" width={80} height={32} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={60} height={16} sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: (theme) => alpha(theme.palette.error.main, 0.5),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() =>
                handleAppletClick(
                  currentOverdueInstallments.label,
                  currentOverdueInstallments.records,
                )
              }
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Overdue Installments
                  </Typography>
                  <Iconify
                    icon={'eva:arrow-ios-forward-outline' as any}
                    width={16}
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: 'error.main' }}>
                  {currentOverdueInstallments.formatted}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  {currentOverdueInstallments.count} overdue(s)
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* 10. Payment Transactions / History */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {isLoading ? (
            <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={80} height={32} sx={{ mt: 1 }} />
                <Skeleton variant="text" width={60} height={16} sx={{ mt: 0.5 }} />
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() =>
                handleAppletClick(paymentTransactions.label, paymentTransactions.records)
              }
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Payment History
                  </Typography>
                  <Iconify
                    icon={'eva:arrow-ios-forward-outline' as any}
                    width={16}
                    sx={{ color: 'text.secondary' }}
                  />
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: 'info.main' }}>
                  {paymentTransactions.formatted}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  {paymentTransactions.count} transaction(s)
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* ============================================================
        CURRENT SEMESTER ALERT
        ============================================================ */}
      {isLoading ? (
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
        </Box>
      ) : (
        currentSemester && (
          <Alert
            severity={currentSemester.status === 'partial' ? 'warning' : 'error'}
            sx={{
              mb: 3,
              borderRadius: 2,
              width: '100%',
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
            icon={
              currentSemester.status === 'partial' ? (
                <Iconify icon={'eva:clock-outline' as any} />
              ) : (
                <Iconify icon={'eva:alert-triangle-outline' as any} />
              )
            }
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {currentSemester.name} {currentSemester.school_year}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Balance: {formatCurrency(getNumber(currentSemester.balance))}
                  {getNumber(currentSemester.subjects?.length) > 0 &&
                    ` • ${currentSemester.subjects.length} subjects`}
                  {getNumber(currentSemester.total_units) > 0 &&
                    ` • ${getNumber(currentSemester.total_units)} units`}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                color={currentSemester.status === 'partial' ? 'warning' : 'error'}
                onClick={() => handleSemesterModalOpen(currentSemester)}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                View Semester Details
              </Button>
            </Box>
          </Alert>
        )
      )}

      {/* ============================================================
        TABS
        ============================================================ */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="account tabs">
          <Tab label="Semesters" />
          <Tab label="Transactions" />
          <Tab label="Payment History" />
        </Tabs>
      </Box>

      {/* ============================================================
        TAB 0: SEMESTERS
        ============================================================ */}
      {tabValue === 0 && (
        <>
          <Box sx={{ mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select value={filterSchoolYear} onChange={handleFilterSchoolYearChange} displayEmpty>
                <MenuItem value="all">All School Years</MenuItem>
                {schoolYears
                  .filter((y: any) => y !== 'all')
                  .map((year: any) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((item) => (
                  <Grid key={item} size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Skeleton variant="text" width={200} height={28} />
                        <Skeleton variant="text" width={150} height={20} sx={{ mt: 1 }} />
                        <Divider sx={{ my: 2 }} />
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="100%" height={20} />
                        <Box sx={{ mt: 2 }}>
                          <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1.5 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </>
            ) : (
              filteredSemesters.map((semester: any) => (
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
                            {semester.name} {semester.school_year}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {semester.subjects?.length || 0} subjects • {semester.total_units || 0}{' '}
                            units
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
                            {formatCurrency(getNumber(semester.total_fee))}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Amount Paid
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'success.main' }}
                          >
                            {formatCurrency(getNumber(semester.amount_paid))}
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
                              color:
                                getNumber(semester.balance) > 0 ? 'error.main' : 'success.main',
                            }}
                          >
                            {formatCurrency(getNumber(semester.balance))}
                          </Typography>
                        </Stack>
                      </Box>

                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        onClick={() => handleSemesterModalOpen(semester)}
                        startIcon={<Iconify icon={'eva:eye-outline' as any} width={16} />}
                        sx={{ borderRadius: 1.5, textTransform: 'none' }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </>
      )}

      {/* ============================================================
        TAB 1: TRANSACTIONS
        ============================================================ */}
      {tabValue === 1 && (
        <>
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
                    .filter((y: any) => y !== 'all')
                    .map((year: any) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

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
                  {isLoading ? (
                    <>
                      {[1, 2, 3, 4, 5].map((item) => (
                        <TableRow key={item}>
                          <TableCell>
                            <Skeleton variant="text" width={100} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant="text" width={150} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant="text" width={80} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant="text" width={80} sx={{ mx: 'auto' }} />
                          </TableCell>
                          <TableCell>
                            <Skeleton
                              variant="rectangular"
                              width={60}
                              height={24}
                              sx={{ borderRadius: 1 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Skeleton
                              variant="circular"
                              width={32}
                              height={32}
                              sx={{ mx: 'auto' }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : paginatedTransactions.length === 0 ? (
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
                    paginatedTransactions.map((transaction: any) => (
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
                        <TableCell>{transaction.school_year || '-'}</TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 600,
                            color:
                              getNumber(transaction.amount) < 0 ? 'error.main' : 'success.main',
                          }}
                        >
                          {formatCurrency(getNumber(transaction.amount))}
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
                              onClick={() => handleTransactionModalOpen(transaction)}
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

            {!isLoading && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredTransactions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Paper>
        </>
      )}

      {/* ============================================================
        TAB 2: PAYMENT HISTORY
        ============================================================ */}
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
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <TableRow key={item}>
                        <TableCell>
                          <Skeleton variant="text" width={100} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={120} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={80} sx={{ mx: 'auto' }} />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            variant="rectangular"
                            width={70}
                            height={24}
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width={100} />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            variant="rectangular"
                            width={60}
                            height={24}
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : paymentHistoryData.length === 0 ? (
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
                  paymentHistoryData.map((payment: any) => {
                    const semester = semestersData.find((s: any) => s.id === payment.semester_id);
                    return (
                      <TableRow key={payment.id} hover>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {payment.reference}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {formatCurrency(getNumber(payment.amount))}
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
                          {semester ? `${semester.name} ${semester.school_year}` : '-'}
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

      {/* ============================================================
    APPLET DETAILS DIALOG
    ============================================================ */}
      <Dialog
        open={appletDialogOpen}
        onClose={handleAppletDialogClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {appletDialogTitle}
            </Typography>
            <IconButton onClick={handleAppletDialogClose} size="small">
              <Iconify icon={'eva:close-outline' as any} width={24} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <Box sx={{ py: 4 }}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
            </Box>
          ) : appletDialogData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Iconify
                icon={'eva:file-text-outline' as any}
                width={48}
                sx={{ color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                No records found
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04) }}>
                    {Object.keys(appletDialogData[0] || {}).map((key) => (
                      <TableCell key={key} sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                        {key}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appletDialogData.map((record, index) => {
                    const keys = Object.keys(record);
                    return (
                      <TableRow key={index} hover>
                        {keys.map((key, idx) => {
                          const value = record[key];

                          // Check if this is a status column
                          const isStatusColumn = key.includes('Status');

                          // Check if this is a currency column
                          const isCurrency =
                            key === 'Total Amount' ||
                            key === 'Amount Paid' ||
                            key === 'Remaining Balance' ||
                            key === 'Total Amount of Fees' ||
                            key === 'Available Balance' ||
                            key === 'Amount' ||
                            key === 'Total Current SY Installment' ||
                            key === 'Previous School Year Account' ||
                            key === 'Current Enrollment Balance' ||
                            key === 'Total Balances on Other Fees' ||
                            key === 'Total Outstanding Account Balance' ||
                            key.includes('Amount') ||
                            key.includes('Balance') ||
                            key.includes('Total');

                          // Check if this is a month status column (e.g., "June Status", "July Status")
                          const isMonthStatus = key.includes(' Status');

                          return (
                            <TableCell key={idx}>
                              {isMonthStatus || isStatusColumn ? (
                                // Render as Chip badge for status columns
                                <Chip
                                  label={getStatusLabel(value)}
                                  color={getStatusColor(value)}
                                  size="small"
                                  sx={{ fontWeight: 500 }}
                                />
                              ) : typeof value === 'number' && isCurrency ? (
                                formatCurrency(value)
                              ) : (
                                value || '-'
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={handleAppletDialogClose}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============================================================
        EXISTING MODALS
        ============================================================ */}

      {/* Account Details Modal */}
      <ModalDialogContent
        title="Account Details"
        open={accountModalOpen}
        handleDialogClose={handleAccountModalClose}
        customActions={
          <Button
            variant="outlined"
            onClick={handleAccountModalClose}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Close
          </Button>
        }
        maxWidth={600}
      >
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
        </Grid>
      </ModalDialogContent>

      {/* Transaction Details Modal */}
      <ModalDialogContent
        title="Transaction Details"
        open={transactionModalOpen}
        handleDialogClose={handleTransactionModalClose}
        customActions={(handleClose) => (
          <>
            <Button
              variant="outlined"
              onClick={handleClose}
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
          </>
        )}
        maxWidth={700}
      >
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
                  color: getNumber(selectedTransaction.amount) < 0 ? 'error.main' : 'success.main',
                }}
              >
                {formatCurrency(getNumber(selectedTransaction.amount))}
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

            {selectedTransaction.school_year && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  School Year
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                  {selectedTransaction.school_year}
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
          </Grid>
        )}
      </ModalDialogContent>

      {/* ============================================================
        SEMESTER DETAILS MODAL - UPDATED WITH "NOT AVAILABLE YET" DESIGN
        ============================================================ */}
      <ModalDialogContent
        title={`${selectedSemester?.name || ''} ${selectedSemester?.school_year || ''}`}
        open={semesterModalOpen}
        handleDialogClose={handleSemesterModalClose}
        customActions={(handleClose) => (
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Close
          </Button>
        )}
        maxWidth={800}
      >
        {selectedSemester && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Total Fee
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatCurrency(getNumber(selectedSemester.total_fee))}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Amount Paid
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {formatCurrency(getNumber(selectedSemester.amount_paid))}
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
                    color: getNumber(selectedSemester.balance) > 0 ? 'error.main' : 'success.main',
                  }}
                >
                  {formatCurrency(getNumber(selectedSemester.balance))}
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
                    {formatCurrency(getNumber(selectedSemester.tuition_fee))}
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
                    {formatCurrency(getNumber(selectedSemester.miscellaneous_fee))}
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
                    {formatCurrency(getNumber(selectedSemester.other_fees))}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Subjects ({selectedSemester.subjects?.length || 0})
            </Typography>

            {selectedSemester.subjects?.length === 0 ? (
              // Empty State - Subjects Not Available Yet
              <Paper
                elevation={0}
                sx={{
                  border: '1px dashed',
                  borderColor: (theme) => theme.palette.warning.main,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.04),
                }}
              >
                <Stack spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify
                      icon={'eva:info-outline' as any}
                      width={32}
                      sx={{ color: 'warning.main' }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Subjects Not Available Yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400 }}>
                    The subjects for {selectedSemester.name} {selectedSemester.school_year} have not
                    been added yet. Please check back later or contact the registrar`s office for
                    more information.
                  </Typography>
                  <Chip
                    label="Coming Soon"
                    color="warning"
                    size="small"
                    sx={{ fontWeight: 500, mt: 0.5 }}
                  />
                </Stack>
              </Paper>
            ) : (
              // Subjects Table - When data exists
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
                      {selectedSemester.subjects?.map((subject: any) => (
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
            )}
          </>
        )}
      </ModalDialogContent>
    </Box>
  );
}
