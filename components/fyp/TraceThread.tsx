"use client";

import TraceThumbnail from "./TraceThumbnail";

export default function TraceThread({
  open,
  items,
  currentIndex,
  onClose,
  onSelect,
}: {
  open: boolean;
  items: any[];
  currentIndex: number;
  onClose: () => void;
  onSelect: (i:number)=>void;
}) {

  if (!open) return null;

  return (
    <>
      <button
        aria-label="Close Thread"
        onClick={onClose}
        className="fixed inset-0 z-[10050] bg-black/50 backdrop-blur-sm"
      />

      <div className="fixed bottom-24 left-0 right-0 z-[10060]">
        <div className="mx-auto max-w-[95vw] rounded-[2rem] border border-white/10 bg-black/65 p-5 backdrop-blur-2xl shadow-[0_0_60px_rgba(34,211,238,0.2)]">

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-cyan-100">
              Genesis Collection
            </h3>

            <button
              onClick={onClose}
              className="text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {items.map((item,index)=>(
              <TraceThumbnail
                key={item.id}
                title={item.title}
                poster={item.media.posterUrl}
                active={index===currentIndex}
                onClick={()=>{
                  onSelect(index);
                  onClose();
                }}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
