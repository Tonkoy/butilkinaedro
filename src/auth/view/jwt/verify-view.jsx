'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { paths } from 'src/routes/paths';
import { EmailInboxIcon } from 'src/assets/icons';
import { Form, Field } from 'src/components/hook-form';
import { FormHead } from '../../components/form-head';
import { FormResendCode } from '../../components/form-resend-code';
import { FormReturnLink } from '../../components/form-return-link';
import {verifyUser, useGetUser, resendUserActivationCode} from 'src/actions/user';
import { useTranslate}  from 'src/locales'; // adjust path to your actual hook
import { toast } from 'src/components/snackbar';
export const VerifySchema = zod.object({
  code: zod
    .string()
    .min(1, { message: 'Кодът е задължителен!' })
    .min(6, { message: 'Кодът трябва да е поне 6 символа!' }),
  email: zod
    .string()
    .min(1, { message: 'Имейлът е задължителен!' })
    .email({ message: 'Имейлът трябва да е валиден!' }),
});

export function VerifyView() {
  const { t: tAuth } = useTranslate('auth');
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailFromQuery = searchParams.get('email') || '';

  const [errorMsg, setErrorMsg] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);

  const { refreshUser } = useGetUser();

  const methods = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues: { code: '', email: emailFromQuery },
  });

  // If the email query param changes, update the form value
  useEffect(() => {
    if (emailFromQuery) {
      methods.setValue('email', emailFromQuery);
    }
    // eslint-disable-next-line
  }, [emailFromQuery]);

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
    getValues,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMsg(null);
    try {
      const result = await verifyUser(data); // values = { email, code }
      await refreshUser();
      toast.success(tAuth('verify.success') || 'Успешно верифициране!');
      setTimeout(() => {
        router.push(paths.auth.jwt.signIn);
      }, 1000);
    } catch (error) {
      console.log(error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        tAuth('verify.failed') ||
        'Грешка при верификацията';
      setErrorMsg(msg);
      setError('code', { type: 'manual', message: msg });
    }
  });

  const handleResendCode = async () => {

    setErrorMsg(null);
    setResendLoading(true);
    const email = getValues('email');
    if (!email) {
      setResendLoading(false);
      return;
    }
    try {
      const result = await resendUserActivationCode(email);
      if (result) {
        toast.success(tAuth('verify.resendSuccess') || 'Успешно изпратихме кода!');
      }
    } catch(error) {
      setErrorMsg(error.message);
    } finally {
      setResendLoading(false);
    }
  };
  // Use your translation keys or add new ones under "verify"
  // Example:
  // "verify": {
  //   "title": "Моля, проверете имейла си!",
  //   "description": "Изпратихме 6-цифрен код за потвърждение. \nВъведете кода по-долу, за да потвърдите вашия имейл.",
  //   "emailLabel": "Имейл",
  //   "codeLabel": "Код",
  //   "verifyBtn": "Потвърди",
  //   "success": "Вашият имейл беше успешно потвърден!",
  //   "failed": "Грешка при верифицирането.",
  //   "resendSuccess": "Изпратихме нов код на вашия имейл.",
  //   "resendError": "Неуспешно изпращане на кода.",
  //   "emailRequired": "Моля, въведете имейл."
  // }

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label={tAuth('verify.emailLabel') || 'Имейл'}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Code name="code" label={tAuth('verify.codeLabel') || 'Код'} />

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={tAuth('verify.loading') || 'Потвърждаване...'}
      >
        {tAuth('verify.verifyBtn') || 'Потвърди'}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title={tAuth('verify.title') || 'Моля, проверете имейла си!'}
        description={
          tAuth('verify.description') ||
          `Изпратихме 6-цифрен код за потвърждение.\nВъведете кода по-долу, за да потвърдите вашия имейл.`
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormResendCode onResendCode={handleResendCode} value={0} disabled={resendLoading} />

      <FormReturnLink href={paths.auth.jwt.signIn} label={tAuth('common.backToSignIn')}/>
    </>
  );
}
