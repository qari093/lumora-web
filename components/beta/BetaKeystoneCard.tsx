import { createBetaKeystone } from "@/lib/beta/betaKeystone";

export default function BetaKeystoneCard() {
  const keystone = createBetaKeystone("founder-preview");

  return (
    <section className="lumora-portal-card p-6">
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Private Beta</p>
      <h2 className="mt-4 text-3xl font-black">{keystone.title}</h2>
      <p className="mt-4 text-white/65">
        A permanent founding artifact for early users who help shape Lumora’s emotional civilization.
      </p>
      <div className="mt-6 text-cyan-200 font-semibold">Artifact: {keystone.artifact}</div>
    </section>
  );
}
