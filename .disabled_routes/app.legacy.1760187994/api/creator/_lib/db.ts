export type GameStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export interface Game {
  id: string;
  title: string;
  templateId: string;
  ownerId: string;
  status: GameStatus;
  createdAt: number;
}

type DB = { games: Game[]; nextId: number };

declare global {
  // eslint-disable-next-line no-var
  var __CREATOR_DB__: DB | undefined;
}

const db: DB = globalThis.__CREATOR_DB__ ?? { games: [], nextId: 1 };
if (!globalThis.__CREATOR_DB__) globalThis.__CREATOR_DB__ = db;

export function publishGame(title: string, templateId: string, ownerId: string) {
  if (!title || !templateId || !ownerId) throw new Error("title, templateId, and ownerId are required");
  const game: Game = {
    id: String(db.nextId++),
    title,
    templateId,
    ownerId,
    status: 'PENDING',
    createdAt: Date.now(),
  };
  db.games.push(game);
  return game;
}

export function listPending() {
  return db.games.filter(g => g.status === 'PENDING').sort((a,b)=>a.createdAt-b.createdAt);
}

export function moderate(action: 'APPROVE'|'REJECT') {
  const firstPending = db.games.find(g => g.status === 'PENDING');
  if (!firstPending) return null;
  firstPending.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
  return firstPending;
}

export function listGames(ownerId?: string) {
  const base = db.games.filter(g => g.status === 'APPROVED');
  return (ownerId ? base.filter(g => g.ownerId === ownerId) : base).sort((a,b)=>a.createdAt-b.createdAt);
}
