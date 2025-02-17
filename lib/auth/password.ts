import { hash, verify } from "@node-rs/argon2";

// Use Web Crypto API for hashing (available in Edge runtime and Node.js)
export async function hashPassword(password: string): Promise<string> {
  // Argon2 configuration
  const hashedPassword = await hash(password, {
    memoryCost: 65536, // Memory usage in KiB (64 MB)
    timeCost: 3, // Number of iterations
    parallelism: 4, // Degree of parallelism
  });

  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await verify(hashedPassword, password);
}
