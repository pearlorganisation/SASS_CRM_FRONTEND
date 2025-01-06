import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT === "development"
    ? import.meta.env.VITE_REACT_APP_SOCKET_BASE_URL_DEVELOPMENT
    : import.meta.env.VITE_REACT_APP_SOCKET_BASE_URL_MAIN_PRODUCTION;

export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket'], // Enforce WebSocket transport
  reconnectionAttempts: 3,  // Limit reconnection attempts
});
