"use client";
import React from "react";
import { getSocket } from "../_lib/socket";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<"connecting"|"connected"|"disconnected">("connecting");
  React.useEffect(() => {
    const s = getSocket();
    const onConnect = () => setStatus("connected");
    const onDisconnect = () => setStatus("disconnected");
    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    if (s.connected) setStatus("connected");
    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div style={{minHeight:"100dvh", background:"#0b0f12", color:"#fff"}}>
      <div style={{position:"fixed", top:12, right:12, padding:"6px 10px",
        borderRadius:999, border:"1px solid rgba(255,255,255,.15)",
        background:"rgba(255,255,255,.08)", fontSize:12, fontWeight:800}}>
        LumaLink: {status}
      </div>
      {children}
    </div>
  );
}
