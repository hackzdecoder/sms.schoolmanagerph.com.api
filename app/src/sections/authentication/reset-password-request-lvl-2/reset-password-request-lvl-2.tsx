import { useState, useCallback } from 'react';
import { Box, Link, Button, TextField, Typography, Dialog } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import api from 'src/routes/api/config';
import { Logo } from 'src/components/logo';

interface Errors {
  username?: string;
  school_code?: string;
}

export function ResetPasswordRequestLvlTwoView() {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [schoolCode, setSchoolCode] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);

  // Validate all fields
  const validateAllFields = useCallback((): Errors => {
    const newErrors: Errors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!schoolCode.trim()) newErrors.school_code = 'School code is required';
    setErrors(newErrors);
    return newErrors;
  }, [username, schoolCode]);

  // Validate a single field
  const validateField = useCallback(
    (name: string, value: string): void => {
      const newErrors = { ...errors };
      if (name === 'username') {
        if (!value.trim()) newErrors.username = 'Username is required';
        else delete newErrors.username;
      }
      if (name === 'school_code') {
        if (!value.trim()) newErrors.school_code = 'School code is required';
        else delete newErrors.school_code;
      }
      setErrors(newErrors);
    },
    [errors]
  );

  // Handle reset password assistance request
  const handleRequestAssistance = useCallback((): void => {
    setTouched({ username: true, school_code: true });

    const validationErrors = validateAllFields();
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    api
      .post('/reset-password-request-lvl-two', {
        username: username.trim(),
        school_code: schoolCode.trim().toUpperCase(),
      })
      .then((res: any) => {
        setSuccessMessage(
          res.data?.message || 'Your request for password reset assistance was sent successfully.'
        );
        setOpenSuccessDialog(true);
        setLoading(false);
      })
      .catch((err: any) => {
        // If server indicates redirect to login
        if (err.response?.data?.redirect_login) {
          router.push('/login');
          return;
        }

        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ username: err.response?.data?.message || 'An error occurred' });
        }
        setLoading(false);
      });
  }, [username, schoolCode, validateAllFields, router]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleRequestAssistance();
      }
    },
    [handleRequestAssistance]
  );

  // Handle input change
  const handleFieldChange = useCallback(
    (field: string) =>
      (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        if (field === 'username') setUsername(value);
        if (field === 'school_code') setSchoolCode(value.toUpperCase());
        if (touched[field]) validateField(field, value);
      },
    [touched, validateField]
  );

  // Handle input blur
  const handleFieldBlur = useCallback(
    (field: string) => (): void => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const value = field === 'username' ? username : schoolCode;
      validateField(field, value);
    },
    [username, schoolCode, validateField]
  );

  // Dialog OK handler
  const handleDialogOk = useCallback((): void => {
    setOpenSuccessDialog(false);
    router.push('/login');
  }, [router]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f4f6f8',
        px: { xs: 1, sm: 0 },
        py: { xs: 1, sm: 1 },
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Scrollable container wrapper */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            bgcolor: '#fff',
            p: { xs: 3, sm: 5 },
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            width: '100%',
            maxWidth: { xs: 'calc(100vw - 32px)', sm: 420 },
            mx: 'auto',
            my: 'auto',
          }}
        >
          {/* Logo + Title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { xs: 3, sm: 4 },
            }}
          >
            <Logo sx={{ alignItems: 'center', justifyContent: 'center' }} />
          </Box>

          {/* Form Title */}
          <Typography
            variant="h5"
            sx={{
              mb: { xs: 2.5, sm: 3.5 },
              fontWeight: 600,
              textAlign: 'center',
              color: 'text.primary',
              fontSize: { xs: '1rem', sm: '1.1rem' },
            }}
          >
            Reset Password Assistance
          </Typography>

          {/* Form */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
            <TextField
              fullWidth
              label={touched.username && errors.username ? errors.username : 'Username'}
              value={username}
              onChange={handleFieldChange('username')}
              onBlur={handleFieldBlur('username')}
              onKeyPress={handleKeyPress}
              error={touched.username && !!errors.username}
              disabled={loading}
              size="medium"
            />

            <TextField
              fullWidth
              label={touched.school_code && errors.school_code ? errors.school_code : 'School Code'}
              value={schoolCode}
              onChange={handleFieldChange('school_code')}
              onBlur={handleFieldBlur('school_code')}
              onKeyPress={handleKeyPress}
              error={touched.school_code && !!errors.school_code}
              disabled={loading}
              size="medium"
              placeholder="Enter your school code"
              helperText="Enter the school code associated with your account"
              slotProps={{
                input: {
                  sx: {
                    '& input': {
                      textTransform: 'uppercase',
                    },
                  },
                },
              }}
            />

            {successMessage && (
              <Typography variant="body2" color="success.main" sx={{ textAlign: 'center', mt: 1 }}>
                {successMessage}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 1.5, py: 1.5, fontWeight: 600, borderRadius: 1.5 }}
              onClick={handleRequestAssistance}
              disabled={loading || !username.trim() || !schoolCode.trim()}
            >
              {loading ? 'REQUESTING...' : 'REQUEST ASSISTANCE'}
            </Button>

            {/* Back Link */}
            <Box sx={{ textAlign: 'center', mt: 1.5 }}>
              <Link
                variant="body2"
                color="text.secondary"
                sx={{
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: { xs: '0.82rem', sm: '0.875rem' },
                  '&:hover': { color: 'primary.main' },
                  ...(loading && { pointerEvents: 'none', opacity: 0.5 }),
                }}
                onClick={() => !loading && router.push('/reset-options')}
              >
                Return to Password Reset Options
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* SUCCESS DIALOG */}
      <Dialog
        open={openSuccessDialog}
        onClose={() => {}}
        disableEscapeKeyDown
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 3,
              width: 340,
              textAlign: 'center',
              boxShadow: '0 8px 28px rgba(17, 24, 39, 0.12)',
            },
          },
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              backgroundColor: 'success.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Request Sent!
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {successMessage || 'Our team will contact you shortly for password reset assistance.'}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{
              py: 1.1,
              borderRadius: 2,
              fontWeight: 600,
            }}
            onClick={handleDialogOk}
          >
            OK
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
