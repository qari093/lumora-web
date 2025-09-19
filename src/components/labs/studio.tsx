'use client';
import { useMemo, useRef, useState } from 'react';
import type { Effects, Mode, GenerateRequest, PublishRequest } from '@/types/labs';

const def: Effects = {
  beautify: true, ageShift: 0, hairstyle: null, genderStyle: 'any',
  music: 'lofi chill', captions: true, translateTo: null,
  gestures: ['wink','thumbsUp'], avatarPreset: null,
};

export default function LabsStudio() {
  const [mode, setMode] = useState<Mode>('video');
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [effects, setEffects] = useState<Effects>(def);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const valid = useMemo(() => (mode==='image' ? (prompt.length>0 || sourceUrl.length>0) : true), [mode,prompt,sourceUrl]);

  function pickFile(){ fileRef.current?.click(); }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f); setSourceUrl(url);
  }

  async function generate() {
    setLoading(true);
    try {
      const body: GenerateRequest = { mode, sourceUrl, prompt, effects };
      const r = await fetch('/api/labs/generate',{ method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
      const j = await r.json() as { ok:boolean; previewUrl?:string };
      if (j.ok && j.previewUrl) setPreviewUrl(j.previewUrl);
    } finally { setLoading(false); }
  }

  async function publish(earnOnShare: boolean) {
    const body: PublishRequest = { postTitle: prompt || 'Untitled', earnOnShare, effects };
    const r = await fetch('/api/labs/publish',{ method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
    const j = await r.json() as { ok:boolean; postId?:string; earned?:number; error?:string };
    alert(j.ok ? `Published! Post: ${j.postId} • Earned: ${j.earned} ZC` : `Failed: ${j.error}`);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="rounded border p-4">
        <h2 className="font-semibold mb-3">Inputs</h2>

        <div className="flex gap-2 mb-3">
          <button className={`px-3 py-1 rounded border ${mode==='video'?'bg-black text-white dark:bg-white dark:text-black':''}`} onClick={()=>setMode('video')}>Video</button>
          <button className={`px-3 py-1 rounded border ${mode==='image'?'bg-black text-white dark:bg-white dark:text-black':''}`} onClick={()=>setMode('image')}>Image</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Prompt</label>
            <input value={prompt} onChange={e=>setPrompt(e.target.value)} className="w-full rounded border px-3 py-2 bg-transparent" placeholder="Describe your idea (e.g., cinematic warm vlog)" />
          </div>

          <div>
            <label className="block text-sm mb-1">Source (optional)</label>
            <div className="flex gap-2">
              <input value={sourceUrl} onChange={e=>setSourceUrl(e.target.value)} className="w-full rounded border px-3 py-2 bg-transparent" placeholder="Drop a URL or pick a file" />
              <button onClick={pickFile} className="px-3 py-2 rounded border">Pick</button>
              <input ref={fileRef} type="file" hidden onChange={onFileChange} accept={mode==='image'?'image/*':'video/*'} />
            </div>
          </div>

          <fieldset className="grid md:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={effects.beautify} onChange={e=>setEffects({...effects, beautify:e.target.checked})} /> Beautify
            </label>

            <label className="text-sm">
              Age shift
              <input type="number" className="ml-2 w-20 rounded border bg-transparent px-2 py-1" value={effects.ageShift ?? 0} onChange={e=>setEffects({...effects, ageShift:Number(e.target.value)})} />
            </label>

            <label className="text-sm">
              Hairstyle
              <input className="ml-2 rounded border bg-transparent px-2 py-1" placeholder="long waves / short fade" value={effects.hairstyle ?? ''} onChange={e=>setEffects({...effects, hairstyle:e.target.value || null})} />
            </label>

            <label className="text-sm">
              Gender style
              <select className="ml-2 rounded border bg-transparent px-2 py-1" value={effects.genderStyle} onChange={e=>setEffects({...effects, genderStyle:e.target.value as typeof effects.genderStyle})}>
                <option value="any">Any</option><option value="female">Female</option><option value="male">Male</option><option value="neutral">Neutral</option>
              </select>
            </label>

            <label className="text-sm">
              Music
              <input className="ml-2 rounded border bg-transparent px-2 py-1" placeholder="lofi chill / energetic pop" value={effects.music ?? ''} onChange={e=>setEffects({...effects, music:e.target.value || null})} />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={effects.captions} onChange={e=>setEffects({...effects, captions:e.target.checked})} /> Captions
            </label>

            <label className="text-sm">
              Translate to
              <input className="ml-2 rounded border bg-transparent px-2 py-1" placeholder="es / fr / hi" value={effects.translateTo ?? ''} onChange={e=>setEffects({...effects, translateTo:e.target.value || null})} />
            </label>

            <label className="text-sm col-span-full">
              Gestures (comma separated)
              <input className="ml-2 rounded border bg-transparent px-2 py-1 w/full" placeholder="wink, thumbsUp, peace" value={effects.gestures.join(', ')} onChange={e=>setEffects({...effects, gestures:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
            </label>

            <label className="text-sm col-span-full">
              Avatar preset
              <input className="ml-2 rounded border bg-transparent px-2 py-1 w/full" placeholder="anime / pixar / realistic" value={effects.avatarPreset ?? ''} onChange={e=>setEffects({...effects, avatarPreset:e.target.value || null})} />
            </label>
          </fieldset>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={generate} disabled={!valid || loading} className="rounded px-4 py-2 bg-black text-white dark:bg-white dark:text-black disabled:opacity-50">{loading?'Generating…':'Generate'}</button>
          <button onClick={()=>publish(false)} className="rounded px-4 py-2 border">Publish</button>
          <button onClick={()=>publish(true)} className="rounded px-4 py-2 border" title="Enable earn-on-share (2 ZC)">Publish + Earn</button>
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold mb-3">Preview</h2>
        {previewUrl ? (
          <div className="aspect-video w-full rounded border overflow-hidden">
            <video src={previewUrl} className="w-full h-full object-cover" controls playsInline />
          </div>
        ) : (<p className="text-xs text-gray-500">No preview yet.</p>)}

        <div className="mt-4 rounded border p-3 text-sm">
          <p className="font-medium">Auto actions</p>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600 dark:text-gray-300">
            <li>Face/skin enhancement, background blur, noise cancel.</li>
            <li>Auto music & beat-sync; captions & translation.</li>
            <li>Gesture overlays and avatars (fun mode).</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

