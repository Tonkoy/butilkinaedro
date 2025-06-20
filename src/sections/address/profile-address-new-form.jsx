import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import {useEffect, useMemo} from "react";
import {useTranslate} from "../../locales";

// ----------------------------------------------------------------------

export const NewAddressSchema = (tProfile) => zod.object({
  name: zod.string().min(1, { message: tProfile('addresses.errors.nameRequired') }),
  addressName: zod.string().min(1, { message: tProfile('addresses.errors.nameRequired') }),
  city: zod.string().min(1, { message: tProfile('addresses.errors.cityRequired') }),
  address: zod.string().min(1, { message: tProfile('addresses.errors.addressRequired') }),
  phoneNumber: schemaHelper.phoneNumber({
    isValidPhoneNumber,
    message: tProfile('addresses.errors.phoneInvalid')
  }),
  primary: zod.boolean(),
  addressType: zod.string(),
});

export function ProfileAddressNewForm({ open, onClose, onCreate, onUpdate, currentAddress = null }) {
  const { t: tProfile } = useTranslate('profile');
  const { t: tCommon } = useTranslate('common');

  const isEditMode = Boolean(currentAddress);

  const defaultValues = useMemo(() => ({
    addressName: '',
    name: '',
    city: '',
    address: '',
    country: null,
    primary: false,
    phoneNumber: '',
    addressType: 'Address',
  }), []);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewAddressSchema(tProfile)),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentAddress) {
      reset({
        addressName: currentAddress.addressName || '',
        name: currentAddress.name || '',
        city: currentAddress.city || '',
        address: currentAddress.address || '',
        country: currentAddress.country || null,
        primary: currentAddress.primary || false,
        phoneNumber: currentAddress.phoneNumber || '',
        addressType: currentAddress.addressType || 'Address',
      });
    } else {
      reset(defaultValues); // 👈 Reset to defaults when creating
    }
  }, [currentAddress, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEditMode) {
        await onUpdate({ ...data, addressId: currentAddress._id });
      } else {
        await onCreate(data);
      }
      onClose();
    } catch (error) {
      console.error('Address form error:', error);
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {isEditMode ? tProfile('addresses.editAddressTitle') : tProfile('addresses.addAddressTitle')}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="addressName" label={tProfile('addresses.addressName')} />
              <Field.Text name="name" label={tProfile('addresses.contactName')} />
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
              <Field.Phone
                country="BG"
                placeholder={tProfile('addresses.phonePlaceholder')}
                name="phoneNumber"
                label={tProfile('addresses.phone')}
              />
              <Field.Text name="city" label={tProfile('addresses.city')} />
            </Box>

            <Field.Text name="address" label={tProfile('addresses.addressField')} />
            <Field.Checkbox name="primary" label={tProfile('addresses.primaryLabel')} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={handleClose}>
            {tCommon('buttons.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {isEditMode ? tCommon('buttons.save') : tCommon('buttons.submit')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
