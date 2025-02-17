"use server";
import { prisma } from "@/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signUpSchema } from "@/lib/validations/auth";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { AuthError } from "next-auth";

export async function signUp(formData: FormData) {
  try {
    // Parse and validate the input
    const parsed = signUpSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
    });

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (existingUser) {
      return { error: "Email already exists" };
    }

    // Hash password
    const hashedPassword = await hashPassword(parsed.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        password: hashedPassword,
        name: parsed.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Handle Auth.js redirect in server action
    return await signIn("credentials", {
      email: parsed.email,
      password: parsed.password,
      redirect: false, // Prevent automatic redirect
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    if (error instanceof ZodError) {
      return { error: error.errors[0].message };
    }
    if (error instanceof AuthError) {
      return { error: "Authentication failed" };
    }
    return { error: "Something went wrong" };
  }
}
