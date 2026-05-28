import Link from "next/link";
import LumoraBrandMark from "@/components/startup/LumoraBrandMark";

const links = [
  ["FYP", "/fyp"],
  ["GMAR", "/gmar"],
  ["Live", "/live"],
  ["NEXA", "/nexa"],
  ["CineVerse", "/cineverse"],
  ["Echo", "/echo"],
  ["Zendoro", "/zendoro"]
];

export default function LumoraTopNav() {
  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <nav className="max-w-7xl mx-auto lumora-nav-pill rounded-3xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" aria-label="Lumora Home">
          <LumoraBrandMark />
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-2xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/launch-readiness"
          className="px-4 py-2 rounded-2xl bg-cyan-400/15 border border-cyan-300/20 text-cyan-100 text-sm"
        >
          Status
        </Link>
      </nav>
    </header>
  );
}
