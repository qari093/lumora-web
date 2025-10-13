type Item = {
  id: string;
  author: string;
  handle: string;
  text: string;
  likes: number;
  comments: number;
  shares: number;
  video: string;      // video URL (public or remote)
  thumb?: string;     // poster image (optional)
};

declare global {
  // eslint-disable-next-line no-var
  var __FYP_STORE__: { items: Item[] } | undefined;
}

function seed(): Item[] {
  // You can swap these with your own /public/videos/*.mp4 later
  return [
    {
      id: "1",
      author: "Alex",
      handle: "@alex",
      text: "Morning vibes — quick workflow tips.",
      likes: 221, comments: 18, shares: 6,
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumb: "https://picsum.photos/id/1015/800/1200"
    },
    {
      id: "2",
      author: "Maya",
      handle: "@maya",
      text: "Behind the scenes of the studio setup.",
      likes: 143, comments: 22, shares: 9,
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumb: "https://picsum.photos/id/1016/800/1200"
    },
    {
      id: "3",
      author: "Zed",
      handle: "@zed",
      text: "Quick color grading trick for shorts.",
      likes: 412, comments: 31, shares: 11,
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumb: "https://picsum.photos/id/1021/800/1200"
    },
    {
      id: "4",
      author: "Lina",
      handle: "@lina",
      text: "Minimal desk tour 🧼",
      likes: 97, comments: 8, shares: 2,
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumb: "https://picsum.photos/id/1005/800/1200"
    },
    {
      id: "5",
      author: "Omar",
      handle: "@omar",
      text: "Lens comparison: 24mm vs 35mm",
      likes: 305, comments: 26, shares: 7,
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumb: "https://picsum.photos/id/1006/800/1200"
    },
    {
      id: "6",
      author: "Yuki",
      handle: "@yuki",
      text: "Animating with constraints in 20s",
      likes: 188, comments: 14, shares: 3,
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumb: "https://picsum.photos/id/1019/800/1200"
    },
    {
      id: "7",
      author: "Kira",
      handle: "@kira",
      text: "SFX on a budget 💸",
      likes: 264, comments: 21, shares: 10,
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      thumb: "https://picsum.photos/id/1027/800/1200"
    },
    {
      id: "8",
      author: "Jax",
      handle: "@jax",
      text: "Shortcuts for speed editing",
      likes: 156, comments: 12, shares: 4,
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      thumb: "https://picsum.photos/id/1039/800/1200"
    }
  ];
}

export type { Item };

export function getStore() {
  if (!global.__FYP_STORE__) {
    global.__FYP_STORE__ = { items: seed() };
  }
  return global.__FYP_STORE__;
}
