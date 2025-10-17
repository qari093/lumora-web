import prisma from "../src/lib/db";
import bcrypt from "bcrypt";

async function main() {
  const pass = await bcrypt.hash("lumora123", 10);
  const u1 = await prisma.user.upsert({
    where: { email: "host@lumora.app" },
    update: { passwordHash: pass },
    create: { email: "host@lumora.app", name: "Lumora Host", passwordHash: pass },
  });
  const u2 = await prisma.user.upsert({
    where: { email: "member@lumora.app" },
    update: { passwordHash: pass },
    create: { email: "member@lumora.app", name: "Lumora Member", passwordHash: pass },
  });

  const room = await prisma.room.upsert({
    where: { slug: "main-room" },
    update: {},
    create: { slug: "main-room", title: "Lumora Live — Main Room", hostId: u1.id, isPrivate: false },
  });

  await prisma.roomMember.upsert({
    where: { userId_roomId: { userId: u1.id, roomId: room.id } },
    update: { role: "HOST" },
    create: { userId: u1.id, roomId: room.id, role: "HOST" },
  });
  await prisma.roomMember.upsert({
    where: { userId_roomId: { userId: u2.id, roomId: room.id } },
    update: {},
    create: { userId: u2.id, roomId: room.id, role: "PARTICIPANT" },
  });

  console.log("✅ Seeded users with password: lumora123");
}
main().then(()=>prisma.$disconnect()).catch(async e=>{ console.error(e); await prisma.$disconnect(); process.exit(1); });
