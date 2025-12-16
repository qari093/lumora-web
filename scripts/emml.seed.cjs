const { PrismaClient, Prisma } = require("@prisma/client");
const db = new PrismaClient();

function getModel(name) {
  const m = Prisma?.dmmf?.datamodel?.models?.find((x) => x.name === name);
  if (!m) throw new Error(`Model not found in Prisma.dmmf: ${name}`);
  return m;
}

function modelExists(name) {
  try { getModel(name); return true; } catch { return false; }
}

function scalarFields(modelName) {
  return getModel(modelName).fields.filter((f) => f.kind === "scalar");
}

function relationFields(modelName) {
  return getModel(modelName).fields.filter((f) => f.kind === "object");
}

function requiredScalars(modelName) {
  return scalarFields(modelName)
    .filter((f) => f.isRequired)
    .filter((f) => !(f.isId && f.hasDefaultValue))
    .filter((f) => !f.hasDefaultValue);
}

function lowerSlug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function scalarValueFor(field, seed) {
  const t = field.type;
  if (t === "String") return String(seed);
  if (t === "Int") return 1;
  if (t === "BigInt") return BigInt(1);
  if (t === "Float") return 1.0;
  if (t === "Decimal") return new Prisma.Decimal("1.0");
  if (t === "Boolean") return false;
  if (t === "DateTime") return new Date();
  if (t === "Json") return {};
  if (t === "Bytes") return Buffer.from("00", "hex");
  return String(seed);
}

function buildRequiredData(modelName, overrides) {
  const req = requiredScalars(modelName);
  const data = { ...(overrides || {}) };

  for (const f of req) {
    if (data[f.name] !== undefined) continue;

    if (f.name === "slug" && data.name) {
      data.slug = lowerSlug(data.name);
      continue;
    }
    if (f.name === "symbol" && data.name) {
      data.symbol = String(data.name).toUpperCase().slice(0, 8);
      continue;
    }

    data[f.name] = scalarValueFor(f, `${modelName}_${f.name}`);
  }
  return data;
}

function hasDelegate(name) {
  return typeof db[name] !== "undefined" && typeof db[name].create === "function";
}

function delegateName(modelName) {
  return modelName[0].toLowerCase() + modelName.slice(1);
}

function requiredFKScalarNames(modelName) {
  const m = getModel(modelName);
  const rels = m.fields.filter((f) => f.kind === "object");
  const fk = new Set();
  for (const r of rels) {
    if (Array.isArray(r.relationFromFields)) {
      for (const k of r.relationFromFields) fk.add(k);
    }
  }
  return fk;
}

function connectForFK(modelName, createdByModel) {
  const rels = relationFields(modelName);
  const data = {};
  for (const r of rels) {
    const target = r.type;
    const row = createdByModel[target];
    if (!row) continue;

    if (row.id !== undefined) {
      data[r.name] = { connect: { id: row.id } };
      continue;
    }

    for (const k of ["slug", "symbol", "name"]) {
      if (row[k] !== undefined) {
        data[r.name] = { connect: { [k]: row[k] } };
        break;
      }
    }
  }
  return data;
}

function whitelistScalars(modelName, obj) {
  const allowed = new Set(scalarFields(modelName).map((f) => f.name));
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (allowed.has(k)) out[k] = v;
  }
  return out;
}

async function safeDeleteAll() {
  const del = async (delegate) => {
    if (typeof delegate?.deleteMany === "function") await delegate.deleteMany();
  };

  await del(db.emmlTick);
  await del(db.emmlSnapshot);
  await del(db.emmlAsset);
  await del(db.emmlMarket);
  await del(db.emmlIndex);
}

async function createWithFKs(modelName, overrides, createdByModel) {
  const delName = delegateName(modelName);
  if (!hasDelegate(delName)) throw new Error(`Missing Prisma delegate for ${modelName} (${delName})`);

  // Only keep scalar keys that actually exist in schema
  const cleanOverrides = whitelistScalars(modelName, overrides);

  const base = buildRequiredData(modelName, cleanOverrides);

  // Prefer nested connect over FK scalar injection when possible.
  const fkNames = requiredFKScalarNames(modelName);
  for (const k of fkNames) {
    if ((cleanOverrides || {})[k] === undefined) delete base[k];
  }

  const relConnect = connectForFK(modelName, createdByModel);

  return db[delName].create({
    data: {
      ...base,
      ...relConnect,
    },
  });
}

(async () => {
  try {
    await safeDeleteAll();

    const created = {};

    if (hasDelegate("emmlIndex") && modelExists("EmmlIndex")) {
      created.EmmlIndex = await createWithFKs("EmmlIndex", { name: "calm", slug: "calm" }, created);
    }

    if (hasDelegate("emmlMarket") && modelExists("EmmlMarket")) {
      created.EmmlMarket = await createWithFKs("EmmlMarket", { name: "global", slug: "global" }, created);
    }

    if (hasDelegate("emmlAsset") && modelExists("EmmlAsset")) {
      created.EmmlAsset = await createWithFKs("EmmlAsset", { symbol: "ZEN", name: "ZenCoin" }, created);
    }

    if (hasDelegate("emmlTick") && modelExists("EmmlTick")) {
      created.EmmlTick = await createWithFKs("EmmlTick", {}, created);
    }

    // Snapshot: ONLY pass whitelisted scalar overrides; required fields will be auto-filled.
    if (hasDelegate("emmlSnapshot") && modelExists("EmmlSnapshot")) {
      created.EmmlSnapshot = await createWithFKs(
        "EmmlSnapshot",
        {
          // Intentionally minimal + schema-safe:
          // If your schema has any of these, they will be kept; otherwise dropped by whitelist.
          health: "ok",
          composite: {},
          indicesJson: {},
          marketsJson: {},
          metaJson: {},
        },
        created
      );
    }
  } finally {
    await db.$disconnect();
  }
})();
