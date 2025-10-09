import { io, Socket } from "socket.io-client";

let _socket: Socket | null = null;

export function getSocket(): Socket {
  if (_socket && _socket.connected) return _socket;
  if (_socket && !_socket.connected) return _socket;

  // Connect to same-origin; Next dev supports WS on same port
  _socket = io("/", {
    path: "/api/lumalink/socket",
    transports: ["websocket", "polling"],
    withCredentials: true,
    autoConnect: true,
  });

  return _socket;
}
