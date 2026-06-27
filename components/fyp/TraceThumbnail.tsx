"use client";

export default function TraceThumbnail({
  title,
  poster,
  active,
  onClick,
}: {
  title: string;
  poster: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 w-24 ${
        active ? "scale-105" : ""
      } transition`}
    >
      <div
        className={`overflow-hidden rounded-2xl border ${
          active
            ? "border-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.45)]"
            : "border-white/10"
        }`}
      >
        <img
          src={poster}
          alt={title}
          className="h-36 w-full object-cover"
        />
      </div>

      <p className="mt-2 truncate text-[10px] text-white/80">
        {title}
      </p>

      {active ? (
        <div className="mx-auto mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
      ) : null}
    </button>
  );
}
