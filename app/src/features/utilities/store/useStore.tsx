import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import accountLedgerSlice from '../../components/contents/account-ledger/slice';

export const store = configureStore({
  reducer: {
    accountLedger: accountLedgerSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
