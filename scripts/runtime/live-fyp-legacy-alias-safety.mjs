const BASE_URL = process.env.LUMORA_PROD_URL || "https://lumoraverse.io";

const checks = [
  { group: "fypLegacy", name: "fyp94Feed", path: "/api/fyp94/feed", expected: [200, 301, 302, 307, 308, 404] },
  { group: "fypLegacy", name: "fyp94Health", path: "/api/fyp94/health", expected: [200, 301, 302, 307, 308, 404] },
  { group: "fypLegacy", name: "feedRoot", path: "/api/feed", expected: [200, 204, 301, 302, 307, 308, 400, 404] },
  { group: "fypLegacy", name: "feedMix", path: "/api/feed/mix", expected: [200, 204, 301, 302, 307, 308, 400, 404] },

  { group: "liveAlias", name: "liveRoom", path: "/api/live/room", expected: [200, 204, 301, 302, 307, 308, 400, 404] },
  { group: "liveAlias", name: "liveRoomList", path: "/api/live/room-list", expected: [200, 204, 301, 302, 307, 308, 400, 404] },
  { group: "liveAlias", name: "liveRoomlist", path: "/api/live/roomlist", expected: [200, 204, 301, 302, 307, 308, 400, 404] },
  { group: "liveAlias", name: "liveRoomsList", path: "/api/live/rooms-list", expected: [200, 204, 301, 302, 307, 308, 400, 404] },
  { group: "liveAlias", name: "liveRoomsNestedList", path: "/api/live/rooms/list", expected: [200, 204, 301, 302, 307, 308, 400, 404] },
  { group: "liveAlias", name: "liveRoomsPublic", path: "/api/live/rooms/public", expected: [200, 204, 301, 302, 307, 308, 400, 404, 410] }
];

const results = [];

for (const check of checks) {
  const started = Date.now();
  const url = `${BASE_URL}${check.path}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: {
        "accept": "*/*",
        "user-agent": "LumoraLiveFypAliasSafety/1.0"
      }
    });

    const text = await response.text();

    results.push({
      ...check,
      url,
      status: response.status,
      bytes: text.length,
      ms: Date.now() - started,
      ok: check.expected.includes(response.status) && response.status < 500
    });
  } catch (error) {
    results.push({
      ...check,
      url,
      status: 0,
      bytes: 0,
      ms: Date.now() - started,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

const report = {
  checkedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  status: results.every((r) => r.ok) ? "PASS" : "FAIL",
  results
};

console.log(JSON.stringify(report, null, 2));
if (report.status !== "PASS") process.exitCode = 1;
