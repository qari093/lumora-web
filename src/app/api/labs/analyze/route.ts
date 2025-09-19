import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
ok: true,
insights: { facesDetected: 1, language: 'en', bpm: 98, suggestedStyle: 'cinematic-warm' }
});
}
