import express from "express";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4001;
const ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const TREASURY = process.env.TREASURY_USER_ID || "treasury";
const CREATOR_SPLIT_BPS = parseInt(process.env.CREATOR_SPLIT_BPS || "9000", 10);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dev-admin";

const io = new Server(server, { cors: { origin: ORIGIN, credentials: true } });

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(morgan("tiny"));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.set("trust proxy", 1);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 2000 }));

/* helpers */
const TOKENS = { ZC: "ZC", ZCPLUS: "ZCPLUS" };
const valueToZC = (v) => v;

async function ensureWallet(userId, token) {
  return prisma.wallet.upsert({
    where: { userId_token: { userId, token } },
    update: {},
    create: { userId, token, balance: 0 }
  });
}
async function writeLedger({ userId, token, type, amount, reason, roomSlug, meta }) {
  return prisma.ledgerEntry.create({ data: { userId, token, type, amount, reason, roomSlug, meta } });
}
async function credit(userId, token, amount, reason, roomSlug, meta) {
  await ensureWallet(userId, token);
  await prisma.wallet.update({ where: { userId_token: { userId, token } }, data: { balance: { increment: amount } } });
  await writeLedger({ userId, token, type: "credit", amount, reason, roomSlug, meta });
}
async function debit(userId, token, amount, reason, roomSlug, meta) {
  await ensureWallet(userId, token);
  await prisma.wallet.update({ where: { userId_token: { userId, token } }, data: { balance: { decrement: amount } } });
  await writeLedger({ userId, token, type: "debit", amount, reason, roomSlug, meta });
}
function requireAdmin(req, res, next) {
  if ((req.headers["x-admin-token"] || "") !== ADMIN_TOKEN) return res.status(401).json({ ok:false, error:"unauthorized" });
  next();
}

/* health */
app.get("/health", (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

/* room totals */
app.get("/api/rooms/:slug/ledger", async (req, res) => {
  const slug = req.params.slug;
  const totals = await prisma.gift.aggregate({ where: { roomSlug: slug }, _count: { _all: true }, _sum: { value: true } });
  res.json({ totalGifts: totals._count._all || 0, totalValue: totals._sum.value || 0 });
});

/* admin list rooms */
app.get("/api/admin/rooms", requireAdmin, async (_req, res) => {
  const rooms = await prisma.room.findMany({ orderBy: { createdAt: "desc" } });
  const enriched = [];
  for (const r of rooms) {
    const totals = await prisma.gift.aggregate({ where: { roomSlug: r.slug }, _count: { _all: true }, _sum: { value: true } });
    enriched.push({ slug: r.slug, createdAt: r.createdAt, gifts: totals._count._all || 0, value: totals._sum.value || 0 });
  }
  res.json({ rooms: enriched });
});

/* nft mock mint */
app.post("/api/nft/mint", async (req, res) => {
  try {
    const { streamId, timestamp, metadata } = req.body || {};
    const roomSlug = streamId || "main-room";
    await prisma.room.upsert({ where: { slug: roomSlug }, update: {}, create: { slug: roomSlug } });
    const rarity = ["common","rare","epic","legendary"][Math.floor(Math.random()*4)];
    const nft = await prisma.nft.create({ data: { roomSlug, rarity, meta: metadata || { t: timestamp || Date.now() } } });
    io.to(roomSlug).emit("nftMinted", { nft, message: "NFT minted" });
    res.json({ success: true, nft });
  } catch (e) { console.error(e); res.status(500).json({ success: false, error: "mint_failed" }); }
});

/* economy apis */
app.get("/api/economy/wallet/:userId", async (req, res) => {
  const wallets = await prisma.wallet.findMany({ where: { userId: req.params.userId } });
  res.json({ userId: req.params.userId, wallets });
});
app.get("/api/economy/ledger/:userId", async (req, res) => {
  const entries = await prisma.ledgerEntry.findMany({ where: { userId: req.params.userId }, orderBy: { ts: "desc" }, take: 200 });
  res.json({ userId: req.params.userId, entries });
});
app.post("/api/admin/settle/:room", requireAdmin, async (req, res) => {
  const slug = req.params.room, user = `creator:${slug}`, token = TOKENS.ZC;
  await ensureWallet(user, token);
  const fresh = await prisma.wallet.findUnique({ where: { userId_token: { userId: user, token } } });
  const bal = fresh?.balance || 0;
  if (bal <= 0) return res.json({ ok: true, settled: 0 });
  await debit(user, token, bal, "payout", slug, { to: "external" });
  res.json({ ok: true, settled: bal });
});

/* sockets */
io.on("connection", (socket) => {
  socket.on("join", async ({ room }) => {
    const slug = room || "main-room";
    socket.join(slug);
    await prisma.room.upsert({ where: { slug }, update: {}, create: { slug } });
    socket.emit("joined", { room: slug });
  });
  socket.on("canvasStroke", ({ room, stroke }) => io.to(room || "main-room").emit("canvasStroke", { stroke }));
  socket.on("sendGift", async ({ room, sender, giftType }) => {
    const slug = room || "main-room";
    const valueTable = { Sparkle:10, Firestorm:50, Diamond:100, Phoenix:500, Galaxy:1000, Dragon:2000 };
    const value = valueTable[giftType] || 10;
    await prisma.gift.create({ data: { roomSlug: slug, sender: sender || "Guest", giftType, value } });
    const totals = await prisma.gift.aggregate({ where: { roomSlug: slug }, _count: { _all: true }, _sum: { value: true } });

    const creator = `creator:${slug}`, zcAmount = valueToZC(value);
    const toCreator = Math.floor((zcAmount * CREATOR_SPLIT_BPS) / 10000);
    const toTreasury = zcAmount - toCreator;
    await ensureWallet(creator, TOKENS.ZC);
    await ensureWallet(TREASURY, TOKENS.ZC);
    await credit(creator, TOKENS.ZC, toCreator, "gift_credit", slug, { giftType, sender });
    await credit(TREASURY, TOKENS.ZC, toTreasury, "gift_treasury", slug, { giftType, sender });

    io.to(slug).emit("giftReceived", { sender: sender || "Guest", giftType, ledger: { total: totals._count._all || 0, value: totals._sum.value || 0 } });
  });
});

server.listen(PORT, () => console.log(`Live server on http://localhost:${PORT}`));
