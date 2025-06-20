'use client';

import { CONFIG } from 'src/config-global';
import { InvoiceDetailsView } from 'src/sections/invoice/view';
import {useGetInvoices} from "../../../../actions/invoices";
import {useAuthContext} from "../../../../auth/hooks";
import {useIsAdmin} from "../../../../utils/hooks";

// ----------------------------------------------------------------------

export default function Page({ params }) {
  const { id } = params;
  const { user } = useAuthContext();
  const isAdmin = useIsAdmin();

  const {
    invoices,
    invoicesLoading,
    invoicesError,
    refreshInvoices,
  } = useGetInvoices({ userId: user?._id, isAdmin });

  const currentInvoice = invoices.find((invoice) => invoice.invoiceNumber === id);

  return <InvoiceDetailsView invoice={currentInvoice} />;
}
