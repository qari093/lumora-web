import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("persona manifest", () => {
  it("exposes the canonical Step 23 persona asset contract", () => {
    const p = path.join(
      process.cwd(),
      "public",
      "persona",
      "manifest.json",
    );

    expect(fs.existsSync(p)).toBe(true);

    const json = JSON.parse(fs.readFileSync(p, "utf8"));

    expect(json.ok).toBe(true);

    expect(json.counts).toBeTruthy();
    expect(json.counts.emojis).toBe(480);
    expect(json.counts.avatars).toBe(840);
    expect(json.counts.avatarsNeutral).toBe(120);

    expect(Array.isArray(json.entries)).toBe(true);

    expect(Array.isArray(json.emojis)).toBe(true);
    expect(json.emojis).toHaveLength(480);

    expect(json.emojis[0]).toEqual({
      id: "emoji_001",
      url: "/persona/emojis/emoji_001.png",
    });

    expect(json.emojis[479]).toEqual({
      id: "emoji_480",
      url: "/persona/emojis/emoji_480.png",
    });

    for (const emoji of json.emojis) {
      expect(emoji.id).toMatch(/^emoji_\d{3}$/);
      expect(emoji.url).toMatch(
        /^\/persona\/emojis\/emoji_\d{3}\.png$/,
      );
    }
  });
});
