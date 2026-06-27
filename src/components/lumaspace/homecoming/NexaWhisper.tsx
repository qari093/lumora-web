"use client";

export default function NexaWhisper({
  text = "Welcome home. Your story continues."
}: {
  text?: string;
}) {
  return (
    <p
      data-testid="lumaspace-nexa-whisper"
      style={{
        margin: 0,
        maxWidth: 320,
        textAlign: "center",
        color: "rgba(240,249,255,.9)",
        fontSize: 18,
        lineHeight: 1.45,
        letterSpacing: ".04em",
        textShadow: "0 0 24px rgba(34,211,238,.34)"
      }}
    >
      {text}
    </p>
  );
}
