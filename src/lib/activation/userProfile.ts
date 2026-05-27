export function getUserProfile(userId: string) {
  const id = (userId || "default").toLowerCase();

  if (id === "a") {
    return {
      userId,
      preferredSources: ["reddit", "google_trends", "rss"],
      boost: {
        reddit: 1.50,
        google_trends: 1.00,
        rss: 0.70
      }
    };
  }

  if (id === "b") {
    return {
      userId,
      preferredSources: ["rss", "google_trends", "reddit"],
      boost: {
        reddit: 0.70,
        google_trends: 1.00,
        rss: 1.50
      }
    };
  }

  return {
    userId,
    preferredSources: ["google_trends", "reddit", "rss"],
    boost: {
      reddit: 1.00,
      google_trends: 1.20,
      rss: 1.00
    }
  };
}
