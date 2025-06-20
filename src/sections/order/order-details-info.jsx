import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import {useTranslate} from "../../locales";
import {toast} from "sonner";
import {Label} from "../../components/label";
import {buildEcontByOfficePayload, getPaymentTypeIcon} from "../../utils/helper";
import {usePopover} from "../../components/custom-popover";
import {PaymentTypePopover} from "./payment-popover";
import {PaymentStatusPopover} from "./payment-status-popover";
import {useUpdateOrder} from "../../utils/actionHooks";
import {useState} from "react";
import {createInvoiceFromOrder} from "../../actions/invoices";
import {useIsAdmin} from "../../utils/hooks";
import {updateOrder} from "../../actions/order";
import Link from "next/link";

// ----------------------------------------------------------------------

export function OrderDetailsInfo({orderId, customer, delivery, payment, orderItems, invoice, totalAmount }) {
  const { t: tCommon } = useTranslate('common');
  const isAdmin = useIsAdmin();

  const [paymentStatus, setPaymentStatus] = useState(payment?.paymentStatus);
  const [paymentType, setPaymentType] = useState(payment?.paymentType);

  const paymentPopover = usePopover();
  const paymentStatusPopover = usePopover();
  const { updateAndSync } = useUpdateOrder(orderId);

  const handleChangePaymentType = async (newType) => {
    try {
      const updated = await updateAndSync({ paymentType: newType });
      setPaymentType(updated.paymentType);
      toast.success(tCommon('notifications.updateSuccess'));
      paymentPopover.onClose();
    } catch {
      toast.error(tCommon('notifications.updateError'));
    }
  };

  const handleChangePaymentStatus = async (isPaid) => {
    try {
      const updated = await updateAndSync({ paymentStatus: isPaid });
      setPaymentStatus(updated.paymentStatus);
      toast.success(tCommon('notifications.updateSuccess'));
      paymentStatusPopover.onClose();
    } catch {
      toast.error(tCommon('notifications.updateError'));
    }
  };


  const handleGenerateTracking = async () => {
    try {
      const orderData = {
        recipient: customer?.name,
        phoneNumber: delivery?.phoneNumber,
        fullAddress: delivery?.address,
        items: orderItems || [],
        totalItems: delivery?.totalItems || 1,
        totalAmount: totalAmount,
        shippingOfficeId: delivery?.tracking?.shippingOffice?.code
      };

      const payload = buildEcontByOfficePayload(orderData);

      const res = await fetch('/api/logistics/econtTracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        const newOrderData = {
          tracking: {
            ...delivery.tracking,
            trackingNumber: result?.data?.label?.shipmentNumber,
            trackingUrl: result?.data?.label?.pdfURL,
          }};
        await updateOrder(orderId, newOrderData);
        toast.success('Успешно създадена товарителница');
      } else {
        toast.error(result.error.innerErrors[0].message);
      }
    } catch (error) {
      console.error('Tracking generation error:', error);
      toast.error('Tracking generation error:', error);
    }
  };

  const generateInvoice = async () => {
    try {
      const result = await createInvoiceFromOrder(orderId)
      if (result.success) {
        toast.success('Успешно създадена фактура');
      } else {
        toast.error(result?.error?.innerErrors[0].message);
      }
    } catch (error) {
      console.error('Грешка при създаването на фактура:', error);
      toast.error(error.message);
    }
  }



  const renderCustomer = (
    <>
      <CardHeader
        title={tCommon('text.customerInfo')}
        action={
          isAdmin && <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer?.name}
          src={customer?.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer?.name}</Typography>
          <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>

          {/*
          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            Add to Blacklist
          </Button> */}
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader
        title={tCommon('text.delivery')}
        action={
          isAdmin && <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {tCommon('text.shippingCompany')}
          </Box>
          {delivery?.tracking?.shippingCompany}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {tCommon('text.shippingStatus')}
          </Box>
          {delivery?.tracking?.shippingStatus ? tCommon('text.sent') : tCommon('text.notSent')}
        </Stack>
        {/*<Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {tCommon('text.trackingNumber')}
          </Box>
          {delivery?.tracking?.trackingNumber || "-"}
        </Stack>*/}

        <Stack direction="row" alignItems="center">
          {
            delivery?.tracking?.trackingNumber ? (
              <>
                <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                  {tCommon('text.trackingNumber')}
                </Box>
                <Link underline="always" color="inherit" href={delivery?.tracking?.trackingUrl || '#'} target="_blank">
                  {delivery?.tracking?.trackingNumber || '-'}
                </Link>
              </>
            ) : (
              isAdmin ? <Button color="inherit" variant="contained" onClick={handleGenerateTracking}>
                {tCommon('buttons.generateTracking')}
              </Button> : null
            )
          }
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader
        title={tCommon('text.personalDetails')}
        action={
          isAdmin && <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {tCommon('text.receiver')}
          </Box>
          {customer?.name}
        </Stack>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {tCommon('text.address')}
          </Box>
          {delivery?.address}
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {tCommon('text.phone')}
          </Box>
          {delivery?.phoneNumber}
        </Stack>
      </Stack>
    </>
  );

  const renderPayment = (
    <>
      <CardHeader title={tCommon('text.payment')} />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {tCommon('text.paymentStatus')}:
          </Box>
          <Label
            sx={{flex: 1}}
            variant="soft"
            color={paymentStatus ? 'success' : 'error'}
          >
            {tCommon(paymentStatus ? 'text.paid' : 'text.unpaid')}
          </Label>

          { isAdmin && <IconButton
            size="small"
            onClick={paymentStatusPopover.onOpen}
            sx={{ p: 0.5 }}
          >
            <Iconify icon="solar:pen-bold" width={18} />
          </IconButton>}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {tCommon('text.paymentType')}:
          </Box>

          <Box component="span" sx={{display: 'flex', flex: 1} }>
            {getPaymentTypeIcon(paymentType)}
            <Box component="span" sx={{ textTransform: 'capitalize' }}>
              {tCommon(`text.${paymentType}`)}
            </Box>

            { isAdmin &&  <IconButton
              size="small"
              onClick={paymentPopover.onOpen}
              sx={{ ml: 1 }}
            >
              <Iconify icon="solar:pen-bold" width={18} />
            </IconButton>}
          </Box>


        </Stack>
        {payment.invoiceRequested && !invoice && <Stack direction="row" alignItems="center" spacing={1}>
          <Box component="span" sx={{display: 'flex', flex: 1} }>
            <Button color="primary" variant="contained" onClick={generateInvoice}>
              {tCommon('buttons.generateInvoice')}
            </Button>
          </Box>
        </Stack>}

        <PaymentStatusPopover
          open={paymentStatusPopover.open}
          anchorEl={paymentStatusPopover.anchorEl}
          onClose={paymentStatusPopover.onClose}
          onSelect={handleChangePaymentStatus}
        />
        <PaymentTypePopover
          open={paymentPopover.open}
          anchorEl={paymentPopover.anchorEl}
          onClose={paymentPopover.onClose}
          onSelect={handleChangePaymentType}
        />
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDelivery}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderPayment}
    </Card>
  );
}
