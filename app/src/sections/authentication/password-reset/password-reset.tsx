import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
  Dialog,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import api from 'src/routes/api/config';
import { Logo } from 'src/components/logo';

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  redirect_url?: string;
  redirect?: string;
}

interface ValidateLinkResponse {
  success: boolean;
  valid: boolean;
  message?: string;
  data?: {
    reset_token_expires_at?: string;
    fullname?: string;
  };
}

export function PasswordResetView() {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [schoolCode, setSchoolCode] = useState<string>(''); // ✅ Added
  const [fullname, setFullname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [linkExpiredDialogOpen, setLinkExpiredDialogOpen] = useState<boolean>(false);
  const [linkErrorMessage, setLinkErrorMessage] = useState<string>('');
  const [tokenExpiryTime, setTokenExpiryTime] = useState<Date | null>(null);
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [resetLevel, setResetLevel] = useState<number>(1);

  // Extract all query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const tokenParam = queryParams.get('token') || '';
  const usernameParam = queryParams.get('username') || '';
  const levelParam = queryParams.get('level') || '1';
  const schoolCodeParam = queryParams.get('school_code') || ''; // ✅ Added

  const storageKey = `reset_timer_${usernameParam}_${tokenParam}`;

  // Safety check for external redirects
  useEffect(() => {
    const checkForExternalRedirects = () => {
      const currentUrl = window.location.href;
      if (
        currentUrl.includes('google.com') ||
        currentUrl.includes('http://') ||
        currentUrl.includes('https://')
      ) {
        if (!currentUrl.includes(window.location.origin)) {
          console.warn('Blocked external redirect to:', currentUrl);
          router.push('/login');
          return true;
        }
      }
      return false;
    };

    if (checkForExternalRedirects()) {
      return undefined;
    }

    const interval = setInterval(() => {
      checkForExternalRedirects();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  const parseMySQLDateTime = useCallback((mysqlDateTime: string): Date => {
    const isoString = mysqlDateTime.replace(' ', 'T');
    return new Date(isoString);
  }, []);

  const calculateRemainingSeconds = useCallback((expiryTime: Date | null): number => {
    if (!expiryTime) return 0;
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / 1000));
  }, []);

  const formatTime = useCallback(
    (seconds: number): string => {
      if (seconds <= 0) return 'Expired';

      if (resetLevel === 2) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
      }

      const minutes = Math.floor(seconds / 60);
      const remainingSecs = seconds % 60;

      if (minutes > 0) {
        return `${minutes}m ${remainingSecs}s`;
      }
      return `${seconds}s`;
    },
    [resetLevel]
  );

  const saveTimerState = useCallback(
    (seconds: number, expiryTime: Date | null) => {
      if (!tokenParam || !usernameParam) return;

      const timerData = {
        remainingSeconds: seconds,
        expiryTime: expiryTime?.toISOString(),
        lastUpdated: new Date().toISOString(),
        resetLevel: parseInt(levelParam) || 1,
        schoolCode: schoolCodeParam, // ✅ Save schoolCode
      };

      localStorage.setItem(storageKey, JSON.stringify(timerData));
    },
    [tokenParam, usernameParam, levelParam, storageKey, schoolCodeParam]
  );

  const loadTimerState = useCallback((): {
    remainingSeconds: number;
    expiryTime: string | null;
    lastUpdated: string;
    resetLevel: number;
    schoolCode?: string;
  } | null => {
    if (!tokenParam || !usernameParam) return null;

    const savedData = localStorage.getItem(storageKey);
    if (!savedData) return null;

    try {
      const parsedData = JSON.parse(savedData);
      const currentLevel = parseInt(levelParam) || 1;
      if (parsedData.resetLevel !== currentLevel) {
        localStorage.removeItem(storageKey);
        return null;
      }
      return parsedData;
    } catch {
      localStorage.removeItem(storageKey);
      return null;
    }
  }, [tokenParam, usernameParam, levelParam, storageKey]);

  const clearTimerState = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (!tokenExpiryTime || tokenExpired || remainingSeconds <= 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        const newSeconds = prev - 1;
        saveTimerState(newSeconds, tokenExpiryTime);

        if (newSeconds <= 0) {
          clearInterval(interval);
          setTokenExpired(true);
          setLinkErrorMessage('This password reset link has expired. Please request a new one.');
          setLinkExpiredDialogOpen(true);
          clearTimerState();
          return 0;
        }
        return newSeconds;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [tokenExpiryTime, tokenExpired, remainingSeconds, saveTimerState, clearTimerState]);

  useEffect(() => {
    if (!tokenParam || !usernameParam) {
      setLinkErrorMessage('Invalid or missing link parameters.');
      setLinkExpiredDialogOpen(true);
      setIsValidating(false);
      return;
    }

    const validateLink = async () => {
      try {
        setIsValidating(true);

        const savedState = loadTimerState();

        if (savedState) {
          const savedExpiryTime = savedState.expiryTime ? new Date(savedState.expiryTime) : null;
          const now = new Date();
          const lastUpdated = new Date(savedState.lastUpdated);
          const timeSinceLastUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);

          const calculatedRemainingSeconds = Math.max(
            0,
            savedState.remainingSeconds - timeSinceLastUpdate
          );

          if (calculatedRemainingSeconds > 0) {
            const currentLevel = parseInt(levelParam) || 1;
            setUsername(usernameParam);
            setSchoolCode(savedState.schoolCode || schoolCodeParam || ''); // ✅ Set schoolCode

            const savedFullname = localStorage.getItem(`fullname_${usernameParam}_${tokenParam}`);
            setFullname(savedFullname || usernameParam);

            setResetLevel(currentLevel);
            setTokenExpiryTime(savedExpiryTime);
            setRemainingSeconds(calculatedRemainingSeconds);
            setIsValidating(false);
            return;
          } else {
            clearTimerState();
          }
        }

        // ✅ Send school_code in validation request
        const res = await api.get<ValidateLinkResponse>('/validate-reset-link', {
          params: {
            username: usernameParam,
            token: tokenParam,
            school_code: schoolCodeParam || undefined,
          },
        });

        if (!res.data.valid || !res.data.success) {
          setLinkExpiredDialogOpen(true);
          setLinkErrorMessage(res.data.message || 'This link has expired or is invalid.');
          setTokenExpired(true);
          clearTimerState();
        } else {
          const currentLevel = parseInt(levelParam) || 1;
          setUsername(usernameParam);
          setSchoolCode(schoolCodeParam); // ✅ Set schoolCode

          if (res.data.data?.fullname) {
            setFullname(res.data.data.fullname);
            localStorage.setItem(`fullname_${usernameParam}_${tokenParam}`, res.data.data.fullname);
          } else {
            setFullname(usernameParam);
            localStorage.setItem(`fullname_${usernameParam}_${tokenParam}`, usernameParam);
          }

          setResetLevel(currentLevel);

          if (res.data.data?.reset_token_expires_at) {
            const expiry = parseMySQLDateTime(res.data.data.reset_token_expires_at);
            setTokenExpiryTime(expiry);

            const initialSeconds = calculateRemainingSeconds(expiry);
            setRemainingSeconds(initialSeconds);
            saveTimerState(initialSeconds, expiry);

            if (initialSeconds <= 0) {
              setTokenExpired(true);
              setLinkErrorMessage(
                'This password reset link has expired. Please request a new one.'
              );
              setLinkExpiredDialogOpen(true);
              clearTimerState();
            }
          } else {
            if (currentLevel === 2) {
              const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
              setTokenExpiryTime(expiry);
              const initialSeconds = 24 * 60 * 60;
              setRemainingSeconds(initialSeconds);
              saveTimerState(initialSeconds, expiry);
            } else {
              const expiry = new Date(Date.now() + 5 * 60 * 1000);
              setTokenExpiryTime(expiry);
              const initialSeconds = 5 * 60;
              setRemainingSeconds(initialSeconds);
              saveTimerState(initialSeconds, expiry);
            }
          }
        }
      } catch (err: any) {
        setLinkExpiredDialogOpen(true);
        if (err.response?.status === 410) {
          setLinkErrorMessage('This password reset link has expired. Please request a new one.');
          setTokenExpired(true);
          const currentLevel = parseInt(levelParam) || 1;
          if (currentLevel === 2) {
            setResetLevel(2);
          }
        } else if (err.response?.status === 401) {
          setLinkErrorMessage('Invalid reset token.');
          setTokenExpired(true);
          const currentLevel = parseInt(levelParam) || 1;
          if (currentLevel === 2) {
            setResetLevel(2);
          }
        } else {
          setLinkErrorMessage(
            err?.response?.data?.message || 'This link has expired or is invalid.'
          );
          setTokenExpired(true);
          const currentLevel = parseInt(levelParam) || 1;
          if (currentLevel === 2) {
            setResetLevel(2);
          }
        }
        clearTimerState();
      } finally {
        setIsValidating(false);
      }
    };

    validateLink();
  }, [
    tokenParam,
    usernameParam,
    levelParam,
    schoolCodeParam,
    parseMySQLDateTime,
    calculateRemainingSeconds,
    loadTimerState,
    saveTimerState,
    clearTimerState,
  ]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (tokenExpired) {
        clearTimerState();
      }
    },
    [tokenExpired, clearTimerState]
  );

  const validateAllFields = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return newErrors;
  }, [username, password, confirmPassword]);

  const validateField = useCallback(
    (field: string, value: string) => {
      const newErrors = { ...errors };

      if (field === 'password') {
        if (!value) newErrors.password = 'Password is required';
        else if (value.length < 8) newErrors.password = 'Password must be at least 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
        } else {
          delete newErrors.password;
        }
      }

      if (field === 'confirmPassword') {
        if (!value) newErrors.confirmPassword = 'Please confirm your password';
        else if (value !== password) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
      }

      setErrors(newErrors);
    },
    [errors, password]
  );

  const handleReset = useCallback(async () => {
    if (tokenExpired) {
      setLinkExpiredDialogOpen(true);
      return;
    }

    setTouched({ password: true, confirmPassword: true });
    const validationErrors = validateAllFields();
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    setErrors({});
    try {
      const payload = {
        username,
        token: tokenParam,
        new_password: password,
        new_password_confirmation: confirmPassword,
        password_update_by: parseInt(levelParam) || 1,
        school_code: schoolCode, // ✅ Send school_code
      };

      const res = await api.post<ResetPasswordResponse>('/reset-password-update', payload);

      if (res.data.success) {
        setTokenExpired(true);
        setRemainingSeconds(0);
        clearTimerState();

        setPassword('');
        setConfirmPassword('');
        localStorage.removeItem(`fullname_${usernameParam}_${tokenParam}`);

        const isLevelTwo = parseInt(levelParam) === 2;
        const hasGoogleRedirect = res.data.redirect_url === 'https://www.google.com/';

        if (isLevelTwo && hasGoogleRedirect) {
          setSuccessDialogOpen(true);

          setTimeout(() => {
            setSuccessDialogOpen(false);
            if (res.data.redirect_url === 'https://www.google.com/') {
              window.location.href = 'https://www.google.com/';
            } else {
              router.push('/login');
            }
          }, 3000);
        } else {
          setSuccessDialogOpen(true);
        }
      } else {
        setErrors({ submit: res.data.message || 'Failed to reset password.' });
      }
    } catch (error: any) {
      if (error.response?.status === 410) {
        setTokenExpired(true);
        setRemainingSeconds(0);
        setLinkErrorMessage(
          'This password reset link has already been used. Please request a new one.'
        );
        setLinkExpiredDialogOpen(true);
        clearTimerState();
        localStorage.removeItem(`fullname_${usernameParam}_${tokenParam}`);

        if (parseInt(levelParam) === 2) {
          setResetLevel(2);
        }
      } else if (error.response?.status === 401) {
        setErrors({ submit: 'Invalid reset token.' });
      } else if (error.response?.status === 422) {
        setErrors({ submit: error.response?.data?.message || 'Validation failed.' });
      } else {
        setErrors({ submit: error.response?.data?.message || 'Failed to reset password.' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    username,
    password,
    confirmPassword,
    tokenParam,
    validateAllFields,
    tokenExpired,
    levelParam,
    clearTimerState,
    router,
    usernameParam,
    schoolCode, // ✅ Added to dependencies
  ]);

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false);
    setTokenExpired(true);
    setRemainingSeconds(0);
    clearTimerState();

    localStorage.removeItem(`fullname_${usernameParam}_${tokenParam}`);

    const isLevelTwo = parseInt(levelParam) === 2;

    if (isLevelTwo) {
      window.location.href = 'https://www.google.com/';
    } else {
      router.push('/login');
    }
  };

  const handleLinkExpiredClose = () => {
    setLinkExpiredDialogOpen(false);

    localStorage.removeItem(`fullname_${usernameParam}_${tokenParam}`);

    if (resetLevel === 2) {
      window.location.href = 'https://www.google.com/';
    } else {
      router.push('/reset-options');
    }
  };

  const handleFieldChange = useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (field === 'password') setPassword(value);
      if (field === 'confirmPassword') setConfirmPassword(value);
      if (touched[field]) validateField(field, value);
    },
    [touched, validateField]
  );

  const handleFieldBlur = useCallback(
    (field: string) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const value = field === 'password' ? password : confirmPassword;
      validateField(field, value);
    },
    [password, confirmPassword, validateField]
  );

  if (isValidating) {
    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f4f6f8',
        }}
      >
        <Box
          sx={{
            bgcolor: '#fff',
            p: 4,
            borderRadius: 3,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Validating Link...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we verify your reset link.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          bgcolor: '#f4f6f8',
          px: { xs: 1, sm: 0 },
          pt: { xs: 5, sm: 4 },
          pb: { xs: 1, sm: 4 },
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            pt: { xs: 2, sm: 0 },
            pb: { xs: 2, sm: 0 },
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
              my: { xs: 2, sm: 'auto' },
              flexShrink: 0,
              opacity: tokenExpired ? 0.6 : 1,
            }}
          >
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

            <Typography
              variant="h5"
              sx={{
                mb: { xs: 2.5, sm: 3.5 },
                fontWeight: 600,
                textAlign: 'center',
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              Reset Password
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 2.5 } }}>
              <TextField
                fullWidth
                label="Fullname"
                value={fullname}
                disabled
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000',
                    backgroundColor: '#f5f5f5',
                  },
                }}
              />

              <TextField
                fullWidth
                label={touched.password && errors.password ? errors.password : 'New Password'}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleFieldChange('password')}
                onBlur={handleFieldBlur('password')}
                error={touched.password && !!errors.password}
                disabled={isLoading || tokenExpired}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        size="small"
                        edge="end"
                        disabled={isLoading || tokenExpired}
                      >
                        <Iconify
                          icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          width={20}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : 'Confirm New Password'
                }
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleFieldChange('confirmPassword')}
                onBlur={handleFieldBlur('confirmPassword')}
                error={touched.confirmPassword && !!errors.confirmPassword}
                disabled={isLoading || tokenExpired}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        size="small"
                        edge="end"
                        disabled={isLoading || tokenExpired}
                      >
                        <Iconify
                          icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          width={20}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {!tokenExpired && tokenExpiryTime && remainingSeconds > 0 && (
                <Box
                  sx={{
                    mb: 2,
                    textAlign: 'center',
                    p: 1.5,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {resetLevel === 1 ? 'Reset link expires in:' : 'Admin reset link expires in:'}{' '}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color:
                          remainingSeconds <= 0
                            ? 'error.main'
                            : resetLevel === 1 && remainingSeconds < 60
                              ? 'warning.dark'
                              : resetLevel === 2 && remainingSeconds < 3600
                                ? 'warning.dark'
                                : 'info.dark',
                      }}
                    >
                      {formatTime(remainingSeconds)}
                    </Typography>
                  </Typography>

                  {resetLevel === 2 && remainingSeconds > 3600 && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                    >
                      (Valid for 24 hours from request)
                    </Typography>
                  )}
                </Box>
              )}

              {errors.submit && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ display: 'block', textAlign: 'center', mt: -1 }}
                >
                  {errors.submit}
                </Typography>
              )}

              {tokenExpired && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ display: 'block', textAlign: 'center', mb: 2 }}
                >
                  Reset link has expired. Please request a new one.
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleReset}
                disabled={isLoading || tokenExpired}
                sx={{
                  mt: 1.5,
                  py: 1.3,
                  fontWeight: 600,
                  borderRadius: 1.8,
                  textTransform: 'none',
                  boxShadow: 'none',
                }}
              >
                {isLoading ? 'RESETTING...' : 'SUBMIT'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={successDialogOpen}
        onClose={() => {}}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            width: 340,
            textAlign: 'center',
            boxShadow: '0 8px 28px rgba(17, 24, 39, 0.12)',
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
            Success!
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {resetLevel === 1
              ? 'You have successfully reset/change your password.'
              : 'Password Reset was successful, please give the new password to the user who requested the reset.'}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1.1, borderRadius: 2, fontWeight: 600 }}
            onClick={handleSuccessClose}
          >
            OK
          </Button>
        </Box>
      </Dialog>

      <Dialog
        open={linkExpiredDialogOpen}
        onClose={() => {}}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            width: 340,
            textAlign: 'center',
            boxShadow: '0 8px 28px rgba(17, 24, 39, 0.12)',
          },
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              backgroundColor: 'error.light',
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Link Expired
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {linkErrorMessage}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1.1, borderRadius: 2, fontWeight: 600 }}
            onClick={handleLinkExpiredClose}
          >
            Close
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
