import { PrismaClient, PersonaAssetKind, PersonaEmotion } from "@prisma/client";

const prisma = new PrismaClient();

const PROFILE_KEY = "lumora_persona_v1";
const PROFILE_NAME = "Lumora Persona v1";
const AVATAR_COUNT = 120;

function avatarCode(i: number) {
  return `avatar_${String(i).padStart(3, "0")}`;
}

function avatarPath(i: number) {
  const code = avatarCode(i);
  return `/persona/avatars/neutral/${code}.svg`;
}

async function upsertProfile() {
  const existing = await prisma.personaProfile.findUnique({ where: { key: PROFILE_KEY } });
  if (existing) return existing;

  // first profile becomes default
  const anyDefault = await prisma.personaProfile.findFirst({ where: { isDefault: true }, select: { id: true } });
  return prisma.personaProfile.create({
    data: {
      key: PROFILE_KEY,
      name: PROFILE_NAME,
      description: "Canonical Lumora Persona pack (avatars + persona-derived reactions).",
      isDefault: !anyDefault,
    },
  });
}

async function upsertAvatars(profileId: string) {
  // Ensure 120 avatars exist
  const existing = await prisma.personaAsset.findMany({
    where: { profileId, kind: PersonaAssetKind.AVATAR },
    select: { code: true },
  });
  const have = new Set(existing.map((x) => x.code));

  const createData = [];
  for (let i = 1; i <= AVATAR_COUNT; i++) {
    const code = avatarCode(i);
    if (have.has(code)) continue;
    createData.push({
      profileId,
      kind: PersonaAssetKind.AVATAR,
      emotion: PersonaEmotion.NEUTRAL,
      code,
      label: `Avatar ${i}`,
      localPath: avatarPath(i),
      mimeType: "image/svg+xml",
      width: 512,
      height: 512,
      isActive: true,
      sortOrder: i,
      meta: { pack: PROFILE_KEY, variant: "neutral" },
    });
  }

  if (createData.length) {
    // eslint-disable-next-line no-console
    console.log(`Creating ${createData.length} missing avatars…`);
    await prisma.personaAsset.createMany({ data: createData });
  }
}

async function main() {
  const profile = await upsertProfile();
  await upsertAvatars(profile.id);

  // Auto-select default avatar for "demo" user key if app uses anon user ids
  // We keep this intentionally minimal; selection is handled by UI step later.
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
