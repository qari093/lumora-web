import { ingestNasa, ingestEsa } from "./nasa_esa";
import { ingestStock } from "./stock";
import { SourceClip } from "./types";

export async function ingestAll(): Promise<SourceClip[]> {
  const [nasa, esa, stock] = await Promise.all([
    ingestNasa(),
    ingestEsa(),
    ingestStock()
  ]);

  return [...nasa, ...esa, ...stock];
}
