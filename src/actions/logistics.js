import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetOffices(courierId) {
  const url = courierId ? `/api/logistics/${courierId}` : null;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      offices: data?.data?.offices || [],
      loadingOffices: isLoading,
      officesError: error,
      officesValidating: isValidating,
      officesEmpty: !isLoading && !data?.data?.offices?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export const generateTracking = async (orderId, orderData) => {
  try {
    const response = await fetcher('/api/logistics/econtTracking', 'POST', orderData);

    if (response.success) {
      const updatedData = {
        tracking: {
          trackingNumber: response.data.label.shipmentNumber,
          trackingUrl: response.data.label.pdfURL,
        },
      };

      await mutate(endpoints.orders.details(orderId), updatedData, false);
      await mutate(endpoints.orders.list);

      return response.data;
    }

    throw new Error('Failed to generate tracking');
  } catch (error) {
    console.error('Tracking generation error:', error.message);
    throw error;
  }
};
