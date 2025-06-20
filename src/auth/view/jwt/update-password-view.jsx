'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { toast } from 'src/components/snackbar';

import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { SentIcon } from 'src/assets/icons';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { FormHead } from '../../components/form-head';
import { FormResendCode } from '../../components/form-resend-code';
import { FormReturnLink } from '../../components/form-return-link';
import { useTranslate } from 'src/locales';
import {
  updatePasswordWithCode,
  resendResetPasswordCode
} from 'src/actions/user';
import {useSearchParams} from "next/navigation";
import {useEffect} from "react";

export const UpdatePasswordSchema = zod
  .object({
    code: zod
      .string()
      .min(1, { message: 'Кодът е задължителен!' })
      .min(6, { message: 'Кодът трябва да е поне 6 символа!' }),
    email: zod
      .string()
      .min(1, { message: 'Имейлът е задължителен!' })
      .email({ message: 'Имейлът трябва да е валиден!' }),
    password: zod
      .string()
      .min(1, { message: 'Паролата е задължителна!' })
      .min(6, { message: 'Паролата трябва да е поне 6 символа!' }),
    confirmPassword: zod.string().min(1, { message: 'Потвърдете паролата!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролите не съвпадат!',
    path: ['confirmPassword'],
  });

export function UpdatePasswordView() {
  const { t: tAuth } = useTranslate('auth');
  const password = useBoolean();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';

  const defaultValues = {
    code: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting },
    setError,
  } = methods;

  useEffect(() => {
    if (emailFromQuery) {
      methods.setValue('email', emailFromQuery);
    }
    // eslint-disable-next-line
  }, [emailFromQuery]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updatePasswordWithCode({
        email: data.email,
        code: data.code,
        password: data.password,
      });
      toast.success(tAuth('updatePassword.success') || 'Паролата е сменена успешно.');
    } catch (error) {
      toast.error(error.message || tAuth('updatePassword.error') || 'Грешка при промяна на паролата.');
      setError('code', { type: 'manual', message: error.message });
    }
  });

  const handleResendCode = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error(tAuth('updatePassword.emailRequired') || 'Моля, въведете имейл.');
      return;
    }
    try {
      await resendResetPasswordCode(email);
      toast.success(tAuth('updatePassword.resendSuccess') || 'Изпратихме нов код на вашия имейл.');
    } catch (error) {
      toast.error(error.message || tAuth('updatePassword.resendError') || 'Грешка при изпращане на кода.');
    }
  };

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label={tAuth('updatePassword.emailLabel') || 'Имейл'}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />
      <Field.Code name="code" label={tAuth('updatePassword.codeLabel') || 'Код'}/>
      <Field.Text
        name="password"
        label={tAuth('updatePassword.passwordLabel') || 'Парола'}
        placeholder={tAuth('updatePassword.passwordPlaceholder') || '6+ символа'}
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
      <Field.Text
        name="confirmPassword"
        label={tAuth('updatePassword.confirmPasswordLabel') || 'Потвърдете новата парола'}
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
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={tAuth('updatePassword.loading') || 'Промяна...'}
      >
        {tAuth('updatePassword.submitBtn') || 'Смени паролата'}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<SentIcon />}
        title={tAuth('updatePassword.title') || 'Успешна заявка!'}
        description={
          tAuth('updatePassword.description') ||
          `Изпратихме 6-цифрен код на имейла ви.\nМоля, въведете кода по-долу, за да смените паролата си.`
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormResendCode onResendCode={handleResendCode} value={0} disabled={isSubmitting} />

      <FormReturnLink href={paths.auth.jwt.signIn} label={tAuth('common.backToSignIn')} />
    </>
  );
}
