import useSWR from 'swr';
import axiosInstance, {endpoints, fetcher} from '../utils/axios';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// GET all invoices (admin or user)
export function useGetInvoices({ userId, isAdmin }) {
  const endpoint = isAdmin
    ? endpoints.invoice.list
    : `${endpoints.invoice.list}?userId=${userId}`;

  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, swrOptions);

  return {
    invoices: data?.data || [],
    invoicesLoading: isLoading,
    invoicesError: error,
    refreshInvoices: mutate,
  };
}

// GET one invoice by number
export async function getInvoiceByNumber(invoiceNumber) {
  const res = await axiosInstance.get(endpoints.invoice.details(invoiceNumber));
  return res.data?.data;
}

// CREATE invoice (from orderId)
export async function createInvoiceFromOrder(orderId) {
  const res = await axiosInstance.post(endpoints.invoice.create, { orderId });
  return res.data;
}

// PATCH: update invoice status
export async function updateInvoice(invoiceId, status) {
  const res = await axiosInstance.patch(endpoints.invoice.update, {
    invoiceId,
    status,
  });
  return res.data?.data;
}
