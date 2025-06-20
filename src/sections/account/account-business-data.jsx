import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { Form, Field } from 'src/components/hook-form';
import { useTranslate } from '../../locales';
import {
  useGetCompany,
  createCompany,
  updateCompany,
} from 'src/actions/company';
import { toast } from 'src/components/snackbar';

export function AccountBusinessData() {
  const { t: tCommon } = useTranslate('common');
  const { t: tProfile } = useTranslate('profile');

  const { company, addressesLoading, refreshCompany } = useGetCompany();

  console.log(company)

  const defaultValues = useMemo(() => ({
    companyName: company?.companyName || '',
    companyTaxId: company?.companyTaxId || '',
    companyAddress: company?.companyAddress || '',
    companyCity: company?.companyCity || '',
    country: company?.country || '',
    vatRegistration: company?.vatRegistration || false,
    vatId: company?.vatId || '',
    companyOwner: company?.companyOwner || '',
  }), [company]);

  const schema = zod.object({
    companyName: zod.string().min(1, { message: `${tProfile('company.companyName')} е задължително поле` }),
    companyTaxId: zod.string().min(1, { message: `${tProfile('company.companyTaxId')} е задължително поле` }),
    companyAddress: zod.string().min(1, { message: `${tProfile('company.companyAddress')} е задължително поле` }),
    companyCity: zod.string().min(1, { message: `${tProfile('company.companyCity')} е задължително поле` }),
    country: zod.string().min(1, { message: `${tProfile('company.country')} е задължително поле` }),
    vatRegistration: zod.boolean(),
    vatId: zod.string().optional().refine((val, ctx) => {
      if (ctx?.parent?.vatRegistration && !val) return false;
      return true;
    }, { message: `${tProfile('company.vatId')} е задължително при регистрация по ДДС` }),
    companyOwner: zod.string().min(1, { message: `${tProfile('company.companyOwner')} е задължително поле` }),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange'
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
    reset
  } = methods;

  useEffect(() => {
    if (company) {
      const newValues = {
        companyName: company.companyName || '',
        companyTaxId: company.companyTaxId || '',
        companyAddress: company.companyAddress || '',
        companyCity: company.companyCity || '',
        country: company.country || '',
        vatRegistration: company.vatRegistration || false,
        vatId: company.vatId || '',
        companyOwner: company.companyOwner || '',
      };

      // Prevent infinite loop by checking if form values actually differ
      const currentValues = methods.getValues();
      const hasChanged = Object.keys(newValues).some(
        (key) => newValues[key] !== currentValues[key]
      );

      if (hasChanged) {
        reset(newValues);
      }
    }
  }, [company, reset, methods]);

  const vatRegistration = watch('vatRegistration');

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (company?._id) {
        await updateCompany({ ...data, companyId: company._id }, refreshCompany);
        toast.success('Update success!');
      } else {
        await createCompany({ ...data }, refreshCompany);
        toast.success('Update error!');
      }
    } catch (error) {
      toast.error('Update error!');
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={3}>
          <Field.Checkbox name="vatRegistration" label={tProfile('company.vatRegistration')} />

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Field.Text name="companyName" label={tProfile('company.companyName')} />
            <Field.Text name="companyTaxId" label={tProfile('company.companyTaxId')} />
          </Box>



          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Field.Text name="companyAddress" label={tProfile('company.companyAddress')} />
            <Field.Text name="companyCity" label={tProfile('company.companyCity')} />
          </Box>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Field.Text name="country" label={tProfile('company.country')} />
            <Field.Text name="companyOwner" label={tProfile('company.companyOwner')} />
          </Box>

          {vatRegistration && (
            <Field.Text name="vatId" label={tProfile('company.vatId')} />
          )}

        </Stack>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting || addressesLoading}
          sx={{ ml: 'auto' }}
        >
          {tCommon('buttons.save')}
        </LoadingButton>
      </Card>
    </Form>
  );
}
