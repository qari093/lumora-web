"use client";
import React from "react";
import { useChat } from "../_lib/useChat";
import ConversationList from "./_components/ConversationList";
import MessageList from "./_components/MessageList";
import Composer from "./_components/Composer";

export default function ChatPage() {
  const { connected, selfId, rooms, activeRoomId, setActive, messagesByRoom, typingByRoom, send, typing } = useChat();
  const [draft, setDraft] = React.useState("");

  const msgs = activeRoomId ? (messagesByRoom[activeRoomId] || []) : [];
  const typingFrom = activeRoomId ? typingByRoom[activeRoomId]?.from : null;

  const onSend = () => {
    if (!activeRoomId) return;
    if (!draft.trim()) return;
    send(activeRoomId, draft.trim());
    setDraft("");
  };

  return (
    <div style={{ display:"flex", minHeight:"100dvh", background:"#0b0f12", color:"#fff" }}>
      <ConversationList rooms={rooms} activeId={activeRoomId} onSelect={setActive} />
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <div style={{
          padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.10)",
          background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"space-between"
        }}>
          <div><strong>{rooms.find(r=>r.id===activeRoomId)?.title || "Select a chat"}</strong></div>
          <div style={{opacity:.8, fontSize:12}}>
            {connected ? "● Online" : "○ Offline"} &nbsp; • &nbsp; You: {selfId}
          </div>
        </div>

        <MessageList items={msgs} typingFrom={typingFrom || undefined} />
        <Composer value={draft} onChange={setDraft} onSend={onSend}
          onTyping={()=> activeRoomId && typing(activeRoomId)} />
      </div>
    </div>
  );
}
