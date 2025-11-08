"use client";
import { useRouter } from "next/navigation";
import React from "react";

type Props = { id:string; label:string; route?:string; className?:string; onClick?:()=>void; };

export default function IconBtn({ id, label, route, className, onClick }: Props) {
  const r = useRouter();
  return (
    <button
      className={`icon-btn ${className||""}`}
      aria-label={label}
      onClick={() => { onClick?.(); if (route) r.push(route); }}
    >
      <svg className={`icon ${className||""}`} viewBox="0 0 64 64" aria-hidden="true">
        <use href={`/sprite.svg#${id}`} />
      </svg>
    </button>
  );
}
