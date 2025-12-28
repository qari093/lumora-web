'use client';

import * as React from 'react';
import type { PersonaEmotion, PersonaReaction } from '@/src/lib/persona/reactionMatrix';
import { voiceToReaction } from '@/src/lib/persona/reactionMatrix';
import { resolveEmoji, resolveAvatar } from '@/src/lib/persona/resolvePersona';

export type VoiceState = {
  isSpeaking: boolean;
  volume: number;
  emotionHint?: PersonaEmotion | null;
};

export type Props = {
  personaCode?: string;
  codeOverride?: string;
  emotion?: PersonaEmotion;
  reaction?: PersonaReaction | string;
  seed?: string;
  size?: number;
  showReaction?: boolean;
  voiceState?: VoiceState | null;
};

export default function PersonaBadge(props: Props) {
  const size = Math.max(28, Math.min(160, props.size ?? 56));
  const code = (props.codeOverride ?? props.personaCode ?? 'avatar_001').trim() || 'avatar_001';
  const emotion: PersonaEmotion = props.emotion ?? 'neutral';

  const voiceRx = props.voiceState ? voiceToReaction(props.voiceState).reaction : null;
  const reaction = (voiceRx ?? props.reaction ?? null) as string | null;

  const avatarSrc = resolveAvatar(code, emotion);
  const emojiSrc = reaction ? resolveEmoji(reaction) : null;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        overflow: 'hidden',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
      title={`${code}${reaction ? ` • ${reaction}` : ''}`}
    >
      {/* Avatar */}
      <img
        src={avatarSrc}
        alt={code}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'cover', display: 'block' }}
        onError={(e) => {
          // final fallback to a known existing asset if the requested one is missing
          (e.currentTarget as HTMLImageElement).src = '/ads/product.png';
        }}
      />

      {/* Reaction overlay */}
      {props.showReaction !== false && emojiSrc && (
        <img
          src={emojiSrc}
          alt={reaction ?? ''}
          width={Math.round(size * 0.46)}
          height={Math.round(size * 0.46)}
          style={{
            position: 'absolute',
            right: -2,
            bottom: -2,
            width: Math.round(size * 0.46),
            height: Math.round(size * 0.46),
            objectFit: 'cover',
            borderRadius: 999,
            border: '1px solid rgba(0,0,0,0.25)',
            background: 'rgba(0,0,0,0.25)',
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
    </div>
  );
}
