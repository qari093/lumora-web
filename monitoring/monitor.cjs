const https = require("https");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("./monitoring/endpoints.json", "utf8"));
const BASE = "https://lumoraverse.io";

function check(endpoint) {
  return new Promise((resolve) => {
    const start = Date.now();
    https.get(BASE + endpoint, (res) => {
      const duration = Date.now() - start;
      if (res.statusCode === 200) {
        console.log(`✓ ${endpoint} (${duration}ms)`);
      } else {
        console.error(`❌ ${endpoint} status=${res.statusCode}`);
      }
      resolve();
    }).on("error", () => {
      console.error(`❌ ${endpoint} unreachable`);
      resolve();
    });
  });
}

(async () => {
  for (const ep of config.endpoints) {
    await check(ep);
  }
})();
