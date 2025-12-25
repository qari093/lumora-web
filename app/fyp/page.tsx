// /fyp (App Router)
export const dynamic = "force-dynamic";

export default function FYPPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      <h1 className="text-3xl font-semibold mt-10">For You</h1>

      <div className="mt-10 w-full max-w-md space-y-6 px-4">
        <div className="h-[420px] rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400">
          Demo Feed Item #1
        </div>
        <div className="h-[420px] rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400">
          Demo Feed Item #2
        </div>
        <div className="h-[420px] rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400">
          Demo Feed Item #3
        </div>
      </div>
    </main>
  );
}
