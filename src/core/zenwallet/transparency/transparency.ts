export type IntegrityRoot = {
  root: string;
  signedAt: string;
  publishedTo: "rekor" | "github_mirror";
  signature: string;
};

const roots: IntegrityRoot[] = [];

export function createDailyIntegrityRoot(entries: string[]): IntegrityRoot {
  const root = `root_${entries.join("_").length}_${entries.length}`;
  const payload: IntegrityRoot = {
    root,
    signedAt: new Date().toISOString(),
    publishedTo: "rekor",
    signature: `sig_${root}`,
  };
  roots.push(payload);
  return payload;
}

export function verifyIntegrityRoot(root: string, signature: string) {
  return signature === `sig_${root}`;
}

export function getTransparencyRoots() {
  return roots;
}
