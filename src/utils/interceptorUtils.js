import { errorToast } from "./extra";

// Delay function for exponential backoff
export const delay = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const retryTracker = new Map();
const MAX_RETRY_ATTEMPTS = 3;

// Determines whether a request should be retried based on the URL
export const shouldRetryRequest = (originalRequest, url) => {
  if (!retryTracker.has(url)) {
    retryTracker.set(url, 1);
  } else {
    retryTracker.set(url, retryTracker.get(url) + 1);
  }

  if (retryTracker.get(url) > MAX_RETRY_ATTEMPTS) {
    retryTracker.delete(url);
    console.error(`Max retry attempts reached for ${url}`);
    // errorToast("Token refresh failed. Please log in again.");
    return false;
  }
  return true;
};

// Returns an error message based on the status code or a default message
export const getErrorMessage = (status, defaultMessage) => {
  const errorMessages = {
    400: "Bad Request",
    401: "Unauthorized Access",
    404: "Resource Not Found",
    500: "Internal Server Error",
  };
  return (
    errorMessages[status] || defaultMessage || "An unknown error occurred."
  );
};
