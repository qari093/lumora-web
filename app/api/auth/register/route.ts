import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(12)
    .max(128)
    .regex(/[a-z]/, "password_requires_lowercase")
    .regex(/[A-Z]/, "password_requires_uppercase")
    .regex(/[0-9]/, "password_requires_number"),
});

function json(status: number, body: unknown) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json().catch(() => null));

    if (!parsed.success) {
      return json(400, {
        ok: false,
        error: "invalid_registration_payload",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return json(409, { ok: false, error: "account_already_exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: "fan" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return json(201, { ok: true, user });
  } catch (error) {
    console.error("auth_register_failed", error);
    return json(500, { ok: false, error: "registration_failed" });
  }
}
