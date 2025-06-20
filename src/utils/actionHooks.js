// src/hooks/useUpdateOrder.js
import { mutate } from 'swr';
import { updateOrder } from 'src/actions/order';
import { endpoints } from 'src/utils/axios';
import { updateInvoice } from 'src/actions/invoices';

export function useUpdateOrder(orderId) {
  const updateAndSync = async (updatedData) => {
    const updated = await updateOrder(orderId, updatedData);

    const orderKey = `${endpoints.orders.details}/${orderId}`;
    const listKey = endpoints.orders.list;

    // Update detail view
    await mutate(orderKey);

    // Update list view optimistically
    await mutate(listKey, (prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        data: prev.data.map((order) =>
          order._id === orderId ? { ...order, ...updated } : order
        ),
      };
    }, false);

    // Fallback: revalidate list from server
    await mutate(listKey);

    return updated;
  };

  return { updateAndSync };
}



export function useUpdateInvoice(invoiceId) {
  const updateAndSync = async (status) => {
    const updated = await updateInvoice(invoiceId, status);

    const detailKey = `${endpoints.invoice.details(invoiceId)}`;
    const listKey = endpoints.invoice.list;

    // Sync detail view
    await mutate(detailKey);

    // Optimistically update the list
    await mutate(
      listKey,
      (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map((invoice) =>
            invoice._id === invoiceId ? { ...invoice, status } : invoice
          ),
        };
      },
      false
    );

    // Revalidate the list view from the server
    await mutate(listKey);

    return updated;
  };

  return { updateAndSync };
}
