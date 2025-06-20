import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetCategories() {
  const url = endpoints.categories.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      categories: data?.categories || data?.data || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.categories?.length,
      refetchCategories: mutate
    }),
    [data?.categories, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCategory(categoryId) {
  const url = categoryId ? [endpoints.categories.details, { params: { categoryId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      category: data?.category,
      categoryLoading: isLoading,
      categoryError: error,
      categoryValidating: isValidating,
    }),
    [data?.category, error, isLoading, isValidating]
  );

  return memoizedValue;
}
