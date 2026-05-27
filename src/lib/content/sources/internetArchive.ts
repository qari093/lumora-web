export async function fetchInternetArchive() {
  try {
    const url = "https://archive.org/advancedsearch.php?q=mediatype:movies+AND+licenseurl:(*creativecommons.org/publicdomain*)&output=json&rows=10";
    const res = await fetch(url, { timeout: 10000 });
    const json: any = await res.json();

    return (json.response?.docs || []).map((d: any) => ({
      id: d.identifier,
      title: d.title,
      source: "Internet Archive",
      license: "public domain",
      hasAudio: true,
      playableUrl: `https://archive.org/download/${d.identifier}/${d.identifier}.mp4`
    }));
  } catch {
    return [];
  }
}
