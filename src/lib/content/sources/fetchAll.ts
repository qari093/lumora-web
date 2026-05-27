import { fetchInternetArchive } from "./internetArchive";
import { fetchNASA } from "./nasa";
import { fetchPexels } from "./pexels";

export async function fetchAllSources() {
  const [ia, nasa, pexels] = await Promise.all([
    fetchInternetArchive(),
    fetchNASA(),
    fetchPexels()
  ]);

  return [...ia, ...nasa, ...pexels];
}
