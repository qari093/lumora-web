import type {
  CosmosStar,
  CosmosCluster,
  CosmosRuntime
} from "../types";

export function validateCosmosStar(
  star: CosmosStar
): boolean {
  return Boolean(
    star.id &&
    star.resonance
  );
}

export function validateCosmosCluster(
  cluster: CosmosCluster
): boolean {
  return Boolean(
    cluster.id &&
    cluster.stars > 0
  );
}

export function validateCosmosRuntime(
  runtime: CosmosRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.clusterId
  );
}
