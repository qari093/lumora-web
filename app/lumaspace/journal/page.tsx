// Location: app/lumaspace/journal/page.tsx
"use client";
import { useState } from "react";

export default function EmotionalJournalWriter() {
  const [entries, setEntries] = useState<{ mood: string; text: string; date: string }[]>([]);
  const [mood, setMood] = useState("calm");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setEntries([{ mood, text, date: new Date().toLocaleString() }, ...entries]);
    setText("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0c10] to-[#1f2833] text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Emotional Journal</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-xl">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your emotional reflection..."
          className="w-full h-32 p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
        />
        <div className="flex items-center gap-3">
          <label htmlFor="mood" className="text-sm text-gray-400">Mood:</label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md p-2 text-sm"
          >
            <option value="calm">Calm</option>
            <option value="joy">Joy</option>
            <option value="focus">Focus</option>
            <option value="curious">Curious</option>
            <option value="anxious">Anxious</option>
            <option value="neutral">Neutral</option>
          </select>
          <button
            type="submit"
            className="ml-auto bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-md text-sm font-semibold"
          >
            Save
          </button>
        </div>
      </form>

      <section className="space-y-4 max-w-xl">
        {entries.length === 0 && (
          <p className="text-gray-500 text-sm">No journal entries yet. Start by writing your thoughts.</p>
        )}
        {entries.map((entry, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border border-gray-700 bg-gray-900/60 backdrop-blur-sm shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between mb-1 text-sm text-gray-400">
              <span>{entry.date}</span>
              <span className="capitalize">{entry.mood}</span>
            </div>
            <p className="text-gray-200 whitespace-pre-wrap">{entry.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}