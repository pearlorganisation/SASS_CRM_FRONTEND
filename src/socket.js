import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT === "development"
    ? import.meta.env.VITE_REACT_APP_API_BASE_URL_DEVELOPMENT
    : import.meta.env.VITE_REACT_APP_API_BASE_URL_MAIN_PRODUCTION;

export const socket = io("http://localhost:3000", {
  autoConnect: false,
  transports: ['websocket'], // Enforce WebSocket transport
  reconnectionAttempts: 3,  // Limit reconnection attempts
});
