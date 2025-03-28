// src/lib/socket.ts
import { io } from "socket.io-client";
import { API_URL } from "@/config/api";

// Remove the 'api/' and possible 'v1/' from the end of the URL
const baseUrl = API_URL.replace(/api\/?v?\d*\/?$/, '');

// Log the URL for debugging
console.log("Socket connection URL:", baseUrl);

export const socket = io(baseUrl, {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  transports: ['websocket', 'polling'],
});

// Add logging for connection events
socket.on('connect', () => {
  console.log('Socket connected successfully');
});

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});