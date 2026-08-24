import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import AccountLedgerContent from '../../components/contents/account-ledger';

const AccountLedger = () => {
  return (
    <React.Fragment>
      <title>{`Accounts - ${CONFIG.appName}`}</title>
      <DashboardContent>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={
            <Iconify
              icon={'eva:chevron-right-fill' as any}
              width={14}
              sx={{ color: 'text.secondary', mx: 0.5 }}
            />
          }
          sx={{ fontSize: 13, mb: 3, '& a': { color: 'text.secondary' } }}
        >
          <Link
            underline="hover"
            href="/"
            sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}
          >
            <Iconify icon={'eva:home-outline' as any} width={16} sx={{ mr: 0.5 }} />
            Dashboard
          </Link>

          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            Accounts
          </Typography>
        </Breadcrumbs>
        <AccountLedgerContent />
      </DashboardContent>
    </React.Fragment>
  );
};

export default AccountLedger;
