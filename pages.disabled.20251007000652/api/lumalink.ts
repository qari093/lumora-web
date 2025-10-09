import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

type NextApiResponseServerIO = NextApiResponse & {
  socket: NextApiResponse["socket"] & {
    server: HTTPServer & { io?: IOServer };
  };
};

// Room -> Set<socketId>
const roomMembers = new Map<string, Set<string>>();

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server, {
      path: "/api/lumalink/socket",
      cors: { origin: "*" },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      let currentRoom: string | null = null;

      socket.on("join-room", ({ roomId }: { roomId: string }) => {
        currentRoom = roomId;
        socket.join(roomId);

        if (!roomMembers.has(roomId)) roomMembers.set(roomId, new Set());
        const members = roomMembers.get(roomId)!;

        const existing = Array.from(members).filter((id) => id !== socket.id);
        socket.emit("room-users", existing);

        members.add(socket.id);
        socket.to(roomId).emit("user-joined", socket.id);
      });

      socket.on("signal-offer", ({ to, description }: { to: string; description: RTCSessionDescriptionInit }) => {
        socket.to(to).emit("signal-offer", { from: socket.id, description });
      });

      socket.on("signal-answer", ({ to, description }: { to: string; description: RTCSessionDescriptionInit }) => {
        socket.to(to).emit("signal-answer", { from: socket.id, description });
      });

      socket.on("signal-ice", ({ to, candidate }: { to: string; candidate: RTCIceCandidateInit }) => {
        socket.to(to).emit("signal-ice", { from: socket.id, candidate });
      });

      socket.on("disconnect", () => {
        if (currentRoom) {
          const set = roomMembers.get(currentRoom);
          if (set) {
            set.delete(socket.id);
            if (set.size === 0) roomMembers.delete(currentRoom);
          }
          socket.to(currentRoom).emit("user-left", socket.id);
        }
      });
    });
  }
  res.end();
}
export const config = { api: { bodyParser: false } };
