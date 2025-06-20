import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import {endpoints, fetcher} from '../utils/axios';

// Internal API endpoints
const API_BASE_URL = '/api/products';

// Fetch products from the internal API
export async function getProducts() {
  try {
    const response = await fetcher(endpoints.products.list);

    if (response.data && response.success) {
      return response.data;
    }

    return { products: [] }; // Return empty if no data
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw new Error('Failed to fetch products');
  }
}

// Fetch a single product by ID from the internal API
export async function getProduct(slug) {
  try {
    const response = await fetcher(endpoints.products.details(slug));

    if (response.success) {
      return response.data;
    }

    throw new Error(`Product with ID ${slug} not found.`);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    throw new Error('Failed to fetch product');
  }
}

// Hook to fetch a single product
export function useGetProduct(productId) {
  const { data, error, isValidating } = useSWR(
    productId ? `${API_BASE_URL}/${productId}` : null,
    fetcher
  );

  const product = data ? mapProduct(data) : null;

  return useMemo(
    () => ({
      product,
      productLoading: !error && !data,
      productError: error ? 'Product not found' : null,
      productValidating: isValidating,
    }),
    [data, error, isValidating]
  );
}

// Hook for searching products
export function useSearchProducts(query) {
  const url = query ? `${API_BASE_URL}/search?query=${query}` : null;

  const { data, error, isValidating } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  const results = data ? data.map(mapProduct) : [];

  return useMemo(
    () => ({
      searchResults: results,
      searchLoading: !error && !data,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !error && data && data.length === 0,
    }),
    [data, error, isValidating]
  );
}


// Update product function
export const updateProduct = async (productId, updatedData) => {
  try {
    // Using the updated fetcher with 'PUT' method
    const response = await fetcher(endpoints.products.update(productId), 'PUT', updatedData);

    if (response.success) {
      return response.data; // Return the updated product data
    }

    throw new Error('Failed to update the product');
  } catch (error) {
    console.error('Error updating product:', error.message);
    throw new Error('Failed to update the product');
  }
};

