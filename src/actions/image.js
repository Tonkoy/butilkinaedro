import {endpoints, fetcher} from "../utils/axios";

export const uploadImage = async (file) => {
  try {
    // Using the updated fetcher with 'PUT' method
    const response = await fetcher(endpoints.images.upload, 'POST', file);
    if (response.success) {
      return response; // Return the updated product data
    }

    throw new Error('Failed to update the product');
  } catch (error) {
    console.error('Error updating product:', error.message);
    throw new Error('Failed to update the product');
  }
};
