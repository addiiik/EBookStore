"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignInSchema, SignUpSchema, SignInFormData, SignUpFormData } from "@/schemas/auth";

const isDemo = process.env.IS_DEMO === "true";
const SESSION_COOKIE_NAME = isDemo ? "demo_session" : "auth_session";

export async function signInAction(formData: SignInFormData) {
  const parsed = SignInSchema.safeParse(formData);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const message = firstIssue?.message ?? "Invalid input";

    return {
      success: false,
      message,
    };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return { success: false, message: "Invalid email or password" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { success: false, message: "Invalid email or password" };

  await createUserSession(user.id);

  return { success: true, message: "Signed in successfully" };
}

export async function signUpAction(formData: SignUpFormData) {
  const parsed = SignUpSchema.safeParse(formData);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const message = firstIssue?.message ?? "Invalid input";

    return {
      success: false,
      message,
    };
  }

  const { name, email, password, confirmPassword } = parsed.data;

  if (password != confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return { success: false, message: "Email is already used" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await createUserSession(user.id);

  return { success: true, message: "Account created successfully!" };
}

export async function removeUserSession(): Promise<{ success: boolean; message: string }> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  
  return { 
    success: true, 
    message: isDemo ? "" : "Signed out successfully" 
  };
}

export async function getCurrentSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string };
    return payload.uid;
  } catch {
    return null;
  }
}

export async function createUserSession(uid: string): Promise<{ success: boolean }> {
  const token = await generateToken(uid);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return { success: true };
}

export async function generateToken(uid: string): Promise<string> {
  return jwt.sign(
    { uid: uid },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );
}