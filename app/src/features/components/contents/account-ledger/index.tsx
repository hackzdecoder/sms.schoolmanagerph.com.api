import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
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
  type AccountDetails,
  type AccountSummary,
  mockAccountDetails,
} from 'src/features/models/Accounts';
import { type PaymentHistory, mockPaymentHistory } from 'src/features/models/Payments';
import { type Semester, mockSemesters } from 'src/features/models/Semester';
import { type Transaction, mockTransactions } from 'src/features/models/Transactions';

// ============================================================
//  COMPONENT
// ============================================================

/**
 * AccountContent - Main component for displaying student account information
 *
 * Features:
 * - Account summary cards (Balance, Paid, Pending, Overdue, Units)
 * - Current semester status alert
 * - Tabbed views: Semesters, Transactions, Payment History
 * - Modal dialogs for viewing details and editing
 */
export default function AccountContent() {
  // ============================================================
  //  STATE
  // ============================================================

  // Pagination state
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSchoolYear, setFilterSchoolYear] = useState<string>('all');

  // Data state
  const [semesters] = useState<Semester[]>(mockSemesters);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [paymentHistory] = useState<PaymentHistory[]>(mockPaymentHistory);
  const [accountDetails] = useState<AccountDetails>(mockAccountDetails);

  // Modal state
  const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);
  const [semesterModalOpen, setSemesterModalOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  // Selected data for modals
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);

  // ============================================================
  //  COMPUTED VALUES (useMemo)
  // ============================================================

  /**
   * Get unique school years from semesters for filter dropdown
   */
  const schoolYears = useMemo(() => {
    const years = semesters.map((s) => s.schoolYear);
    return ['all', ...new Set(years)];
  }, [semesters]);

  /**
   * Filter semesters by selected school year
   */
  const filteredSemesters = useMemo(() => {
    if (filterSchoolYear === 'all') return semesters;
    return semesters.filter((s) => s.schoolYear === filterSchoolYear);
  }, [semesters, filterSchoolYear]);

  /**
   * Get the current semester (partial/unpaid/overdue status)
   */
  const currentSemester = useMemo(
    () =>
      semesters.find(
        (s) => s.status === 'partial' || s.status === 'unpaid' || s.status === 'overdue',
      ),
    [semesters],
  );

  /**
   * Calculate account summary totals
   */
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
      },
    );

    semesters.forEach((sem) => {
      totals.totalUnits += sem.totalUnits;
      totals.totalSubjects += sem.subjects.length;
    });

    totals.totalDue = totals.totalPending + totals.totalOverdue;
    return totals;
  }, [transactions, semesters]);

  /**
   * Filter transactions by search term, status, and school year
   */
  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesSchoolYear =
      filterSchoolYear === 'all' || transaction.schoolYear === filterSchoolYear;
    return matchesSearch && matchesStatus && matchesSchoolYear;
  });

  /**
   * Get paginated transactions for current page
   */
  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // ============================================================
  //  HANDLERS
  // ============================================================

  // -------- Pagination --------
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // -------- Filters --------
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

  // -------- Modal Handlers --------

  /** Account Details Modal */
  const handleAccountModalOpen = useCallback(() => setAccountModalOpen(true), []);
  const handleAccountModalClose = useCallback(() => setAccountModalOpen(false), []);

  /** Transaction Details Modal */
  const handleTransactionModalOpen = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionModalOpen(true);
  }, []);
  const handleTransactionModalClose = useCallback(() => {
    setTransactionModalOpen(false);
    setSelectedTransaction(null);
  }, []);

  /** Semester Details Modal */
  const handleSemesterModalOpen = useCallback((semester: Semester) => {
    setSelectedSemester(semester);
    setSemesterModalOpen(true);
  }, []);
  const handleSemesterModalClose = useCallback(() => {
    setSemesterModalOpen(false);
    setSelectedSemester(null);
  }, []);

  /** Edit Account Dialog */
  const handleEditDialogOpen = useCallback(() => setEditDialogOpen(true), []);
  const handleEditDialogClose = useCallback(() => setEditDialogOpen(false), []);
  const handleEditDialogSubmit = useCallback(() => {
    // TODO: Implement edit functionality
    console.log('Edit submitted');
    setEditDialogOpen(false);
  }, []);

  // -------- Tab Handler --------
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  // ============================================================
  //  UTILITY FUNCTIONS
  // ============================================================

  /**
   * Get MUI color based on status
   */
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

  /**
   * Capitalize status label
   */
  function getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  /**
   * Format amount as Philippine Peso currency
   */
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Calculate payment progress percentage
   */
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

  /**
   * Render status chip for semester
   */
  const getSemesterStatusChip = (status: string) => {
    const color = getStatusColor(status);
    const label = getStatusLabel(status);
    return <Chip label={label} color={color} size="small" sx={{ fontWeight: 500 }} />;
  };

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
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
        }}
      >
        {/* Left: Avatar & Student Info */}
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

        {/* Right: Status & Actions */}
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
            onClick={handleAccountModalOpen}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            View Full Details
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Iconify icon={'eva:edit-outline' as any} width={18} />}
            onClick={handleEditDialogOpen}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Edit Account
          </Button>
        </Stack>
      </Paper>

      {/* ============================================================
        SUMMARY CARDS
        ============================================================ */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Balance */}
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

        {/* Paid */}
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

        {/* Pending */}
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

        {/* Overdue */}
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

        {/* Units */}
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

      {/* ============================================================
        CURRENT SEMESTER ALERT
        ============================================================ */}
      {currentSemester && (
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
                {currentSemester.name} {currentSemester.schoolYear}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Balance: {formatCurrency(currentSemester.balance ?? 0)} •{' '}
                {currentSemester.subjects.length} subjects • {currentSemester.totalUnits} units
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

          {/* Semester Cards */}
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
                    {/* Header: Semester name & status chip */}
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

                    {/* Fee Summary */}
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
                            color: (semester.balance ?? 0) > 0 ? 'error.main' : 'success.main',
                          }}
                        >
                          {formatCurrency(semester.balance ?? 0)}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Payment Progress Bar */}
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
                            bgcolor:
                              (semester.balance ?? 0) === 0 ? 'success.main' : 'primary.main',
                          },
                        }}
                      />
                    </Box>

                    {/* Actions */}
                    <Stack direction="row" spacing={1}>
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
                      {(semester.balance ?? 0) > 0 && (
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

      {/* ============================================================
        TAB 1: TRANSACTIONS
        ============================================================ */}
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
              {/* Search */}
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

              {/* Status Filter */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select value={filterStatus} onChange={handleFilterStatusChange} displayEmpty>
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>

              {/* School Year Filter */}
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

      {/* ============================================================
        MODALS
        ============================================================ */}

      {/* Account Details Modal */}
      <ModalDialogContent
        title="Account Details"
        open={accountModalOpen}
        handleDialogClose={handleAccountModalClose}
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
              startIcon={<Iconify icon={'eva:edit-outline' as any} width={18} />}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Edit Profile
            </Button>
          </>
        )}
        maxWidth={600}
      >
        <Grid container spacing={2.5}>
          {/* Avatar & Name */}
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

          {/* Student Info */}
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

          {/* Academic Info */}
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

          {/* Contact Info */}
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
          </Grid>
        )}
      </ModalDialogContent>

      {/* Semester Details Modal */}
      <ModalDialogContent
        title={`${selectedSemester?.name || ''} ${selectedSemester?.schoolYear || ''}`}
        open={semesterModalOpen}
        handleDialogClose={handleSemesterModalClose}
        customActions={(handleClose) => (
          <>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Close
            </Button>
            {(selectedSemester?.balance ?? 0) > 0 && (
              <Button
                variant="contained"
                startIcon={<Iconify icon={'eva:credit-card-outline' as any} width={18} />}
                sx={{ borderRadius: 1.5, textTransform: 'none' }}
              >
                Pay Balance
              </Button>
            )}
          </>
        )}
        maxWidth={800}
      >
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
                    color: (selectedSemester.balance ?? 0) > 0 ? 'error.main' : 'success.main',
                  }}
                >
                  {formatCurrency(selectedSemester.balance ?? 0)}
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
                    <TableRow sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04) }}>
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
          </>
        )}
      </ModalDialogContent>

      {/* Edit Account Dialog */}
      <ModalDialogContent
        title="Edit Account Details"
        subtitle="Update the account information below. This information will be used for student records."
        open={editDialogOpen}
        handleDialogClose={handleEditDialogClose}
        customActions={(handleClose) => (
          <>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClose}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditDialogSubmit}
              startIcon={<Iconify icon={'eva:save-outline' as any} width={18} />}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Save Changes
            </Button>
          </>
        )}
        maxWidth={500}
      >
        <Stack direction="column" spacing={2.5} sx={{ pb: 1 }}>
          <TextField
            label="Student Name"
            value={accountDetails.name}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Student ID"
            value={accountDetails.studentId}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Course"
            value={accountDetails.course}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Year Level"
            value={accountDetails.yearLevel}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Email"
            value={accountDetails.email}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Contact Number"
            value={accountDetails.contact}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Address"
            value={accountDetails.address}
            fullWidth
            variant="outlined"
            size="small"
            multiline
            rows={2}
          />
        </Stack>
      </ModalDialogContent>
    </Box>
  );
}
