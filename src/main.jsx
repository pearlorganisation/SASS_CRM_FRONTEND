import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import store from "./features/store";
import persistStore from "redux-persist/es/persistStore";
import { injectStore } from "./services/axiosInterceptor";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

injectStore(store);
let persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
