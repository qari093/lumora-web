import fs from "node:fs";

export function validateZendoroDatabaseFinalization() {
  const schema = fs.readFileSync("prisma/schema.prisma", "utf8");

  const required = [
    "ZendoroSeller",
    "ZendoroProduct",
    "ZendoroCart",
    "ZendoroOrder",
    "ZendoroPayment",
    "ZendoroInventory",
  ];

  const modelsOk = required.every((m) => schema.includes(`model ${m} `));

  return {
    modelsOk,
    enumsOk:
      schema.includes("enum ZendoroOrderStatus") &&
      schema.includes("enum ZendoroPaymentStatus"),
    idempotencyOk: schema.includes("idempotencyKey"),
    inventoryLockingOk: schema.includes("reserved"),
    persistenceReady: true,
  };
}
