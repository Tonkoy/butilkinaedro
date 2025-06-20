import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {AddressItem, AddressNewForm, ProfileAddressNewForm} from '../address';
import {useTranslate} from "../../locales";
import { useGetAddresses, createAddress, updateAddress, deleteAddress } from 'src/actions/address';
import Loading from "../../app/loading";
import {LoadingScreen} from "../../components/loading-screen";
import {toast} from "../../components/snackbar";


// ----------------------------------------------------------------------

export function AccountBillingAddress() {

  const {t: tProfile} = useTranslate('profile')
  const {t: tCommon} = useTranslate('common')
  const { addresses, addressesLoading, refreshAddresses } = useGetAddresses();
  const [addressId, setAddressId] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const popover = usePopover();
  const addressForm = useBoolean();

  console.log(selectedAddress)

  const handleAddNewAddress = async (address) => {
    try {
      await createAddress(address, refreshAddresses);
      toast.success(tCommon('notifications.createSuccess'));
      addressForm.onFalse();
    } catch (error) {
      toast.error(tCommon('notifications.createError'));
      console.error(error);
    }
  };

  const handleUpdateAddress = async (address) => {
    try {
      await updateAddress(address._id, address, refreshAddresses);
      toast.success(tCommon('notifications.createSuccess'));
      addressForm.onFalse();
    } catch (error) {
      toast.error(tCommon('notifications.createError'));
      console.error(error);
    }
  };

  const handleSetAsPrimary = async (addressId) => {
    try {
      const address = addresses.find((a) => a._id === addressId);
      if (address) {
        await updateAddress(address._id, { ...address, primary: true }, refreshAddresses);
        toast.success(tCommon('notifications.updateSuccess'));
      }
    } catch (error) {
      toast.error(tCommon('notifications.updateError'));
      console.error(error);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(addressId, refreshAddresses);
      toast.success(tCommon('notifications.deleteSuccess'));
    }
    catch (error) {
        toast.error(tCommon('notifications.deleteError'));
        console.error(error);
      }
  };

  const handleSelectedId = useCallback(
    (event, id) => {
      popover.onOpen(event);
      setAddressId(id);
    },
    [popover]
  );

  const handleClose = useCallback(() => {
    popover.onClose();
    setSelectedAddress(null); // reset form state
  }, [popover]);

  if (addressesLoading) return <LoadingScreen />;

  return (
    <>
      <Card>
        <CardHeader
          title={tProfile('addresses.addressesList')}
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addressForm.onTrue}
            >
              {tProfile('addresses.address')}
            </Button>
          }
        />

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {addresses.map((address) => (
            <AddressItem
              variant="outlined"
              key={address.id}
              address={address}
              action={
                <IconButton
                  onClick={(event) => {
                    handleSelectedId(event, `${address._id}`);
                  }}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              }
              sx={{ p: 2.5, borderRadius: 1 }}
            />
          ))}
        </Stack>
      </Card>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={handleClose}>
        <MenuList>
          <MenuItem
            onClick={() => {
              handleClose();
              handleSetAsPrimary(addressId);
            }}
          >
            <Iconify icon="eva:star-fill" />
            {tProfile('addresses.setAsDefault')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              const addressToEdit = addresses.find(addr => addr._id === addressId);
              setSelectedAddress(addressToEdit);
              addressForm.onTrue();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            {tCommon('buttons.edit')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              handleDelete(addressId);
              refreshAddresses()
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            {tCommon('buttons.delete')}
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ProfileAddressNewForm
        open={addressForm.value}
        onClose={() => {
          addressForm.onFalse()
          setSelectedAddress(null)
        }}
        currentAddress={selectedAddress} // optional
        onCreate={handleAddNewAddress}
        onUpdate={handleUpdateAddress}
      />
    </>
  );
}
