import useSWR, {mutate} from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetOrders() {
  const url = endpoints.orders.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      orders: data?.orders || data?.data || [],
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.orders?.length,
    }),
    [data?.orders, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetOrder(orderId) {
  const url = orderId ? `${endpoints.orders.details}/${orderId}` : null;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      order: data?.data, // based on your API response { success: true, data: order }
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const createOrder = async (data) => {
  try {
    // Using the updated fetcher with 'PUT' method
    const response = await fetcher(endpoints.orders.new, 'POST', data);

    if (response.success) {
      return response.data; // Return the updated product data
    }

    throw new Error('Failed to create the order');
  } catch (error) {
    console.error('Error creating product:', error.message);
    throw new Error('Failed to create the order');
  }
};


export const updateOrder = async (orderId, updatedData) => {
  try {
    const response = await fetcher(endpoints.orders.update(orderId), 'PUT', updatedData);

    if (response.success) {
      // Manually update SWR cache
      await mutate(endpoints.orders.details(orderId), response.data, false); // update cache without revalidation
      await mutate(endpoints.orders.list); // trigger revalidation for the list

      return response.data;
    }

    throw new Error('Failed to update the order');
  } catch (error) {
    console.error('Error updating order:', error.message);
    throw error;
  }
};

export async function getOrder(orderId) {
  try {
    const response = await fetcher(endpoints.orders.details(orderId));
    console.log(response)
    if (response.success) {
      return response.data;
    }

    throw new Error(`order with ID ${orderId} not found.`);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    throw new Error('Failed to fetch product');
  }
}
