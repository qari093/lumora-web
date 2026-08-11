import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { authOptions } from '@/src/core/auth/authOptions';

export type AdminPageIdentity = {
  userId: string;
  email: string;
  name: string | null;
  role: 'admin';
};

export async function requireAdminPageSession(callbackUrl: string): Promise<AdminPageIdentity> {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id?.trim() ?? '';
  const sessionEmail = session?.user?.email?.trim().toLowerCase() ?? '';

  if (!userId || !sessionEmail) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
    },
  });

  if (
    !user ||
    user.email.toLowerCase() !== sessionEmail ||
    user.role !== 'admin' ||
    !user.emailVerified
  ) {
    redirect(`/login?error=admin_required&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return {
    userId: user.id,
    email: user.email.toLowerCase(),
    name: user.name,
    role: 'admin',
  };
}
