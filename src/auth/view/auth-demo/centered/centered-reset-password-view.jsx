'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { PasswordIcon } from 'src/assets/icons';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../../components/form-head';
import { FormReturnLink } from '../../../components/form-return-link';
import { toast } from 'src/components/snackbar';
import {requestPasswordResetCode} from "../../../../actions/user";
import {useTranslate} from "src/locales";
// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Имейлът е задължителен!' })
    .email({ message: 'Имейлът трябва да е валиден!' }),
});

// ----------------------------------------------------------------------

export function CenteredResetPasswordView() {
  const defaultValues = { email: '' };
  const { t: tAuth } = useTranslate('auth');

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await requestPasswordResetCode(data.email);
      toast.success(tAuth('reset.success')); // Show toast
    } catch (error) {
      setError('email', { type: 'manual', message: tAuth('reset.error') });
      toast.error(error?.message || tAuth('reset.error')); // Show toast
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label={tAuth('reset.emailLabel')}
        placeholder="example@gmail.com"
        autoFocus
        InputLabelProps={{ shrink: true }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Send request..."
      >
        {tAuth('reset.submitBtn')}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title={tAuth('reset.title')}
        description={tAuth('reset.description')}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormReturnLink href={paths.auth.jwt.signIn} label={tAuth('common.backToSignIn')}/>
    </>
  );
}
