import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';
import {updateProduct} from "./product-ssr";

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetProducts() {
  const url = endpoints.products.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      products: data?.products || data?.data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.products?.length,
    }),
    [data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const url = productId ? [endpoints.products.details, { params: { productId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const url = query ? [endpoints.products.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export const createProduct = async (data) => {
  try {
    // Using the updated fetcher with 'PUT' method
    const response = axiosInstance.post(endpoints.products.list, data);
    console.log(response)

    if (response.success) {
      return response.data; // Return the updated product data
    }

    throw new Error('Failed to update the product');
  } catch (error) {
    console.error('Error updating product:', error.message);
    throw new Error('Failed to update the product');
  }
};

export const updateProductAndSync = async (productId, updatedData) => {
  try {
    const response = await updateProduct(productId, updatedData);

    // Sync detail view
    mutate([endpoints.products.details, { params: { productId } }]);

    // Sync product list - revalidate it
    await mutate(endpoints.products.list, undefined, { revalidate: true });

    return response;
  } catch (err) {
    throw err;
  }
};
