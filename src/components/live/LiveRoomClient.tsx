"use client";
import { useSearchParams } from "next/navigation";
import InGameLive from "./InGameLive";

export default function LiveRoomClient({ room }: { room: string }) {
  const qs = useSearchParams();
  const name = qs?.get("name") || "Guest";
  const role = (qs?.get("role") || "viewer") as "host" | "viewer";

  return (
    <div style={{ padding: 20 }}>
      <h1>Live Room: {room}</h1>
      <InGameLive room={room} name={name} role={role} open={true} onClose={() => {}} />
    </div>
  );
}
