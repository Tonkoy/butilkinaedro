import useSWR from 'swr';
import { fetcher, endpoints } from 'src/utils/axios';
import axiosInstance from 'src/utils/axios';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetAddresses() {
  const { data, error, isLoading, mutate } = useSWR(endpoints.auth.addresses, fetcher, swrOptions);

  return {
    addresses: data?.addresses || [],
    addressesLoading: isLoading,
    addressesError: error,
    refreshAddresses: mutate,
  };
}

export async function createAddress(addressData, refreshAddresses) {
  const res = await axiosInstance.post(endpoints.auth.addresses, addressData);
  await refreshAddresses();
  return res.data.address;
}

export async function updateAddress(addressId, addressData, refreshAddresses) {
  const res = await axiosInstance.put(endpoints.auth.addresses, { addressId, ...addressData });
  await refreshAddresses();
  return res.data.address;
}

export async function deleteAddress(addressId, refreshAddresses) {
  await axiosInstance.delete(endpoints.auth.addresses, { data: { addressId } });
  await refreshAddresses();
}
