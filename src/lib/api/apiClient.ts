import axios, { CreateAxiosDefaults } from 'axios';
import axiosRetry from 'axios-retry';

const baseConfig: CreateAxiosDefaults = {
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
};

export const api = axios.create(baseConfig);

export const retryingApi = axios.create(baseConfig);

axiosRetry(retryingApi, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkError(error) ||
      (error.response?.status !== undefined &&
        error.response.status >= 500 &&
        error.response.status <= 599)
    );
  },
});

if (process.env.NODE_ENV === 'development') {
  retryingApi.interceptors.request.use((config) => {
    console.log(`[RETRYING API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });
}
