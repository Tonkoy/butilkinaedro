import axios from 'axios';
import { CONFIG } from 'src/config-global';

// Axios instance
const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

// Define protected paths
const protectedPaths = [
  '/api/auth/me',
  '/api/auth/addresses',
  '/api/products',
  '/api/orders',
  '/api/admin',
  '/api/profile'
];

// Request interceptor to conditionally include the authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const shouldAuthorize = protectedPaths.some((path) => config.url.startsWith(path));

    if (shouldAuthorize && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    /*if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = `/unauthorized?returnTo=${encodeURIComponent(window.location.pathname)}`;
      }
    }*/

    return Promise.reject(error.response?.data || 'Something went wrong!');
  }
);

export default axiosInstance;


// Fetcher utility for SWR
export const fetcher = async (args, method = 'GET', data = null) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const options = {
      ...config,
      method,
      data,
    };

    const res = await axiosInstance(url, options);

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// API Endpoints
export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    addresses: '/api/auth/addresses',
    changePassword: '/api/auth/change-password',
    resetPassword: '/api/auth/reset-password',
    company: '/api/auth/company',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    resendCode: '/api/auth/resend-code',
    activateCode: '/api/auth/activate-code',
    updatePassword: '/api/auth/update-password',
    resendResetCode: '/api/auth/resend-reset-code'
  },
  invoice: {
    list: '/api/auth/invoice/list',
    details: (invoiceNumber) => `/api/auth/invoice?invoiceNumber=${invoiceNumber}`,
    create: '/api/auth/invoice',
    update: '/api/auth/invoice',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  categories: {
    list: '/api/categories/list',
    details: (id) => `/api/categories/details/${id}`,
  },
  products: {
    list: '/api/products/list',
    details: (slug) => `/api/products/details/${slug}`,
    search: '/api/products/search',
    update: (id) => `/api/products/details/${id}`,
  },
  orders: {
    new: '/api/orders/new',
    list: '/api/orders/list',
    details: (orderId) => `/api/orders/details/${orderId}`,
    search: '/api/orders/search',
    update: (id) => `/api/orders/details/${id}`,
  },
  images: {
    upload: '/api/image-upload',
  },
};
