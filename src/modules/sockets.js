import { io } from "socket.io-client";

const WS = process.env.WS
export const socket = io(WS,{
  transports: ['websocket'],
  secure: true,
})

