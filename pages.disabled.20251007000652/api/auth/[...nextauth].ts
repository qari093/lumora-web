import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/src/lib/db";
import bcrypt from "bcrypt";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const handler = NextAuth({
    session: { strategy: "jwt" },
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(creds) {
          const email = (creds?.email || "").toLowerCase().trim();
          const pw = creds?.password || "";
          if (!email || !pw) return null;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.passwordHash) return null;
          const ok = await bcrypt.compare(pw, user.passwordHash);
          if (!ok) return null;
          return { id: user.id, email: user.email, name: user.name || user.email };
        },
      }),
    ],
    pages: {
      signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
  return handler(req, res);
}
