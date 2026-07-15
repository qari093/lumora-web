import fs from "node:fs";
import { describe, expect, it } from "vitest";

const files = [
  "app/api/auth/register/route.ts",
  "app/login/LoginForm.tsx",
  "app/login/page.tsx",
  "app/signup/SignupForm.tsx",
  "app/signup/page.tsx",
];

describe("Pack 08 production auth surfaces", () => {
  it.each(files)("exists: %s", (file) => {
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.statSync(file).size).toBeGreaterThan(100);
  });

  it("uses persistent registration with hashed credentials", () => {
    const source = fs.readFileSync("app/api/auth/register/route.ts", "utf8");
    expect(source).toContain("prisma.user.create");
    expect(source).toContain("bcrypt.hash");
    expect(source).toContain("passwordHash");
    expect(source).toContain("z.object");
  });

  it("wires login and signup to credentials authentication", () => {
    const source = [
      fs.readFileSync("app/login/LoginForm.tsx", "utf8"),
      fs.readFileSync("app/signup/SignupForm.tsx", "utf8"),
    ].join("\n");

    expect(source).toContain('signIn("credentials"');
    expect(source).toContain("/api/auth/register");
    expect(source).toContain("redirect: false");
  });
});
