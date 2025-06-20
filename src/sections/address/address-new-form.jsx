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
import Autocomplete from "@mui/material/Autocomplete";
import {useEffect, useState} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { fetcher} from '../../utils/axios';

const options = [
  {
    id: 1,
    label: 'Speedy',
    company: "speedy",
    image: '/assets/logistics/speedy.svg',
  },
  {
    id: 2,
    label: 'Econt',
    company: "econt",
    image: '/assets/logistics/econt.svg',
  },
];

// ----------------------------------------------------------------------

export const NewAddressSchema = zod.object({
  city: zod.string().min(1, { message: 'Града е задължителен!' }),
  name: zod.string().min(1, { message: 'Името е задължително!' }),
  address: zod.string().min(1, { message: 'Адресър е задължителен!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Държавата е задължителна!' },
  }),
  // Not required
  primary: zod.boolean(),
  addressType: zod.string(),
});

export function AddressNewForm({ open, onClose, onCreate }) {
  const [selectedDelivery, setSelectedDelivery] = useState(options[0]);
  const [loadingOffices, setLoadingOffices] = useState(false);
  const [speedyOffices, setSpeedyOffices] = useState([]);
  const [econtOffices, setEcontOffices] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // State for selected tab

  const defaultValues = {
    name: '',
    city: '',
    state: '',
    address: '',
    zipCode: '',
    country: '',
    primary: true,
    phoneNumber: '',
    addressType: 'Address',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {

    try {
      onCreate({
        name: data.name,
        phoneNumber: data.phoneNumber,
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
        addressType: data.addressType,
        primary: data.primary,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  const handleOfficeSelect = (event, selectedOffice) => {
    if (selectedOffice) {
      console.log(selectedOffice)
      methods.setValue('address', selectedOffice.name); // Update the form value
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const fetchSpeedyOffices = async () => {
      setLoadingOffices(true);
      try {
        const response = await fetcher('/api/logistics/speedy?countryId=100');
        setSpeedyOffices(response?.data?.offices || []);
      } catch (error) {
        console.error('Error fetching Speedy offices:', error);
      } finally {
        setLoadingOffices(false);
      }
    };

    const fetchEcontOffices = async () => {
      setLoadingOffices(true);
      try {
        const response = await fetcher('/api/logistics/econt');
        setEcontOffices(response?.data?.offices || []);
      } catch (error) {
        console.error('Error fetching Econt offices:', error);
      } finally {
        setLoadingOffices(false);
      }
    };

    if (selectedDelivery?.company === "speedy" && speedyOffices.length === 0) {
      fetchSpeedyOffices();
    } else if (selectedDelivery?.company === "econt" && econtOffices.length === 0) {
      fetchEcontOffices();
    }
  }, [selectedDelivery]);


  const addressType = watch('addressType');

  const renderDeliveryOption = () => {
    if (loadingOffices) {
      return <Box my={3} sx={{ display: 'flex', justifyContent: "space-around", width: "100%", alignItems: "center" }}><CircularProgress /></Box>;
    }
    return (
      <>
       <Autocomplete
         value={
           selectedDelivery?.company === "speedy"
             ? speedyOffices.find(office => office.name === watch('address')) || null
             : econtOffices.find(office => office.name === watch('address')) || null
         }
          options={selectedDelivery?.company === "speedy" ? speedyOffices : econtOffices}
         getOptionLabel={(option) => (option && option?.name ? option?.name : '')}
          onChange={handleOfficeSelect}
         renderInput={(params) => (
           <Field.Text
             {...params}
             label={`Избери офис ${
               selectedDelivery?.company === 'speedy' ? 'Speedy' : 'Econt'
             }`}
             variant="outlined"
           />
         )}
        />
      </>
    );
  };


  const handleDeliveryOptionClick = (option) => {
    setSelectedDelivery(option);
    setSelectedTab(0); // Reset the tab to the first one
  };



  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Нов адрес</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Field.RadioGroup
              row
              name="addressType"
              options={[
                { label: 'Адрес', value: 'Address' },
                { label: 'Офис на спедитор', value: 'Office' },
              ]}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="name" label="Две имена" />

              <Field.Phone
                country="BG"
                placeholder="Въведете телефон"
                name="phoneNumber"
                label="Телефон" />
            </Box>

            {addressType !== 'Office' && <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="address" label="Адрес" />
              <Field.Text name="city" label="Град" />
            </Box>}


            {addressType === 'Office' && <Box
              columnGap={2}
              rowGap={2.5}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              sx={{ mb: 3, justifyContent: 'center', alignItems: 'center' }}
            >
              {options.map((option) => (
                <OptionItem
                  key={option.label}
                  option={option}
                  selected={selectedDelivery?.id === option.id}
                  onClick={() => handleDeliveryOptionClick(option)}
                />
              ))}
            </Box>}
            {addressType === 'Office' && (speedyOffices.length > 0  || econtOffices.length > 0 ) && renderDeliveryOption()}

            <Field.Checkbox name="primary" label="Използвай адреса като основен." />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Отказ
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Достави до този адрес
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

function OptionItem({ option, selected, onClick }) {
  const { image, label, description, company } = option;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '100%', // Ensure the item takes up the full height
        ...(selected && {
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
        }),
      }}
      onClick={onClick}
    >
      {image && (
        <Box
          component="img"
          src={image}
          alt={label}
          sx={{ width: company === 'brandbeam' ? 40 : 80, height: 'auto' }}
        />
      )}
      <ListItemText
        sx={{ textAlign: 'center', marginTop: '5px' }}
        primary={<Typography variant="body2">{description}</Typography>}
        secondary={null}
      />
    </Paper>
  );
}
