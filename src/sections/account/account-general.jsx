import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import {useEffect} from "react";
import {useTranslate} from "../../locales";
import { useGetUser, updateUser } from 'src/actions/user';
import Loading from "../../app/loading";

// ----------------------------------------------------------------------

export const getUpdateUserSchema = (tCommon) => zod.object({
  firstName: zod.string().min(1, { message: tCommon('errors.required') }),
  lastName: zod.string().min(1, { message: tCommon('errors.required') }),
  email: zod
    .string()
    .min(1, { message: tCommon('errors.required') })
    .email({ message: tCommon('errors.emailInvalid') }),
  phoneNumber: schemaHelper.phoneNumber({
    isValidPhoneNumber,
    message: tCommon('errors.phoneInvalid') // You can also translate phone validation if schemaHelper allows
  }),
});

export function AccountGeneral() {
  const { user, userLoading, refreshUser } = useGetUser();

  const {t: tProfile} = useTranslate('profile')
  const {t: tCommon} = useTranslate('common')


  const methods = useForm({
    resolver: zodResolver(getUpdateUserSchema(tCommon)),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateUser(data, refreshUser);
      toast.success(tCommon('notifications.updateSuccess'));
    } catch (error) {
      toast.error(tCommon('notifications.updateError'));
      console.error(error);
    }
  });

  if(userLoading) {
    return <Loading />;
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>

        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="firstName" label={tProfile('general.firstName')} />
              <Field.Text name="lastName" label={tProfile('general.lastName')} />
              <Field.Text name="email" label={tProfile('general.email')} />
              <Field.Phone country="BG" name="phoneNumber" label={tProfile('general.phone')} placeholder={tProfile('general.phonePlaceholder')} />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {tCommon('buttons.save')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
