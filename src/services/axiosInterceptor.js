import axios from "axios";


// Returns an error message based on the status code or a default message
 const getErrorMessage = (status, defaultMessage) => {
  const errorMessages = {
    400: "Bad Request",
    401: "Unauthorized Access",
    404: "Resource Not Found",
    500: "Internal Server Error",
    429: "Too Many Requests",
  };
  return (
    defaultMessage || errorMessages[status] ||  "An unknown error occurred."
  );
};

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
    const loggedInUserEmail = store.getState()?.auth?.userData?.email;

    if ((error?.response?.status === 401 || error?.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
       
        await instance.post("/auth/refresh", { email: loggedInUserEmail });

        return instance(originalRequest);
      } catch (refreshError) {
        console.log("refreshError", refreshError);
        console.error("Token refresh failed. Logging out user.");
        store.dispatch({ type: "auth/logout" });
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
