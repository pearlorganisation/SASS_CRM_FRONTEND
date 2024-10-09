import axios from "axios";

// This code is used to access redux store in this file.
let store;
export const injectStore = (_store) => {
  store = _store;
};

// Creating new axios instance
export const instance = axios.create({
    withCredentials: true,
    baseURL: `${
      import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT === "development"
        ? import.meta.env.VITE_REACT_APP_API_BASE_URL_DEVELOPMENT
        : import.meta.env.VITE_REACT_APP_API_BASE_URL_MAIN_PRODUCTION
    }`,
  });


instance.interceptors.response.use(
  (response) => {
// save username from response in redux or localstorage for future use and when calling use it in userName variable while generating refresh token
    return response;
  },
  async (error) => {
    console.log(error)

    let errorMessage = "";
    // Do something with response error
    let loggedInUserName = store.getState()?.auth?.userData?.userName ;
  console.log(loggedInUserName)
    let originalRequest = error.config;

    if (
      error.response.status === 401 ||
      (error.response.status === 403 && !originalRequest._retry)
    ) {
      originalRequest._retry = true;
      try {
        if (loggedInUserName) {
          await instance.post(
            "/auth/refresh",
            { userName: loggedInUserName },
            {
              withCredentials: true,
            }
          );
          return instance(originalRequest);
        } else {
          console.log(error)
          errorMessage = "Incorrect Username / Password";
          return Promise.reject(errorMessage);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }

    switch (Number(error.response.status)) {
      case 400:
        errorMessage = error.response.data.message || "Bad Request";
        break;
        case 401:
          errorMessage = error.response.data.message || "Unauthorized Access";
          break;
  
      case 404:
        errorMessage = error.response.data.message || "Resource Not Found";
        break;

      case 500:
        errorMessage = error.response.data.message || "Internal Server Error";
        break;

      default:
        errorMessage =
          error.response.data.message ||
          "Sorry, something went wrong. Please try again later.";
    }
    return Promise.reject(errorMessage);
  }
);
