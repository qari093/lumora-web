import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TAGS = [
  { slug: "mind-open", label: "Mind Open", category: "AWE", intensity: 4 },
  { slug: "plot-twist", label: "Plot Twist", category: "AWE", intensity: 4 },
  { slug: "unreal", label: "Unreal", category: "AWE", intensity: 4 },
  { slug: "wholesome", label: "Wholesome", category: "WARMTH", intensity: 4 },
  { slug: "pure", label: "Pure", category: "WARMTH", intensity: 3 },
  { slug: "respect", label: "Respect", category: "WARMTH", intensity: 3 },
  { slug: "vibing", label: "Vibing", category: "ENERGY", intensity: 3 },
  { slug: "savage", label: "Savage", category: "ENERGY", intensity: 3 },
  { slug: "thats-deep", label: "That’s Deep", category: "INSIGHT", intensity: 4 },
  { slug: "rewatch-worthy", label: "Rewatch Worthy", category: "INSIGHT", intensity: 3 },
];

async function main() {
  for (const t of TAGS) {
    await prisma.vibeTag.upsert({
      where: { slug: t.slug },
      update: { label: t.label, category: t.category, intensity: t.intensity, rarity: "CORE" },
      create: { slug: t.slug, label: t.label, category: t.category, intensity: t.intensity, rarity: "CORE" },
    });
  }
}
main().then(async () => {
  await prisma.$disconnect();
  console.log("✓ Seeded core vibe tags");
}).catch(async (e) => {
  console.error("❌ seed failed:", e);
  await prisma.$disconnect();
  process.exit(1);
});
