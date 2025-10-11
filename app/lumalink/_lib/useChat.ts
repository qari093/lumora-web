"use client";
import React from "react";
import { getSocket } from "./socket";

export type Message = {
  id: string;
  roomId: string;
  from: string;
  text: string;
  ts: number;
  mine?: boolean;
};
export type Room = {
  id: string;
  title: string;
  last?: string;
  unread?: number;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function useChat(userId?: string) {
  const [connected, setConnected] = React.useState(false);
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = React.useState<string | null>(null);
  const [messagesByRoom, setMessagesByRoom] = React.useState<Record<string, Message[]>>({});
  const [typingByRoom, setTypingByRoom] = React.useState<Record<string, { from: string; ts: number } | null>>({});
  const [typingSelf, setTypingSelf] = React.useState(false);

  const selfId = React.useMemo(() => {
    if (userId) return userId;
    if (typeof window !== "undefined") {
      const fromUrl = new URLSearchParams(window.location.search).get("uid");
      if (fromUrl) return fromUrl;
    }
    return "user-" + uid();
  }, [userId]);

  React.useEffect(() => {
    const s = getSocket();
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    // Join presence namespace / identify yourself (server may ignore if not implemented)
    s.emit("lumalink:join", { userId: selfId });

    // Receive room list
    const onRooms = (payload: { rooms: Room[] }) => {
      setRooms(payload.rooms || []);
      if (!activeRoomId && payload.rooms?.length) setActiveRoomId(payload.rooms[0].id);
    };

    // Receive history for a room
    const onHistory = (payload: { roomId: string; messages: Message[] }) => {
      setMessagesByRoom(prev => ({ ...prev, [payload.roomId]: payload.messages || [] }));
    };

    // New incoming message
    const onInbound = (msg: Message) => {
      setMessagesByRoom(prev => {
        const arr = prev[msg.roomId] ? [...prev[msg.roomId]] : [];
        arr.push(msg);
        return { ...prev, [msg.roomId]: arr };
      });
      setRooms(prev =>
        prev.map(r => (r.id === msg.roomId ? { ...r, last: msg.text, unread: (r.unread || 0) + 1 } : r))
      );
    };

    // Typing indicator
    const onTyping = (payload: { roomId: string; from: string }) => {
      setTypingByRoom(prev => ({ ...prev, [payload.roomId]: { from: payload.from, ts: Date.now() } }));
      // auto-clear after 3s
      setTimeout(() => {
        setTypingByRoom(prev => {
          if (!prev[payload.roomId]) return prev;
          const copy = { ...prev };
          if (Date.now() - (copy[payload.roomId]!.ts) > 2500) copy[payload.roomId] = null;
          return copy;
        });
      }, 3000);
    };

    s.on("lumalink:rooms", onRooms);
    s.on("lumalink:history", onHistory);
    s.on("lumalink:message", onInbound);
    s.on("lumalink:typing", onTyping);

    // Ask server for rooms (or fall back to mock if none in 1s)
    s.emit("lumalink:getRooms");
    const mockTimer = setTimeout(() => {
      // if no rooms arrived yet, inject mock data so UI is usable
      setRooms(prev => (prev.length ? prev : [
        { id: "general", title: "General" },
        { id: "product", title: "Product Team" },
        { id: "creators", title: "Creators Lounge" },
      ]));
    }, 1000);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("lumalink:rooms", onRooms);
      s.off("lumalink:history", onHistory);
      s.off("lumalink:message", onInbound);
      s.off("lumalink:typing", onTyping);
      clearTimeout(mockTimer);
    };
  }, [selfId, activeRoomId]);

  // Load history when activeRoom changes
  React.useEffect(() => {
    const s = getSocket();
    if (!activeRoomId) return;
    s.emit("lumalink:getHistory", { roomId: activeRoomId });
    // Also seed mock if server silent
    const mock = setTimeout(() => {
      setMessagesByRoom(prev => prev[activeRoomId] ? prev : ({
        ...prev,
        [activeRoomId]: [
          { id: uid(), roomId: activeRoomId, from: "system", text: "Welcome to " + activeRoomId, ts: Date.now() - 5_000 },
          { id: uid(), roomId: activeRoomId, from: "alex", text: "Hey there 👋", ts: Date.now() - 4_000 },
          { id: uid(), roomId: activeRoomId, from: selfId, text: "Hello! Testing LumaLink chat.", ts: Date.now() - 3_000, mine: true },
        ]
      }));
    }, 800);
    return () => clearTimeout(mock);
  }, [activeRoomId]);

  function send(roomId: string, text: string) {
    if (!text.trim()) return;
    const msg: Message = { id: uid(), roomId, from: selfId, text, ts: Date.now(), mine: true };
    setMessagesByRoom(prev => ({ ...prev, [roomId]: [ ...(prev[roomId]||[]), msg ] }));
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, last: text, unread: 0 } : r));
    getSocket().emit("lumalink:send", { roomId, text, from: selfId });
  }

  function setActive(roomId: string) {
    setActiveRoomId(roomId);
    // mark read
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, unread: 0 } : r));
  }

  function typing(roomId: string) {
    if (typingSelf) return;
    setTypingSelf(true);
    getSocket().emit("lumalink:typing", { roomId, from: selfId });
    setTimeout(() => setTypingSelf(false), 1500);
  }

  return {
    connected,
    selfId,
    rooms, activeRoomId, setActive,
    messagesByRoom,
    typingByRoom,
    send, typing,
  };
}
