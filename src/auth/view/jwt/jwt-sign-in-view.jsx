'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';
import {useTranslate} from "../../../locales";

// ----------------------------------------------------------------------

export const SignInSchema = (tCommon) => zod.object({
  email: zod
    .string()
    .min(1, { message: tCommon('errors.required') })
    .email({ message: tCommon('errors.emailInvalid') }),
  password: zod
    .string()
    .min(1, { message: tCommon('errors.required') })
    .min(6, { message: tCommon('errors.passwordMinValue') }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const {t: tCommon} = useTranslate('common')
  const {t: tAuth} = useTranslate('auth')
  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const defaultValues = {
    email: 'test@gmail.com',
    password: '@test123',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema(tCommon)),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text name="email" label={tCommon('forms.email')} InputLabelProps={{ shrink: true }} />

      <Box gap={1.5} display="flex" flexDirection="column">
        <Link
          component={RouterLink}
          href={paths.auth.jwt.resetPassword}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          {tCommon('buttons.forgotPassword')} ?
        </Link>

        <Field.Text
          name="password"
          label={tCommon('forms.password')}
          placeholder={tAuth('login.sixCharsMinimum')}
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={tAuth('login.loginLoading')}
      >
        {tAuth('login.login')}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title={tAuth('login.formTitle')}
        description={
          <>
            {tAuth('login.dontHaveAccount')}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              {tAuth('login.goToRegister')}
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        {tAuth('login.use')} <strong>{defaultValues.email}</strong>
        {tAuth('login.withPassword')}
        <strong>{defaultValues.password}</strong>
      </Alert> */}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
