import { getLiveRooms } from "@/src/live/runtime/liveRooms";

export default function PulseSphereLite() {
  const rooms = getLiveRooms();

  return (
    <section data-testid="pulse-sphere-lite" aria-label="PulseSphere Lite">
      <h2>PulseSphere Lite</h2>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {rooms.map((room) => (
          <article
            key={room.id}
            data-testid={`live-room-${room.id}`}
            style={{ padding: 16, borderRadius: 16, border: "1px solid rgba(255,255,255,0.16)" }}
          >
            <strong>{room.title}</strong>
            <p style={{ margin: "8px 0 0", opacity: 0.72 }}>{room.kind} · {room.emotionalState}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
