import crypto from "crypto";

const ALGO = "aes-256-cbc";
const IV_LENGTH = 16;

// Always derive a 32-byte key from COOKIE_SECRET_KEY (safe & simple)
const KEY = crypto
  .createHash("sha256")
  .update(process.env.COOKIE_SECRET_KEY || "default_secret") // fallback for safety
  .digest(); // 32 bytes

export function encrypt(data: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  // return IV + ciphertext
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(enc: string): string | null {
  try {
    const [ivHex = "", encrypted = ""] = enc.split(":"); // default values avoid undefined
    if (!ivHex || !encrypted) return null; // validation guard

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    return null;
  }
}
