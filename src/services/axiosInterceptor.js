import axios from "axios";
import {
  delay,
  getErrorMessage,
  shouldRetryRequest,
} from "../utils/interceptorUtils";

let store;
export const injectStore = (_store) => {
  store = _store;
};

export const instance = axios.create({
  withCredentials: true,
  baseURL: `${
    import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT === "development"
      ? import.meta.env.VITE_REACT_APP_API_BASE_URL_DEVELOPMENT
      : import.meta.env.VITE_REACT_APP_API_BASE_URL_MAIN_PRODUCTION ||
        "https://fallback-url.com"
  }`,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const loggedInUserName = store.getState()?.auth?.userData?.userName;

    if (
      (error?.response?.status === 401 || error?.response?.status === 403) &&
      shouldRetryRequest(originalRequest, originalRequest.url)
    ) {
      try {
        // console.log("Refreshing token...");
        // await delay(1000 * retryTracker.get(originalRequest.url)); // Exponential backoff
        // console.log('sf --- > ')
        await instance.post("/auth/refresh", { userName: loggedInUserName });
        // console.log('< ---- sf --- > ')

        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out user.");
        return Promise.reject("Token refresh failed. Please log in again.");
      }
    }

    const errorMessage = getErrorMessage(
      error?.response?.status,
      error?.response?.data?.message
    );
    return Promise.reject(errorMessage);
  }
);
