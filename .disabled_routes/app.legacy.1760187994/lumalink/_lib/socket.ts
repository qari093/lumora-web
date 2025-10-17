"use client";
import { io, Socket } from "socket.io-client";

/**
 * Returns a singleton Socket.IO client.
 * Env: NEXT_PUBLIC_SOCKET_URL (fallback: same-origin /)
 */
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket && socket.connected) return socket;
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "";
    socket = io(url, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true,
      withCredentials: true,
    });
  }
  return socket!;
}
