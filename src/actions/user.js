import useSWR from 'swr';
import { useMemo } from 'react';
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// Get authenticated user
export function useGetUser() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(endpoints.auth.me, fetcher, swrOptions);

  return useMemo(
    () => ({
      user: data?.user || null,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      refreshUser: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );
}

// Update user
export async function updateUser(data, refreshUser) {
  try {
    const res = await axiosInstance.put(endpoints.auth.me, data);
    await refreshUser();  // Refresh SWR data after updating the user
    return res.data.user;
  } catch (error) {
    console.error('Update user failed:', error);
    throw error;
  }
}

export async function changeUserPassword(data) {
  try {
    const res = await axiosInstance.post(endpoints.auth.changePassword, data);
    return res.data;
  } catch (error) {
    throw error || { message: 'Something went wrong' };
  }
}

export async function verifyUser({ email, code }) {
  try {
    const res = await axiosInstance.post(endpoints.auth.activateCode, { email, code });
    // Optionally: refresh user if needed (e.g. set user.active=true)
    return res.data;
  } catch (error) {
    // Optionally handle error in your UI with returned error.message
    throw error.response?.data || error || { message: 'Verification failed' };
  }
}


export async function resendUserActivationCode(email) {
  try {
    const res = await axiosInstance.post(endpoints.auth.resendCode, { email });
    return res.data;
  } catch (error) {
    throw error.response?.data || error || { message: 'Reset failed' };
  }
}
export async function requestPasswordResetCode(email) {
  try {
    const res = await axiosInstance.post(endpoints.auth.resetPassword, { email });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: 'Reset failed' };
  }
}

// Update password with code
export async function updatePasswordWithCode(data) {
  try {
    const res = await axiosInstance.post(endpoints.auth.updatePassword, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: 'Update failed' };
  }
}

export async function resendResetPasswordCode(email) {
  try {
    const res = await axiosInstance.post(endpoints.auth.resendResetCode, { email });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: 'Resend failed' };
  }
}

