import fs from "node:fs";
import { describe, expect, it } from "vitest";

const requiredFiles = [
  "src/core/auth/authOptions.ts",
  "app/api/auth/[...nextauth]/route.ts",
  "types/next-auth.d.ts",
  "core/auth/session-runtime.ts",
  "prisma/schema.prisma",
];

describe("Pack 08 NextAuth production foundation", () => {
  it.each(requiredFiles)("exists: %s", (file) => {
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.statSync(file).size).toBeGreaterThan(0);
  });

  it("wires NextAuth to canonical auth options", () => {
    const source = fs.readFileSync(
      "app/api/auth/[...nextauth]/route.ts",
      "utf8",
    );

    expect(source).toContain("NextAuth(authOptions)");
    expect(source).toContain("handler as GET");
    expect(source).toContain("handler as POST");
  });

  it("uses PrismaAdapter and credentials authorization", () => {
    const source = fs.readFileSync(
      "src/core/auth/authOptions.ts",
      "utf8",
    );

    expect(source).toContain("PrismaAdapter(prisma)");
    expect(source).toContain("CredentialsProvider");
    expect(source).toContain("async authorize");
    expect(source).toContain("bcrypt.compare");
    expect(source).toContain('strategy: "jwt"');
  });

  it("extends Session, User, and JWT identity types", () => {
    const source = fs.readFileSync("types/next-auth.d.ts", "utf8");

    expect(source).toContain("interface Session");
    expect(source).toContain("interface User");
    expect(source).toContain("interface JWT");
    expect(source).toContain("uid");
    expect(source).toContain("role");
  });

  it("has Prisma models required by the auth adapter", () => {
    const schema = fs.readFileSync("prisma/schema.prisma", "utf8");

    for (const model of ["User", "Account", "Session", "VerificationToken"]) {
      expect(schema).toContain(`model ${model} {`);
    }

    expect(schema).toContain("passwordHash");
    expect(schema).toContain("sessionToken");
  });
});
