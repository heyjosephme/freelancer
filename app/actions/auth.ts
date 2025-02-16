"use server";

import { prisma } from "@/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signUpSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

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

    redirect("/signin");
  } catch (error) {
    if (error.name === "ZodError") {
      return { error: error.errors[0].message };
    }
    return { error: "Something went wrong" };
  }
}
