import React from 'react';

export function Card(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={props.className}
      style={{
        border: '1px solid rgba(0,0,0,0.08)',
        background: 'rgba(255,255,255,0.75)',
        borderRadius: 16,
        padding: 14,
        boxShadow: '0 10px 24px rgba(10,25,60,0.08)',
      }}
    >
      {props.children}
    </div>
  );
}

export function Pill(props: React.PropsWithChildren<{ tone?: 'ok' | 'warn' | 'info' }>) {
  const tone = props.tone ?? 'info';
  const bg =
    tone === 'ok' ? 'rgba(50,180,120,0.14)' : tone === 'warn' ? 'rgba(255,170,0,0.18)' : 'rgba(60,140,255,0.16)';
  const bd =
    tone === 'ok' ? 'rgba(50,180,120,0.28)' : tone === 'warn' ? 'rgba(255,170,0,0.30)' : 'rgba(60,140,255,0.30)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        borderRadius: 999,
        background: bg,
        border: `1px solid ${bd}`,
        fontSize: 12,
        opacity: 0.9,
        userSelect: 'none',
      }}
    >
      {props.children}
    </span>
  );
}
