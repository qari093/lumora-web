export type GmarCanonicalPackStatus = {
  pack: number;
  name: string;
  lockFile: string;
};

export const gmarCanonicalPacks: GmarCanonicalPackStatus[] = [
  { pack: 1, name: "Foundation", lockFile: ".gmar_pack01_foundation_lock" },
  { pack: 2, name: "Living Civilization Hub", lockFile: ".gmar_pack02_living_hub_lock" },
  { pack: 3, name: "First Echo Rite", lockFile: ".gmar_pack03_first_echo_rite_lock" },
  { pack: 4, name: "Rituals Memory Economy", lockFile: ".gmar_pack04_rituals_memory_economy_lock" },
  { pack: 5, name: "Seed Dashboard Seal", lockFile: ".gmar_pack05_seed_dashboard_seal_lock" },
  { pack: 6, name: "Mirror Hour", lockFile: ".gmar_pack06_mirror_hour_lock" },
  { pack: 7, name: "Zen Flow", lockFile: ".gmar_pack07_zen_flow_lock" },
  { pack: 8, name: "Echo Engine", lockFile: ".gmar_pack08_echo_engine_lock" },
  { pack: 9, name: "Ethical FOMO + Adrenaline", lockFile: ".gmar_pack09_fomo_adrenaline_lock" },
  { pack: 10, name: "ZenEconomy + Trust + Lonely World", lockFile: ".gmar_pack10_zeneconomy_trust_lonely_world_lock" },
  { pack: 11, name: "Dashboard/Layout Polish Seal", lockFile: ".gmar_pack11_dashboard_layout_polish_seal_lock" },
];

export function gmarPackRegistryHealthy(): boolean {
  return (
    gmarCanonicalPacks.length === 11 &&
    gmarCanonicalPacks[0].pack === 1 &&
    gmarCanonicalPacks[gmarCanonicalPacks.length - 1].pack === 11 &&
    new Set(gmarCanonicalPacks.map((pack) => pack.pack)).size === 11
  );
}
