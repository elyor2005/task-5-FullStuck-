// src/lib/hash.ts
import bcrypt from "bcryptjs";

/** small helper functions for password hashing
 * important: use bcrypt with salt rounds adequate for dev (10)
 * note: password may be any non-empty string per task: we do not restrict length
 */
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
