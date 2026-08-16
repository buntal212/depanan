import { io } from "socket.io-client";

const WS = process.env.WS
export const socket = io(WS, {
  // Polling menjadi fallback jika WebSocket tidak tersedia atau timeout.
  transports: ['websocket', 'polling'],
  timeout: 5000,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  secure: true,
})
