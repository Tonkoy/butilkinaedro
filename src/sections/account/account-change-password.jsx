import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { changeUserPassword } from 'src/actions/user';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const password = useBoolean();
  const { t: tCommon } = useTranslate('common');
  const { t: tProfile } = useTranslate('profile');

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const ChangePassWordSchema = zod
    .object({
      oldPassword: zod
        .string()
        .min(1, { message: tCommon('errors.required') })
        .min(6, { message: tProfile('password.minLength') }),
      newPassword: zod.string().min(1, { message: tCommon('errors.required') }),
      confirmNewPassword: zod.string().min(1, { message: tCommon('errors.required') }),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
      message: tProfile('password.different'),
      path: ['newPassword'],
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: tProfile('password.mismatch'),
      path: ['confirmNewPassword'],
    });

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };

      await changeUserPassword(payload);

      toast.success(tProfile('password.changeSuccess'));
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || tProfile('password.changeError'));
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
        <Field.Text
          name="oldPassword"
          type={password.value ? 'text' : 'password'}
          label={tProfile('password.oldPassword')}
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
          name="newPassword"
          label={tProfile('password.newPassword')}
          type={password.value ? 'text' : 'password'}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} />
              {tProfile('password.minLength')}
            </Stack>
          }
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
          name="confirmNewPassword"
          type={password.value ? 'text' : 'password'}
          label={tProfile('password.confirmNewPassword')}
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
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ ml: 'auto' }}
        >
          {tProfile('password.save')}
        </LoadingButton>
      </Card>
    </Form>
  );
}
