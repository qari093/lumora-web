'use client';

import React, { useMemo } from 'react';

export type LumaLinkTone = 'neutral' | 'formal' | 'informal';

export type TranslationControlsValue = {
  enabled: boolean;
  autoDetect: boolean;
  from: string; // BCP-47 or short code (e.g., "en", "de")
  to: string;
  tone: LumaLinkTone;
};

export type TranslationControlsBarProps = {
  value: TranslationControlsValue;
  onChange: (next: TranslationControlsValue) => void;
  languages?: Array<{ code: string; label: string }>;
  className?: string;
};

const DEFAULT_LANGS: Array<{ code: string; label: string }> = [
  { code: 'auto', label: 'Auto' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' },
  { code: 'ur', label: 'اردو' },
  { code: 'hi', label: 'हिन्दी' },
];

function clampTone(t: string): LumaLinkTone {
  if (t === 'formal' || t === 'informal' || t === 'neutral') return t;
  return 'neutral';
}

export function TranslationControlsBar(props: TranslationControlsBarProps) {
  const { value, onChange, className } = props;
  const langs = useMemo(() => props.languages?.length ? props.languages : DEFAULT_LANGS, [props.languages]);

  const set = (patch: Partial<TranslationControlsValue>) => onChange({ ...value, ...patch });

  const fromOptions = langs.filter((l) => l.code !== 'auto');
  const toOptions = langs.filter((l) => l.code !== 'auto');

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(10,12,18,0.35)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      aria-label="Translation controls"
    >
      {/* Left: language control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => set({ enabled: e.target.checked })}
            aria-label="Enable translation"
          />
          <span style={{ fontSize: 12, opacity: 0.9 }}>Translate</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={value.autoDetect}
            onChange={(e) => set({ autoDetect: e.target.checked })}
            aria-label="Auto-detect language"
            disabled={!value.enabled}
          />
          <span style={{ fontSize: 12, opacity: value.enabled ? 0.9 : 0.45 }}>Auto</span>
        </label>

        <select
          value={value.from}
          onChange={(e) => set({ from: e.target.value })}
          disabled={!value.enabled || value.autoDetect}
          aria-label="From language"
          style={{ flex: 1, minWidth: 90, maxWidth: 170 }}
        >
          {fromOptions.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>

        <span style={{ opacity: 0.6, fontSize: 12 }}>→</span>

        <select
          value={value.to}
          onChange={(e) => set({ to: e.target.value })}
          disabled={!value.enabled}
          aria-label="To language"
          style={{ flex: 1, minWidth: 90, maxWidth: 170 }}
        >
          {toOptions.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right: tone control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.85, whiteSpace: 'nowrap' }}>Tone</span>
        <select
          value={value.tone}
          onChange={(e) => set({ tone: clampTone(e.target.value) })}
          disabled={!value.enabled}
          aria-label="Tone"
        >
          <option value="neutral">Neutral</option>
          <option value="formal">Formal</option>
          <option value="informal">Informal</option>
        </select>
      </div>
    </div>
  );
}

export default TranslationControlsBar;
