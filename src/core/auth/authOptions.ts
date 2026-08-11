import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

const credentialsSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(10).max(128),
});

function requireAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim();

  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_SECRET is required in production.');
  }

  return secret || 'lumora-development-auth-secret-not-for-production';
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: requireAuthSecret(),
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Lumora account',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          autocomplete: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
          autocomplete: 'current-password',
        },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            passwordHash: true,
            emailVerified: true,
          },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = typeof user.role === 'string' ? user.role : 'fan';
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.uid === 'string' ? token.uid : token.sub || '';
        session.user.role = typeof token.role === 'string' ? token.role : 'fan';
      }

      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.info('AUTH_SIGN_IN', {
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
    },
    async signOut({ token }) {
      console.info('AUTH_SIGN_OUT', {
        userId: typeof token?.uid === 'string' ? token.uid : token?.sub || null,
        timestamp: new Date().toISOString(),
      });
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: false,
};

export default authOptions;
