import { createFyp94SupplyClient } from "./clients";
import type { Fyp94RawSupplyClip, Fyp94SupplyClient } from "./contracts";

export async function searchWithFyp94SourceFallback(input: {
  clients: Fyp94SupplyClient[];
  query: string;
  limit: number;
}): Promise<Fyp94RawSupplyClip[]> {
  const results: Fyp94RawSupplyClip[] = [];

  for (const client of input.clients) {
    try {
      const found = await client.search({
        query: input.query,
        limit: Math.max(1, Math.ceil(input.limit / input.clients.length)),
      });
      results.push(...found);
      if (results.length >= input.limit) break;
    } catch {
      continue;
    }
  }

  if (results.length > 0) return results.slice(0, input.limit);

  return createFyp94SupplyClient("lumora_owned").search({
    query: input.query,
    limit: input.limit,
  });
}
