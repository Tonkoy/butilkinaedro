import useSWR from 'swr';
import { fetcher, endpoints } from 'src/utils/axios';
import axiosInstance from 'src/utils/axios';
import {useAuthContext} from "../auth/hooks";

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetCompany() {
  const { user } = useAuthContext();
  const isLoggedIn = Boolean(user?._id);

  // Run SWR only if logged in
  const { data, error, isLoading, mutate } = useSWR(
    isLoggedIn ? endpoints.auth.company : null,
    fetcher,
    swrOptions
  );

  return {
    company: data?.company || null,
    companyLoading: isLoading,
    companyError: error,
    refreshCompany: mutate,
  };
}

export async function createCompany(data, refreshCompany) {
  const res = await axiosInstance.post(endpoints.auth.company, data);
  await refreshCompany();
  return res.data.company}

export async function updateCompany(data, refreshCompany) {
  const res = await axiosInstance.put(endpoints.auth.company, data);
  await refreshCompany();
  return res.data.company;
}
