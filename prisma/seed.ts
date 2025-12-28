import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('Seed: noop (nothing to insert)');
}
main().finally(() => prisma.$disconnect());

// Persona seed
await import('./seed/persona');
