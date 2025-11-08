"use client";
import { useEffect, useState } from "react";

export default function OfflineStateCapsule() {
  const [state, setState] = useState("online");
  const [ts, setTs] = useState(Date.now());

  useEffect(() => {
    const update = () => {
      setState(navigator.onLine ? "online" : "offline");
      setTs(Date.now());
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const style: React.CSSProperties = {
    position: "fixed",
    left: 12,
    bottom: 12,
    background: state === "online" ? "#0b8" : "#c44",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "system-ui, sans-serif",
    opacity: 0.9,
    zIndex: 9999,
  };

  return (
    <div style={style} title="Offline State Capsule">
      State: <b>{state}</b> • {new Date(ts).toLocaleTimeString()}
    </div>
  );
}
