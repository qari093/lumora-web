export type WatchSession = {
  filmId: string;
  provider: string;
  embeddable: boolean;
};

export function createWatchSession(session: WatchSession) {
  return {
    ...session,
    started: true,
    immersiveMode: true,
  };
}

export function canPlayFilm(session: WatchSession) {
  return session.embeddable === true;
}
