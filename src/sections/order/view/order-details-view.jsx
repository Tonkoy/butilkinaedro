'use client';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderDetailsHistory } from '../order-details-history';

// ----------------------------------------------------------------------

export function OrderDetailsView({ order }) {
  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={order?.orderId}
        createdAt={order?.createdAt}
        status={order?.orderStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
        orderId={order?._id}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={order?.items}
              shipping={order?.shipping}
              discount={order?.discount}
              subtotal={order?.subTotal}
              totalAmount={order?.total}
            />

            <OrderDetailsHistory history={order?.history} />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            orderId={order?._id}
            orderItems={order?.items}
            totalAmount={order?.total}
            customer={{
              name: order?.recipient
            }}
            invoice={order.invoice}
            delivery={{
              address: order?.fullAddress,
              phoneNumber: order.phoneNumber,
              tracking: order.tracking,
            }}
            payment={{
              paymentStatus: order.paymentStatus,
              paymentType: order.paymentType,
              invoiceRequested: order.invoiceRequested
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
