"use client";

type Props = {
  id: string;
  action?: "pulse"|"float"|"ripple"|"vibrate"|"rotate"|"bloom";
  intensity?: number;
  hue?: number;
  size?: number;
};

export default function HoloEmoji({ id, action="pulse", intensity=1, hue=0, size=64 }: Props) {
  return (
    <button
      className={`holo-btn act-${action}`}
      style={{ "--holo-intensity": intensity as any, "--holo-hue": `${hue}deg` } as React.CSSProperties}
      aria-label={id}
    >
      <svg className="holo-emoji" viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
        <use href={`/sprite.svg#${id}`} />
      </svg>
    </button>
  );
}
