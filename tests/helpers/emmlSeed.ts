import { readFileSync } from "node:fs";
import { Prisma, PrismaClient } from "@prisma/client";

type ModelName = "EmmlIndex" | "EmmlMarket" | "EmmlAsset" | "EmmlTick";

type ScalarKind =
  | "String"
  | "Int"
  | "BigInt"
  | "Boolean"
  | "DateTime"
  | "Float"
  | "Decimal"
  | "Json"
  | "Bytes";

type FieldSpec = {
  name: string;
  type: ScalarKind;
  optional: boolean;
  isArray: boolean;
  hasDefault: boolean;
};

function isScalar(t: string): t is ScalarKind {
  return (
    t === "String" ||
    t === "Int" ||
    t === "BigInt" ||
    t === "Boolean" ||
    t === "DateTime" ||
    t === "Float" ||
    t === "Decimal" ||
    t === "Json" ||
    t === "Bytes"
  );
}

function parseModelBlock(schemaText: string, modelName: ModelName): FieldSpec[] {
  const re = new RegExp(String.raw`model\s+${modelName}\s*\{([\s\S]*?)\n\}`, "m");
  const m = schemaText.match(re);
  if (!m) return [];
  const body = m[1] || "";
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("//"));

  const out: FieldSpec[] = [];
  for (const line of lines) {
    // Skip block attributes and model attributes.
    if (line.startsWith("@@") || line.startsWith("@")) continue;

    // Field line: <name> <type>[?][[]] ...attrs
    // Example: id String @id @default(cuid())
    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;

    const name = parts[0];
    let typeToken = parts[1];

    const isArray = typeToken.endsWith("[]");
    if (isArray) typeToken = typeToken.slice(0, -2);

    const optional = typeToken.endsWith("?");
    if (optional) typeToken = typeToken.slice(0, -1);

    if (!isScalar(typeToken)) continue;

    const hasDefault = line.includes("@default(") || line.includes("@updatedAt") || line.includes("@id");

    out.push({ name, type: typeToken, optional, isArray, hasDefault });
  }
  return out;
}

function stableId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function scalarValue(spec: FieldSpec): any {
  switch (spec.type) {
    case "String":
      return stableId(spec.name);
    case "Int":
      return 1;
    case "BigInt":
      return BigInt(1);
    case "Boolean":
      return false;
    case "DateTime":
      return new Date();
    case "Float":
      return 1.0;
    case "Decimal":
      return new Prisma.Decimal("1.0");
    case "Json":
      return { ok: true, field: spec.name };
    case "Bytes":
      return Buffer.from("seed");
    default:
      return null;
  }
}

function buildRequiredData(
  fields: FieldSpec[],
  overrides: Record<string, any> = {}
): Record<string, any> {
  const data: Record<string, any> = {};
  for (const f of fields) {
    if (f.isArray) continue;
    if (f.optional) continue;
    if (f.hasDefault) continue;
    if (Object.prototype.hasOwnProperty.call(overrides, f.name)) continue;
    data[f.name] = scalarValue(f);
  }
  for (const [k, v] of Object.entries(overrides)) data[k] = v;
  return data;
}

export async function ensureEmmlSeed(): Promise<{ seeded: boolean; reason?: string }> {
  const prisma = new PrismaClient();
  try {
    // Quick exit if already seeded.
    const [i, m, a, t] = await Promise.all([
      prisma.emmlIndex.count().catch(() => 0),
      prisma.emmlMarket.count().catch(() => 0),
      prisma.emmlAsset.count().catch(() => 0),
      prisma.emmlTick.count().catch(() => 0),
    ]);
    if (i > 0 && m > 0 && a > 0 && t > 0) return { seeded: false, reason: "already_seeded" };

    const schema = readFileSync("prisma/schema.prisma", "utf8");

    const indexFields = parseModelBlock(schema, "EmmlIndex");
    const marketFields = parseModelBlock(schema, "EmmlMarket");
    const assetFields = parseModelBlock(schema, "EmmlAsset");
    const tickFields = parseModelBlock(schema, "EmmlTick");

    if (!indexFields.length || !marketFields.length || !assetFields.length || !tickFields.length) {
      return { seeded: false, reason: "missing_model_blocks_in_schema" };
    }

    // Create minimal chain. We do not assume any specific field names beyond required scalars.
    // However, many schemas require foreign keys like marketId/assetId/indexId.
    // We will create base rows first, then attempt to create dependent rows with best-effort FK fills.
    const indexBase = buildRequiredData(indexFields, {});
    const marketBase = buildRequiredData(marketFields, {});
    const assetBase = buildRequiredData(assetFields, {});
    const tickBase = buildRequiredData(tickFields, {});

    const createdIndex = await prisma.emmlIndex.create({ data: indexBase as any }).catch(async (e) => {
      // If unique collisions happen, retry once with different values.
      const retry = buildRequiredData(indexFields, {});
      return prisma.emmlIndex.create({ data: retry as any });
    });

    const createdMarket = await prisma.emmlMarket.create({ data: marketBase as any }).catch(async () => {
      const retry = buildRequiredData(marketFields, {});
      return prisma.emmlMarket.create({ data: retry as any });
    });

    // Attempt to satisfy common FK names on asset/tick using created ids.
    const assetOverrides: Record<string, any> = {};
    for (const k of ["marketId", "emmlMarketId", "market_id"]) assetOverrides[k] = (createdMarket as any).id;
    for (const k of ["indexId", "emmlIndexId", "index_id"]) assetOverrides[k] = (createdIndex as any).id;

    let createdAsset: any;
    try {
      createdAsset = await prisma.emmlAsset.create({ data: buildRequiredData(assetFields, assetOverrides) as any });
    } catch {
      // Try without overrides if schema doesn't have those keys.
      createdAsset = await prisma.emmlAsset.create({ data: buildRequiredData(assetFields, {}) as any });
    }

    const tickOverrides: Record<string, any> = {};
    for (const k of ["marketId", "emmlMarketId", "market_id"]) tickOverrides[k] = (createdMarket as any).id;
    for (const k of ["assetId", "emmlAssetId", "asset_id"]) tickOverrides[k] = (createdAsset as any).id;
    for (const k of ["indexId", "emmlIndexId", "index_id"]) tickOverrides[k] = (createdIndex as any).id;

    try {
      await prisma.emmlTick.create({ data: buildRequiredData(tickFields, tickOverrides) as any });
    } catch {
      await prisma.emmlTick.create({ data: buildRequiredData(tickFields, {}) as any });
    }

    return { seeded: true };
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "seed_failed";
    return { seeded: false, reason: msg };
  } finally {
    await prisma.$disconnect().catch(() => void 0);
  }
}
