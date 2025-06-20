'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InvoiceDetails } from '../invoice-details';

// ----------------------------------------------------------------------

export function InvoiceDetailsView({ invoice }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={invoice?.invoiceNumber}
        links={[
          { name: 'Табло', href: paths.dashboard.root },
          { name: 'Фактури', href: paths.dashboard.invoice.root },
          { name: invoice?.invoiceNumber },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceDetails invoice={invoice} />
    </DashboardContent>
  );
}
