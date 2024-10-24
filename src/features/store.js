import {combineReducers} from "redux";
import { encryptTransform } from "redux-persist-transform-encrypt";
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import webinarContact from "./slices/webinarContact";
import auth from "./slices/auth";
import employee from "./slices/employee";
import product from "./slices/product";
import sidebarLink from "./slices/sidebarLink";
import assign from "./slices/assign";
import globalData from "./slices/globalData";



// Combine your individual reducers here
const rootReducer = combineReducers({
  webinarContact,
  auth,
  employee,
  product,
  sidebarLink,
  assign,
  globalData
  });

// Custom root reducer handling a clear action
const rootReducerWithClear = (state, action) => {
    if (action.type === "saasCrm/clearReduxStoreData") {
      state = undefined;
      localStorage.clear();
      sessionStorage.clear();
    }
    return rootReducer(state, action);
  };
  

  // Redux-persist configuration
const persistConfig = {
  key: "SaasCrmClientPanel",
  version: 1,
  storage,
  transforms: [
    encryptTransform({
      secretKey: `${import.meta.env.VITE_REACT_APP_REDUX_PERSIST_SECRET_KEY}`,
      onError: (err) => {
        // Handle encryption errors if any
      },
    }),
  ],
};

// Persisted root reducer
const persistedReducer = persistReducer(persistConfig, rootReducerWithClear);

// Configure and create the Redux store
const store = configureStore({
    reducer: persistedReducer,
    devTools: import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT === "development",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  export default store;