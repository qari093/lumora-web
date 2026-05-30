export function validateSpark(v: any): boolean {
  return !!v && typeof v.id === "string";
}
export const validateLumaSpark = validateSpark;

export function createSparkRenderPlan(spark: any, lowPower = false) {
  if (!validateSpark(spark)) throw new Error("invalid_luma_spark");
  return { sparkId: spark.id, lowPower, layers: lowPower ? 1 : 2 };
}

export function validateSparkStorageRecord(v: any): boolean {
  return !!v && (typeof v.sparkId === "string" || typeof v.id === "string");
}
export function createSparkStorageRecord(spark: any = { id: "spark_001" }) {
  const record = { id: "spark_storage_001", sparkId: spark.id ?? "spark_001", durable: true };
  return record;
}

export function createSparkEcho(sparkId = "spark_001", resonance = 0.8) {
  return { id: "spark_echo_001", sparkId, resonance, active: true };
}
export function validateSparkEcho(v: any): boolean {
  return !!v && typeof v.id === "string";
}
export function createSparkStitch(ids = ["spark_001", "spark_002"]) {
  return { id: "spark_stitch_001", ids, count: ids.length, active: true };
}
export function runSparkRuntime() {
  return { active: true, count: 2, echo: createSparkEcho("spark_001", 0.8), stitch: createSparkStitch() };
}
export function validateSparkRuntime(v: any): boolean {
  return !!v && v.active === true && typeof v.count === "number";
}
