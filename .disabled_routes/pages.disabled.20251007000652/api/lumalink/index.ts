import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

type RoomUsers = Map<string, Set<string>>; // roomId -> set of socketIds
type SockRoom = Map<string, string>;       // socketId -> roomId

type WithIO = HTTPServer & { io?: IOServer };

const globalAny = globalThis as unknown as {
  __lumalink?: {
    io: IOServer;
    roomUsers: RoomUsers;
    sockRoom: SockRoom;
  };
};

import { initBitesWorker } from "@/workers/bites";

function initIO(server: WithIO) {
  if (globalAny.__lumalink) return globalAny.__lumalink;
  const io = new IOServer(server, {
    path: "/api/lumalink/socket",
    cors: { origin: true, credentials: true },
  });

  const roomUsers: RoomUsers = new Map();
  const sockRoom: SockRoom = new Map();

  io.on("connection", (socket) => {
    const id = socket.id;

    socket.on("join-room", ({ roomId }: { roomId: string }) => {
      if (!roomId) return;
      // leave previous
      const prev = sockRoom.get(id);
      if (prev && prev !== roomId) {
        const set = roomUsers.get(prev);
        if (set) {
          set.delete(id);
          if (!set.size) roomUsers.delete(prev);
          io.to(prev).emit("user-left", id);
          io.to(prev).emit("room-users", Array.from(set ?? []));
        }
        socket.leave(prev);
      }

      // join new
      sockRoom.set(id, roomId);
      socket.join(roomId);
      if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Set());
      roomUsers.get(roomId)!.add(id);

      // tell newcomers who is here
      const others = Array.from(roomUsers.get(roomId)!).filter((x) => x !== id);
      socket.emit("room-users", others);
      // notify room
      socket.to(roomId).emit("user-joined", id);
    });

    socket.on("signal-offer", ({ to, description }) => {
      const roomId = sockRoom.get(id);
      if (!roomId) return;
      io.to(to).emit("signal-offer", { from: id, description });
    });

    socket.on("signal-answer", ({ to, description }) => {
      const roomId = sockRoom.get(id);
      if (!roomId) return;
      io.to(to).emit("signal-answer", { from: id, description });
    });

    socket.on("signal-ice", ({ to, candidate }) => {
      const roomId = sockRoom.get(id);
      if (!roomId) return;
      io.to(to).emit("signal-ice", { from: id, candidate });
    });

    socket.on("disconnect", () => {
      const roomId = sockRoom.get(id);
      if (!roomId) return;
      sockRoom.delete(id);
      const set = roomUsers.get(roomId);
      if (set) {
        set.delete(id);
        if (!set.size) roomUsers.delete(roomId);
        socket.to(roomId).emit("user-left", id);
        io.to(roomId).emit("room-users", Array.from(set ?? []));
      }
    });
  });

  initBitesWorker(io);
  const state = { io, roomUsers, sockRoom };
  globalAny.__lumalink = state;
  return state;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure server + IO instance exist (idempotent)
  const srv = res.socket?.server as unknown as WithIO;
  if (!srv) return res.status(500).end("No server");
  initIO(srv);
  res.status(200).json({ ok: true });
}

export const config = { api: { bodyParser: false } };
