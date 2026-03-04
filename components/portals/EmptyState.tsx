import React from "react";

export default function EmptyState(props: { title: string; hint?: string; id?: string }) {
  const { title, hint, id } = props;
  return (
    <div
      id={id}
      role="status"
      className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <div className="font-medium">{title}</div>
      {hint ? <div className="mt-1 opacity-70">{hint}</div> : null}
    </div>
  );
}
