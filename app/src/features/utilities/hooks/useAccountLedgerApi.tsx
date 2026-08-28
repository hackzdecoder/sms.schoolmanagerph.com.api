import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../routes/api/config';

export interface UpdateAccountPayload {
  name?: string;
  studentId?: string;
  course?: string;
  yearLevel?: string;
  email?: string;
  contact?: string;
  address?: string;
  status?: string;
  currentSchoolYear?: string;
  currentSemester?: string;
  program?: string;
  college?: string;
}

export const getAccountDetails = createAsyncThunk(
  'accountLedger/getAccountDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/account-ledger/details');
      const data = response.data as any;

      // Map snake_case to camelCase
      const mappedData = {
        status: data.status,
        response: data.response,
        data: {
          name: data.data?.name || '',
          studentId: data.data?.student_id || '',
          course: data.data?.course || '',
          yearLevel: data.data?.year_level || '',
          email: data.data?.email || '',
          contact: data.data?.contact || '',
          address: data.data?.address || '',
          status: data.data?.status || 'Active',
          currentSchoolYear: data.data?.current_school_year || '',
          currentSemester: data.data?.current_semester || '',
          program: data.data?.program || '',
          college: data.data?.college || '',
        },
      };

      return mappedData;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const updateAccountDetails = createAsyncThunk(
  'accountLedger/updateAccountDetails',
  async (payload: UpdateAccountPayload, { rejectWithValue }) => {
    try {
      return rejectWithValue('Update functionality is not available yet.');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const getSemesters = createAsyncThunk(
  'accountLedger/getSemesters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/account-ledger/semesters');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const getTransactions = createAsyncThunk(
  'accountLedger/getTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/account-ledger/transactions');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);

export const getPaymentHistory = createAsyncThunk(
  'accountLedger/getPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/account-ledger/payment-history');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong',
      );
    }
  },
);
