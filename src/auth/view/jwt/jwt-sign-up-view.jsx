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

import { signUp } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';
import {useTranslate} from "../../../locales";
import {toast} from "../../../components/snackbar";

// ----------------------------------------------------------------------

export const SignUpSchema = (tCommon) => zod.object({
  firstName: zod.string().min(1, { message: tCommon('errors.required') }),
  lastName: zod.string().min(1, { message: tCommon('errors.required') }),
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

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();
  const {t: tCommon} = useTranslate('common')
  const {t: tAuth} = useTranslate('auth')

  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'test@gmail.com',
    password: '@test123',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema(tCommon)),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      toast.success(response.data.message);
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Box display="flex" gap={{ xs: 3, sm: 2 }} flexDirection={{ xs: 'column', sm: 'row' }}>
        <Field.Text name="firstName" label={tCommon('forms.firstName')} InputLabelProps={{ shrink: true }} />
        <Field.Text name="lastName" label={tCommon('forms.lastName')} InputLabelProps={{ shrink: true }} />
      </Box>

      <Field.Text name="email" label={tCommon('forms.email')} InputLabelProps={{ shrink: true }} />

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

      <LoadingButton
        fullWidth
        color="inherit"
        si11ze="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={tAuth('login.signInLoading')}
      >
        {tAuth('login.createAccount')}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title={tAuth('login.startFree')}
        description={
          <>
            {tAuth('login.haveAccount')}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              {tAuth('login.goToLogin')}
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <SignUpTerms />
    </>
  );
}
