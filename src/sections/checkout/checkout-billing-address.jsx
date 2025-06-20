import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';

import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { AddressItem } from '../address';
import { fetcher } from '../../utils/axios';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { useGetAddresses } from '../../actions/address';
import { useGetUser } from '../../actions/user';
import { Iconify } from 'src/components/iconify';

const deliveryOptions = [
  { id: 'econt', label: 'Econt', image: '/assets/logistics/econt.svg' },
  { id: 'speedy', label: 'Speedy', image: '/assets/logistics/speedy.svg' },
];

const validationSchema = zod.object({
  name: zod.string().min(1, 'Името е задължително!'),
  deliveryType: zod.enum(['address', 'office']),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  address: zod.string().optional(),
  city: zod.string().optional(),
  selectedOffice: zod.object({
    id: zod.union([zod.string(), zod.number()]),
    code: zod.union([zod.string(), zod.number()]).optional(),
    name: zod.string()
  }).optional().nullable()
}).superRefine((data, ctx) => {
  if (data.deliveryType === 'address') {
    if (!data.address?.trim()) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Адресът е задължителен!',
        path: ['address']
      });
    }
    if (!data.city?.trim()) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Градът е задължителен!',
        path: ['city']
      });
    }
  }

  if (data.deliveryType === 'office' && !data.selectedOffice?.id) {
    ctx.addIssue({
      code: zod.ZodIssueCode.custom,
      message: 'Моля, изберете офис!',
      path: ['selectedOffice']
    });
  }
});

export function CheckoutBillingAddress() {
  const checkout = useCheckoutContext();
  const { addresses } = useGetAddresses();

  const [selectedCourier, setSelectedCourier] = useState(
    checkout?.billing?.selectedCourier || deliveryOptions[0]
  );
  const [offices, setOffices] = useState({ speedy: [], econt: [] });
  const [loadingOffices, setLoadingOffices] = useState(false);

  const defaultValues = useMemo(() => ({
    name: checkout?.billing?.name || '',
    phoneNumber: checkout?.billing?.phoneNumber || '',
    address: checkout?.billing?.address || '',
    city: checkout?.billing?.city || '',
    selectedOffice: checkout?.billing?.selectedOffice || null,
    deliveryType: checkout?.billing?.deliveryType || 'address',
  }), [checkout?.billing]);

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(validationSchema),
    defaultValues
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    control,
    clearErrors
  } = methods;

  const deliveryType = watch('deliveryType');

  useEffect(() => {
    if (deliveryType === 'address') {
      setValue('selectedOffice', null);
    } else {
      setValue('address', '');
      setValue('city', '');
    }
  }, [deliveryType, setValue]);

  useEffect(() => {
    if (deliveryType === 'office' && offices[selectedCourier.id].length === 0) {
      setLoadingOffices(true);
      fetcher(`/api/logistics/${selectedCourier?.id}`)
        .then((response) => {
          setOffices((prev) => ({
            ...prev,
            [selectedCourier.id]: response?.data?.offices || [],
          }));
        })
        .catch((error) => {
          console.error(`Error fetching ${selectedCourier.label} offices:`, error);
          setOffices((prev) => ({
            ...prev,
            [selectedCourier.id]: [],
          }));
        })
        .finally(() => setLoadingOffices(false));
    }
  }, [selectedCourier, deliveryType]);

  const handleSelectAddress = (address) => {
    setValue('name', address.name);
    setValue('phoneNumber', address.phoneNumber);
    setValue('address', address.address);
    setValue('city', address.city);
    setValue('deliveryType', 'address');
    clearErrors(['address', 'city']);
  };

  const onSubmit = (data) => {
    const billingDetails = {
      ...data,
      selectedCourier,
    };

    checkout.onCreateBilling(billingDetails);
    checkout.onNextStep();
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <RadioGroup
              row
              value={selectedCourier?.id}
              onChange={(e) => {
                const courier = deliveryOptions.find((opt) => opt.id === e.target.value);
                setSelectedCourier(courier);
                setValue('selectedOffice', null);
              }}
            >
              {deliveryOptions.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={
                    <Box
                      component="img"
                      src={option.image}
                      alt={option.label}
                      sx={{ width: 80, height: 30 }}
                    />
                  }
                />
              ))}
            </RadioGroup>

            <Field.Text
              name="name"
              label="Име и Фамилия"
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <Field.Phone
              country="BG"
              placeholder="Въведете телефон"
              name="phoneNumber"
              label="Телефон"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />

            <RadioGroup
              row
              value={deliveryType}
              onChange={(e) => setValue('deliveryType', e.target.value)}
            >
              <FormControlLabel value="office" control={<Radio />} label="До офис" />
              <FormControlLabel value="address" control={<Radio />} label="До адрес" />
            </RadioGroup>

            {deliveryType === 'address' && (
              <>
                <Field.Text
                  name="address"
                  label="Адрес"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
                <Field.Text
                  name="city"
                  label="Град"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </>
            )}

            {deliveryType === 'office' && (
              <Controller
                name="selectedOffice"
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    {...field}
                    options={offices[selectedCourier?.id] || []}
                    getOptionLabel={(option) => option?.name || ''}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    loading={loadingOffices}
                    onChange={(_, newValue) => {
                      return field.onChange(newValue)
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Избери офис"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        required
                      />
                    )}
                  />
                )}
              />
            )}
          </Stack>

          {deliveryType === 'address' && addresses.length > 0 && (
            addresses.map((address) => (
              <AddressItem
                key={address.id}
                address={address}
                action={
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleSelectAddress(address)}
                  >
                    Избери този адрес
                  </Button>
                }
                sx={{
                  p: 3,
                  my: 3,
                  borderRadius: 2,
                  boxShadow: (theme) => theme.customShadows.card,
                }}
              />
            ))
          )}

          <Stack direction="row" justifyContent="space-between" mt={3}>
            <Button
              size="small"
              color="inherit"
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Назад
            </Button>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={checkout.total}
            subtotal={checkout.subtotal}
            discount={checkout.discount}
          />
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disabled={!isValid}
          >
            Напред
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
}
