// Use Web Crypto API for hashing (available in Edge runtime)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // SHA-256 for password hashing
  const hash = await crypto.subtle.digest("SHA-256", data);

  // Convert hash to base64 string
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

// We don't need verifyPassword anymore since we'll compare hashes directly
