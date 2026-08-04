import { useState, useCallback } from 'react';
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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { alpha } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';

// Mock data - Replace with API data
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: string;
  reference: string;
}

interface AccountSummary {
  totalBalance: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: '2024-01-15',
    description: 'Tuition Fee - 1st Semester',
    amount: -25000,
    status: 'paid',
    reference: 'INV-2024-001',
  },
  {
    id: 2,
    date: '2024-01-15',
    description: 'Miscellaneous Fee',
    amount: -5000,
    status: 'paid',
    reference: 'INV-2024-002',
  },
  {
    id: 3,
    date: '2024-01-20',
    description: 'Payment - Cash',
    amount: 15000,
    status: 'completed',
    reference: 'PAY-2024-001',
  },
  {
    id: 4,
    date: '2024-02-01',
    description: 'Library Fee',
    amount: -2000,
    status: 'pending',
    reference: 'INV-2024-003',
  },
  {
    id: 5,
    date: '2024-02-05',
    description: 'Payment - GCash',
    amount: 10000,
    status: 'completed',
    reference: 'PAY-2024-002',
  },
  {
    id: 6,
    date: '2024-02-10',
    description: 'Laboratory Fee',
    amount: -3000,
    status: 'overdue',
    reference: 'INV-2024-004',
  },
  {
    id: 7,
    date: '2024-02-15',
    description: 'Payment - Bank Transfer',
    amount: 5000,
    status: 'completed',
    reference: 'PAY-2024-003',
  },
  {
    id: 8,
    date: '2024-02-20',
    description: 'Sports Fee',
    amount: -1500,
    status: 'paid',
    reference: 'INV-2024-005',
  },
];

export function AccountContent() {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [transactions] = useState<Transaction[]>(mockTransactions);

  // Calculate summary
  const summary: AccountSummary = transactions.reduce(
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
    { totalBalance: 0, totalPaid: 0, totalPending: 0, totalOverdue: 0 }
  );

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesStatus;
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

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  }, []);

  function getStatusColor(status: string): 'success' | 'warning' | 'error' | 'default' {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
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

  return (
    <Box>
      {/* Summary Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Iconify
              icon={'eva:credit-card-outline' as any}
              width={22}
              sx={{ color: 'primary.main' }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Total Balance
            </Typography>
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {formatCurrency(summary.totalBalance)}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.04),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Iconify
              icon={'eva:checkmark-circle-2-outline' as any}
              width={22}
              sx={{ color: 'success.main' }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Total Paid
            </Typography>
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
            {formatCurrency(summary.totalPaid)}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.warning.main, 0.04),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Iconify icon={'eva:clock-outline' as any} width={22} sx={{ color: 'warning.main' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Pending
            </Typography>
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
            {formatCurrency(summary.totalPending)}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.04),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Iconify
              icon={'eva:alert-triangle-outline' as any}
              width={22}
              sx={{ color: 'error.main' }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Overdue
            </Typography>
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
            {formatCurrency(summary.totalOverdue)}
          </Typography>
        </Paper>
      </Box>

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
                <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        {transaction.reference}
                      </Typography>
                    </TableCell>
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
    </Box>
  );
}
