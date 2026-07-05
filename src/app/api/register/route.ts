import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  // First registered user becomes admin; everyone after is consultant.
  const existing = await db.select({ id: users.id }).from(users).limit(1);
  const role = existing.length === 0 ? "admin" : "consultant";

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    await db.insert(users).values({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
    });
  } catch {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }
  return NextResponse.json({ ok: true, role });
}
