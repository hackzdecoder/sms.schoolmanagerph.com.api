import { createSlice } from '@reduxjs/toolkit';
import {
  getAccountDetails,
  getPaymentHistory,
  getSemesters,
  getTransactions,
  updateAccountDetails,
} from '../../../utilities/hooks/useAccountLedgerApi';

const initialState = {
  accountDetails: {
    isLoading: false,
    status: '',
    values: null as any,
  },
  semesters: {
    isLoading: false,
    status: '',
    values: null as any,
  },
  transactions: {
    isLoading: false,
    status: '',
    values: null as any,
  },
  paymentHistory: {
    isLoading: false,
    status: '',
    values: null as any,
  },
  save: {
    isSaving: false,
  },
};

export const accountLedgerSlice = createSlice({
  name: 'accountLedger',
  initialState,
  reducers: {
    clearAccountResponse: (state) => {
      state.accountDetails.status = '';
    },
    clearSemestersResponse: (state) => {
      state.semesters.status = '';
    },
    clearTransactionsResponse: (state) => {
      state.transactions.status = '';
    },
    clearPaymentHistoryResponse: (state) => {
      state.paymentHistory.status = '';
    },
  },
  extraReducers(builder) {
    builder
      // GET ACCOUNT DETAILS
      .addCase(getAccountDetails.pending, (state) => {
        state.accountDetails.isLoading = true;
        state.accountDetails.status = 'pending';
      })
      .addCase(getAccountDetails.fulfilled, (state, action) => {
        state.accountDetails.isLoading = false;
        state.accountDetails.status = 'success';
        state.accountDetails.values = action.payload;
      })
      .addCase(getAccountDetails.rejected, (state) => {
        state.accountDetails.isLoading = false;
        state.accountDetails.status = 'failed';
        state.accountDetails.values = null;
      })
      // UPDATE ACCOUNT DETAILS
      .addCase(updateAccountDetails.pending, (state) => {
        state.save.isSaving = true;
      })
      .addCase(updateAccountDetails.fulfilled, (state) => {
        state.save.isSaving = false;
      })
      .addCase(updateAccountDetails.rejected, (state) => {
        state.save.isSaving = false;
      })
      // GET SEMESTERS
      .addCase(getSemesters.pending, (state) => {
        state.semesters.isLoading = true;
        state.semesters.status = 'pending';
      })
      .addCase(getSemesters.fulfilled, (state, action) => {
        state.semesters.isLoading = false;
        state.semesters.status = 'success';
        state.semesters.values = action.payload;
      })
      .addCase(getSemesters.rejected, (state) => {
        state.semesters.isLoading = false;
        state.semesters.status = 'failed';
        state.semesters.values = null;
      })
      // GET TRANSACTIONS
      .addCase(getTransactions.pending, (state) => {
        state.transactions.isLoading = true;
        state.transactions.status = 'pending';
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.status = 'success';
        state.transactions.values = action.payload;
      })
      .addCase(getTransactions.rejected, (state) => {
        state.transactions.isLoading = false;
        state.transactions.status = 'failed';
        state.transactions.values = null;
      })
      // GET PAYMENT HISTORY
      .addCase(getPaymentHistory.pending, (state) => {
        state.paymentHistory.isLoading = true;
        state.paymentHistory.status = 'pending';
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistory.isLoading = false;
        state.paymentHistory.status = 'success';
        state.paymentHistory.values = action.payload;
      })
      .addCase(getPaymentHistory.rejected, (state) => {
        state.paymentHistory.isLoading = false;
        state.paymentHistory.status = 'failed';
        state.paymentHistory.values = null;
      });
  },
});

export default accountLedgerSlice.reducer;
