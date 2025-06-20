import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import {useTranslate} from "../../locales";
import {LoadingScreen} from "../../components/loading-screen";
import { toast } from 'src/components/snackbar';
import {useUpdateOrder} from "../../utils/actionHooks";
import {useState} from "react";
import {getOrderStatusColor} from "../../utils/helper";
import {useIsAdmin} from "../../utils/hooks";
// ----------------------------------------------------------------------

export function OrderDetailsToolbar({
  status,
  backLink,
  createdAt,
  orderNumber,
  statusOptions,
  orderId,
}) {
  const popover = usePopover();
  const { t: tOrder } = useTranslate('order');
  const { t: tCommon } = useTranslate('common');
  const isAdmin = useIsAdmin();

  const { updateAndSync } = useUpdateOrder(orderId);

  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;

    try {
      const updated = await updateAndSync({ orderStatus: newStatus });
      setCurrentStatus(updated.orderStatus);

      toast.success(tCommon('notifications.updateSuccess'));
    } catch (err) {
      toast.error(tCommon('notifications.updateError'));
    } finally {
      popover.onClose();
    }
  };

  return (
    <>
      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ mb: { xs: 3, md: 5 } }}>
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> {tOrder('text.order')} {orderNumber} </Typography>
              <Label
                variant="soft"
                color={getOrderStatusColor(currentStatus)}
              >
                {tOrder(`table.${currentStatus}`)}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {isAdmin && <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            {tOrder(`table.${currentStatus}`)}
          </Button>}

          <Button
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            {tCommon('buttons.print')}
          </Button>

          {isAdmin && <Button color="inherit" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>
            {tCommon('buttons.edit')}
          </Button>}
        </Stack>
      </Stack>

      {isAdmin && <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {statusOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentStatus}
              onClick={() => handleStatusChange(option.value)}
            >
              {tOrder(`table.${option.value}`)}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>}
    </>
  );
}
